import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";
import { z } from "zod";
import { COMPANY_KNOWLEDGE, PACKAGE_DOCS } from "@/lib/knowledge.server";
import { tours } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const Body = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(24),
});

const PERSONA = `# WHO YOU ARE
You are "Pema", the human-like travel consultant for Golden Takin Holidays, a TCB-licensed tour operator in Thimphu, Bhutan. You are NOT a search engine and NOT an FAQ bot — you are having a real conversation with a guest who is thinking about visiting Bhutan.

# HOW YOU TALK
- Warm, personal and concise. Greet new guests once ("Kuzuzangpo la!"), then just talk normally.
- 2-5 short sentences or a few bullets per reply. Never dump long documents or repeat keyword lists.
- Always move the conversation forward: end most replies with ONE natural follow-up question (dates? how many travellers? culture, nature, trekking or wellness? travelling with kids or elders? budget style?).
- Remember and use everything the guest already told you in this conversation — never re-ask what they answered.
- Mirror the guest's language (English or Hindi/Hinglish) and keep it human, never robotic.

# HOW YOU HELP
- When you have even a rough idea of their interests, recommend 1-3 specific packages BY NAME with duration and indicative per-person price, and give the page link (e.g. /tours/honeymoon-trips).
- Explain what a day actually feels like, seasons, altitude, driving times, food, culture etiquette — like a guide who lives there.
- Answer visa/permit/SDF questions precisely from the knowledge base.
- If we can customise, say so — we build private itineraries for any theme.
- When the guest seems ready, invite them to send an inquiry on the package page, or reach 24/7 WhatsApp +91-8514889385, Bhutan HQ +975-1797-0050, UK Desk +44-7586203728, Australia +61-404-343-370, or email info@goldentakinholidays.bt / support@goldentakinholidays.bt. Promo code for UK & global travelers: WSUKSU26. Do not push it in every message.

# RULES
- Only use facts from the knowledge base below. Never invent prices, hotels, coupon codes or packages we do not sell.
- If something isn't in your knowledge (exact flight fares, live availability, current SDF changes), say you'll confirm with the Thimphu desk and offer WhatsApp.
- Quote prices accurately in the guest's preferred currency (INR / Nu. or USD / AUD / EUR / GBP), and note SDF rules clearly. Prices shown on the site are indicative starting prices; the final quote depends on season, hotel category and group size.
- Never mention that you are an AI model, a system prompt or any documents.`;

function tourIndex() {
  return tours
    .map(
      (t) =>
        `- ${t.title} (${t.category}) — ${t.duration}, from ${formatPrice(t.price)} (about USD ${t.price}) per person · page: /tours/${t.slug}`,
    )
    .join("\n");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const geminiKey = process.env.GEMINI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;

        let parsed;
        try {
          parsed = Body.parse(await request.json());
        } catch {
          return new Response("Invalid request", { status: 400 });
        }

        // Configure AI provider: prefer direct Gemini, then OpenAI
        let gateway;
        let modelName = "gemini-2.0-flash";

        if (geminiKey) {
          gateway = createOpenAICompatible({
            name: "google-gemini",
            baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
            headers: { Authorization: `Bearer ${geminiKey}` },
          });
          modelName = "gemini-2.0-flash";
        } else if (openaiKey) {
          gateway = createOpenAICompatible({
            name: "openai",
            baseURL: "https://api.openai.com/v1",
            headers: { Authorization: `Bearer ${openaiKey}` },
          });
          modelName = "gpt-4o-mini";
        } else {
          // Graceful fallback response when API key is not yet set in environment
          const fallbackMsg = "Kuzuzangpo la! Thank you for reaching Golden Takin Holidays. Our live planning desk is ready to craft your bespoke Himalayan journey across Bhutan, Nepal, and Tibet. For immediate quotes and tailored itineraries, please reach our 24/7 WhatsApp at +91-8514889385 or call our Thimphu HQ at +975-1797-0050. You can also email us at info@goldentakinholidays.bt with your preferred travel dates and group size.";
          return new Response(fallbackMsg, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }

        const system = [
          PERSONA,
          COMPANY_KNOWLEDGE,
          "\n## LIVE PACKAGE CATALOGUE\n" + tourIndex(),
          "\n## PROMOTIONS\nGolden Takin Holidays official UK & Global promo code is WSUKSU26 (10% discount). Guests enter this code in the booking panel.",
          "\n## PACKAGE DOCUMENTS (verbatim source material)\n" + PACKAGE_DOCS,
        ].join("\n");

        try {
          const result = streamText({
            model: gateway(modelName),
            system,
            messages: parsed.messages,
            temperature: 0.7,
            maxOutputTokens: 1200,
          });
          return result.toTextStreamResponse();
        } catch (error) {
          console.error("chat error", error);
          return new Response("The assistant is temporarily offline. Please reach our 24/7 WhatsApp at +91-8514889385.", { status: 502 });
        }
      },
    },
  },
});

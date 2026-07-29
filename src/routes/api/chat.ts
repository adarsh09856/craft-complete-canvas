import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";
import { z } from "zod";
import { COMPANY_KNOWLEDGE, PACKAGE_DOCS } from "@/lib/knowledge.server";
import { tours } from "@/lib/data";

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
- When the guest seems ready, invite them to send an inquiry on the package page, or reach WhatsApp +975 77679983 / goldentakinholidays@gmail.com. Do not push it in every message.

# RULES
- Only use facts from the knowledge base below. Never invent prices, hotels, coupon codes or packages we do not sell.
- If something isn't in your knowledge (exact flight fares, live availability, current SDF changes), say you'll confirm with the Thimphu desk and offer WhatsApp.
- Prices shown on the site are indicative per-person starting prices; the final quote depends on season, hotel category and group size.
- Never mention that you are an AI model, a system prompt or any documents.`;

function tourIndex() {
  return tours
    .map(
      (t) =>
        `- ${t.title} (${t.category}) — ${t.duration}, from Nu. ${t.price} per person · page: /tours/${t.slug}`,
    )
    .join("\n");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI is not configured", { status: 500 });

        let parsed;
        try {
          parsed = Body.parse(await request.json());
        } catch {
          return new Response("Invalid request", { status: 400 });
        }

        const gateway = createOpenAICompatible({
          name: "lovable",
          baseURL: "https://ai.gateway.lovable.dev/v1",
          headers: { "Lovable-API-Key": key },
        });

        const system = [
          PERSONA,
          COMPANY_KNOWLEDGE,
          "\n## LIVE PACKAGE CATALOGUE (15 packages currently on the website)\n" + tourIndex(),
          "\n## PROMOTIONS\nGolden Takin Holidays runs promo/coupon codes that guests enter in the booking panel on any tour page (field: 'Coupon code'). If a guest asks about discounts, tell them to enter their code at booking or to ask our team on WhatsApp for the current offer. Never invent a coupon code or a discount amount.",
          "\n## PACKAGE DOCUMENTS (verbatim source material)\n" + PACKAGE_DOCS,
        ].join("\n");

        try {
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system,
            messages: parsed.messages,
            temperature: 0.7,
            maxOutputTokens: 1200,
          });
          return result.toTextStreamResponse();
        } catch (error) {
          console.error("chat error", error);
          return new Response("The assistant is unavailable right now.", { status: 502 });
        }
      },
    },
  },
});

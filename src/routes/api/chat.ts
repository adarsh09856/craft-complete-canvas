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
            maxOutputTokens: 900,
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

import { google } from "@ai-sdk/google"
import { z } from 'zod';
import { generateText, tool } from 'ai';
import { db } from "@/lib/instant-admin";

export async function POST(request: Request) {
  const data = await request.json()

  const model = google("gemini-2.0-flash")

  const response = await generateText({
    model,
    prompt: `
    You are an expert assistant at naming conversations between a user and an AI assistant.
    Your task is to generate a short, clear, and engaging title for the conversation, based solely on the user's first message.
    - The title should capture the main topic or intent of the user's message.
    - Keep the title concise (ideally 3-6 words).
    - Avoid generic titles like "Chat" or "Conversation".
    - Do not include the user's name or the word "AI" unless relevant.
    - Capitalize main words.

    Examples:
    User: "How do I cook risotto?" → Title: "Cooking Risotto Tips"
    User: "Help me write a resignation letter" → Title: "Resignation Letter Draft"
    User: "What's new in AI research?" → Title: "Latest in AI Research"

    The user's first message is: ${data.firstMessageContent}
    `,
    tools: {
      name_conversation: tool({
        description: 'Name the conversation',
        parameters: z.object({
          name: z.string().describe('The name of the conversation'),
        }),
        execute: async ({ name }) => {
          console.log(name)
          await db.transact(db.tx.conversations[data.conversationId].update({
            name: name
          }))
        },
      }),
    },
    toolChoice: { "type": "tool", "toolName": "name_conversation" }
  })

  return Response.json({ success: true })
}
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
    You are a helpful assistant that names conversations between a user and an AI assistant.
    You do this based on the first message that the user sends. Keep names clear and concise.
    The first message is: ${data.firstMessageContent}
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
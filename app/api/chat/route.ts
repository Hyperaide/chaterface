import { streamText, CoreMessage, createDataStreamResponse } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { db } from '@/lib/instant-admin';
import { tx } from '@instantdb/react';
import { models } from '@/constants/models';

export async function POST(req: Request) {
  try {
    // Extract API key from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const sessionId = req.headers.get('X-Session-Id');
    const token = req.headers.get('X-Token');


    if(await checkUsage(sessionId, token)) {
      return new Response(JSON.stringify({ error: 'Usage limit reached' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get messages, model, and conversationId from the body
    const { messages, model }: { messages: CoreMessage[], model: string } = await req.json();

    // Ensure required body data is present
    if (!messages || !model) {
      return new Response(JSON.stringify({ error: 'Missing required fields in body (messages, model)' }), {
         status: 400,
         headers: { 'Content-Type': 'application/json' }
      });
    }

    const [provider, modelId] = model.split('/');

    let result;

    switch (provider) {
      case 'openai':
        return createDataStreamResponse({
          execute: dataStream => {
            dataStream.writeMessageAnnotation({ model: model });
            const result = streamText({
              model: openai(modelId),
              messages: messages,
              temperature: 1,
            });
            result.mergeIntoDataStream(dataStream);
          },
          onError: (error) => {
            // You might want more specific error handling here
            return "An error occurred with OpenAI";
          },
        });

      case 'anthropic':
        return createDataStreamResponse({
          execute: dataStream => {
            dataStream.writeMessageAnnotation({ model: model });
            const result = streamText({
              model: anthropic(modelId),
              messages: messages,
              temperature: 1,
            });
            result.mergeIntoDataStream(dataStream);
          },
          onError: (error) => {
            return "An error occurred with Anthropic";
          },
        });

      case 'google':
        return createDataStreamResponse({
          execute: dataStream => {
            dataStream.writeMessageAnnotation({ model: model });
            const result = streamText({
              model: google(modelId),
              messages: messages,
              temperature: 1,
            });
            result.mergeIntoDataStream(dataStream);
          },
          onError: (error) => {
            return "An error occurred with Google";
          },
        });

      default:
        return new Response(JSON.stringify({ error: `Unsupported provider: ${provider}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

  } catch (error: any) {
    // Handle JSON parsing errors specifically
    if (error instanceof SyntaxError) {
        return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const errorMessage = error.message || 'An unexpected error occurred';
    const errorStatus = error.status || error.statusCode || 500;
    return new Response(JSON.stringify({ error: errorMessage }), {
        status: errorStatus,
        headers: { 'Content-Type': 'application/json' }
    });
  }
} 


async function checkUsage(sessionId?: string | null, token?: string | null) {
  if (!sessionId && !token) {
    return true;
  }

  let user;

  if(token) {
    user = await db.auth.verifyToken(token);
    if(!user) {
      return true;
    }
  }

  const data = await db.query({
    messages: {
      $: {
        where: {
          or: [
            { 'conversation.sessionId': sessionId ?? '' },
            { 'conversation.user.id': user?.id ?? '' }
          ]
        }
      }
    },
    userProfiles: {
      $: {
        where: {
          'user.id': user?.id ?? ''
        }
      }
    }
  });

  // if user is logged in, check if they have used 200 messages
  if(user && data.userProfiles[0]?.credits && data.userProfiles[0]?.credits <= 0) {
    return true;
  } else if(user && data.userProfiles[0]?.credits && data.userProfiles[0]?.credits > 0) {
    const model = data.messages[data.messages.length - 1].model;
    const modelData = models.find((m: any) => m.id === model);
    console.log('decreasing credits');
    await db.transact(db.tx.userProfiles[data.userProfiles[0].id].update({
      credits: data.userProfiles[0]?.credits - (modelData?.creditCost ?? 1)
    }));
  }

  // if user is not logged in, check if they have used 100 messages
  if(!user && data.messages.length >= 100) {
    return true;
  }

  return false;
}
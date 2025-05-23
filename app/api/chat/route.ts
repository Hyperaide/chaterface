import { streamText, CoreMessage, createDataStreamResponse } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { xai } from '@ai-sdk/xai';
import { db } from '@/lib/instant-admin';
import { tx } from '@instantdb/react';
import { models, modelPricing, calculateCreditCost } from '@/constants/models';

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

    let user; let userProfile: any;

    if(token) {
      user = await db.auth.verifyToken(token);
      userProfile = await db.query({
        userProfiles: {
          $: {
            where: {
              'user.id': user?.id ?? ''
            }
          }
        }
      }).then((data) => {
        return data.userProfiles[0];
      });
    }

    if(await usageLimitReached(sessionId, user)) {
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

    const createProviderStream = (providerModel: any) => {
      return createDataStreamResponse({
        execute: dataStream => {
          dataStream.writeMessageAnnotation({ model });
          const result = streamText({
            model: providerModel(modelId),
            messages,
            temperature: 1,
            onFinish: async (data) => {
              await useCredits(model, userProfile, data.usage);
              dataStream.writeMessageAnnotation({ creditsConsumed: calculateCreditCost(model, data.usage) });
            },
          });
          result.mergeIntoDataStream(dataStream);
        },
        onError: (error: any) => {
          console.error(error);
          return `An error occurred with ${provider}`;
        }
      });
    };

    switch (provider) {
      case 'openai':
        return createProviderStream(openai);
      case 'anthropic':
        return createProviderStream(anthropic);
      case 'google':
        return createProviderStream(google);
      case 'xai':
        return createProviderStream(xai);
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

async function usageLimitReached(sessionId?: string | null, user?: any | null, userProfile?: any | null) {
  if (!sessionId && !user) {
    return true;
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
  });

  // if user is logged in, check if they have used 200 messages
  if(user && userProfile?.credits && userProfile?.credits <= 0) {
    return true;
  }

  // if user is not logged in, check if they have used 100 messages
  if(!user && data.messages.length >= 100) {
    return true;
  }

  return false;
}

async function useCredits(model: string, userProfile: any, usage?: any) {
  if(!userProfile) {
    return;
  }

  await db.transact(db.tx.userProfiles[userProfile.id].update({
    credits: userProfile?.credits - calculateCreditCost(model, usage)
  }));
}
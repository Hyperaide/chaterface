import { streamText, CoreMessage, createDataStreamResponse, LanguageModelUsage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { xai } from '@ai-sdk/xai';
import { db } from '@/lib/instant-admin';
import { tx } from '@instantdb/react';
import { calculateCreditCost } from '@/constants/models';

// Types
interface UserProfile {
  id: string;
  credits: number;
}

interface ChatRequest {
  messages: CoreMessage[];
  model: string;
}

interface UsageData {
  usage?: {
    total_tokens?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

// Constants
const ANONYMOUS_MESSAGE_LIMIT = 100;
const PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  XAI: 'xai',
} as const;

// Helper functions
const createErrorResponse = (message: string, status: number = 400) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

const createProviderStream = (provider: string, modelId: string, messages: CoreMessage[], userProfile: UserProfile | null) => {
  const providerMap = {
    [PROVIDERS.OPENAI]: openai,
    [PROVIDERS.ANTHROPIC]: anthropic,
    [PROVIDERS.GOOGLE]: google,
    [PROVIDERS.XAI]: xai,
  };

  const providerModel = providerMap[provider as keyof typeof providerMap];
  if (!providerModel) {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  return createDataStreamResponse({
    execute: dataStream => {
      dataStream.writeMessageAnnotation({ model: `${provider}/${modelId}` });
      const result = streamText({
        model: providerModel(modelId),
        messages,
        temperature: 1,
        onFinish: async (data: { usage: LanguageModelUsage }) => {
          if (userProfile) {
            await useCredits(`${provider}/${modelId}`, userProfile, data.usage);
            dataStream.writeMessageAnnotation({ 
              creditsConsumed: calculateCreditCost(`${provider}/${modelId}`, data.usage) 
            });
          }
        },
      });
      result.mergeIntoDataStream(dataStream);
    },
    onError: (error: unknown) => {
      console.error(`Error with ${provider}:`, error);
      return `An error occurred with ${provider}`;
    }
  });
};

export async function POST(req: Request) {
  try {
    // Validate authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createErrorResponse('Missing or invalid Authorization header', 401);
    }

    // Get session info
    const sessionId = req.headers.get('X-Session-Id');
    const token = req.headers.get('X-Token');

    // Get user profile if token exists
    let userProfile: UserProfile | null = null;
    if (token) {
      const user = await db.auth.verifyToken(token);
      if (user?.id) {
        const profileData = await db.query({
          userProfiles: {
            $: {
              where: {
                'user.id': user.id
              }
            }
          }
        });
        const profile = profileData.userProfiles[0];
        if (profile && typeof profile.credits === 'number') {
          userProfile = profile as UserProfile;
        }
      }
    }

    // Check usage limits
    if (await usageLimitReached(sessionId, userProfile)) {
      return createErrorResponse('Usage limit reached');
    }

    // Parse and validate request body
    const { messages, model }: ChatRequest = await req.json();
    if (!messages?.length || !model) {
      return createErrorResponse('Missing required fields in body (messages, model)');
    }

    const [provider, modelId] = model.split('/');
    return createProviderStream(provider, modelId, messages, userProfile);

  } catch (error) {
    if (error instanceof SyntaxError) {
      return createErrorResponse('Invalid JSON body');
    }
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorWithStatus = error as ErrorWithStatus;
    const errorStatus = errorWithStatus.status || errorWithStatus.statusCode || 500;
    return createErrorResponse(errorMessage, errorStatus);
  }
}

async function usageLimitReached(sessionId?: string | null, userProfile?: UserProfile | null): Promise<boolean> {
  if (!sessionId && !userProfile) {
    return true;
  }

  const data = await db.query({
    messages: {
      $: {
        where: {
          or: [
            { 'conversation.sessionId': sessionId ?? '' },
            { 'conversation.user.id': userProfile?.id ?? '' }
          ]
        }
      }
    },
  });

  if (userProfile?.credits !== undefined && userProfile.credits <= 0) {
    return true;
  }

  if (!userProfile && data.messages.length >= ANONYMOUS_MESSAGE_LIMIT) {
    return true;
  }

  return false;
}

async function useCredits(model: string, userProfile: UserProfile, usage?: LanguageModelUsage): Promise<void> {
  if (!userProfile) return;

  const creditCost = calculateCreditCost(model, usage);
  await db.transact(db.tx.userProfiles[userProfile.id].update({
    credits: userProfile.credits - creditCost
  }));
}
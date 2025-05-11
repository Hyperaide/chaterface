// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.any(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    userProfiles: i.entity({
      credits: i.number(),
      theme: i.string(),
      hasPurchasedCredits: i.boolean(),
    }),
    conversations: i.entity({
      name: i.string(),
      createdAt: i.date().indexed(),
      sessionId: i.string(),
    }),
    messages: i.entity({
      role: i.string(),
      content: i.string(),
      createdAt: i.date(),
      model: i.string(),
    }),
  },
  links: {
    conversationMessages: {
      forward: { on: "messages", has: "one", label: "conversation" },
      reverse: { on: "conversations", has: "many", label: "messages" }
    },
    conversationUser: {
      forward: { on: "conversations", has: "one", label: "user" },
      reverse: { on: "$users", has: "many", label: "conversations" }
    },
    userProfile: {
      forward: { on: "userProfiles", has: "one", label: "user" },
      reverse: { on: "$users", has: "one", label: "profile" },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

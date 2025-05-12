"use server"
import { Client } from "@upstash/qstash"

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
})

export async function startBackgroundJob(url: string, body: any) {
  await qstashClient.publishJSON({
    url: url,
    body: body
  })
}
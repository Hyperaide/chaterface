# Ground 0

A modern chat interface for large language models.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fchaterface)

## Tech Stack

This project is built using:

- [Next.js](https://nextjs.org/) - The React Framework for the Web
- [InstantDB](https://www.instantdb.com/) - A modern Firebase alternative for real-time database
- [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) - For building AI-powered applications

## Provider API Keys
All API keys are stored in local storage. The application uses a React context provider 
(`KeyProvider`) to manage API keys for different services:

- OpenAI
- Anthropic
- Google

Keys are stored securely in your browser's local storage and are never sent to our servers. 
You can manage your keys through the application interface, and they will persist across 
browser sessions.

## Features

- [x] Multiple providers and models
- [x] Keyboard shortcuts
- [x] Open source
- [ ] Image generation
- [ ] File upload
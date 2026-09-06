# [MemeBoard](https://memeboard-app.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)

![Website homepage screenshot](/public/banner.png)

Explore the trendiest memes, upload your own creations, chat with your friends, interact with the community, and more! MemeBoard is an accessible and easy to use online social platform for posting, sharing, and exploring all kinds of memes. There are many different post interaction features such as voting, commenting, saving, reacting, and sharing, it's essentially a simple Reddit clone that's exclusively for memes. It also has social features like following users and customizing your profile, as well as a realtime chat where you can send content and chat with your friends or interact with MemeBot!

## Features

- Upload and categorize custom memes
- Discuss and comment on memes
- Vote for the best memes and save to collections
- Express your reactions to memes with emojis
- Chat with your friends in realtime and share memes and comments
- Have fun chatting with MemeBot (not an LLM)
- Easily sign in/sign up with credentials, Google, or GitHub
- Customize your own profile
- Follow your friends and see their memes
- Create and curate custom collections of memes
- Create tags and categorize memes with them
- Sort, filter, search, and browse through different memes
- Toggle between dark/light modes
- Smooth page transitions and loading animations
- Accessible, fully responsive, and easy to use UI and UX

## Tech Stack

This is a [Next.js](https://nextjs.org) app hosted on [Vercel](https://vercel.com) and [Neon](https://neon.com), built with [React](https://react.dev), [TypeScript](https://typescriptlang.org), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) for the app's main user and meme data and [Redis](https://redis.io/) ([Upstash](https://upstash.com/)) for quick and lightweight realtime message storage, and [Tailwind](https://tailwindcss.com), and the libraries [Better Auth](https://www.better-auth.com), [Framer Motion](https://motion.dev), [React Icons](https://react-icons.github.io), and [uploadthing](https://uploadthing.com/). The app folder contains the frontend page routes and the backend server actions and API endpoints. The components folder contains frontend layout and UI components. The prisma folder contains the Prisma schema, and the lib and types folders contain extra stuff for setup. Finally, the public folder contains frontend assets like icons and logos.

## Quick start

To host a MemeBoard instance running on your machine for local development or other purposes, simply follow these steps below:

1. Clone the GitHub [repository](https://github.com/tonymac129/memeboard) using the command
   ```bash
   git clone https://github.com/tonymac129/memeboard.git
   ```
2. Open it with your favorite code editor or through the terminal
3. If you don't have a local Postgres database or a cloud Neon/Supabase cluster/connection string, only the static pages will work properly because of obvious reasons
4. Create a .env file for the database, Better Auth, and OAuth environment variables MemeBoard depends on
   ```.env
   DATABASE_URL="YOUR_POSTGRES_CONNECTION_URL"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   BETTER_AUTH_SECRET="YOUR_BETTER_AUTH_SECRET"
   BETTER_AUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="YOUR_GOOGLE_ID"
   GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_SECRET"
   GITHUB_CLIENT_ID="YOUR_GITHUB_ID"
   GITHUB_CLIENT_SECRET="YOUR_GITHUB_SECRET"
   UPLOADTHING_TOKEN="YOUR_UPLOADTHING_TOKEN"
   UPSTASH_REDIS_REST_URL="YOUR_REDIS_URL"
   UPSTASH_REDIS_REST_TOKEN="YOUR_REDIS_TOKEN"
   ```
5. Open the terminal and run the commands
   ```bash
   npm install
   npm run dev
   ```
   to install the dependencies and start the Next.js dev server at localhost:3000!

## Contribution

Any kind of contribution is welcome, but please follow the guideline below!

- Submit an issue if there's a bug/issue or if you want to suggest new features/subscriptions to be added.
- Submit a pull request if you want to add or improve the code base!
- Commit messages should be specific and address the issue
- Please don't submit random issues that aren't specific
- Please don't submit pull requests that "fix typo" or "improve formatting"

# Claude Clone

A beautiful, feature-rich AI assistant web application inspired by Claude. This project is built with a modern tech stack including Next.js, Tailwind CSS, Shadcn UI, Supabase, and designed for deployment on Vercel.

## Features

- 🎨 Beautiful, responsive UI with dark/light mode
- 💬 Real-time chat interface with AI
- 👤 User authentication system
- 📱 Mobile-friendly design
- 🔒 Secure data handling with Supabase
- ⚡ Fast performance with Next.js

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (Authentication, Database, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/claude-clone.git
cd claude-clone
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
claude-clone/
├── app/                    # Next.js app directory
│   ├── chat/               # Chat page 
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── settings/           # User settings page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                 # UI components from shadcn/ui
│   ├── chat-input.tsx      # Chat input component
│   ├── chat-messages.tsx   # Chat messages component
│   └── sidebar.tsx         # Sidebar component
├── lib/                    # Utility functions and shared code
│   ├── supabase.ts         # Supabase client and helpers
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── .env.local              # Environment variables (create this)
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Database Structure

### Tables

1. **profiles**
   - id (references auth.users.id)
   - name
   - avatar_url
   - updated_at

2. **conversations**
   - id
   - user_id (references profiles.id)
   - title
   - created_at
   - updated_at

3. **messages**
   - id
   - conversation_id (references conversations.id)
   - role (enum: 'user', 'assistant')
   - content
   - created_at

## Deployment

This project is designed to be deployed on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure your environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by [Claude](https://www.anthropic.com/claude)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

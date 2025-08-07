# Commuinty - Mini LinkedIn Community Platform

A professional social networking platform built for the CIAAN Cyber Tech Full Stack Development Internship assignment.

## 🚀 Features

- **User Authentication**: Secure registration and login with email/password
- **User Profiles**: Customizable profiles with name, email, and bio
- **Post Feed**: Create and view text-only posts with timestamps
- **Profile Pages**: View individual user profiles and their posts
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Dynamic content updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS, shadcn/ui components
- **Deployment**: Vercel

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/akashbhardwaj23/community.git
   cd community
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the command npx supabase login
   - Link the project npx supabase link
   - Push the migrations to db npx supabase db push

4. **Environment Variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

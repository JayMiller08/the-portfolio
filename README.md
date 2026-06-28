# Developer Portfolio

A modern, responsive, and dynamic personal portfolio built with React, Vite, Tailwind CSS, and Shadcn UI. It includes a beautiful hero section, projects showcase, and an admin dashboard powered by Supabase.

## 🚀 Features

- **Modern Tech Stack**: Built with React 18, Vite, and TypeScript for a fast, reliable development experience.
- **Beautiful UI**: Styled with Tailwind CSS and Shadcn UI components for a clean, accessible, and premium design.
- **Animations**: Smooth micro-interactions and animations using Framer Motion.
- **Admin Dashboard**: Secure admin area to manage projects and content, backed by Supabase.
- **Data Fetching**: Efficient data fetching and state management using React Query (`@tanstack/react-query`).
- **Form Handling**: Robust form validation and management using React Hook Form and Zod.
- **Responsive**: Fully responsive design that works perfectly on desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **Database / Auth**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd the-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
├── src/
│   ├── components/       # Reusable UI components (Shadcn UI, Hero, etc.)
│   ├── pages/            # Application routes (Index, Admin, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   ├── supabase/         # Supabase client setup and queries
│   ├── App.tsx           # Main application component and routing
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── index.html            # HTML template
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Project metadata and dependencies
```

## 🚀 Deployment

This project is configured for easy deployment on **Vercel**. 

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the environment variables in your Vercel project settings.
4. Deploy!

## 📝 License

This project is licensed under the MIT License.

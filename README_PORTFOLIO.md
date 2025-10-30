# Jay Mthethwa - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Dark/Light Theme**: Persistent theme toggle with localStorage
- **Smooth Animations**: Framer Motion for elegant transitions and interactions
- **GitHub Integration**: Dynamic GitHub stats fetched from GitHub API
- **SEO Optimized**: Proper meta tags, semantic HTML, and accessibility features
- **Performance Optimized**: Fast loading, code splitting, lazy loading

## 📋 Sections

1. **Hero** - Eye-catching introduction with GitHub stats
2. **About** - Personal story and highlights
3. **Projects** - Featured projects with links to GitHub repos
4. **Skills** - Technical skills with proficiency levels
5. **Media** - Content creation and social media presence
6. **Contact** - Contact form and social links

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚢 Deployment

This portfolio can be deployed to various platforms:

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### GitHub Pages
```bash
# Build the project
npm run build

# Deploy the dist folder to GitHub Pages
# Follow GitHub Pages documentation for detailed steps
```

## 🔧 Customization Guide

### Updating Projects

Edit `src/components/Projects.tsx`:

```typescript
const featuredProjects = [
  {
    title: "Your Project Name",
    description: "Project description",
    technologies: ["Tech1", "Tech2"],
    githubUrl: "https://github.com/yourusername/repo",
    liveUrl: "https://your-demo.com", // Optional
    features: [
      "Feature 1",
      "Feature 2",
    ],
  },
];
```

### Updating Skills

Edit `src/components/Skills.tsx`:

```typescript
const skillCategories = [
  {
    title: "Category Name",
    skills: [
      { name: "Skill Name", level: "Confident" },
      // Add more skills
    ],
  },
];
```

### Changing Colors

Edit `src/index.css` to modify the design system:

```css
:root {
  --primary: 220 85% 25%;
  --accent: 185 85% 55%;
  --secondary: 15 88% 62%;
  /* Modify HSL values as needed */
}
```

### Updating Social Links

Edit the following files:
- `src/components/Header.tsx` - Navigation links
- `src/components/Footer.tsx` - Footer social links
- `src/components/Contact.tsx` - Contact information
- `src/components/Media.tsx` - Social media platforms

### Changing Hero Image

Replace `src/assets/hero-bg.jpg` with your own image, or generate a new one.

### Adding Blog Posts (Optional)

Create a `content/blog` folder and add markdown files. You can use a library like `gray-matter` and `react-markdown` to parse and display blog content.

## 📝 Content Updates

### Personal Information

Update these files with your own information:
- `index.html` - Page title, meta tags, and description
- `src/components/Hero.tsx` - Name, headline, and elevator pitch
- `src/components/About.tsx` - Personal story and highlights
- `src/components/Contact.tsx` - Email address and contact details

### GitHub Stats

The GitHub stats are fetched from the GitHub API. Make sure to update the username in `src/components/Hero.tsx`:

```typescript
const userResponse = await fetch("https://api.github.com/users/YOUR_USERNAME");
```

## 🎨 Design System

The portfolio uses a comprehensive design system defined in:
- `src/index.css` - CSS custom properties for colors, shadows, gradients
- `tailwind.config.ts` - Extended Tailwind configuration
- `src/components/ui/` - Reusable UI components with variants

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Proper color contrast ratios
- Alt text for images

## 📊 Performance

- Lazy loading for images
- Code splitting with React.lazy
- Optimized bundle size
- Fast GitHub API caching
- Smooth scroll behavior

## 🐛 Common Issues

### GitHub API Rate Limiting

If you're hitting rate limits on the GitHub API:
1. The API allows 60 requests per hour for unauthenticated requests
2. Consider implementing a serverless function to cache the results
3. Or add a personal access token (store securely in environment variables)

### Theme Not Persisting

Check that localStorage is enabled in your browser. The theme preference is stored using `localStorage.setItem("theme", theme)`.

## 📄 License

This portfolio is open source and available for personal use. Feel free to fork and customize for your own portfolio!

## 🤝 Contributing

Found a bug or want to suggest an improvement? Feel free to open an issue or submit a pull request!

## 📧 Contact

For questions or feedback:
- Email: jay@example.com
- GitHub: [@JayMiller08](https://github.com/JayMiller08)

---

Built with ❤️ using React, TypeScript, and Tailwind CSS

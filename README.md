# MERN Stack Developer Portfolio

A modern, animated portfolio website built with React, Tailwind CSS, and Framer Motion. Showcase your skills, projects, and experience as a MERN stack developer.

## Features

- **Modern Design**: Clean, professional design with dark theme
- **Smooth Animations**: Interactive animations powered by Framer Motion
- **Responsive Layout**: Fully responsive design that works on all devices
- **Sections**:
  - Hero section with typing animation
  - About section with personal information
  - Skills section showcasing MERN stack technologies
  - Projects section with filtering capabilities
  - Contact form with validation
  - Resume download functionality
- **Toast Notifications**: User-friendly notifications using React Toastify
- **Smooth Scrolling**: Seamless navigation between sections

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Toastify** - Toast notifications
- **React Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd mern-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Update Personal Information

1. **Hero Section**: Edit `src/components/Hero.jsx` to update your name and title
2. **About Section**: Modify `src/components/About.jsx` with your personal information
3. **Skills**: Update the skills array in `src/components/Skills.jsx`
4. **Projects**: Add your projects in `src/components/Projects.jsx`
5. **Contact**: Update contact information in `src/components/Contact.jsx`
6. **Resume**: Replace `public/resume.pdf` with your actual resume

### Styling

- Tailwind configuration: `tailwind.config.js`
- Global styles: `src/index.css`
- Custom colors and animations can be modified in the Tailwind config

### Colors

The default color scheme uses a dark theme with primary blue accents. You can customize colors in `tailwind.config.js`.

## Project Structure

```
mern-portfolio/
├── public/
│   └── resume.pdf          # Your resume file
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── ResumeDownload.jsx
│   │   └── Skills.jsx
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.js         # Vite configuration
```

## Features in Detail

### Navigation
- Sticky navbar with smooth scroll
- Active section highlighting
- Mobile-responsive hamburger menu

### Animations
- Page load animations
- Scroll-triggered reveals
- Hover effects on interactive elements
- Typing animation in hero section

### Contact Form
- Form validation
- Toast notifications on submit
- Responsive design

### Projects
- Filter by category (All, Full Stack, Frontend)
- Project cards with images
- Technology tags
- Links to GitHub and live demos

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and customize it for your own portfolio!

## Support

If you have any questions or need help customizing the portfolio, please open an issue or reach out.

---

Built with ❤️ using React, Tailwind CSS, and Framer Motion

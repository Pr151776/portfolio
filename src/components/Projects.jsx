import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaShieldAlt } from 'react-icons/fa'
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiTailwindcss, SiFramer, SiSupabase, SiCloudflare } from 'react-icons/si'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [filter, setFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'Responsive portfolio built with React, Tailwind CSS, Framer Motion, and Supabase — enhanced with Google reCAPTCHA and Cloudflare for security and reliability.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Google reCAPTCHA', 'Cloudflare'],
      github: 'https://github.com/Pr151776/techrayos',
      live: 'https://techrayos.com',
      category: 'fullstack',
    },
    {
      id: 2,
      title: 'Real Estate Website',
      description: 'Modern real estate site with property listings, advanced search filters, and a responsive UI built with React and Tailwind CSS.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      technologies: ['React', 'Tailwind CSS'],
      github: 'https://github.com/Pr151776/Real-Estate-App',
      live: 'https://real-estate-app-fawn-nine.vercel.app',
      category: 'frontend',
    },
    // {
    //   id: 2,
    //   title: 'Task Management App',
    //   description: 'Collaborative task management tool with real-time updates, drag-and-drop functionality, and team collaboration features.',
    //   image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
    //   technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    //   github: 'https://github.com',
    //   live: 'https://example.com',
    //   category: 'fullstack',
    // },
    // {
    //   id: 3,
    //   title: 'Social Media Dashboard',
    //   description: 'Analytics dashboard for social media metrics with data visualization, real-time updates, and comprehensive reporting.',
    //   image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    //   technologies: ['React', 'Node.js', 'MongoDB'],
    //   github: 'https://github.com',
    //   live: 'https://example.com',
    //   category: 'fullstack',
    // },
    // {
    //   id: 4,
    //   title: 'Blog Platform',
    //   description: 'Modern blog platform with rich text editor, comment system, user profiles, and SEO optimization.',
    //   image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
    //   technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    //   github: 'https://github.com',
    //   live: 'https://example.com',
    //   category: 'fullstack',
    // },
    // {
    //   id: 5,
    //   title: 'Weather App',
    //   description: 'Real-time weather application with location-based forecasts, interactive maps, and detailed weather analytics.',
    //   image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
    //   technologies: ['React', 'Node.js'],
    //   github: 'https://github.com',
    //   live: 'https://example.com',
    //   category: 'frontend',
    // },
    // {
    //   id: 6,
    //   title: 'Chat Application',
    //   description: 'Real-time chat application with multiple rooms, file sharing, emoji support, and message history.',
    //   image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    //   technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    //   github: 'https://github.com',
    //   live: 'https://example.com',
    //   category: 'fullstack',
    // },
  ]

  const categories = ['all', 'fullstack', 'frontend']

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter)

  const getTechIcon = (tech) => {
    const icons = {
      React: <SiReact className="text-blue-400" />,
      'Node.js': <SiNodedotjs className="text-green-600" />,
      MongoDB: <SiMongodb className="text-green-500" />,
      Express: <SiExpress className="text-gray-500" />,
      'Tailwind CSS': <SiTailwindcss className="text-cyan-400" />,
      'Framer Motion': <SiFramer className="text-pink-500" />,
      Supabase: <SiSupabase className="text-emerald-500" />,
      'Google reCAPTCHA': <FaShieldAlt className="text-yellow-400" />,
      Cloudflare: <SiCloudflare className="text-orange-500" />,
    }
    return icons[tech] || null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8"></div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 capitalize ${
                  filter === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          key={filter}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative bg-dark-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-dark-700 rounded-full text-xs text-gray-300"
                    >
                      {getTechIcon(tech)}
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                  >
                    <FaGithub />
                    Code
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    <FaExternalLinkAlt />
                    Live
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects


import { motion } from 'framer-motion'
import { FaArrowUp, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/prakash-r-091095307/', label: 'LinkedIn' },
    { icon: <FaGithub />, url: 'https://github.com/Pr151776', label: 'GitHub' },
    // { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
  ]

  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-dark-900 border-t border-dark-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Built with React, Tailwind CSS, and Framer Motion
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            <motion.button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Back to top"
            >
              <FaArrowUp />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


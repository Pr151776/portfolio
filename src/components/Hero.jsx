import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaDownload, FaArrowDown } from 'react-icons/fa'
import ResumeDownload from './ResumeDownload'

const titles = ['MERN Stack Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer']

const Hero = () => {
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(250)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fullText = titles[currentIndex]
    let timeout
    if (!isDeleting && displayText.length < fullText.length) {
      timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1))
      }, typingSpeed)
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length - 1))
      }, typingSpeed / 2)
    } else if (!isDeleting && displayText.length === fullText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false)
      setTypingSpeed(150)
      setCurrentIndex((currentIndex + 1) % titles.length)
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, typingSpeed, currentIndex])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gradient">Hi, I'm</span>
            <br />
            <span className="text-white">Prakash R</span>
          </motion.h1>

          <motion.div
            className="text-2xl md:text-4xl font-semibold mb-8 h-12 md:h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-primary-400">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Building scalable web applications with MongoDB, Express, React, and Node.js.
            Passionate about creating elegant solutions to complex problems.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ResumeDownload />
            <a
              href="#contact"
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary-500/50 flex items-center gap-2"
            >
              Get In Touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, repeat: Infinity, repeatType: 'reverse', duration: 2 }}
        >
          <button
            onClick={() => scrollToSection('about')}
            className="text-gray-400 hover:text-primary-400 transition-colors"
          >
            <FaArrowDown size={24} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero


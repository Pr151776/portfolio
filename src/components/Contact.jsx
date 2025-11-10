import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'pr151776@gmail.com',
      link: 'mailto:pr151776@gmail.com',
    },
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: '+91 91593 62997',
      link: 'tel:+919159362997',
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'Location',
      value: 'Coimbatore, India',
      link: null,
    },
  ]

  const socialLinks = [
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/prakash-r-091095307/', label: 'LinkedIn' },
    { icon: <FaGithub />, url: 'https://github.com/Pr151776', label: 'GitHub' },
    // { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
  ]

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Feel free to reach out!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-white">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={index}
                      href={info.link || '#'}
                      className="flex items-center gap-4 p-4 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
                      whileHover={{ x: 5 }}
                    >
                      <div className="text-2xl text-primary-400">{info.icon}</div>
                      <div>
                        <div className="text-sm text-gray-400">{info.label}</div>
                        <div className="text-white font-medium">{info.value}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-6 text-white">Follow Me</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 hover:border-primary-500/50 text-gray-300 hover:text-primary-400 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 focus:border-primary-500 focus:outline-none text-white transition-colors"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 focus:border-primary-500 focus:outline-none text-white transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 focus:border-primary-500 focus:outline-none text-white transition-colors resize-none"
                    placeholder="Your Message"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact


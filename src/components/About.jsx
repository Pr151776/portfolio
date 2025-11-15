import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaCode, FaRocket, FaUsers } from 'react-icons/fa'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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

  const features = [
    {
      icon: <FaCode />,
      title: 'Clean Code',
      description: 'Writing maintainable and scalable code following best practices',
    },
    {
      icon: <FaRocket />,
      title: 'Fast Delivery',
      description: 'Efficient development process with focus on quality and speed',
    },
    {
      icon: <FaUsers />,
      title: 'Team Player',
      description: 'Collaborative approach with excellent communication skills',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">About</span> Me
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                I'm a passionate MERN Stack Developer with a strong foundation in building
                full-stack web applications. With expertise in MongoDB, Express.js, React,
                and Node.js, I create robust and scalable solutions that deliver exceptional
                user experiences.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                My journey in web development started with a curiosity about how websites
                work, and it has evolved into a career focused on creating innovative
                digital solutions. I'm constantly learning new technologies and best
                practices to stay at the forefront of web development.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                When I'm not coding, I enjoy contributing to open-source projects, reading
                tech blogs, and exploring new frameworks and libraries that can enhance my
                development workflow.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full rounded-2xl bg-dark-800/50 backdrop-blur-sm border border-primary-500/30 flex items-center justify-center">
                  <img src="/profile.jpeg" alt="Prakash profile" />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-xl bg-dark-800/50 backdrop-blur-sm border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl text-primary-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About


import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiPostman,
  SiRedux,
  SiNextdotjs,
} from 'react-icons/si'
import { MdApi } from 'react-icons/md'

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const skills = [
    { name: 'MongoDB', icon: <SiMongodb />, level: 90, color: 'text-green-500' },
    { name: 'Express.js', icon: <SiExpress />, level: 85, color: 'text-gray-500' },
    { name: 'REST API', icon: <MdApi />, level: 90, color: 'text-teal-400' },
    { name: 'React', icon: <SiReact />, level: 95, color: 'text-blue-400' },
    { name: 'Node.js', icon: <SiNodedotjs />, level: 90, color: 'text-green-600' },
    { name: 'JavaScript', icon: <SiJavascript />, level: 95, color: 'text-yellow-400' },
    { name: 'HTML5', icon: <SiHtml5 />, level: 95, color: 'text-orange-500' },
    { name: 'CSS3', icon: <SiCss3 />, level: 90, color: 'text-blue-500' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 90, color: 'text-cyan-400' },
    { name: 'Redux', icon: <SiRedux />, level: 85, color: 'text-purple-500' },
    // { name: 'Next.js', icon: <SiNextdotjs />, level: 80, color: 'text-gray-300' },
    { name: 'Git', icon: <SiGit />, level: 85, color: 'text-orange-600' },
    { name: 'GitHub', icon: <SiGithub />, level: 90, color: 'text-gray-300' },
    { name: 'Postman', icon: <SiPostman />, level: 80, color: 'text-orange-500' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 rounded-xl bg-dark-800/50 backdrop-blur-sm border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`text-5xl ${skill.color} transition-transform duration-300 group-hover:scale-110`}>
                  {skill.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-sm text-gray-400">{skill.level}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills


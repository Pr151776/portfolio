import { motion } from 'framer-motion'
import { FaDownload } from 'react-icons/fa'
import { toast } from 'react-toastify'

const ResumeDownload = () => {
  const handleDownload = () => {
    // Create a placeholder resume file or link to actual resume
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Resume downloaded successfully!', {
      position: 'top-right',
      autoClose: 3000,
    })
  }

  return (
    <motion.button
      onClick={handleDownload}
      className="px-8 py-3 bg-transparent border-2 border-primary-500 text-primary-400 rounded-lg font-semibold transition-all duration-300 hover:bg-primary-500 hover:text-white shadow-lg hover:shadow-primary-500/50 flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaDownload />
      Download Resume
    </motion.button>
  )
}

export default ResumeDownload


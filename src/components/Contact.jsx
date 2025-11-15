// import { useState, useRef, useEffect } from 'react';
// import { motion, useInView } from 'framer-motion';
// import { toast } from 'react-toastify';
// import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
// import { v4 as uuidv4 } from 'uuid';

// const Contact = () => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-100px' });

//   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [idempotencyKey] = useState(() => uuidv4());

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, message } = formData;
//     if (!name || !email || !message) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       toast.error('Please enter a valid email address');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // 1️⃣ Execute Google reCAPTCHA v3
//       const captchaToken = await window.grecaptcha.execute(
//         import.meta.env.VITE_RECAPTCHA_SITE_KEY,
//         { action: 'contact' }
//       );

//       // 2️⃣ Send POST request to Supabase Edge Function
//       const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/contact`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           message,
//           captchaToken,
//           idempotencyKey,
//           source: 'portfolio-website',
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success('Message sent successfully!');
//         setFormData({ name: '', email: '', message: '' });
//       } else {
//         toast.error(data.error || 'Failed to send message');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong. Try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Contact info
//   const contactInfo = [
//     { icon: <FaEnvelope />, label: 'Email', value: 'pr151776@gmail.com', link: 'mailto:pr151776@gmail.com' },
//     { icon: <FaPhone />, label: 'Phone', value: '+91 91593 62997', link: 'tel:+919159362997' },
//     { icon: <FaMapMarkerAlt />, label: 'Location', value: 'Coimbatore, India', link: null },
//   ];

//   // Social links
//   const socialLinks = [
//     { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/prakash-r-091095307/', label: 'LinkedIn' },
//     { icon: <FaGithub />, url: 'https://github.com/Pr151776', label: 'GitHub' },
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

//   return (
//     <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
//       <div className="max-w-7xl mx-auto" ref={ref}>
//         <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
//           <motion.div variants={itemVariants} className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-bold mb-4">
//               Get In <span className="text-gradient">Touch</span>
//             </h2>
//             <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
//             <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
//               Have a project in mind or want to collaborate? Feel free to reach out!
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 gap-12">
//             {/* Left: Contact Info */}
//             <motion.div variants={itemVariants} className="space-y-8">
//               <div>
//                 <h3 className="text-2xl font-semibold mb-6 text-white">Contact Information</h3>
//                 <div className="space-y-4">
//                   {contactInfo.map((info, index) => (
//                     <motion.a
//                       key={index}
//                       href={info.link || '#'}
//                       className="flex items-center gap-4 p-4 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
//                       whileHover={{ x: 5 }}
//                     >
//                       <div className="text-2xl text-primary-400">{info.icon}</div>
//                       <div>
//                         <div className="text-sm text-gray-400">{info.label}</div>
//                         <div className="text-white font-medium">{info.value}</div>
//                       </div>
//                     </motion.a>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-2xl font-semibold mb-6 text-white">Follow Me</h3>
//                 <div className="flex gap-4">
//                   {socialLinks.map((social, index) => (
//                     <motion.a
//                       key={index}
//                       href={social.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-12 h-12 flex items-center justify-center rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 hover:border-primary-500/50 text-gray-300 hover:text-primary-400 transition-all duration-300"
//                       whileHover={{ scale: 1.1, rotate: 5 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       {social.icon}
//                     </motion.a>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>

//             {/* Right: Contact Form */}
//             <motion.div variants={itemVariants}>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 focus:border-primary-500 focus:outline-none text-white transition-colors"
//                     placeholder="Your Name"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 focus:border-primary-500 focus:outline-none text-white transition-colors"
//                     placeholder="your.email@example.com"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     rows="6"
//                     className="w-full px-4 py-3 rounded-lg bg-dark-800/50 backdrop-blur-sm border border-dark-700 focus:border-primary-500 focus:outline-none text-white transition-colors resize-none"
//                     placeholder="Your Message"
//                   />
//                 </div>

//                 <motion.button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   {isSubmitting ? 'Sending...' : 'Send Message'}
//                 </motion.button>
//               </form>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Contact;




// Contact.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => uuidv4());
  const [cooldown, setCooldown] = useState(0);


    const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Cooldown Timer
  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Email
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message, website } = formData;

    // Honeypot spam detection
    if (website && website.trim() !== "") {
      toast.error("Spam detected");
      return;
    }

    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email");
      return;
    }

    setIsSubmitting(true);

    try {
      const captchaToken = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action: "contact" }
      );

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message,
            website,
            captchaToken,
            idempotencyKey,
            source: "portfolio-website",
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "", website: "" });
        setCooldown(10); // 10 sec cooldown
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact info
  const contactInfo = [
    { icon: <FaEnvelope />, label: 'Email', value: 'pr151776@gmail.com', link: 'mailto:pr151776@gmail.com' },
    { icon: <FaPhone />, label: 'Phone', value: '+91 91593 62997', link: 'tel:+919159362997' },
    { icon: <FaMapMarkerAlt />, label: 'Location', value: 'Coimbatore, India', link: null },
  ];

  const socialLinks = [
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/prakash-r-091095307/' },
    { icon: <FaGithub />, url: 'https://github.com/Pr151776' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-900/50">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>

          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Reach out!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT INFO */}
            {/* <motion.div className="space-y-8">
              <h3 className="text-2xl font-semibold text-white">Contact Information</h3>

              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <a key={i} href={info.link || "#"} className="flex items-center gap-4 bg-dark-800/50 p-4 rounded-xl">
                    <div className="text-2xl text-primary-400">{info.icon}</div>
                    <div>
                      <div className="text-sm text-gray-400">{info.label}</div>
                      <div className="text-white font-medium">{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <h3 className="text-2xl font-semibold text-white">Social</h3>
              <div className="flex gap-4">
                {socialLinks.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" className="w-12 h-12 rounded-xl bg-dark-800/50 flex items-center justify-center text-gray-300">
                    {s.icon}
                  </a>
                ))}
              </div>
            </motion.div> */}
            {/* Left: Contact Info */}
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

            {/* RIGHT FORM */}
            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
              
              {/* Honeypot */}
              <div className="hidden">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="text-gray-300">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Please Enter Name'
                className="w-full p-3 bg-dark-800/50 mt-1 border-dark-700 rounded-xl" />
              </div>

              <div>
                <label className="text-gray-300">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder='John@example.com'
                className="w-full p-3 bg-dark-800/50 mt-1 border-dark-700 rounded-xl" />
              </div>

              <div>
                <label className="text-gray-300">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="6" placeholder='Your Message'
                className="w-full p-3 bg-dark-800/50 mt-1 border-dark-700 rounded-xl" />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || cooldown > 0}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cooldown > 0
                  ? `Wait ${cooldown}s`
                  : isSubmitting
                    ? "Sending..."
                    : "Send Message"}
              </motion.button>

            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

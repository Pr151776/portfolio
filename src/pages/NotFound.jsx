// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { FiHome } from "react-icons/fi";

// export default function NotFound() {
//   return (
//     <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-6">

//       {/* Glow Lights */}
//       <div className="absolute inset-0">
//         <div className="absolute w-80 h-80 bg-purple-600/30 blur-[150px] -top-10 -left-10 animate-pulse" />
//         <div className="absolute w-96 h-96 bg-blue-600/20 blur-[150px] bottom-0 right-0 animate-pulse" />
//       </div>

//       {/* Main Content */}
//       <motion.div
//         initial={{ opacity: 0, y: 25 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative z-20 text-center max-w-xl"
//       >
//         <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
//           404
//         </h1>

//         <p className="mt-5 text-gray-300 text-lg md:text-xl">
//           Sorry, the page you're looking for doesn't exist.
//         </p>

//         <div className="mt-6 bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl">
//           <p className="text-gray-300 text-sm">
//             You may have mistyped the URL or the page has been moved.
//           </p>
//         </div>

//         <Link
//           to="/"
//           className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-semibold bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg hover:shadow-purple-500/40 transition-all"
//         >
//           <FiHome className="text-xl" />
//           Go Back Home
//         </Link>
//       </motion.div>
//     </div>
//   );
// }







import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  // mouse parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const star1 = useTransform(x, v => v * 0.02);
  const star2 = useTransform(x, v => v * 0.04);
  const star3 = useTransform(x, v => v * 0.06);

  return (
    <div
      onMouseMove={(e) => {
        x.set(e.clientX / 50);
        y.set(e.clientY / 50);
      }}
      className="relative w-full h-screen overflow-hidden bg-[#030712] flex items-center justify-center text-white select-none"
    >

      {/* ---------------------------- */}
      {/* 🌌 MULTI-LAYER PARALLAX STARS */}
      {/* ---------------------------- */}
      <motion.div
        style={{ x: star1 }}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/50 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </motion.div>

      <motion.div
        style={{ x: star2 }}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] bg-cyan-300/50 rounded-full blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </motion.div>

      <motion.div
        style={{ x: star3 }}
        className="absolute inset-0 pointer-events-none"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[4px] h-[4px] bg-blue-400/30 rounded-full blur-[2px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </motion.div>

      {/* ---------------------------- */}
      {/* ✨ FLOATING COSMIC DUST */}
      {/* ---------------------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [-20, 20, -20], opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="absolute w-32 h-32 bg-white/5 blur-3xl rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></motion.div>
        ))}
      </div>

      {/* ---------------------------- */}
      {/* 🔺 UFO */}
      {/* ---------------------------- */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: [-10, -20, -10], opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 flex flex-col items-center"
      >
        <div className="w-48 h-24 rounded-full bg-gradient-to-b from-blue-400/60 to-blue-900/10 backdrop-blur-xl border border-blue-300/40 shadow-[0_0_40px_5px_rgba(0,150,255,0.5)]"></div>
        <div className="w-64 h-10 -mt-2 rounded-full bg-gradient-to-r from-cyan-300/80 to-blue-500/80 shadow-[0_0_60px_10px_rgba(0,200,255,0.4)] border border-blue-300/20"></div>

        <div className="flex gap-4 mt-2">
          <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_4px_rgba(0,200,255,0.7)]"></div>
          <div className="w-3 h-3 rounded-full bg-purple-300 shadow-[0_0_10px_4px_rgba(200,100,255,0.7)]"></div>
          <div className="w-3 h-3 rounded-full bg-pink-300 shadow-[0_0_10px_4px_rgba(255,100,200,0.7)]"></div>
        </div>
      </motion.div>

      {/* ---------------------------- */}
      {/* 🟦 TRACTOR BEAM */}
      {/* ---------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-52 w-72 h-80 bg-gradient-to-b from-cyan-300/20 via-cyan-400/10 to-transparent blur-md"
        style={{
          clipPath: "polygon(50% 0%, 85% 100%, 15% 100%)",
        }}
      ></motion.div>

      {/* ---------------------------- */}
      {/* 👨‍🚀 ASTRONAUT */}
      {/* ---------------------------- */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: [-5, -15, -5], opacity: 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-[55%] flex flex-col items-center"
      >
        <div className="w-10 h-20 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg shadow-lg"></div>
        <div className="w-12 h-12 -mt-14 rounded-full bg-gradient-to-b from-white to-gray-400 border-4 border-gray-300 shadow-[0_0_20px_3px_rgba(255,255,255,0.5)]"></div>

        <div className="flex gap-2 mt-2">
          <div className="w-3 h-10 bg-gray-400 rounded-lg"></div>
          <div className="w-3 h-10 bg-gray-400 rounded-lg"></div>
        </div>
      </motion.div>

      {/* ---------------------------- */}
      {/* 🟦  NEON HOLOGRAM "PAGE NOT FOUND" */}
      {/* ---------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-20 text-center"
      >
        <h1 className="text-6xl font-extrabold tracking-wider text-transparent bg-clip-text 
          bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 
          drop-shadow-[0_0_25px_rgba(0,200,255,0.5)]
          animate-holoGlow"
        >
          404
        </h1>

        <p className="text-cyan-200/80 text-xl mt-3 hologram-text">
          PAGE NOT FOUND
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 
          backdrop-blur-md hover:bg-cyan-500/40 transition-all duration-500 
          shadow-[0_0_20px_rgba(0,200,255,0.3)]"
        >
          Go Back Home
        </Link>
      </motion.div>

      {/* ---------------------------- */}
      {/* ⭐ HOLOGRAM EFFECTS */}
      {/* ---------------------------- */}
      <style>
        {`
        @keyframes holoScan {
          0% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-4px); }
          100% { opacity: 0.5; transform: translateY(0); }
        }

        @keyframes hologramFlicker {
          0%, 100% { opacity: 1; }
          90% { opacity: 0.75; }
        }

        .animate-holoGlow {
          animation: hologramFlicker 3s infinite ease-in-out;
        }

        .hologram-text {
          letter-spacing: 6px;
          text-shadow:
              0 0 10px rgba(0,255,255,0.5),
              0 0 20px rgba(0,255,255,0.2),
              0 0 40px rgba(0,255,255,0.1);
          animation: holoScan 4s infinite linear;
        }
        `}
      </style>
    </div>
  );
}

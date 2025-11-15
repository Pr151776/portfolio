// import { useState, useEffect } from "react";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import About from "./components/About";
// import Skills from "./components/Skills";
// import Projects from "./components/Projects";
// import Contact from "./components/Contact";
// import Footer from "./components/Footer";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminLogin from "./pages/AdminLogin";

// function App() {
//   const [activeSection, setActiveSection] = useState("home");

//   useEffect(() => {
//     const handleScroll = () => {
//       const sections = ["home", "about", "skills", "projects", "contact"];
//       const scrollPosition = window.scrollY + 100;

//       for (const section of sections) {
//         const element = document.getElementById(section);
//         if (element) {
//           const { offsetTop, offsetHeight } = element;
//           if (
//             scrollPosition >= offsetTop &&
//             scrollPosition < offsetTop + offsetHeight
//           ) {
//             setActiveSection(section);
//             break;
//           }
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
//         <Navbar activeSection={activeSection} />

//         <Routes>
//           {/* Admin Login */}
//           <Route path="/admin-login" element={<AdminLogin />} />

//           {/* Protected Admin Page */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Public Website */}
//           <Route
//             path="/"
//             element={
//               <main>
//                 <section id="home">
//                   <Hero />
//                 </section>
//                 <section id="about">
//                   <About />
//                 </section>
//                 <section id="skills">
//                   <Skills />
//                 </section>
//                 <section id="projects">
//                   <Projects />
//                 </section>
//                 <section id="contact">
//                   <Contact />
//                 </section>
//               </main>
//             }
//           />
//         </Routes>

//         <Footer />
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;



import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// ------------------------------
//  Navbar Visibility Controller
// ------------------------------
function Layout({ children }) {
  const location = useLocation();

  // Pages where Navbar should NOT show
  const hideNavbarRoutes = ["/admin", "/admin-login", "/404"];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {!hideNavbar && <Navbar />}

      {children}

      {!hideNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Admin Login */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Admin Page */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public Website */}
          <Route
            path="/"
            element={
              <main>
                <section id="home">
                  <Hero />
                </section>
                <section id="about">
                  <About />
                </section>
                <section id="skills">
                  <Skills />
                </section>
                <section id="projects">
                  <Projects />
                </section>
                <section id="contact">
                  <Contact />
                </section>
              </main>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

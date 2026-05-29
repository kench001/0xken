import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Projects from './projects';
import Contact from './contacts';
import resumePdf from './assets/Kench_Justin_Loyola_Resume.pdf';


// Component for scroll reveal animation
const RevealItem = React.memo(function RevealItem({ children, delay = "", className = "" }: { children?: React.ReactNode, delay?: string, className?: string }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle reveal state based on intersection
        setIsRevealed(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        // Add a small margin to trigger slightly before/after it hits the viewport
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-item ${isRevealed ? 'is-revealed' : ''} ${delay} ${className}`}
    >
      {children}
    </div>
  );
});

function App() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);

        const glowX = (e.clientX - window.innerWidth / 2) * 0.02;
        const glowY = (e.clientY - window.innerHeight / 2) * 0.02;
        containerRef.current.style.setProperty('--about-glow-x', `${glowX}px`);
        containerRef.current.style.setProperty('--about-glow-y', `${glowY}px`);
      }
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-30% 0px -40% 0px',
          threshold: 0
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      if (menuOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    const lenis = (window as any).lenis;
    if (lenis && element) {
      lenis.start();
      lenis.scrollTo(element, { offset: 0, duration: 1.2 });
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleScroll = () => {
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / vh));
      setScrollProgress(progress);
    };

    lenis.on('scroll', handleScroll);
    handleScroll();

    // Store lenis on window for easy access in click handlers if needed
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  // Easing function for smoother color transition (easeInOutQuad)
  const easedProgress = scrollProgress < 0.5
    ? 2 * scrollProgress * scrollProgress
    : 1 - Math.pow(-2 * scrollProgress + 2, 2) / 2;

  // Interpolate colors
  const bgValue = easedProgress * 255;
  const bgColor = `rgb(${bgValue}, ${bgValue}, ${bgValue})`;

  // UI colors (text/lines) transition from white (255) to black (0)
  const uiValue = (1 - easedProgress) * 255;
  const uiColor = `rgb(${uiValue}, ${uiValue}, ${uiValue})`;

  return (
    <div
      ref={containerRef}
      className="selection:bg-brand-primary selection:text-black min-h-screen"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hero Section - UNTOUCHED CONTENT */}
      <section id="home" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Layers - Fading out */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{
            background: `radial-gradient(1000px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(0, 255, 170, 0.08), transparent 70%)`
          }}
        />
        <div
          className="absolute inset-0 bg-grid-lines pointer-events-none"
          style={{ opacity: 0.4 * (1 - scrollProgress) }}
        />
        <div
          className="focal-glow"
          style={{ opacity: 0.6 * (1 - scrollProgress) }}
        />
        <div
          className="focal-glow !animate-[drift_35s_ease-in-out_infinite_reverse]"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 204, 255, 0.15) 0%, transparent 75%)',
            opacity: 0.2 * (1 - scrollProgress)
          }}
        />

        {/* Decorative V-Shape at bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 pointer-events-none"
          style={{ opacity: 0.1 * (1 - scrollProgress) }}
        >
          <div className="w-full h-px bg-white/20 absolute top-0" />
          <div className="w-full h-full flex justify-center">
            <div className="w-px h-full bg-white/10" />
          </div>
          <div className="absolute top-0 left-0 w-1/2 h-full border-r border-white/10 origin-top-right -rotate-12" />
          <div className="absolute top-0 right-0 w-1/2 h-full border-l border-white/10 origin-top-left rotate-12" />
        </div>

        {/* Top Navigation / Menu */}
        {(() => {
          const buttonColor = menuOpen ? 'rgb(255, 255, 255)' : uiColor;
          const isScrolled = scrollProgress > 0.15;
          return (
            <nav className="fixed top-8 right-8 z-[100]">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="group flex items-center gap-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 focus:outline-none cursor-pointer"
              >
                {/* Active Section indicator (e.g. HOME, ABOUT) - collapses on scroll/open */}
                <span
                  className={`text-[10px] tracking-[0.25em] font-semibold transition-all duration-500 overflow-hidden inline-block ${isScrolled || menuOpen ? 'max-w-0 opacity-0 mr-0' : 'max-w-xs opacity-50 mr-2'
                    }`}
                  style={{ color: buttonColor }}
                >
                  {activeSection} &nbsp;&bull;&nbsp;
                </span>

                {/* "menu" / "close" Text - collapses dynamically on scroll */}
                <span
                  className={`transition-all duration-500 overflow-hidden inline-block ${isScrolled && !menuOpen ? 'max-w-0 opacity-0 mr-0' : 'max-w-xs opacity-70 mr-1'
                    }`}
                  style={{ color: buttonColor }}
                >
                  {menuOpen ? 'close' : 'menu'}
                </span>

                {/* Hamburger to X Animated Lines */}
                <div className="flex flex-col gap-1 w-6 h-4 justify-center items-end relative">
                  <span
                    className={`h-px transition-all duration-500 origin-center absolute ${menuOpen ? 'w-6 rotate-45' : 'w-6 -translate-y-1.5 group-hover:w-6'
                      }`}
                    style={{ backgroundColor: buttonColor }}
                  />
                  <span
                    className={`h-px transition-all duration-500 absolute ${menuOpen ? 'w-0 opacity-0' : 'w-4 group-hover:w-6'
                      }`}
                    style={{ backgroundColor: buttonColor }}
                  />
                  <span
                    className={`h-px transition-all duration-500 origin-center absolute ${menuOpen ? 'w-6 -rotate-45' : 'w-5 group-hover:w-6 translate-y-1.5'
                      }`}
                    style={{ backgroundColor: buttonColor }}
                  />
                </div>
              </button>
            </nav>
          );
        })()}

        {/* Hero Content */}
        <div
          className="relative z-10 text-center px-6 animate-fade-in"
          style={{ opacity: 1 - scrollProgress * 1.5 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] flex flex-col md:flex-row items-center justify-center gap-x-6 gap-y-2 font-outfit">
            <span className="opacity-90" style={{ color: uiColor }}>I build.</span>
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,255,170,0.3)]">I lead.</span>
            <span className="opacity-90" style={{ color: uiColor }}>I deliver.</span>
          </h1>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-8 h-px bg-white/10" style={{ backgroundColor: `rgba(${uiValue}, ${uiValue}, ${uiValue}, 0.1)` }} />
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-medium font-outfit" style={{ color: `rgba(${uiValue}, ${uiValue}, ${uiValue}, 0.5)` }}>
              &bull; Project Manager & Web Developer
            </p>
            <div className="w-8 h-px bg-white/10" style={{ backgroundColor: `rgba(${uiValue}, ${uiValue}, ${uiValue}, 0.1)` }} />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={() => {
            const lenis = (window as any).lenis;
            if (lenis && aboutRef.current) {
              lenis.scrollTo(aboutRef.current);
            }
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-all duration-500 cursor-pointer z-20 hover:translate-y-1 outline-none scroll-indicator-reset"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 3),
            pointerEvents: scrollProgress > 0.3 ? 'none' : 'auto',
            color: uiColor,
            outline: 'none',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-80">scroll</span>
          <div className="w-px h-12 bg-white/10 relative overflow-hidden" style={{ backgroundColor: `rgba(${uiValue}, ${uiValue}, ${uiValue}, 0.1)` }}>
            <div
              className="absolute top-0 left-0 w-full h-full scroll-line-anim"
              style={{
                backgroundColor: uiColor,
                opacity: 0.8
              }}
            />
          </div>
        </div>
      </section>

      {/* About Me Section - Seamless Transition */}
      <section
        id="about"
        ref={aboutRef}
        className="relative min-h-screen w-full py-32 px-6 md:px-20 lg:px-32 flex flex-col items-center justify-center overflow-hidden"
        style={{ color: 'black' }}
      >
        <div className="max-w-7xl w-full">
          <div className="mb-32">
            <RevealItem className="reveal-converge">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-syne font-bold leading-[1.15] tracking-tight text-center md:text-left max-w-5xl">
                Web Developer & Project Manager. I transform complex ideas into simple, scalable digital products.
              </h2>
            </RevealItem>
          </div>

          <div className="w-full">
            <RevealItem delay="delay-100">
              <div className="flex items-center gap-4 mb-12 opacity-60">
                <span className="text-xs font-outfit uppercase tracking-[0.3em]">This is me.</span>
                <div className="flex-1 h-px bg-black/10" />
              </div>
            </RevealItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-32 items-center">
              <div>
                <RevealItem delay="delay-200">
                  <div className="relative inline-block mb-8">
                    <h3 className="text-5xl md:text-7xl lg:text-8xl font-syne font-bold tracking-tighter">
                      <RevealItem className="reveal-left inline-block" delay="delay-200">Hi, I'm</RevealItem>
                      <RevealItem className="reveal-right inline-block ml-4" delay="delay-300">Kench.</RevealItem>
                    </h3>
                    <RevealItem className="reveal-blur absolute -bottom-4 left-0 w-24 h-2 bg-brand-primary/20 rounded-full" delay="delay-500" />
                  </div>
                </RevealItem>

                <RevealItem delay="delay-300" className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="group relative flex items-center gap-5 bg-black text-white px-7 py-3.5 rounded-full font-outfit font-bold transition-all duration-500 hover:pr-11 hover:bg-brand-primary hover:text-black overflow-hidden shadow-2xl cursor-pointer"
                  >
                    <span className="relative z-10">Get in Touch</span>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-500 group-hover:translate-x-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </button>

                  <a
                    href={resumePdf}
                    download="Kench_Justin_Loyola_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 border border-brand-primary text-black px-7 py-3.5 rounded-full font-outfit font-bold transition-all duration-500 hover:bg-brand-primary hover:text-black hover:border-brand-primary shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <span>Download Resume</span>
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </RevealItem>
              </div>

              <div className="flex flex-col gap-8 relative">
                <div
                  className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"
                  style={{
                    transform: 'translate(var(--about-glow-x, 0px), var(--about-glow-y, 0px))'
                  }}
                />
                <div className="flex flex-col gap-6">
                  <RevealItem delay="delay-400">
                    <p className="text-xl md:text-2xl font-outfit leading-relaxed text-black/80 font-medium">
                      I'm a 21-year-old Web Developer and Project Manager dedicated to leading teams to produce high-impact, real-world solutions.
                    </p>
                  </RevealItem>
                  <RevealItem delay="delay-500">
                    <p className="text-xl md:text-2xl font-outfit leading-relaxed text-black/60 font-medium italic">
                      "I transform complex ideas into simple, scalable digital products that solve real-world problems."
                    </p>
                  </RevealItem>
                </div>
                <RevealItem delay="delay-600" className="self-end -mt-2">
                  <button
                    className="group inline-flex items-center gap-2.5 text-black/70 hover:text-black font-outfit font-bold text-sm tracking-wide transition-colors duration-300 relative py-1 cursor-pointer"
                  >
                    <span>Know more about me</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full" />
                  </button>
                </RevealItem>
              </div>
            </div>


          </div>
        </div>
      </section>

      <Projects />
      <Contact />

      {/* Sleek Glassmorphism Fullscreen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center transition-[opacity,visibility] duration-500 ease-in-out will-change-[opacity] ${menuOpen
          ? 'opacity-100 pointer-events-auto backdrop-blur-xl bg-black/95 visible'
          : 'opacity-0 pointer-events-none backdrop-blur-none bg-transparent invisible'
          }`}
      >
        {/* Animated Background decorative shapes */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none will-change-transform transition-transform duration-[1200ms] ease-out ${menuOpen ? 'scale-100 translate-x-10' : 'scale-50 translate-x-0'}`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px] pointer-events-none will-change-transform transition-transform duration-[1200ms] ease-out ${menuOpen ? 'scale-100 -translate-x-10' : 'scale-50 translate-x-0'}`} />

        <div className="relative z-10 max-w-5xl w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
          {/* Menu Items */}
          <div className="flex flex-col gap-6 md:gap-8 w-full md:w-auto">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold mb-4 block">Navigation</span>
            {[
              { id: 'home', num: '01', name: 'Home' },
              { id: 'about', num: '02', name: 'About' },
              { id: 'projects', num: '03', name: 'Projects' },
              { id: 'contact', num: '04', name: 'Contact' }
            ].map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="group flex items-baseline gap-6 text-left w-full focus:outline-none cursor-pointer"
                >
                  <span className={`text-xs md:text-sm font-outfit font-bold tracking-widest transition-colors duration-300 ${isActive ? 'text-brand-primary' : 'text-white/30 group-hover:text-white/60'
                    }`}>
                    {sec.num}
                  </span>
                  <span className={`text-4xl md:text-6xl lg:text-7xl font-syne font-bold tracking-tight transition-all duration-500 ${isActive
                    ? 'text-brand-primary translate-x-4'
                    : 'text-white group-hover:text-brand-primary group-hover:translate-x-4'
                    }`}>
                    {sec.name}
                  </span>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse ml-2 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Contact info / Socials in menu */}
          <div className={`flex flex-col gap-8 transition-all duration-1000 delay-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold block mb-2">Socials</span>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/kench-loyola-31b230291/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-primary transition-colors duration-300">LinkedIn</a>
                <span className="text-white/20">/</span>
                <a href="https://github.com/kench001" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-primary transition-colors duration-300">GitHub</a>
                <span className="text-white/20">/</span>
                <a href="mailto:contact@example.com" className="text-white/60 hover:text-brand-primary transition-colors duration-300">Email</a>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold block mb-2">Get in Touch</span>
              <p className="text-sm text-white/60 font-outfit leading-relaxed">
                Let's create something extraordinary together.<br />
                Available for freelance and roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
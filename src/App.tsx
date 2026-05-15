import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Projects from './projects';
import Contact from './contacts';


// Component for scroll reveal animation
function RevealItem({ children, delay = "", className = "" }: { children?: React.ReactNode, delay?: string, className?: string }) {
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
}

function App() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleGlobalMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

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
  const uiColorAlpha = `rgba(${uiValue}, ${uiValue}, ${uiValue}, 0.7)`;

  return (
    <div 
      className="selection:bg-brand-primary selection:text-black min-h-screen"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hero Section - UNTOUCHED CONTENT */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Background Layers - Fading out */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{ 
            background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 170, 0.08), transparent 70%)` 
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
        <nav className="absolute top-8 right-8 z-50">
          <button className="group flex items-center gap-3 text-sm font-medium tracking-widest uppercase transition-all duration-300">
            <span style={{ color: uiColorAlpha }}>menu</span>
            <div className="flex flex-col gap-1">
              <span 
                className="w-6 h-px group-hover:w-8 transition-all duration-300" 
                style={{ backgroundColor: uiColor }}
              />
              <span 
                className="w-4 h-px self-end group-hover:w-8 transition-all duration-300" 
                style={{ backgroundColor: uiColor }}
              />
            </div>
          </button>
        </nav>

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
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-all duration-500 cursor-pointer z-20 hover:translate-y-1"
          style={{ 
            opacity: Math.max(0, 1 - scrollProgress * 3),
            pointerEvents: scrollProgress > 0.3 ? 'none' : 'auto',
            color: uiColor
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
                
                <RevealItem delay="delay-300">
                  <button className="mt-8 group relative flex items-center gap-6 bg-black text-white px-10 py-5 rounded-full font-outfit font-bold transition-all duration-500 hover:pr-14 hover:bg-brand-primary hover:text-black overflow-hidden shadow-2xl">
                    <span className="relative z-10">Get in Touch</span>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 transition-all duration-500 group-hover:translate-x-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </button>
                </RevealItem>
              </div>

              <div className="flex flex-col gap-8 relative">
                <div 
                  className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"
                  style={{ 
                    transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.02}px, ${(mousePos.y - window.innerHeight / 2) * 0.02}px)`
                  }}
                />
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
            </div>


          </div>
        </div>
      </section>

      <Projects />
      <Contact />
    </div>
  );
}

export default App;
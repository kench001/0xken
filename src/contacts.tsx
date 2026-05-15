import React, { useEffect, useRef, useState } from 'react';

// Component for scroll reveal animation
function RevealItem({ children, delay = "", className = "" }: { children?: React.ReactNode, delay?: string, className?: string }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting);
      },
      { 
        threshold: 0.15,
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

const Contact = () => {
  return (
    <section className="relative min-h-screen w-full bg-white flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[150px]" />
      </div>


      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 overflow-hidden">
        <RevealItem className="reveal-blur">
          <span className="text-gray-400 font-outfit text-xs md:text-sm mb-4 uppercase tracking-[0.4em] font-bold block">
            Want to collaborate?
          </span>
        </RevealItem>
        
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-syne font-bold text-black mb-16 tracking-tighter flex flex-wrap justify-center gap-x-4 md:gap-x-6">
          <RevealItem className="reveal-left" delay="delay-100">Let's</RevealItem>
          <RevealItem className="reveal-converge" delay="delay-200">have</RevealItem>
          <RevealItem className="reveal-blur" delay="delay-300">a</RevealItem>
          <RevealItem className="reveal-right" delay="delay-400">chat!</RevealItem>
        </h2>

        {/* Minimal Social Icons */}
        <div className="flex justify-center gap-10 mt-6">
          <RevealItem className="reveal-blur" delay="delay-500">
            <a 
              href="mailto:contact@example.com" 
              aria-label="Email"
              className="text-black hover:text-purple-600 transition-all duration-300 hover:scale-125 block"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </RevealItem>
          
          <RevealItem className="reveal-blur" delay="delay-600">
            <a 
              href="https://www.linkedin.com/in/kench-loyola-31b230291/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-black hover:text-blue-600 transition-all duration-300 hover:scale-125 block"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </RevealItem>

          <RevealItem className="reveal-blur" delay="delay-700">
            <a 
              href="https://github.com/kench001" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-black hover:text-gray-600 transition-all duration-300 hover:scale-125 block"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </RevealItem>
        </div>
      </div>

      {/* Footer Area */}
      <div className="w-full max-w-7xl flex flex-col items-center gap-8 z-10">
        <div className="flex flex-col items-center">
          <span className="text-xl font-outfit font-bold text-black/20 mb-1">Ken</span>
          <span className="text-sm font-outfit font-medium text-black/60">Kench Loyola</span>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-[10px] text-gray-400 font-outfit uppercase tracking-widest">
            © Kench Loyola 2026. All rights reserved. Location: Philippines
          </p>
          <p className="max-w-md text-[10px] text-gray-300 font-outfit leading-relaxed">
            This site showcases my personal projects and professional work. Content may not be used without permission.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;

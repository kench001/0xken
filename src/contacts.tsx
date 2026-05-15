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

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <a 
            href="mailto:contact@example.com" 
            className="group flex items-center gap-4 px-10 py-4 rounded-full border-2 border-black text-black font-outfit font-bold uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95"
          >
            <div className="bg-black text-white p-1.5 rounded-lg group-hover:bg-white group-hover:text-black transition-colors duration-500">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            Email
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-4 px-10 py-4 rounded-full border-2 border-black text-black font-outfit font-bold uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95"
          >
            <div className="bg-black text-white p-1.5 rounded-lg group-hover:bg-white group-hover:text-black transition-colors duration-500">
              <svg className="w-4 h-4" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            LinkedIn
          </a>
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

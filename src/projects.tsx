import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import feasifyPreview from './assets/feasify-landing-page.png';
import attendscanPreview from './assets/attendscan_preview.png';
import universityHuntPreview from './assets/universityhunt.png';
import riseOfBakunawaPreview from './assets/Rise of bakunawa.jpg';
import basePhPreview from './assets/basePh.jpg';
import blockchainCampusPreview from './assets/Blockchain campus conference.jpg';
import ProjectPreview from './projectpreview';
import type { ProjectData } from './projectpreview';

interface ProjectProps {
  number: string;
  title: string;
  category: string;
  description?: string;
  image?: string;
  color?: string;
  onClick?: () => void;
}

// Component for scroll reveal animation
const RevealItem = React.memo(function RevealItem({ children, delay = "", className = "" }: { children?: React.ReactNode, delay?: string, className?: string }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting);
      },
      {
        threshold: 0.1,
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

const ProjectItem = React.memo(({ number, title, category, description, image, color, onClick }: ProjectProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, localX: 0, localY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const portalRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const prevPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX, ny = e.clientY;
    velocityRef.current = { x: nx - prevPosRef.current.x, y: ny - prevPosRef.current.y };
    prevPosRef.current = { x: nx, y: ny };
    targetRef.current = { x: nx, y: ny };
    setMousePos({
      x: nx, y: ny,
      localX: nx - rect.left,
      localY: ny - rect.top,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX, ny = e.clientY;
    prevPosRef.current = { x: nx, y: ny };
    targetRef.current = { x: nx, y: ny };
    currentRef.current = { x: nx, y: ny };
    velocityRef.current = { x: 0, y: 0 };
    setMousePos({
      x: nx, y: ny,
      localX: nx - rect.left,
      localY: ny - rect.top,
    });
  };

  useEffect(() => {
    if (!isHovered || isTitleHovered || !image) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      return;
    }

    const animate = () => {
      const c = currentRef.current;
      const t = targetRef.current;
      c.x += (t.x - c.x) * 0.12;
      c.y += (t.y - c.y) * 0.12;

      if (portalRef.current) {
        const vel = velocityRef.current;
        const ox = Math.max(-30, Math.min(30, vel.x * -0.35));
        const oy = Math.max(-30, Math.min(30, vel.y * -0.35));
        portalRef.current.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) rotate(-2deg)`;
        portalRef.current.style.left = `${c.x}px`;
        portalRef.current.style.top = `${c.y}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered, isTitleHovered, image]);

  return (
    <div
      className={`group relative border-b border-black/5 py-8 md:py-12 flex flex-col md:flex-row md:items-baseline justify-between gap-4 transition-all duration-700 hover:px-12 hover:bg-black/[0.02] ${onClick ? 'cursor-pointer' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Background Accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.localX}px ${mousePos.localY}px, ${color || 'rgba(0, 255, 170, 0.05)'}, transparent 40%)`
        }}
      />

      <div className="flex items-start gap-6 md:gap-12 relative z-10">
        <span className="text-[10px] md:text-xs font-outfit opacity-30 mt-2 md:mt-4 font-bold tracking-[0.2em]">
          {number}
        </span>
        <div className="flex flex-col gap-2 transition-all duration-700 group-hover:translate-x-6">
          <h3
            className="text-4xl md:text-6xl lg:text-7xl font-outfit font-medium tracking-tighter transition-all duration-700 group-hover:text-black"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            {title}
          </h3>
          {description && (
            <p className="text-sm md:text-base font-outfit max-w-md opacity-40 group-hover:opacity-60 transition-all duration-700 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="md:text-right relative z-10">
        <span className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.3em] opacity-40 font-bold group-hover:opacity-100 transition-opacity duration-500">
          {category}
        </span>
      </div>

      {/* Floating Explore Label */}
      {onClick && (
        <div
          className="absolute pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out hidden lg:flex items-center justify-center"
          style={{
            left: mousePos.localX,
            top: mousePos.localY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black">Explore</span>
          </div>
        </div>
      )}

      {image && typeof document !== 'undefined' && createPortal(
        <div
          ref={portalRef}
          className="fixed pointer-events-none z-[9999] will-change-transform hidden md:block"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            opacity: isHovered && !isTitleHovered ? 1 : 0,
            visibility: isHovered && !isTitleHovered ? 'visible' : 'hidden',
            transition: 'opacity 0.4s ease-out, visibility 0.4s ease-out',
          }}
        >
          <div className={`w-80 lg:w-[450px] overflow-hidden rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-black/10 bg-white transition-all duration-500 ease-out ${isHovered && !isTitleHovered ? 'scale-100' : 'scale-90'}`}>
            <img
              src={image}
              alt={title}
              className="w-full h-auto"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});

export const Projects = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'projects' | 'experience'>('projects');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Clear selected project when changing tabs
  useEffect(() => {
    setSelectedProject(null);
  }, [activeTab]);

  const projects: ProjectData[] = [
    {
      number: '01',
      title: 'Feasify',
      category: 'Project Manager / Lead Dev',
      description: 'A comprehensive platform for feasibility studies and project management, streamlining workflows for modern teams.',
      detailedDescription: 'Feasify is a web-based project management platform tailored for collaborative feasibility studies. It streamlines team workflows by providing structured modules for documentation, financial analysis, risk assessment, and milestone tracking. The system enables real-time collaboration, automatic report generation, and role-based permissions, allowing organizations to evaluate projects efficiently.',
      image: feasifyPreview,
      color: 'rgba(0, 255, 170, 0.08)',
      technologies: {
        frontend: 'React, TypeScript, TailwindCSS',
        backend: 'N/A (Static Web)'
      },
      projectUrl: 'https://feasify.com'
    },
    {
      number: '02',
      title: 'AttendScan',
      category: 'Lead Dev',
      description: 'Smart attendance tracking system using QR codes and real-time analytics for educational institutions and events.',
      detailedDescription: 'AttendScan is a smart, mobile-first attendance management system designed to eliminate manual sign-ins. Users generate unique, dynamic QR codes, which attendees scan to check in instantly. The admin dashboard features real-time tracking, geolocation validation to prevent fraud, and comprehensive PDF/CSV report exports for simple integration with academic or corporate databases. The platform was rebuilt from React Native + Expo to React + TypeScript with a Firebase (NoSQL) backend for scalable real-time data management.',
      image: attendscanPreview,
      color: 'rgba(0, 204, 255, 0.08)',
      technologies: {
        frontend: 'React, TypeScript, TailwindCSS, Chart.js',
        backend: 'Firebase (NoSQL)'
      },
      projectUrl: 'https://attendscan.com'
    },
    {
      number: '03',
      title: 'University-Hunt',
      category: 'Fullstack Developer',
      description: 'A specialized search engine and platform helping students discover and compare universities across metro manila.',
      detailedDescription: 'University-Hunt is a comprehensive portal and search engine designed to assist incoming college students in navigating educational options in Metro Manila. The platform offers advanced filtering by program, tuition range, location, and facility reviews. It also includes an interactive comparison matrix and virtual map integrations to help students plan their academic future.',
      image: universityHuntPreview,
      color: 'rgba(255, 100, 255, 0.08)',
      technologies: {
        frontend: 'React, TypeScript, TailwindCSS, Mapbox API',
        backend: 'N/A (Static Web)'
      },
      projectUrl: 'https://universityhunt.com'
    },
  ];

  const experiences = [
    {
      number: '2026',
      title: 'Game Dev',
      category: 'Project Manager',
      description: 'A PVP TCG game with two factions — Tribesmen vs Bakunawa — as they battle to prevent the moon from being devoured.',
      detailedDescription: 'Rise of the Bakunawa — a PVP TCG game where two factions (Tribesmen vs Bakunawa) battle to prevent the moon from being devoured. Awarded 1st Place in People\'s Choice with 100+ players in a one-day university event.',
      image: riseOfBakunawaPreview,
      color: 'rgba(0, 255, 170, 0.05)',
      technologies: {
        frontend: 'Unity, C#, 3Ds, Adobe Photoshop'
      }
    },
    {
      number: '2025',
      title: 'BasePh',
      category: 'Blockchain',
      description: 'Onboarding Filipinos into the Base ecosystem through community-driven advocacy and grassroots education.',
      detailedDescription: 'BasePh is the Philippine community for Base — a Layer 2 blockchain built by Coinbase that provides a secure, low-cost, and developer-friendly platform for building decentralized applications. As a contributor to BasePh, I help onboard and empower Filipino developers, creators, and users into the Base ecosystem through community engagement, educational content, and grassroots advocacy. Our mission is to bridge the global Base network with the local Filipino blockchain community, driving adoption and collaboration across the region.',
      image: basePhPreview,
      color: 'rgba(0, 204, 255, 0.05)'
    },
    {
      number: '2024',
      title: 'Volunteer',
      category: 'Blockchain Campus Conference',
      description: 'Organizing and facilitating large-scale educational events to foster blockchain adoption in academic communities.',
      detailedDescription: 'Served as a core volunteer for the Blockchain Campus Conference, a large-scale educational event aimed at introducing blockchain technology to students and faculty across multiple universities. Responsibilities included coordinating event logistics, managing on-ground operations, facilitating workshop sessions, and assisting speakers and attendees throughout the conference. The event successfully brought together hundreds of participants, featuring keynote talks, panel discussions, and hands-on workshops that covered blockchain fundamentals, decentralized applications, and real-world use cases — helping bridge the gap between academic communities and the emerging blockchain ecosystem.',
      image: blockchainCampusPreview,
      color: 'rgba(255, 170, 0, 0.05)'
    },
  ];

  const items = activeTab === 'projects' ? projects : experiences;

  return (
    <section id="projects" className="w-full py-16 md:py-24 px-6 md:px-20 lg:px-32 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 flex flex-col items-center">
          <div className="relative flex bg-black/5 p-1 rounded-full mb-8">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full transition-all duration-500 ease-out ${activeTab === 'experience' ? 'translate-x-full' : 'translate-x-0'
                }`}
            />
            <button
              onClick={() => setActiveTab('projects')}
              className={`relative z-10 px-8 py-3 text-[10px] md:text-xs font-outfit uppercase tracking-widest font-bold transition-colors duration-300 ${activeTab === 'projects' ? 'text-white' : 'text-black/40'
                }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`relative z-10 px-8 py-3 text-[10px] md:text-xs font-outfit uppercase tracking-widest font-bold transition-colors duration-300 ${activeTab === 'experience' ? 'text-white' : 'text-black/40'
                }`}
            >
              Experience
            </button>
          </div>

          <RevealItem className="reveal-converge" delay="delay-100">
            <h2 className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.5em] opacity-60 font-bold">
              {activeTab === 'projects' ? 'Selected Work' : 'Professional Journey'}
            </h2>
          </RevealItem>
        </div>

        <div className="flex flex-col min-h-[400px]">
          {items.map((item, index) => (
            <RevealItem key={`${activeTab}-${index}`} delay={`delay-${(index + 1) * 100}`}>
              <ProjectItem
                {...item}
                onClick={() => setSelectedProject(item as unknown as ProjectData)}
              />
            </RevealItem>
          ))}
        </div>
      </div>

      {/* Project Details Preview Overlay */}
      <ProjectPreview
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
});

export default Projects;



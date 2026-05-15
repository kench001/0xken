import React, { useState } from 'react';

interface ProjectProps {
  number: string;
  title: string;
  category: string;
}

const ProjectItem = ({ number, title, category }: ProjectProps) => {
  return (
    <div className="group border-b border-black/10 py-12 md:py-20 flex flex-col md:flex-row md:items-baseline justify-between gap-4 transition-all duration-500 hover:px-4">
      <div className="flex items-start gap-4 md:gap-8">
        <span className="text-[10px] md:text-xs font-outfit opacity-40 mt-3 md:mt-7 font-medium tracking-widest">
          {number}
        </span>
        <h3 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-medium tracking-tight transition-all duration-500 group-hover:translate-x-4">
          {title}
        </h3>
      </div>
      <div className="md:text-right">
        <span className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.2em] opacity-60 font-semibold">
          {category}
        </span>
      </div>
    </div>
  );
};

export const Projects = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'experience'>('projects');

  const projects = [
    { number: '01', title: 'Feasify', category: 'Project Manager / Lead Dev' },
    { number: '02', title: 'AttendScan', category: 'Lead Dev' },
    { number: '03', title: 'University-Hunt', category: 'Frontend Development' },
  ];

  const experiences = [
    { number: '2024 - Present', title: 'Project Manager', category: 'Game Dev' },
    { number: '2022 - 2024', title: 'Hosted', category: 'Sui' },
    { number: '2021 - 2022', title: 'Volunteer', category: 'Blockchain Campus Conference' },
  ];

  const items = activeTab === 'projects' ? projects : experiences;

  return (
    <section className="w-full py-24 md:py-40 px-6 md:px-20 lg:px-32 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 md:mb-32 flex flex-col items-center">
          <div className="relative flex bg-black/5 p-1 rounded-full mb-8">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full transition-all duration-500 ease-out ${
                activeTab === 'experience' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />
            <button 
              onClick={() => setActiveTab('projects')}
              className={`relative z-10 px-8 py-3 text-[10px] md:text-xs font-outfit uppercase tracking-widest font-bold transition-colors duration-300 ${
                activeTab === 'projects' ? 'text-white' : 'text-black/40'
              }`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab('experience')}
              className={`relative z-10 px-8 py-3 text-[10px] md:text-xs font-outfit uppercase tracking-widest font-bold transition-colors duration-300 ${
                activeTab === 'experience' ? 'text-white' : 'text-black/40'
              }`}
            >
              Experience
            </button>
          </div>
          
          <h2 className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.5em] opacity-60 font-bold">
            {activeTab === 'projects' ? 'Selected Work' : 'Professional Journey'}
          </h2>
        </div>
        
        <div className="flex flex-col min-h-[400px]">
          {items.map((item, index) => (
            <ProjectItem key={`${activeTab}-${index}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;


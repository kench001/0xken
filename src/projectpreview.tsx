import React, { useEffect, useRef } from 'react';

export interface ProjectData {
    number: string;
    title: string;
    category: string;
    description: string;
    detailedDescription?: string;
    image: string;
    color: string;
    technologies?: {
        frontend?: string;
        backend?: string;
    };
    projectUrl?: string;
}

export interface ProjectPreviewProps {
    project: ProjectData | null;
    onClose: () => void;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, onClose }) => {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    // Lock body scroll and handle Lenis
    useEffect(() => {
        const lenis = (window as any).lenis;
        const originalHtml = document.documentElement.style.overflow;
        const originalBody = document.body.style.overflow;

        if (project) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCloseRef.current();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.documentElement.style.overflow = originalHtml;
            document.body.style.overflow = originalBody;
            if (lenis) lenis.start();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [project]);

    if (!project) return null;

    // Enhance the color glow for the shadow
    const glowColor = project.color.replace(/0\.\d+\)/, '0.25)');

    return (
        <div
            data-lenis-prevent
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md overflow-y-auto text-white transition-opacity duration-500 animate-fade-in"
            style={{ scrollbarWidth: 'thin', overscrollBehavior: 'contain' }}
        >
            {/* Top Close Button (X) */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors duration-300 p-2 cursor-pointer z-50 focus:outline-none"
                aria-label="Close preview"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col gap-12 md:gap-16">
                {/* Title and external link */}
                <div className="flex items-center gap-6 mt-8">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-syne font-bold tracking-tight">
                        {project.title}
                    </h2>
                    {project.projectUrl && (
                        <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/50 hover:text-white transition-all duration-300 transform hover:translate-x-1 hover:-translate-y-1"
                            title="View Live Project"
                        >
                            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Detailed Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Left Column: Description */}
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.25em] text-white/40 font-bold">
                            Description
                        </span>
                        <div className="w-full h-px bg-white/10 mt-3 mb-6" />
                        <p className="text-base md:text-lg text-white/70 font-outfit leading-relaxed">
                            {project.detailedDescription || project.description}
                        </p>
                    </div>

                    {/* Right Column: Technologies */}
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.25em] text-white/40 font-bold">
                            Technologies
                        </span>
                        <div className="w-full h-px bg-white/10 mt-3 mb-6" />
                        <div className="flex flex-col gap-2 text-base md:text-lg text-white/70 font-outfit leading-relaxed">
                            {project.technologies?.frontend && (
                                <div>
                                    <span className="text-white/40 font-semibold">Frontend: </span>
                                    <span>{project.technologies.frontend}</span>
                                </div>
                            )}
                            {project.technologies?.backend && (
                                <div>
                                    <span className="text-white/40 font-semibold">Backend: </span>
                                    <span>{project.technologies.backend}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Glowing Project Image Preview */}
                <div
                    className="relative w-full overflow-hidden rounded-2xl border border-white/10 transition-all duration-700 bg-zinc-900 mt-4"
                    style={{
                        boxShadow: `0 0 60px -15px ${glowColor}`
                    }}
                >
                    <img
                        src={project.image}
                        alt={`${project.title} detailed preview`}
                        className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectPreview;

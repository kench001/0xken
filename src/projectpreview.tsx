import React, { useEffect, useRef, useState, startTransition } from 'react';

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
        database?: string;
        authentication?: string;
        realTime?: string;
        aiIntegration?: string;
        documentExporting?: string;
        hosting?: string;
        [key: string]: string | undefined;
    };
    projectUrl?: string;
}

export interface ProjectPreviewProps {
    project: ProjectData | null;
    onClose: () => void;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, onClose }) => {
    const [animState, setAnimState] = useState({
        visible: false,
        open: false,
        cachedProject: null as ProjectData | null,
    });
    const onCloseRef = useRef(onClose);
    const hasShown = useRef(false);
    const [isFullyOpen, setIsFullyOpen] = useState(false);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (project) {
            startTransition(() => {
                setAnimState({ visible: true, open: false, cachedProject: project });
            });
            hasShown.current = true;
            const raf = requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimState(prev => ({ ...prev, open: true })));
            });
            const timer = setTimeout(() => {
                setIsFullyOpen(true);
            }, 700);
            return () => {
                cancelAnimationFrame(raf);
                clearTimeout(timer);
            };
        } else if (hasShown.current) {
            setIsFullyOpen(false);
            startTransition(() => {
                setAnimState(prev => ({ ...prev, open: false }));
            });
        }
    }, [project]);

    useEffect(() => {
        if (!animState.open && animState.visible) {
            const timer = setTimeout(() => setAnimState(prev => ({ ...prev, visible: false })), 700);
            return () => clearTimeout(timer);
        }
    }, [animState.open, animState.visible]);

    useEffect(() => {
        const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
        if (animState.visible) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        };
    }, [animState.visible]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCloseRef.current();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!animState.visible) return null;

    const displayProject = project || animState.cachedProject;
    if (!displayProject) return null;

    const glowColor = displayProject.color.replace(/0\.\d+\)/, '0.25)');

    const hasTechnologies = !!(displayProject.technologies && Object.keys(displayProject.technologies).length > 0);

    const formatKey = (key: string) => {
        const specialMappings: Record<string, string> = {
            frontend: 'Frontend',
            backend: 'Backend',
            database: 'Database',
            authentication: 'Authentication',
            realTime: 'Real-time Communication',
            aiIntegration: 'AI Integration',
            documentExporting: 'Document Exporting',
            hosting: 'Hosting'
        };
        if (specialMappings[key]) return specialMappings[key];
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/[-_]/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <div
            data-lenis-prevent
            className={`fixed inset-0 z-[120] bg-black/95 backdrop-blur-md overflow-y-auto text-white transition-all duration-700 ease-out ${isFullyOpen
                ? 'rounded-none border-t-transparent'
                : 'rounded-t-[32px] md:rounded-t-[48px] border-t border-white/10'
                } ${animState.open ? 'translate-y-0' : 'translate-y-full'}`}
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
                <div className={`flex items-center gap-6 mt-8 preview-item-reveal preview-delay-1 ${animState.open ? 'is-active' : ''}`}>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-syne font-bold tracking-tight">
                        {displayProject.title}
                    </h2>
                    {displayProject.projectUrl && (
                        <a
                            href={displayProject.projectUrl}
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
                <div className="grid grid-cols-1 gap-8 md:gap-16 md:grid-cols-2">
                    {/* Left Column: Description */}
                    <div className={`flex flex-col preview-item-reveal preview-delay-2 ${animState.open ? 'is-active' : ''} ${!hasTechnologies ? 'md:col-span-2' : ''}`}>
                        <span className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.25em] text-white/40 font-bold">
                            Description
                        </span>
                        <div className="w-full h-px bg-white/10 mt-3 mb-6" />
                        <p className="text-base md:text-lg text-white/70 font-outfit leading-relaxed">
                            {displayProject.detailedDescription || displayProject.description}
                        </p>
                    </div>

                    {hasTechnologies ? (
                        <div className={`flex flex-col preview-item-reveal preview-delay-3 ${animState.open ? 'is-active' : ''}`}>
                            <span className="text-[10px] md:text-xs font-outfit uppercase tracking-[0.25em] text-white/40 font-bold">
                                Technologies
                            </span>
                            <div className="w-full h-px bg-white/10 mt-3 mb-6" />
                            {displayProject.title === 'Feasify' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm md:text-base text-white/70 font-outfit leading-relaxed">
                                    {/* Column 1 */}
                                    <div className="flex flex-col gap-3">
                                        {['frontend', 'backend', 'database', 'authentication'].map((key) => {
                                            const value = displayProject.technologies?.[key];
                                            if (!value) return null;
                                            return (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-white/40 font-semibold text-xs tracking-wide">{formatKey(key)}</span>
                                                    <span className="text-white/80 text-sm md:text-base mt-0.5">{value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Column 2 */}
                                    <div className="flex flex-col gap-3">
                                        {['realTime', 'aiIntegration', 'documentExporting', 'hosting'].map((key) => {
                                            const value = displayProject.technologies?.[key];
                                            if (!value) return null;
                                            return (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-white/40 font-semibold text-xs tracking-wide">{formatKey(key)}</span>
                                                    <span className="text-white/80 text-sm md:text-base mt-0.5">{value}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 text-base md:text-lg text-white/70 font-outfit leading-relaxed">
                                    {Object.entries(displayProject.technologies || {}).map(([key, value]) => {
                                        if (!value) return null;
                                        return (
                                            <div key={key}>
                                                <span className="text-white/40 font-semibold">{formatKey(key)}: </span>
                                                <span>{value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Empty spacing block or hidden helper to maintain 2 columns layout symmetry if needed, otherwise none */
                        null
                    )}
                </div>

                {/* Glowing Project Image Preview */}
                <div
                    className={`relative w-full overflow-hidden rounded-2xl border border-white/10 transition-all duration-700 bg-zinc-900 mt-4 preview-item-reveal ${hasTechnologies ? 'preview-delay-4' : 'preview-delay-3'
                        } ${animState.open ? 'is-active' : ''}`}
                    style={{
                        boxShadow: `0 0 60px -15px ${glowColor}`
                    }}
                >
                    <img
                        src={displayProject.image}
                        alt={`${displayProject.title} detailed preview`}
                        className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectPreview;

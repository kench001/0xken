import React, { useEffect, useRef, useState } from 'react';

// Milestone Interface
interface Milestone {
    year: string;
    title: string;
    description: string;
    tags: string[];
}

// Reveal animation component local to MoreAboutMe
const TimelineReveal = ({ children, delay = "", className = "" }: { children: React.ReactNode; delay?: string; className?: string }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsRevealed(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px',
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
};

interface MoreAboutMeProps {
    onClose: () => void;
}

const MoreAboutMe: React.FC<MoreAboutMeProps> = ({ onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Milestone data
    const milestones: Milestone[] = [
        {
            year: '2021',
            title: 'The Axie Awakening',
            description: 'My Axie Infinity journey began — and I was captivated. Earning while playing felt like magic, but the real discovery was deeper. This was my eyes-wide-open moment: crypto and blockchain weren\'t just games, they were opportunities. A new way to think about value, ownership, and the internet itself. That year, I didn\'t just play a game — I found my obsession.',
            tags: ['Axie Infinity', 'Blockchain', 'Crypto', 'Web3'],
        },
        {
            year: '2022',
            title: 'Scammed, Broke, and Rebuilt',
            description: 'After a year of play-to-earn wins, I took a hit that stopped me cold — a bad crypto investment wiped me out. It was a brutal lesson, but it didn\'t end there. I found Solybird, a blockchain play-to-earn project, and turned my loss into a comeback. This time I wasn\'t just a player — I became its community manager, leading people across different countries and time zones. The scam didn\'t stop me. It redirected me.',
            tags: ['Community Management', 'Play-to-Earn', 'Solybird', 'Resilience'],
        },
        {
            year: '2023',
            title: 'Shift, Pivot, Build',
            description: 'The play-to-earn bubble burst. Games shut down one by one. But the same year, I walked into my freshman year of college — and found a new spark. Coding grabbed me the way crypto once did. I dove in, not just to learn programming, but to build something bigger: myself. This was the year I stopped defining myself by one skillset and started becoming both a builder and a leader.',
            tags: ['Freshman Year', 'Web Development', 'Leadership', 'Pivot'],
        },
        {
            year: '2024',
            title: 'Proof of Work, Proof of Connection',
            description: 'I stepped out of my screen and into the real world. Joined blockchain communities, showed up at networking events, and built genuine connections — from students to professionals to high-net-worth individuals. Every conversation taught me something. I started volunteering at events like the Blockchain Campus Conference to gain real experience and, more importantly, to prove my worth to the community through action, not just words.',
            tags: ['Blockchain', 'Networking', 'Volunteer', 'Community Building'],
        },
        {
            year: '2025',
            title: 'The AI Current',
            description: 'AI broke into the mainstream — and it hit me the same way blockchain did years before. I was hooked, fascinated, obsessed. This year I dove deep: learning how AI works, how to wield it, and how to use it as a leverage point in the industry. The same curiosity that once led me to crypto was now pulling me into artificial intelligence — and I knew this was just the beginning.',
            tags: ['Artificial Intelligence', 'Prompt Engineering', 'AI Tools', 'Tech Trends'],
        },
        {
            year: '2026',
            title: 'The Convergence',
            description: 'I\'ve learned AI deeply — enough to know it\'s the future, but also enough to know that without real understanding, it\'s just a chatbot. Mastery is what turns it into leverage, and I\'ve made sure I\'m not just using AI — I\'m maximizing it. But then the question hit me: what if I bring it all together? Crypto, blockchain, and AI. Three revolutions, one vision. The possibilities are infinite — limited only by imagination and the will to solve real problems. Who knows? Maybe I\'m the one who builds what comes next.',
            tags: ['AI Mastery', 'Blockchain', 'Crypto', 'Tech Vision'],
        },
    ];

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        // Resize Lenis if it exists
        const lenis = (window as any).lenis;
        if (lenis) {
            lenis.resize();
        }

        const handleScroll = () => {
            if (!trackRef.current) return;
            const trackRect = trackRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Track relative to viewport
            // Progress starts when the top of the track enters the middle of the screen
            // Progress ends when the bottom of the track reaches the middle of the screen
            const totalTrackHeight = trackRect.height;
            const trackTopFromMiddle = windowHeight / 2 - trackRect.top;

            let progress = trackTopFromMiddle / totalTrackHeight;
            progress = Math.max(0, Math.min(1, progress));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger scroll check on mount and resize
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen w-full bg-black text-white py-24 px-6 md:px-20 lg:px-32 overflow-hidden selection:bg-brand-primary selection:text-black"
        >
            {/* Dynamic drifting background glows */}
            <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
                <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] animate-[drift_25s_ease-in-out_infinite]" />
                <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[150px] animate-[drift_30s_ease-in-out_infinite_reverse]" />
            </div>

            {/* Floating Close Button */}
            <header className="fixed top-8 left-8 md:left-20 z-50">
                <button
                    onClick={onClose}
                    className="group flex items-center gap-3 border border-white/10 hover:border-brand-primary bg-black/40 backdrop-blur-md text-white/70 hover:text-white px-5 py-2.5 rounded-full font-outfit font-bold transition-all duration-300 shadow-xl cursor-pointer"
                >
                    <div className="transition-transform duration-300 group-hover:-translate-x-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em]">Back to Portfolio</span>
                </button>
            </header>

            {/* Header section */}
            <div className="max-w-4xl mx-auto text-center mt-12 mb-32 relative z-10">
                <TimelineReveal className="reveal-blur">
                    <span className="text-xs font-outfit uppercase tracking-[0.4em] text-brand-primary font-bold">
                        My Journey
                    </span>
                </TimelineReveal>
                <TimelineReveal className="reveal-converge" delay="delay-100">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-syne font-bold tracking-tight mt-4 mb-6">
                        Know More About Me
                    </h1>
                </TimelineReveal>
                <TimelineReveal className="reveal-blur" delay="delay-200">
                    <p className="text-lg md:text-xl text-white/60 font-outfit max-w-3xl mx-auto leading-relaxed">
                        I wasn't always an IT student. Before the code, I was just an Axie player — fascinated by how blockchain worked beneath the surface. That game was my breaking point. It opened the door to crypto and blockchain, and from that moment, I never looked back. I've been a blockchain enthusiast ever since.
                    </p>
                    <p className="text-lg md:text-xl text-white/60 font-outfit max-w-3xl mx-auto leading-relaxed mt-6">
                        Now AI is the next frontier pulling my curiosity — and I'm diving in. I want to explore how crypto, blockchain, and AI can converge into something powerful. I don't have all the answers yet. But that's the story I'm writing.
                    </p>
                </TimelineReveal>
            </div>

            {/* Timeline Section */}
            <div className="max-w-7xl mx-auto relative z-10">
                {/* The Timeline Track wrapper */}
                <div ref={trackRef} className="relative min-h-[150vh]">
                    {/* Centered vertical track line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 rounded-full overflow-hidden">
                        {/* The active progress line that grows on scroll */}
                        <div
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full transition-all duration-75 ease-out origin-top"
                            style={{
                                height: `${scrollProgress * 100}%`,
                            }}
                        />
                    </div>

                    {/* Timeline Nodes & Milestones */}
                    <div className="flex flex-col gap-32 md:gap-48 relative">
                        {milestones.map((milestone, index) => {
                            // Calculate target scroll percentage for this item
                            const itemProgress = index / (milestones.length - 1);
                            // Active if scrollProgress has passed this milestone's position (with minor tolerance)
                            const isActive = scrollProgress >= itemProgress - 0.05;

                            return (
                                <div
                                    key={milestone.year}
                                    className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                        }`}
                                >
                                    {/* Timeline Dot (Node) */}
                                    <div
                                        className="absolute left-[20px] md:left-1/2 top-6 w-6 h-6 -translate-x-1/2 flex items-center justify-center z-20"
                                    >
                                        {/* Inner glowing dot */}
                                        <div
                                            className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${isActive
                                                    ? 'bg-brand-primary scale-125 shadow-[0_0_15px_#00ffaa,0_0_30px_#00ffaa]'
                                                    : 'bg-neutral-700 scale-100'
                                                }`}
                                        />
                                        {/* Outer pulse ring */}
                                        <div
                                            className={`absolute inset-0 rounded-full border transition-all duration-700 ${isActive
                                                    ? 'border-brand-primary/40 scale-150 animate-ping opacity-60'
                                                    : 'border-transparent scale-100 opacity-0'
                                                }`}
                                        />
                                    </div>

                                    {/* Spacer for alternating layout on desktop */}
                                    <div className="w-full md:w-1/2" />

                                    {/* Content Card Container */}
                                    <div
                                        className={`w-full md:w-1/2 pl-12 pr-0 flex justify-start ${
                                            index % 2 === 0
                                                ? 'md:pl-0 md:pr-16 md:justify-end'
                                                : 'md:pl-16 md:pr-0'
                                        }`}
                                    >
                                        <TimelineReveal
                                            className={index % 2 === 0 ? 'reveal-left' : 'reveal-right'}
                                        >
                                            <div
                                                className={`group relative max-w-lg bg-neutral-950/60 border rounded-2xl p-6 md:p-8 backdrop-blur-md transition-all duration-500 ${isActive
                                                        ? 'border-white/10 hover:border-brand-primary/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,255,170,0.1)]'
                                                        : 'border-white/5 opacity-50'
                                                    }`}
                                            >
                                                {/* Interactive floating indicator card highlight */}
                                                <div
                                                    className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-primary to-brand-secondary transition-opacity duration-500 rounded-t-2xl ${isActive ? 'opacity-100' : 'opacity-0'
                                                        }`}
                                                />

                                                {/* Year Display */}
                                                <span
                                                    className={`inline-block font-syne font-extrabold text-4xl md:text-5xl tracking-tight transition-colors duration-500 ${isActive ? 'text-brand-primary' : 'text-white/20'
                                                        }`}
                                                >
                                                    {milestone.year}
                                                </span>

                                                {/* Card Title */}
                                                <h3 className="font-syne font-bold text-xl md:text-2xl mt-2 mb-4 group-hover:text-brand-primary transition-colors duration-300">
                                                    {milestone.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="font-outfit text-white/70 text-sm md:text-base leading-relaxed mb-6 font-normal">
                                                    {milestone.description}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    {milestone.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className={`text-[10px] font-outfit uppercase tracking-widest font-bold px-3 py-1 rounded-full border transition-all duration-500 ${isActive
                                                                    ? 'bg-brand-primary/5 border-brand-primary/20 text-brand-primary group-hover:bg-brand-primary/10'
                                                                    : 'bg-white/5 border-white/5 text-white/30'
                                                                }`}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </TimelineReveal>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Area */}
            <footer className="max-w-4xl mx-auto text-center mt-32 relative z-10">
                <TimelineReveal className="reveal-blur">
                    <div className="flex flex-col items-center gap-6">
                        <div className="h-12 w-px bg-gradient-to-b from-brand-secondary to-transparent" />
                        <span className="text-xs font-outfit uppercase tracking-[0.4em] text-white/40">
                            End of Journey
                        </span>
                        <button
                            onClick={onClose}
                            className="group relative flex items-center gap-4 bg-brand-primary text-black px-8 py-4 rounded-full font-outfit font-bold transition-all duration-500 hover:bg-brand-secondary shadow-[0_10px_35px_rgba(0,255,170,0.3)] hover:shadow-[0_15px_40px_rgba(0,204,255,0.4)] cursor-pointer"
                        >
                            <span>Back to Portfolio</span>
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>
                </TimelineReveal>
            </footer>
        </div>
    );
};

export default MoreAboutMe;

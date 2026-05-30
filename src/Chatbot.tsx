import React, { useEffect, useRef, useState } from 'react';

// FAQ Chatbot Datatypes
interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

interface FAQQuestion {
    id: string;
    question: string;
    answer: string;
}

interface FAQCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
    questions: FAQQuestion[];
}

// Local FAQ Database containing milestones, project details, and availability details
const FAQ_DATA: FAQCategory[] = [
    {
        id: 'projects',
        label: 'Projects & Skills',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.5A2.25 2.25 0 0 1 21.75 21H2.25A2.25 2.25 0 0 1 0 18.75v-4.5A2.25 2.25 0 0 1 2.25 13.5Z" />
            </svg>
        ),
        questions: [
            {
                id: 'p1',
                question: 'What is your primary project management experience?',
                answer: 'I served as the Project Manager & Lead Developer for Feasify, a collaborative web-based feasibility study portal. I also managed Unity game projects like "Rise of the Bakunawa", leading the team to win 1st Place in People\'s Choice at a university event.'
            },
            {
                id: 'p2',
                question: 'What is AttendScan and how did you build it?',
                answer: 'AttendScan is a smart attendance tracker built with React, TypeScript, and Firebase. It uses dynamic QR codes and includes location validation. I pivoted it from a React Native + Expo structure to web React to optimize real-time dashboard analytics.'
            },
            {
                id: 'p3',
                question: 'What are your core technical developer skills?',
                answer: 'My primary frontend stack is React, TypeScript, and TailwindCSS. For game development, I use Unity and C#. For backend databases, I am highly proficient with Firebase (NoSQL).'
            }
        ]
    },
    {
        id: 'collaboration',
        label: 'Availability & Location',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m0 0-.003-.034A5.99 5.99 0 0 1 12 12.75a5.99 5.99 0 0 1 6 5.969m-12 0a6.063 6.063 0 0 1-3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.002.031c0 .225-.013.447-.037.666A11.944 11.944 0 0 1 12 21c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0 1 18 18.72Z" />
            </svg>
        ),
        questions: [
            {
                id: 'c1',
                question: 'Are you currently looking for full-time job roles?',
                answer: 'Yes! I am actively looking for positions where I can bring value as a Frontend Web Developer, Fullstack Engineer, or Associate Project Manager.'
            },
            {
                id: 'c2',
                question: 'Are you open to freelance projects?',
                answer: 'Definitely. I am open to web development contracts, UX designs, landing pages, and interactive dashboards. Get in touch via the email link below to chat about your project requirements.'
            },
            {
                id: 'c3',
                question: 'Where are you based and can you work remotely?',
                answer: 'I am based in the Philippines. I am fully equipped and highly experienced in collaborating asynchronously across different international time zones, having previously managed global Web3 teams.'
            }
        ]
    },
    {
        id: 'story',
        label: 'My Background Story',
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
        ),
        questions: [
            {
                id: 's1',
                question: 'How did you start in tech and blockchain?',
                answer: 'I started in 2021 as a player in Axie Infinity. Intrigued by play-to-earn tokenomics, I became community manager for Solybird in 2022, leading teams globally. This built my core operations and coordination foundations.'
            },
            {
                id: 's2',
                question: 'Why did you pivot to coding?',
                answer: 'When the play-to-earn cycle cooled down, I entered college and discovered coding. I realized that rather than just navigating platforms, I wanted to build them. That pivot ignited a passion for web engineering and project execution.'
            },
            {
                id: 's3',
                question: 'What is your interest in AI?',
                answer: 'I view AI as the ultimate leverage. I have learned to utilize prompt engineering and modern developer frameworks to build and optimize apps much faster. I am focused on the convergence of AI, web frontend, and blockchain.'
            }
        ]
    }
];

// Component for scroll reveal animation locally used inside chatbot transitions
const RevealItem = React.memo(function RevealItem({
    children,
    delay = "",
    className = "",
    forceVisible = false
}: {
    children?: React.ReactNode,
    delay?: string,
    className?: string,
    forceVisible?: boolean
}) {
    const [isRevealed, setIsRevealed] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (forceVisible) {
            setIsRevealed(true);
            return;
        }
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
    }, [forceVisible]);

    return (
        <div
            ref={ref}
            className={`reveal-item ${isRevealed ? 'is-revealed' : ''} ${delay} ${className}`}
        >
            {children}
        </div>
    );
});

const SHORT_LABELS: Record<string, string> = {
    projects: 'Projects',
    collaboration: 'Availability',
    story: 'Story'
};

interface ChatbotProps {
    onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = React.memo(({ onClose }) => {
    const INITIAL_GREETING: ChatMessage = {
        id: 'greeting',
        sender: 'bot',
        text: "Hi there! I'm Ken's portfolio assistant. Click on any question on the left and I'll tell you more about his projects, skills, or background!",
        timestamp: new Date()
    };

    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
    const [clickedIds, setClickedIds] = useState<Set<string>>(new Set());
    const [isTyping, setIsTyping] = useState(false);
    const [activeCat, setActiveCat] = useState('projects');
    const viewportRef = useRef<HTMLDivElement>(null);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            setAnimateIn(true);
        }, 150); // Sync animation reveal with split-screen split transition
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (viewport) {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleOverflow = () => {
            if (messages.length > 3 && viewport.scrollHeight > viewport.clientHeight) {
                setMessages(prev => {
                    if (prev.length <= 3) return prev;
                    // Keep the greeting (index 0) and remove the oldest user-bot exchange (index 1 & 2)
                    return [prev[0], ...prev.slice(3)];
                });
            }
        };

        const rafId = requestAnimationFrame(handleOverflow);
        return () => cancelAnimationFrame(rafId);
    }, [messages, isTyping]);

    const handleQuestionClick = (q: FAQQuestion) => {
        if (isTyping) return;

        // Add to clicked set
        setClickedIds(prev => new Set(prev).add(q.id));

        // Append user message
        const userMsg: ChatMessage = {
            id: `msg-user-${Date.now()}`,
            sender: 'user',
            text: q.question,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Simulate typing indicator latency
        setTimeout(() => {
            const botMsg: ChatMessage = {
                id: `msg-bot-${Date.now()}`,
                sender: 'bot',
                text: q.answer,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 750);
    };

    const handleClearChat = () => {
        setMessages([INITIAL_GREETING]);
        setClickedIds(new Set());
        setIsTyping(false);
    };

    const [displayedCat, setDisplayedCat] = useState(activeCat);
    const [isTransitioningCat, setIsTransitioningCat] = useState(false);

    useEffect(() => {
        if (activeCat === displayedCat) return;

        setIsTransitioningCat(true);
        const timer = setTimeout(() => {
            setDisplayedCat(activeCat);
            setIsTransitioningCat(false);
        }, 200); // duration of fade-out transition

        return () => clearTimeout(timer);
    }, [activeCat, displayedCat]);

    const activeCategoryData = FAQ_DATA.find(cat => cat.id === displayedCat);
    const currentQuestions = activeCategoryData ? activeCategoryData.questions : [];

    return (
        <div
            className="fixed inset-0 bg-black text-white px-4 md:px-20 lg:px-32 overflow-hidden selection:bg-brand-primary selection:text-black flex flex-col items-center justify-center z-40"
        >
            {/* Dynamic drifting background glows */}
            <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${animateIn ? 'opacity-40' : 'opacity-0'}`}>
                <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] animate-[drift_25s_ease-in-out_infinite]" />
                <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[150px] animate-[drift_30s_ease-in-out_infinite_reverse]" />
            </div>

            {/* Floating Close Button */}
            <header className="fixed top-4 left-4 md:top-8 md:left-20 z-50">
                <button
                    onClick={onClose}
                    className="group flex items-center gap-2 md:gap-3 border border-white/10 hover:border-brand-primary bg-black/40 backdrop-blur-md text-white/70 hover:text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-outfit font-bold transition-all duration-300 active:scale-95 shadow-xl cursor-pointer"
                >
                    <div className="transition-transform duration-300 group-hover:-translate-x-1">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em]">Back to Portfolio</span>
                </button>
            </header>

            {/* Centered Content Wrapper */}
            <div className="max-w-6xl w-full flex flex-col items-center justify-center relative z-10 gap-4 md:gap-8 mt-12 md:mt-0">
                {/* Header section */}
                <div className="max-w-4xl text-center">
                    <RevealItem className="chatbot-header-reveal" forceVisible={animateIn}>
                        <span className="text-xs font-outfit uppercase tracking-[0.4em] text-brand-primary font-bold">
                            Chat Assistant
                        </span>
                    </RevealItem>
                    <RevealItem className="chatbot-header-reveal hidden sm:block" delay="delay-200" forceVisible={animateIn}>
                        <p className="text-sm md:text-base text-white/60 font-outfit max-w-2xl mx-auto leading-relaxed mt-2">
                            Have questions about Ken's coding skills, project history, or work availability? Click a topic and query the automated assistant below.
                        </p>
                    </RevealItem>
                </div>

                {/* Content Columns */}
                <RevealItem className="chatbot-panel-reveal w-full" delay="delay-300" forceVisible={animateIn}>
                    <div className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8 flex flex-col lg:flex-row gap-4 lg:gap-8 text-left shadow-2xl h-[calc(100dvh-130px)] min-h-[460px] lg:h-[530px]">
                        {/* Left Column: Control Panel */}
                        <div className="w-full lg:w-2/5 flex flex-col h-[180px] lg:h-full gap-3 lg:gap-6 justify-between overflow-hidden shrink-0">
                            {/* Category Tabs */}
                            <div className="grid grid-cols-3 lg:flex lg:flex-col gap-1 sm:gap-1.5 md:gap-2 pb-2.5 lg:pb-0 border-b lg:border-b-0 border-white/5 shrink-0">
                                {FAQ_DATA.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCat(cat.id)}
                                        className={`flex items-center justify-center gap-1 sm:gap-2 px-1 py-2 lg:px-5 lg:py-3.5 rounded-full text-[8px] xs:text-[9.5px] sm:text-[10px] lg:text-xs font-outfit uppercase tracking-[0.02em] xs:tracking-[0.1em] sm:tracking-[0.2em] font-bold transition-all duration-300 active:scale-95 cursor-pointer ${activeCat === cat.id
                                            ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <span className="flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4">
                                            {cat.icon}
                                        </span>
                                        <span className="hidden sm:inline">{cat.label}</span>
                                        <span className="sm:hidden">{SHORT_LABELS[cat.id] || cat.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Questions List */}
                            <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
                                <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold block px-2 mb-0.5 shrink-0">Select a Question</span>
                                <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 scrollbar-none">
                                    {currentQuestions.map((q, index) => {
                                        const isClicked = clickedIds.has(q.id);
                                        return (
                                            <button
                                                key={q.id}
                                                disabled={isTyping}
                                                onClick={() => handleQuestionClick(q)}
                                                style={{
                                                    transitionDelay: isTransitioningCat ? '0ms' : `${index * 60}ms`
                                                }}
                                                className={`group w-full text-left p-2.5 lg:p-3.5 rounded-xl lg:rounded-2xl text-[11px] lg:text-xs font-outfit leading-relaxed border transition-all duration-[350ms] transform active:scale-[0.98] hover:translate-x-1 cursor-pointer shrink-0 ${isTransitioningCat
                                                    ? 'opacity-0 -translate-y-2 scale-[0.98] pointer-events-none'
                                                    : 'opacity-100 translate-y-0 scale-100'
                                                    } ${isTyping
                                                        ? 'opacity-50 cursor-not-allowed border-transparent'
                                                        : isClicked
                                                            ? 'bg-white/[0.02] border-white/5 text-white/30 hover:text-white/60'
                                                            : 'bg-white/5 border-white/10 hover:border-brand-primary/40 text-white/80 hover:text-white shadow-sm hover:shadow-md'
                                                    }`}
                                            >
                                                {q.question}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Status Widget */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 shrink-0 font-outfit mt-1 hidden lg:block">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold">Developer Profile</span>
                                    <div className="flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-0.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                        <span className="text-[9px] text-brand-primary font-bold uppercase tracking-wider">Available</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-[11px] leading-none">
                                        <span className="text-white/40">Roles:</span>
                                        <span className="text-white/80 font-medium">Project manager | Web dev</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Chat Box */}
                        <div className="w-full lg:w-3/5 flex flex-col flex-1 lg:h-full border border-white/10 bg-white/[0.01] backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl min-h-0">
                            {/* Header with control actions */}
                            <div className="px-3.5 py-2.5 lg:px-4 lg:py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[9px] lg:text-[10px] font-outfit font-bold text-white/90 uppercase tracking-widest">Kench Assistant</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleClearChat}
                                        className="text-[9px] lg:text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {/* Message Log Viewport */}
                            <div
                                ref={viewportRef}
                                className="flex-1 overflow-y-auto p-3.5 md:p-4 flex flex-col gap-3.5 md:gap-4 scroll-smooth scrollbar-none"
                            >
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                                            } animate-message`}
                                    >
                                        <div
                                            className={`px-4 py-3 rounded-2xl text-xs md:text-sm font-outfit leading-relaxed ${msg.sender === 'user'
                                                ? 'bg-brand-primary text-black rounded-tr-none font-medium'
                                                : 'bg-white/10 border border-white/5 text-white/90 rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-[9px] text-white/40 mt-1 px-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="self-start flex flex-col max-w-[85%] items-start animate-message">
                                        <div className="bg-white/10 border border-white/5 text-neutral-400 px-4 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                            <span className="dot-bounce"></span>
                                            <span className="dot-bounce"></span>
                                            <span className="dot-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Connections Footer */}
                            <div className="px-3.5 py-2.5 lg:px-4 lg:py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
                                <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold hidden sm:inline">Quick Links</span>
                                <div className="flex gap-1.5 md:gap-2 w-full sm:w-auto justify-around sm:justify-end">
                                    <a
                                        href="mailto:contact@example.com"
                                        className="flex items-center gap-1 px-2 py-1 lg:px-3 lg:py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-brand-primary/30 text-white/70 hover:text-white text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
                                    >
                                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        Email
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/kench-loyola-31b230291/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-2 py-1 lg:px-3 lg:py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-brand-primary/30 text-white/70 hover:text-white text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
                                    >
                                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://github.com/kench001"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-2 py-1 lg:px-3 lg:py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-brand-primary/30 text-white/70 hover:text-white text-[9px] lg:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
                                    >
                                        <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </RevealItem>
            </div>
        </div>
    );
});

export default Chatbot;

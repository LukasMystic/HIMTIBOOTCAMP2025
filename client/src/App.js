import React, { useState, useRef, useEffect, useMemo } from 'react';
import CyberpunkGame from './CyberpunkGame';
import AdminPage from './AdminPage.js';
import NotFound from './NotFound.js';
import MouseBackground from './MouseBackground';
import Seo from './Seo.jsx';

const REGISTRATION_API_URL = `${process.env.REACT_APP_BASE_API_URL}/api/register`;
const SETTINGS_API_URL = `${process.env.REACT_APP_BASE_API_URL}/api/settings/registration`;

const useIntersectionObserver = (options) => {
  const [entry, setEntry] = useState(null);
  const [node, setNode] = useState(null);
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntry(entry);
        if (node) observer.current.unobserve(node);
      }
    }, options);

    if (node) observer.current.observe(node);
    return () => observer.current.disconnect();
  }, [node, options]);

  return [setNode, entry];
};

const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();

    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
    if (countDown < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
};

const GlitchStyles = () => (
    <style>{`
        .glitch {
            position: relative;
            color: white;
            animation: glitch-skew 1s infinite linear alternate-reverse;
        }
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0d0d0d;
            overflow: hidden;
        }
        .glitch::before {
            left: 2px;
            text-shadow: -2px 0 #ff00ff;
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            animation: glitch-anim-1 4s infinite linear alternate-reverse;
        }
        .glitch::after {
            left: -2px;
            text-shadow: -2px 0 #00ffff, 2px 2px #ff00ff;
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
            animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 { 0% { clip-path: polygon(0 2%, 100% 2%, 100% 45%, 0 45%); } 5% { clip-path: polygon(0 78%, 100% 78%, 100% 100%, 0 100%); } 10% { clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%); } 100% { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); } }
        @keyframes glitch-anim-2 { 0% { clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); } 100% { clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%); } }
        @keyframes glitch-skew { 0% { transform: skew(0deg); } 50% { transform: skew(1deg); } 100% { transform: skew(-1deg); } }
        
        .section-separator-line {
            animation: separator-anim 5s infinite linear;
        }
        @keyframes separator-anim {
            0% { stroke-dashoffset: 1000; }
            100% { stroke-dashoffset: 0; }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0d0d0d;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #ff00ff, #00ffff);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #ff4dff, #4dffff);
        }

        @keyframes slide-up {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-left {
            0% { transform: translateX(-30px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-right {
            0% { transform: translateX(30px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        @keyframes scale-in {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }

        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-left { animation: slide-left 0.8s ease-out; }
        .animate-slide-right { animation: slide-right 0.8s ease-out; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .floating-logo {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
            0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.2); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4); }
            100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.2); }
        }
        .glow-button {
            animation: glow-pulse 3s infinite ease-in-out;
        }

        @keyframes glitch-flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
            20%, 22%, 55% { opacity: 0.8; }
        }
        .flicker-title {
            animation: glitch-flicker 2s infinite;
        }

        @keyframes card-hover-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }
        .card-hover:hover {
            animation: card-hover-float 0.6s ease-in-out;
        }

        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
        @keyframes blink {
            50% { opacity: 0; }
        }
        .blinking-caret {
            font-weight: bold;
            animation: blink 1s step-end infinite;
        }

        @keyframes scan-lines {
            0% { background-position: 0 0; }
            100% { background-position: 0 100px; }
        }
        .scan-overlay {
            pointer-events: none;
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.02),
                rgba(255, 255, 255, 0.02) 2px,
                transparent 2px,
                transparent 4px
            );
            animation: scan-lines 3s linear infinite;
            z-index: 1;
        }

        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2.4); opacity: 0; }
        }
        .pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        @keyframes bounce-in {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        .bounce-in {
            animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        .nav-slide-down {
            animation: nav-slide-down 0.3s ease-out;
        }
        @keyframes nav-slide-down {
            0% { transform: translateY(-100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }

        .mobile-menu-slide {
            animation: mobile-menu-slide 0.3s ease-out;
        }
        @keyframes mobile-menu-slide {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }

        .parallax-bg {
            transform: translateZ(0);
        }

        @media (max-width: 768px) {
            .mobile-spacing { margin: 1rem 0; }
            .mobile-text-sm { font-size: 0.875rem; }
            .mobile-padding { padding: 1rem; }
        }
    `}</style>
);

// Icons
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-4 h-4 md:w-5 md:h-5 mr-2 text-cyan-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-4 h-4 md:w-5 md:h-5 mr-2 text-cyan-400"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const ModelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 20V10.2c0-1.2.6-2.3 1.7-2.9l4-2.3c1-.6 2.3-.6 3.3 0l4 2.3c1.1.6 1.7 1.7 1.7 2.9V20"/><path d="M8 14v6"/><path d="M16 14v6"/><path d="M12 12v8"/><path d="M12 12l4-2.3"/><path d="M12 12 8 9.7"/><path d="m8.8 7.5-4 2.3"/><path d="M15.2 7.5l4 2.3"/><path d="M12 6V2l-2 2"/><path d="M12 2l2 2"/></svg>;
const DeployIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 1-3-3V8a3 3 0 0 1-3-3H2a7 7 0 0 0 7 7v4a3 3 0 0 1 3 3z"/><path d="M12 10V8a2 2 0 1 0-4 0v2"/><path d="M18 12h4v4a2 2 0 0 1-2 2h-2v-6z"/><path d="M22 13V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const DataIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
// Add this with your other icon components
// Replace your current WhatsappIcon with this
const WhatsappIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-2"
    viewBox="0 0 32 32"
    fill="currentColor"
  >
    <path d="M16 .667C7.64.667.667 7.64.667 16c0 2.833.733 5.587 2.133 8.04L.667 31.333l7.52-2.08A15.26 15.26 0 0 0 16 31.333c8.36 0 15.333-6.973 15.333-15.333S24.36.667 16 .667zm0 27.2c-2.56 0-5.04-.693-7.2-2l-.507-.307-4.467 1.227 1.2-4.48-.293-.48A12.19 12.19 0 0 1 3.8 16c0-6.747 5.453-12.2 12.2-12.2s12.2 5.453 12.2 12.2S22.747 27.867 16 27.867zm7.027-9.413c-.387-.2-2.28-1.12-2.627-1.253-.36-.133-.627-.2-.893.2s-1.027 1.253-1.253 1.52c-.227.253-.467.28-.853.093-.387-.2-1.64-.6-3.12-1.92-1.147-1.013-1.92-2.253-2.147-2.64-.227-.387-.024-.6.173-.8.173-.173.387-.467.587-.693.2-.227.267-.387.4-.627.133-.253.067-.467-.027-.667-.093-.2-.827-2-1.133-2.747-.3-.72-.6-.627-.827-.64h-.707c-.24 0-.64.093-.973.467-.333.373-1.28 1.253-1.28 3.053s1.307 3.547 1.493 3.787c.187.24 2.56 3.907 6.213 5.467.867.373 1.547.6 2.08.773.88.28 1.68.24 2.307.147.707-.107 2.28-.933 2.6-1.84.32-.907.32-1.68.227-1.84-.093-.16-.36-.267-.747-.467z"/>
  </svg>
);

// Social Media Icons
const InstagramIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedinIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const XIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const FacebookIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const WebsiteIcon = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;

const AnimatedCircuitBackground = () => (
    <div className="scan-overlay absolute top-0 left-0 w-full h-full overflow-hidden z-0 bg-[#0d0d0d] parallax-bg">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3e003e33,transparent)]"></div>
    </div>
);

const AnimatedSection = React.forwardRef(({ children, className = '', id = '', animationType = 'slide-up' }, ref) => {
    const [setNode, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = entry?.isIntersecting;

    const internalRef = (node) => {
        setNode(node);
        if (ref) {
            if (typeof ref === 'function') {
                ref(node);
            } else {
                ref.current = node;
            }
        }
    };

    const getAnimationClass = () => {
        if (!isVisible) return 'opacity-0';
        
        switch (animationType) {
            case 'slide-left': return 'animate-slide-left';
            case 'slide-right': return 'animate-slide-right';
            case 'fade-in': return 'animate-fade-in';
            case 'scale-in': return 'animate-scale-in';
            default: return 'animate-slide-up';
        }
    };

    return (
        <div 
            id={id} 
            ref={internalRef} 
            className={`transition-opacity duration-300 ${className} ${getAnimationClass()}`}
        >
            {children}
        </div>
    );
});

const SectionSeparator = () => (
    <div className="w-full h-16 md:h-20 flex items-center justify-center my-6 md:my-8" aria-hidden="true">
        <svg width="min(300px, 90vw)" height="20" className="overflow-visible">
            <defs>
                <filter id="glitch-glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <line x1="0" y1="10" x2="100%" y2="10" stroke="#ff00ff" strokeWidth="2" filter="url(#glitch-glow)" className="section-separator-line" strokeDasharray="50 100" />
            <line x1="0" y1="10" x2="100%" y2="10" stroke="#00ffff" strokeWidth="2" filter="url(#glitch-glow)" className="section-separator-line" strokeDasharray="50 100" style={{ animationDelay: '-2.5s' }} />
        </svg>
    </div>
);

const CountdownTimer = ({ targetDate }) => {
    const { days, hours, minutes, seconds } = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <span className="text-xl md:text-2xl font-bold text-cyan-400 tracking-wider animate-fade-in">See you at the event!</span>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-4 gap-2 md:gap-6">
                {[
                    { value: days, label: 'days' },
                    { value: hours, label: 'hours' },
                    { value: minutes, label: 'mins' },
                    { value: seconds, label: 'secs' }
                ].map((item, index) => (
                    <div key={item.label} className={`flex flex-col items-center bounce-in stagger-${index + 1}`}>
                        <div className="relative">
                            <div className="bg-slate-900/80 border-2 border-fuchsia-500/50 rounded-lg p-2 md:p-4 min-w-[60px] md:min-w-[80px]">
                                <span className="text-xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 block">
                                    {String(item.value).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg opacity-20 pulse-ring"></div>
                        </div>
                        <span className="text-xs md:text-sm uppercase tracking-wider text-slate-400 mt-2">{item.label}</span>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-slate-500 text-xs tracking-wider animate-fade-in">or until seats are full</p>
        </div>
    );
};

const ConfirmationModal = ({ data, onConfirm, onCancel, isLoading }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="w-full max-w-md bg-[#0d0d0d] border-2 border-fuchsia-500/50 rounded-xl shadow-2xl p-6 space-y-6 animate-scale-in">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Confirm Your Data</h2>
            <div className="space-y-3 text-sm max-h-64 overflow-y-auto">
                {Object.entries(data).map(([key, value]) => {
                    if (key === 'imagePreview' && value) {
                        return (
                            <div key={key} className="flex flex-col border-b border-slate-700 pb-2">
                                <span className="font-bold text-cyan-300 capitalize mb-2">Payment Proof</span>
                                <img src={value} alt="Payment proof preview" className="rounded-lg max-h-32 w-auto object-contain" />
                            </div>
                        )
                    }
                    if (key !== 'imagePreview') {
                        return (
                            <div key={key} className="flex flex-col border-b border-slate-700 pb-2">
                                <span className="font-bold text-cyan-300 capitalize text-xs">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="text-slate-200 text-sm break-words">{value}</span>
                            </div>
                        )
                    }
                    return null;
                })}
            </div>
            <div className="flex flex-col gap-3 pt-4">
                <button onClick={onConfirm} disabled={isLoading} className="w-full px-6 py-3 border-2 border-fuchsia-500 rounded-lg text-white bg-fuchsia-500/20 hover:bg-fuchsia-500/40 transition-all transform hover:scale-105 disabled:opacity-50">
                    {isLoading ? 'Processing...' : 'Confirm & Submit'}
                </button>
                <button onClick={onCancel} disabled={isLoading} className="w-full px-6 py-2 border-2 border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">Edit</button>
            </div>
        </div>
    </div>
);

const RegistrationForm = ({ onSuccessfulRegistration, isRegistrationOpen, isLoadingStatus }) => {
  const [formData, setFormData] = useState({ fullName: '', nim: '', binusianEmail: '', privateEmail: '', phone: '', major: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const majors = ["Computer Science", "Visual Communication Design", "Public Relations", "Communication", "Entrepreneurship Business Creation", "Digital Business Innovation", "Interactive Design & Technology", "Digital Psychology", "Interior Design"];

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'File is too large. Maximum size is 5MB.' });
            setImage(null);
            setImagePreview('');
            e.target.value = null; 
            return;
        }
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setMessage(null);
    }
  };

 const handlePreSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    if (!image) {
        setMessage({ type: 'error', text: 'Please upload your proof of payment.' });
        return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(image.type)) {
        setMessage({ type: 'error', text: 'Only .png, .jpg, .jpeg format allowed!' });
        return;
    }

    if (/\d/.test(formData.fullName)) { setMessage({ type: 'error', text: 'Full name cannot contain numbers.' }); return; }
    if (isNaN(parseInt(formData.nim))) { setMessage({ type: 'error', text: 'NIM must be a number.' }); return; }
    if (!formData.binusianEmail.endsWith('@binus.ac.id')) { setMessage({ type: 'error', text: 'Please use a valid Binusian email ending with @binus.ac.id.' }); return; }
    if (formData.privateEmail === formData.binusianEmail) { setMessage({ type: 'error', text: 'Private email cannot be the same as your Binusian email.' }); return; }
    if (!formData.phone.startsWith('08')) { setMessage({ type: 'error', text: 'Phone number must start with "08".' }); return; }
    if (formData.phone.length < 10 || formData.phone.length > 13) { setMessage({ type: 'error', text: 'Phone number must be between 10 and 13 digits.' }); return; }
    
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setMessage(null);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', image);

    try {
      const response = await fetch(REGISTRATION_API_URL, { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');
      onSuccessfulRegistration();
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };
  
  if (isLoadingStatus) {
    return (
        <div className="w-full max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 space-y-8 border border-fuchsia-500/50 shadow-fuchsia-500/20 text-center animate-scale-in">
            <h2 className="text-xl md:text-2xl font-bold text-cyan-400">Checking Registration Status...</h2>
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    );
  }

  if (!isRegistrationOpen) {
    return (
        <div className="w-full max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 space-y-8 border border-red-500/50 shadow-red-500/20 text-center animate-scale-in">
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Registration Is Currently Closed</h2>
            <p className="text-slate-400">Please check back later or contact an administrator.</p>
        </div>
    );
  }

  return (
    <>
      {isModalOpen && <ConfirmationModal data={{...formData, imagePreview}} onConfirm={handleConfirmSubmit} onCancel={() => setIsModalOpen(false)} isLoading={isLoading} />}
      <div className="w-full max-w-4xl mx-auto bg-black/50 backdrop-blur-md rounded-xl shadow-2xl p-4 md:p-8 space-y-6 border border-fuchsia-500/50 shadow-fuchsia-500/20 animate-scale-in">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Join the Network</h2>
          <p className="text-slate-400 mt-2">Integrate your potential. Register now.</p>
        </div>
        <form onSubmit={handlePreSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="animate-slide-left stagger-1">
                <label htmlFor="fullName" className="block text-sm font-medium text-cyan-300 mb-2">Full Name</label>
                <input type="text" name="fullName" id="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" />
              </div>
              <div className="animate-slide-right stagger-1">
                <label htmlFor="nim" className="block text-sm font-medium text-cyan-300 mb-2">NIM</label>
                <input type="text" name="nim" id="nim" required value={formData.nim} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" />
              </div>
              <div className="animate-slide-left stagger-2">
                <label htmlFor="binusianEmail" className="block text-sm font-medium text-cyan-300 mb-2">Binusian Email</label>
                <input type="email" name="binusianEmail" id="binusianEmail" required value={formData.binusianEmail} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" />
              </div>
              <div className="animate-slide-right stagger-2">
                <label htmlFor="privateEmail" className="block text-sm font-medium text-cyan-300 mb-2">Private Email</label>
                <input type="email" name="privateEmail" id="privateEmail" required value={formData.privateEmail} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" />
              </div>
              <div className="animate-slide-left stagger-3">
                <label htmlFor="phone" className="block text-sm font-medium text-cyan-300 mb-2">Phone Number</label>
                <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" />
              </div>
              <div className="animate-slide-right stagger-3">
                <label htmlFor="major" className="block text-sm font-medium text-cyan-300 mb-2">Major</label>
                <select name="major" id="major" required value={formData.major} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all">
                  <option value="" disabled>Select a Major</option>
                  {majors.map(major => <option key={major} value={major}>{major}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 animate-slide-up stagger-4">
                <label htmlFor="image" className="block text-sm font-medium text-cyan-300 mb-2">Upload Payment Proof (max 5MB)</label>
                <input type="file" name="image" id="image" required accept="image/png, image/jpeg, image/jpg, image/gif" onChange={handleImageChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-500/20 file:text-fuchsia-300 hover:file:bg-fuchsia-500/40 file:transition-all" />
                {imagePreview && (
                  <div className="mt-3">
                    <img src={imagePreview} alt="Payment proof preview" className="max-h-32 rounded-lg border border-slate-600" />
                  </div>
                )}
              </div>
            </div>
            <div className="animate-slide-up stagger-4">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-4 px-4 border-2 border-fuchsia-500 rounded-lg shadow-lg text-sm font-bold text-white bg-fuchsia-500/20 hover:bg-fuchsia-500/40 hover:shadow-fuchsia-500/50 focus:outline-none transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none">
                {isLoading ? 'Processing...' : 'Review & Submit'}
              </button>
            </div>
        </form>
        {message && (
          <div className={`p-4 mt-6 rounded-lg text-sm border-2 animate-slide-up ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50'}`}>
            {message.text}
          </div>
        )}
      </div>
    </>
  );
};

const PaymentDetails = () => {
    const [copied, setCopied] = useState(false);
    const accountNumber = '6105415226';
    const amount = 'IDR 65.000';

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 border border-cyan-500/50 shadow-cyan-500/20 mb-8 animate-scale-in">
            <h3 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Payment Details</h3>
            <div className="mt-6 flex flex-col items-center gap-4">
                <div className="animate-slide-up stagger-1">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png" alt="BCA Logo" className="h-8 bg-white px-3 py-1 rounded-md" />
                </div>
                <div className="text-center mt-2 animate-slide-up stagger-2">
                    <p className="text-slate-400 text-sm">Transfer Amount</p>
                    <p className="text-cyan-300 text-2xl md:text-3xl font-bold tracking-wider">{amount}</p>
                </div>
                <div className="text-center animate-slide-up stagger-3">
                    <p className="text-slate-200 text-xl md:text-2xl font-mono tracking-wider">{accountNumber}</p>
                    <p className="text-slate-400 text-sm">a/n ANDREAS EDWARD PUTRA JATMIKO</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="px-6 py-2 text-sm border-2 border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 hover:border-slate-500 transition-all transform hover:scale-105 animate-slide-up stagger-4"
                >
                    {copied ? 'Copied!' : 'Copy Account Number'}
                </button>
            </div>
            <div className="mt-6 text-center text-xs text-amber-400/80 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg animate-slide-up stagger-4">
                <p className="font-bold">Important:</p>
                <p>One payment transfer is valid for one participant only. Please do not combine payments for multiple people.</p>
            </div>
        </div>
    );
};

const SuccessView = ({ onUndo }) => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative overflow-hidden">
        <AnimatedCircuitBackground />
        <div className="relative z-10 w-full max-w-2xl mx-auto bg-black/50 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 space-y-8 border border-green-500/50 shadow-green-500/20 animate-scale-in">
            <div className="animate-slide-up">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Registration Complete</h2>
                <p className="text-slate-300 text-base md:text-lg mt-4">Your node has been successfully added to the network.</p>
            </div>
            <div className="text-left p-4 border border-cyan-500/30 rounded-lg bg-black/20 animate-slide-up stagger-1">
                <h3 className="text-lg font-bold text-cyan-300">Final Steps:</h3>
                <ol className="list-decimal list-inside mt-2 space-y-2 text-slate-300 text-sm">
                    <li>
                        Ensure your payment of <strong className="text-white">IDR 65.000</strong> has been sent to the account below.
                        <div className="mt-2 p-2 bg-slate-900/50 rounded-md text-center">
                           <p className="font-mono text-white">BCA: 6105415226</p>
                           <p className="text-xs text-slate-400">a/n ANDREAS EDWARD PUTRA JATMIKO</p>
                        </div>
                    </li>
                    <li>Join our WhatsApp group to receive all bootcamp communications and updates. This is mandatory.</li>
                </ol>
            </div>
            <a href="https://chat.whatsapp.com/FoiQcXxAwz7BmOWQUyj4S0" target="_blank" rel="noopener noreferrer" className="inline-block w-full py-4 bg-green-500/20 text-green-300 border-2 border-green-500 rounded-lg font-semibold shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:bg-green-500/30 hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all transform hover:scale-105 animate-slide-up stagger-2">
                Join WhatsApp Group
            </a>
            <button onClick={onUndo} className="mt-4 text-sm text-slate-500 hover:text-cyan-400 transition-colors animate-slide-up stagger-3">
                ← Back to Home
            </button>
        </div>
    </div>
);

const FaqItem = ({ item, index, activeIndex, setActiveIndex }) => {
    const isOpen = index === activeIndex;
    return (
        <div className="border-b border-fuchsia-500/20 last:border-b-0">
            <button onClick={() => setActiveIndex(isOpen ? null : index)} className="w-full flex justify-between items-center text-left py-4 hover:bg-slate-900/30 transition-colors rounded-lg px-2">
                <span className="text-base md:text-lg font-semibold text-cyan-300 pr-4">{item.question}</span>
                <span className={`transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDownIcon />
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                <div className="px-2">
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">{item.answer}</p>
                </div>
            </div>
        </div>
    );
};

const Navbar = ({ navLinks, onLinkClick, activeSection }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedGroup, setExpandedGroup] = useState(null);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Group navigation links for better mobile experience
    const navGroups = {
        'Info': ['About', 'Guidebook', 'Speaker'],
        'Event': ['Gallery', 'Timeline', 'FAQ'],
        'Action': ['Register', 'Game']
    };

    const NavLink = ({ link, isMobile = false }) => (
        <button
            onClick={() => {
                onLinkClick(link.ref);
                setMobileMenuOpen(false);
            }}
            className={`${isMobile ? 'block w-full text-left px-4 py-2' : 'px-3 py-2'} relative text-slate-300 hover:text-cyan-400 rounded-md text-sm font-medium transition-colors group`}
        >
            {link.name}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === link.id ? 'scale-x-100' : ''}`}></span>
        </button>
    );

    const MobileNavGroup = ({ groupName, links }) => {
        const isExpanded = expandedGroup === groupName;
        
        return (
            <div className="border-b border-slate-700">
                <button 
                    onClick={() => setExpandedGroup(isExpanded ? null : groupName)}
                    className="w-full flex justify-between items-center px-4 py-3 text-left text-cyan-300 hover:bg-slate-800/50 transition-colors"
                >
                    <span className="font-medium">{groupName}</span>
                    <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                        <ChevronDownIcon />
                    </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-48' : 'max-h-0'}`}>
                    <div className="bg-slate-900/30">
                        {links.map((linkName) => {
                            const link = navLinks.find(l => l.name === linkName);
                            return link ? <NavLink key={link.name} link={link} isMobile={true} /> : null;
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isVisible || isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20 bg-black/70 backdrop-blur-md border-b border-fuchsia-500/30 rounded-b-xl px-4 md:px-6 nav-slide-down">
                    <div className="flex items-center gap-3 md:gap-4">
                        <img src="/assets/Logo HIMTI.png" alt="HIMTI Logo" className="h-6 w-6 md:h-8 md:w-8" />
                        <img src="/assets/Logo_bootcamp.png" alt="Bootcamp Logo" className="h-8 w-auto md:h-10" />
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden lg:block">
                        <div className="flex items-baseline space-x-1">
                            {navLinks.slice(0, 6).map((link) => <NavLink key={link.name} link={link} />)}
                        </div>
                    </div>
                    
                    {/* Mobile/Tablet Menu Button */}
                    <div className="lg:hidden">
                        <button 
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
                            className="text-slate-300 hover:text-white p-2 rounded-md transition-colors"
                        >
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile/Tablet Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-black/90 backdrop-blur-md rounded-b-xl mx-4 mt-1 mobile-menu-slide">
                    <div className="py-2">
                        {Object.entries(navGroups).map(([groupName, links]) => (
                            <MobileNavGroup key={groupName} groupName={groupName} links={links} />
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        if (!isAutoPlaying) return;
        
        resetTimeout();
        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)),
            4000
        );
        return () => resetTimeout();
    }, [currentIndex, images.length, isAutoPlaying]);

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const goToSlide = (slideIndex) => {
        setIsAutoPlaying(false);
        setCurrentIndex(slideIndex);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto h-64 md:h-96 lg:h-[500px]">
            <div className="w-full h-full rounded-xl overflow-hidden relative shadow-2xl shadow-fuchsia-500/20 card-hover">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    >
                        <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                ))}
            </div>
            
            {/* Navigation Arrows */}
            <button onClick={goToPrevious} className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full hover:bg-black/70 transition-all z-10 backdrop-blur-sm hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={goToNext} className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 md:p-3 rounded-full hover:bg-black/70 transition-all z-10 backdrop-blur-sm hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-fuchsia-500 scale-125' : 'bg-gray-500/50 hover:bg-gray-400/70'}`}
                    ></button>
                ))}
            </div>
            
            {/* Image Counter */}
            <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-black/50 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const sectionRefs = useMemo(() => ({
      about: React.createRef(),
      poster: React.createRef(),
      guidebook: React.createRef(),
      speaker: React.createRef(),
      timeline: React.createRef(),
      faq: React.createRef(),
      register: React.createRef(),
      game: React.createRef(),
      gallery: React.createRef(),
  }), []);

  useEffect(() => {
    const checkStatus = async () => {
        try {
            const response = await fetch(SETTINGS_API_URL);
            const data = await response.json();
            if (response.ok) {
                setIsRegistrationOpen(data.isOpen);
            }
        } catch (error) {
            setIsRegistrationOpen(false);
            console.error('Failed to fetch registration status:', error);
        } finally {
            setIsLoadingStatus(false);
        }
    };
    checkStatus();
  }, []);

  const navLinks = useMemo(() => [
      { name: 'About', ref: sectionRefs.about, id: 'about' },
      { name: 'Guidebook', ref: sectionRefs.guidebook, id: 'guidebook' },
      { name: 'Speaker', ref: sectionRefs.speaker, id: 'speaker' },
      { name: 'Gallery', ref: sectionRefs.gallery, id: 'gallery' },
      { name: 'Timeline', ref: sectionRefs.timeline, id: 'timeline' },
      { name: 'FAQ', ref: sectionRefs.faq, id: 'faq' },
      { name: 'Register', ref: sectionRefs.register, id: 'register' },
      { name: 'Game', ref: sectionRefs.game, id: 'game' },
  ], [sectionRefs]);

  const handleScrollToRef = (ref) => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

const Typewriter = React.memo(({ text, speed = 50 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return (
        <span>
            {displayedText}
            {displayedText.length === text.length ? null : <span className="blinking-caret">|</span>}
        </span>
    );
});

const memoizedTypewriter = useMemo(() => (
  <Typewriter text="Practical AI: Hands-on AI Deployment." />
), []);

  useEffect(() => {
      const observer = new IntersectionObserver(
          (entries) => {
              entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                      setActiveSection(entry.target.id);
                  }
              });
          },
          { rootMargin: '-40% 0px -60% 0px' }
      );

      const refs = Object.values(sectionRefs);
      refs.forEach((ref) => {
          if (ref.current) {
              observer.observe(ref.current);
          }
      });

      return () => {
          refs.forEach((ref) => {
              if (ref.current) {
                  observer.unobserve(ref.current);
              }
          });
      };
  }, [sectionRefs]);

  const [, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (event) => setMousePos({ x: event.clientX, y: event.clientY });
    const isTouchDevice = 'ontouchstart' in window;
    if (!isTouchDevice) {
        window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
        if (!isTouchDevice) {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    };
  }, []);

  const schedule = [
    { day: 'Day 1: Oct 2', topic: 'Basic Python for AI' },
    { day: 'Day 2: Oct 4', topic: 'Data Understanding and Preprocessing' },
    { day: 'Day 3: Oct 5', topic: 'Machine Learning Fundamentals' },
    { day: 'Day 4: Oct 11', topic: 'Introduction to Deployment Concepts' },
    { day: 'Day 5: Oct 12', topic: 'End-to-end Workflow' }
  ];

  const learningPoints = [
    { icon: <DataIcon />, title: "Data Processing", description: "Learn to clean, process, and prepare datasets for machine learning." },
    { icon: <ModelIcon />, title: "Model Training", description: "Build and train various AI models, including neural networks." },
    { icon: <DeployIcon />, title: "Live Deployment", description: "Deploy your trained models as interactive web applications." },
  ];

  
  const galleryImages = [
    '/assets/20241012_085651439_iOS.jpg',
    '/assets/20241012_091012373_iOS.jpg',
    '/assets/20241012_102635608_iOS.jpg',
    '/assets/Zoom_QBbuLw0I5u.png',
    '/assets/asset1.png',
    '/assets/asset2.png',
    '/assets/20241012_060343214_iOS.jpg',
    '/assets/20241012_060959526_iOS.jpg',
    '/assets/20241012_064649559_iOS 1.jpg',
    '/assets/20241012_102616970_iOS.jpg'
  ];
  
  const speakers = [
    {
      name: 'Ikhwan Iqbal',
      title: 'CEO Boring AI',
      imageSrc: '/assets/pengajar.png',
      portfolio: 'https://ikhwaniqbal.com/',
      description: 'Ikhwan Iqbal is an AI engineer, computer vision specialist, and software developer with expertise in deep learning, data science, and web application development. He is the founder and current CEO of Boring AI.'
    }
  ];

  const faqItems = [
    { question: 'What are the prerequisites for this bootcamp?', answer: 'A basic understanding of programming concepts (preferably Python) is recommended. No prior AI/ML experience is necessary, as we will cover the fundamentals.' },
    { question: 'Will I get a certificate upon completion?', answer: 'Yes, all participants who successfully complete the bootcamp projects and attend all sessions will receive a digital certificate of completion from HIMTI.' },
    { question: 'Is the bootcamp fully online?', answer: 'Yes, all sessions, workshops, and project showcases will be conducted online. You will receive links to the virtual platforms upon successful registration.' },
    { question: 'What software will I need?', answer: 'You will need a stable internet connection, a modern web browser, and a code editor like VS Code. We will be using cloud-based environments like Google Colab for most of the coding, so no powerful local machine is required.' },
  ];

 // NOTE: Add your real sponsor logos and links here. These are placeholders.
//  const sponsors = [
//     { name: 'Dicoding', logoSrc: '/assets/dicoding.png', url: 'https://www.dicoding.com/', style: 'landscape' },
  
//  ];

 const mediaPartners = [
    { name: 'HIMDKV', logoSrc: '/assets/himdkv.png', url: 'https://student-activity.binus.ac.id/himdkv/', style: 'square' },
    { name: 'BNCC', logoSrc: '/assets/bncc.png', url: 'https://bncc.net/', style: 'landscape' },
];
  const path = window.location.pathname;
  if (path === '/admin') {
    return <AdminPage />;
  }
  if (path !== '/') {
      return <NotFound />;
  }

  if (isSubmitted) {
      return <SuccessView onUndo={() => setIsSubmitted(false)} />;
  }

  return (
    <div className="bg-[#0d0d0d] text-slate-200 font-sans overflow-x-hidden">
    <Seo 
        title="Home"
        description="Join the HIMTI AI Bootcamp 2025, a 5-day intensive program designed to take you from the fundamentals of machine learning to deploying your own AI models."
        keywords={['AI', 'Bootcamp', 'HIMTI', 'Machine Learning', 'Python', 'Webinar Tech']}
        image="/assets/poster.png" 
      />
      
      <GlitchStyles />
      <Navbar navLinks={navLinks} onLinkClick={handleScrollToRef} activeSection={activeSection} />
      
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
        <AnimatedCircuitBackground />
        <MouseBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d] z-20"></div>
        
        <div className="relative z-30 flex flex-col items-center max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 animate-slide-up">
                <img src="/assets/Logo HIMTI.png" alt="HIMTI Logo" className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain floating-logo" style={{filter: 'drop-shadow(0 0 10px #00ffff) brightness(1.2)'}} />
                <img src="/assets/Logo_bootcamp.png" alt="Bootcamp Logo" className="h-12 w-auto md:h-16 lg:h-20 floating-logo" style={{animationDelay: '-3s', filter: 'drop-shadow(0 0 10px #ff00ff) brightness(1.2)'}} />
            </div>
            
            <h1 className="glitch text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 mb-6 animate-slide-up stagger-1" data-text="HIMTI AI Bootcamp 2025" style={{textShadow: '0 0 15px rgba(255, 0, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.5)'}}>
                HIMTI AI Bootcamp 2025
            </h1>
            
            <div className="mt-4 text-sm md:text-lg lg:text-xl text-slate-300 max-w-4xl h-16 md:h-12 animate-slide-up stagger-2">
                {memoizedTypewriter}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center text-sm md:text-base animate-slide-up stagger-3">
                <div className="flex items-center text-slate-300"><CalendarIcon /> Oct 2, 4, 5, 11, & 12, 2025</div>
                <div className="hidden sm:block text-slate-600">|</div>
                <div className="flex items-center text-slate-300"><GlobeIcon /> Online Event</div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up stagger-4">
                <button onClick={() => handleScrollToRef(sectionRefs.register)} className="glow-button px-6 md:px-8 py-3 md:py-4 bg-cyan-400/10 text-cyan-300 border-2 border-cyan-400 rounded-lg font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all transform hover:scale-105 text-sm md:text-base">
                  Register Now
                </button>
                <button onClick={() => handleScrollToRef(sectionRefs.about)} className="px-6 md:px-8 py-3 md:py-4 bg-slate-800/50 text-slate-300 border-2 border-slate-600 rounded-lg font-semibold hover:bg-slate-700/50 hover:border-slate-500 transition-all transform hover:scale-105 text-sm md:text-base">
                  Learn More
                </button>
            </div>
        </div>
      </div>
      
      <main className="py-12 md:py-16 lg:py-20 px-4 md:px-8 space-y-12 md:space-y-16 lg:space-y-20 relative z-10">
        {/* About Section */}
        <AnimatedSection id="about" ref={sectionRefs.about} animationType="fade-in">
            <section className="max-w-4xl mx-auto text-center">
                <h2 className="flicker-title text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Bootcamp Protocol</h2>
                <p className="text-slate-300 text-base md:text-lg lg:text-xl leading-relaxed">
                   This isn't just another workshop. The HIMTI AI Bootcamp is a 5-day intensive program designed to take you from the fundamentals of machine learning to deploying your own AI models. You'll work on hands-on projects, gain insights from industry-relevant case studies, and build practical skills that you can apply directly to your own projects.
                </p>
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        {/* Poster Section */}
        <AnimatedSection ref={sectionRefs.poster} animationType="scale-in">
            <section className="max-w-xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Event Poster</h2>
                <div className="bg-black/50 p-2 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500 transition-all duration-300 card-hover shadow-2xl">
                    <img src="/assets/poster.png" alt="Event Poster" className="w-full h-auto object-cover rounded-lg" />
                </div>
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        {/* Guidebook Section */}
        <AnimatedSection id="guidebook" ref={sectionRefs.guidebook} animationType="slide-left">
            <section className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Event Guidebook</h2>
                <div className="bg-black/50 p-3 md:p-4 rounded-xl border border-cyan-500/30 shadow-2xl mb-8">
                    <iframe
                        src="/assets/guidebook.pdf"
                        title="Event Guidebook"
                        className="w-full h-[400px] md:h-[600px] rounded-lg border-0"
                    ></iframe>
                </div>
                <div className="text-center">
                    <a
                        href="/assets/guidebook.pdf"
                        download="HIMTI-AI-Bootcamp-2025-Guidebook.pdf"
                        className="glow-button inline-block px-6 md:px-8 py-3 md:py-4 bg-cyan-400/10 text-cyan-300 border-2 border-cyan-400 rounded-lg font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all transform hover:scale-105"
                    >
                        Download Guidebook (PDF)
                    </a>
                </div>
            </section>
        </AnimatedSection>

        <SectionSeparator />
        
        {/* Registration Status */}
        <AnimatedSection animationType="bounce-in">
            <section className="max-w-5xl mx-auto flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Registration Status</h2>
                {isLoadingStatus ? (
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl md:text-2xl font-bold text-cyan-400">Checking...</h3>
                        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isRegistrationOpen ? (
                    <CountdownTimer targetDate="2025-10-01T23:59:59" />
                ) : (
                    <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Registration Is Currently Closed</h3>
                )}
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        {/* Speaker Section */}
        <AnimatedSection id="speaker" ref={sectionRefs.speaker} animationType="slide-right">
            <section className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Meet the Speaker</h2>
                <div className="flex justify-center">
                    {speakers.map((speaker, index) => (
                        <div key={index} className="bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-fuchsia-500/30 transition-all duration-300 hover:border-fuchsia-500 hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] card-hover max-w-2xl">
                            <div className="text-center mb-6">
                                <img src={speaker.imageSrc} alt={speaker.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-fuchsia-500/50 object-cover mx-auto mb-4"/>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{speaker.name}</h3>
                                <p className="text-cyan-400 text-base md:text-lg">{speaker.title}</p>
                            </div>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">{speaker.description}</p>
                            <div className="text-center">
                                <a href={speaker.portfolio} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 border-2 border-cyan-500/50 rounded-lg text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500 transition-all font-semibold transform hover:scale-105">
                                    View Portfolio
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        {/* Core Modules */}
        <AnimatedSection animationType="slide-up">
            <section className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Core Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {learningPoints.map((point, index) => (
                        <div key={index} className={`bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-cyan-500/30 text-center transition-all duration-300 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] card-hover animate-slide-up stagger-${index + 1}`}>
                            <div className="text-cyan-400 mb-4 flex justify-center" style={{filter: 'drop-shadow(0 0 5px #00ffff)'}}>
                                {React.cloneElement(point.icon, { className: 'w-12 h-12' })}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{point.title}</h3>
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed">{point.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </AnimatedSection>
        
        <SectionSeparator />
        
        {/* Gallery Section */}
        <AnimatedSection id="gallery" ref={sectionRefs.gallery} animationType="fade-in">
            <section className="max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Archived Gallery</h2>
                <Carousel images={galleryImages} />
            </section>
        </AnimatedSection>
        
        <SectionSeparator />
        
        {/* Timeline Section */}
        <AnimatedSection id="timeline" ref={sectionRefs.timeline} animationType="slide-left">
            <section className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Mission Timeline</h2>
                <div className="space-y-4 md:space-y-6">
                    {schedule.map((item, index) => (
                        <div key={index} className={`bg-slate-900/80 border-l-4 border-cyan-400 p-4 md:p-6 rounded-r-xl flex flex-col sm:flex-row sm:items-center transition-all hover:bg-slate-800 card-hover animate-slide-left stagger-${index + 1}`}>
                            <div className="text-cyan-400 font-bold text-base md:text-lg mb-2 sm:mb-0 sm:mr-6 flex-shrink-0">
                                {item.day.split(':')[0]}
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm md:text-base">{item.day.split(':')[1]}</div>
                                <p className="text-slate-400 text-sm md:text-base">{item.topic}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        {/* FAQ Section */}
        <AnimatedSection id="faq" ref={sectionRefs.faq} animationType="scale-in">
            <section className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Frequently Asked Questions</h2>
                <div className="bg-black/30 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-fuchsia-500/30">
                    {faqItems.map((item, index) => (
                        <FaqItem key={index} item={item} index={index} activeIndex={activeFaqIndex} setActiveIndex={setActiveFaqIndex} />
                    ))}
                </div>
            </section>
        </AnimatedSection>
{/*
<SectionSeparator />

<AnimatedSection animationType="slide-up">
    <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Our Sponsors</h2>
        <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12">
            {sponsors.map((sponsor, index) => {
                const containerClasses = sponsor.style === 'square'
                    ? 'w-32 h-32' 
                    : 'w-56 h-32'; 
                
                return (
                    <div key={index} className={`flex flex-col items-center gap-3 animate-slide-up stagger-${index + 1}`}>
                        <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                            <div className={`${containerClasses} flex items-center justify-center p-3 bg-white rounded-xl border border-slate-700 hover:border-slate-500 transition-all card-hover`}>
                               <img 
                                   src={sponsor.logoSrc} 
                                   alt={sponsor.name} 
                                   className="max-h-full max-w-full object-contain transition-all duration-300" 
                               />
                            </div>
                        </a>
                        <p className="text-slate-300 font-semibold">{sponsor.name}</p>
                    </div>
                );
            })}
        </div>

    </section>
</AnimatedSection>
*/}

{/* Media Partners Section */}
<AnimatedSection animationType="slide-up">
    {/* Using max-w-4xl here as well */}
    <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Media Partners</h2>
        <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12">
            {mediaPartners.map((partner, index) => {
                // Slightly larger container classes
                const containerClasses = partner.style === 'square'
                    ? 'w-32 h-32' 
                    : 'w-56 h-32'; 
                
                return (
                    // Each item is now a flex column to hold the logo and name
                    <div key={index} className={`flex flex-col items-center gap-3 animate-slide-up stagger-${index + 1}`}>
                        <a href={partner.url} target="_blank" rel="noopener noreferrer">
                            <div className={`${containerClasses} flex items-center justify-center p-3 bg-white rounded-xl border border-slate-700 hover:border-slate-500 transition-all card-hover`}>
                               <img 
                                   src={partner.logoSrc} 
                                   alt={partner.name} 
                                   className="max-h-full max-w-full object-contain transition-all duration-300" 
                               />
                            </div>
                        </a>
                        {/* Added the name below the logo */}
                        <p className="text-slate-300 font-semibold">{partner.name}</p>
                    </div>
                );
            })}
        </div>
    </section>
</AnimatedSection>
        
        <SectionSeparator />

        {/* Registration Section */}
        <AnimatedSection id="register" ref={sectionRefs.register}>
            <section className="pt-8 md:pt-16">
              <PaymentDetails />
              <RegistrationForm 
                onSuccessfulRegistration={() => setIsSubmitted(true)} 
                isRegistrationOpen={isRegistrationOpen}
                isLoadingStatus={isLoadingStatus}
              />
            </section>
        </AnimatedSection>

        <SectionSeparator />

        {/* Game Section */}
<AnimatedSection id="game" ref={sectionRefs.game}>
    <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
            Ready for a Challenge?
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
            While you wait for the bootcamp to begin, test your reflexes in our cyberpunk-themed mini-game. Navigate the data stream, avoid the firewalls, and see how high you can score!
        </p>
        <CyberpunkGame />
    </section>
</AnimatedSection>
      </main>

<footer className="bg-[#0d0d0d] border-t border-slate-800 py-10 md:py-16 text-center text-slate-500 relative z-10 mt-20">
    <div className="max-w-6xl mx-auto px-4">
        {/* New Contact Section */}
        <div className="mb-10">
            <h3 className="text-lg font-bold text-cyan-300 mb-2">Have Questions?</h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                If you need more information about the registration process, schedule, or bootcamp materials, please don't hesitate to reach out to our team.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-x-8 gap-y-6">
                {/* Calista */}
                <div className="flex flex-col items-center">
                    <p className="font-semibold text-white text-lg">Calista</p>
                    <a 
                        href="https://wa.me/6287812231471"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600/80 hover:bg-green-700/80 transition-all transform hover:scale-105"
                    >
                        <WhatsappIcon />
                        +62 878-1223-1471
                    </a>
                </div>
                {/* Flou */}
                <div className="flex flex-col items-center">
                    <p className="font-semibold text-white text-lg">Flou</p>
                    <a 
                        href="https://wa.me/62895341740988"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600/80 hover:bg-green-700/80 transition-all transform hover:scale-105"
                    >
                        <WhatsappIcon />
                        +62 895-3417-40988
                    </a>
                </div>
            </div>
        </div>

        {/* Horizontal Separator */}
        <div className="w-1/3 mx-auto border-t border-slate-700 my-8"></div>

        {/* Original Footer Content */}
        <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap mb-6">
            <a href="https://ofog.himtibinus.or.id/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110" title="Website"><WebsiteIcon /></a>
            <a href="https://www.instagram.com/himti.mlg/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110" title="Instagram"><InstagramIcon /></a>
            <a href="https://student-activity.binus.ac.id/himti/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110" title="Binus University">
                <img src="https://upload.wikimedia.org/wikipedia/id/a/a2/Logo_Binus_University.png" alt="Binus University Logo" className="w-5 h-5 md:w-6 md:h-6 object-contain filter grayscale hover:grayscale-0 transition-all" />
            </a>
            <a href="https://www.linkedin.com/company/himti-binus-university/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110" title="LinkedIn"><LinkedinIcon /></a>
            <a href="https://x.com/HimtiBinus" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110" title="X"><XIcon /></a>
            <a href="https://www.facebook.com/himtibinus?locale=id_ID" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110" title="Facebook"><FacebookIcon /></a>
        </div>
        <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} Himpunan Mahasiswa Teknik Informatika (HIMTI). All Rights Reserved.</p>
    </div>
</footer>
    </div>
  );
}

export default App;
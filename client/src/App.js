import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import CyberpunkGame from './CyberpunkGame';
import AdminPage from './AdminPage.js';
import NotFound from './NotFound.js';
import MouseBackground from './MouseBackground';


const REGISTRATION_API_URL = `${process.env.BASE_API_URL}/api/register`;
const SETTINGS_API_URL = `${process.env.BASE_API_URL}/api/settings/registration`;

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


// --- Glitch Effect & Custom Scrollbar CSS ---
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

        /* Custom Scrollbar For Webkit Browsers (Chrome, Safari) */
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: #0d0d0d;
            border-left: 1px solid #333;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #ff00ff, #00ffff);
            border-radius: 6px;
            border: 2px solid #0d0d0d;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #ff4dff, #4dffff);
        }

        /* ADDED: More fluid countdown animation */
        @keyframes slide-down {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0); }
        }
        .digit-slot {
            display: inline-block;
            animation: slide-down 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .floating-logo {
            animation: float 6s ease-in-out infinite;
        }
        /* --- NEW ANIMATIONS --- */

        @keyframes glow-pulse {
        0% {
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.2), 0 0 10px rgba(0, 255, 255, 0.2);
        }
        50% {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.6);
        }
        100% {
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.2), 0 0 10px rgba(0, 255, 255, 0.2);
        }
        }
        .glow-button {
        animation: glow-pulse 3s infinite ease-in-out;
        }

        @keyframes glitch-flicker {
        0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
        }
        20%, 22%, 55% {
            opacity: 0.6;
        }
        }
        .flicker-title {
        animation: glitch-flicker 2s infinite;
        }

        @keyframes card-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
        }
        .card-float {
        animation: card-float 6s ease-in-out infinite;
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

    `}</style>
);

// --- Reusable AI-themed Icon Components ---
const CalendarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 mr-2 text-cyan-400"> <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line> </svg> );
const GlobeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 mr-2 text-cyan-400"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> );
const ModelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 20V10.2c0-1.2.6-2.3 1.7-2.9l4-2.3c1-.6 2.3-.6 3.3 0l4 2.3c1.1.6 1.7 1.7 1.7 2.9V20"/><path d="M8 14v6"/><path d="M16 14v6"/><path d="M12 12v8"/><path d="M12 12l4-2.3"/><path d="M12 12 8 9.7"/><path d="m8.8 7.5-4 2.3"/><path d="M15.2 7.5l4 2.3"/><path d="M12 6V2l-2 2"/><path d="M12 2l2 2"/></svg>;
const DeployIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 1-3-3V8a3 3 0 0 1-3-3H2a7 7 0 0 0 7 7v4a3 3 0 0 1 3 3z"/><path d="M12 10V8a2 2 0 1 0-4 0v2"/><path d="M18 12h4v4a2 2 0 0 1-2 2h-2v-6z"/><path d="M22 13V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const DataIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect></svg>;

// --- Footer Social Icons ---
const InstagramIcon = () => ( <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect> <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path> <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line> </svg> );
const LinkedinIcon = () => ( <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path> <rect x="2" y="9" width="4" height="12"></rect> <circle cx="4" cy="4" r="2"></circle> </svg> );
const XIcon = () => ( <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> </svg> );
const FacebookIcon = () => ( <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path> </svg> );
const WebsiteIcon = () => ( <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg> );

// --- Animated Background Component ---
const AnimatedCircuitBackground = () => ( <div className="scan-overlay absolute top-0 left-0 w-full h-full overflow-hidden z-0 bg-[#0d0d0d]"> <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div> <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e003e33,transparent)]"></div> </div> );

// --- Animated Section Component ---
const AnimatedSection = React.forwardRef(({ children, className = '', id = '' }, ref) => {
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

    return (
        <div id={id} ref={internalRef} className={`transition-all duration-1000 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
});

// --- Section Separator Component ---
const SectionSeparator = () => (
    <div className="w-full h-20 flex items-center justify-center my-8 md:my-12" aria-hidden="true">
        <svg width="300" height="20" className="overflow-visible">
            <defs>
                <filter id="glitch-glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <line x1="0" y1="10" x2="300" y2="10" stroke="#ff00ff" strokeWidth="2" filter="url(#glitch-glow)" className="section-separator-line" strokeDasharray="50 100" />
            <line x1="0" y1="10" x2="300" y2="10" stroke="#00ffff" strokeWidth="2" filter="url(#glitch-glow)" className="section-separator-line" strokeDasharray="50 100" style={{ animationDelay: '-2.5s' }} />
        </svg>
    </div>
);

// --- Countdown Timer Component ---
const CountdownTimer = ({ targetDate }) => {
    const { days, hours, minutes, seconds } = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        return <span className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-widest">See you at the event!</span>;
    }

    // MOBILE-PROOF: Adjusted gaps and font sizes
    return (
        <div className="w-full max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                    <div className="h-16 relative overflow-hidden">
                        <span key={days} className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 digit-slot" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'}}>{days}</span>
                    </div>
                    <span className="text-xs md:text-sm uppercase tracking-widest text-slate-400">days</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-16 relative overflow-hidden">
                        <span key={hours} className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 digit-slot" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'}}>{hours}</span>
                    </div>
                    <span className="text-xs md:text-sm uppercase tracking-widest text-slate-400">hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-16 relative overflow-hidden">
                        <span key={minutes} className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 digit-slot" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'}}>{minutes}</span>
                    </div>
                    <span className="text-xs md:text-sm uppercase tracking-widest text-slate-400">minutes</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="h-16 relative overflow-hidden">
                        <span key={seconds} className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 digit-slot" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'}}>{seconds}</span>
                    </div>
                    <span className="text-xs md:text-sm uppercase tracking-widest text-slate-400">seconds</span>
                </div>
            </div>
            <p className="mt-4 text-slate-500 text-xs tracking-wider">or until seats are full</p>
        </div>
    );
};

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ data, onConfirm, onCancel, isLoading }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md bg-[#0d0d0d] border-2 border-fuchsia-500/50 rounded-lg shadow-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Confirm Your Data</h2>
            <div className="space-y-3 text-xs md:text-sm">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-700 pb-2">
                        <span className="font-bold text-cyan-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-slate-200 text-left sm:text-right break-all">{value}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <button onClick={onCancel} disabled={isLoading} className="px-6 py-2 border-2 border-slate-600 rounded-md text-slate-300 hover:bg-slate-700 transition-colors order-2 sm:order-1">Edit</button>
                <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 border-2 border-fuchsia-500 rounded-md shadow-lg text-sm font-bold text-white bg-fuchsia-500/20 hover:bg-fuchsia-500/40 hover:shadow-fuchsia-500/50 transition-all order-1 sm:order-2">
                    {isLoading ? 'Processing...' : 'Confirm & Submit'}
                </button>
            </div>
        </div>
    </div>
);

// --- Registration Form Component ---
const RegistrationForm = ({ onSuccessfulRegistration, isRegistrationOpen, isLoadingStatus }) => {
  const [formData, setFormData] = useState({ fullName: '', nim: '', binusianEmail: '', privateEmail: '', phone: '', major: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    if (isNaN(parseInt(formData.nim))) {
        setMessage({ type: 'error', text: 'NIM must be a number.' });
        return;
    }
    if (!formData.binusianEmail.endsWith('@binus.ac.id')) {
        setMessage({ type: 'error', text: 'Please use a valid Binusian email ending with @binus.ac.id.' });
        return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const payload = {
          fullName: formData.fullName,
          nim: Number(formData.nim),
          binusianEmail: formData.binusianEmail,
          privateEmail: formData.privateEmail,
          phone: formData.phone,
          major: formData.major,
      };
      const response = await fetch(REGISTRATION_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
        <div className="w-full max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 md:p-8 space-y-8 border border-fuchsia-500/50 shadow-fuchsia-500/20 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-cyan-400">Checking Registration Status...</h2>
        </div>
    );
  }

  if (!isRegistrationOpen) {
    return (
        <div className="w-full max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 md:p-8 space-y-8 border border-red-500/50 shadow-red-500/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Registration Is Currently Closed</h2>
            <p className="text-slate-400 mt-2">Please check back later or contact an administrator.</p>
        </div>
    );
  }

  return (
    <>
      {isModalOpen && <ConfirmationModal data={formData} onConfirm={handleConfirmSubmit} onCancel={() => setIsModalOpen(false)} isLoading={isLoading} />}
      <div className="w-full max-w-3xl mx-auto bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 md:p-8 space-y-8 border border-fuchsia-500/50 shadow-fuchsia-500/20">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Join the Network</h2>
          <p className="text-slate-400 mt-2">Integrate your potential. Register now.</p>
        </div>
        <form onSubmit={handlePreSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div> <label htmlFor="fullName" className="block text-sm font-medium text-cyan-300 mb-2">Full Name</label> <input type="text" name="fullName" id="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" /> </div>
              <div> <label htmlFor="nim" className="block text-sm font-medium text-cyan-300 mb-2">NIM</label> <input type="text" name="nim" id="nim" required value={formData.nim} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" /> </div>
              <div> <label htmlFor="binusianEmail" className="block text-sm font-medium text-cyan-300 mb-2">Binusian Email</label> <input type="email" name="binusianEmail" id="binusianEmail" required value={formData.binusianEmail} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" /> </div>
              <div> <label htmlFor="privateEmail" className="block text-sm font-medium text-cyan-300 mb-2">Private Email</label> <input type="email" name="privateEmail" id="privateEmail" required value={formData.privateEmail} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" /> </div>
              <div> <label htmlFor="phone" className="block text-sm font-medium text-cyan-300 mb-2">Phone Number</label> <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" /> </div>
              <div> <label htmlFor="major" className="block text-sm font-medium text-cyan-300 mb-2">Major</label> <input type="text" name="major" id="major" required value={formData.major} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border-2 border-slate-700 rounded-md text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition-all" /> </div>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border-2 border-fuchsia-500 rounded-md shadow-lg text-sm font-bold text-white bg-fuchsia-500/20 hover:bg-fuchsia-500/40 hover:shadow-fuchsia-500/50 focus:outline-none transition-all transform hover:scale-105">
                Review & Submit
              </button>
            </div>
        </form>
        {message && ( <div className={`p-4 mt-6 rounded-md text-sm border-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50'}`}> {message.text} </div> )}
      </div>
    </>
  );
};


const SuccessView = ({ onUndo }) => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative overflow-hidden">
        <AnimatedCircuitBackground />
        <div className="relative z-10 w-full max-w-2xl mx-auto bg-black/50 backdrop-blur-md rounded-lg shadow-2xl p-6 md:p-8 space-y-8 border border-green-500/50 shadow-green-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Registration Complete</h2>
            <p className="text-slate-300 text-base md:text-lg">Your node has been successfully added to the network.</p>
            <p className="text-slate-400">The final step is to join our WhatsApp group to receive all bootcamp communications and updates.</p>
            <a href="https://chat.whatsapp.com/FoiQcXxAwz7BmOWQUyj4S0" target="_blank" rel="noopener noreferrer" className="inline-block w-full py-4 bg-green-500/20 text-green-300 border-2 border-green-500 rounded-md font-semibold shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:bg-green-500/30 hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all transform hover:scale-105">
                Join WhatsApp Group
            </a>
            <button onClick={onUndo} className="mt-4 text-sm text-slate-500 hover:text-cyan-400 transition-colors">
                &larr; Back to Home
            </button>
        </div>
    </div>
);

// --- FAQ Item Component ---
const FaqItem = ({ item, index, activeIndex, setActiveIndex }) => {
    const isOpen = index === activeIndex;
    return (
        <div className="border-b border-fuchsia-500/20">
            <button onClick={() => setActiveIndex(isOpen ? null : index)} className="w-full flex justify-between items-center text-left py-4">
                <span className="text-base md:text-lg font-semibold text-cyan-300">{item.question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    <svg className="w-6 h-6 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="pb-4 text-slate-400">
                    {item.answer}
                </p>
            </div>
        </div>
    );
};

// --- Navbar Component ---
const Navbar = ({ navLinks, onLinkClick, activeSection }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const NavLink = ({ link }) => (
        <button
            onClick={() => {
                onLinkClick(link.ref);
                setMobileMenuOpen(false);
            }}
            className="block w-full text-left md:w-auto md:text-center relative text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors group"
        >
            {link.name}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${activeSection === link.id ? 'scale-x-100' : ''}`}></span>
        </button>
    );

    return (
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isVisible || isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 bg-black/50 backdrop-blur-md border-b border-fuchsia-500/30 rounded-b-lg px-4 md:px-6">
                    <div className="flex items-center">
                        <img src="/assets/Logo HIMTI.png" alt="HIMTI Logo" className="h-8 w-8" />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => <NavLink key={link.name} link={link} />)}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white p-2 rounded-md">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black/70 backdrop-blur-md rounded-b-lg mx-4 mt-1">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => <NavLink key={link.name} link={link} />)}
                    </div>
                </div>
            )}
        </nav>
    );
};


// --- Main App Component ---
function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const sectionRefs = useMemo(() => ({
      about: React.createRef(),
      speaker: React.createRef(),
      timeline: React.createRef(),
      faq: React.createRef(),
      register: React.createRef(),
      game: React.createRef(),
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
      { name: 'Speaker', ref: sectionRefs.speaker, id: 'speaker' },
      { name: 'Timeline', ref: sectionRefs.timeline, id: 'timeline' },
      { name: 'FAQ', ref: sectionRefs.faq, id: 'faq' },
      { name: 'Register', ref: sectionRefs.register, id: 'register' },
      { name: 'Game', ref: sectionRefs.game, id: 'game' },
  ], [sectionRefs]);

  const handleScrollToRef = (ref) => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


// --- Typewriter Component ---
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
            {/* The caret now disappears when typing is complete */}
            {displayedText.length === text.length ? null : <span className="blinking-caret">|</span>}
        </span>
    );
});
const memoizedTypewriter = useMemo(() => (
  <Typewriter text="From Theory to Deployment: Master the Art of Artificial Intelligence." />
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
          // Adjusted rootMargin for better section highlighting on mobile
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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

  const schedule = [ { day: 'Day 1: Oct 4', topic: 'Foundations of AI & Machine Learning' }, { day: 'Day 2: Oct 5', topic: 'Deep Dive into Neural Networks' }, { day: 'Day 3: Oct 11', topic: 'Building & Training Your First Model' }, { day: 'Day 4: Oct 12', topic: 'AI Deployment & Project Showcase' }, ];
  const learningPoints = [ { icon: <DataIcon />, title: "Data Processing", description: "Learn to clean, process, and prepare datasets for machine learning." }, { icon: <ModelIcon />, title: "Model Training", description: "Build and train various AI models, including neural networks." }, { icon: <DeployIcon />, title: "Live Deployment", description: "Deploy your trained models as interactive web applications." }, ];
  const galleryImages = [ "assets/20241012_085651439_iOS.jpg", "assets/20241012_091012373_iOS.jpg", "assets/Zoom_QBbuLw0I5u.png", "assets/20241012_102635608_iOS.jpg", ];
  
  const speaker = { name: 'Dr. Evelyn Reed', title: 'Lead AI Researcher, Cyberdyne Systems', imageSrc: 'https://placehold.co/400x400/0d0d0d/ff00ff?text=E.R' };

  const faqItems = [
    { question: 'What are the prerequisites for this bootcamp?', answer: 'A basic understanding of programming concepts (preferably Python) is recommended. No prior AI/ML experience is necessary, as we will cover the fundamentals.' },
    { question: 'Will I get a certificate upon completion?', answer: 'Yes, all participants who successfully complete the bootcamp projects and attend all sessions will receive a digital certificate of completion from HIMTI.' },
    { question: 'Is the bootcamp fully online?', answer: 'Yes, all sessions, workshops, and project showcases will be conducted online. You will receive links to the virtual platforms upon successful registration.' },
    { question: 'What software will I need?', answer: 'You will need a stable internet connection, a modern web browser, and a code editor like VS Code. We will be using cloud-based environments like Google Colab for most of the coding, so no powerful local machine is required.' },
  ];

  const sponsors = [
      { name: 'Sponsor 1', logoSrc: 'https://placehold.co/200x100/ffffff/0d0d0d?text=SPONSOR+A' },
      { name: 'Sponsor 2', logoSrc: 'https://placehold.co/200x100/ffffff/0d0d0d?text=SPONSOR+B' },
      { name: 'Sponsor 3', logoSrc: 'https://placehold.co/200x100/ffffff/0d0d0d?text=PARTNER+C' },
      { name: 'Sponsor 4', logoSrc: 'https://placehold.co/200x100/ffffff/0d0d0d?text=PARTNER+D' },
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
    <div className="bg-[#0d0d0d] text-slate-200 font-sans">
      <GlitchStyles />
      <Navbar navLinks={navLinks} onLinkClick={handleScrollToRef} activeSection={activeSection} />
      
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative overflow-hidden">
        <AnimatedCircuitBackground />
        <MouseBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0d] z-20"></div>
        <div className="relative z-30 flex flex-col items-center">
            <img src="/assets/Logo HIMTI.png" alt="HIMTI Logo" className="w-24 h-24 md:w-28 md:h-28 mb-6 floating-logo" style={{filter: 'drop-shadow(0 0 10px #00ffff) drop-shadow(0 0 20px #00ffff) brightness(1.2)'}} />
            
            <h1 className="glitch text-2xl sm:text-3xl md:text-6xl font-bold tracking-normal sm:tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400" data-text="HIMTI AI Bootcamp 2025" style={{textShadow: '0 0 15px rgba(255, 0, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.5)'}}>HIMTI AI Bootcamp 2025</h1>
            
            <p className="mt-4 text-base md:text-xl text-slate-300 max-w-3xl h-24 sm:h-16">
                {memoizedTypewriter}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                <div className="flex items-center text-slate-300"><CalendarIcon /> October 4, 5, 11, & 12, 2025</div>
                <div className="hidden sm:block text-slate-600">|</div>
                <div className="flex items-center text-slate-300"><GlobeIcon /> Online Event</div>
            </div>
            <button onClick={() => handleScrollToRef(sectionRefs.register)} className="glow-button mt-10 px-8 py-3 md:py-4 bg-cyan-400/10 text-cyan-300 border-2 border-cyan-400 rounded-md font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all transform hover:scale-105">
              Initiate Registration
            </button>
        </div>
      </div>
      
      <main className="py-16 md:py-20 px-4 md:px-8 space-y-8 relative z-10">
        <AnimatedSection id="about" ref={sectionRefs.about}> <section className="max-w-4xl mx-auto text-center px-4"> <h2 className="flicker-title text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Bootcamp Protocol</h2> <p className="text-slate-300 text-base md:text-lg leading-relaxed"> This isn't just another workshop. The HIMTI AI Bootcamp is a 4-day intensive program designed to take you from the fundamentals of machine learning to deploying your own AI models. You'll work on hands-on projects, learn from industry-relevant case studies, and collaborate with fellow tech enthusiasts. </p> </section> </AnimatedSection>
        
        <SectionSeparator />
        
        <AnimatedSection>
            <section className="max-w-5xl mx-auto flex flex-col items-center px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Registration Status</h2>
                {isLoadingStatus ? (
                    <h2 className="text-xl md:text-2xl font-bold text-cyan-400">Checking...</h2>
                ) : isRegistrationOpen ? (
                    <CountdownTimer targetDate="2025-09-28T23:59:59" />
                ) : (
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Registration Is Currently Closed</h2>
                )}
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        <AnimatedSection id="speaker" ref={sectionRefs.speaker}>
            <section className="max-w-5xl mx-auto flex flex-col items-center px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Meet the Speaker</h2>
                <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-fuchsia-500/30 text-center flex flex-col items-center transition-all duration-300 hover:border-fuchsia-500 hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] transform hover:-translate-y-2 max-w-sm">
                    <img src={speaker.imageSrc} alt={speaker.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-fuchsia-500/50 object-cover mb-4"/>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{speaker.name}</h3>
                    <p className="text-cyan-400 text-base md:text-md">{speaker.title}</p>
                </div>
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        <AnimatedSection> <section className="max-w-5xl mx-auto px-4"> <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Core Modules</h2> <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {learningPoints.map((point, index) => ( <div key={index} className="card-float bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/30 text-center flex flex-col items-center transition-all duration-300 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"> <div className="text-cyan-400 mb-4" style={{filter: 'drop-shadow(0 0 5px #00ffff)'}}>{React.cloneElement(point.icon, { className: 'w-10 h-10' })}</div> <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3> <p className="text-slate-400 text-sm">{point.description}</p> </div> ))} </div> </section> </AnimatedSection>
        
        <SectionSeparator />
        
        <AnimatedSection> <section className="max-w-6xl mx-auto px-4"> <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Archived Visuals</h2> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {galleryImages.map((src, index) => ( <div key={index} className="card-float bg-black/50 p-2 rounded-lg border border-fuchsia-500/30 hover:border-fuchsia-500 transition-all transform hover:-translate-y-2 duration-300"> <img src={src} alt={`Bootcamp highlight ${index + 1}`} className="w-full h-60 object-cover rounded-md shadow-lg" /> </div> ))} </div> </section> </AnimatedSection>
        
        <SectionSeparator />
        
        <AnimatedSection id="timeline" ref={sectionRefs.timeline}> <section className="max-w-4xl mx-auto px-4"> <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Mission Timeline</h2> <div className="space-y-4"> {schedule.map((item, index) => ( <div key={index} className="card-float bg-slate-900/80 border-l-4 border-cyan-400 p-4 rounded-r-lg flex items-center transition-all hover:bg-slate-800 transform hover:scale-[1.02]"> <div className="text-cyan-400 font-black text-lg mr-4">{item.day.split(':')[0]}</div> <div> <div className="text-white font-bold">{item.day.split(':')[1]}</div> <p className="text-slate-400">{item.topic}</p> </div> </div> ))} </div> </section> </AnimatedSection>
        
        <SectionSeparator />

        <AnimatedSection id="faq" ref={sectionRefs.faq}>
            <section className="max-w-4xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Frequently Asked Questions</h2>
                <div className="bg-black/30 backdrop-blur-sm p-4 md:p-6 rounded-lg border border-fuchsia-500/30">
                    {faqItems.map((item, index) => (
                        <FaqItem key={index} item={item} index={index} activeIndex={activeFaqIndex} setActiveIndex={setActiveFaqIndex} />
                    ))}
                </div>
            </section>
        </AnimatedSection>

        <SectionSeparator />

        <AnimatedSection>
            <section className="max-w-5xl mx-auto text-center px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">Sponsors & Media Partners</h2>
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                    {sponsors.map((sponsor, index) => (
                        <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                           <img src={sponsor.logoSrc} alt={sponsor.name} className="h-10 md:h-12 object-contain filter grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300" />
                        </div>
                    ))}
                </div>
            </section>
        </AnimatedSection>
        
        <SectionSeparator />

        <AnimatedSection id="register" ref={sectionRefs.register}>
            <section className="pt-16 px-4">
              <RegistrationForm 
                onSuccessfulRegistration={() => setIsSubmitted(true)} 
                isRegistrationOpen={isRegistrationOpen}
                isLoadingStatus={isLoadingStatus}
              />
            </section>
        </AnimatedSection>

        <SectionSeparator />

        <AnimatedSection id="game" ref={sectionRefs.game}>
            <CyberpunkGame />
        </AnimatedSection>
      </main>
                    
      <footer className="bg-[#0d0d0d] border-t border-slate-800 py-8 text-center text-slate-500 relative z-10">
        <p className="px-4">&copy; {new Date().getFullYear()} Himpunan Mahasiswa Teknik Informatika (HIMTI). All Rights Reserved.</p>
        
        <div className="flex justify-center items-center gap-5 md:gap-6 mt-6">
            <a href="https://ofog.himtibinus.or.id/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="Website"><WebsiteIcon /></a>
            <a href="https://www.instagram.com/himti.mlg/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="Instagram"><InstagramIcon /></a>
            <a href="https://student-activity.binus.ac.id/himti/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="Binus University">
                <img src="https://upload.wikimedia.org/wikipedia/id/a/a2/Logo_Binus_University.png" alt="Binus University Logo" className="w-6 h-6 object-contain filter grayscale hover:grayscale-0 transition-all" />
            </a>
            <a href="https://www.linkedin.com/company/himti-binus-university/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="LinkedIn"><LinkedinIcon /></a>
            <a href="https://x.com/HimtiBinus" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="X"><XIcon /></a>
            <a href="https://www.facebook.com/himtibinus?locale=id_ID" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors" title="Facebook"><FacebookIcon /></a>
        </div>
      </footer>
    </div>
  );
}

export default App;
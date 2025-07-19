import React from 'react';
const AnimatedCircuitBackground = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e003e33,transparent)]"></div>
    </div>
);


const GlitchStyles = () => (
    <style>{`
        .glitch {
            position: relative;
            color: white;
            animation: glitch-skew 1s infinite linear alternate-reverse;
            font-size: 8rem; /* Larger font size for 404 */
            font-weight: bold;
            line-height: 1;
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
            left: 3px;
            text-shadow: -3px 0 #ff00ff;
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            animation: glitch-anim-1 4s infinite linear alternate-reverse;
        }
        .glitch::after {
            left: -3px;
            text-shadow: -3px 0 #00ffff, 3px 3px #ff00ff;
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
            animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 { 0% { clip-path: polygon(0 2%, 100% 2%, 100% 45%, 0 45%); } 5% { clip-path: polygon(0 78%, 100% 78%, 100% 100%, 0 100%); } 10% { clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%); } 100% { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); } }
        @keyframes glitch-anim-2 { 0% { clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); } 100% { clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%); } }
        @keyframes glitch-skew { 0% { transform: skew(0deg); } 50% { transform: skew(1deg); } 100% { transform: skew(-1deg); } }
    `}</style>
);


const NotFound = () => {
    return (
        <div className="bg-[#0d0d0d] text-slate-200 font-sans min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
            <GlitchStyles />
            <AnimatedCircuitBackground />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="glitch" data-text="404">404</div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 mt-4" style={{textShadow: '0 0 15px rgba(255, 0, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.5)'}}>
                    Signal Lost // Endpoint Not Found
                </h1>
                <p className="mt-4 text-lg text-slate-400 max-w-md">
                    The page you are looking for has been disconnected from the network, moved, or never existed in this reality.
                </p>
                <a 
                    href="/" 
                    className="mt-10 px-8 py-4 bg-cyan-400/10 text-cyan-300 border-2 border-cyan-400 rounded-md font-semibold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all transform hover:scale-105"
                >
                    Return to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;

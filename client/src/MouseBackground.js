import React, { useState, useEffect } from 'react';

const MouseBackground = () => {
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

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 transition duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.1), transparent 80%)`,
      }}
    />
  );
};

export default MouseBackground;

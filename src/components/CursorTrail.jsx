import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CursorTrail = () => {
  const [isVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia("(max-width: 768px)").matches;
  });
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    if (!isVisible) return;

    const dots = document.querySelectorAll(".cursor-trail-dot");
    
    // Track mouse coordinates
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 2. High-performance physics tick driven by GSAP monitor ticker
    const tick = () => {
      let x = mouse.current.x;
      let y = mouse.current.y;
      
      dots.forEach((dot, index) => {
        // Read active coordinates (defaulting to current mouse)
        const currentX = gsap.getProperty(dot, "x") || x;
        const currentY = gsap.getProperty(dot, "y") || y;
        
        // Physics Linear Interpolation (lerp) toward target
        // Outer rings respond slower (creating a lagging elastic string tail)
        const interpolationRate = 0.35 - (index * 0.015);
        const nextX = currentX + (x - currentX) * interpolationRate;
        const nextY = currentY + (y - currentY) * interpolationRate;
        
        gsap.set(dot, { x: nextX, y: nextY });
        
        // Update tail propagation targets
        x = nextX;
        y = nextY;
      });
    };

    gsap.ticker.add(tick);

    // 3. Tactile element hover expansion listeners
    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = target.closest('a, button, [role="button"], select, input, textarea, .cursor-pointer');
      
      if (isClickable) {
        gsap.to(".cursor-trail-dot", {
          scale: 1.8,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          duration: 0.3,
          stagger: 0.015,
          ease: "power2.out"
        });
      } else {
        gsap.to(".cursor-trail-dot", {
          scale: 1,
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          duration: 0.3,
          stagger: 0.01,
          ease: "power2.inOut"
        });
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      gsap.ticker.remove(tick);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="cursor-trail-dot fixed top-0 left-0 rounded-full bg-white/55 pointer-events-none"
          style={{
            // Staggered physical sizes creating a perfect tapered comet tail
            width: `${14 - i * 0.95}px`,
            height: `${14 - i * 0.95}px`,
            opacity: 1 - i * 0.075,
            mixBlendMode: 'difference',
            filter: 'blur(0.5px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import TextScramble from '../components/TextScramble';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Manual Split Animation for Title
      const chars = titleRef.current.querySelectorAll('.char');
      
      gsap.fromTo(chars, 
        { y: 100, autoAlpha: 0 },
        {
          duration: 1.2,
          y: 0,
          autoAlpha: 1,
          stagger: 0.05,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          }
        }
      );

      // Animate the paragraphs
      gsap.fromTo(".about-text", 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-text",
            start: "top 85%",
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Helper to wrap characters for the split effect
  const splitText = (text) => {
    return text.split("").map((char, index) => (
      <span key={index} className="char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pt-48 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-24">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-500 mb-4 overflow-hidden">
            <span className="inline-block animate-pulse">Our Heritage</span>
          </p>
          <h1 
            ref={titleRef} 
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] overflow-hidden"
          >
            {splitText("CRAFTING THE FUTURE")}
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <p className="about-text text-2xl md:text-3xl font-light leading-snug text-gray-300">
              Nick Shoes was founded on a singular vision: to bridge the gap between <span className="text-white font-medium italic">high-end fashion</span> and relentless athletic performance.
            </p>
            <p className="about-text text-lg leading-relaxed text-gray-400">
              Born in the heart of metropolitan innovation, our design studio crafts footwear that commands attention while disappearing on the foot. Every silhouette is a testament to uncompromising quality. 
            </p>
          </div>

          <div className="space-y-8 md:pt-24">
            <p className="about-text text-lg leading-relaxed text-gray-400">
              We source only the finest sustainable materials, integrating proprietary aerodynamic technology to create shoes that aren't just worn—they're experienced. 
            </p>
            <div className="about-text pt-8 border-t border-white/10">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gray-500">
                <span>Established 2026</span>
                <span>London / Tokyo / NYC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Large Quote */}
        <div className="mt-48 text-center overflow-hidden">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              whileHover={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-7xl font-bold uppercase tracking-tighter italic cursor-pointer"
            >
                <TextScramble text="Step into a new paradigm." />
            </motion.h2>
        </div>

      </div>
    </div>
  );
};

export default About;

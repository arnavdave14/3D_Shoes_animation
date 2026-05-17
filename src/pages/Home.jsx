import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const mainRef = useRef(null); // Master ref for all animations
  const scrollSectionRef = useRef(null); // Ref for the 800vh section
  const canvasRef = useRef(null);
  const flipContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d', { alpha: false });
      
      const frameCount = 240;
      const sequence1 = [];
      const sequence2 = [];
      const state = { frame1: 0, frame2: 0, opacity1: 1, opacity2: 0 };

      const formatIndex = (index) => (index + 1).toString().padStart(3, '0');

      let loadedImages = 0;
      const totalImages = frameCount * 2;

      // Preload Sequence 1
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `/videos/video1-boutique-spin/ezgif-frame-${formatIndex(i)}.jpg`;
        img.onload = () => {
          loadedImages++;
          setLoadProgress(Math.round((loadedImages / totalImages) * 100));
          if (loadedImages === totalImages) setIsLoading(false);
        };
        sequence1.push(img);
      }

      // Preload Sequence 2
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `/videos/video2-fly-colorchange/ezgif-frame-${formatIndex(i)}.jpg`;
        img.onload = () => {
          loadedImages++;
          setLoadProgress(Math.round((loadedImages / totalImages) * 100));
          if (loadedImages === totalImages) setIsLoading(false);
        };
        sequence2.push(img);
      }

      // 3D Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
        onUpdate: render
      });

      tl.to(state, {
        frame1: frameCount - 1,
        snap: "frame1",
        ease: "none",
        duration: 0.5
      }, 0);

      tl.to(state, {
        opacity1: 0,
        opacity2: 1,
        duration: 0.05,
        ease: "power2.inOut"
      }, 0.475);

      tl.to(state, {
        frame2: frameCount - 1,
        snap: "frame2",
        ease: "none",
        duration: 0.5
      }, 0.5);

      // Text Animations (Inside context will find these)
      tl.to(".hero-title", { opacity: 0, y: -50, duration: 0.1 }, 0.05);
      tl.fromTo(".feature-1", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.1 }, 0.1);
      tl.to(".feature-1", { opacity: 0, x: -30, duration: 0.1 }, 0.25);
      tl.fromTo(".feature-2", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.1 }, 0.3);
      tl.to(".feature-2", { opacity: 0, x: 30, duration: 0.1 }, 0.45);
      tl.fromTo(".feature-3", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.1 }, 0.55);
      tl.to(".feature-3", { opacity: 0, scale: 1.2, duration: 0.1 }, 0.75);
      tl.fromTo(".feature-4", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.1 }, 0.8);

      // Flip Section Animation
      gsap.from(".flip-card", {
        scrollTrigger: {
          trigger: flipContainerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      // Marquee Animation
      gsap.to(".marquee-inner", {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1
      });

      function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const activeSequence = state.opacity1 > 0.5 ? sequence1 : sequence2;
        const activeFrame = state.opacity1 > 0.5 ? Math.floor(state.frame1) : Math.floor(state.frame2);
        const source = activeSequence[activeFrame];
        if (!source) return;
        const sWidth = source.width;
        const sHeight = source.height;
        const sRatio = sWidth / sHeight;
        const cRatio = canvas.width / canvas.height;
        let dWidth, dHeight, dx, dy;
        if (cRatio > sRatio) {
          dWidth = canvas.width; dHeight = canvas.width / sRatio; dx = 0; dy = (canvas.height - dHeight) / 2;
        } else {
          dWidth = canvas.height * sRatio; dHeight = canvas.height; dx = (canvas.width - dWidth) / 2; dy = 0;
        }
        context.globalAlpha = state.opacity1 > 0.5 ? state.opacity1 : state.opacity2;
        context.drawImage(source, dx, dy, dWidth, dHeight);
      }

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render();
      };
      window.addEventListener('resize', resize);
      resize();

    }, mainRef); // Passing mainRef ensures GSAP finds everything

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-black">
      {/* 3D Scroll Section */}
      <div ref={scrollSectionRef} className="relative w-full h-[800vh]">
        {isLoading && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-white transition-all duration-300" style={{ width: `${loadProgress}%` }} />
            </div>
            <div className="text-white tracking-[0.5em] uppercase text-[10px] opacity-50">Preloading Experience {loadProgress}%</div>
          </div>
        )}

        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center mix-blend-difference text-white">
            <div className="hero-title text-center">
              <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter">Nick Shoes</h1>
              <p className="mt-4 text-xl tracking-[0.5em] uppercase opacity-80">Scroll to explore</p>
            </div>
            <div className="feature-1 absolute top-32 left-24 opacity-0">
              <h2 className="text-4xl font-bold uppercase tracking-widest leading-none">Performance<br />Engineered</h2>
              <div className="w-12 h-0.5 bg-white mt-4"></div>
            </div>
            <div className="feature-2 absolute bottom-32 right-24 text-right opacity-0">
              <h2 className="text-4xl font-bold uppercase tracking-widest leading-none">Sustainable<br />Luxury</h2>
              <div className="w-12 h-0.5 bg-white mt-4 ml-auto"></div>
            </div>
            <div className="feature-3 absolute text-center opacity-0">
              <h1 className="text-8xl font-black uppercase tracking-tighter leading-tight">The Future<br />of Motion</h1>
            </div>
            <div className="feature-4 absolute bottom-12 text-center opacity-0">
              <p className="text-sm tracking-[1em] uppercase">Limited Edition / Available Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flip Section */}
      <section ref={flipContainerRef} className="py-32 px-6 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-8">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">CRAFTED FOR<br />THE BOLD</h2>
            <p className="max-w-sm text-gray-400 uppercase tracking-widest text-xs mb-4">
              Every curve, every stitch, every component is engineered to provide a 3D sensation of ultimate luxury.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "CARBON FIBER", desc: "ULTRA LIGHTWEIGHT ARCHITECTURE", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" },
              { title: "AERO-KNIT", desc: "BREATHABLE 3D TEXTURE TECHNOLOGY", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80" },
              { title: "CLOUD SOLE", desc: "RESPONSIVE CUSHIONING SYSTEM", img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80" }
            ].map((item, idx) => (
              <div key={idx} className="flip-card group relative aspect-[3/4] overflow-hidden bg-neutral-900">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-3xl font-black tracking-tighter mb-2">{item.title}</h3>
                  <p className="text-[10px] tracking-[0.3em] text-gray-400">{item.desc}</p>
                </div>
                <div className="absolute top-8 right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <span className="text-xl">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="bg-white text-black py-12 border-y border-black overflow-hidden select-none">
        <div className="marquee-wrapper flex overflow-hidden">
          <div className="marquee-inner flex whitespace-nowrap gap-12 text-7xl md:text-9xl font-black uppercase tracking-tighter">
            <div className="flex gap-12 items-center">
              <span>Nick Shoes</span>
              <span>•</span>
              <span>Innovation</span>
              <span>•</span>
              <span>Performance</span>
              <span>•</span>
              <span>Luxury</span>
              <span>•</span>
            </div>
            <div className="flex gap-12 items-center">
              <span>Nick Shoes</span>
              <span>•</span>
              <span>Innovation</span>
              <span>•</span>
              <span>Performance</span>
              <span>•</span>
              <span>Luxury</span>
              <span>•</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

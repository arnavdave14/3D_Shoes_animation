import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { AnimatePresence } from 'framer-motion';
import TextScramble from '../components/TextScramble';
import ImageSequenceModal from '../components/ImageSequenceModal';

gsap.registerPlugin(Flip);

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Nick Phantom",
    category: "PERFORMANCE",
    price: "$299.00",
    desc: "Engineered with an ultra-lightweight carbon fiber chassis and our proprietary Aero-Knit technology.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    title: "Aero Motion",
    category: "PERFORMANCE",
    price: "$349.00",
    desc: "Wind-tunnel tested and aerodynamically optimized for zero drag and maximum kinetic velocity.",
    img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    title: "Velocity Flex",
    category: "LIFESTYLE",
    price: "$279.00",
    desc: "Adaptive support with high-grip outsoles designed for modern metropolitan environments.",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    title: "Eclipse Shadow",
    category: "LIFESTYLE",
    price: "$459.00",
    desc: "Sleek, black-out luxury crafted from organic sustainable leather and custom gold-leaf accents.",
    img: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    title: "Obsidian Liquid",
    category: "EXPERIMENTAL",
    price: "$599.00",
    desc: "Liquid metal exoskeletons and smart gravity-cushioned soles for maximum responsive energy rebound.",
    img: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    title: "Smart Weave",
    category: "EXPERIMENTAL",
    price: "$649.00",
    desc: "Fiber-optic OLED weave mesh with automatic kinetic charging. The ultimate intersection of light and pace.",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    title: "Quartz Translucent",
    category: "EXPERIMENTAL",
    price: "$529.00",
    desc: "Clear translucent synthetic composites showing the raw structural engineering elements inside.",
    img: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    title: "Titan Kevlar",
    category: "PERFORMANCE",
    price: "$799.00",
    desc: "Unbreakable bulletproof weave with titanium toe guards. Built for safety in extreme settings.",
    img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 9,
    title: "Carbon Prototype",
    category: "EXPERIMENTAL",
    price: "$689.00",
    desc: "A raw carbon-wrapped design showcasing extreme weight reduction trials and high-g rebound ratios.",
    img: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 10,
    title: "Quantum Cushion",
    category: "LIFESTYLE",
    price: "$389.00",
    desc: "Advanced quantum gel foam engineered to support posture and enhance natural stride dynamics.",
    img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  }
];

const BEST_SELLERS = [
  {
    id: 1,
    title: "Nick Phantom",
    category: "PERFORMANCE",
    price: "$299.00",
    tag: "01 // KINETIC-X",
    desc: "Engineered with an ultra-lightweight carbon fiber chassis and our proprietary Aero-Knit technology.",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    metrics: { demand: "99%", rating: "4.9" }
  },
  {
    id: 2,
    title: "Aero Motion",
    category: "PERFORMANCE",
    price: "$349.00",
    tag: "02 // WIND-TUNNEL",
    desc: "Wind-tunnel tested and aerodynamically optimized for zero drag and maximum kinetic velocity.",
    img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    metrics: { demand: "97%", rating: "4.8" }
  },
  {
    id: 5,
    title: "Obsidian Liquid",
    category: "EXPERIMENTAL",
    price: "$599.00",
    tag: "03 // LIQUID-METAL",
    desc: "Liquid metal exoskeletons and smart gravity-cushioned soles for maximum responsive energy rebound.",
    img: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    metrics: { demand: "98%", rating: "5.0" }
  },
  {
    id: 8,
    title: "Titan Kevlar",
    category: "PERFORMANCE",
    price: "$799.00",
    tag: "04 // TITANIUM",
    desc: "Unbreakable bulletproof weave with titanium toe guards. Built for safety in extreme settings.",
    img: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    metrics: { demand: "96%", rating: "4.9" }
  }
];

const FILTERS = ["ALL", "PERFORMANCE", "LIFESTYLE", "EXPERIMENTAL"];

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [activeItem, setActiveItem] = useState(null);
  const [activeHero, setActiveHero] = useState(BEST_SELLERS[0]);
  
  const containerRef = useRef(null);
  const flipStateRef = useRef(null);
  const closeStateRef = useRef(null);
  const previouslyActiveId = useRef(null);

  // Cinematic GSAP Stagger Intro on mount and ScrollTrigger setups
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(".gallery-title-sub", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(".gallery-title", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, 
        "-=0.6"
      )
      .fromTo(".gallery-desc", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
        "-=0.6"
      )
      .fromTo(".gallery-filter-btn", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power3.out" }, 
        "-=0.6"
      )
      .fromTo(".gallery-card", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power4.out" }, 
        "-=0.6"
      );

      // ScrollTrigger Stagger entrance for Best Sellers Carousel at bottom
      gsap.fromTo(".best-seller-card-outer",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".best-seller-title",
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const filteredItems = selectedFilter === "ALL" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedFilter);

  // Track active item history for closing transitions
  useEffect(() => {
    if (activeItem) {
      previouslyActiveId.current = activeItem.id;
    }
  }, [activeItem]);

  // Flip Transition: Morph Thumbnail to Modal Image on Open
  useEffect(() => {
    if (activeItem && flipStateRef.current) {
      const modalImg = document.querySelector('.modal-img');
      if (modalImg) {
        Flip.from(flipStateRef.current, {
          duration: 0.85,
          ease: "power4.out",
          clearProps: "all"
        });
      }
    }
  }, [activeItem]);

  // Flip Transition: Morph Modal Image back to Thumbnail on Close
  useEffect(() => {
    if (!activeItem && closeStateRef.current && previouslyActiveId.current) {
      const gridImg = document.querySelector(`.gallery-img-${previouslyActiveId.current}`);
      if (gridImg) {
        Flip.from(closeStateRef.current, {
          duration: 0.85,
          ease: "power4.out",
          clearProps: "all"
        });
      }
      closeStateRef.current = null;
    }
  }, [activeItem]);

  // Handle Category Filter changes with dynamic GSAP layout reflow
  const handleFilterChange = (filter) => {
    if (filter === selectedFilter) return;

    // Capture initial positions of all cards
    const cards = document.querySelectorAll('.gallery-card');
    const state = Flip.getState(cards);

    setSelectedFilter(filter);

    // Let React render the filtered cards, then animate
    setTimeout(() => {
      Flip.from(state, {
        duration: 0.7,
        ease: "power3.inOut",
        scale: true,
        absolute: true,
        stagger: 0.04
      });
    }, 50);
  };

  const handleCardClick = (item, e) => {
    const imgEl = e.currentTarget.querySelector('.gallery-img');
    if (imgEl) {
      flipStateRef.current = Flip.getState(imgEl);
      setActiveItem(item);
    }
  };

  const handleClose = () => {
    const modalImg = document.querySelector('.modal-img');
    if (modalImg) {
      closeStateRef.current = Flip.getState(modalImg);
    }
    setActiveItem(null);
  };

  // Flip Carousel Swap Handler
  const handleCarouselSwap = (item) => {
    // 1. Capture initial coordinates of all carousel components
    const state = Flip.getState("[data-flip-id^='bs-img-'], [data-flip-id^='bs-content-']");

    // 2. Adjust state in React
    setActiveHero(item);

    // 3. Morph sizes and locations fluidly on render completion
    setTimeout(() => {
      Flip.from(state, {
        duration: 0.8,
        ease: "power4.out",
        scale: true,
        absolute: true,
      });
    }, 40);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pt-32 pb-24 px-6 overflow-x-hidden relative">
      
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-120 h-120 bg-zinc-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="gallery-title-sub text-xs uppercase tracking-[0.5em] text-neutral-500 block">Exhibition Space</span>
          <h1 className="gallery-title text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
            Visual Archive
          </h1>
          <div className="gallery-desc max-w-lg mx-auto pt-4">
            <TextScramble 
              text="Explore experimental design concepts and precision performance engineering." 
              triggerOn="scroll"
              resolvedColor="text-neutral-400 text-sm tracking-wide leading-relaxed font-light"
            />
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`gallery-filter-btn px-6 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border backdrop-blur-md cursor-pointer ${
                selectedFilter === filter
                  ? "bg-white text-black border-white font-bold"
                  : "bg-neutral-900/40 text-neutral-400 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Equalized Card Ratios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start mb-24">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              data-flip-id={`card-${item.id}`}
              onClick={(e) => handleCardClick(item, e)}
              className="gallery-card group cursor-pointer bg-neutral-900/10 border border-white/5 overflow-hidden rounded-xl hover:border-white/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
            >
              {/* Image Box */}
              <div className="relative aspect-[4/5] bg-neutral-950 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className={`gallery-img gallery-img-${item.id} w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out`}
                />
                
                {/* Visual Glassmorphic Info Banner (Legible, always visible, expands on hover) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-6 pt-16 flex flex-col justify-end">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-500 font-bold mb-1 block">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-sm font-light italic text-neutral-400 group-hover:text-white transition-colors">
                      {item.price}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Best Sellers Section (Holographic GSAP FLIP Carousel at the bottom) */}
        <div className="mt-32 pt-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div className="space-y-1">
              <span className="best-seller-sub text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-bold block">
                COMMUNITY FAVORITES
              </span>
              <h2 className="best-seller-title text-3xl font-black uppercase tracking-tight italic">
                Best Sellers Carousel
              </h2>
            </div>
            <div className="h-[1px] bg-white/10 flex-grow mx-8 hidden md:block"></div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-mono hidden md:block">
              GSAP FLIP INTERACTIVE ENGINE
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[520px]">
            
            {/* 1. Giant Hero Card (Featured Best Seller) */}
            <div className="best-seller-card-outer w-full lg:w-3/5 bg-gradient-to-b from-neutral-900/40 to-neutral-950/80 border border-white/10 rounded-3xl overflow-hidden relative group shadow-[0_0_50px_rgba(255,255,255,0.01)] flex flex-col justify-end min-h-[420px]">
              
              {/* Image Underlay */}
              <div 
                data-flip-id={`bs-img-${activeHero.id}`}
                className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden"
              >
                <img 
                  src={activeHero.img} 
                  alt={activeHero.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 group-hover:brightness-90"
                />
              </div>

              {/* Holographic HUD details */}
              <div 
                data-flip-id={`bs-content-${activeHero.id}`}
                className="relative z-10 p-8 bg-gradient-to-t from-black via-black/85 to-transparent space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-1">
                      {activeHero.category}
                    </span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                      {activeHero.title}
                    </h3>
                  </div>
                  <div className="bg-white text-black font-black uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-full">
                    Best Seller
                  </div>
                </div>

                <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-lg">
                  {activeHero.desc}
                </p>

                {/* Telemetry metrics table */}
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center font-mono max-w-sm">
                  <div>
                    <span className="text-[8px] text-neutral-600 block">DEMAND</span>
                    <span className="text-xs text-white font-bold">{activeHero.metrics.demand}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-600 block">RATING</span>
                    <span className="text-xs text-white font-bold">{activeHero.metrics.rating}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-600 block">PRICE</span>
                    <span className="text-xs text-white font-bold">{activeHero.price}</span>
                  </div>
                </div>

                {/* Trigger scan modal */}
                <div className="pt-2">
                  <button 
                    onClick={(e) => handleCardClick(activeHero, e)}
                    className="w-full sm:w-auto px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.15)] cursor-pointer"
                  >
                    ✕ Trigger Decode Scan
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Side Panel List (Vertical stack of other best sellers) */}
            <div className="w-full lg:w-2/5 flex flex-col gap-4 justify-between">
              {BEST_SELLERS.filter(item => item.id !== activeHero.id).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleCarouselSwap(item)}
                  className="best-seller-card-outer flex-1 flex gap-6 items-center bg-neutral-900/20 border border-white/5 p-4 rounded-2xl hover:border-white/15 cursor-pointer hover:bg-neutral-900/40 transition-all duration-300 relative group"
                >
                  {/* Small Aspect Frame */}
                  <div 
                    data-flip-id={`bs-img-${item.id}`}
                    className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0"
                  >
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Quick details */}
                  <div 
                    data-flip-id={`bs-content-${item.id}`}
                    className="flex-grow space-y-1"
                  >
                    <span className="text-[8px] tracking-[0.25em] uppercase text-neutral-500 font-bold block">
                      {item.category}
                    </span>
                    <h4 className="text-md font-bold uppercase tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 font-light line-clamp-1">
                      {item.price} — {item.tag}
                    </p>
                    <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block pt-2 group-hover:text-white transition-colors">
                      ✕ Click to Focus Hero
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* 3D Physical Decode Scroll Sequence Showcase */}
      <AnimatePresence>
        {activeItem && (
          <ImageSequenceModal 
            item={activeItem} 
            onClose={handleClose} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;

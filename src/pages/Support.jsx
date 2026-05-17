import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from '../components/TextScramble';

gsap.registerPlugin(ScrollTrigger);

const FAQ_ITEMS = [
  {
    q: "Are all NICK SHOES authentic?",
    a: "Absolutely. Every pair from our Originals and Lab Series collections undergo holographic blockchain verification. Your shipment is accompanied by a unique digital cryptography key securing its carbon provenance."
  },
  {
    q: "Do you offer custom sizing adjustments?",
    a: "Our proprietary Aero-Knit and Bio-Mesh fabrics adapt dynamically to your foot's exact shape under pressure. We recommend choosing your standard size; the sneaker adapts within 3 hours of compression."
  },
  {
    q: "How do I care for the experimental Lab Series materials?",
    a: "Lab Series models utilize high-grade Kevlar blends, liquid metals, and translucent polymers. Clean them exclusively with a micro-abrasive cloth. Avoid direct exposure to solvents, high voltage, and liquid nitrogen."
  },
  {
    q: "What is autonomous drone sector shipping?",
    a: "For urban sectors, NICK SHOES utilizes automated quadcopter logistics. Drones deliver your vacuum-sealed container straight to your registered coordinates. Ensure your landing zone is cleared of electromagnetic interference."
  },
  {
    q: "What is your decommissioning (returns) policy?",
    a: "We offer a 14-cycle return window for all standard models. The sneaker must be deactivated, clean, and returned in its original carbon container. Drones will execute collection from your registered sector coordinates."
  }
];

const Support = () => {
  const containerRef = useRef(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Contact Form States
  const [formData, setFormData] = useState({ name: '', email: '', sector: 'general', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'transmitting' | 'success'
  const [transmissionKey] = useState(() => Math.floor(Math.random() * 900000 + 100000));
  const { hash } = useLocation();

  // Handle smooth scroll anchor transitions when accessing support anchors
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        // Safe timeout allows GSAP ScrollTrigger to build layout frames first
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      }
    }
  }, [hash]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Staggered Header Text scramble on load
      gsap.fromTo(".support-intro",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
      );

      // 2. GSAP Stacking Panels Scroll Animation
      const panels = gsap.utils.toArray(".support-panel");
      
      panels.forEach((panel, i) => {
        // Skip the very last panel because nothing stacks over it
        if (i === panels.length - 1) return;

        const nextPanel = panels[i + 1];

        gsap.to(panel, {
          scale: 0.92,
          yPercent: -6,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: nextPanel,
            start: "top bottom", // trigger when next card enters from screen bottom
            end: "top top",    // complete when next card covers this one at screen top
            scrub: true,
            invalidateOnRefresh: true
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth expanding accordion triggers
  const handleToggleFaq = (idx) => {
    const isOpening = openFaqIdx !== idx;
    
    if (openFaqIdx !== null) {
      const activeEl = document.getElementById(`faq-ans-${openFaqIdx}`);
      const activeIcon = document.getElementById(`faq-icon-${openFaqIdx}`);
      if (activeEl) {
        gsap.to(activeEl, { height: 0, opacity: 0, duration: 0.4, ease: "power3.inOut" });
      }
      if (activeIcon) {
        gsap.to(activeIcon, { rotate: 0, duration: 0.4 });
      }
    }

    if (isOpening) {
      setOpenFaqIdx(idx);
      const targetEl = document.getElementById(`faq-ans-${idx}`);
      const targetIcon = document.getElementById(`faq-icon-${idx}`);
      if (targetEl) {
        gsap.fromTo(targetEl,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" }
        );
      }
      if (targetIcon) {
        gsap.to(targetIcon, { rotate: 45, duration: 0.4 });
      }
    } else {
      setOpenFaqIdx(null);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus('transmitting');

    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', sector: 'general', message: '' });
    }, 3500);
  };

  return (
    <div ref={containerRef} className="bg-black text-white relative">
      
      {/* Intro Hero Section (Unpinned) */}
      <div className="support-intro min-h-[60vh] flex flex-col justify-center items-center px-6 pt-36 pb-20 text-center relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <span className="text-xs uppercase tracking-[0.6em] text-neutral-500 font-bold block mb-4">NICK ARCHIVAL PORTAL</span>
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">
          Support Center
        </h1>
        <div className="max-w-xl mx-auto pt-6">
          <TextScramble 
            text="Decentralized telemetry database for secure transaction queries, atmospheric cargo coordinates, and developer broadcasts."
            triggerOn="scroll"
            resolvedColor="text-neutral-400 text-sm sm:text-base font-light tracking-wide leading-relaxed"
          />
        </div>
        <div className="mt-12 animate-bounce">
          <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-mono">
            Scroll down to enter mainframe ↓
          </span>
        </div>
      </div>

      {/* STACKING PANELS PORTAL CONTAINER */}
      <div className="support-panels-container relative w-full">
        
        {/* PANEL 1: FAQ ACCORDION (Deep Neutral-950) */}
        <section id="faq" className="support-panel sticky top-0 w-full min-h-screen bg-neutral-950 flex flex-col justify-center py-24 px-6 md:px-12 border-t border-white/5 shadow-[0_-30px_60px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/5 to-transparent pointer-events-none"></div>
          <div className="max-w-4xl mx-auto w-full space-y-12 relative z-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[9px] tracking-[0.3em] text-blue-400 font-mono block">MAIN DICTIONARY PROTOCOL</span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight italic pt-2">
                  ✕ FAQ ACCORDIONS
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-500 mt-2 md:mt-0">[ CODE_INDEX_01 ]</span>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <div 
                  key={idx}
                  className="border border-white/5 bg-neutral-900/20 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
                >
                  <button
                    onClick={() => handleToggleFaq(idx)}
                    className="w-full text-left p-6 sm:p-7 flex justify-between items-center gap-6 cursor-pointer"
                  >
                    <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white select-none">
                      {item.q}
                    </h3>
                    <div 
                      id={`faq-icon-${idx}`}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 flex-shrink-0"
                    >
                      <span className="text-xs font-mono">+</span>
                    </div>
                  </button>
                  
                  <div 
                    id={`faq-ans-${idx}`}
                    className="h-0 opacity-0 overflow-hidden border-t border-white/0"
                  >
                    <div className="p-6 sm:p-7 pt-0 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-3xl">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* PANEL 2: SHIPPING & RETURNS (Graphite Neutral-900) */}
        <section id="shipping" className="support-panel sticky top-0 w-full min-h-screen bg-neutral-900 flex flex-col justify-center py-24 px-6 md:px-12 border-t border-white/10 shadow-[0_-30px_60px_rgba(0,0,0,0.95)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 to-transparent pointer-events-none"></div>
          <div className="max-w-5xl mx-auto w-full space-y-12 relative z-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[9px] tracking-[0.3em] text-neutral-400 font-mono block">LOGISTICS PROTOCOL MAP</span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight italic pt-2">
                  ✕ DRONE & CARGO DELIVERY
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-500 mt-2 md:mt-0">[ CODE_INDEX_02 ]</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'DRONE TELEMETRY',
                  speed: '1 - 3 HOURS',
                  cost: 'FREE (STAGED)',
                  desc: 'Fully autonomous quadcopter dispatch direct to landing pad coordinates. Restricted urban sectors.'
                },
                {
                  title: 'EXPRESS METRIC',
                  speed: '1 - 2 DAYS',
                  cost: 'FREE SYSTEM WIDE',
                  desc: 'Premium flight network delivering securely packaged shoe composites direct to structural nodes.'
                },
                {
                  title: 'PERIPHERAL FREIGHT',
                  speed: '3 - 5 DAYS',
                  cost: 'FREE FOR LABS',
                  desc: 'Standard cargo vectors for outer boundaries and rural peripheral containment sites.'
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="border border-white/5 bg-neutral-950/30 p-6 sm:p-8 rounded-3xl space-y-6 hover:border-white/10 transition-colors"
                >
                  <div>
                    <span className="text-[8px] tracking-[0.2em] uppercase text-neutral-500 font-mono block">
                      SECTOR protocol 0{idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white pt-1">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="border-y border-white/5 py-4 space-y-2 font-mono text-[10px] sm:text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">SPEED</span>
                      <span className="text-white font-bold">{item.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">COST</span>
                      <span className="text-green-400 font-bold">{item.cost}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="border border-white/5 bg-black/40 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <h4 className="text-[10px] sm:text-xs uppercase tracking-widest font-mono text-white">
                  Telemetry Decommission (Returns) Staging
                </h4>
              </div>
              <ul className="space-y-3 text-[11px] font-light text-neutral-400 leading-relaxed">
                <li>
                  <strong className="text-white font-bold">Wipe & Deactivate:</strong> Ensure sneaker tracking elements are powered down before packaging.
                </li>
                <li>
                  <strong className="text-white font-bold">Vacuum Sealed:</strong> Stage returns inside original container matrices to protect fabrics.
                </li>
                <li>
                  <strong className="text-white font-bold">Drone Summon:</strong> Scan your terminal barcode to queue immediate quadcopter pickup coords.
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* PANEL 3: CONTACT US (Deep Charcoal Black) */}
        <section id="contact" className="support-panel sticky top-0 w-full min-h-screen bg-black flex flex-col justify-center py-24 px-6 md:px-12 border-t border-white/10 shadow-[0_-30px_60px_rgba(0,0,0,1)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/10 to-transparent pointer-events-none"></div>
          <div className="max-w-4xl mx-auto w-full space-y-12 relative z-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[9px] tracking-[0.3em] text-neutral-500 font-mono block">TRANSMISSION LINK ACCESS</span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight italic pt-2">
                  ✕ SECURE CONTACT NODE
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-500 mt-2 md:mt-0">[ CODE_INDEX_03 ]</span>
            </div>

            {submitStatus === 'success' ? (
              <div className="border border-white/10 bg-neutral-950 p-8 sm:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white animate-pulse w-full"></div>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight italic">
                    Transmission Dispatched
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-light leading-relaxed">
                    Your transmission signal has been successfully sealed and decrypted by regional mainframe routers. Live engineers will connect within 15 minutes.
                  </p>
                </div>

                <div className="max-w-xs mx-auto border-t border-white/5 pt-6 text-left font-mono text-[9px] text-neutral-500 space-y-1.5">
                  <div className="flex justify-between">
                    <span>TRANSMISSION CORRELATION</span>
                    <span className="text-white font-bold">#NICK-NODE-{transmissionKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SIGNATURE DECRYPTION</span>
                    <span className="text-green-400 font-bold">COMPLIANT</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[9px] hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    ✕ Open New Node
                  </button>
                </div>
              </div>
            ) : submitStatus === 'transmitting' ? (
              <div className="border border-white/5 bg-neutral-900/10 p-16 rounded-3xl text-center space-y-6">
                <div className="w-full max-w-xs mx-auto space-y-4">
                  <span className="text-[9px] tracking-[0.3em] text-neutral-500 font-bold block animate-pulse">
                    SEALING DECRYPTED PACKETS
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-tight italic">
                    Transmitting Broadcast...
                  </h3>
                  <div className="w-full h-1 bg-neutral-950 overflow-hidden relative rounded-full border border-white/5">
                    <div className="h-full bg-white animate-infinite-loading w-[35%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleContactSubmit}
                className="border border-white/5 bg-neutral-950/40 p-6 sm:p-10 rounded-3xl space-y-8 relative backdrop-blur-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block font-mono">
                      01 / TRANSMITTER NAME
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ENTER REGISTERED NAME..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-xs font-mono tracking-wide text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all uppercase placeholder-neutral-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block font-mono">
                      02 / DIGITAL VECTOR EMAIL
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ENTER SECURE EMAIL..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-xs font-mono tracking-wide text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all uppercase placeholder-neutral-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block font-mono">
                      03 / SELECT DIAGNOSTIC SECTOR
                    </label>
                    <select 
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-xs font-mono tracking-wide text-white focus:outline-none focus:border-white transition-all uppercase cursor-pointer"
                    >
                      <option value="general">GENERAL ENQUIRY SECTOR</option>
                      <option value="logistics">LOGISTICS & RETRIEVAL SECTOR</option>
                      <option value="product">PRODUCT TECHNICAL SPECIFICATIONS</option>
                      <option value="custom">EXECUTIVE SPECIAL CONTRACTS</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block font-mono">
                      04 / BROADCAST MESSAGE SIGNAL
                    </label>
                    <textarea 
                      rows="4"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="DECRYPT MESSAGE HERE..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-xs font-mono tracking-wide text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all uppercase placeholder-neutral-700 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 text-center rounded-xl hover:bg-neutral-200 transition-colors shadow-[0_4px_30px_rgba(255,255,255,0.15)] disabled:opacity-50 cursor-pointer"
                  >
                    ✕ Transmit Secure Signal
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

      </div>

    </div>
  );
};

export default Support;

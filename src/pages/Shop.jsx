import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/ProductCard';
import { products, labSeries } from '../data/products';
import TickerSection from '../components/TickerSection';

gsap.registerPlugin(ScrollTrigger);

const Shop = () => {
  const section1Ref = useRef(null);
  const trigger1Ref = useRef(null);
  const section2Ref = useRef(null);
  const trigger2Ref = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Section 1: Right to Left
      gsap.fromTo(
        section1Ref.current,
        { x: 0 },
        {
          x: "-300vw",
          ease: "none",
          scrollTrigger: {
            trigger: trigger1Ref.current,
            start: "top top",
            end: "2000 top",
            scrub: 0.6,
            pin: true,
          },
        }
      );

      // Section 2: Left to Right
      // We start with the section offset to the left and move it to the right
      gsap.fromTo(
        section2Ref.current,
        { x: "-300vw" },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: trigger2Ref.current,
            start: "top top",
            end: "2000 top",
            scrub: 0.6,
            pin: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-black overflow-x-hidden">
      
      {/* SECTION 1: Standard Collection */}
      <div ref={trigger1Ref}>
        <div className="relative h-screen flex items-center bg-black overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
            <h1 className="text-[30vw] font-black uppercase tracking-tighter whitespace-nowrap">
              ORIGINALS
            </h1>
          </div>
          <div ref={section1Ref} className="flex flex-row relative h-[70vh] items-center px-[10vw] gap-[5vw]">
            <div className="min-w-[40vw] flex flex-col justify-center pr-24">
              <span className="text-xs uppercase tracking-[0.5em] text-gray-500 mb-6">Collection 01</span>
              <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
                The<br />Originals
              </h2>
              <div className="mt-12 flex items-center gap-4 text-white text-sm tracking-widest">
                <span>SCROLL RIGHT</span>
                <div className="w-12 h-[1px] bg-white"></div>
              </div>
            </div>
            {products.map((product) => (
              <div key={product.id} className="min-w-[300px] md:min-w-[450px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSITION SECTION */}
      <section className="h-[50vh] flex flex-col items-center justify-center bg-white text-black text-center px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic">The Lab Series</h2>
          <p className="text-xs uppercase tracking-[0.5em] opacity-50 font-bold">Experimental / Opposite Flow</p>
      </section>

      {/* SECTION 2: Lab Series (Opposite Direction) */}
      <div ref={trigger2Ref}>
        <div className="relative h-screen flex items-center bg-black overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
            <h1 className="text-[30vw] font-black uppercase tracking-tighter whitespace-nowrap">
              LAB SERIES
            </h1>
          </div>
          <div ref={section2Ref} className="flex flex-row relative h-[70vh] items-center px-[10vw] gap-[5vw]">
            {/* The products come first in the opposite flow */}
            {labSeries.map((product) => (
              <div key={product.id} className="min-w-[300px] md:min-w-[450px]">
                <ProductCard product={product} />
              </div>
            ))}
            <div className="min-w-[40vw] flex flex-col justify-center pl-24">
              <span className="text-xs uppercase tracking-[0.5em] text-gray-500 mb-6 text-right">Collection 02</span>
              <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8 text-right">
                Experimental<br />Concepts
              </h2>
              <div className="mt-12 flex items-center justify-end gap-4 text-white text-sm tracking-widest">
                <div className="w-12 h-[1px] bg-white"></div>
                <span>SCROLL LEFT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ticker Hover Section */}
      <TickerSection />
    </div>
  );
};

export default Shop;

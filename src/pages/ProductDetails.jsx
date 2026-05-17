import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import MotionCardStack from '../components/MotionCardStack';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const containerRef = useRef(null);
  const { addToCart } = useCart();

  const [currentId, setCurrentId] = useState(id);
  const [isLoading, setIsLoading] = useState(true);

  if (currentId !== id) {
    setCurrentId(id);
    setIsLoading(true);
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    // Simulate luxury API fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    let ctx = gsap.context(() => {
      if (!isLoading) {
        gsap.from(".reveal", {
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out"
        });

        gsap.from(".image-reveal", {
          scale: 1.2,
          opacity: 0,
          duration: 1.5,
          ease: "power2.out"
        });
      }
    }, containerRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [id, isLoading]);

  if (!product) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Product Not Found</div>;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto animate-pulse">
          
          {/* Back Link Placeholder */}
          <div className="w-44 h-4 bg-neutral-900/60 shimmer rounded mb-12"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Product Media Placeholder */}
            <div className="relative aspect-square bg-neutral-900/40 shimmer rounded-lg border border-white/5"></div>

            {/* Product Info Placeholder */}
            <div className="flex flex-col space-y-8">
              <div className="w-36 h-3 bg-neutral-900/60 shimmer rounded"></div>
              
              <div className="space-y-4">
                <div className="w-5/6 h-12 bg-neutral-900/60 shimmer rounded"></div>
                <div className="w-2/3 h-12 bg-neutral-900/60 shimmer rounded"></div>
              </div>
              
              <div className="flex items-baseline gap-4 mt-4">
                <div className="w-28 h-8 bg-neutral-900/60 shimmer rounded"></div>
                <div className="w-16 h-4 bg-neutral-900/60 shimmer rounded"></div>
              </div>

              <div className="space-y-3 pt-6">
                <div className="w-full h-4 bg-neutral-900/60 shimmer rounded"></div>
                <div className="w-full h-4 bg-neutral-900/60 shimmer rounded"></div>
                <div className="w-4/5 h-4 bg-neutral-900/60 shimmer rounded"></div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="w-40 h-4 bg-neutral-900/60 shimmer rounded border-b border-white/10 pb-4"></div>
                <ul className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900/60 shimmer"></div>
                      <div className="w-1/2 h-4 bg-neutral-900/60 shimmer rounded"></div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-48 h-14 bg-neutral-900/60 shimmer rounded pt-6 mt-8"></div>
            </div>

          </div>

          {/* Video Showcase Placeholder */}
          <div className="mt-48">
            <div className="w-64 h-10 bg-neutral-900/60 shimmer rounded mx-auto mb-24"></div>
            <div className="relative w-full aspect-video bg-neutral-900/40 shimmer rounded-lg border border-white/5"></div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pt-32 pb-24 px-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-12">
          <span className="text-lg">←</span> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Product Media: Gesture-Driven Multi-Angle Card Stack */}
          <div className="w-full">
            <MotionCardStack productId={product.id} fallbackImage={product.image} />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="reveal text-xs uppercase tracking-[0.5em] text-gray-500 mb-4">Masterpiece / {product.id}</span>
            <h1 className="reveal text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              {product.name}
            </h1>
            <div className="reveal flex items-baseline gap-4 mb-12">
               <span className="text-3xl font-light italic text-gray-300">{product.price}</span>
               <span className="text-xs uppercase tracking-widest text-green-500">In Stock</span>
            </div>

            <p className="reveal text-lg leading-relaxed text-gray-400 mb-12 max-w-lg">
              {product.description}
            </p>

            <div className="reveal space-y-6 mb-16">
              <h3 className="text-xs uppercase tracking-widest font-bold border-b border-white/10 pb-4">Technical Specs</h3>
              <ul className="grid grid-cols-1 gap-4">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-20"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal relative">
              <button 
                onClick={() => {
                  addToCart(product);
                  // Dynamic GSAP micro-feedback toast
                  const toast = document.createElement('div');
                  toast.className = "fixed bottom-10 right-10 bg-white text-black font-mono font-bold text-[10px] tracking-[0.2em] px-6 py-4 shadow-[0_0_50px_rgba(255,255,255,0.4)] border border-white/20 z-50 uppercase rounded-full";
                  toast.innerText = `[ ${product.name.toUpperCase()} STAGED FOR CHECKOUT ]`;
                  document.body.appendChild(toast);
                  
                  gsap.fromTo(toast, 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
                  );
                  
                  setTimeout(() => {
                    gsap.to(toast, {
                      y: -30,
                      opacity: 0,
                      duration: 0.5,
                      ease: "power3.in",
                      onComplete: () => toast.remove()
                    });
                  }, 2500);
                }}
                className="w-full md:w-max px-12 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                Add To Cart
              </button>
            </div>
            
            <p className="reveal mt-8 text-[10px] text-gray-600 uppercase tracking-widest">
              Free Express Shipping & Guaranteed Authentic
            </p>
          </div>

        </div>

        {/* Video Showcase Section */}
        <div className="mt-48">
           <h2 className="reveal text-center text-4xl md:text-6xl font-black uppercase tracking-tighter italic opacity-10 mb-24">
              Motion Performance
           </h2>
           <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
              <video 
                src={product.video} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover grayscale opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-px h-32 bg-white/20"></div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;

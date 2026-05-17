import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';
import TextScramble from '../components/TextScramble';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const containerRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('idle'); // 'idle' | 'scanning' | 'success'
  const [orderId] = useState(() => Math.floor(Math.random() * 9000000 + 1000000));

  // Stagger entry animation of cart items on mount
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (cart.length > 0) {
        gsap.fromTo(".cart-header-reveal",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
        gsap.fromTo(".cart-item-row",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power4.out" }
        );
        gsap.fromTo(".cart-summary-card",
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.6"
        );
      } else {
        gsap.fromTo(".cart-empty-state",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power4.out" }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [cart.length]);

  // Premium GSAP Decommission (Remove) Item Sequence
  const handleRemove = (id, itemName) => {
    const rowEl = document.getElementById(`cart-item-${id}`);
    if (rowEl) {
      // 1. Create flying text confirmation
      const notification = document.createElement('div');
      notification.className = "fixed bottom-10 left-10 bg-red-500 text-white font-mono font-bold text-[10px] tracking-[0.2em] px-6 py-4 shadow-[0_0_40px_rgba(239,68,68,0.3)] z-50 uppercase rounded-full";
      notification.innerText = `[ DECOMMISSIONED: ${itemName.toUpperCase()} ]`;
      document.body.appendChild(notification);
      
      gsap.fromTo(notification, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      
      setTimeout(() => {
        gsap.to(notification, {
          y: -20,
          opacity: 0,
          duration: 0.4,
          ease: "power3.in",
          onComplete: () => notification.remove()
        });
      }, 2000);

      // 2. Animate item row sliding left and collapsing height
      gsap.to(rowEl, {
        opacity: 0,
        x: -100,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        borderBottomWidth: 0,
        duration: 0.55,
        ease: "power4.inOut",
        onComplete: () => {
          removeFromCart(id);
        }
      });
    } else {
      removeFromCart(id);
    }
  };

  // Secure Checkout Logistics Processing animation
  const handleCheckout = () => {
    setIsProcessing(true);
    setCheckoutStep('scanning');

    // Digital laser scanning simulation
    setTimeout(() => {
      setCheckoutStep('success');
      setIsProcessing(false);
      clearCart();
    }, 4500);
  };

  const salesTax = cartTotal * 0.08;
  const grandTotal = cartTotal + salesTax;

  if (checkoutStep === 'success') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glowing Matrix background lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full text-center space-y-8 relative z-10 border border-white/10 bg-neutral-950/60 backdrop-blur-xl p-10 rounded-3xl">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)]">
              <svg className="w-10 h-10 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-bold block animate-pulse">
              LOGISTICS DEPLOYMENT COMPLETE
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight italic">
              Order Decoded
            </h1>
            <p className="text-xs text-neutral-400 font-light leading-relaxed pt-2">
              Your transaction key has been successfully decrypted. Express transport drones have queued your cargo. Telemetry coordinates dispatched via email.
            </p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between text-left font-mono text-[10px] text-neutral-500 mb-2">
              <span>SHIPPING CORRIDOR</span>
              <span className="text-white font-bold">DRONE-CORRIDOR 7-X</span>
            </div>
            <div className="flex justify-between text-left font-mono text-[10px] text-neutral-500">
              <span>DISPATCH CORRELATION</span>
              <span className="text-white font-bold">#{orderId}</span>
            </div>
          </div>

          <div className="pt-4">
            <Link 
              to="/shop" 
              onClick={() => setCheckoutStep('idle')}
              className="inline-block w-full px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors shadow-[0_4px_30px_rgba(255,255,255,0.2)]"
            >
              ✕ Return to Terminal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white pt-32 pb-24 px-6 overflow-x-hidden relative">
      
      {/* Laser Scanning Screen Overlay for Processing Step */}
      {checkoutStep === 'scanning' && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-center items-center p-6">
          <div className="relative w-full max-w-sm text-center space-y-8">
            {/* Holographic Laser Sweep */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-pulse w-full"></div>
            
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-bold block animate-pulse">
                INITIALIZING CRYPTO CHECKOUT
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight italic">
                Decrypting Logistics...
              </h2>
            </div>

            {/* Glowing Tech Progress Bar */}
            <div className="w-full h-1 bg-neutral-900 overflow-hidden relative rounded-full border border-white/5">
              <div className="h-full bg-white animate-infinite-loading w-[35%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8 text-left font-mono text-[9px] text-neutral-500">
              <div className="space-y-2">
                <div>
                  <span className="block">PACKET ROUTER</span>
                  <span className="text-white font-bold">CORE_INVOICE_DB</span>
                </div>
                <div>
                  <span className="block">SSL COMPLIANCE</span>
                  <span className="text-green-400 font-bold">SECURED [256-BIT]</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="block">DRONE VECTOR</span>
                  <span className="text-white font-bold">METROPOLIS-7</span>
                </div>
                <div>
                  <span className="block">GRID CORRELATION</span>
                  <span className="text-white font-bold">40.7128° N, 74.0060° W</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Blur Gradients */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-120 h-120 bg-zinc-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="cart-header-reveal text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.5em] text-neutral-500 block">Staged Spec Grid</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
            Shopping Cart
          </h1>
          <div className="max-w-lg mx-auto pt-4">
            <TextScramble 
              text="Secure invoice queue. Review your aerodynamic performance items." 
              triggerOn="scroll"
              resolvedColor="text-neutral-400 text-sm tracking-wide leading-relaxed font-light"
            />
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="cart-empty-state max-w-md mx-auto text-center py-20 border border-white/5 bg-neutral-950/20 backdrop-blur-md rounded-3xl p-8 space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-neutral-500">
                <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold uppercase tracking-tight text-white">Cart is Empty</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                You have no active specifications currently registered in the checkout queue.
              </p>
            </div>
            <div className="pt-4">
              <Link 
                to="/shop" 
                className="inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
              >
                ✕ Load Collection
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left Queue: Staged Items */}
            <div className="w-full lg:w-2/3 space-y-6">
              {cart.map((item) => (
                <div 
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="cart-item-row flex flex-col sm:flex-row gap-6 items-stretch border-b border-white/10 pb-6 overflow-hidden bg-neutral-900/10 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 relative"
                >
                  {/* Image Frame */}
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0">
                    <img 
                      src={item.image || item.img} 
                      alt={item.name || item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] tracking-[0.25em] uppercase text-neutral-500 font-mono block">
                            SPEC NO. 00{item.id}
                          </span>
                          <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                            {item.name || item.title}
                          </h3>
                        </div>
                        <span className="text-md font-bold text-white font-mono">
                          ${(item.rawPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-light line-clamp-1 leading-relaxed max-w-md">
                        {item.description || item.desc}
                      </p>
                    </div>

                    {/* Interactive controls */}
                    <div className="flex justify-between items-center pt-4">
                      {/* Quantity Toggles */}
                      <div className="flex items-center bg-black/60 border border-white/10 rounded-full overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-4 py-2 hover:bg-neutral-900 transition-colors text-xs text-neutral-400 hover:text-white cursor-pointer font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 text-xs font-mono font-bold text-white text-center min-w-[24px]">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-4 py-2 hover:bg-neutral-900 transition-colors text-xs text-neutral-400 hover:text-white cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Decommission trigger */}
                      <button 
                        onClick={() => handleRemove(item.id, item.name || item.title)}
                        className="text-[9px] uppercase tracking-widest text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                      >
                        ✕ Decommission
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Queue: Invoice summary board */}
            <div className="cart-summary-card w-full lg:w-1/3 bg-gradient-to-b from-neutral-900/40 to-neutral-950/80 border border-white/10 rounded-3xl p-8 space-y-8 shadow-[0_0_50px_rgba(255,255,255,0.01)] relative">
              <div className="space-y-1">
                <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-500 font-bold block">
                  FINANCIAL WORKSTATION
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight italic">
                  Invoice Summary
                </h3>
              </div>

              <div className="space-y-4 font-mono text-xs border-b border-white/10 pb-6">
                <div className="flex justify-between text-neutral-400">
                  <span>SUBTOTAL</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>LOGISTICS CREDIT</span>
                  <span className="text-green-400">FREE EXPRESS</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>ESTIMATED TAX (8%)</span>
                  <span className="text-white">${salesTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold">
                  TOTAL VALUE
                </span>
                <span className="text-3xl font-black text-white italic">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-4 text-center rounded-xl hover:bg-neutral-200 transition-colors shadow-[0_4px_30px_rgba(255,255,255,0.15)] disabled:opacity-50 cursor-pointer"
                >
                  ✕ Proceed to Decryption
                </button>
              </div>

              <div className="text-center">
                <span className="text-[8px] tracking-[0.2em] uppercase text-neutral-600 block">
                  SECURED SSL ENCRYPTED GATEWAY
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;

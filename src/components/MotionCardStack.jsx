import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const PRODUCT_ANGLES = {
  // Nick Phantom (Red)
  1: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512374382149-43371b1f16c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  // Nick Aero (Black)
  2: [
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  // Nick Velocity (Pink)
  3: [
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  // Nick Eclipse (Green)
  4: [
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ]
};

const DEFAULT_FALLBACK_ANGLES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512374382149-43371b1f16c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
];

const MotionCardStack = ({ productId, fallbackImage }) => {
  const angles = PRODUCT_ANGLES[productId] || [
    fallbackImage,
    ...DEFAULT_FALLBACK_ANGLES.slice(1)
  ];

  const [prevProductId, setPrevProductId] = useState(productId);
  const [stack, setStack] = useState(angles);

  if (productId !== prevProductId) {
    setPrevProductId(productId);
    setStack(angles);
  }

  const x = useMotionValue(0);

  // Gesture transforms: rotate card based on horizontal drag offset
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const dragScale = useTransform(x, [-200, 200], [0.95, 1.05]);
  const dragOpacity = useTransform(x, [-200, 200], [0.8, 1]);

  // Cycle the top card to the bottom of the stack
  const handleCycle = () => {
    setStack((prev) => [...prev.slice(1), prev[0]]);
  };

  // Reorder stack to bring clicked thumbnail to index 0
  const handleThumbnailClick = (imgUrl) => {
    setStack((prev) => {
      const idx = prev.indexOf(imgUrl);
      if (idx > -1) {
        return [...prev.slice(idx), ...prev.slice(0, idx)];
      }
      return prev;
    });
  };

  // Alternating fanned rotations to match target design
  const getCardRotation = (idx) => {
    if (idx === 0) return 0;
    return idx % 2 === 0 ? idx * -6 : idx * 5;
  };

  return (
    <div className="flex flex-col w-full items-center">
      
      {/* Drag Physics Card Stack Container (Portrait Proportions) */}
      <div className="relative w-full max-w-[360px] aspect-[3/4] flex items-center justify-center">
        {stack.map((imgUrl, index) => {
          const isTopCard = index === 0;

          return (
            <motion.div
              key={imgUrl}
              layout
              drag={isTopCard ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(event, info) => {
                if (Math.abs(info.offset.x) > 120) {
                  handleCycle();
                }
              }}
              style={isTopCard ? { x, rotate, scale: dragScale, opacity: dragOpacity, zIndex: 10 } : {}}
              animate={{
                scale: isTopCard ? 1 : 0.95 - index * 0.03,
                y: isTopCard ? 0 : index * -6, // slight clean vertical layout overlap
                rotate: isTopCard ? 0 : getCardRotation(index),
                opacity: isTopCard ? 1 : 0.9 - index * 0.2,
                zIndex: 10 - index
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24
              }}
              className="absolute inset-0 w-full h-full rounded-[24px] overflow-hidden bg-neutral-950 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing select-none"
            >
              {/* Product Oblique Image */}
              <img 
                src={imgUrl} 
                alt={`Product angle perspective ${index + 1}`} 
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Holographic Angle HUD Overlay */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[8px] tracking-[0.15em] font-mono text-neutral-400">
                ANGLE_PERSPECTIVE_0{angles.indexOf(imgUrl) + 1}
              </div>

              {isTopCard && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-[8px] tracking-[0.2em] font-mono text-neutral-500 flex items-center gap-2 pointer-events-none">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  SWIPE TO DISMISS PERSPECTIVE
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Instruction Subtitle */}
      <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-mono text-center mt-8 leading-relaxed">
        Swipe the top shoe card left or right. <br />
        <span className="text-[8px] text-neutral-600">Swiped angles seamlessly cycle to the back of the stack.</span>
      </p>

      {/* Thumbnail angle list (Amazon/Flipkart style) */}
      <div className="flex flex-wrap gap-3 justify-center mt-8 w-full max-w-[500px]">
        {angles.map((imgUrl, idx) => {
          const isActive = stack[0] === imgUrl;
          return (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(imgUrl)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 relative group cursor-pointer bg-neutral-950 ${
                isActive 
                  ? "border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                  : "border-white/5 hover:border-white/20 opacity-50 hover:opacity-100"
              }`}
            >
              <img 
                src={imgUrl} 
                alt={`Angle preview thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default MotionCardStack;

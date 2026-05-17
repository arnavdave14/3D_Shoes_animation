import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TickerItem = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative h-24 md:h-32 border-b border-white/10 flex items-center overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div
            key="static"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 md:px-12"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-colors">
              {text}
            </h2>
          </motion.div>
        ) : (
          <motion.div
            key="ticker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex whitespace-nowrap"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="flex items-center"
              >
                <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white px-8">
                  {text} — {text} —
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TickerSection = () => {
  const items = [
    "Exclusive Drops",
    "Sustainable Motion",
    "Join the Lab",
    "Global Shipping"
  ];

  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto border-t border-white/10">
        {items.map((item, index) => (
          <TickerItem key={index} text={item} />
        ))}
      </div>
    </section>
  );
};

export default TickerSection;

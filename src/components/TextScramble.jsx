import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const CHAR_SETS = {
  blocks: '█■▓▒░▄▀▲▼◀▶◈◇◆',
  binary: '01',
  matrix: 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
  crypto: '▰▱▲△▶▷▼▽◀◁◆◇◈◉◊○●◐◑◒◓◔◕◖◗',
  ascii: '!@#$%^&*()_+~}{[]:;?><,./-=',
  all: '█■▓▒░▄▀▲▼◀▶◈◇◆ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵ01!@#$%^&*()_+~}{[]:;?><,./-='
};

export const TextScramble = ({
  text,
  speed = 30,             // Interval between updates in ms
  baseDelay = 150,        // Initial delay before first letter resolves in ms
  staggerDelay = 50,      // Delay increment per step from center/origin in ms
  characterSet = 'all',   // Name of predefined set or custom string
  className = '',
  triggerOn = 'both',     // 'hover', 'scroll', or 'both'
  glitchColor = 'text-neutral-400 font-bold', // Styling for scrambled chars
  resolvedColor = 'text-white',                // Styling for resolved chars
  revealFrom = 'center',  // 'center', 'left', 'right', 'random'
}) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const [scrambledText, setScrambledText] = useState(text);
  const hasTriggeredOnScrollRef = useRef(false);
  const intervalRef = useRef(null);

  const selectedCharSet = useMemo(() => {
    return CHAR_SETS[characterSet] || characterSet || CHAR_SETS.all;
  }, [characterSet]);

  // Build character metadata (stable)
  const charDetails = useMemo(() => {
    const chars = text.split('');
    const len = chars.length;

    const getDistance = (index) => {
      switch (revealFrom) {
        case 'left':
          return index;
        case 'right':
          return len - 1 - index;
        case 'random':
          return (index * 7) % len;
        case 'center':
        default: {
          const center = (len - 1) / 2;
          return Math.abs(index - center);
        }
      }
    };

    return chars.map((char, index) => {
      const distance = getDistance(index);
      return {
        char,
        revealDelay: baseDelay + distance * staggerDelay,
      };
    });
  }, [text, revealFrom, baseDelay, staggerDelay]);

  const startScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const startTime = Date.now();
    const maxDelay = Math.max(...charDetails.map(d => d.revealDelay));

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;

      const nextText = charDetails.map((detail) => {
        if (detail.char === ' ') return ' ';

        if (elapsed < detail.revealDelay) {
          const randomIndex = Math.floor(Math.random() * selectedCharSet.length);
          return selectedCharSet[randomIndex];
        }

        return detail.char;
      }).join('');

      setScrambledText(nextText);

      // Stop once all characters have resolved
      if (elapsed >= maxDelay + 100) {
        clearInterval(intervalRef.current);
        setScrambledText(text);
      }
    }, speed);
  }, [text, speed, selectedCharSet, charDetails]);

  // Trigger on scroll/in-view
  useEffect(() => {
    if ((triggerOn === 'scroll' || triggerOn === 'both') && isInView && !hasTriggeredOnScrollRef.current) {
      hasTriggeredOnScrollRef.current = true;
      startScramble();
    }
  }, [isInView, triggerOn, startScramble]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (triggerOn === 'hover' || triggerOn === 'both') {
      startScramble();
    }
  };

  const displayChars = scrambledText.split('');

  return (
    <span
      ref={containerRef}
      className={`inline-block select-none cursor-pointer font-mono ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {displayChars.map((char, index) => {
        const isOriginal = char === text[index];
        const isSpace = char === ' ';

        return (
          <motion.span
            key={index}
            className={`inline-block transition-colors duration-150 ${
              isSpace ? '' : isOriginal ? resolvedColor : glitchColor
            }`}
            animate={
              !isOriginal
                ? {
                    scale: [1, 1.2, 0.9, 1.1, 1],
                    textShadow: [
                      '0px 0px 0px rgba(255, 255, 255, 0)',
                      '0px 0px 8px rgba(255, 255, 255, 0.8)',
                      '0px 0px 2px rgba(255, 255, 255, 0.4)',
                      '0px 0px 0px rgba(255, 255, 255, 0)',
                    ],
                  }
                : {
                    scale: 1,
                    textShadow: '0px 0px 0px rgba(255, 255, 255, 0)',
                  }
            }
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
          >
            {isSpace ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </span>
  );
};

export default TextScramble;

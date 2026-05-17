import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ImageSequenceModal = ({ item, onClose }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const tweenRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    // Lock main window scroll when overlay is active
    document.body.style.overflow = "hidden";

    // Load the SPECIFIC shoe's high-definition image that was clicked
    const img = new Image();
    img.src = item.img;
    
    // Smooth loader steps
    let interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 25);

    img.onload = () => {
      imgRef.current = img;
      setImagesLoaded(true);
      clearInterval(interval);
      setLoadingProgress(100);
    };

    img.onerror = () => {
      imgRef.current = img;
      setImagesLoaded(true);
      clearInterval(interval);
      setLoadingProgress(100);
    };

    return () => {
      document.body.style.overflow = "unset";
      clearInterval(interval);
    };
  }, [item]);

  // Canvas drawing and GSAP camera scroll panning logic
  useEffect(() => {
    if (!imagesLoaded || !imgRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const scroller = scrollContainerRef.current;

    // Camera variables that represent the focal viewport box on the shoe image
    const camera = {
      x: 0.5,    // horizontal anchor coordinate (0 to 1)
      y: 0.5,    // vertical anchor coordinate (0 to 1)
      zoom: 1.0  // viewport zoom level
    };

    const drawScanningHUD = (w, h) => {
      // 1. Digital Grid Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Tactical Corner Brackets
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      const len = 15;
      const pad = 30;

      // Top-Left corner bracket
      ctx.beginPath();
      ctx.moveTo(pad, pad + len);
      ctx.lineTo(pad, pad);
      ctx.lineTo(pad + len, pad);
      ctx.stroke();

      // Top-Right corner bracket
      ctx.beginPath();
      ctx.moveTo(w - pad, pad + len);
      ctx.lineTo(w - pad, pad);
      ctx.lineTo(w - pad - len, pad);
      ctx.stroke();

      // Bottom-Left corner bracket
      ctx.beginPath();
      ctx.moveTo(pad, h - pad - len);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(pad + len, h - pad);
      ctx.stroke();

      // Bottom-Right corner bracket
      ctx.beginPath();
      ctx.moveTo(w - pad, h - pad - len);
      ctx.lineTo(w - pad, h - pad);
      ctx.lineTo(w - pad - len, h - pad);
      ctx.stroke();

      // 3. Focal locking bracket in middle
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs tick marks
      ctx.beginPath();
      ctx.moveTo(w / 2 - 55, h / 2);
      ctx.lineTo(w / 2 - 45, h / 2);
      ctx.moveTo(w / 2 + 45, h / 2);
      ctx.lineTo(w / 2 + 55, h / 2);
      ctx.moveTo(w / 2, h / 2 - 55);
      ctx.lineTo(w / 2, h / 2 - 45);
      ctx.moveTo(w / 2, h / 2 + 45);
      ctx.lineTo(w / 2, h / 2 + 55);
      ctx.stroke();

    };

    const updateImage = () => {
      const img = imgRef.current;
      if (!img) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      // Calculate crop coordinates based on our camera object
      const zoomFactor = camera.zoom;
      const sliceWidth = imgWidth / zoomFactor;
      const sliceHeight = imgHeight / zoomFactor;

      const centerX = imgWidth * camera.x;
      const centerY = imgHeight * camera.y;

      let sx = centerX - sliceWidth / 2;
      let sy = centerY - sliceHeight / 2;

      // Restrict viewport slice within image bounds
      sx = Math.max(0, Math.min(imgWidth - sliceWidth, sx));
      sy = Math.max(0, Math.min(imgHeight - sliceHeight, sy));

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw zoomed focal view
      ctx.drawImage(
        img,
        sx, sy, sliceWidth, sliceHeight,
        0, 0, canvasWidth, canvasHeight
      );

      // Render custom HUD overlays
      drawScanningHUD(canvasWidth, canvasHeight);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateImage();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // GSAP ScrollTrigger camera focal timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-track",
        scroller: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
      onUpdate: updateImage
    });

    // Animate camera focus coordinates to lock onto anatomical features of the clicked shoe
    tl.to(camera, {
      x: 0.75,
      y: 0.55,
      zoom: 2.2,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(camera, {
      x: 0.45,
      y: 0.35,
      zoom: 2.6,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(camera, {
      x: 0.25,
      y: 0.65,
      zoom: 2.4,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(camera, {
      x: 0.5,
      y: 0.5,
      zoom: 1.0,
      duration: 1.2,
      ease: "power3.inOut"
    });

    tweenRef.current = tl;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (tweenRef.current) {
        tweenRef.current.scrollTrigger?.kill();
        tweenRef.current.kill();
      }
    };
  }, [imagesLoaded]);

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 bg-black overflow-y-scroll scroll-smooth select-none"
    >
      {/* Pinned Canvas Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>

      {/* Navigation Overlay */}
      <div className="fixed top-8 left-8 right-8 z-50 flex justify-between items-center pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full pointer-events-auto">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">SPEC DISSECTION SCAN:</span>
          <span className="text-xs uppercase tracking-widest text-white font-bold ml-2">{item.title}</span>
        </div>
        <button 
          onClick={onClose}
          className="bg-white text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-neutral-200 transition-colors pointer-events-auto cursor-pointer"
        >
          ✕ Exit 
        </button>
      </div>

      {/* Preloading Layer */}
      {!imagesLoaded && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center p-6">
          <div className="space-y-6 max-w-sm text-center">
            <span className="text-xs uppercase tracking-[0.6em] text-neutral-500 font-bold block animate-pulse">
              INITIALIZING DECODE SCAN
            </span>
            <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-5xl font-black italic tracking-tighter text-white">
              {loadingProgress}%
            </div>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Configuring tactical camera scopes and raster matrices for model {item.title}.
            </p>
          </div>
        </div>
      )}

      {/* Scrollable Storytelling Layer */}
      {imagesLoaded && (
        <div className="scroll-track relative z-10 w-full h-[400vh]">
          
          {/* Splash Section */}
          <div className="h-screen w-full flex flex-col items-center justify-center pointer-events-none relative">
            <div className="text-center space-y-2">
              <span className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 animate-pulse block">
                SCROLL TO SCAN PHYSICAL ARCHIVE
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic text-white/50">
                {item.title}
              </h2>
            </div>
          </div>

          {/* Slide 1 */}
          <div className="h-screen w-full flex items-center justify-end px-6 md:px-24 pointer-events-none relative">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl max-w-md pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <span className="text-xs uppercase tracking-[0.6em] text-neutral-500 font-bold block mb-2">01 / DYNAMIC ANATOMY</span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Carbon Chassis Scan</h3>
              <p className="text-xs leading-relaxed text-neutral-400 font-light">
                Utilizing sub-millimeter carbon weaving, the chassis provides maximum torsional stiffness during high-impact lateral load transfers, retaining energy vectors with zero rebound loss.
              </p>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="h-screen w-full flex items-center justify-start px-6 md:px-24 pointer-events-none relative">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl max-w-md pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <span className="text-xs uppercase tracking-[0.6em] text-neutral-500 font-bold block mb-2">02 / INTERNALS SYSTEM</span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Aero-Knit Ventilation</h3>
              <p className="text-xs leading-relaxed text-neutral-400 font-light">
                Each mesh zone is structurally heat-welded using hyper-ventilated monofilaments to establish direct atmospheric exchange, cooling active hot spots instantly.
              </p>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="h-screen w-full flex items-center justify-end px-6 md:px-24 pointer-events-none relative">
            <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl max-w-md pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <span className="text-xs uppercase tracking-[0.6em] text-neutral-500 font-bold block mb-2">03 / PHYSICAL TRANSDUCTION</span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">Responsive Sole Charge</h3>
              <p className="text-xs leading-relaxed text-neutral-400 font-light">
                Engineered with dual-density quantum gel compounds, the sole compresses on strike to store impact load, then triggers full structural release at push-off.
              </p>
            </div>
          </div>

          {/* Slide 4 (Scan Complete Panel) */}
          <div className="h-screen w-full flex flex-col items-center justify-center px-6 pointer-events-none relative">
            <div className="bg-black/90 backdrop-blur-lg border border-white/10 p-10 md:p-16 rounded-2xl max-w-lg text-center pointer-events-auto shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-6">
              <span className="text-xs uppercase tracking-[0.6em] text-neutral-500 font-bold block">SCAN COMPLETION DECODE</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic text-white">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-400 font-light max-w-sm mx-auto">
                All structural scans, material trials, and weight ratios are securely registered. Return to the visual archive.
              </p>
              <div className="pt-4 flex gap-4 justify-center">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Return to Archive
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ImageSequenceModal;

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { gsap } from 'gsap';

const Navbar = () => {
  const { cartCount } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuRef = useRef(null);
  const linksContainerRef = useRef(null);
  const timelineRef = useRef(null);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle GSAP Mobile Menu Animations
  useEffect(() => {
    // Select all the link elements inside the mobile menu
    const links = linksContainerRef.current ? linksContainerRef.current.querySelectorAll('.mobile-nav-link') : [];
    
    // Create GSAP Timeline for menu open/close
    timelineRef.current = gsap.timeline({ paused: true });
    
    timelineRef.current
      .to(menuRef.current, {
        y: '0%',
        duration: 0.6,
        ease: 'power4.inOut',
      })
      .fromTo(links, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
        '-=0.2' // Start slightly before the menu finished sliding down
      );

    return () => {
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, []);

  // Play/Reverse GSAP timeline based on state change
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Stop page scrolling when menu is open
      timelineRef.current.play();
    } else {
      document.body.style.overflow = ''; // Re-enable page scrolling
      timelineRef.current.reverse();
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-widest text-white uppercase relative group z-50">
            Nick Shoes
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-xs uppercase tracking-widest transition-all duration-300 relative py-1 group ${
                    isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Section (Cart & Mobile Hamburger) */}
          <div className="flex items-center space-x-6 z-50">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="flex items-center space-x-2 text-xs uppercase tracking-widest hover:text-white text-gray-300 transition-colors group cursor-pointer"
            >
              <span>Cart</span>
              <span className="bg-white text-black text-[10px] px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors font-bold">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col justify-between w-6 h-4 cursor-pointer focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <span className={`w-6 h-[2px] bg-white transition-all duration-300 transform origin-left ${
                isOpen ? 'rotate-45 translate-y-[1px]' : ''
              }`}></span>
              <span className={`w-6 h-[2px] bg-white transition-all duration-300 ${
                isOpen ? 'opacity-0 scale-0' : 'opacity-100'
              }`}></span>
              <span className={`w-6 h-[2px] bg-white transition-all duration-300 transform origin-left ${
                isOpen ? '-rotate-45 -translate-y-[1px]' : ''
              }`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen GSAP Mobile Menu Overlay */}
      <div 
        ref={menuRef}
        className="fixed top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-xl z-40 transform -translate-y-full flex flex-col justify-center items-center md:hidden"
      >
        <div 
          ref={linksContainerRef}
          className="flex flex-col space-y-8 text-center"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`mobile-nav-link text-2xl uppercase tracking-widest py-2 transition-all duration-300 relative ${
                  isActive ? 'text-white font-bold' : 'text-gray-500 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-[2px] bg-white"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;

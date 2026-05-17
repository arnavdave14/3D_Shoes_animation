import { useRef } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video autoplay blocked:', e));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative cursor-pointer w-full aspect-[4/5] bg-neutral-900 overflow-hidden block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static Image */}
      <img 
        src={product.image} 
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-110 z-10"
      />
      
      {/* Looping Video */}
      <video
        ref={videoRef}
        src={product.video}
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 z-0"
        muted
        playsInline
        loop
      ></video>

      {/* Product Details Overlay */}
      <div className="absolute bottom-0 w-full p-8 z-20 bg-gradient-to-t from-black to-transparent transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex justify-between items-end">
           <div>
             <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{product.name}</h3>
             <p className="text-sm text-gray-400 mt-1 italic">{product.price}</p>
           </div>
           <div className="text-xs uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-bold border-b border-white pb-1">
             View Details
           </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

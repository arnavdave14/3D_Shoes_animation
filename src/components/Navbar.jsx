import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-widest text-white uppercase">
          Nick Shoes
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-10">
          <Link to="/" className="text-sm uppercase tracking-widest hover:text-white text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-sm uppercase tracking-widest hover:text-white text-gray-300 transition-colors">
            Shop
          </Link>
          <Link to="/gallery" className="text-sm uppercase tracking-widest hover:text-white text-gray-300 transition-colors">
            Gallery
          </Link>
          <Link to="/about" className="text-sm uppercase tracking-widest hover:text-white text-gray-300 transition-colors">
            About
          </Link>
        </div>

        {/* Cart */}
        <div>
          <Link 
            to="/cart" 
            className="flex items-center space-x-2 text-sm uppercase tracking-widest hover:text-white text-gray-300 transition-colors group cursor-pointer"
          >
            <span>Cart</span>
            <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors font-bold">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

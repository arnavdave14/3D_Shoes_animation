import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold uppercase tracking-widest mb-4">Nick Shoes</h3>
          <p className="text-sm">
            Elevating footwear with unparalleled craftsmanship and bold, modern aesthetics. Step into the future.
          </p>
        </div>
        <div className="flex flex-col space-y-2 text-sm">
          <h4 className="text-white uppercase tracking-widest font-semibold mb-2">Explore</h4>
          <Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link>
          <Link to="/gallery" className="hover:text-white transition-colors">Best Sellers</Link>
          <Link to="/shop" className="hover:text-white transition-colors">Collections</Link>
        </div>
        <div className="flex flex-col space-y-2 text-sm">
          <h4 className="text-white uppercase tracking-widest font-semibold mb-2">Support</h4>
          <Link to="/support?tab=faq" className="hover:text-white transition-colors">FAQ</Link>
          <Link to="/support?tab=shipping" className="hover:text-white transition-colors">Shipping & Returns</Link>
          <Link to="/support?tab=contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-xs">
        &copy; {new Date().getFullYear()} Nick Shoes. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

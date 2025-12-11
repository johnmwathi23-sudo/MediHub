import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, Plus } from 'lucide-react';
import { Button } from './ui/Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (location.pathname.startsWith('/admin')) {
      return (
          <div className="min-h-screen bg-gray-100 flex flex-col">
              <nav className="bg-slate-800 text-white shadow-md">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between h-16">
                          <div className="flex items-center">
                              <span className="text-xl font-bold">MediHub Admin</span>
                              <div className="ml-10 flex items-baseline space-x-4">
                                  <Link to="/admin/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Dashboard</Link>
                                  <Link to="/admin/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Products</Link>
                                  <Link to="/admin/orders" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700">Orders</Link>
                              </div>
                          </div>
                          <div className="flex items-center">
                              <span className="mr-4 text-sm text-gray-300">Welcome, {user?.name}</span>
                              <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
                          </div>
                      </div>
                  </div>
              </nav>
              <main className="flex-1 p-6">
                  {children}
              </main>
          </div>
      )
  }

  // Helper component for the Logo to ensure consistency
  const BrandLogo = () => (
    <div className="flex flex-col items-start leading-none">
      <div className="flex items-center">
        <span className="text-3xl sm:text-4xl font-extrabold text-medical-500 tracking-tight">Medi</span>
        <div className="relative flex items-center justify-center mx-0.5" style={{ height: '32px', width: '32px' }}>
           {/* Custom Green Cross */}
           <div className="absolute bg-brand-green w-2 h-8 rounded-sm"></div>
           <div className="absolute bg-brand-green w-8 h-2 rounded-sm"></div>
        </div>
        <span className="text-3xl sm:text-4xl font-extrabold text-brand-gray tracking-tight">ub</span>
      </div>
      <span className="text-[0.65rem] sm:text-xs font-bold text-brand-gray uppercase tracking-widest pl-1 mt-1">Your Medical Hub</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="bg-medical-600 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <p>📞 +254 728 708495 | 📧 info@medihub.africa</p>
          <p>Kenya's Trusted Medical Equipment Supplier</p>
        </div>
      </div>

      {/* Navbar */}
      <nav className="border-b sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center py-2">
                <BrandLogo />
              </Link>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8 h-full items-center">
                <Link to="/" className="border-transparent text-gray-500 hover:text-medical-600 inline-flex items-center px-1 pt-1 text-sm font-medium">Home</Link>
                <Link to="/shop" className="border-transparent text-gray-500 hover:text-medical-600 inline-flex items-center px-1 pt-1 text-sm font-medium">Shop</Link>
                <Link to="/about" className="border-transparent text-gray-500 hover:text-medical-600 inline-flex items-center px-1 pt-1 text-sm font-medium">About</Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative p-2 text-gray-400 hover:text-medical-600">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-medical-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative flex items-center space-x-2">
                   {isAdmin && (
                       <Link to="/admin/dashboard" className="text-sm text-medical-600 font-medium mr-2">Admin</Link>
                   )}
                   <span className="text-sm text-gray-700 hidden md:block">Hi, {user.name.split(' ')[0]}</span>
                   <button onClick={handleLogout} className="text-gray-400 hover:text-gray-500">
                     <LogOut className="h-5 w-5" />
                   </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center text-sm font-medium text-gray-500 hover:text-medical-600">
                  <User className="h-5 w-5 mr-1" /> Login
                </Link>
              )}
              
              <div className="sm:hidden flex items-center">
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 hover:text-gray-600">
                   {isMobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-t p-4 space-y-2 shadow-lg absolute w-full z-50">
             <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
             <Link to="/shop" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
             <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
             <Link to="/cart" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Cart ({cartCount})</Link>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <div className="mb-4">
                  {/* Footer Logo Version (White text) */}
                   <div className="flex flex-col items-start leading-none">
                      <div className="flex items-center">
                        <span className="text-3xl font-extrabold text-white tracking-tight">Medi</span>
                        <div className="relative flex items-center justify-center mx-0.5" style={{ height: '24px', width: '24px' }}>
                           <div className="absolute bg-brand-green w-1.5 h-6 rounded-sm"></div>
                           <div className="absolute bg-brand-green w-6 h-1.5 rounded-sm"></div>
                        </div>
                        <span className="text-3xl font-extrabold text-white tracking-tight">ub</span>
                      </div>
                      <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest pl-1 mt-1">Your Medical Hub</span>
                    </div>
              </div>
              <p className="text-gray-400 text-sm">
                Kenya's premier supplier of medical equipment and hospital supplies. Quality you can trust.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/shop?cat=Diagnostic" className="hover:text-white">Diagnostic</Link></li>
                <li><Link to="/shop?cat=Clinical" className="hover:text-white">Hospital Furniture</Link></li>
                <li><Link to="/shop?cat=Mobility" className="hover:text-white">Mobility Aids</Link></li>
                <li><Link to="/shop?cat=Laboratory" className="hover:text-white">Laboratory</Link></li>
              </ul>
            </div>
            <div>
               <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
               <ul className="space-y-2 text-sm text-gray-400">
                 <li>Nairobi, Kenya</li>
                 <li>+254 728 708495</li>
                 <li>info@medihub.africa</li>
               </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MediHub Kenya. All rights reserved. 
              <span className="mx-2">|</span> 
              <Link to="/login" className="hover:text-white">Admin Login</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
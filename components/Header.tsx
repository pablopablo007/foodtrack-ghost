
import React, { useState, useEffect } from 'react';
import { Tab, User } from '../types';
import { ShoppingBag, ClipboardList, Ghost, LogOut, Clock, LayoutDashboard, ChefHat, Menu as MenuIcon, X } from 'lucide-react';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  cartCount: number;
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, cartCount, user, onLogout }) => {
  const [animateCart, setAnimateCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const isAdmin = user.role === 'admin';
  const isCook = user.role === 'cook';

  const getNavItems = () => {
    if (isAdmin) {
       return [
         { id: 'admin', label: 'Dashboard', icon: LayoutDashboard },
         { id: 'menu', label: 'Vista Menú', icon: ShoppingBag },
       ] as const;
    }
    if (isCook) {
      return [
        { id: 'kitchen', label: 'Comandas', icon: ChefHat },
        { id: 'menu', label: 'Vista Menú', icon: ShoppingBag },
      ] as const;
    }
    return [
      { id: 'menu', label: 'Menú', icon: ShoppingBag },
      { id: 'status', label: 'Rastrear', icon: ClipboardList },
      { id: 'history', label: 'Historial', icon: Clock },
    ] as const;
  };

  const navItems = getNavItems();

  return (
    <>
      <header 
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled || mobileMenuOpen 
            ? 'bg-white shadow-md py-3' 
            : 'bg-white/95 backdrop-blur-sm shadow-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => setActiveTab(isAdmin ? 'admin' : isCook ? 'kitchen' : 'menu')}
            >
              <div className="bg-orange-500 p-2 rounded-lg text-white group-hover:bg-slate-900 transition-colors">
                <Ghost size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-800 italic">
                FOOD<span className="text-orange-500">TRACK</span>
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                const isCartItem = item.id === 'menu' && !isAdmin && !isCook;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`
                      relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2
                      ${isActive 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                      }
                    `}
                  >
                    <Icon 
                      size={16} 
                      className={`${isActive ? 'text-orange-500' : ''} ${isCartItem && animateCart ? 'scale-125 text-orange-600' : ''}`} 
                    />
                    <span>{item.label}</span>
                    
                    {isCartItem && cartCount > 0 && user.role === 'client' && (
                      <span className="ml-1 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* User Profile Desktop */}
            <div className="hidden md:flex items-center gap-4">
               <div className="text-right">
                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isAdmin ? 'Admin' : isCook ? 'Kitchen' : 'Guest'}
                 </p>
                 <p className="text-sm font-bold text-slate-800 leading-none">{user.name.split(' ')[0]}</p>
               </div>
               <button 
                  onClick={onLogout}
                  className="p-2 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
               </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-slate-600 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-24 px-6 animate-fadeIn">
           <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-4 rounded-xl flex items-center gap-4 text-lg font-bold border ${activeTab === item.id ? 'bg-orange-50 border-orange-200 text-orange-700' : 'border-slate-100 text-slate-600'}`}
                >
                  <item.icon className={activeTab === item.id ? 'text-orange-500' : ''} />
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-2"></div>
              <button 
                onClick={onLogout}
                className="p-4 rounded-xl flex items-center gap-4 text-lg font-bold text-red-500 hover:bg-red-50"
              >
                <LogOut /> Cerrar Sesión
              </button>
           </div>
        </div>
      )}
    </>
  );
};

export default Header;

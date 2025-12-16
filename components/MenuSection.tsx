import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../api';
import { Plus, X, Flame, Star, Zap, Search } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';

interface MenuSectionProps {
  onAddToCart: (product: Product) => void;
  isGuest: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, isGuest }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(i => i.category)));
    return ['Todos', ...cats];
  }, [products]);

  const filteredItems = useMemo(() => {
    let items = products;
    if (selectedCategory !== 'Todos') {
      items = items.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return items;
  }, [selectedCategory, searchTerm, products]);

  // Pagination
  const {
    currentItems: paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
  } = usePagination({ items: filteredItems, itemsPerPage: 9 });

  return (
    <div className="py-4">
      {/* Header & Filter */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Nuestro Menú</h1>
        <p className="text-slate-500 mb-6">Selecciona tus favoritos y ordénalos al instante.</p>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border ${selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {paginatedItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            {/* Image Area */}
            <div
              className="relative h-48 cursor-pointer overflow-hidden"
              onClick={() => setSelectedProduct(item)}
            >
              <img
                src={item.image?.startsWith('http') ? item.image : item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-md text-xs font-bold shadow-sm uppercase tracking-wider">
                {item.category}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{item.name}</h3>
                <span className="text-lg font-black text-orange-600">${Number(item.price).toFixed(2)}</span>
              </div>

              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                {item.description}
              </p>

              <button
                onClick={() => !isGuest && onAddToCart(item)}
                disabled={isGuest}
                className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${isGuest
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-orange-600 text-white shadow-lg shadow-slate-200'
                  }`}
              >
                {isGuest ? 'Solo Vista' : (
                  <>
                    Agregar <Plus size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onPrevious={prevPage}
        onNext={nextPage}
        onFirst={goToFirstPage}
        onLast={goToLastPage}
        totalItems={filteredItems.length}
        itemsPerPage={9}
      />

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full transition-all shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img
                src={selectedProduct.image?.startsWith('http') ? selectedProduct.image : selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest">
                  {selectedProduct.category}
                </span>
                <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Flame size={14} fill="currentColor" /> Popular
                </span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 mb-4">{selectedProduct.name}</h2>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                {selectedProduct.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Tiempo</p>
                  <p className="text-slate-800 font-bold flex items-center gap-2"><Zap size={14} className="text-amber-500" /> 15 min</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Calorías</p>
                  <p className="text-slate-800 font-bold flex items-center gap-2"><Flame size={14} className="text-red-500" /> ~450</p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Precio</p>
                  <p className="text-3xl font-black text-slate-900">${Number(selectedProduct.price).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => {
                    if (!isGuest) onAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={isGuest}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold uppercase tracking-wide transition-all transform hover:-translate-y-1 ${isGuest
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200'
                    }`}
                >
                  {isGuest ? 'Bloqueado' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSection;

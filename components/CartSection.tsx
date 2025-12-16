
import React from 'react';
import { CartItem } from '../types';
import { Trash2, ArrowRight, Minus, ShoppingBag } from 'lucide-react';

interface CartSectionProps {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartSection: React.FC<CartSectionProps> = ({ cart, onRemove, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center sticky top-24 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="text-slate-300 w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Tu bandeja está vacía</h3>
        <p className="text-slate-400 text-sm">Explora el menú y agrega algo delicioso.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
      <div className="bg-slate-50 p-5 border-b border-slate-100">
        <h2 className="text-lg font-black text-slate-800 flex items-center justify-between">
          Tu Pedido
          <span className="bg-orange-100 text-orange-700 text-xs font-bold py-1 px-3 rounded-full">
            {cart.reduce((acc, item) => acc + item.quantity, 0)} items
          </span>
        </h2>
      </div>

      <div className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
        <ul className="space-y-4">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-4 items-center group">
              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ${Number(item.price).toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-slate-900">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className={`transition-colors p-1 rounded-md ${item.quantity > 1
                      ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                >
                  {item.quantity > 1 ? <Minus size={14} /> : <Trash2 size={14} />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-50 p-6 border-t border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Subtotal</span>
          <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
        >
          Confirmar Orden
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CartSection;

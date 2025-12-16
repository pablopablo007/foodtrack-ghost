import React from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, Calendar, ArrowRight, Package, Receipt, AlertCircle } from 'lucide-react';

interface HistorySectionProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ orders, onViewDetails }) => {
  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PREPARING: return 'bg-amber-100 text-amber-700';
      case OrderStatus.READY: return 'bg-emerald-100 text-emerald-700';
      case OrderStatus.DELIVERED: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Receipt className="text-slate-400 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sin historial de pedidos</h2>
          <p className="text-slate-500">Aún no has realizado ningún pedido con nosotros.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
        <Clock className="text-emerald-500" />
        Historial de Pedidos
      </h2>

      <div className="space-y-6">
        {sortedOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 text-white px-3 py-1 rounded font-mono font-bold text-sm tracking-wider">
                  #{order.id}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Calendar size={14} />
                  {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Productos</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700">
                        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full h-fit">
                          {item.quantity}x
                        </span>
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 gap-4 min-w-[200px]">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total del Pedido</p>
                    <p className="text-2xl font-bold text-slate-900">${Number(order.total).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => onViewDetails(order.id)}
                    className="group flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg w-full md:w-auto justify-center"
                  >
                    Ver Estado Actual
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
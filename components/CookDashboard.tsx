
import React from 'react';
import { Order, OrderStatus } from '../types';
import { ChefHat, Clock, CheckCircle } from 'lucide-react';

interface CookDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const CookDashboard: React.FC<CookDashboardProps> = ({ orders, onUpdateStatus }) => {
  // Solo mostrar pedidos que no han sido entregados
  // Ordenar: Los más antiguos primero (FIFO - First In First Out) para la cocina
  const kitchenOrders = orders
    .filter(o => o.status !== OrderStatus.DELIVERED)
    .sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <ChefHat className="text-orange-500" size={32} />
            Cocina / Comandas
          </h2>
          <p className="text-slate-500">
            {kitchenOrders.length === 0 
              ? "No hay pedidos pendientes. ¡Buen trabajo!" 
              : `Tienes ${kitchenOrders.length} pedidos activos.`}
          </p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold border border-orange-200">
          Modo Cocina
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-slate-300 w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">Todo limpio, Chef.</h3>
          <p className="text-slate-400">Esperando nuevas órdenes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {kitchenOrders.map((order) => {
            const isReady = order.status === OrderStatus.READY;
            const timeElapsed = Math.floor((Date.now() - order.createdAt) / 1000 / 60); // Minutos

            return (
              <div 
                key={order.id} 
                className={`rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 ${isReady ? 'bg-emerald-50 border-emerald-200 opacity-75' : 'bg-white border-orange-100 hover:border-orange-300'}`}
              >
                {/* Header Ticket */}
                <div className={`p-4 border-b flex justify-between items-center ${isReady ? 'bg-emerald-100 border-emerald-200' : 'bg-orange-50 border-orange-100'}`}>
                  <div>
                    <span className="block text-2xl font-mono font-black text-slate-800">#{order.id}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {order.customerName || 'Cliente'}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-sm font-bold text-slate-600">
                      <Clock size={16} />
                      {timeElapsed} min
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isReady ? 'bg-emerald-200 text-emerald-800' : 'bg-orange-200 text-orange-800'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6">
                  <ul className="space-y-4">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="bg-slate-900 text-white font-bold min-w-[32px] h-8 rounded-lg flex items-center justify-center text-lg">
                          {item.quantity}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 text-lg leading-tight">{item.name}</p>
                          {/* Aquí se podrían agregar notas del pedido si existieran */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  {!isReady ? (
                    <button
                      onClick={() => onUpdateStatus(order.id, OrderStatus.READY)}
                      className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <CheckCircle size={24} />
                      Marcar LISTO
                    </button>
                  ) : (
                    <div className="flex gap-2">
                       <button
                        disabled
                        className="flex-1 bg-emerald-100 text-emerald-700 font-bold py-3 rounded-xl cursor-default border border-emerald-200"
                      >
                        ¡Está Listo!
                      </button>
                      <button 
                         onClick={() => onUpdateStatus(order.id, OrderStatus.DELIVERED)}
                         className="px-4 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl font-bold text-sm transition-colors border border-blue-200"
                         title="Marcar como entregado (limpiar de pantalla)"
                      >
                        Entregar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CookDashboard;

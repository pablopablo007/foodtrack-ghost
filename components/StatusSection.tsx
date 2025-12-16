import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, ChefHat, Bell, Smile, Utensils, AlertCircle, History, ChevronRight, FileText, Printer, X } from 'lucide-react';

interface StatusSectionProps {
  orders: Order[];
  initialCode?: string | null;
}

const StatusSection: React.FC<StatusSectionProps> = ({ orders, initialCode }) => {
  const [code, setCode] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [simulatedStatus, setSimulatedStatus] = useState<OrderStatus | null>(null);
  // Progreso visual para la rueda (0 a 100)
  const [progress, setProgress] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);

  // Auto-search if initialCode is provided
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      searchOrder(initialCode);
    }
  }, [initialCode]);

  // Ordenar pedidos por fecha (más reciente primero) para el historial lateral
  const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  // Re-evaluate status based on time elapsed
  useEffect(() => {
    if (!foundOrder) {
      setSimulatedStatus(null);
      setProgress(0);
      return;
    }

    const updateStatus = () => {
      const now = Date.now();
      const elapsedSeconds = (now - foundOrder.createdAt) / 1000;

      let currentStatus = OrderStatus.PREPARING;
      let currentProgress = 33;

      if (elapsedSeconds > 20 && elapsedSeconds <= 60) {
        currentStatus = OrderStatus.READY;
        currentProgress = 100;
      } else if (elapsedSeconds > 60) {
        currentStatus = OrderStatus.DELIVERED;
        currentProgress = 100;
      } else {
        // Simular progreso durante la preparación (de 33% a 90%)
        // Mapeamos 0-20 segundos a 33-90%
        const prepProgress = 33 + (elapsedSeconds / 20) * 57;
        currentProgress = Math.min(prepProgress, 90);
      }

      setSimulatedStatus(currentStatus);
      setProgress(currentProgress);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000); // Actualizar más frecuente para la animación fluida
    return () => clearInterval(interval);
  }, [foundOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(code);
  };

  const searchOrder = (searchCode: string) => {
    setError('');
    setFoundOrder(null);
    setShowInvoice(false);

    const normalizedCode = searchCode.trim().toUpperCase();
    if (!normalizedCode) return;

    const order = orders.find(o => o.id === normalizedCode);
    if (order) {
      setFoundOrder(order);
      setCode(normalizedCode);
    } else {
      setError('Código no encontrado. Por favor verifica e intenta de nuevo.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Configuración visual según estado
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PREPARING:
        return {
          color: 'text-amber-500',
          stroke: 'stroke-amber-500',
          bg: 'bg-amber-50',
          icon: <ChefHat size={48} className="text-amber-500 animate-bounce" />,
          title: 'En Preparación',
          message: 'Nuestros chefs fantasmas están cocinando tu pedido.',
          subMessage: 'Espera un momento...'
        };
      case OrderStatus.READY:
        return {
          color: 'text-emerald-500',
          stroke: 'stroke-emerald-500',
          bg: 'bg-emerald-50',
          icon: <Bell size={48} className="text-emerald-500 animate-pulse" />,
          title: '¡Listo para Retirar!',
          message: 'Tu pedido está esperando en el mostrador.',
          subMessage: 'Acércate con tu código.'
        };
      case OrderStatus.DELIVERED:
        return {
          color: 'text-blue-500',
          stroke: 'stroke-blue-500',
          bg: 'bg-blue-50',
          icon: <Smile size={48} className="text-blue-500" />,
          title: 'Entregado',
          message: '¡Esperamos que lo disfrutes!',
          subMessage: 'Gracias por tu preferencia.'
        };
      default:
        return {
          color: 'text-slate-400',
          stroke: 'stroke-slate-400',
          bg: 'bg-slate-50',
          icon: <Utensils size={48} />,
          title: 'Desconocido',
          message: '',
          subMessage: ''
        };
    }
  };

  // Cálculos para el SVG circular
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* Main Search Column */}
      <div className="md:col-span-2">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Rastrea tu Pedido</h2>
          <p className="text-slate-600">Ingresa el código único de 6 caracteres.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-8">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: X7K9P2"
              className="flex-1 border-2 border-slate-200 rounded-lg px-4 py-3 text-lg uppercase tracking-wider font-mono focus:border-emerald-500 focus:outline-none transition-colors"
              maxLength={6}
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Consultar</span>
            </button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100 animate-fadeIn">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {foundOrder && simulatedStatus && (
            <div className="animate-fadeIn">
              {/* WHEEL ANIMATION SECTION */}
              <div className="flex flex-col items-center justify-center py-8 relative">
                {(() => {
                  const config = getStatusConfig(simulatedStatus);
                  return (
                    <>
                      <div className="relative w-48 h-48 mb-6">
                        {/* Background Circle */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          {/* Progress Circle */}
                          <circle
                            cx="96"
                            cy="96"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeLinecap="round"
                            className={`${config.stroke} transition-all duration-1000 ease-out`}
                            style={{
                              strokeDasharray: circumference,
                              strokeDashoffset: strokeDashoffset
                            }}
                          />
                        </svg>

                        {/* Center Icon */}
                        <div className={`absolute inset-0 flex items-center justify-center rounded-full m-4 ${config.bg} shadow-inner`}>
                          {config.icon}
                        </div>
                      </div>

                      <h3 className={`text-3xl font-bold mb-2 ${config.color} text-center animate-pulse`}>
                        {config.title}
                      </h3>
                      <p className="text-slate-600 font-medium text-lg text-center">
                        {config.message}
                      </p>
                      <p className="text-slate-400 text-sm text-center mt-1">
                        {config.subMessage}
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <div className="flex justify-between items-end mb-4">
                  <h4 className="font-semibold text-slate-800">Detalle del Pedido #{foundOrder.id}</h4>
                  <span className="text-xs text-slate-400">
                    {new Date(foundOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <ul className="space-y-3 mb-4">
                  {foundOrder.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded">
                      <span><span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}</span>
                      <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg text-slate-900 border-t border-slate-100 pt-4 mb-6">
                  <span>Total</span>
                  <span>${Number(foundOrder.total).toFixed(2)}</span>
                </div>

                {/* Botón Generar Factura */}
                <button
                  onClick={() => setShowInvoice(true)}
                  className="w-full border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Generar Factura
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent History Sidebar */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden sticky top-24">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
            <History className="text-slate-400" size={20} />
            <h3 className="font-bold text-slate-700">Acceso Rápido</h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No tienes pedidos recientes.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentOrders.map(order => (
                  <li
                    key={order.id}
                    onClick={() => searchOrder(order.id)}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors group ${foundOrder?.id === order.id ? 'bg-emerald-50 border-l-4 border-emerald-500 pl-3' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {order.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">
                        {order.items.length} items • ${Number(order.total).toFixed(2)}
                      </span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* INVOICE MODAL */}
      {showInvoice && foundOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #invoice-content, #invoice-content * {
                visibility: visible;
              }
              #invoice-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20px;
                background: white !important;
                color: black !important;
                box-shadow: none;
                border: none;
              }
              #no-print {
                display: none !important;
              }
            }
          `}</style>
          <div id="invoice-content" className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden relative animate-scaleIn">
            {/* Botones de acción (No imprimir) */}
            <div id="no-print" className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => setShowInvoice(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Contenido Factura */}
            <div className="p-8 bg-white text-slate-900">
              <div className="text-center border-b-2 border-dashed border-slate-300 pb-6 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-2 text-slate-900">FoodTrack</h1>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Ghost Kitchens S.A.</p>
                <p className="text-xs text-slate-500">Calle Fantasma 123, Nube Digital</p>
                <p className="text-xs text-slate-500">RUC: 20555123456</p>
              </div>

              <div className="mb-6 text-sm text-slate-800">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Orden:</span>
                  <span className="font-mono font-bold text-lg">#{foundOrder.id}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Fecha:</span>
                  <span>{new Date(foundOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hora:</span>
                  <span>{new Date(foundOrder.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="mb-6">
                {/* Header de la tabla */}
                <div className="flex border-b-2 border-slate-800 pb-2 mb-2 font-bold text-sm text-slate-900">
                  <div className="w-10 text-center">Cant.</div>
                  <div className="flex-1 pl-2">Descripción</div>
                  <div className="w-20 text-right">P. Unit</div>
                  <div className="w-20 text-right">Importe</div>
                </div>

                {/* Lista de items */}
                <div className="font-mono text-sm text-slate-800 space-y-2">
                  {foundOrder.items.map((item, i) => (
                    <div key={i} className="flex border-b border-slate-100 pb-2">
                      <div className="w-10 text-center font-bold">{item.quantity}</div>
                      <div className="flex-1 pl-2">{item.name}</div>
                      <div className="w-20 text-right text-slate-500">${Number(item.price).toFixed(2)}</div>
                      <div className="w-20 text-right font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-8 text-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal:</span>
                  <span>${(Number(foundOrder.total) * 0.82).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">I.G.V (18%):</span>
                  <span>${(Number(foundOrder.total) * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-slate-900 pt-2 mt-2 text-slate-900">
                  <span>TOTAL:</span>
                  <span>${Number(foundOrder.total).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500">
                <p className="mb-1">¡Gracias por preferirnos!</p>
                <p>Este es un comprobante electrónico.</p>
                <div className="mt-4 font-mono text-[10px] text-slate-400">
                  REF: {foundOrder.id}-{Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>

            {/* Footer Botón Imprimir (No imprimir en papel) */}
            <div id="no-print" className="bg-slate-50 p-4 border-t border-slate-200 flex justify-center">
              <button
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all"
              >
                <Printer size={20} />
                Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StatusSection;

import React, { useState } from 'react';
import { CartItem } from '../types';
import { ArrowLeft, CheckCircle, Receipt, CreditCard, Lock, Calendar, User } from 'lucide-react';

interface CheckoutSectionProps {
  cart: CartItem[];
  total: number;
  onConfirm: () => void;
  onBack: () => void;
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({ cart, total, onConfirm, onBack }) => {
  const [step, setStep] = useState<'summary' | 'payment'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formato simple para número de tarjeta
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    // Formato para fecha
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 3) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    }

    // Limitar CVC
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular tiempo de red bancaria
    setTimeout(() => {
      onConfirm();
    }, 2500);
  };

  if (isProcessing) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100 animate-fadeIn">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
          <CreditCard className="absolute inset-0 m-auto text-orange-500" size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Procesando Pago</h2>
        <p className="text-slate-500">Conectando con el banco fantasma...</p>
        <p className="text-xs text-slate-400 mt-4">No cierres esta ventana</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <button
          onClick={step === 'payment' ? () => setStep('summary') : onBack}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          {step === 'payment' ? 'Volver al resumen' : 'Volver al menú'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: RESUMEN O PAGO */}
        <div className="lg:col-span-2 space-y-6">

          {step === 'summary' ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Receipt className="text-orange-500" />
                  Resumen del Pedido
                </h2>
                <span className="bg-slate-800 text-xs px-3 py-1 rounded-full border border-slate-700 font-mono">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                </span>
              </div>

              <div className="p-6">
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="h-16 w-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                        <div className="text-xs text-slate-400">{item.quantity} x ${Number(item.price).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slideUp">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <CreditCard className="text-orange-500" />
                  Detalles del Pago
                </h2>
              </div>

              <div className="p-8">
                {/* TARJETA VISUAL */}
                <div className="mb-8 relative w-full max-w-sm mx-auto aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-orange-600 via-red-700 to-slate-900 text-white p-6 shadow-2xl shadow-orange-900/30 border border-white/10 flex flex-col justify-between transform transition-transform hover:scale-105 duration-500">
                  {/* Chip & Logo */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-90 relative overflow-hidden shadow-inner">
                      <div className="absolute inset-0 border border-yellow-600/30 rounded-md" style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, transparent 60%)' }}></div>
                    </div>
                    <span className="font-bold italic text-xl tracking-tighter text-white/90">GHOST</span>
                  </div>

                  {/* Number */}
                  <div className="mt-4">
                    <div className="text-[10px] text-white/60 mb-1 uppercase tracking-widest">Número de Tarjeta</div>
                    <div className="font-mono text-2xl tracking-wider text-shadow">
                      {cardData.number || '•••• •••• •••• ••••'}
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <div className="text-[10px] text-white/60 uppercase tracking-widest">Titular</div>
                      <div className="font-medium tracking-wide uppercase truncate max-w-[160px]">
                        {cardData.name || 'TU NOMBRE'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-white/60 uppercase tracking-widest">Expira</div>
                      <div className="font-mono font-medium">
                        {cardData.expiry || 'MM/YY'}
                      </div>
                    </div>
                  </div>

                  {/* Gloss Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-2xl"></div>
                </div>

                {/* FORMULARIO */}
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Número de Tarjeta</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="text"
                        name="number"
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono font-bold text-slate-700"
                        maxLength={19}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Titular</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="text"
                        name="name"
                        placeholder="COMO APARECE EN LA TARJETA"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all uppercase font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Expiración</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          required
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono font-bold text-slate-700"
                          maxLength={5}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">CVV / CVC</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          required
                          type="password"
                          name="cvc"
                          placeholder="123"
                          value={cardData.cvc}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono font-bold text-slate-700"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-slate-900 hover:bg-orange-600 text-white text-lg font-black uppercase tracking-wide py-4 px-6 rounded-xl shadow-lg shadow-slate-300 transition-all hover:shadow-orange-200 transform hover:-translate-y-1 flex justify-center items-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Pagar ${total.toFixed(2)}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: TOTALES */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
            <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Detalle de Cobro</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Servicio Ghost</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Impuestos</span>
                <span>Incluidos</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-slate-900">Total</span>
              <span className="text-4xl font-black text-orange-600">${total.toFixed(2)}</span>
            </div>

            {step === 'summary' && (
              <>
                <button
                  onClick={() => setStep('payment')}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-orange-200 transition-all hover:shadow-xl flex justify-center items-center gap-2 mb-4 uppercase tracking-wide"
                >
                  Proceder al Pago <CreditCard size={20} />
                </button>
                <p className="text-xs text-center text-slate-400 leading-relaxed font-medium">
                  Aceptamos todas las tarjetas espectrales y criptomonedas del inframundo. Transacciones seguras con encriptación 256-bit.
                </p>
              </>
            )}

            {step === 'payment' && (
              <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 flex gap-3 items-start border border-slate-100">
                <Lock size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="font-medium">
                  Tus datos están protegidos. No guardamos información sensible de tu tarjeta real en nuestros servidores fantasma.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;


import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CartSection from './components/CartSection';
import StatusSection from './components/StatusSection';
import CheckoutSection from './components/CheckoutSection';
import HistorySection from './components/HistorySection';
import AdminDashboard from './components/AdminDashboard';
import CookDashboard from './components/CookDashboard';
import LandingPage from './components/LandingPage';
import Toast from './components/Toast';
import { Product, CartItem, Order, OrderStatus, Tab, User, Role, UserAccount } from './types';
import { Ghost, Utensils, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import { api } from './api';

// Updated generator to ensure uniqueness
const generateUniqueOrderCode = (existingOrders: Order[]): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let isUnique = false;
  const existingIds = new Set(existingOrders.map(o => o.id));

  while (!isUnique) {
    result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (!existingIds.has(result)) {
      isUnique = true;
    }
  }

  return result;
};

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null);
  const [orderToTrack, setOrderToTrack] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [animateCart, setAnimateCart] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const currentTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    localStorage.setItem('ghost_kitchen_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ghost_kitchen_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (totalItems > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    fetch('http://localhost:3000')
      .then(res => res.text())
      .then(data => addToast(`Backend connection successful: ${data}`, 'success'))
      .catch(err => console.error('Backend connection failed', err));
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogin = (name: string, role: Role, username?: string) => {
    setUser({ name, role, username });
    if (role === 'admin') setActiveTab('admin');
    else if (role === 'cook') setActiveTab('kitchen');
    else setActiveTab('menu');
  };

  const verifyStaffCredentials = async (username: string, password: string): Promise<UserAccount | null> => {
    try {
      const response = await api.login(username, password);
      if (response.success) {
        return {
          id: response.user.id,
          name: response.user.name,
          username: response.user.username,
          password: '', // No guardamos la contraseña
          role: response.user.role as Role
        };
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setActiveTab('menu');
  };

  const handleAddUser = async (newUser: UserAccount) => {
    try {
      const savedUser = await api.createUser({
        name: newUser.name,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role
      });
      setUsers(prev => [...prev, savedUser]);
      addToast(`Usuario ${newUser.name} creado correctamente`, 'success');
    } catch (error) {
      console.error('Error creating user:', error);
      addToast('Error al crear usuario', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      addToast('Usuario eliminado', 'info');
    } catch (error) {
      console.error('Error deleting user:', error);
      addToast('Error al eliminar usuario', 'error');
    }
  };

  const addToCart = (product: Product) => {
    if (user?.role === 'guest') {
      addToast('¡Solo ver y quedarse con las ganas! El Rey prohíbe comer a los invitados.', 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`Agregaste ${product.name} al carrito`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const goToCheckout = () => {
    if (cart.length > 0 && user?.role === 'client') {
      setActiveTab('checkout');
      window.scrollTo(0, 0);
    }
  };

  const confirmOrder = async () => {
    if (user?.role === 'guest') return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      customerName: user?.name,
      items: cart,
      total: total,
      status: OrderStatus.PREPARING,
    };

    try {
      const savedOrder = await api.createOrder(orderData);
      setOrders((prev) => [...prev, savedOrder]);
      setCart([]);
      setLastOrderCode(savedOrder.id);
      addToast('¡Pedido confirmado con éxito!', 'success');
    } catch (error) {
      console.error('Error creating order:', error);
      addToast('Error al crear la orden', 'error');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      addToast(`Orden #${orderId} actualizada a ${newStatus}`, 'info');
    } catch (error) {
      console.error('Error updating order status:', error);
      addToast('Error al actualizar la orden', 'error');
    }
  };

  const closeConfirmation = () => {
    if (lastOrderCode) {
      setOrderToTrack(lastOrderCode);
    }
    setLastOrderCode(null);
    setActiveTab('status');
  };

  const handleViewOrderHistory = (orderId: string) => {
    setOrderToTrack(orderId);
    setActiveTab('status');
    window.scrollTo(0, 0);
  };

  if (!user) {
    return <LandingPage onLogin={handleLogin} onVerifyStaff={verifyStaffCredentials} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">

      {/* Toast Container */}
      <div className="fixed top-24 right-4 z-[100] flex flex-col items-end pointer-events-none">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>

      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'checkout') setActiveTab(tab);
        }}
        cartCount={totalItems}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">

        {/* Guest Warning */}
        {user.role === 'guest' && activeTab === 'menu' && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded-r-xl shadow-sm flex items-center gap-4">
            <div className="bg-orange-100 p-2 rounded-full">
              <Lock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="font-bold text-orange-800">Zona de Espectadores</p>
              <p className="text-sm text-orange-700">
                Estás aquí para ver el menú y quedarte con las ganas. Solo el personal o clientes registrados pueden pedir.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Content Rendering */}
        <div>
          {activeTab === 'admin' && user.role === 'admin' && (
            <AdminDashboard
              orders={orders}
              onUpdateStatus={updateOrderStatus}
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'kitchen' && user.role === 'cook' && (
            <CookDashboard orders={orders} onUpdateStatus={updateOrderStatus} />
          )}

          {activeTab === 'menu' && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className={user.role === 'guest' || user.role === 'admin' || user.role === 'cook' ? "w-full" : "lg:w-2/3"}>
                <MenuSection onAddToCart={addToCart} isGuest={user.role === 'guest'} />
              </div>
              {user.role === 'client' && (
                <div className="lg:w-1/3 hidden lg:block">
                  <CartSection
                    cart={cart}
                    onRemove={removeFromCart}
                    onCheckout={goToCheckout}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'checkout' && user.role === 'client' && (
            <CheckoutSection
              cart={cart}
              total={currentTotal}
              onConfirm={confirmOrder}
              onBack={() => setActiveTab('menu')}
            />
          )}

          {activeTab === 'status' && (
            <StatusSection orders={orders} initialCode={orderToTrack} />
          )}

          {activeTab === 'history' && (
            <HistorySection orders={orders} onViewDetails={handleViewOrderHistory} />
          )}
        </div>
      </main>

      {/* Mobile Floating Cart Button */}
      {activeTab === 'menu' && user.role === 'client' && cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <button
            onClick={goToCheckout}
            className={`bg-orange-600 text-white rounded-full shadow-xl shadow-orange-600/30 p-4 flex items-center gap-4 hover:bg-orange-700 transition-all active:scale-95 ${animateCart ? 'ring-4 ring-orange-200 scale-105' : ''}`}
          >
            <div className="relative">
              <ShoppingBag className={`text-white transition-transform ${animateCart ? 'scale-125' : ''}`} size={24} />
              <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-orange-200">
                {totalItems}
              </span>
            </div>
            <div className="flex flex-col items-start mr-2">
              <span className="text-[10px] text-orange-100 font-bold uppercase tracking-wider">Total</span>
              <span className="text-xl font-black leading-none">${currentTotal.toFixed(2)}</span>
            </div>
            <ArrowRight size={20} className="text-orange-100" />
          </button>
        </div>
      )}

      {/* Order Confirmation Overlay */}
      {lastOrderCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>

            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-10 h-10 text-orange-600" />
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tight">¡Orden Recibida!</h2>
            <p className="text-slate-500 mb-8 font-medium">La cocina fantasma ha comenzado a preparar tu pedido.</p>

            <div className="bg-slate-100 rounded-2xl p-6 mb-8 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => { navigator.clipboard.writeText(lastOrderCode); addToast('Código copiado') }}>
              <p className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-2 font-bold">Tu Código de Retiro</p>
              <p className="text-5xl font-mono font-bold text-orange-600 tracking-widest">{lastOrderCode}</p>
            </div>

            <button
              onClick={closeConfirmation}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-1"
            >
              Rastrear Pedido
            </button>
          </div>
        </div>
      )}

      <footer className="bg-white text-slate-400 py-12 mt-auto border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Ghost size={24} className="text-slate-300" />
              <span className="font-black text-xl italic tracking-tighter text-slate-700">FOODTRACK</span>
            </div>
            <p className="text-xs font-mono">
              &copy; {new Date().getFullYear()} Ghost Kitchens. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

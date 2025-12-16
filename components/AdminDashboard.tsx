
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Role, UserAccount, Product } from '../types';
import { DollarSign, Package, CheckCircle, TrendingUp, Users, UserPlus, Trash2, Clock, ChefHat, Shield, User, ShoppingCart, Edit2, PlusCircle } from 'lucide-react';
import { api } from '../api';
import ImageUpload from './ImageUpload';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  users?: UserAccount[];
  onAddUser?: (user: UserAccount) => void;
  onDeleteUser?: (userId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateStatus, users = [], onAddUser, onDeleteUser }) => {
  const [activeSection, setActiveSection] = useState<'orders' | 'users' | 'products'>('orders');

  // User Form State
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'cook' as Role });
  const [userSuccessMsg, setUserSuccessMsg] = useState('');

  // Product Form State
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: '', image: '' });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');
  const [isUploadingProduct, setIsUploadingProduct] = useState(false);

  // Fetch products
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

  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddUser && newUser.name && newUser.username && newUser.password) {
      onAddUser({
        id: Math.random().toString(36).substr(2, 9),
        name: newUser.name,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role
      });
      setNewUser({ name: '', username: '', password: '', role: 'cook' });
      setUserSuccessMsg(`Usuario tipo ${newUser.role === 'cook' ? 'Cocinero' : newUser.role === 'client' ? 'Cliente' : 'Admin'} creado.`);
      setTimeout(() => setUserSuccessMsg(''), 3000);
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingProduct(true);
    try {
      let imagePath = newProduct.image;

      // Upload image if file is selected
      if (productImageFile) {
        const uploadResult = await api.uploadProductImage(productImageFile);
        imagePath = uploadResult.path;
      }

      // Create product
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        image: imagePath,
      };

      const savedProduct = await api.createProduct(productData);
      setProducts(prev => [...prev, savedProduct]);
      setNewProduct({ name: '', description: '', price: 0, category: '', image: '' });
      setProductImageFile(null);
      setProductSuccessMsg('Producto creado exitosamente');
      setTimeout(() => setProductSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    } finally {
      setIsUploadingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PREPARING:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case OrderStatus.READY:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case OrderStatus.DELIVERED:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === OrderStatus.PREPARING) return OrderStatus.READY;
    if (current === OrderStatus.READY) return OrderStatus.DELIVERED;
    return null;
  };

  // Ordenar: Pendientes primero, luego nuevos
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === OrderStatus.DELIVERED && b.status !== OrderStatus.DELIVERED) return 1;
    if (a.status !== OrderStatus.DELIVERED && b.status === OrderStatus.DELIVERED) return -1;
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Panel de Control</h2>
          <p className="text-slate-500">Gestión administrativa y operativa.</p>
        </div>

        {/* Navigation Tabs within Admin */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <TrendingUp size={16} /> Pedidos
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'users' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users size={16} /> Usuarios
          </button>
          <button
            onClick={() => setActiveSection('products')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeSection === 'products' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={16} /> Productos
          </button>
        </div>
      </div>

      {activeSection === 'orders' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Ingresos Totales</p>
                <p className="text-2xl font-bold text-slate-900">${Number(totalRevenue).toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Pedidos</p>
                <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-slate-900">{activeOrders}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Completados</p>
                <p className="text-2xl font-bold text-slate-900">{completedOrders}</p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Cola de Pedidos</h3>
              <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                {activeOrders} activos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4 text-left">Orden</th>
                    <th className="px-6 py-4 text-left">Cliente</th>
                    <th className="px-6 py-4 text-left">Items</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Estado Actual</th>
                    <th className="px-6 py-4 text-left">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-slate-900">#{order.id}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {order.customerName ? order.customerName.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="font-medium text-slate-700 text-sm">
                            {order.customerName || 'Anónimo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 max-w-[200px]">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getNextStatus(order.status) ? (
                          <button
                            onClick={() => {
                              const next = getNextStatus(order.status);
                              if (next) onUpdateStatus(order.id, next);
                            }}
                            className="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-2"
                          >
                            Avanzar a {getNextStatus(order.status) === OrderStatus.READY ? 'Listo' : 'Entregado'}
                            <CheckCircle size={14} />
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic flex items-center gap-1">
                            <CheckCircle size={14} /> Completado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sortedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No hay pedidos registrados en el sistema.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeSection === 'users' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">

          {/* Create User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <UserPlus className="text-emerald-500" /> Crear Cuenta
              </h3>
              <p className="text-sm text-slate-500 mb-6">Agrega cocineros o registra clientes VIP con contraseña.</p>

              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Rol de Usuario</label>
                  <div className="relative">
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 appearance-none font-medium text-slate-700 cursor-pointer"
                    >
                      <option value="cook">👨‍🍳 Cocinero (Staff)</option>
                      <option value="client">👤 Cliente (Registrado)</option>
                      <option value="admin">🛡️ Administrador</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder={newUser.role === 'cook' ? 'Ej. Chef Mario' : 'Ej. Cliente Ana'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Usuario (Login)</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Sin espacios"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg mt-4 flex justify-center items-center gap-2"
                >
                  <UserPlus size={18} />
                  Crear Usuario
                </button>

                {userSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium text-center animate-fadeIn border border-emerald-100 flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> {userSuccessMsg}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Cuentas Registradas</h3>
                <span className="bg-white px-2 py-1 rounded-md text-xs font-bold text-slate-500 border border-slate-200">
                  {users.length} usuarios
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {users.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">No hay usuarios configurados.</div>
                ) : (
                  users.map(user => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm
                          ${user.role === 'admin' ? 'bg-purple-500 shadow-purple-200' :
                            user.role === 'cook' ? 'bg-orange-500 shadow-orange-200' :
                              'bg-blue-500 shadow-blue-200'}`}>
                          {user.role === 'admin' && <Shield size={20} />}
                          {user.role === 'cook' && <ChefHat size={20} />}
                          {user.role === 'client' && <User size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{user.name}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono border border-slate-200">@{user.username}</span>
                            <span className={`uppercase font-bold tracking-wider px-1.5 py-0.5 rounded text-[10px] 
                               ${user.role === 'admin' ? 'text-purple-600 bg-purple-50' :
                                user.role === 'cook' ? 'text-orange-600 bg-orange-50' :
                                  'text-blue-600 bg-blue-50'}`}>
                              {user.role === 'admin' ? 'Administrador' : user.role === 'cook' ? 'Cocinero' : 'Cliente'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Don't allow deleting the last admin */}
                        {user.role !== 'admin' || users.filter(u => u.role === 'admin').length > 1 ? (
                          <button
                            onClick={() => onDeleteUser && onDeleteUser(user.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={20} />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-300 italic px-2">Principal</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : activeSection === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideUp">

          {/* Create Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PlusCircle className="text-emerald-500" /> Crear Producto
              </h3>
              <p className="text-sm text-slate-500 mb-6">Agrega nuevos productos al menú.</p>

              <form onSubmit={handleAddProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Producto</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Ej. Hamburguesa Clásica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    placeholder="Descripción detallada del producto"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Precio ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="12.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
                  <input
                    type="text"
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Ej. Hamburguesas, Pizzas, Bebidas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Ruta de Imagen</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, image: e.target.value });
                      setProductImageFile(null); // Clear file if user types a path
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="/images/products/tu-imagen.jpg"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Escribe la ruta de tu imagen (ej: /images/products/hamburguesa.jpg) o sube un archivo abajo
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200"></div>
                  <p className="relative text-center text-xs text-slate-500 bg-white inline-block px-2 mx-auto block w-fit">
                    o sube un archivo
                  </p>
                </div>

                <ImageUpload
                  onImageSelect={(file, preview) => {
                    setProductImageFile(file);
                    if (preview) {
                      setNewProduct({ ...newProduct, image: preview });
                    }
                  }}
                  currentImage={newProduct.image}
                />

                <button
                  type="submit"
                  disabled={isUploadingProduct}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg mt-4 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isUploadingProduct ? (
                    <>Subiendo...</>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Crear Producto
                    </>
                  )}
                </button>

                {productSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium text-center animate-fadeIn border border-emerald-100 flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> {productSuccessMsg}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Productos en el Menú</h3>
                <span className="bg-white px-2 py-1 rounded-md text-xs font-bold text-slate-500 border border-slate-200">
                  {products.length} productos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 max-h-[600px] overflow-y-auto">
                {products.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-slate-400">No hay productos en el menú.</div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative h-40">
                        <img
                          src={product.image?.startsWith('http') ? product.image : `http://localhost:3000${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-800">{product.name}</h4>
                          <span className="text-orange-600 font-black">${Number(product.price).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{product.description}</p>
                        <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;

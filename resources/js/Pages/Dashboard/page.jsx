import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

const STORAGE_KEY = 'aromaslice_products_v1';
const CART_STORAGE_KEY = 'aromaslice_cart_v1';
const ORDERS_STORAGE_KEY = 'aromaslice_orders_v1';

const INITIAL_PRODUCTS = [
  {
    id: 'pizza-1',
    name: 'Margherita Regina',
    price: 199,
    tag: 'Classic',
    crust: 'Neapolitan Thin',
    description: 'San Marzano tomato sauce, fior di latte mozzarella, fresh sweet basil, and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'pizza-2',
    name: 'Pepperoni Overload',
    price: 249,
    tag: 'Best Seller',
    crust: 'Sourdough Crisp',
    description: 'Crispy cupping pepperoni, aged whole milk mozzarella, hot chili honey drizzle, and oregano.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'pizza-3',
    name: 'Truffle Wild Mushroom',
    price: 279,
    tag: 'Best Seller',
    crust: 'Wood-Fired Crisp',
    description: 'Roasted cremini & shiitake mushrooms, white truffle cream sauce, fontina cheese, fresh thyme.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'pizza-4',
    name: 'Diavola Inferno',
    price: 259,
    tag: 'Spicy',
    crust: 'Neapolitan Thin',
    description: 'Calabrian chili paste, spicy ventricina salami, smoked provolone, and roasted chili oil.',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'pizza-5',
    name: 'Quattro Formaggi Bianca',
    price: 269,
    tag: 'Vegetarian',
    crust: 'Stuffed Garlic Crust',
    description: 'Mozzarella, gorgonzola dolce, whipped ricotta, parmigiano reggiano, and crushed walnuts.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 'pizza-6',
    name: 'Smokey BBQ Pollo',
    price: 279,
    tag: 'Chef Special',
    crust: 'Crispy Pan',
    description: 'Slow-smoked chicken breast, sweet hickory BBQ reduction, red onion slivers, and smoked gouda.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&auto=format&fit=crop',
  },
];

export default function Dashboard() {
  const { auth } = usePage().props;
  const user = auth?.user;

  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'account'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [toast, setToast] = useState('');

  // Products state (synced with localStorage)
  const [products, setProducts] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Cart state (synced with localStorage)
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Cart actions
  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    const p = products.find((item) => item.id === id);
    if (p) showToast(`Added "${p.name}" to cart`);
  };

  const decrementCart = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    showToast('Cart cleared');
  };

  // Checkout order
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString(),
      items: cartItems.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total: cartTotal,
      status: 'Baking in Oven 🔥',
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart({});
    showToast('🎉 Order placed successfully! View in My Orders tab.');
    setActiveTab('orders');
  };

  // Cart computed items
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const item = products.find((p) => p.id === id);
        if (!item) return null;
        return { ...item, qty };
      })
      .filter(Boolean);
  }, [cart, products]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag === 'All' || p.tag === selectedTag;
      return matchQuery && matchTag;
    });
  }, [products, searchQuery, selectedTag]);

  // Customer initials
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans flex">
      <Head title="Dashboard — AromaSlice" />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-orange-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
            <span>🍕</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SIDEBAR: CUSTOMER ACCOUNT & PRODUCT ADD TO CART DISPLAY       */}
      {/* ============================================================= */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-80 bg-neutral-950 border-r border-neutral-800 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">🍕</span>
            <span className="text-base font-black tracking-wider text-white">
              AROMA<span className="text-orange-500">SLICE</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* 1. CUSTOMER ACCOUNT DISPLAY IN SIDEBAR */}
        <div className="p-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-orange-600/20">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white truncate">
                  {user?.name || 'Customer Account'}
                </p>
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Customer" />
              </div>
              <p className="text-xs text-neutral-400 truncate">
                {user?.email || 'customer@aromaslice.com'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  Member
                </span>
                <button
                  onClick={() => setActiveTab('account')}
                  className="text-[10px] text-neutral-400 hover:text-white underline"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-3 border-b border-neutral-800 shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'products'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🍕</span>
              <span>Products &amp; Menu</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>📦</span>
              <span>My Orders</span>
            </div>
            {orders.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'account'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <span>👤</span>
            <span>Account Details</span>
          </button>
        </div>

        {/* 2. PRODUCT ADD TO CART DISPLAY IN SIDEBAR */}
        <div className="flex-1 flex flex-col min-h-0 p-4">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-sm">🛒</span>
              <span className="text-xs font-black uppercase tracking-wider text-neutral-300">
                Products in Cart
              </span>
            </div>
            <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
              {totalCartCount} item{totalCartCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Cart Products List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-10 px-2 text-neutral-500 space-y-2">
                <span className="text-3xl block">🍕</span>
                <p className="text-xs font-medium">Cart is currently empty.</p>
                <p className="text-[11px] text-neutral-600">
                  Click "Add to Cart" on any product to see it here!
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 group hover:border-neutral-700 transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-orange-400 font-semibold tabular-nums">
                      ₱{item.price.toFixed(2)} × {item.qty}
                    </p>
                  </div>

                  {/* Quantity Stepper inside sidebar */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => decrementCart(item.id)}
                      className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center"
                      title="Decrease"
                    >
                      −
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-6 h-6 rounded-md bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center"
                      title="Increase"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded-md bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white text-xs flex items-center justify-center ml-0.5"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary & Checkout in Sidebar */}
          {cartItems.length > 0 && (
            <div className="pt-3 border-t border-neutral-800 space-y-2 shrink-0">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Total Amount:</span>
                <span className="font-black text-orange-400 text-sm tabular-nums">
                  ₱{cartTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-black text-xs hover:brightness-110 transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5"
              >
                <span>Checkout (₱{cartTotal.toFixed(2)})</span>
              </button>
              <button
                onClick={clearCart}
                className="w-full py-1 text-center text-[10px] text-neutral-500 hover:text-red-400 transition"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer (Logout & Home Link) */}
        <div className="p-3 border-t border-neutral-800 shrink-0 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <span>←</span> Landing Page
          </Link>
          <Link
            href="/logout"
            method="post"
            as="button"
            className="text-neutral-400 hover:text-red-400 font-semibold transition"
          >
            Log Out
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============================================================= */}
      {/* MAIN CONTENT AREA                                             */}
      {/* ============================================================= */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-neutral-950/90 backdrop-blur border-b border-neutral-800 px-4 sm:px-8 h-16 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center text-sm"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div>
              <h1 className="text-base font-black text-white">
                {activeTab === 'products' && '🍕 Pizza Menu & Catalog'}
                {activeTab === 'orders' && '📦 My Orders'}
                {activeTab === 'account' && '👤 Customer Account'}
              </h1>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Welcome back, {user?.name || 'Valued Customer'}!
              </p>
            </div>
          </div>

          {/* Quick Header info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs">
              <span>🛒</span>
              <span className="font-bold text-orange-400">{totalCartCount}</span>
              <span className="text-neutral-400 hidden sm:inline">in cart</span>
            </div>
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-semibold text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-700 transition"
            >
              View Landing Page
            </Link>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-4 sm:p-8 flex-1">
          
          {/* TAB 1: PRODUCTS VIEW */}
          {activeTab === 'products' && (
            <div>
              {/* Search & Tag Filter Toolbar */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pizzas by name or toppings..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {['All', 'Classic', 'Best Seller', 'Spicy', 'Vegetarian', 'Chef Special'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTag(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                        selectedTag === t
                          ? 'bg-orange-500 text-neutral-950'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((pizza) => {
                  const qty = cart[pizza.id] || 0;
                  return (
                    <div
                      key={pizza.id}
                      className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition group"
                    >
                      <div>
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={pizza.image}
                            alt={pizza.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-black uppercase text-orange-400">
                            {pizza.tag}
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-white text-base group-hover:text-orange-400 transition">
                              {pizza.name}
                            </h3>
                            <span className="text-base font-black text-orange-400 tabular-nums shrink-0">
                              ₱{pizza.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                            {pizza.description}
                          </p>
                        </div>
                      </div>

                      {/* Add to Cart Actions (Syncs with Sidebar) */}
                      <div className="p-4 pt-0">
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(pizza.id)}
                            className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20"
                          >
                            <span>🛒</span>
                            <span>Add to Cart</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                            <button
                              onClick={() => decrementCart(pizza.id)}
                              className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs"
                            >
                              −
                            </button>
                            <span className="text-xs font-bold text-orange-400 tabular-nums">
                              {qty} in cart
                            </span>
                            <button
                              onClick={() => addToCart(pizza.id)}
                              className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="max-w-3xl">
              <h2 className="text-xl font-black text-white mb-4">Past &amp; Active Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-neutral-950 rounded-2xl border border-neutral-800 p-8 text-neutral-500">
                  <span className="text-4xl block mb-2">📦</span>
                  <p className="text-sm font-semibold">No orders yet.</p>
                  <p className="text-xs mt-1">Add pizzas to your cart from the menu and checkout!</p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition"
                  >
                    Go To Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                        <div>
                          <span className="text-xs font-mono font-bold text-orange-400">{order.id}</span>
                          <span className="text-xs text-neutral-500 ml-2">{order.createdAt}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
                          {order.status}
                        </span>
                      </div>

                      <div className="py-3 space-y-1.5 text-xs text-neutral-300">
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.qty}x {it.name}</span>
                            <span className="text-neutral-400">₱{(it.price * it.qty).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-sm font-black">
                        <span className="text-white">Order Total</span>
                        <span className="text-orange-400">₱{order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT PROFILE VIEW */}
          {activeTab === 'account' && (
            <div className="max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-600/20">
                  {initials}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{user?.name || 'Customer Account'}</h3>
                  <p className="text-xs text-neutral-400">{user?.email || 'customer@aromaslice.com'}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                </div>
              </div>

              <dl className="divide-y divide-neutral-800 text-xs space-y-3">
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-400">Full Name</dt>
                  <dd className="font-bold text-white">{user?.name || 'Guest User'}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-400">Email Address</dt>
                  <dd className="font-bold text-white">{user?.email || 'guest@example.com'}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-400">Default Delivery City</dt>
                  <dd className="font-bold text-white">Manila, Philippines</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-400">Member Since</dt>
                  <dd className="font-bold text-white">2026</dd>
                </div>
              </dl>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center">
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white border border-neutral-700 transition"
                >
                  Edit Profile Settings
                </Link>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="text-xs font-bold text-red-400 hover:underline"
                >
                  Log Out
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

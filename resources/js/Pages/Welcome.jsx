import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

const STORAGE_KEY = 'aromaslice_products_v1';
const CART_STORAGE_KEY = 'aromaslice_cart_v1';

const INITIAL_PRODUCTS = [
  {
    id: 'pizza-1',
    name: 'Margherita Regina',
    price: 199,
    tag: 'Classic',
    crust: 'Neapolitan Thin',
    description: 'San Marzano tomato sauce, fior di latte mozzarella, fresh sweet basil, and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=80&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: 'pizza-2',
    name: 'Pepperoni Overload',
    price: 249,
    tag: 'Best Seller',
    crust: 'Sourdough Crisp',
    description: 'Crispy cupping pepperoni, aged whole milk mozzarella, hot chili honey drizzle, and oregano.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: 'pizza-3',
    name: 'Truffle Wild Mushroom',
    price: 279,
    tag: 'Best Seller',
    crust: 'Wood-Fired Crisp',
    description: 'Roasted cremini & shiitake mushrooms, white truffle cream sauce, fontina cheese, fresh thyme.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fit=crop',
    rating: 5.0,
  },
  {
    id: 'pizza-4',
    name: 'Diavola Inferno',
    price: 259,
    tag: 'Spicy',
    crust: 'Neapolitan Thin',
    description: 'Calabrian chili paste, spicy ventricina salami, smoked provolone, and roasted chili oil.',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80&auto=format&fit=crop',
    rating: 4.7,
  },
  {
    id: 'pizza-5',
    name: 'Quattro Formaggi Bianca',
    price: 269,
    tag: 'Vegetarian',
    crust: 'Stuffed Garlic Crust',
    description: 'Mozzarella, gorgonzola dolce, whipped ricotta, parmigiano reggiano, and crushed walnuts.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: 'pizza-6',
    name: 'Smokey BBQ Pollo',
    price: 279,
    tag: 'Chef Special',
    crust: 'Crispy Pan',
    description: 'Slow-smoked chicken breast, sweet hickory BBQ reduction, red onion slivers, and smoked gouda.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&auto=format&fit=crop',
    rating: 4.6,
  },
];

const TAG_COLORS = {
  Classic: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  'Best Seller': 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  Spicy: 'bg-red-500/10 text-red-600 border-red-500/30',
  Vegetarian: 'bg-teal-500/10 text-teal-600 border-teal-500/30',
  'Chef Special': 'bg-purple-500/10 text-purple-600 border-purple-500/30',
};

export default function Welcome({ auth, canLogin, canRegister }) {
  // Products state (persisted in browser localStorage)
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

  // Cart state
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

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    tag: 'Classic',
    crust: 'Neapolitan Thin',
    description: '',
    image: '',
  });

  // Toast feedback
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Cart actions
  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    const item = products.find((p) => p.id === id);
    if (item) showToast(`Added "${item.name}" to cart`);
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

  const checkout = () => {
    setCart({});
    setCartDrawerOpen(false);
    showToast('🎉 Order placed successfully! Thank you for ordering.');
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.crust && p.crust.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag === 'All' || p.tag === selectedTag;
      return matchesQuery && matchesTag;
    });
  }, [products, searchQuery, selectedTag]);

  // Cart totals
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

  // Open modal to add product
  const openAddModal = () => {
    setModalMode('create');
    setEditingId(null);
    setProductForm({
      name: '',
      price: '',
      tag: 'Classic',
      crust: 'Neapolitan Thin',
      description: '',
      image: '',
    });
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const openEditModal = (p) => {
    setModalMode('edit');
    setEditingId(p.id);
    setProductForm({
      name: p.name,
      price: p.price.toString(),
      tag: p.tag || 'Classic',
      crust: p.crust || 'Neapolitan Thin',
      description: p.description || '',
      image: p.image || '',
    });
    setIsProductModalOpen(true);
  };

  // Save product from modal
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;
    const priceNum = parseFloat(productForm.price) || 199;
    const fallbackImage =
      productForm.image.trim() ||
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80&auto=format&fit=crop';

    if (modalMode === 'create') {
      const newProduct = {
        id: `pizza-${Date.now()}`,
        name: productForm.name.trim(),
        price: priceNum,
        tag: productForm.tag,
        crust: productForm.crust,
        description: productForm.description.trim(),
        image: fallbackImage,
        rating: 5.0,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`✨ Product "${newProduct.name}" added to menu!`);
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: productForm.name.trim(),
                price: priceNum,
                tag: productForm.tag,
                crust: productForm.crust,
                description: productForm.description.trim(),
                image: fallbackImage,
              }
            : p
        )
      );
      showToast(`✏️ Product "${productForm.name}" updated!`);
    }

    setIsProductModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    const item = products.find((p) => p.id === id);
    if (window.confirm(`Delete "${item?.name || 'this product'}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      removeFromCart(id);
      showToast('🗑️ Product deleted');
    }
  };

  // Reset default products
  const handleResetDefaults = () => {
    if (window.confirm('Reset all products back to default menu?')) {
      setProducts(INITIAL_PRODUCTS);
      showToast('🔄 Reset to default menu');
    }
  };

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans">
      <Head title="AromaSlice — Artisan Wood-Fired Pizza" />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-orange-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
            <span>🍕</span>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FULL-WIDTH TOP HEADER (NO SIDEBAR ON LANDING PAGE)            */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 group-hover:scale-105 transition">
              <span className="text-xl">🍕</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">
                AROMA<span className="text-orange-500">SLICE</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-neutral-400 font-semibold">
                Artisan Pizzeria
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Standard landing page navigation) */}
          <nav className="hidden md:flex items-center space-x-1 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('products-section')}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 transition"
            >
              Menu &amp; Products
            </button>
            <button
              onClick={() => scrollTo('features-section')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white transition"
            >
              Our Oven
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white transition"
            >
              How It Works
            </button>
          </nav>

          {/* Right Action: Cart Button, Add Product & Auth / Dashboard */}
          <div className="flex items-center gap-3">
            
            {/* Quick "+ Add Product" button on landing page */}
            <button
              onClick={openAddModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 transition"
            >
              <span>+</span>
              <span>Add Product</span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-600/30 transition hover:scale-105"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white text-neutral-900 text-[11px] font-black">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Account / Dashboard / Login Links */}
            {auth?.user ? (
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 transition flex items-center gap-2"
              >
                <span>👤</span>
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : canLogin ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-neutral-300 hover:text-white transition"
                >
                  Log in
                </Link>
                {canRegister && (
                  <Link
                    href="/register"
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 transition"
                  >
                    Register
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 transition"
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center text-sm"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-950 border-t border-neutral-800 px-4 py-4 space-y-2">
            <button
              onClick={() => scrollTo('products-section')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-orange-400 bg-orange-500/10"
            >
              🍕 Menu &amp; Products
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAddModal();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-200 hover:bg-neutral-900"
            >
              + Add New Product
            </button>
            <button
              onClick={() => scrollTo('features-section')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-200 hover:bg-neutral-900"
            >
              🔥 Our Wood-Fired Oven
            </button>
            <Link
              href="/dashboard"
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-200 hover:bg-neutral-900"
            >
              👤 Go to Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-900">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Fresh From The Wood-Fired Oven
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
                Handcrafted Pizza,{' '}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Baked To Perfection
                </span>
              </h1>

              <p className="text-neutral-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Explore our signature menu or add custom pizzas that display directly on this landing page.
                Add any slice to your cart and enjoy artisan flavor delivered hot to your doorstep.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => scrollTo('products-section')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-black hover:brightness-110 transition shadow-xl shadow-orange-500/25 flex items-center gap-2"
                >
                  <span>Explore Menu &amp; Products</span>
                  <span>↓</span>
                </button>
                <button
                  onClick={openAddModal}
                  className="px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold border border-neutral-700 transition flex items-center gap-2"
                >
                  <span>+ Add Product</span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs text-neutral-400">
                <div>
                  <span className="font-bold text-white text-sm">4.9 ★</span> (2,400+ reviews)
                </div>
                <div className="w-px h-4 bg-neutral-700" />
                <div>
                  <span className="font-bold text-white text-sm">{products.length} Products</span> on Menu
                </div>
              </div>
            </div>

            {/* Visual Pizza Banner */}
            <div className="relative flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 group">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80&auto=format&fit=crop"
                  alt="Wood Fired Pizza"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">
                    Signature Slice
                  </span>
                  <h3 className="text-xl font-black text-white">Artisan Neapolitan</h3>
                  <p className="text-xs text-neutral-300">San Marzano tomatoes &amp; 900°F volcanic stone bake</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PRODUCTS DISPLAY SECTION (PRODUCTS DISPLAYED ON LANDING PAGE) */}
      {/* ------------------------------------------------------------- */}
      <section id="products-section" className="py-20 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                Menu &amp; Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
                Our Fresh Artisan Pizzas
              </h2>
              <p className="text-sm text-neutral-400 mt-1 max-w-xl">
                Browse our current pizzas or add your own custom product. Newly added items display right here!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openAddModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-black text-xs hover:brightness-110 transition shadow-lg shadow-orange-500/20 flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Add Product</span>
              </button>
              <button
                onClick={handleResetDefaults}
                className="px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold transition"
                title="Reset to default pizza items"
              >
                Reset Defaults
              </button>
            </div>
          </div>

          {/* Search Bar & Tag Filter Pills */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pizzas by name, crust, or ingredients..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Classic', 'Best Seller', 'Spicy', 'Vegetarian', 'Chef Special'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    selectedTag === tag
                      ? 'bg-orange-500 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800 p-8">
              <span className="text-4xl">🍕</span>
              <h3 className="text-lg font-bold text-white mt-3">No products found</h3>
              <p className="text-sm text-neutral-400 mt-1">Try another search or add a new pizza product!</p>
              <button
                onClick={openAddModal}
                className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition"
              >
                + Add Product Now
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((pizza) => {
                const qty = cart[pizza.id] || 0;
                const tagStyle = TAG_COLORS[pizza.tag] || 'bg-neutral-800 text-neutral-300 border-neutral-700';

                return (
                  <div
                    key={pizza.id}
                    className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-950/20"
                  >
                    <div>
                      {/* Product Image & Badges */}
                      <div className="relative h-48 bg-neutral-950 overflow-hidden">
                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${tagStyle}`}>
                            {pizza.tag}
                          </span>
                        </div>
                        {pizza.crust && (
                          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-medium text-neutral-300">
                            🌾 {pizza.crust}
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg p-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEditModal(pizza)}
                            className="w-7 h-7 rounded bg-neutral-800 hover:bg-orange-600 text-neutral-300 hover:text-white flex items-center justify-center text-xs"
                            title="Edit Product"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(pizza.id)}
                            className="w-7 h-7 rounded bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white flex items-center justify-center text-xs"
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition">
                            {pizza.name}
                          </h3>
                          <span className="text-lg font-black text-orange-400 tabular-nums shrink-0">
                            ₱{pizza.price.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-4">
                          {pizza.description}
                        </p>
                      </div>
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="p-5 pt-0">
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(pizza.id)}
                          className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
                        >
                          <span>🛒</span>
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-xl p-1">
                          <button
                            onClick={() => decrementCart(pizza.id)}
                            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-black text-sm flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-orange-400 tabular-nums">
                            {qty} in cart
                          </span>
                          <button
                            onClick={() => addToCart(pizza.id)}
                            className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-black text-sm flex items-center justify-center"
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
          )}

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FEATURES SECTION (WOOD-FIRED OVEN, ARTISAN INGREDIENTS)       */}
      {/* ------------------------------------------------------------- */}
      <section id="features-section" className="py-20 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              The AromaSlice Secret
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Obsession In Every Single Slice
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              From volcanic stone baking to our 72-hour cold-fermented dough, here is why our pizza stands out.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🔥',
                title: '900°F Wood Oven',
                desc: 'Blistered leopard crust baked in 90 seconds on authentic Italian volcanic stone.',
              },
              {
                icon: '🍅',
                title: 'San Marzano Sauce',
                desc: 'Sun-drenched plum tomatoes grown in volcanic soil at the foot of Mount Vesuvius.',
              },
              {
                icon: '🧀',
                title: 'Fior di Latte',
                desc: 'Fresh whole milk mozzarella pulled daily for the ultimate melt and creamy stretch.',
              },
              {
                icon: '🚀',
                title: 'Hot & Fresh Delivery',
                desc: 'Insulated hot thermal delivery straight from our kitchen stone to your doorstep.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 hover:border-orange-500/40 transition"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* HOW IT WORKS SECTION                                          */}
      {/* ------------------------------------------------------------- */}
      <section id="how-it-works" className="py-20 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Simple Ordering
            </span>
            <h2 className="text-3xl font-black text-white mt-1">From Oven to Table</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick Or Add Your Pizza', desc: 'Browse our menu or use "+ Add Product" to create your custom pie.' },
              { step: '02', title: 'Add To Cart & Checkout', desc: 'Adjust quantities in your cart and place your order in seconds.' },
              { step: '03', title: 'Enjoy Wood-Fired Goodness', desc: 'Baked hot and delivered straight to your door with live tracking.' },
            ].map((s) => (
              <div key={s.step} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative">
                <span className="text-3xl font-black text-orange-500/30 block mb-2">{s.step}</span>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-neutral-950 border-t border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>🍕</span>
            <span className="text-neutral-300 font-bold">AromaSlice Artisan Pizzeria</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-orange-400 transition">Dashboard</Link>
            <button onClick={() => scrollTo('products-section')} className="hover:text-orange-400 transition">Menu</button>
            <button onClick={openAddModal} className="hover:text-orange-400 transition">+ Add Product</button>
          </div>
          <div>© {new Date().getFullYear()} AromaSlice. All rights reserved.</div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* SLIDE-OVER CART DRAWER                                        */}
      {/* ------------------------------------------------------------- */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-800 h-full flex flex-col p-6 animate-fade-in shadow-2xl">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <h3 className="text-lg font-black text-white">Your Cart</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                  {totalCartCount} items
                </span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-neutral-500 space-y-3">
                  <span className="text-4xl block">🍕</span>
                  <p className="text-sm font-medium">Your cart is empty.</p>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="text-xs text-orange-400 font-bold hover:underline"
                  >
                    Browse menu to add pizzas
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                      <span className="text-xs text-orange-400 font-semibold tabular-nums">
                        ₱{item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => decrementCart(item.id)}
                        className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
                      >
                        −
                      </button>
                      <span className="text-xs font-bold text-white w-5 text-center tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-7 h-7 rounded bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white text-xs ml-1"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-bold text-white tabular-nums">₱{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Delivery</span>
                  <span className="font-bold text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black pt-2 border-t border-neutral-800">
                  <span className="text-white">Total</span>
                  <span className="text-orange-400 tabular-nums">₱{cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={checkout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-black text-sm hover:brightness-110 transition shadow-lg shadow-orange-500/25"
                >
                  Checkout Now · ₱{cartTotal.toFixed(2)}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-center text-xs text-neutral-500 hover:text-red-400 transition"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD / EDIT PRODUCT MODAL (ADDS NEW PRODUCTS TO LANDING PAGE)  */}
      {/* ------------------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-lg font-black text-white">
                {modalMode === 'create' ? '🍕 Add New Product' : '✏️ Edit Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smoky Hawaiian Bacon"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Price (₱ PHP) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="249"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    Tag / Category
                  </label>
                  <select
                    value={productForm.tag}
                    onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Classic">Classic</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Chef Special">Chef Special</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Crust Type
                </label>
                <select
                  value={productForm.crust}
                  onChange={(e) => setProductForm({ ...productForm, crust: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Neapolitan Thin">Neapolitan Thin</option>
                  <option value="Sourdough Crisp">Sourdough Crisp</option>
                  <option value="Wood-Fired Crisp">Wood-Fired Crisp</option>
                  <option value="Stuffed Garlic Crust">Stuffed Garlic Crust</option>
                  <option value="Crispy Pan">Crispy Pan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                  Ingredients / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="San Marzano tomatoes, mozzarella, sweet pineapple, smoked bacon..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-neutral-950 font-black text-xs hover:brightness-110 transition shadow-lg shadow-orange-500/20"
                >
                  {modalMode === 'create' ? 'Add To Landing Page' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
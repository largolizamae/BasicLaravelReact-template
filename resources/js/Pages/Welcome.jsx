import React, { useState, useEffect, useRef } from 'react';

const FEATURES = [
  {
    icon: 'fa-fire',
    title: 'Wood-Fired Oven',
    desc: 'Baked at on volcanic stone for that perfect leopard-spotted crust.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: 'fa-pizza-slice',
    title: 'Artisan Ingredients',
    desc: 'San Marzano tomatoes, fior di latte, and 24-month aged prosciutto.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: 'fa-wand-magic-sparkles',
    title: 'Build Your Own',
    desc: 'Design your ultimate pie in our interactive 3D pizza lab.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: 'fa-motorcycle',
    title: 'Live Tracking',
    desc: 'Follow your order from our oven to your doorstep in real time.',
    color: 'from-sky-500 to-emerald-500',
  },
];

const PREVIEW_PIZZAS = [
  { name: 'Margherita Regina', emoji: '🍕', price: 14.99, tag: 'Classic' },
  { name: 'Pepperoni Overload', emoji: '🍕', price: 17.99, tag: 'Best Seller' },
  { name: 'Truffle Mushroom', emoji: '🍄', price: 18.99, tag: "Best Seller" },
  { name: 'Diavola Inferno', emoji: '🌶️', price: 16.99, tag: 'Add On' },
];

const STEPS = [
  {
    num: '01',
    title: 'Choose Your Pie',
    desc: 'Browse our signature menu or start from a blank canvas in the Pizza Lab.',
    icon: 'fa-utensils',
  },
  {
    num: '02',
    title: 'Customize Everything',
    desc: 'Pick your size, crust, sauce, cheese level, and stack up to 6 fresh toppings.',
    icon: 'fa-sliders',
  },
  {
    num: '03',
    title: 'Track It Live',
    desc: 'Watch your pizza move from dough prep to wood-fired oven to your door.',
    icon: 'fa-location-dot',
  },
];

const STATS = [
  { value: '', label: 'Oven Temperature' },
  { value: '', label: 'Average Bake Time' },
  { value: '', label: 'Customer Rating' },
  { value: '', label: 'Avg. Delivery' },
];

export default function Welcome({ onEnter, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const heroRef = useRef(null);

  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  
  const goTo = (view) => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(view);
    else if (onEnter) onEnter(view);
  };

  return (
    <div className="min-h-screen bg-[#0f1015] text-slate-100 overflow-x-hidden">
     
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #121316; }
        ::-webkit-scrollbar-thumb { background: #2a2d3d; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #ea580c; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes steamRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-40px) scale(1.6); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(234, 88, 12, 0.4); }
          50% { box-shadow: 0 0 28px rgba(234, 88, 12, 0.9); }
        }
        .animate-float { animation: floatY 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spinSlow 28s linear infinite; }
        .animate-steam { animation: steamRise 2.4s ease-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease-out both; }
        .animate-pulse-glow { animation: pulseGlow 2.4s ease-in-out infinite; }
      `}</style>

     
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#12141c]/90 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-black/40'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-pizza-slice text-2xl rotate-45" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                AROMA<span className="text-white">SLICE</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-slate-400 font-semibold">
                Artisan Pizzeria & Lab
              </span>
            </div>
          </button>

          
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-full border border-slate-800/80">
            <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-orange-400 bg-slate-800/80 shadow transition-all">
              <i className="fa-solid fa-house mr-2" /> Home
            </button>
            <button
              onClick={() => goTo('menu')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white transition-all"
            >
              <i className="fa-solid fa-utensils mr-2" /> Menu
            </button>
            <button
              onClick={() => goTo('builder')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white transition-all"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2 text-amber-400" /> Builder
            </button>
            <button
              onClick={() => goTo('tracker')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white transition-all"
            >
              <i className="fa-solid fa-clock-rotate-left mr-2 text-sky-400" /> Tracker
            </button>
          </nav>

          
          <div className="flex items-center gap-3">
            <button
              onClick={() => goTo('menu')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all transform hover:scale-105 shadow-lg shadow-orange-600/30"
            >
              <i className="fa-solid fa-bag-shopping" />
              <span>Order Now</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 bg-[#12141c]/95 backdrop-blur border-t border-slate-800 ${
            mobileMenuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {[
              { label: 'Menu', view: 'menu', icon: 'fa-utensils' },
              { label: 'Pizza Builder', view: 'builder', icon: 'fa-wand-magic-sparkles' },
              { label: 'Live Tracker', view: 'tracker', icon: 'fa-clock-rotate-left' },
            ].map((item) => (
              <button
                key={item.view}
                onClick={() => goTo(item.view)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold hover:border-orange-500/60 transition"
              >
                <i className={`fa-solid ${item.icon} text-orange-400`} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        
        <div
          ref={heroRef}
          className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-orange-600/20 blur-[120px] pointer-events-none transition-transform duration-300"
        />
        <div className="absolute -top-20 -left-40 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,88,12,0.10),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-7 animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Wood-Fired Perfection
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05]">
                Handcrafted Slices,{' '}
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Baked To Perfection
                </span>
              </h1>

              <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                From Naples-inspired classics to your own custom masterpiece — AromaSlice brings
                artisan pizza craft straight to your door, tracked live from oven to doorstep.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => goTo('menu')}
                  className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold hover:brightness-110 transition-all shadow-xl shadow-orange-500/25 flex items-center gap-3 transform hover:-translate-y-0.5"
                >
                  <i className="fa-solid fa-pizza-slice" />
                  Explore the Menu
                  <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => goTo('builder')}
                  className="px-7 py-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-slate-200 font-bold hover:border-orange-500/60 hover:text-white transition-all flex items-center gap-3"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-amber-400" />
                  Build Your Own
                </button>
              </div>

              
              <div className="flex items-center gap-6 pt-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-star text-amber-400" />
                  <span className="font-semibold text-slate-300">4.9</span>
                  <span>(2,400+ reviews)</span>
                </div>
                <div className="w-px h-5 bg-slate-700" />
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-truck-fast text-emerald-400" />
                  <span>Free delivery over $40</span>
                </div>
              </div>
            </div>

            
            <div className="relative flex items-center justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/20 animate-spin-slow" />
                <div className="absolute inset-6 rounded-full border border-slate-800" />

               
                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-orange-600/40 to-amber-500/20 blur-3xl" />

               
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-900/50 animate-float relative overflow-hidden">
                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber-400/40 to-transparent" />
                    <span className="text-[140px] sm:text-[180px] leading-none select-none drop-shadow-2xl">
                      🍕
                    </span>

                   
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="absolute top-8 w-3 h-8 rounded-full bg-white/40 blur-md animate-steam"
                        style={{ left: `${40 + i * 12}%`, animationDelay: `${i * 0.6}s` }}
                      />
                    ))}
                  </div>
                </div>

                
                <div className="absolute -left-4 top-10 bg-[#16181f]/95 backdrop-blur border border-slate-700 rounded-2xl px-4 py-2.5 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-fire text-orange-500" />
                    <div className="leading-tight">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">Oven</span>
                      <span className="block text-sm font-black text-white">900°F</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-16 bg-[#16181f]/95 backdrop-blur border border-slate-700 rounded-2xl px-4 py-2.5 shadow-xl animate-float" style={{ animationDelay: '1.2s' }}>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-stopwatch text-sky-400" />
                    <div className="leading-tight">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">Ready in</span>
                      <span className="block text-sm font-black text-white">12 min</span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-6 -top-2 bg-[#16181f]/95 backdrop-blur border border-slate-700 rounded-2xl px-4 py-2.5 shadow-xl animate-float" style={{ animationDelay: '0.9s' }}>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-leaf text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Fresh Daily</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-colors animate-fade-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <span className="block text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Why AromaSlice
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 leading-tight">
              Crafted with{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                obsession
              </span>
            </h2>
            <p className="text-slate-400 mt-4">
              Every detail matters — from the fermentation of our dough to the last sprinkle of basil.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="group relative bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-950/40 animate-fade-up"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-xl shadow-lg mb-5 group-hover:scale-110 transition-transform`}
                >
                  <i className={`fa-solid ${feature.icon}`} />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>

                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-transparent via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
           
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                How It Works
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 leading-tight">
                From oven to door in{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  three simple steps
                </span>
              </h2>
              <p className="text-slate-400 mt-4 max-w-lg">
                No fuss, no waiting. Just great pizza, delivered the way it should be.
              </p>

              <div className="mt-10 space-y-3">
                {STEPS.map((step, i) => (
                  <button
                    key={step.num}
                    onMouseEnter={() => setActiveStep(i)}
                    onClick={() => setActiveStep(i)}
                    className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 flex items-start gap-4 ${
                      activeStep === i
                        ? 'bg-orange-600/10 border-orange-500/60 shadow-lg shadow-orange-950/30'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${
                        activeStep === i
                          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-900/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <i className={`fa-solid ${step.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-black tracking-wider ${
                            activeStep === i ? 'text-orange-400' : 'text-slate-600'
                          }`}
                        >
                          {step.num}
                        </span>
                        <h3 className="text-base font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-orange-600/20 via-transparent to-amber-500/10 blur-2xl" />

                <div className="relative h-full rounded-[2rem] bg-[#16181f] border border-slate-800 p-8 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                 
                  <span className="absolute -top-6 -right-2 text-[180px] font-black text-slate-800/60 leading-none select-none">
                    {STEPS[activeStep].num}
                  </span>

                  
                  <div
                    key={activeStep}
                    className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-5xl shadow-2xl shadow-orange-900/50 animate-pulse-glow"
                  >
                    <i className={`fa-solid ${STEPS[activeStep].icon}`} />
                  </div>

                  <h3 className="relative text-2xl font-black text-white mt-8 text-center">
                    {STEPS[activeStep].title}
                  </h3>
                  <p className="relative text-slate-400 text-sm text-center mt-3 max-w-xs leading-relaxed">
                    {STEPS[activeStep].desc}
                  </p>

                 
                  <div className="relative flex items-center gap-2 mt-8">
                    {STEPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeStep === i ? 'w-8 bg-orange-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                        }`}
                        aria-label={`Go to step ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                Signature Slices
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 leading-tight">
                A taste of the{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  menu
                </span>
              </h2>
            </div>
            <button
              onClick={() => goTo('menu')}
              className="self-start sm:self-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold hover:border-orange-500/60 hover:text-white transition flex items-center gap-2"
            >
              View Full Menu
              <i className="fa-solid fa-arrow-right text-orange-400" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PREVIEW_PIZZAS.map((pizza, i) => (
              <div
                key={pizza.name}
                className="group bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-950/40 animate-fade-up"
                style={{ animationDelay: `${0.08 * i}s` }}
              >
                <div className="relative h-40 bg-gradient-to-br from-orange-900/30 to-slate-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.35),transparent_60%)]" />
                  <span className="text-6xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    {pizza.emoji}
                  </span>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-[10px] font-black uppercase tracking-wider">
                    {pizza.tag}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-black text-white leading-snug">{pizza.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-black text-orange-400">
                      ${pizza.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => goTo('menu')}
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white transition flex items-center justify-center"
                      aria-label={`Add ${pizza.name}`}
                    >
                      <i className="fa-solid fa-plus text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-orange-950/60 via-slate-900 to-slate-900 border border-slate-800 p-10 sm:p-16">
            
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-600/30 blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/20 blur-[100px]" />

            <div className="relative text-center max-w-3xl mx-auto space-y-6">
              <span className="inline-block text-5xl mb-2">🔥</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Ready to build your{' '}
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  perfect pie?
                </span>
              </h2>
              <p className="text-slate-300 text-lg">
                Head into the Pizza Lab and craft your custom masterpiece — from crust to toppings.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <button
                  onClick={() => goTo('builder')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold hover:brightness-110 transition-all shadow-xl shadow-orange-500/30 flex items-center gap-3 transform hover:-translate-y-0.5"
                >
                  <i className="fa-solid fa-wand-magic-sparkles" />
                  Open Pizza 
                </button>
                <button
                  onClick={() => goTo('menu')}
                  className="px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-slate-200 font-bold hover:border-orange-500/60 hover:text-white transition flex items-center gap-3"
                >
                  <i className="fa-solid fa-utensils" />
                  Browse Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="border-t border-slate-800 bg-[#0c0d12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white">
                <i className="fa-solid fa-pizza-slice rotate-45" />
              </div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                AROMA<span className="text-white">SLICE</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Wood-fired artisan pizza, crafted slice by slice. Order online, build your own
              masterpiece, and track it live from our oven to your door.
            </p>
            <div className="flex gap-3 pt-1">
              {['instagram', 'x-twitter', 'facebook-f'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/60 text-slate-400 hover:text-orange-400 transition flex items-center justify-center"
                  aria-label={icon}
                >
                  <i className={`fa-brands fa-${icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => goTo('menu')} className="hover:text-orange-400 transition">
                  Signature Menu
                </button>
              </li>
              <li>
                <button onClick={() => goTo('builder')} className="hover:text-orange-400 transition">
                  Pizza Builder
                </button>
              </li>
              <li>
                <button onClick={() => goTo('tracker')} className="hover:text-orange-400 transition">
                  Live Tracker
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
              Opening Hours
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Mon – Thu · 11:00 – </li>
              <li>Fri – Sat · 11:00 – </li>
              <li>Sunday · 12:00 – </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} AromaSlice Artisan Pizzeria &amp; Lab. Crafted with 🔥 and semolina flour.
        </div>
      </footer>
    </div>
  );
}
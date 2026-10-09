<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LA PIZZA</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif} h1,h2{font-family:'Syne',sans-serif}</style>
</head>
<body class="bg-[#f7f5f2] text-zinc-900">

<nav class="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200 px-6 md:px-10 py-4 flex justify-between items-center">
  <div class="font-black text-xl tracking-tighter">LA PIZZA <span class="bg-black text-white px-2 py-0.5 rounded-full text-xs ml-1">US</span></div>
  <button onclick="openCart()" class="relative bg-black text-white px-6 py-3 rounded-full font-bold text-sm">CART • <span id="nav-total">$0.00</span> <span id="nav-count" class="ml-2 bg-white text-black w-5 h-5 inline-flex items-center justify-center rounded-full text-xs">0</span></button>
</nav>

<div class="pt-28 px-6 md:px-10 max-w-[1400px] mx-auto">
  <div class="flex flex-col md:flex-row justify-between items-start gap-6">
    <h1 class="text-[11vw] md:text-[8vw] leading-[0.85] font-[800] tracking-tighter">CLICK<br>TO ORDER<span class="text-zinc-300">.</span></h1>
    <div class="md:w-[320px] pt-4">
      <p class="text-sm text-zinc-500">Just click to order. All prices in USD ($). Easy to order.</p>
      <div class="mt-4 flex gap-2 text-[11px] font-bold tracking-widest">
      </div>
    </div>
  </div>

  <div id="grid" class="grid md:grid-cols-3 gap-6 mt-12"></div>
</div>

<div id="modal" class="fixed inset-0 z-[60] hidden">
  <div class="absolute inset-0 bg-black/40 backdrop-blur-md" onclick="closeModal()"></div>
  <div class="absolute bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[520px] bg-white rounded-t-[32px] md:rounded-[32px] p-8 shadow-2xl">
    <div class="flex justify-between">
      <div><h2 id="m-name" class="text-3xl font-black tracking-tighter"></h2><p id="m-desc" class="text-sm text-zinc-500 mt-1"></p></div>
      <button onclick="closeModal()" class="w-9 h-9 bg-zinc-100 rounded-full">✕</button>
    </div>
    <div class="mt-8">
      <p class="text-xs font-bold tracking-widest">SIZE</p>
      <div id="m-sizes" class="grid grid-cols-3 gap-2 mt-3"></div>
    </div>
    <div class="mt-6">
      <p class="text-xs font-bold tracking-widest">EXTRA TOPPINGS • CLICK TO ADD</p>
      <div id="m-toppings" class="flex flex-wrap gap-2 mt-3"></div>
    </div>
    <button id="m-add" class="w-full mt-8 bg-black text-white py-4 rounded-full font-bold text-sm tracking-wide"></button>
    <p class="text-[11px] text-center text-zinc-400 mt-3">Click to add • You can checkout instantly</p>
  </div>
</div>

<div id="cart" class="fixed inset-0 z-[70] hidden">
  <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" onclick="openCart()"></div>
  <div class="absolute right-0 top-0 h-full w-full md:w-[420px] bg-white p-7 flex flex-col">
    <div class="flex justify-between items-center"><h2 class="text-3xl font-black tracking-tighter">CART</h2><button onclick="openCart()" class="w-9 h-9 bg-zinc-100 rounded-full">✕</button></div>
    <div id="cart-items" class="flex-1 mt-8 space-y-3 overflow-y-auto"></div>
    <div class="border-t border-zinc-100 pt-6">
      <div class="flex justify-between text-sm"><span class="text-zinc-500">Subtotal</span><span id="c-sub" class="font-bold">$0.00</span></div>
      <div class="flex justify-between text-sm mt-2"><span class="text-zinc-500">Delivery</span><span id="c-del" class="font-bold">$0.00</span></div>
      <div class="flex justify-between text-xl font-black mt-4"><span>Total USD</span><span id="c-total">$0.00</span></div>
      <button onclick="placeOrder()" class="w-full mt-6 bg-black text-white py-4 rounded-full font-black">ORDER NOW • CLICK TO PAY</button>
      <p class="text-[10px] text-center text-zinc-400 mt-3">Secure • $ USD • 20 min delivery • Online Pay & Card</p>
    </div>
  </div>
</div>

<script>
const pizzas = [
  {id:1, name:"Pizza", price:10.99, emoji:"🍕", desc:"Classic, Premium, Best Seller"},
  {id:2, name:"Dessert", price:18.50, emoji:"🍮", desc:"Brownies, Cinnamon, Ice Cream"},
  {id:3, name:"Meat", price:16.99, emoji:"🥩", desc:"Grilled chicken, BBQ, Beef"},
  {id:4, name:"Drinks", price:12.99, emoji:"🧋", desc:"Lemon Ice Tea, Orange Juice, Mango Shake"},
  {id:5, name:"Veggies", price:13.99, emoji:"🥦", desc:"Mushroom, Onions, Capsicum"},
];
const sizes = [{n:"Small\"", add:0}, {n:"Medium\"", add:3}, {n:"Large\"", add:6}];
const toppings = [{n:"Extra Cheese", add:3}, {n:"Onions", add:1.25}, {n:"Pineapple", add:2}, {n:"Ham", add:.5}, {n:"Bacon", add:2.5}];

let cur = null, curSize = sizes[1], curTops = [], cart = [];

const $ = s => document.getElementById(s);
const money = n => n.toLocaleString('en-US', {style:'currency', currency:'USD'});

// Render grid
const grid = $('grid');
pizzas.forEach(p=>{
  grid.innerHTML += `
  <div onclick="openModal(${p.id})" class="group bg-white rounded-[28px] p-6 border border-zinc-100 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all cursor-pointer">
    <div class="flex justify-between items-start"><div class="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition">${p.emoji}</div><span class="text-[10px] font-bold tracking-widest bg-zinc-900 text-white px-2.5 py-1 rounded-full">CLICK TO ORDER</span></div>
    <h3 class="text-2xl font-bold tracking-tighter mt-5">${p.name}</h3>
    <p class="text-sm text-zinc-500 mt-1">${p.desc}</p>
    <div class="flex justify-between items-end mt-6"><p class="text-2xl font-black">${money(p.price)}</p><div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition">↗</div></div>
  </div>`;
});

function openModal(id){
  cur = pizzas.find(x=>x.id===id); curSize = sizes[1]; curTops=[];
  $('m-name').innerText = cur.name; $('m-desc').innerText = cur.desc;
  renderModal(); $('modal').classList.remove('hidden');
}
function closeModal(){ $('modal').classList.add('hidden'); }

function renderModal(){
  $('m-sizes').innerHTML = sizes.map(s=>`<button onclick="setSize('${s.n}')" class="py-3 rounded-full border text-xs font-bold ${curSize.n===s.n?'bg-black text-white border-black':'bg-white border-zinc-200'}">${s.n} ${s.add? '+'+money(s.add):''}</button>`).join('');
  $('m-toppings').innerHTML = toppings.map(t=>{
    const on = curTops.find(x=>x.n===t.n);
    return `<button onclick="toggleTop('${t.n}')" class="px-4 py-2 rounded-full text-xs border font-semibold ${on?'bg-black text-white border-black':'bg-white border-zinc-200'}">${t.n} +${money(t.add)}</button>`;
  }).join('');
  const total = cur.price + curSize.add + curTops.reduce((s,x)=>s+x.add,0);
  $('m-add').innerText = `ADD TO CART • ${money(total)} →`;
  $('m-add').onclick = ()=>{
    cart.push({...cur, size:curSize.n, tops:curTops.map(x=>x.n), total, cid:Date.now()});
    closeModal(); updateCart(); openCart();
  };
}
function setSize(n){ curSize = sizes.find(s=>s.n===n); renderModal(); }
function toggleTop(n){
  const t = toppings.find(x=>x.n===n);
  curTops.find(x=>x.n===n)? curTops = curTops.filter(x=>x.n!==n) : curTops.push(t);
  renderModal();
}

function updateCart(){
  const sub = cart.reduce((s,i)=>s+i.total,0);
  const del = sub>35? 0 : 0.00;
  const tot = sub + del;
  $('nav-total').innerText = money(tot); $('nav-count').innerText = cart.length;
  $('c-sub').innerText = money(sub); $('c-del').innerText = del===0? 'FREE' : money(del); $('c-total').innerText = money(tot);
  $('cart-items').innerHTML = cart.length===0? '<p class="text-zinc-400 text-sm mt-20 text-center">Cart empty. Click something order 🍕</p>' : cart.map(i=>`
    <div class="flex justify-between bg-zinc-50 rounded-2xl p-4"><div><p class="font-bold text-sm">${i.name}</p><p class="text-xs text-zinc-500">${i.size} • ${i.tops.join(', ')||'Standard'}</p></div><div class="text-right"><p class="font-bold text-sm">${money(i.total)}</p><button onclick="removeCart(${i.cid})" class="text-xs text-red-500">Remove</button></div></div>
  `).join('');
}
function removeCart(id){ cart = cart.filter(c=>c.cid!==id); updateCart(); }
function openCart(){ $('cart').classList.toggle('hidden'); updateCart(); }
function placeOrder(){
  if(!cart.length) return alert('Add pizza first!');
  alert(`✅ ORDER PLACED!\nTotal: ${$('c-total').innerText}\nPayment: $ USD\n\nYour pizza is being made! 20 mins delivery.`);
  cart=[]; updateCart(); openCart();
}
updateCart();
</script>
</body>
</html>
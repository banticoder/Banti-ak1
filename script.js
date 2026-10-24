const products = [
  {id:1,name:"Nothing Banti Oversized Tee",category:"T-shirts",price:799,tag:"Bestseller",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",alt:"Minimal white oversized t-shirt",colors:["#e9e6dc","#171713","#aeb9ff"],sizes:["S","M","L","XL"]},
  {id:2,name:"After Hours Hoodie",category:"Hoodies",price:1499,tag:"New drop",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",alt:"Relaxed hoodie in neutral colour",colors:["#c8c2b6","#171713","#687b61"],sizes:["S","M","L","XL"]},
  {id:3,name:"Utility Cargo Pants",category:"Cargo pants",price:1299,tag:"Everyday",image:"https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=900&q=85",alt:"Casual utility trousers",colors:["#73745e","#292923","#b4a48b"],sizes:["S","M","L","XL"]},
  {id:4,name:"Studio Graphic Tee",category:"T-shirts",price:899,tag:"Limited",image:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85",alt:"Contemporary graphic t-shirt",colors:["#f2efe5","#df7955","#171713"],sizes:["S","M","L","XL"]},
  {id:5,name:"Core Zip Hoodie",category:"Hoodies",price:1699,tag:"Core piece",image:"https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=85",alt:"Dark zip hoodie",colors:["#242421","#c9c8be","#5c6da8"],sizes:["S","M","L","XL"]},
  {id:6,name:"Everyday Overshirt",category:"Overshirts",price:1199,tag:"Easy layer",image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",alt:"Smart casual overshirt",colors:["#c4b9a7","#4c5d49","#171713"],sizes:["S","M","L","XL"]}
];
const grid=document.getElementById("productGrid");
const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
let activeFilter="all", bag=JSON.parse(sessionStorage.getItem("nbBag")||"[]");
function renderProducts(){
 let list=products.filter(p=>activeFilter==="all"||p.category===activeFilter);
 const sort=document.getElementById("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map((p,i)=>`<article class="product-card" style="--i:${i}"><div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.alt}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="quick-add" data-add="${p.id}">ADD TO BAG <span>＋</span></button></div><div class="product-meta"><div><h3 class="product-name">${p.name}</h3><span class="product-category">${p.category}</span></div><span class="product-price">${money(p.price)}</span></div><div class="product-bottom"><div class="swatches" aria-label="Available colour options">${p.colors.map(c=>`<span class="swatch" style="background:${c}"></span>`).join("")}</div><span class="size-note">S / M / L / XL</span></div></article>`).join("");
 grid.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addToBag(Number(b.dataset.add))));
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelector(".filter.active")?.classList.remove("active");btn.classList.add("active");activeFilter=btn.dataset.filter;renderProducts()}));
document.getElementById("sortSelect").addEventListener("change",renderProducts);
function persist(){sessionStorage.setItem("nbBag",JSON.stringify(bag));renderBag()}
function addToBag(id){const existing=bag.find(x=>x.id===id);existing?existing.qty++:bag.push({id,qty:1,size:"M"});persist();showToast("Added to your bag — nice choice.");}
function changeQty(id,delta){const item=bag.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<1)bag=bag.filter(x=>x.id!==id);persist()}
function renderBag(){
 const count=bag.reduce((s,x)=>s+x.qty,0);document.getElementById("bagCount").textContent=count;document.getElementById("drawerCount").textContent=`(${count})`;
 document.getElementById("bagSubtotal").textContent=money(bag.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
 const items=document.getElementById("bagItems");
 items.innerHTML=bag.length?bag.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="bag-item"><img src="${p.image}" alt="${p.alt}"><div><h3>${p.name}</h3><p>${p.category} · Size ${x.size}</p><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><span class="bag-item-price">${money(p.price*x.qty)}</span></div>`}).join(""):`<p class="empty-bag">Your bag is taking a breather.<br>Let's find something good.</p>`;
 items.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>changeQty(Number(b.dataset.qty),Number(b.dataset.delta))));
}
const drawer=document.getElementById("bagDrawer"),overlay=document.getElementById("bagOverlay");
function openBag(){drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");overlay.hidden=false;document.body.classList.add("locked")}
function closeBag(){drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");overlay.hidden=true;document.body.classList.remove("locked")}
document.getElementById("openBag").addEventListener("click",openBag);document.getElementById("closeBag").addEventListener("click",closeBag);overlay.addEventListener("click",closeBag);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBag()});
document.getElementById("checkoutButton").addEventListener("click",()=>{document.getElementById("checkoutMessage").textContent=bag.length?"Demo checkout only: connect a secure payment provider and order backend before accepting real orders.":"Your bag is empty — find your first favourite."});
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(window.nbToastTimer);window.nbToastTimer=setTimeout(()=>t.classList.remove("show"),2300)}
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterMessage").textContent="Thanks for your interest! Newsletter signup is a demo and isn't storing your email.";e.target.reset()});
document.querySelector(".search-toggle").addEventListener("click",()=>{const q=prompt("Search the NOTHING BANTI collection");if(q){activeFilter="all";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));renderProducts();const match=products.find(p=>(p.name+" "+p.category).toLowerCase().includes(q.toLowerCase()));if(match){grid.querySelector(`[data-add="${match.id}"]`)?.scrollIntoView({behavior:"smooth",block:"center"});showToast(`Found: ${match.name}`)}else showToast("No exact match — try tee, hoodie or cargo.")}});
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.querySelector(".desktop-nav");const open=nav.style.display==="flex";nav.style.cssText=open?"":"display:flex;position:absolute;top:68px;left:0;right:0;background:var(--paper);padding:22px 6%;border-bottom:1px solid var(--line);flex-direction:column;gap:20px";});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
renderProducts();renderBag();

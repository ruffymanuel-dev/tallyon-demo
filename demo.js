const products=[
  {id:1,name:"Espresso",category:"Coffee",price:3.50},
  {id:2,name:"Americano",category:"Coffee",price:4.00},
  {id:3,name:"Vanilla Latte",category:"Coffee",price:5.00},
  {id:4,name:"Cappuccino",category:"Coffee",price:4.75},
  {id:5,name:"Iced Mocha",category:"Coffee",price:5.50},
  {id:6,name:"Cold Brew",category:"Coffee",price:5.25},
  {id:7,name:"Chai Latte",category:"Tea",price:4.50},
  {id:8,name:"Matcha Latte",category:"Tea",price:5.75},
  {id:9,name:"Earl Grey",category:"Tea",price:3.75},
  {id:10,name:"Butter Croissant",category:"Pastries",price:4.00},
  {id:11,name:"Blueberry Muffin",category:"Pastries",price:4.25},
  {id:12,name:"Banana Bread",category:"Pastries",price:4.50}
];
let category="All",cart=[],demoRole="staff";
const money=n=>"$"+n.toFixed(2);
const grid=document.getElementById("grid");

function renderProducts(){
  const query=document.getElementById("search").value.trim().toLowerCase();
  const list=products.filter(p=>(category==="All"||p.category===category)&&(!query||p.name.toLowerCase().includes(query)));
  grid.innerHTML=list.map(p=>`<button class="tile" data-product="${p.id}"><b>${p.name}</b><span>${money(p.price)}</span></button>`).join("")||'<p class="muted">No products found.</p>';
}

document.getElementById("categories").innerHTML=["All","Coffee","Tea","Pastries"].map(c=>`<button class="chip ${c==="All"?"active":""}" data-category="${c}">${c}</button>`).join("");
document.getElementById("search").oninput=renderProducts;
document.getElementById("categories").onclick=e=>{
  const button=e.target.closest("[data-category]");if(!button)return;category=button.dataset.category;
  document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===button));renderProducts();
};
grid.onclick=e=>{
  const button=e.target.closest("[data-product]");if(!button)return;
  const product=products.find(p=>p.id===Number(button.dataset.product));
  const row=cart.find(p=>p.id===product.id);row?row.qty++:cart.push({...product,qty:1});renderCart();
};
function renderCart(){
  document.getElementById("cartRows").innerHTML=cart.map((p,i)=>`<div class="cart-row"><div><b>${p.name}</b><br><small class="muted">${money(p.price)}</small></div><div class="qty"><button data-minus="${i}" aria-label="Decrease ${p.name}">-</button><b>${p.qty}</b><button data-plus="${i}" aria-label="Increase ${p.name}">+</button></div><b>${money(p.price*p.qty)}</b></div>`).join("")||'<p class="muted">Cart is empty.</p>';
  const subtotal=cart.reduce((sum,p)=>sum+p.price*p.qty,0),tax=subtotal*.08;
  document.getElementById("itemCount").textContent=cart.reduce((sum,p)=>sum+p.qty,0)+" items";
  document.getElementById("subtotal").textContent=money(subtotal);document.getElementById("tax").textContent=money(tax);document.getElementById("total").textContent=money(subtotal+tax);
}
document.querySelector(".cart").onclick=e=>{
  const minus=e.target.closest("[data-minus]"),plus=e.target.closest("[data-plus]");
  if(minus){const i=Number(minus.dataset.minus);cart[i].qty--;if(cart[i].qty<=0)cart.splice(i,1);renderCart()}
  if(plus){cart[Number(plus.dataset.plus)].qty++;renderCart()}
};
document.getElementById("clear").onclick=()=>{cart=[];renderCart()};
document.getElementById("charge").onclick=()=>{
  if(!cart.length)return;
  const total=document.getElementById("total").textContent;cart=[];renderCart();
  const button=document.getElementById("charge");button.textContent="Sale complete · "+total;setTimeout(()=>button.textContent="Charge sale",1800);
};

const roleSwitch=document.getElementById("roleSwitch");
roleSwitch.onclick=()=>{
  demoRole=demoRole==="staff"?"admin":"staff";
  const admin=demoRole==="admin";
  document.body.classList.toggle("demo-admin",admin);
  document.getElementById("roleIdentity").textContent=admin?"Demo admin · Jordan":"Demo staff · Alex";
  roleSwitch.textContent=admin?"Switch to cashier":"Switch to admin";
  document.querySelectorAll("nav button").forEach(button=>{
    if(!admin&&!["pos","inventory"].includes(button.dataset.view)){button.disabled=true;button.style.opacity=".45"}
    else{button.disabled=false;button.style.opacity=""}
  });
  if(!admin)document.querySelector('nav button[data-view="pos"]').click();
};

document.querySelector("nav").onclick=e=>{
  const button=e.target.closest("[data-view]");if(!button)return;
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b===button));
  document.querySelectorAll("main > section").forEach(s=>s.classList.remove("active"));
  document.getElementById(button.dataset.view).classList.add("active");
  document.getElementById("title").textContent={overview:"Overview",pos:"Point of sale",inventory:"Inventory",sales:"Sales",stock:"Stock in/out",catalog:"Catalog",settings:"Settings"}[button.dataset.view];
};

document.querySelectorAll("nav button").forEach(button=>{
  if(!["pos","inventory"].includes(button.dataset.view)){button.disabled=true;button.style.opacity=".45"}
});
document.getElementById("demoStockSave").onclick=()=>{
  const button=document.getElementById("demoStockSave");button.textContent="Movement saved";setTimeout(()=>button.textContent="Save movement",1600);
};
document.getElementById("demoSettingsSave").onclick=()=>{
  const button=document.getElementById("demoSettingsSave");button.textContent="Settings saved";setTimeout(()=>button.textContent="Save settings",1600);
};
renderProducts();renderCart();

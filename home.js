/* =========================
   SUPABASE CONFIG
========================= */

const SUPABASE_URL =
"https://xjiwwapiqszpnoqaripq.supabase.co";

const SUPABASE_KEY =
"sb_publishable_TJQTU1yv270qrVAEW6Ygwg_HxRtmCTe";

const client =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts(){

const container =
document.getElementById(
"productsContainer"
);

container.innerHTML =
"<h2 style='padding:20px'>Loading...</h2>";

const { data,error } =
await client
.from("products")
.select("*")
.order(
"created_at",
{
ascending:false
}
);

if(error){

container.innerHTML =
"<h2 style='padding:20px;color:red'>Products Load Failed</h2>";

return;

}

const userId =
localStorage.getItem("userId");

let wishIds = [];

if(userId){

const {data:wishlistData} =
await client
.from("wishlist")
.select("product_id")
.eq("user_id",userId);

wishIds =
(wishlistData || [])
.map(item =>
String(item.product_id)
);

}

container.innerHTML = "";

data.forEach(product=>{

const isWishlisted =
wishIds.includes(
String(product.id)
);

container.innerHTML += `

<div class="card"
onclick="openProduct('${product.id}')">

<div class="img-wrap">

<div class="wishlist"
data-product-id="${product.id}">
${isWishlisted ? "❤️" : "♡"}
</div>

<img src="${product.thumbnail || ''}">

<div class="rating">
⭐ ${product.rating || 4.5}
</div>

</div>

<div class="info">

<div class="brand">
${product.name || ''}
</div>

<div class="title">
${product.description || ''}
</div>

<div class="price-row">

<span class="discount">
↓${product.discount || 0}%
</span>

<span class="old">
₹${product.old_price || 0}
</span>

</div>

<div class="new">
₹${product.price || 0}
</div>

<div class="offer">
WOW! Great Deal
</div>

<div class="delivery">
🚚 Fast Delivery
</div>

</div>

</div>

`;

});

activateWishlist();

}

/* =========================
   PRODUCT PAGE
========================= */

function openProduct(id){

window.location.href =
`project.html?id=${id}`;

}

/* =========================
   WISHLIST
========================= */

function activateWishlist(){

const userId =
localStorage.getItem("userId");

document
.querySelectorAll(".wishlist")
.forEach(btn=>{

btn.addEventListener(
"click",
async(e)=>{

e.stopPropagation();

if(!userId){
return;
}

const productId =
btn.dataset.productId;

const {data} =
await client
.from("wishlist")
.select("id")
.eq("user_id",userId)
.eq("product_id",productId);

if(data && data.length){

await client
.from("wishlist")
.delete()
.eq("user_id",userId)
.eq("product_id",productId);

btn.innerHTML = "♡";

}else{

await client
.from("wishlist")
.insert([{
user_id:userId,
product_id:productId
}]);

btn.innerHTML = "❤️";

}

});

});

}

/* =========================
   SEARCH
========================= */

const searchBox =
document.querySelector(
".search"
);

searchBox.addEventListener(
"input",
function(){

const value =
this.value.toLowerCase();

const cards =
document.querySelectorAll(
".card"
);

cards.forEach(card=>{

const text =
card.innerText.toLowerCase();

card.style.display =
text.includes(value)
? "block"
: "none";

});

});

/* =========================
   START
========================= */

loadProducts();

console.log(
"99Shops Home Loaded"
);
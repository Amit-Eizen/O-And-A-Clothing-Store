import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productsModel";

dotenv.config({ path: ".env.dev" });

const IMG = "/public/images/products";

const products = [
  // ==================== ACCESSORIES ====================

  {
    name: "Slim Rectangular Sunglasses",
    type: "Sunglasses",
    description:
      "Black slim rectangular sunglasses with a modern, sleek frame. Perfect for a bold, fashion-forward look.",
    price: 89.99,
    salePrice: 69.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Black"],
    images: [`${IMG}/Accessories/sunglasses-black-slim-rectangular.jpg`, `${IMG}/Accessories/sunglasses-black-slim-rectangular.jpg`, `${IMG}/Accessories/sunglasses-round-gold-green.jpg`],
    stock: 30,
    tags: ["sunglasses", "eyewear", "black", "slim", "rectangular"],
    features: [
      "UV400 protection",
      "Slim rectangular frame",
      "Lightweight design",
    ],
  },
  {
    name: "Cashmere Wool Scarf",
    type: "Scarves",
    description:
      "Soft grey cashmere wool scarf, perfect for layering in colder weather. Lightweight yet warm.",
    price: 129.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Grey"],
    images: [`${IMG}/Accessories/scarf-grey-cashmere.jpg`, `${IMG}/Accessories/scarf-grey-cashmere.jpg`, `${IMG}/Accessories/scarf-checkered-brown.jpg`],
    stock: 20,
    tags: ["scarf", "cashmere", "grey", "winter", "wool"],
    features: ["100% cashmere wool", "Lightweight and warm", "Frayed edges"],
  },
  {
    name: "Nylon Crescent Shoulder Bag",
    type: "Bags",
    description:
      "Large crescent-shaped shoulder bag in black nylon with an adjustable strap and drawstring closure.",
    price: 74.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Black"],
    images: [`${IMG}/Accessories/bag-crescent-black-nylon.jpg`, `${IMG}/Accessories/bag-crescent-black-nylon.jpg`, `${IMG}/Accessories/bag-prada-black-chain.jpg`],
    stock: 15,
    tags: ["bag", "shoulder bag", "black", "nylon", "casual"],
    features: [
      "Recycled nylon material",
      "Adjustable shoulder strap",
      "Drawstring closure",
    ],
  },
  {
    name: "Rose Gold Bangle Bracelet",
    type: "Jewelry",
    description:
      "Elegant rose gold bangle bracelet with a clasp closure. A timeless accessory for any occasion.",
    price: 199.99,
    salePrice: 159.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Rose Gold"],
    images: [`${IMG}/Accessories/bracelet-rose-gold-bangle.jpg`, `${IMG}/Accessories/bracelet-rose-gold-bangle.jpg`, `${IMG}/Accessories/necklace-pearl-white-box.jpg`],
    stock: 12,
    tags: ["bracelet", "bangle", "rose gold", "jewelry", "elegant"],
    features: [
      "Rose gold plated",
      "Clasp closure",
      "Slim minimalist design",
    ],
  },
  {
    name: "Round Metal Frame Sunglasses",
    type: "Sunglasses",
    description:
      "Classic round sunglasses with a gold metal frame and dark green lenses. Vintage-inspired style.",
    price: 69.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Gold", "Green"],
    images: [`${IMG}/Accessories/sunglasses-round-gold-green.jpg`, `${IMG}/Accessories/sunglasses-round-gold-green.jpg`, `${IMG}/Accessories/sunglasses-sport-mirror-orange.jpg`],
    stock: 25,
    tags: ["sunglasses", "round", "gold", "vintage", "retro"],
    features: [
      "UV400 protection",
      "Gold metal frame",
      "Dark green tinted lenses",
    ],
  },
  {
    name: "Pearl Necklace with Silver Clasp",
    type: "Jewelry",
    description:
      "Classic white pearl necklace with a decorative silver clasp. Comes in an elegant gift box.",
    price: 249.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["White", "Silver"],
    images: [`${IMG}/Accessories/necklace-pearl-white-box.jpg`, `${IMG}/Accessories/necklace-pearl-white-box.jpg`, `${IMG}/Accessories/bracelet-silver-bead-stretch.jpg`],
    stock: 8,
    tags: ["necklace", "pearl", "white", "silver", "elegant", "gift"],
    features: [
      "Genuine freshwater pearls",
      "Decorative silver clasp",
      "Gift box included",
    ],
  },
  {
    name: "Checkered Wool Scarf",
    type: "Scarves",
    description:
      "Stylish checkered scarf in brown and grey tones. A perfect accessory for layering with coats and jackets.",
    price: 59.99,
    salePrice: 44.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Brown", "Grey"],
    images: [`${IMG}/Accessories/scarf-checkered-brown.jpg`, `${IMG}/Accessories/scarf-checkered-brown.jpg`, `${IMG}/Accessories/scarf-grey-cashmere.jpg`],
    stock: 22,
    tags: ["scarf", "checkered", "brown", "wool", "winter"],
    features: ["Wool blend", "Checkered pattern", "Generous size for wrapping"],
  },
  {
    name: "Monk Strap Leather Shoes",
    type: "Shoes",
    description:
      "Classic brown leather double monk strap shoes with silver buckles. Ideal for formal and smart-casual wear.",
    price: 179.99,
    category: "accessories",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Brown"],
    images: [`${IMG}/Accessories/shoes-monk-strap-brown.jpg`, `${IMG}/Accessories/shoes-monk-strap-brown.jpg`, `${IMG}/Accessories/shoes-loafer-brown-croc-tassel.jpg`],
    stock: 10,
    tags: ["shoes", "monk strap", "brown", "leather", "formal"],
    features: [
      "Genuine leather",
      "Double monk strap with buckles",
      "Leather sole",
    ],
  },
  {
    name: "Light Blue Clasp Handbag",
    type: "Bags",
    description:
      "Compact light blue leather handbag with a decorative silver clasp. Stylish and elegant for everyday use.",
    price: 119.99,
    salePrice: 89.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Light Blue"],
    images: [`${IMG}/Accessories/bag-light-blue-clasp.jpg`, `${IMG}/Accessories/bag-light-blue-clasp-flat-lay.jpg`, `${IMG}/Accessories/bag-wicker-tan-handle.jpg`],
    stock: 14,
    tags: ["bag", "handbag", "light blue", "leather", "clasp"],
    features: [
      "Faux leather material",
      "Silver clasp closure",
      "Compact size",
    ],
  },
  {
    name: "Knit Beanie Hat",
    type: "Hats",
    description:
      "Ribbed knit beanie available in multiple colors. Warm and cozy for cold weather days.",
    price: 34.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Brown", "Pink", "Yellow", "Green"],
    images: [`${IMG}/Accessories/beanie-knit-multicolor.jpg`, `${IMG}/Accessories/beanie-knit-multicolor.jpg`, `${IMG}/Accessories/scarf-checkered-brown.jpg`],
    stock: 40,
    tags: ["beanie", "hat", "knit", "winter", "colorful"],
    features: ["Ribbed knit construction", "Soft acrylic blend", "Foldable cuff"],
  },
  {
    name: "Prada Chain Crossbody Bag",
    type: "Bags",
    description:
      "Black leather crossbody bag with a silver chain strap. Compact yet spacious for everyday essentials.",
    price: 299.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Black"],
    images: [`${IMG}/Accessories/bag-prada-black-chain.jpg`, `${IMG}/Accessories/bag-prada-black-chain.jpg`, `${IMG}/Accessories/bag-crescent-black-nylon.jpg`],
    stock: 6,
    tags: ["bag", "crossbody", "black", "leather", "chain", "luxury"],
    features: [
      "Premium leather",
      "Silver chain strap",
      "Magnetic flap closure",
    ],
  },
  {
    name: "Wicker Top-Handle Bag",
    type: "Bags",
    description:
      "Tan wicker handbag with a smooth leather top flap and handle. A unique blend of classic and summer style.",
    price: 189.99,
    salePrice: 149.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Tan"],
    images: [`${IMG}/Accessories/bag-wicker-tan-handle.jpg`, `${IMG}/Accessories/bag-wicker-tan-handle.jpg`, `${IMG}/Accessories/bag-crossbody-leather-collection.jpg`],
    stock: 9,
    tags: ["bag", "wicker", "tan", "summer", "top-handle"],
    features: [
      "Hand-woven wicker base",
      "Smooth leather flap",
      "Sturdy top handle",
    ],
  },
  {
    name: "Vintage Leather Bifold Wallet",
    type: "Wallets",
    description:
      "Brown leather bifold wallet with a distressed vintage finish. Slim profile with multiple card slots.",
    price: 49.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Brown"],
    images: [`${IMG}/Accessories/wallet-leather-brown.jpg`, `${IMG}/Accessories/wallet-leather-brown.jpg`, `${IMG}/Accessories/shoes-monk-strap-brown.jpg`],
    stock: 35,
    tags: ["wallet", "leather", "brown", "vintage", "bifold"],
    features: [
      "Genuine distressed leather",
      "Bifold design",
      "Multiple card slots and bill compartment",
    ],
  },
  {
    name: "Leather Crossbody Bag Collection",
    type: "Bags",
    description:
      "Soft leather crossbody bag available in multiple colors. Features a zip pocket and adjustable strap.",
    price: 139.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Tan", "Cream", "Black", "Olive", "Blue"],
    images: [`${IMG}/Accessories/bag-crossbody-leather-collection.jpg`, `${IMG}/Accessories/bag-crossbody-leather-collection.jpg`, `${IMG}/Accessories/bag-wicker-tan-handle.jpg`],
    stock: 18,
    tags: ["bag", "crossbody", "leather", "multi-color", "casual"],
    features: [
      "Soft genuine leather",
      "Zip pocket closure",
      "Adjustable shoulder strap",
    ],
  },
  {
    name: "Black Leather Mid-Calf Boots",
    type: "Shoes",
    description:
      "Sleek black leather mid-calf boots with a pointed toe and block heel. Bold and modern.",
    price: 219.99,
    salePrice: 179.99,
    category: "accessories",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["Black"],
    images: [`${IMG}/Accessories/boots-black-leather-mid-calf.jpg`, `${IMG}/Accessories/boots-black-leather-mid-calf.jpg`, `${IMG}/Accessories/shoes-monk-strap-brown.jpg`],
    stock: 11,
    tags: ["boots", "black", "leather", "mid-calf", "block heel"],
    features: [
      "Genuine leather upper",
      "Pointed toe silhouette",
      "Block heel",
    ],
  },
  {
    name: "Croc-Texture Tassel Loafers",
    type: "Shoes",
    description:
      "Brown crocodile-textured leather loafers with decorative tassels. Sophisticated and polished.",
    price: 159.99,
    category: "accessories",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Brown"],
    images: [`${IMG}/Accessories/shoes-loafer-brown-croc-tassel.jpg`, `${IMG}/Accessories/shoes-loafer-brown-croc-tassel.jpg`, `${IMG}/Accessories/shoes-monk-strap-brown.jpg`],
    stock: 13,
    tags: ["shoes", "loafers", "brown", "croc", "tassel", "formal"],
    features: [
      "Croc-embossed leather",
      "Tassel detail",
      "Cushioned insole",
    ],
  },
  {
    name: "Silver Bead Stretch Bracelet",
    type: "Jewelry",
    description:
      "Sterling silver 5mm bead bracelet with a stretch-to-fit design. Simple, elegant, and easy to wear.",
    price: 79.99,
    salePrice: 59.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Silver"],
    images: [`${IMG}/Accessories/bracelet-silver-bead-stretch.jpg`, `${IMG}/Accessories/bracelet-silver-bead-stretch.jpg`, `${IMG}/Accessories/bracelet-rose-gold-bangle.jpg`],
    stock: 28,
    tags: ["bracelet", "silver", "bead", "stretch", "sterling"],
    features: [
      "Sterling silver beads",
      "Stretch-to-fit elastic",
      "5mm bead size",
    ],
  },
  {
    name: "Sport Mirror Sunglasses",
    type: "Sunglasses",
    description:
      "Bold sport sunglasses with a wraparound frame and orange mirror lenses. Statement eyewear for an active lifestyle.",
    price: 109.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Silver", "Orange"],
    images: [`${IMG}/Accessories/sunglasses-sport-mirror-orange.jpg`, `${IMG}/Accessories/sunglasses-sport-mirror-orange.jpg`, `${IMG}/Accessories/sunglasses-black-slim-rectangular.jpg`],
    stock: 16,
    tags: ["sunglasses", "sport", "mirror", "orange", "bold"],
    features: [
      "UV400 protection",
      "Wraparound frame",
      "Orange mirror coating",
    ],
  },

  // ==================== MEN ====================

  {
    name: "Olive Bomber Jacket",
    type: "Jackets",
    description:
      "Olive green bomber jacket with a grey hoodie layer underneath. Street-style ready with a casual, edgy vibe.",
    price: 149.99,
    salePrice: 119.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive"],
    images: [`${IMG}/Men/outfit-bomber-jacket-ripped-jeans.jpg`, `${IMG}/Men/outfit-bomber-jacket-ripped-jeans.jpg`, `${IMG}/Men/jacket-denim-classic-blue.jpg`],
    stock: 15,
    tags: ["jacket", "bomber", "olive", "street style", "casual"],
    features: [
      "Zip-up front",
      "Ribbed cuffs and hem",
      "Lightweight shell fabric",
    ],
  },
  {
    name: "Canvas Work Jacket",
    type: "Jackets",
    description:
      "Blue cotton canvas work jacket with a classic chore coat design. Four front pockets and button closure.",
    price: 119.99,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue"],
    images: [`${IMG}/Men/jacket-canvas-work-blue.jpg`, `${IMG}/Men/jacket-canvas-work-blue.jpg`, `${IMG}/Men/jacket-chore-cream.jpg`],
    stock: 18,
    tags: ["jacket", "canvas", "work", "blue", "chore coat"],
    features: [
      "100% cotton canvas",
      "Four patch pockets",
      "Button-front closure",
    ],
  },
  {
    name: "Stretch Fit Polo Shirt",
    type: "Polo Shirts",
    description:
      "Blue stretch polo shirt with a modern athletic fit. Breathable fabric ideal for both casual and semi-formal occasions.",
    price: 59.99,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue"],
    images: [`${IMG}/Men/polo-stretch-blue.jpg`, `${IMG}/Men/polo-stretch-blue.jpg`, `${IMG}/Men/polo-zip-white.jpg`],
    stock: 30,
    tags: ["polo", "stretch", "blue", "athletic", "casual"],
    features: [
      "Stretch fabric blend",
      "Three-button placket",
      "Athletic fit",
    ],
  },
  {
    name: "Slim Fit Jeans - Medium Blue",
    type: "Jeans",
    description:
      "Classic slim fit jeans in medium blue wash. Comfortable stretch denim with a modern silhouette.",
    price: 89.99,
    salePrice: 69.99,
    category: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue"],
    images: [`${IMG}/Men/jeans-slim-blue-medium.jpg`, `${IMG}/Men/jeans-slim-blue-medium.jpg`, `${IMG}/Men/jeans-skinny-charcoal.jpg`],
    stock: 25,
    tags: ["jeans", "slim fit", "blue", "denim", "classic"],
    features: [
      "Stretch denim blend",
      "Slim fit through thigh",
      "Five-pocket styling",
    ],
  },
  {
    name: "Skinny Jeans - Black",
    type: "Jeans",
    description:
      "Black skinny jeans with a sleek, modern fit. Versatile staple for both casual and dressed-up looks.",
    price: 79.99,
    category: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black"],
    images: [`${IMG}/Men/jeans-skinny-black.jpg`, `${IMG}/Men/jeans-skinny-black.jpg`, `${IMG}/Men/jeans-slim-blue-medium.jpg`],
    stock: 22,
    tags: ["jeans", "skinny", "black", "slim", "staple"],
    features: [
      "Stretch denim",
      "Skinny fit throughout",
      "Black wash",
    ],
  },
  {
    name: "Zip Polo Shirt - White",
    type: "Polo Shirts",
    description:
      "White polo shirt with a quarter-zip collar. Clean and sharp for a polished summer look.",
    price: 54.99,
    salePrice: 39.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    images: [`${IMG}/Men/polo-zip-white.jpg`, `${IMG}/Men/polo-zip-white.jpg`, `${IMG}/Men/polo-classic-black.jpg`],
    stock: 20,
    tags: ["polo", "zip", "white", "summer", "smart casual"],
    features: [
      "Quarter-zip collar",
      "Cotton-polyester blend",
      "Regular fit",
    ],
  },
  {
    name: "Classic Polo Shirt - Black",
    type: "Polo Shirts",
    description:
      "Timeless black polo shirt with a slim fit. A wardrobe essential that pairs with everything.",
    price: 49.99,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    images: [`${IMG}/Men/polo-classic-black.jpg`, `${IMG}/Men/polo-classic-black.jpg`, `${IMG}/Men/polo-stretch-blue.jpg`],
    stock: 35,
    tags: ["polo", "classic", "black", "slim fit", "essential"],
    features: [
      "100% cotton piqué",
      "Slim fit",
      "Ribbed collar and cuffs",
    ],
  },
  {
    name: "Skinny Jeans - Charcoal",
    type: "Jeans",
    description:
      "Dark charcoal skinny jeans with a worn-in look. Great for a casual, street-inspired outfit.",
    price: 84.99,
    category: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Charcoal"],
    images: [`${IMG}/Men/jeans-skinny-charcoal.jpg`, `${IMG}/Men/jeans-skinny-charcoal.jpg`, `${IMG}/Men/jeans-skinny-black.jpg`],
    stock: 19,
    tags: ["jeans", "skinny", "charcoal", "dark", "street style"],
    features: [
      "Stretch denim",
      "Skinny fit",
      "Charcoal wash with fading",
    ],
  },
  {
    name: "Navy Crew Neck Sweater",
    type: "Sweaters",
    description:
      "Navy blue crew neck sweater layered over a white collared shirt. Smart-casual style for cooler days.",
    price: 89.99,
    salePrice: 74.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy"],
    images: [`${IMG}/Men/sweater-navy-over-shirt.jpg`, `${IMG}/Men/sweater-navy-over-shirt.jpg`, `${IMG}/Men/sweatshirt-crewneck-white.jpg`],
    stock: 16,
    tags: ["sweater", "navy", "crew neck", "layered", "smart casual"],
    features: [
      "Fine knit cotton blend",
      "Crew neck",
      "Regular fit",
    ],
  },
  {
    name: "Suede Bomber Jacket - Tan",
    type: "Jackets",
    description:
      "Tan suede bomber jacket with a clean, minimalist design. A premium jacket for transitional weather.",
    price: 199.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Tan"],
    images: [`${IMG}/Men/jacket-suede-tan.jpg`, `${IMG}/Men/jacket-suede-tan.jpg`, `${IMG}/Men/jacket-canvas-work-blue.jpg`],
    stock: 10,
    tags: ["jacket", "suede", "tan", "bomber", "premium"],
    features: [
      "Genuine suede",
      "Zip-up front",
      "Ribbed cuffs and hem",
    ],
  },
  {
    name: "Classic Denim Jacket",
    type: "Jackets",
    description:
      "Classic blue denim jacket with a relaxed fit. A timeless layering piece with chest pockets and button closure.",
    price: 109.99,
    salePrice: 89.99,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue"],
    images: [`${IMG}/Men/jacket-denim-classic-blue.jpg`, `${IMG}/Men/jacket-denim-classic-blue.jpg`, `${IMG}/Men/outfit-bomber-jacket-ripped-jeans.jpg`],
    stock: 20,
    tags: ["jacket", "denim", "blue", "classic", "casual"],
    features: [
      "100% cotton denim",
      "Button-front closure",
      "Two chest flap pockets",
    ],
  },
  {
    name: "Ripped Slim Jeans - Light Blue",
    type: "Jeans",
    description:
      "Light blue ripped jeans with distressed knee details. Trendy street-style look with a slim fit.",
    price: 74.99,
    category: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Light Blue"],
    images: [`${IMG}/Men/jeans-ripped-light-blue.jpg`, `${IMG}/Men/jeans-ripped-light-blue.jpg`, `${IMG}/Men/jeans-slim-blue-medium.jpg`],
    stock: 17,
    tags: ["jeans", "ripped", "light blue", "distressed", "street style"],
    features: [
      "Stretch denim",
      "Distressed knee rips",
      "Slim fit",
    ],
  },
  {
    name: "Oversized Hoodie - Black",
    type: "Hoodies",
    description:
      "Oversized black hoodie with a front kangaroo pocket and drawstring hood. Relaxed and comfortable for everyday wear.",
    price: 64.99,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    images: [`${IMG}/Men/hoodie-oversized-black.jpg`, `${IMG}/Men/hoodie-oversized-black.jpg`, `${IMG}/Men/sweatshirt-crewneck-white.jpg`],
    stock: 28,
    tags: ["hoodie", "oversized", "black", "casual", "comfort"],
    features: [
      "Heavyweight cotton fleece",
      "Kangaroo front pocket",
      "Oversized relaxed fit",
    ],
  },
  {
    name: "Slim Chino Pants - Khaki",
    type: "Pants",
    description:
      "Khaki slim-fit chino pants with a tapered leg. Versatile and comfortable for casual or semi-formal settings.",
    price: 69.99,
    salePrice: 54.99,
    category: "men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki"],
    images: [`${IMG}/Men/chinos-khaki-slim.jpg`, `${IMG}/Men/chinos-khaki-slim.jpg`, `${IMG}/Men/jeans-skinny-charcoal.jpg`],
    stock: 24,
    tags: ["chinos", "khaki", "slim", "pants", "casual"],
    features: [
      "Cotton twill fabric",
      "Slim tapered fit",
      "Belt loops and zip fly",
    ],
  },
  {
    name: "Essential Crew Neck T-Shirt - White",
    type: "T-Shirts",
    description:
      "Clean white crew neck t-shirt made from soft cotton. A wardrobe essential with a comfortable regular fit.",
    price: 29.99,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White"],
    images: [`${IMG}/Men/tshirt-crew-white.jpg`, `${IMG}/Men/tshirt-crew-white.jpg`, `${IMG}/Men/tshirt-graphic-black.jpg`],
    stock: 50,
    tags: ["tshirt", "crew neck", "white", "essential", "basic"],
    features: [
      "100% cotton",
      "Crew neck",
      "Regular fit",
    ],
  },
  {
    name: "Graphic Print T-Shirt - Black",
    type: "T-Shirts",
    description:
      "Black t-shirt with a minimalist white text print on the front. Casual and stylish streetwear piece.",
    price: 34.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    images: [`${IMG}/Men/tshirt-graphic-black.jpg`, `${IMG}/Men/tshirt-graphic-black.jpg`, `${IMG}/Men/tshirt-crew-white.jpg`],
    stock: 32,
    tags: ["tshirt", "graphic", "black", "print", "streetwear"],
    features: [
      "Cotton jersey",
      "Screen-printed graphic",
      "Regular fit",
    ],
  },
  {
    name: "Crewneck Sweatshirt - White",
    type: "Sweatshirts",
    description:
      "White crewneck sweatshirt with a clean, minimal look. Soft fleece interior for all-day comfort.",
    price: 54.99,
    salePrice: 42.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    images: [`${IMG}/Men/sweatshirt-crewneck-white.jpg`, `${IMG}/Men/sweatshirt-crewneck-white.jpg`, `${IMG}/Men/hoodie-oversized-black.jpg`],
    stock: 21,
    tags: ["sweatshirt", "crewneck", "white", "minimal", "casual"],
    features: [
      "Soft fleece lining",
      "Ribbed cuffs and hem",
      "Relaxed fit",
    ],
  },
  {
    name: "Chore Coat - Cream",
    type: "Jackets",
    description:
      "Cream-colored cotton chore coat with wooden buttons and three front pockets. A classic workwear-inspired piece.",
    price: 129.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream"],
    images: [`${IMG}/Men/jacket-chore-cream.jpg`, `${IMG}/Men/jacket-chore-cream.jpg`, `${IMG}/Men/jacket-suede-tan.jpg`],
    stock: 14,
    tags: ["jacket", "chore coat", "cream", "workwear", "cotton"],
    features: [
      "100% cotton canvas",
      "Wooden button closure",
      "Three patch pockets",
    ],
  },

  // ==================== WOMEN ====================

  {
    name: "Off-Shoulder Belted Mini Dress - Beige",
    type: "Dresses",
    description:
      "Beige off-shoulder knit mini dress with a statement black and gold belt. Chic and elegant for any occasion.",
    price: 119.99,
    salePrice: 94.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Beige"],
    images: [`${IMG}/Women/dress-off-shoulder-beige-belted.jpg`, `${IMG}/Women/dress-off-shoulder-beige-belted.jpg`, `${IMG}/Women/dress-satin-midi-cream.jpg`],
    stock: 12,
    tags: ["dress", "off-shoulder", "beige", "belted", "mini", "elegant"],
    features: [
      "Soft knit fabric",
      "Off-shoulder neckline",
      "Comes with decorative belt",
    ],
  },
  {
    name: "Strapless Top & Mini Skirt Set - White",
    type: "Sets",
    description:
      "Matching white strapless top and mini skirt set. Clean, minimal, and perfect for summer outings.",
    price: 99.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["White"],
    images: [`${IMG}/Women/set-strapless-top-mini-skirt-white.jpg`, `${IMG}/Women/set-strapless-top-mini-skirt-white.jpg`, `${IMG}/Women/set-striped-top-wide-pants-taupe.jpg`],
    stock: 14,
    tags: ["set", "two-piece", "white", "strapless", "mini skirt", "summer"],
    features: [
      "Strapless bandeau top",
      "Matching mini skirt",
      "Structured tailored fabric",
    ],
  },
  {
    name: "Ruched Mini Dress - Chocolate Brown",
    type: "Dresses",
    description:
      "Chocolate brown off-shoulder mini dress with ruched detailing. A body-hugging fit for a night out.",
    price: 89.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Brown"],
    images: [`${IMG}/Women/dress-mini-off-shoulder-brown.jpg`, `${IMG}/Women/dress-mini-off-shoulder-brown.jpg`, `${IMG}/Women/dress-off-shoulder-beige-belted.jpg`],
    stock: 16,
    tags: ["dress", "mini", "brown", "ruched", "off-shoulder", "bodycon"],
    features: [
      "Stretch jersey fabric",
      "Asymmetric off-shoulder neckline",
      "Ruched side detailing",
    ],
  },
  {
    name: "Striped Top & Wide Pants Set - Taupe",
    type: "Sets",
    description:
      "Two-piece set featuring a V-neck striped knit top and matching wide-leg pants in taupe. Relaxed yet put-together.",
    price: 109.99,
    salePrice: 84.99,
    category: "women",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Taupe"],
    images: [`${IMG}/Women/set-striped-top-wide-pants-taupe.jpg`, `${IMG}/Women/set-striped-top-wide-pants-taupe.jpg`, `${IMG}/Women/set-strapless-top-mini-skirt-white.jpg`],
    stock: 13,
    tags: ["set", "two-piece", "striped", "taupe", "wide pants", "knit"],
    features: [
      "V-neck knit top",
      "Elastic waist wide-leg pants",
      "Soft knit fabric",
    ],
  },
  {
    name: "Strapless Ruched Dress - Black",
    type: "Dresses",
    description:
      "Black strapless mini dress with ruched body and an asymmetric ruffle hem. A show-stopping party dress.",
    price: 94.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    images: [`${IMG}/Women/dress-strapless-black-ruched.jpg`, `${IMG}/Women/dress-strapless-black-ruched.jpg`, `${IMG}/Women/dress-one-shoulder-black.jpg`],
    stock: 18,
    tags: ["dress", "strapless", "black", "ruched", "party", "mini"],
    features: [
      "Stretch fabric",
      "Strapless neckline",
      "Asymmetric ruffle hem",
    ],
  },
  {
    name: "Button-Down Blouse - Pink",
    type: "Blouses",
    description:
      "Light pink button-down blouse with a relaxed oversized fit and subtle embroidered pattern. Feminine and casual.",
    price: 64.99,
    salePrice: 49.99,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink"],
    images: [`${IMG}/Women/blouse-button-down-pink.jpg`, `${IMG}/Women/blouse-button-down-pink.jpg`, `${IMG}/Women/dress-denim-shirt-blue.jpg`],
    stock: 20,
    tags: ["blouse", "button-down", "pink", "oversized", "casual"],
    features: [
      "Lightweight cotton",
      "Oversized relaxed fit",
      "Embroidered pattern detail",
    ],
  },
  {
    name: "Denim Shirt Dress - Blue",
    type: "Dresses",
    description:
      "Blue denim shirt dress with snap-button front and a flared skirt. A classic casual piece with a vintage feel.",
    price: 84.99,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue"],
    images: [`${IMG}/Women/dress-denim-shirt-blue.jpg`, `${IMG}/Women/dress-denim-shirt-blue.jpg`, `${IMG}/Women/blouse-button-down-pink.jpg`],
    stock: 15,
    tags: ["dress", "denim", "shirt dress", "blue", "casual", "vintage"],
    features: [
      "100% cotton denim",
      "Snap-button closure",
      "Flared skirt hem",
    ],
  },
  {
    name: "Satin Midi Dress - Cream",
    type: "Dresses",
    description:
      "Elegant cream satin midi dress with thin spaghetti straps and a cowl neckline. Perfect for evening events.",
    price: 159.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream"],
    images: [`${IMG}/Women/dress-satin-midi-cream.jpg`, `${IMG}/Women/dress-satin-midi-cream.jpg`, `${IMG}/Women/dress-slip-green-lime-maxi.jpg`],
    stock: 10,
    tags: ["dress", "satin", "midi", "cream", "elegant", "evening"],
    features: [
      "Satin fabric with sheen",
      "Cowl neckline",
      "Adjustable spaghetti straps",
    ],
  },
  {
    name: "Boho Off-Shoulder Maxi Dress - Yellow",
    type: "Dresses",
    description:
      "Bright yellow off-shoulder maxi dress with eyelet lace details and balloon sleeves. Free-spirited bohemian style.",
    price: 129.99,
    salePrice: 99.99,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Yellow"],
    images: [`${IMG}/Women/dress-boho-maxi-yellow.jpg`, `${IMG}/Women/dress-boho-maxi-yellow.jpg`, `${IMG}/Women/dress-maxi-flowy-red.jpg`],
    stock: 11,
    tags: ["dress", "boho", "maxi", "yellow", "off-shoulder", "lace"],
    features: [
      "Cotton fabric",
      "Eyelet lace inserts",
      "Balloon sleeves with elastic cuffs",
    ],
  },
  {
    name: "Flowy Maxi Dress - Red",
    type: "Dresses",
    description:
      "Stunning red flowy maxi dress with a fitted bodice and a dramatic full skirt. Perfect for special occasions.",
    price: 174.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red"],
    images: [`${IMG}/Women/dress-maxi-flowy-red.jpg`, `${IMG}/Women/dress-maxi-flowy-red.jpg`, `${IMG}/Women/dress-off-shoulder-burgundy.jpg`],
    stock: 8,
    tags: ["dress", "maxi", "red", "flowy", "elegant", "occasion"],
    features: [
      "Sleeveless fitted bodice",
      "Full flared skirt",
      "Back zipper closure",
    ],
  },
  {
    name: "Tailored Slim Pants - Navy",
    type: "Pants",
    description:
      "Navy blue tailored slim-fit pants with a cropped ankle length. Smart and polished for the office or a night out.",
    price: 79.99,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Navy"],
    images: [`${IMG}/Women/pants-tailored-navy-slim.jpg`, `${IMG}/Women/pants-tailored-navy-slim.jpg`, `${IMG}/Women/pants-slim-grey-formal.jpg`],
    stock: 22,
    tags: ["pants", "tailored", "navy", "slim", "cropped", "office"],
    features: [
      "Tailored slim fit",
      "Cropped ankle length",
      "Side zip closure",
    ],
  },
  {
    name: "Pleated Mini Skirt - Black",
    type: "Skirts",
    description:
      "Black pleated mini skirt with a high waist and flared silhouette. A versatile piece for layering and styling.",
    price: 54.99,
    salePrice: 39.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    images: [`${IMG}/Women/skirt-pleated-black-mini.jpg`, `${IMG}/Women/skirt-pleated-black-mini.jpg`, `${IMG}/Women/pants-tailored-navy-slim.jpg`],
    stock: 26,
    tags: ["skirt", "pleated", "black", "mini", "high waist"],
    features: [
      "Pleated construction",
      "High waist",
      "Side zipper closure",
    ],
  },
  {
    name: "Wide Leg Plaid Pants - Grey",
    type: "Pants",
    description:
      "Grey plaid wide-leg pants with a high waist and chain belt detail. Trendy street-style inspired look.",
    price: 89.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Grey"],
    images: [`${IMG}/Women/jeans-wide-leg-grey-plaid.jpg`, `${IMG}/Women/jeans-wide-leg-grey-plaid.jpg`, `${IMG}/Women/jeans-wide-leg-blue-vintage.jpg`],
    stock: 14,
    tags: ["pants", "wide leg", "grey", "plaid", "street style"],
    features: [
      "Plaid woven fabric",
      "High waist with belt loops",
      "Wide straight-leg silhouette",
    ],
  },
  {
    name: "Wide Leg Jeans - Vintage Blue",
    type: "Jeans",
    description:
      "Vintage blue high-waisted wide-leg jeans with a relaxed straight fit. A timeless denim staple.",
    price: 94.99,
    salePrice: 74.99,
    category: "women",
    sizes: ["24", "26", "28", "30", "32"],
    colors: ["Blue"],
    images: [`${IMG}/Women/jeans-wide-leg-blue-vintage.jpg`, `${IMG}/Women/jeans-wide-leg-blue-vintage.jpg`, `${IMG}/Women/jeans-wide-leg-grey-plaid.jpg`],
    stock: 19,
    tags: ["jeans", "wide leg", "blue", "vintage", "high waist"],
    features: [
      "100% cotton denim",
      "High-rise waist",
      "Wide straight-leg fit",
    ],
  },
  {
    name: "Slim Formal Pants - Grey",
    type: "Pants",
    description:
      "Grey slim-fit formal pants with a high waist. Polished and professional for office or formal occasions.",
    price: 74.99,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Grey"],
    images: [`${IMG}/Women/pants-slim-grey-formal.jpg`, `${IMG}/Women/pants-slim-grey-formal.jpg`, `${IMG}/Women/pants-tailored-navy-slim.jpg`],
    stock: 20,
    tags: ["pants", "slim", "grey", "formal", "office", "professional"],
    features: [
      "Tailored slim fit",
      "High waist",
      "Stretch blend for comfort",
    ],
  },
  {
    name: "Slip Maxi Dress - Lime Green",
    type: "Dresses",
    description:
      "Lime green satin slip maxi dress with thin straps and a draped neckline. Bold and trendy for summer events.",
    price: 139.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Lime Green"],
    images: [`${IMG}/Women/dress-slip-green-lime-maxi.jpg`, `${IMG}/Women/dress-slip-green-lime-maxi.jpg`, `${IMG}/Women/dress-boho-maxi-yellow.jpg`],
    stock: 9,
    tags: ["dress", "slip", "maxi", "lime green", "satin", "summer"],
    features: [
      "Satin fabric",
      "Thin adjustable straps",
      "Draped cowl neckline",
    ],
  },
  {
    name: "Belted Wrap Coat - Camel",
    type: "Coats",
    description:
      "Classic camel wrap coat with a tie belt and wide lapels. A timeless winter staple with an elegant silhouette.",
    price: 229.99,
    salePrice: 189.99,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Camel"],
    images: [`${IMG}/Women/coat-wrap-camel-belted.jpg`, `${IMG}/Women/coat-wrap-camel-belted.jpg`, `${IMG}/Women/coat-faux-fur-cream.jpg`],
    stock: 12,
    tags: ["coat", "wrap", "camel", "belted", "winter", "elegant"],
    features: [
      "Wool blend fabric",
      "Wrap front with tie belt",
      "Wide lapel collar",
    ],
  },
  {
    name: "Off-Shoulder Evening Dress - Purple",
    type: "Dresses",
    description:
      "Deep purple off-shoulder evening dress with a fitted silhouette. Sophisticated and dramatic for formal events.",
    price: 189.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Purple"],
    images: [`${IMG}/Women/dress-off-shoulder-purple-elegant.jpg`, `${IMG}/Women/dress-off-shoulder-purple-elegant.jpg`, `${IMG}/Women/dress-off-shoulder-burgundy.jpg`],
    stock: 7,
    tags: ["dress", "off-shoulder", "purple", "evening", "formal", "elegant"],
    features: [
      "Stretch crepe fabric",
      "Off-shoulder neckline",
      "Fitted midi length",
    ],
  },
  {
    name: "Faux Fur Coat - Cream",
    type: "Coats",
    description:
      "Luxurious cream faux fur coat with a relaxed oversized fit. A statement piece for cold-weather elegance.",
    price: 489,
    salePrice: 389,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream"],
    images: [`${IMG}/Women/coat-faux-fur-cream.jpg`, `${IMG}/Women/coat-faux-fur-cream.jpg`, `${IMG}/Women/coat-wrap-camel-belted.jpg`],
    stock: 10,
    tags: ["coat", "faux fur", "cream", "winter", "oversized"],
    features: [
      "Faux fur material",
      "Oversized fit",
      "Side pockets",
    ],
  },
  {
    name: "Off-Shoulder Maxi Dress - Burgundy",
    type: "Dresses",
    description:
      "Elegant burgundy off-shoulder maxi dress with draped fabric and a flowing silhouette. Perfect for formal events.",
    price: 279.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Burgundy"],
    images: [`${IMG}/Women/dress-off-shoulder-burgundy.jpg`, `${IMG}/Women/dress-off-shoulder-burgundy.jpg`, `${IMG}/Women/dress-maxi-flowy-red.jpg`],
    stock: 8,
    tags: ["dress", "off-shoulder", "burgundy", "maxi", "formal", "elegant"],
    features: [
      "Draped fabric",
      "Off-shoulder neckline",
      "Floor-length silhouette",
    ],
  },
  {
    name: "One-Shoulder Mini Dress - Black",
    type: "Dresses",
    description:
      "Sleek black one-shoulder mini dress with a body-hugging fit. Pair with heels for a night out.",
    price: 149.99,
    salePrice: 119.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black"],
    images: [`${IMG}/Women/dress-one-shoulder-black.jpg`, `${IMG}/Women/dress-one-shoulder-black.jpg`, `${IMG}/Women/dress-strapless-black-ruched.jpg`],
    stock: 15,
    tags: ["dress", "one-shoulder", "black", "mini", "party", "night out"],
    features: [
      "Stretch fabric",
      "One-shoulder neckline",
      "Body-hugging fit",
    ],
  },
  {
    name: "Slim Fit Blazer - Black",
    type: "Blazers",
    description:
      "Sharp black slim-fit blazer paired effortlessly with a casual tee. A modern wardrobe staple for smart-casual occasions.",
    price: 189.99,
    salePrice: 149.99,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    images: [`${IMG}/Men/blazer-black-tshirt-brown.jpg`, `${IMG}/Men/blazer-black-tshirt-brown.jpg`, `${IMG}/Men/jacket-suede-tan.jpg`],
    stock: 12,
    tags: ["blazer", "black", "slim fit", "smart casual", "formal"],
    features: [
      "Slim fit cut",
      "Two-button closure",
      "Fully lined interior",
    ],
  },
  {
    name: "Camel Wool Coat & White Jeans Outfit",
    type: "Coats",
    description:
      "Elegant camel wool coat with a beige turtleneck and white skinny jeans. A complete head-to-toe look for the modern woman.",
    price: 259.99,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Camel"],
    images: [`${IMG}/Women/outfit-camel-coat-white-jeans.jpg`, `${IMG}/Women/outfit-camel-coat-white-jeans.jpg`, `${IMG}/Women/coat-wrap-camel-belted.jpg`],
    stock: 7,
    tags: ["coat", "camel", "wool", "outfit", "winter", "elegant"],
    features: [
      "Wool blend fabric",
      "Open front design",
      "Knee-length silhouette",
    ],
  },
  {
    name: "Men's Essentials Accessories Set",
    type: "Sets",
    description:
      "Classic men's accessories flat lay featuring black Oxford brogues, a leather belt, vintage watch, brown leather wallet, and sunglasses. The ultimate gentleman's starter kit.",
    price: 349.99,
    salePrice: 279.99,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Black", "Brown"],
    images: [`${IMG}/Accessories/flat-lay-oxford-shoes-accessories.jpg`, `${IMG}/Accessories/flat-lay-oxford-shoes-accessories.jpg`, `${IMG}/Accessories/wallet-leather-brown.jpg`],
    stock: 5,
    tags: ["set", "accessories", "oxford", "wallet", "watch", "belt", "gift"],
    features: [
      "Oxford brogue shoes",
      "Leather belt and wallet",
      "Matching accessories set",
    ],
  },
];

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not defined in .env.dev");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to Database");

    // Clear existing products
    const deleted = await Product.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} existing products`);

    // Add random soldCount to each product
    const productsWithSales = products.map((p) => ({
      ...p,
      soldCount: Math.floor(Math.random() * 200),
    }));

    // Insert new products
    const inserted = await Product.insertMany(productsWithSales);
    console.log(`Inserted ${inserted.length} products`);

    console.log("\nBreakdown:");
    const accessories = inserted.filter((p) => p.category === "accessories");
    const men = inserted.filter((p) => p.category === "men");
    const women = inserted.filter((p) => p.category === "women");
    console.log(`  Accessories: ${accessories.length}`);
    console.log(`  Men: ${men.length}`);
    console.log(`  Women: ${women.length}`);

    const onSale = inserted.filter((p) => p.salePrice);
    console.log(`  On Sale: ${onSale.length}`);

    console.log("\nSeed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from Database");
  }
}

seed();

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../Product/Product";
import CategoryCarousel from "./CategoryCarousel";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";
import HorizontalScrollCarousel from "../Banner&Carousels/HorizontalScrollCarousel";
import ComingSoon from "./ComingSoon";
import VideoClassSection from "./VideoClassSection";
import RecommendedProducts from "./RecommendedProducts";
import { PromotionCard, DealsOfTheDay }  from "../Banner&Carousels/DealsOfTheDay";

import logo1 from "../../assets/1.svg";
import logo2 from "../../assets/2.svg";
import logo3 from "../../assets/3.svg";
import logo4 from "../../assets/4.svg";
import logo5 from "../../assets/5.svg";
import logo6 from "../../assets/6.svg";
import logo7 from "../../assets/7.svg";
import logo8 from "../../assets/8.svg";
import logo9 from "../../assets/9.svg";

// Assets
import banner1 from "../../assets/homebanner.png";
import footwear from "../../assets/footwear.png";
import jacket from "../../assets/jacket.png";
import tshirts from "../../assets/t-shirts.png";
import tops from "../../assets/tops.png";
import yoga from "../../assets/yoga.png";
import running from "../../assets/running.png";
import compression from "../../assets/compression.png";
import gloves from "../../assets/gloves.png";
import sportvid from "../../assets/sportvid.mp4";
import bigbanner from "../../assets/Bigbanner.png";
import ShopTheLookCarousel from "../Banner&Carousels/ShopTheLookCarousel";

// Categories
const categories = [
  { logo: logo1, name: "Work For It", path: "/brand/Work For It" },
  { logo: logo2, name: "U", path: "/brand/U" },
  { logo: logo3, name: "WMX", path: "/brand/WMX" },
  { logo: logo4, name: "SportInger", path: "/brand/SportInger" },
  { logo: logo5, name: "Ninq", path: "/brand/Ninq" },
  { logo: logo6, name: "Never Lose", path: "/brand/Never Lose" },
  { logo: logo7, name: "GYMFIC", path: "/brand/GYMFIC" },
  { logo: logo8, name: "KYK", path: "/brand/KYK" },
  { logo: logo9, name: "Train Hard", path: "/brand/Train Hard" },
];

// --- Promotional Card Data (Vertical aspect ratio) ---
const promoCards = [
    {
        image: "https://yardofdeals.com/cdn/shop/products/2018-New-Summer-style-Mens-cotton-Short-sleeve-t-shirt-Gyms-Fitness-shirts-male-casual-fashion.jpg_640x640_1024x1024_2x_6fcb8ce1-9502-4084-b154-08501d78e41a_1200x1200.jpg?v=1597908790", // Dark background for contrast
        deal: "MIN. 40% OFF",
        look: "Laidback Looks",
        logo: logo1
    },
    {
        image: "https://www.powerhousegymproshop.com/cdn/shop/files/powerhouse-gym-pro-shop-premium-oversized-hoodie-charcoal-34264387911851.jpg?v=1687997189&width=1445", // Green background
        deal: "FLAT 30% OFF",
        look: "Seasonal Essentials",
        logo: "https://placehold.co/100x40/ffffff/10b981?text=Brand+B+Logo"
    },
    {
      image: "https://bullarfitness.com/cdn/shop/files/Accessories.jpg?v=1740035011&width=1100", // Purple background
      deal: "BUY 1 GET 1 FREE",
      look: "Premium Collections",
      logo: "https://placehold.co/100x40/ffffff/f97316?text=Brand+C+Logo"
    },
    { 
        image: "https://www.verywellfit.com/thmb/Eyv2XS6jfnBy9nSnCLHe_9A71TU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vwt-product-reebok-nano-x2-training-shoes-tstaples-133-e73e0a61fe50493daf72e839cd53dfdf.jpg", // Orange background
        deal: "UP TO 70% OFF",
        look: "Footwear & Accessories",
        logo: "https://placehold.co/100x40/ffffff/5b21b6?text=Brand+D+Logo"
    },
    {
        image: "https://www.fitlineindia.com/cdn/shop/files/WhatsApp_Image_2022-05-19_at_5.53.38_PM.jpg?v=1653037917&width=1500", // Deep Purple background
        deal: "EXTRA 20% OFF",
        look: "Clearance Event",
        logo: "https://placehold.co/100x40/ffffff/6d28d9?text=Brand+E+Logo"
    },
    {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDU7OcmNBhqYI7DCu3wOmtEOCwyTOzhknEU490QpBwnI4ngrWe1kzpwyy06N33fyeQkRo&usqp=CAU", // Emerald Green background
        deal: "NEW COLORS",
        look: "Comfort Collection",
        logo: "https://placehold.co/100x40/ffffff/059669?text=Brand+F+Logo"
    },
];

// Products (example placeholders)
const products = [
  {
    id: 1,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  {
    id: 1,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  {
    id: 1,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  {
    id: 1,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  {
    id: 1,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  

];

const menProducts = [
  {
    id: 1,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Duramo 10 Shoes",
    subtitle: "Performance",
    price: 2499,
    original: 6599,
    discount: "-65%",
  },
  {
    id: 2,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Galaxy 6 Shoes",
    category: "Performance",
    price: 2400,
    original: 5999,
    discount: "-60%",
  },
  {
    id: 3,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Samba OG Shoes",
    category: "Originals",
    price: 4400,
    original: 10999,
    discount: "-60%",
  },
  {
    id: 4,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Ultraboost 20 Shoes",
    category: "Performance",
    price: 7600,
    original: 18999,
    discount: "-60%",
  },
  {
    id: 5,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Duramo 10 Shoes",
    category: "Performance",
    price: 2499,
    original: 6599,
    discount: "-65%",
  },
  {
    id: 6,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Galaxy 6 Shoes",
    category: "Performance",
    price: 2400,
    original: 5999,
    discount: "-60%",
  },
  {
    id: 7,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Samba OG Shoes",
    category: "Originals",
    price: 4400,
    original: 10999,
    discount: "-60%",
  },
  {
    id: 8,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    img2: "https://www.gymxapparel.in/cdn/shop/files/m1.jpg?v=1753353563",
    title: "Ultraboost 20 Shoes",
    category: "Performance",
    price: 7600,
    original: 18999,
    discount: "-60%",
  },
];

const womenProducts = [
  {
    id: 1,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Running Top",
    category: "Performance",
    price: 1499,
    original: 2999,
    discount: "-50%",
  },
  {
    id: 2,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Yoga Tee",
    category: "Training",
    price: 1999,
    original: 3999,
    discount: "-50%",
  },
  {
    id: 3,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Winter Jacket",
    category: "Originals",
    price: 3499,
    original: 6999,
    discount: "-50%",
  },
  {
    id: 4,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Compression Top",
    category: "Performance",
    price: 2299,
    original: 4599,
    discount: "-50%",
  },
  {
    id: 5,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Running Top",
    category: "Performance",
    price: 1499,
    original: 2999,
    discount: "-50%",
  },
  {
    id: 6,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Yoga Tee",
    category: "Training",
    price: 1999,
    original: 3999,
    discount: "-50%",
  },
  {
    id: 7,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Winter Jacket",
    category: "Originals",
    price: 3499,
    original: 6999,
    discount: "-50%",
  },
  {
    id: 8,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    img2: "https://www.cyclop.in/cdn/shop/files/3_811df92c-4799-43d6-afe6-994c6885dce1_1080x.jpg?v=1689009277",
    title: "Compression Top",
    category: "Performance",
    price: 2299,
    original: 4599,
    discount: "-50%",
  },
];

// Deals
const festiveDeals = [
  {
    id: 1,
    image: footwear,
    title: "SHOES UNDER ₹3999",
    subtitle: "Epic Shoe Deals for Men & Women",
  },
  {
    id: 2,
    image: tshirts,
    title: "T-SHIRTS UNDER ₹999",
    subtitle: "Unbeatable Tees Under 999",
  },
  {
    id: 3,
    image: tops,
    title: "TOPS STARTING ₹799",
    subtitle: "Wardrobe Refresh. Tops from 799",
  },
  {
    id: 4,
    image: jacket,
    title: "JACKETS STARTING ₹1599",
    subtitle: "Seasonal Must-Haves from 1599",
  },
  {
    id: 5,
    image: footwear,
    title: "SHOES UNDER ₹3999",
    subtitle: "Epic Shoe Deals for Men & Women",
  },
  {
    id: 6,
    image: tshirts,
    title: "T-SHIRTS UNDER ₹999",
    subtitle: "Unbeatable Tees Under 999",
  },
  {
    id: 7,
    image: tops,
    title: "TOPS STARTING ₹799",
    subtitle: "Wardrobe Refresh. Tops from 799",
  },
  {
    id: 8,
    image: jacket,
    title: "JACKETS STARTING ₹1599",
    subtitle: "Seasonal Must-Haves from 1599",
  },
];

const promoBanners = [
  {
    id: 1,
    image:
      "https://media.wellmed.workers.dev/?file=MFXFCWSNJ5JVQZKIKFUVSMLWJXQ3U&mode=inline",
    title: "Fashion Sale",
    Subtitle: "banner",
  },
  {
    id: 2,
    image:
      "https://media.wellmed.workers.dev/?file=I52VCN2FNZWHUZZRO5HE6TJZKYP5Q&mode=inline",
    title: "New Collection",
  },
  {
    id: 3,
    image:
      "https://media.wellmed.workers.dev/?file=GBFHMM2QGFTEQMTWIF2XERLKJEHPY&mode=inline",
    title: "Sports Collection",
  },
  {
    id: 4,
    image:
      "https://media.wellmed.workers.dev/?file=MZTDIWBTIZQWQ2TPOR4TM6LUMRKH6&mode=inline",
    title: "Outdoor Gear",
  },
  {
    id: 5,
    image:
      "https://media.wellmed.workers.dev/?file=JFLESTCQJZTUUNLHLFNGCSSNGTEY4&mode=inline",
    title: "Winter Favorites",
  },
];

const mainBanners = [
  {
    id: 1,
    image: banner1,
    title: "Fashion Sale",
    Subtitle: "banner",
  },
  {
    id: 2,
    image: bigbanner,
    title: "New Collection",
  },
  {
    id: 3,
    image:
      "https://media.wellmed.workers.dev/?file=JFLESTCQJZTUUNLHLFNGCSSNGTEY4&mode=inline",
    title: "Winter Favorites",
  },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("men");
  const currentProducts =
    activeCategory === "men" ? menProducts : womenProducts;

  return (
    <main className="w-full bg-white pb-20 md:pb-0">
      {/* Banner */}
      <div className="w-full mx-auto mt-[60px] lg:mt-[80px]">
        <LandscapeCarousel items={mainBanners} />
      </div>
      {/* Festive Deals */}
      <section className="mt-5 p-5 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl font-bold">
          Curated Deals for Every Mood
        </h2>
        <div className="mt-10">
          <HorizontalScrollCarousel items={festiveDeals} speed={0.3} />
        </div>
      </section>
      <section className="mt-12 lg:max-w-7xl px-6 mx-auto">
        <h2 className="font-semibold text-3xl md:text-4xl text-center">
          Trusted by Iconic Brands
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Discover collections from globally loved athletic and lifestyle
          brands.
        </p>
        <div className="my-8 grid grid-cols-5 md:grid-cols-6 xl:grid-cols-9 gap-6">
          {categories.map((cat, i) => (
            <Link
            to={cat.path}
              key={i}
              className="flex flex-col items-center text-center hover:scale-105 transition"
              >
              <div className="w-16 h-16 sm:w-30 sm:h-30 rounded-full overflow-hidden border border-gray-400 p-1 md:p-4 shadow-md">
                <img
                  src={cat.logo}
                  className="w-full h-full object-cover object-center"
                  alt={cat.name}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Video Class Section */}

      <RecommendedProducts />

      <div className="max-w-7xl mx-auto">
        <DealsOfTheDay
          title="Shop Now: Deals of the Day"
          items={promoCards}
          />
      </div>
      {/* Categories */}

      {/* Sports */}
      <section className="lg:px-6 mx-auto text-center lg:max-w-7xl">
        <h2 className="font-semibold text-xl md:text-4xl">
          Your Passion. Your Performance.
        </h2>
        <p className="text-gray-500 mt-2">
          Whether it’s yoga, running, or training — find gear that moves with
          you.
        </p>
        <div className="grid grid-cols-2 gap-2 p-3">
          {[yoga, running, compression, gloves].map((img, i) => (
            <img
            key={i}
            src={img}
              alt="sport"
              className="mb-1 hover:scale-102 transition hover:shadow-lg"
            />
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-black text-white px-3 py-1 text-xs rounded">
              FLAT 60% OFF
            </span>
            <span className="bg-gray-100 text-black px-3 py-1 text-xs rounded font-medium">
              BEST SELLERS ⚡
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Promo Carousel - Mobile */}
        <div className="w-[100vw] max-w-7xl mx-auto pt-10 px-4 rounded-md md:rounded-xl">
          <LandscapeCarousel items={promoBanners} />
        </div>
        <div className="max-w-7xl mx-auto px-4">
          {/* Trending */}
          <div className="flex justify-between mt-10 items-center">
            <h2 className="font-bold text-xl lg:text-2xl underline underline-offset-4 decoration-4">
              New Arrivals
            </h2>
            <Link
              to="#"
              className="text-sm font-bold underline decoration-2 underline-offset-4"
            >
              Shop now
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-between mt-10 items-center">
            <h2 className="font-bold text-xl lg:text-2xl underline underline-offset-4 decoration-4">
              TRENDING PRODUCTS
            </h2>
            <Link
              to="#"
              className="text-sm font-bold underline decoration-2 underline-offset-4"
            >
              Shop now
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="relative w-full md:h-[350px] overflow-hidden">
            <video
              src={sportvid}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight text-center">
                ⚡ SALE — UP TO 50% OFF ⚡
              </h2>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="py-10">
            <div className="flex gap-4 mb-8">
              {["men", "women"].map((cat) => (
                <button
                key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-semibold ${activeCategory === cat
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                    }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Category Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          <Link to={"#"} className="flex justify-center">
            <button className="px-4 py-2 bg-black text-white font-semibold text-xl hover:shadow-lg">
              View All
            </button>
          </Link>
        </div>
      </section>
      {/* big banner */}
      <div className="max-w-7xl mx-auto hover:shadow-lg lg:mt-10 transition cursor-pointer lg:p-0 px-4">
        <video
          src="https://m.media-amazon.com/images/I/D1WvQSHwzHL.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 border border-gray-200"
          />
      </div>
      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">
          Hear from Our Community
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-10">
          Real people. Real stories. Designed to move with your life.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Reliable product, consistently delivers.",
              text: "Beautifully made and incredibly soft. My go-to for yoga and travel days.",
              name: "Anaya Verma",
            },
            {
              quote: "Excellent product, A+ customer service.",
              text: "These leggings are perfection - supportive, breathable, and stylish.",
              name: "Ritika Joshi",
            },
            {
              quote: "Impressive quality, durable and reliable.",
              text: "I wear their tees everywhere - gym, coffee runs, even brunch.",
              name: "Reema Ghurde",
            },
          ].map((review, i) => (
            <div
            key={i}
              className="border rounded-lg p-6 shadow-sm hover:shadow-lg hover:translate-y-1 hover:scale-102 transition bg-white"
            >
              <div className="">
                <div className="bg-black text-white py-1 px-3.5 rounded-full text-4xl inline-block">
                  ❝
                </div>
                <p className="font-semibold text-lg italic mt-4">
                  “{review.quote}”
                </p>
              </div>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {review.text}
              </p>
              <p className="mt-4 font-medium">- {review.name}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl w-full my-10 mx-auto">
        <ShopTheLookCarousel />
      </section>
            <ComingSoon />
      {/* Promo & Availability Section */}
      <section className="max-w-7xl mx-auto lg:px-6 pt-12">
        {/* Discount Banner */}
        <div className="bg-[#fdf9f3] px-4 lg:px-0 border border-dashed border-red-400 text-center py-4 rounded-md mb-10">
          <p className="lg:text-lg text-sm">
            Super discount for your{" "}
            <span className="font-semibold text-red-500">first purchase.</span>{" "}
            <span className="inline-block mx-2 px-3 py-1 border-2 border-dashed border-red-400 text-red-500 font-bold rounded">
              FREE15FIRST
            </span>
            Use discount code in checkout!
          </p>
        </div>

        {/* Available On */}
        <div className="text-center lg:px-4 pt-10 lg:pb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 underline underline-offset-4">
            WE ARE AVAILABLE ON
          </h2>

          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-8 md:gap-12 lg:gap-16 w-full  mx-auto">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <img
              src="https://images.ctfassets.net/drk57q8lctrm/4QgGDTtQYDx6oDaW3aU7KS/34163f3bef6d82fd354a7455d07102eb/flipkart-logo.webp"
              alt="Flipkart"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <img
              src="https://www.corecommunique.com/wp-content/uploads/2017/07/Shopclues-new.png"
              alt="ShopClues"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <img
              src="https://vectorseek.com/wp-content/uploads/2025/05/Meesho-Logo-PNG-SVG-Vector.png"
              alt="Meesho"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

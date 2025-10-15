import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../Product/Product";
import CategoryCarousel from "./CategoryCarousel";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";
import HorizontalScrollCarousel from "../Banner&Carousels/HorizontalScrollCarousel";
import ComingSoon from "./ComingSoon";
import VideoClassSection from "./VideoClassSection";
import RecommendedProducts from "./RecommendedProducts";
import { PromotionCard, DealsOfTheDay } from "../Banner&Carousels/DealsOfTheDay";
import { CreditCard, RotateCcw, Users } from "lucide-react";

import FestiveDealsGrid from "../Decath/FestiveDealsGrid";
import SportsGearCarousel from "../Decath/SportsGearCarousel";
import PopularProductsCarousel from "../Decath/PopularProductsCarousel";
import TrustBadges from "../Decath/TrustBadges";
import CategoryGrid from "../Decath/CategoryGrid";
import FeatureSection from "../Decath/FeatureSection";
import ProductCarouselWithTitle from "../Decath/ProductCarouselWithTitle";

import AnimatedSection from "./AnimatedSection";

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

import diwali from "../../assets/diwalisale.png";
import ad3 from "../../assets/ad3.gif"
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

// =========================== Decath ====================
// Category Icon Grid Data
const quickShopCategories = [
  {
    name: "Winter Ready",
    image: "https://contents.mediadecathlon.com/s1318893/k$10e1b2631d9392ac0c414f9529e66fc0/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Activewear",
    image: "https://contents.mediadecathlon.com/s1318896/k$ac1ebae01ccd2adad632994521dde9c1/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Gym & Fitness",
    image: "https://contents.mediadecathlon.com/s1318889/k$64a501c92ec5a09af3879d137cfa9838/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Cycling",
    image: "https://contents.mediadecathlon.com/s1318887/k$554243825861b4e5cb1795d22fcb8b4d/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Hiking & Trekking",
    image: "https://contents.mediadecathlon.com/s1318894/k$a2a185195aa4660e82cf93cc6bce5b3c/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Shoes",
    image: "https://contents.mediadecathlon.com/s1318888/k$d8e9711487d15abdec686d134ae16c3a/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Bags & Backpacks",
    image: "https://contents.mediadecathlon.com/s1318891/k$33f8a93089cbb9c811bfa0a6efb75854/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Sports Accessories",
    image: "https://contents.mediadecathlon.com/s1318892/k$b383427f1f891521845cc2b97d3f173f/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
];

// Festive Deals Data
const festiveStealDeals = [
  {
    name: "Football",
    image: "https://contents.mediadecathlon.com/s1319483/k$b4abe5ea14746c50c0739b6010322a5b/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Trousers",
    image: "https://contents.mediadecathlon.com/s1319066/k$428f371999e70d077067efbeae104798/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Wildlife",
    image: "https://contents.mediadecathlon.com/s1320148/k$bf8b43685f55ad4a603bd71faff0ef56/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Fitness Apparel",
    image: "https://contents.mediadecathlon.com/s1319061/k$53608864e3480fa7dfaaae3a98fcfaf7/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
];

// Sports Gear Carousel Data
const sportsGearItems = [
  {
    name: "Golf",
    image: "https://contents.mediadecathlon.com/s1267993/k$8b58683f96329919bdca6df83fc5e732/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Cricket Trousers",
    image: "https://contents.mediadecathlon.com/s1267992/k$20eaacfa56e12dd83db1655dea64f70b/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Tennis",
    image: "https://contents.mediadecathlon.com/s1267991/k$8e9c5f4a3b2d1e7f6a8c9b0d5e4f3a2b/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Basketball",
    image: "https://contents.mediadecathlon.com/s1267990/k$7d8e9f5a4b3c2d1e0f9a8b7c6d5e4f3a/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
];

// Popular Products Data
const popularProducts = [
  {
    brand: "QUECHUA",
    name: "10L hiking backpack NH100 Arpenaz - green print",
    image: "https://contents.mediadecathlon.com/p2629822/c6a44c466bbb37fc0a2ab4304b53834b/p2629822.jpg?format=auto&quality=70&f=256x0",
    price: "₹ 299",
    originalPrice: "₹ 999",
    discount: "70% Off",
    rating: "4.8",
    reviews: "13k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#"
  },
  {
    brand: "DECATHLON",
    name: "KIPRUN 100 Dry Men's Running Breathable T-shirt - Blue",
    image: "https://contents.mediadecathlon.com/p2646534/ed0e677836d3b5bc2718e2e89c454ba6/p2646534.jpg?format=auto&quality=70&f=256x0",
    price: "₹ 249",
    originalPrice: "₹ 499",
    discount: "50% Off",
    rating: "4.69",
    reviews: "24k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#"
  },
  {
    brand: "QUECHUA",
    name: "Women Comfort Fit Pant with Wide Waistband Black - NH100",
    image: "https://contents.mediadecathlon.com/p1745252/6a212c9d6a86a00e6e1d89f7823a7a75/p1745252.jpg?format=auto&quality=70&f=256x0",
    price: "₹ 699",
    originalPrice: "₹ 1,499",
    discount: "53% Off",
    rating: "4.69",
    reviews: "8.0k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#"
  },
  {
    brand: "BTWIN",
    name: "Mountain Bike Rockrider 1 Speed V-Brakes 26\" Wheels Steel Frame ST20 HF - Green",
    image: "https://contents.mediadecathlon.com/p2881867/e3a057dfa7c0c11458afad476c5b166b/p2881867.jpg?format=auto&quality=70&f=256x0",
    price: "₹ 7,999",
    originalPrice: "₹ 11,999",
    discount: "33% Off",
    rating: "4.03",
    reviews: "408",
    link: "#"
  },
  {
    brand: "KALENJI",
    name: "RUN ACTIVE Lightweight Cushioned Men Running Shoes UPTO 10 km/wk - Black Orange",
    image: "https://contents.mediadecathlon.com/p2717165/18b24508e659e92ce7437d9145e95535/p2717165.jpg?format=auto&quality=70&f=256x0",
    price: "₹ 2,299",
    originalPrice: "₹ 2,999",
    discount: "23% Off",
    rating: "4.54",
    reviews: "14k",
    link: "#"
  },
  {
    brand: "SOLOGNAC",
    name: "Men Breathable Lightweight Cargo Trousers Pants SG-500 - Grey",
    image: "https://contents.mediadecathlon.com/p2584885/f6a38bfdadc7827bc3fc2eb6fa51ddb9/p2584885.jpg?format=auto&quality=70&f=256x0",
    price: "₹ 1,999",
    originalPrice: "₹ 3,499",
    discount: "42% Off",
    rating: "4.76",
    reviews: "2.8k",
    link: "#"
  }
];


const mainBanners = [
  {
    id: 1,
    image: diwali,
    title: "Fashion Sale",
    Subtitle: "banner",
  },
  // {
  //   id: 2,
  //   image: bigbanner,
  //   title: "New Collection",
  // },
  // {
  //   id: 3,
  //   image:
  //     "https://media.wellmed.workers.dev/?file=JFLESTCQJZTUUNLHLFNGCSSNGTEY4&mode=inline",
  //   title: "Winter Favorites",
  // },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("men");
  const currentProducts =
    activeCategory === "men" ? menProducts : womenProducts;

  return (
    <main className="w-full bg-white pb-20 md:pb-0 ">
      {/* Banner */}
      <div className="w-full mx-auto mt-[60px] lg:mt-[80px] p-5 lg:p-10 rounded-2xl">
        <LandscapeCarousel items={mainBanners} />
      </div>
      <CategoryGrid
        // title="Shop by Category"
        // subtitle="Find Your Perfect Gear"
        categories={quickShopCategories}
      />

      {/* Festive Steal Deals Grid */}
      <FestiveDealsGrid title="Festive Steal Deals!" items={festiveStealDeals} />

      {/* Sports Gear Carousel */}
      <SportsGearCarousel title="Unite & Play: Shop Sports Gear" items={sportsGearItems} />

      {/* Popular Products Carousel */}
      <PopularProductsCarousel title="Most Popular Products" products={popularProducts} />

      {/* Trust Badges */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 my-12">
        <TrustBadges
          title="Our Promise"
          badges={[
            { icon: CreditCard, text: "No Cost EMI Available", link: "#" },
            { icon: RotateCcw, text: "Easy Returns*", link: "#" },
            { icon: Users, text: "1 million+ Happy Customers", link: "#" }
          ]}
        />
      </AnimatedSection>

      {/* Category Grid Section */}
      <AnimatedSection>
        <CategoryGrid
          title="Shop by Category"
          subtitle="Find Your Perfect Gear"
          categories={[
            { name: "T-Shirts", image: tshirts, link: "/categories?category=tshirts" },
            { name: "Jackets", image: jacket, link: "/categories?category=jackets" },
            { name: "Compression", image: compression, link: "/categories?category=compression" },
            { name: "Footwear", image: footwear, link: "/categories?category=footwear" },
            { name: "Gloves", image: gloves, link: "/categories?category=gloves" },
            { name: "Running", image: running, link: "/categories?category=running" },
            { name: "Yoga", image: yoga, link: "/categories?category=yoga" },
            { name: "Tops", image: tops, link: "/categories?category=tops" }
          ]}
          columns="grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
          className="my-12"
        />
      </AnimatedSection>

      {/* Product Carousel with Title - Cycles Collection */}
      <AnimatedSection>
        <ProductCarouselWithTitle
          title="The perfect cycle is waiting"
          subtitle="Pick yours now!"
          products={[
            {
              id: 1,
              brand: "ROCKRIDER",
              name: "Mountain Bike Rockrider 8 Speed Disc Brakes 27.5\" Wheels 80mm Suspension Steel Frame EXPL40 - Green",
              image: "https://contents.mediadecathlon.com/p3001635/77154d1afb06b4f0d47435a6aadd5342/p3001635.jpg?format=auto&quality=70&f=256x0",
              images: [
                "https://contents.mediadecathlon.com/p3001635/77154d1afb06b4f0d47435a6aadd5342/p3001635.jpg?format=auto&quality=70&f=256x0"
              ],
              price: "₹ 16,999",
              originalPrice: "₹ 24,999",
              discount: "32% Off",
              rating: "5.0",
              badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/new.png",
              badgeAlt: "new",
              link: "#"
            },
            {
              id: 2,
              brand: "TRIBAN",
              name: "Road Bike Triban 7 Speed Caliper Brakes 700C Aluminium Frame RC100 DB - White",
              image: "https://contents.mediadecathlon.com/p2594637/b7c5bcc0ad67ebf52df869bea2a56f31/p2594637.jpg?format=auto&quality=70&f=256x0",
              images: [
                "https://contents.mediadecathlon.com/p2594637/b7c5bcc0ad67ebf52df869bea2a56f31/p2594637.jpg?format=auto&quality=70&f=256x0"
              ],
              price: "₹ 25,999",
              originalPrice: "₹ 39,999",
              discount: "35% Off",
              rating: "4.4",
              badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
              badgeAlt: "priceDrop",
              link: "#"
            },
            {
              id: 3,
              brand: "RIVERSIDE",
              name: "Hybrid Bike 9 Speed Disc Brakes 28\" Wheels 63mm Suspension Aluminium Frame Riverside 500 - Navy",
              image: "https://contents.mediadecathlon.com/p2277243/fec2153f697f6975eb0a65cf22d487b8/p2277243.jpg?format=auto&quality=70&f=256x0",
              images: [
                "https://contents.mediadecathlon.com/p2277243/fec2153f697f6975eb0a65cf22d487b8/p2277243.jpg?format=auto&quality=70&f=256x0"
              ],
              price: "₹ 19,999",
              originalPrice: "₹ 39,999",
              discount: "50% Off",
              rating: "3.7",
              badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
              badgeAlt: "priceDrop",
              link: "#"
            },
            {
              id: 4,
              brand: "BTWIN",
              name: "Mountain Bike Rockrider 1 Speed V-Brakes 26\" Wheels Steel Frame ST20 HF - Green",
              image: "https://contents.mediadecathlon.com/p2881867/e3a057dfa7c0c11458afad476c5b166b/p2881867.jpg?format=auto&quality=70&f=256x0",
              images: [
                "https://contents.mediadecathlon.com/p2881867/e3a057dfa7c0c11458afad476c5b166b/p2881867.jpg?format=auto&quality=70&f=256x0"
              ],
              price: "₹ 7,499",
              originalPrice: "₹ 11,999",
              discount: "37% Off",
              rating: "4.0",
              link: "#"
            },
            {
              id: 5,
              brand: "RIVERSIDE",
              name: "Hybrid Bike 8 Speed V-Brakes 28\" Wheels Steel Frame Riverside 120 - Charcoal",
              image: "https://contents.mediadecathlon.com/p1670555/ac8a7f35f2c32fe8ffd847e6f5f14274/p1670555.jpg?format=auto&quality=70&f=256x0",
              images: [
                "https://contents.mediadecathlon.com/p1670555/ac8a7f35f2c32fe8ffd847e6f5f14274/p1670555.jpg?format=auto&quality=70&f=256x0"
              ],
              price: "₹ 13,999",
              originalPrice: "₹ 21,999",
              discount: "36% Off",
              rating: "4.2",
              badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
              badgeAlt: "priceDrop",
              link: "#"
            }
          ]}
        />
      </AnimatedSection>

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
        {/* <div className="w-[100vw] max-w-7xl mx-auto pt-10 px-4 rounded-md md:rounded-xl">
          <LandscapeCarousel items={promoBanners} />
        </div> */}
        <div className="w-[100vw] max-w-7xl mx-auto pt-10 px-4 rounded-md md:rounded-xl">
          <img src={ad3} alt="Promotional Banner" className="w-full rounded-md md:rounded-xl" />
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

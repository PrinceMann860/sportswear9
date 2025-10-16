import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../Product/Product";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";
import HorizontalScrollCarousel from "../Banner&Carousels/HorizontalScrollCarousel";
import RecommendedProducts from "./RecommendedProducts";
import { DealsOfTheDay } from "../Banner&Carousels/DealsOfTheDay";
import { CreditCard, RotateCcw, Users } from "lucide-react";

import FestiveDealsGrid from "../Decath/FestiveDealsGrid";
import SportsGearCarousel from "../Decath/SportsGearCarousel";
import PopularProductsCarousel from "../Decath/PopularProductsCarousel";
import TrustBadges from "../Decath/TrustBadges";
import CategoryGrid from "../Decath/CategoryGrid";
import ProductCarouselWithTitle from "../Decath/ProductCarouselWithTitle";
import AnimatedSection from "./AnimatedSection";
// brand logos
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
import sportvid from "../../assets/sportvid.mp4";
import bigbanner from "../../assets/Bigbanner.png";
import ShopTheLookCarousel from "../Banner&Carousels/ShopTheLookCarousel";

import diwali from "../../assets/diwalisale.png";
import ad3 from "../../assets/ad3.gif";
import CategoryCarousel from "./CategoryCarousel";
import VideoGrid from "./VideoGrid";
import SportsCategorySection from "./SportsCategorysection";
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
    image:
      "https://yardofdeals.com/cdn/shop/products/2018-New-Summer-style-Mens-cotton-Short-sleeve-t-shirt-Gyms-Fitness-shirts-male-casual-fashion.jpg_640x640_1024x1024_2x_6fcb8ce1-9502-4084-b154-08501d78e41a_1200x1200.jpg?v=1597908790", // Dark background for contrast
    deal: "MIN. 40% OFF",
    look: "Laidback Looks",
    logo: logo1,
  },
  {
    image:
      "https://www.powerhousegymproshop.com/cdn/shop/files/powerhouse-gym-pro-shop-premium-oversized-hoodie-charcoal-34264387911851.jpg?v=1687997189&width=1445", // Green background
    deal: "FLAT 30% OFF",
    look: "Seasonal Essentials",
    logo: "https://placehold.co/100x40/ffffff/10b981?text=Brand+B+Logo",
  },
  {
    image:
      "https://bullarfitness.com/cdn/shop/files/Accessories.jpg?v=1740035011&width=1100", // Purple background
    deal: "BUY 1 GET 1 FREE",
    look: "Premium Collections",
    logo: "https://placehold.co/100x40/ffffff/f97316?text=Brand+C+Logo",
  },
  {
    image:
      "https://www.verywellfit.com/thmb/Eyv2XS6jfnBy9nSnCLHe_9A71TU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vwt-product-reebok-nano-x2-training-shoes-tstaples-133-e73e0a61fe50493daf72e839cd53dfdf.jpg", // Orange background
    deal: "UP TO 70% OFF",
    look: "Footwear & Accessories",
    logo: "https://placehold.co/100x40/ffffff/5b21b6?text=Brand+D+Logo",
  },
  {
    image:
      "https://www.fitlineindia.com/cdn/shop/files/WhatsApp_Image_2022-05-19_at_5.53.38_PM.jpg?v=1653037917&width=1500", // Deep Purple background
    deal: "EXTRA 20% OFF",
    look: "Clearance Event",
    logo: "https://placehold.co/100x40/ffffff/6d28d9?text=Brand+E+Logo",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDU7OcmNBhqYI7DCu3wOmtEOCwyTOzhknEU490QpBwnI4ngrWe1kzpwyy06N33fyeQkRo&usqp=CAU", // Emerald Green background
    deal: "NEW COLORS",
    look: "Comfort Collection",
    logo: "https://placehold.co/100x40/ffffff/059669?text=Brand+F+Logo",
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

const quickShopCategories = [
  {
    name: "Winter Ready",
    image:
      "https://contents.mediadecathlon.com/s1318893/k$10e1b2631d9392ac0c414f9529e66fc0/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Activewear",
    image:
      "https://contents.mediadecathlon.com/s1318896/k$ac1ebae01ccd2adad632994521dde9c1/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Gym & Fitness",
    image:
      "https://contents.mediadecathlon.com/s1318889/k$64a501c92ec5a09af3879d137cfa9838/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Cycling",
    image:
      "https://contents.mediadecathlon.com/s1318887/k$554243825861b4e5cb1795d22fcb8b4d/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Hiking & Trekking",
    image:
      "https://contents.mediadecathlon.com/s1318894/k$a2a185195aa4660e82cf93cc6bce5b3c/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Shoes",
    image:
      "https://contents.mediadecathlon.com/s1318888/k$d8e9711487d15abdec686d134ae16c3a/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Bags & Backpacks",
    image:
      "https://contents.mediadecathlon.com/s1318891/k$33f8a93089cbb9c811bfa0a6efb75854/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
  {
    name: "Sports Accessories",
    image:
      "https://contents.mediadecathlon.com/s1318892/k$b383427f1f891521845cc2b97d3f173f/defaut.jpg?format=auto&quality=70&f=384x0",
    link: "#",
  },
];

// Festive Deals Data
const festiveStealDeals = [
  {
    name: "Football",
    image:
      "https://contents.mediadecathlon.com/s1319483/k$b4abe5ea14746c50c0739b6010322a5b/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Trousers",
    image:
      "https://contents.mediadecathlon.com/s1319066/k$428f371999e70d077067efbeae104798/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Wildlife",
    image:
      "https://contents.mediadecathlon.com/s1320148/k$bf8b43685f55ad4a603bd71faff0ef56/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
  {
    name: "Fitness Apparel",
    image:
      "https://contents.mediadecathlon.com/s1319061/k$53608864e3480fa7dfaaae3a98fcfaf7/defaut.jpg?format=auto&quality=70&f=768x0",
    link: "#",
  },
];

const belowcategories = [
  {
    name: "T-Shirts",
    image:
      "data:image/jpeg;base64,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",
    link: "/categories?category=tshirts",
  },
  {
    name: "Jackets",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLEnOjUQrhGIs5K9g9C575tPAQAZizbN7LBw&s",
    link: "/categories?category=jackets",
  },
  {
    name: "Trouser",
    image:
      "data:image/jpeg;base64,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",
    link: "/categories?category=trouser",
  },
  {
    name: "Footwear",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8q8m8Fs3DN9TG_1jmbSjeAuQcCLm-eNwiHg&s",
    link: "/categories?category=footwear",
  },
  {
    name: "Gloves",
    image:
      "data:image/jpeg;base64,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",
    link: "/categories?category=gloves",
  },
  {
    name: "Running",
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSExIWFRUVFxcVGBgWFRUWFRUVFRcWFhUXFRgYHSggGBolGxYVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi8mHyUtLS0tLS0tLS0wLS0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIARMAtwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAIDBAYBB//EAEwQAAEDAQQFCAYHBAkCBwAAAAEAAhEDBBIhMQVBUWFxBhMiMoGRobEjQnLB0fAUJFJic7LhMzWDkhUlNFOCorPC8UPSFkVjhKO0w//EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACQRAAICAgICAwADAQAAAAAAAAABAhEDIRIxBEEiMlFhcfBS/9oADAMBAAIRAxEAPwAbR0w91NtnqAktc24/cCJa7gBmrdClNMjZaqn+5DLZZyad6TelrZGZvNLgTtcIidevHEkNBVDUpCesbQSeJbj71SXaZLfTQK5NsbcIMTePgjL6LdSzdhpQ9+OIc4dxKM87gkUTgQu84q3O71w1EmMMaMszas3qrKcfaOJ4ao7VzSlmbSi7VZUkxDDiN51R2oPzqa6upp32Mt84mOeqnPJprpgWXVFA+ooXV1E+uEAPqVEM0haWtEn9SdgT7XbWtEk/ruCy9ttZqOvHAahsCBNlS2WsvcSdfzAVQFGtGaLLiHP7B8fgpDZmfZb3BFioAE9iUo6bHT+wE02Gn9nxKLCgLJW4pt+q/wAnmFnzYaezxK2VezBtjEbKfmEhoz4UtnHSHFMT7P1hxSQyxWGJ4pLtfM8UkxmmqVDzDCDBvUDOw83Ux8FSo1+YtLKhlrHO6QGTXAw4RrjUdhG1SsM2Vn/t/wAtYe5RVKZrte3X0Y3Oypnt6h4s2LWa22c8JKkmDrQ13O1HNOF9w8SnttLtqpUaxAIOGPjgD5JGqkaIIfSinC1lCzady6LSkMK/S0x1pQw11znkUAQNoCYa6o88mmqgdlx9ZVLXawwSc9Q1lUrTpIDBuJ26h8ULqVS4yTJSCx9prueZJ4DUOCgLU5cSEa2wswHAIW4YlGNHjot4DyQuq3E8SpKISFxSQmkIEMIW0tzfqI9mn/tWOC2dt/sDfYp+bUAZSE6h1hxXCu0esOKBlqtmeK6lX6x4pJjDVDGyDc2zedcKfksA6u5juq4NaRxJCqWI/VOyh4Oq/FWeT806zqhwBLQN5vfqun2zjfUTN8oxcrRtYxx9pzZce0yhnPlE+Wgi0D8NnhI9yBgrCzoXRa55LnVXCcEWMn5xdvKEFSMKVgSAEqnWpPd6wjYiVNQkIsYN+hO3Lhsb9niiSXz84IED6VhedUbzkrLLMxufSOwYBWA5McgZoLC3BvAeSE1x0ncT5o3o8dFvAeSDWgdJ3E+akZAQmp5CaQgQwLaWn+wD8On5tWMhbO0/u8fh0/NqEBlClR6w4hcJSpHpDiEDLtoHSPFJdtPWPFJMoJWA/Uj7NLwqOHvRZrelO9h/zBCtHD6k72G+Ff8AVLQ9oc6vVvGYA7g8LpT2zja0gZy1H1gex5PeECAR/lsPTj2XeFWqEBC532dEehwCeANia0J4UlETk9iY5PpoAtUk1wT7O0kgASSQANpOQRPlXydrWNjCXC8RLgIMcEBVgYj5+SmkIYbZUGMyr9GsHNDhrTEOXCUiuFAGr0cOgz2W+SC2gdJ3tHzKOaM6jPZb5ILah03e07zKGMrFMKkKY5IBi2Nb93j8On+Zqx5Wwqfu8fhs/M1NCMmUqXWHEJJU+sOIQMIWnrFJK0HpFJBQR0SZsbh9w+FdnxUGhD6at7JP+YKXQONld+HU8K1H4qvoU+lrfhuPcQuhfZnI/qhnLkenHCp4V6yzwWj5dj0rT+L/AK9Q+9ZwLF9m0eh4KcEwJwUlDHZp9NRk4qSmgDQcj6LnWqldZzjmkvDdUtEyeGeYyC13LzR4e+mL3pHua0tBLm4kbcs1nOQNu5u1NbMCpDSQG3oBm6HO6oMY6zACucoqJdWEPN4kuO1sOIHgFzZ5cWd3jQ5IzHKnRLKThda4AtBgmXDOL2wkYkavABtGNhp2XsPJablJRAaG4mRJJJJJ2mdeKBU2w0DcjxZuSF52NQnpCcfn5KaSkSmkrqOE1+iv2bPZb5IPa+u/2neZRbRLvRs9keSFW39o/wBp3mUmhorOTCnlRlIY0rYu/d/8Nv5gscVsT+7/AOG3zCaEZFJmY4pJNzHFAwhXzKSfXGK4gou8nP7O/wDDq/6lE+5V9Cj09UbaT/Jqm5MfsKnsVv8A8yqGiD9Yf+G/8oXQu2cj+qL/AC6oE1GQP7z88+9ZjmXbPJbzlFZhUc2SRBdlGu4dY3oG/RjPtO/y/BZ8bNE6Rnww7FxrxtHeEStlmDCIJMznGqNg3rPGu4a1MlRcdl455jvCkZG0IUazjrXWlTZXEOUrWGOa4OgtIII1EGQVpeTNoNqtJa4l73AunbGcntGSwtFkkce1encl7ILGWvaBeEXycb2RLdwHnioyxjOGzfx3KM/iaSjZKVlPOVqYc9wAptwcWjWTORMgazgUJ07oz6YwvNnZSAyJIFQ8CBluKJ8qrSKr2VKbsLjTwIJw4oJbLe9wAB7PguR1DS9HbvJ8pezz632bm3EAyFUKMaTsri+I1+OtRaZ0Q+iA6OsJABns3Hct8eZdSOTL47249BnRH7NnshDLb+0f7TvNXtBVJpMOWCo2/wDaP9orpkjkRWco3J7kxykY0rZf+X/wx5rGStlTP9X/AMP3pxEZJJuY4pFJuY4oGE6/WKSVo6xSSLLHJc+gqexX/wBNp9yr6Ju/SiLpxY6SfZ1BS8kz6J42isP/AISfcq2iQRa7xBDekLxwbMZTlrC6F2zkf1RptKnFvb/p0D71mtMW91IiMjnhjnGC0OkDIafnGhZCgGkaIe8NORY7zaiPRTB1ptwc0PADoMEYjOJnYqFWxseehLXZ3HH8p1pWizuawsJIIeII1i6fBVGPvCCThkcoO5Dp2mCtVRDUplpgiCrjdHVebFUUyWOJAcMZLetgMcNqdTrXwWv6URB9b9Vq7LzZsNG40B7XObfDXs6UyZdlUcW3coIjcuPNLgrR3+NjWWfFg3R2jaf0mzXSXUqlSmJOc9EuywxnD9FvbdQNBzmO1Yg/aacis8y01bQ0Ehoq03Mc1xF286m+8L5G6RK0/LehUqNpPLAGNaIcCCbzhiIBkwMdmtcqyto7pYFCWun/AJ/7+TK6Z03DbjM0zk7bX0zeqdNrtcYt4KrU0ddOOLj3xw1BSU6wa0jYok2NLYbuNDjUaQ4HI8diG6Ss5c0XMZzxwlZi0aSqUgXMdBnLMHEakc0VpBzrLecACS7btj3J8JJchLJFtx9lex20U3XCejMeyfgmW8+kf7RQlwJnWXGAiFVl03SZIwk64Ga7cTbjTPNzpKVojKYU4phWhiNK2FE/1f8Awz+YrHFa+gfqH8M/mKcRMyyTcxxXEgcUigraOsezySSrZ93kkkWO5IdQj71T/wCvU+CHWm/UeGNcbzb1wT0SCSXNjUTjxRLkVjI+8/xo1Ah7mVXEvoMdfZi6G3iBtOBgLfi23Ry2klZa0dpa8ObfhdJmes03WMjH1QKbRuUlc+lb7LvNqB0dHWgu5x0tvYhxiLxEidxAKdU0nUaQCwAtEZRBmTjvnwCFKhtWXdJAGJE461mnOhxjKThqzRypbG1AIz1jWgNY9J3E+ZU5P1FY9dkjH/Z/lPuKvWPSL2dVxAmS04iYiS3bGsYoK9ymFec+8ZhZuNrZqpuLtGnoaefk5rY+7geIkmeGC9g0DpKnaLPSrCCbuR1EYOHeF4BSeeO8a+zatlyR0oHUatmdUNMD0gO4wx44Yg965suGMVyijrxeROcuM3YV5Q2imax5qI9ct6rnfdjIcMPFZ23YStHbNA1LPZ3VahAMgNaMSQde5ZK3VcIXNds7VpWBtJPAABnE+A+QtO6iaNlYx2DrokbCcSPGEI0VRY+q19RwAZkD6zsx3RPcrGndISSScB3ldEldRRxwdcpv+haHo36l85Ny4qe2n0juKWg6s02nb8SmWw9N3H3LtUOMEjz3PnNshcmFOKYVIxpWus5+ofwz5lZErU2Z/wBRI+47zKqK7EzNSujNNBSCgsMVc+7ySSf8EkiyTkMOmW7Hgd7KgTdF2+pRrDm3XXPgTqOGAcNY+Kq6O0k+hVBuhpBBunqvAmDPae9Kzma9JwwxAIXQlbs5G6VFnSmkHB/Sp83JDi31HGCLzdmZ3KrVtLC4OJht0jHaSMN60Wm2tdRZeaDApDEaptYMHMYtHcsSwgzzeI1sdnG7aEcv0fFeiarSomHNNwzEwbsxOI1DgqFqscnU1xx+47eCrjGB8NBiDOOqQBh3eKhe8t6N2G/Zdnx3Hh4pSXspMGCzZh0tM6xgBtVynZ5YcMBIaCQC4iC533oGzdshTtqtGDm3mnVrHAqyKVF/VeBqh4IIGQDXDqgcMdcqUgk2B2UrpwOZ7so4o9oCqGWugagEGo1pOpwcbsOHaO5V3aFdhdcx2OYqNxGYME4HcoGc8HSegwdO8ReLQCQ0jCb0g5bFXG4ST9hyqUWvR6Tyz09SLxRc0ua2bxmAHkS1u1xg5DKROULLWO0NdSeXUWAF11l9jHE4EmQ4EmBGe1BLZpEuvy9zQZPVa17pMnEuLsTujHJWKNpaRFMyALjRra2ekTPrOPmVxzwQxxVbZ6OHyJZJO9L8ItNBjoLAGXW+qAG7ZujAZygForFxmTGQ/VXdJ2iOiMznu3Ifdw4rTEnWznztctGm0I/0beHvUlq65+dSr6HPo2/OsqW0HpH51Lqmvijjxv5MYUwpxTCsjYa5aOzO+pkfdd5lZty0Vm/sZ9l3mU4+xS9AFJuYXAutzCgoMP8AgkuOSUmhDydsgtAdSecJpBv3C990kbsclVtFN9ExN4A4OHWbsR7klTDXn2qJ7qrVDVotNYkjJ5B3gHEEbM1ur5aOZuo7GDSLqtAsi8RdgjPomsekNs1fBZI03NBDgQcN2sZLSaS0YKVM2im8tAJBb/EuCD3ZqrQ020iKrG1B3FVa6Jp9oHXiWXzneDQRnkSZ26lPT0mQLtRgqN3jEcCiQfYHiPSUsZwgiYhL+i7E7q2sj2mfBHH8Dl+ooc7ZHZiozgQ4Y4a1DVoWcno13D2mDxgou3QFLG7a6TpEYyCN/gqNbk0/1atJ3B4Saf4Ckv0g+h0tVdna1wV1jGXA3nLxym8BA2MxBCo0uTdoDhLQ5uu64FdtOhaom7Z38ZEDsknxTSa3Q271ZVtOineoBHtA+IVN9hqDNhU1SyVm503DsKiNSoPVeO8e5Qykyu6zu+yU5wIIwyjMYbVJ9OO1y660EgyD3R4qdFbC+jHejHb5lEeUVJrLQ5rMG3aZGM9akxx8SUzQGgq9WiHUmioBndcLwmSJbmm6eeRVl7Sw3aTIdneZTYw95bPatZ/VGMF8mUpTSulcWdGw0rTWVv1M+w7zKzcLes0WHaMbVbgRTfeG0BzseKa1YnswqQzCRXBmFmWGqnwXEqiSk0DuhLC6m95MRDDg4HKow6ihdss7zXq3Wkw+oMNznIazlLXkkvkkR0mg4SD7gu0+UD77nlrSXOc49YYuknI71vxldmDlF6DGlLI82O6Wm84PddjHCrT+M9q89YVsKunnOpllwh0khweTEvpOwET/ANIa/WKzTtHOkkHPcUJSJdeiTRQDnsBjF0YmMSIEnjipHkgkScDtVf6G4CPj8EU0pVDy1w1saXCMql1ofnni1DCKKTiePFV6TXETfOZHcVZFOdSY9kMdGBBOW3MZqXItRoiNeo0xfKt/SbQ3/qHvVC0TJ7I7tav3xAJwBj5CzlOSqjSEIyuzjtL2hubz2zHeus0xVJAgOJyEAk8FS0g8mAMomPPtyULbU/rTjgARmA2MBuy7lrGUq2ZSjG9Bf+lyOtRb/KmVrWKokMDLsDDWTMz4IhPOUm124z0agHq1Pg4YjtGpVXQVzTzyacWjqh48U1JM5YtIVaTQaTrpBgkYHCCMRjP6qbSGh3c419Wuyo94D+tkXYwZ1oe4HEATMEDaR+hKNmnYW2YkuqNrmMBBGIkQDskD3rfG+UdnPlTjKkC3NIJBEEYLiq0p5zAuLYxLtvuVlUSdC9N0af6oP4NTzcvMgvTNHfuh34NTzch9DXZ5s5NGYXXJozHFQUG63wSXK/wSUGhl6gUd8q/Xska/BVnWbf4LYwZCKzgpG29w9bxUj7H0SZ8EMqDEosVBmjpWtqM8MVZbyhrDAgdrR8FU5Otul1SMuiOJGPh5ovbagfQdAPo6jHYmeuCDq3DvVW6JpN0Vf/ERPWpMP+AJzNN0T1qDDwBHkhhg8eBUlGgDF4and4g+Upc2PggmNJWQ50Y4OKk56xO9Vw/xArPvZngMHRjsjDLtXKbAZRz/AIDg/TDVpp2W6XNc6W4gGDis5W6xAEZwOOKs1GACVXq0nOx1ztHak3fQ0q7LmhreabiCYa8XX4SC2c41lpxHaitpoXTmDvaQWkaiDrCBWeyyZe4NA+80zGJ14ZKazW4hxvYtMmNhOOCxyY+W12dGHNx+L6LtVsp1SkHG88XjESSR5FcFupHORviURp2W83onGAeIIkEdhC53ygdKUJ/jA1em4dQE7gTP6qZuSnrNhRtM54HbqPHYtseb/o58mCvqRkrXaD0oWWOtScei+k+791+PgVkXiFqq2j4sNKs3JzHNfudedB7cl0qmcsrVUZmVwZhcSb71mahytq4BJNqlJSWV9L0rtWo3Y9w7iULeEZ0y685r/tsY7tLQHeIKDkyrizOSJmCWkbkBqDEo/ZUGtrIe4b02SFNFsljQImS7FzWg4kR0oxVyhZ6jRVkC45hBh7HYhwIPRcTnKFWfGkNxM9/6hR2BxD2js7wR702THsK0raAMGUxAiS1pJgZku2qsHTdO8f5uj71WJgwpGE3d4nvGShRUdo0cm9MhqDrgfddqzyKjpHEqzWZLjniCN3FVKWY4R89ybEmSuxB4KrcwmdXarIUVcERrzGGSYitUaBrxTWyTABJParDWU9bn9w+KnZWYxpuAz9oxOrDX7kAQtC0VoqF111FlQi5TEhpI6LGtMEDaCs4x4RGw6Uq0R0DhMwct8bENWJOi8bTVyfQc7fccD3wntsxqAlrHiMw5jhHbEI3orTN9gc4PBOoNqOy1y1sKe16b5sXm06rtsU3jDaS4KH48WarypLsyb7OcskcZyouWM2Xmr0MLC8ujpEkkhsapGtUK+m6NV0c05rjrEHH2Rj3IRRZeJmQXvxBBENb74BRhhJSafQ804SinHsmnGDndDv5pgeS63McU+2umpP3AP5Tn4hRszHFW1TohBioUkqiSzNBlodNCkfs32dzrw8HoFWabzoByBwwxBRWjUmk5v2XNcO0Fp8mobaHQdfSEYajqTi9EzWyfR16OlmqmlqXpOIUujyWuLcYwInfmirNHitUDSCZa6IzwjVrwlaVZldbANjrQCzUcRlmPnwVilzdOHuPOP6wa0kBpzBe7b90dpRWtyUqAFzQ6BiS5jgBvLogKbRehG84OeummHNFRzWvJbBJPSiBgMd2xVwZPJMD6UpRUdGRxHA4hR0BAgq9pq6al5vVM3dwa4gDuAQ6VDRaZKTF0zsHdh7lTfg7tVsno9/uPvKqV8UMEStCgtVTG7G/vxVpu3biqltbiDtHl/wAhDEQMbJUtWIABMe/51qIH5805mKAOt2fParQeDETkJ4648+1ViPnyVuzWSo4FzWEjEzu3bU0JhfRFBz2m7Xcy76oaDA1GZyRKno+sRItZP+Ex4OWaoVn03SCWGNkSOBzCsaPtlRj4Y4C+4SLoiSdQ1diqxB5mi7S0ki0zOctvDsDiYU2k+Tz6dkp1Q680ySdbX3jiRsJHuXW1Kn22fyn/ALlsqoP9FOn+6dll1iqToVWeU2pwc5jh6zXdhESO9NbmOKbRpkudMwCY/wAQbMdyku4jis59s1j0E3Li49cWRqUbI/Ej7TSO0QR5KG0vuwdU49qsWFrwC5rTGRIBJg5jcFBWxacY3q1BxSszlNSbor2Wo4PEmQ+e8FaOwWh1OpTe3ObuOu+C2PFZqla4Lb108MxqWgg83OzHux9ypMhmufyuaGc3VoPc4kzLBUploxbEHHpD4jNDNL8qqtU3aLRRYDMm6HZk4BuebsCR1iqdqtdKs27Srikc+k3wxVJtktrekx7KgB1XCDGvEBbcjKgfbqLhSYXEE3nY7Q7pY7MZVAYo1b3V30nc9SuXbpBAgO29qCNWUi4kgHRPZ7/iFWq8fFWWn3/H3KtUPzw/5SZQT0box1WmHNcNYgg6t/CFbo2N7Wmm+kKjXHU6C0xEiRnkucmbQWtqNGoh3aRA8QEa58iBA6JzgTAG3uVLol9mW0joAtxpknGLrhDgcNeR+c1TOjawH7IzI2bFtefJMlud3DefkJjqmBEYmTOO2Br4IpCtmTsWiKjj6T0bBi6c/nwWjoVbPg0XDAgQJMdgUPKGr6KACJdBxOMCVFyarsYHuddkkDExhHHJNaDst2yoAAadIOMwQaZyOvEKGhZmF7XOoRF4ktBDXCAGgtOAxJPYilO2S0QAcjIIxxAKm+lumboyIjCJERnulMRXNBhyoHbi2mPetGzSgNkFlFOCWFskiBjM3QMeCBC0YHBoBOwDBw+MoVbdO1wQJaBOBDmvOwnPDPWEMasfabDWJiJiMmkZjDMjf4ofUsrhBgxOcEa4+cVQ0ta6jnXnPce33Dt71VstrqBwF90HDPAgnEEa8/FQ2vwtJ/oerZpLlU4pLE2NLT0g0aOuiAQ8NAGEzu1rE1G9YcUKtVsvkZwBAV6x1JaF0TmpHLjhxI7OHwC1rO6CtJo4y2DrCyr2S511hwOp0LRaAJgAgjjmoLYFdULSWkZEjuwTmWojIkcCjFVjLz2uAm9IyyOPmSoXaNpuykcP1Wqi2rMnNJ7FZNJVKk0nvLg5roB2gEjyKFolZdGFlRj2uBAcJBwMZHwlUKrYc4bCR4qZJoqMk+hMOI4jxwPmoqjU8hR1LTSdJlzSdRaCO8FTRdk+i2gvumoaYImQYxBEcUW+gP8AUtL43sfnrxHBZp0TIqA9jgfJcp2iTASug7NJ9BtQxFUHH704ZZtTRRtYjptOWtvwQQVnDIn/AITxban23fzO+KdhRf0sKwa3nXMIJMXSM41wFBYdHuqgua5ggx0nQexVqlrqO6zideJJxPErtG21GYNeW5HAkYjLIoAvMsNenJZGw3XMOE7091G2f+pnqcNm4qidJVv7x+zrO47Uw22p/eO/mOvNGg2XHaNtDjjTeeJ7syn0tFVtbIG9zB70MdaXnNx703nXbUaDYVr6NeR0qlIasXycNwCqU7KwOHpWkg5AFVHvccyTxKVmPTbxQ6GrNFUzXU1xxSWRqZgtDsclb0fgCN/mqlek9pxaQPDvU9jOJ4eX/KtIzbLDn3XEhhMxJHwV7QtpJcQZEHCc4KrSdUKWwu6YJAl2EiZw1eaZLG8p2dNrto8kLp2p7cnHvnzR7lLTmm12w+azdw7UXQqsIU9L1RrB4j4KzbXS+99oB3eJQaDuRYGadM7i3+UmPBVbfYqSOBC6zIceKKAqhbWw7iEmUivdUllp9LimwldSHYQNkePVPZj5KN1MjMHuVOF3HaixFmEoVVchFjotwkqsJQixUWJG1cLxtUEJXUDJTVC5ZDNVvFRwprCRzjdspMaNG7NJcKSg0J3sEZavc8/7R3KK3WRga8hoBGRHGO1JJdj6OD2C2qeztEjjPakkuc6WXdLY0T2eazGsLqSBI6iND9gN1Rw/ytKSSpCYmKrpFokcEkkn0NdlK4Ni4G/MlJJSUcLiMie9MvnakkkUdvnalzh2pJJAK+dqV47V1JAHQnXQuJJiIXFWNG/tG8UklJZpyuJJIA//2Q==",
    link: "/categories?category=running",
  },
  {
    name: "Yoga",
    image:
      "data:image/jpeg;base64,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",
    link: "/categories?category=yoga",
  },
  {
    name: "Tops",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRGi-G8OxutpdmyrSSDNMXbNwJA4JSll1Q4Q&s",
    link: "/categories?category=tops",
  },
];

// Sports Gear Carousel Data
const sportsGearItems = [
  {
    name: "Golf",
    image:
      "https://media.istockphoto.com/id/171362434/photo/golfer-swinging-at-sunset.jpg?s=612x612&w=0&k=20&c=hqIIHoIH2IQ0EpWOSt98-J3KEiY_ISivbuA2T8pjYug=",
    link: "#",
  },
  {
    name: "Cricket Trousers",
    image:
      "https://ocs-sport.ams3.cdn.digitaloceanspaces.com/let/2015/06/reid762.jpg",
    link: "#",
  },
  {
    name: "Tennis",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS683LpVYvV2SaCQmycBNPxhx7YYLH9_HMKPQ&s",
    link: "#",
  },
  {
    name: "Basketball",
    image:
      "https://cdn.pixabay.com/photo/2022/04/09/15/10/basketball-7121617_1280.jpg",
    link: "#",
  },
  {
    name: "GYM",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRM7keGEpuMGAMjwNg9YGQYY6ApcjcA3MoqkTc9DaBTZ29nUq7BiC3cC6PdOLrkA1UmKQ&usqp=CAU",
    link: "#",
  },
  {
    name: "Yoga",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS0pUCsbpuq7EZNZ8t5vlenrjVYcmzSkLx6Q&s",
    link: "#",
  },
  {
    name: "Running",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5zLb3NX0iZN_-V8d1srf31bm22sftIO531Q&s",
    link: "#",
  },
];

// Popular Products Data
const popularProducts = [
  {
    brand: "QUECHUA",
    name: "10L hiking backpack NH100 Arpenaz - green print",
    img: "https://contents.mediadecathlon.com/p2629822/c6a44c466bbb37fc0a2ab4304b53834b/p2629822.jpg?format=auto&quality=70&f=256x0",
    img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2aoMH9E5laGlkPLMqVoJZ6M3ouVql6JfIBQMQBeni1UOHXSMuGXKaRq8xEAaAQqhPk5w&usqp=CAU",
    price: "₹ 299",
    originalPrice: "₹ 999",
    discount: "70% Off",
    rating: "4.8",
    reviews: "13k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#",
  },
  {
    brand: "DECATHLON",
    name: "KIPRUN 100 Dry Men's Running Breathable T-shirt - Blue",
    img: "https://contents.mediadecathlon.com/p2646534/ed0e677836d3b5bc2718e2e89c454ba6/p2646534.jpg?format=auto&quality=70&f=256x0",
    img2: "https://i5.walmartimages.com/seo/Decathlon-Kalenji-Run-Dry-Running-T-Shirt-Men-s_7f26eb87-4e1f-4482-b421-22ff5655f5ec.6bbff2b9a9e21b8bf724b33f724f0f20.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    price: "₹ 249",
    originalPrice: "₹ 499",
    discount: "50% Off",
    rating: "4.69",
    reviews: "24k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#",
  },
  {
    brand: "QUECHUA",
    name: "Women Comfort Fit Pant with Wide Waistband Black - NH100",
    img: "https://contents.mediadecathlon.com/p1745252/6a212c9d6a86a00e6e1d89f7823a7a75/p1745252.jpg?format=auto&quality=70&f=256x0",
    img2: "https://contents.mediadecathlon.com/p2546195/d2f0bca4756052fa8cf3f3c5ec4b9d60/p2546195.jpg",
    price: "₹ 699",
    originalPrice: "₹ 1,499",
    discount: "53% Off",
    rating: "4.69",
    reviews: "8.0k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#",
  },
  {
    brand: "BTWIN",
    name: 'Mountain Bike Rockrider 1 Speed V-Brakes 26" Wheels Steel Frame ST20 HF - Green',
    img: "https://contents.mediadecathlon.com/p2881867/e3a057dfa7c0c11458afad476c5b166b/p2881867.jpg?format=auto&quality=70&f=256x0",
    img2: "https://contents.mediadecathlon.com/p2881861/b488fe9a21c3dca8a754a1bd036e5eaf/p2881861.jpg",
    price: "₹ 7,999",
    originalPrice: "₹ 11,999",
    discount: "33% Off",
    rating: "4.03",
    reviews: "408",
    link: "#",
  },
  {
    brand: "KALENJI",
    name: "RUN ACTIVE Lightweight Cushioned Men Running Shoes UPTO 10 km/wk - Black Orange",
    img: "https://contents.mediadecathlon.com/p2717165/18b24508e659e92ce7437d9145e95535/p2717165.jpg?format=auto&quality=70&f=256x0",
    img2: "https://contents.mediadecathlon.com/p2717168/93ceb800d9481735c6cccd2421411a1b/p2717168.jpg?format=auto&quality=70&f=2520x0",
    price: "₹ 2,299",
    originalPrice: "₹ 2,999",
    discount: "23% Off",
    rating: "4.54",
    reviews: "14k",
    link: "#",
  },
  {
    brand: "SOLOGNAC",
    name: "Men Breathable Lightweight Cargo Trousers Pants SG-500 - Grey",
    img: "https://contents.mediadecathlon.com/p2584885/f6a38bfdadc7827bc3fc2eb6fa51ddb9/p2584885.jpg?format=auto&quality=70&f=256x0",
    img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN8KcgmB-ER7yt82hVTnx43eWm88gsNmr1aVQTT6wCsSx_XeOBJDsCWKeuXBlOoapwojE&usqp=CAU",
    price: "₹ 1,999",
    originalPrice: "₹ 3,499",
    discount: "42% Off",
    rating: "4.76",
    reviews: "2.8k",
    link: "#",
  },
  {
    brand: "QUECHUA",
    name: "10L hiking backpack NH100 Arpenaz - green print",
    img: "https://contents.mediadecathlon.com/p2629822/c6a44c466bbb37fc0a2ab4304b53834b/p2629822.jpg?format=auto&quality=70&f=256x0",
    img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2aoMH9E5laGlkPLMqVoJZ6M3ouVql6JfIBQMQBeni1UOHXSMuGXKaRq8xEAaAQqhPk5w&usqp=CAU",
    price: "₹ 299",
    originalPrice: "₹ 999",
    discount: "70% Off",
    rating: "4.8",
    reviews: "13k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#",
  },
  {
    brand: "DECATHLON",
    name: "KIPRUN 100 Dry Men's Running Breathable T-shirt - Blue",
    img: "https://contents.mediadecathlon.com/p2646534/ed0e677836d3b5bc2718e2e89c454ba6/p2646534.jpg?format=auto&quality=70&f=256x0",
    img2: "https://i5.walmartimages.com/seo/Decathlon-Kalenji-Run-Dry-Running-T-Shirt-Men-s_7f26eb87-4e1f-4482-b421-22ff5655f5ec.6bbff2b9a9e21b8bf724b33f724f0f20.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    price: "₹ 249",
    originalPrice: "₹ 499",
    discount: "50% Off",
    rating: "4.69",
    reviews: "24k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#",
  },
  {
    brand: "QUECHUA",
    name: "Women Comfort Fit Pant with Wide Waistband Black - NH100",
    img: "https://contents.mediadecathlon.com/p1745252/6a212c9d6a86a00e6e1d89f7823a7a75/p1745252.jpg?format=auto&quality=70&f=256x0",
    img2: "https://contents.mediadecathlon.com/p2546195/d2f0bca4756052fa8cf3f3c5ec4b9d60/p2546195.jpg",
    price: "₹ 699",
    originalPrice: "₹ 1,499",
    discount: "53% Off",
    rating: "4.69",
    reviews: "8.0k",
    badge: "https://d1314cmsbd81ch.cloudfront.net/stickers/drop.png",
    link: "#",
  },
  {
    brand: "BTWIN",
    name: 'Mountain Bike Rockrider 1 Speed V-Brakes 26" Wheels Steel Frame ST20 HF - Green',
    img: "https://contents.mediadecathlon.com/p2881867/e3a057dfa7c0c11458afad476c5b166b/p2881867.jpg?format=auto&quality=70&f=256x0",
    img2: "https://contents.mediadecathlon.com/p2881861/b488fe9a21c3dca8a754a1bd036e5eaf/p2881861.jpg",
    price: "₹ 7,999",
    originalPrice: "₹ 11,999",
    discount: "33% Off",
    rating: "4.03",
    reviews: "408",
    link: "#",
  },
  {
    brand: "KALENJI",
    name: "RUN ACTIVE Lightweight Cushioned Men Running Shoes UPTO 10 km/wk - Black Orange",
    img: "https://contents.mediadecathlon.com/p2717165/18b24508e659e92ce7437d9145e95535/p2717165.jpg?format=auto&quality=70&f=256x0",
    img2: "https://contents.mediadecathlon.com/p2717168/93ceb800d9481735c6cccd2421411a1b/p2717168.jpg?format=auto&quality=70&f=2520x0",
    price: "₹ 2,299",
    originalPrice: "₹ 2,999",
    discount: "23% Off",
    rating: "4.54",
    reviews: "14k",
    link: "#",
  },
  {
    brand: "SOLOGNAC",
    name: "Men Breathable Lightweight Cargo Trousers Pants SG-500 - Grey",
    img: "https://contents.mediadecathlon.com/p2584885/f6a38bfdadc7827bc3fc2eb6fa51ddb9/p2584885.jpg?format=auto&quality=70&f=256x0",
    img2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN8KcgmB-ER7yt82hVTnx43eWm88gsNmr1aVQTT6wCsSx_XeOBJDsCWKeuXBlOoapwojE&usqp=CAU",
    price: "₹ 1,999",
    originalPrice: "₹ 3,499",
    discount: "42% Off",
    rating: "4.76",
    reviews: "2.8k",
    link: "#",
  },
];

const mainBanners = [
  {
    id: 1,
    image:
      "https://contents.mediadecathlon.com/s1320107/k$c54604171dd875f3b0ea65cd781b3827/defaut.jpg?format=auto&quality=70&f=1920x0",
    title: "Fashion Sale",
    Subtitle: "banner",
  },
  {
    id: 2,
    image:
      "https://contents.mediadecathlon.com/s1319184/k$8f796bb36f174a5def19954deb82ea21/defaut.jpg?format=auto&quality=70&f=1920x0",
    title: "Fashion Sale",
    Subtitle: "banner",
  },
  {
    id: 3,
    image:
      "https://contents.mediadecathlon.com/s1319183/k$49524bae0ca31288ebeece35e8592f5d/defaut.jpg?format=auto&quality=70&f=1920x0",
    title: "Fashion Sale",
    Subtitle: "banner",
  },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("men");
  const currentProducts =
    activeCategory === "men" ? menProducts : womenProducts;

  return (
    <main className="w-full bg-white pt-20 overflow-x-hidden">
      <CategoryGrid
        categories={quickShopCategories}
      />
      
      <div className="w-full max-w-full mx-auto p-5 lg:p-10 rounded-2xl overflow-hidden">
        <LandscapeCarousel items={mainBanners} />
      </div>

      <AnimatedSection>
        <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full">
          <CategoryGrid
            title="Shop by Category"
            subtitle="Find Your Perfect Gear"
            categories={belowcategories}
            columns="grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
            className="mb-12"
          />
        </div>
        <PopularProductsCarousel
          title="Best Selling"
          products={popularProducts}
        />
      </AnimatedSection>

      <SportsGearCarousel
        title="Unite & Play: Shop Sports Gear"
        items={sportsGearItems}
      />

      <FestiveDealsGrid
        title="Festive Steal Deals!"
        items={festiveStealDeals}
      />

      <AnimatedSection className="w-full px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full">
        <ProductCarouselWithTitle
          title="The perfect cycle is waiting"
          subtitle="Pick yours now!"
          products={products}
        />
      </AnimatedSection>

      <section className="mt-5 p-5 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 mx-auto max-w-full">
        <h2 className="text-center text-3xl font-bold">
          Curated Deals for Every Mood
        </h2>
        <div className="mt-10">
          <HorizontalScrollCarousel items={festiveDeals} speed={0.3} />
        </div>
      </section>

      <section className="mt-12 sm:px-4 md:px-6 lg:px-12 xl:px-14 px-6 mx-auto max-w-full">
        <h2 className="font-semibold text-3xl md:text-4xl text-center">
          Trusted by Iconic Brands
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Discover collections from globally loved athletic and lifestyle brands.
        </p>
        <div className="my-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-9 gap-4 sm:gap-6 max-w-full">
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

      <RecommendedProducts />
      
      <AnimatedSection className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 mx-auto max-w-full">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="font-bold text-xl lg:text-4xl">Recently Viewed</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </AnimatedSection>

      <section className=" mx-auto text-center px-2  sm:px-4 md:px-6 lg:px-12 xl:px-14 max-w-full">
        <h2 className="font-semibold text-xl md:text-4xl">
          Your Passion. Your Performance.
        </h2>
        <VideoGrid />
      </section>

      <div className="px-2 sm:px-4 md:px-6 lg:px-12 mx-auto max-w-full">
        <DealsOfTheDay title="Shop Now: Deals of the Day" items={promoCards} />
      </div>

      <section className="py-8 max-w-full">
        <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 mx-auto max-w-full">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="relative w-full max-w-full md:h-[350px] overflow-hidden">
            <video
              src={sportvid}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight text-center px-4">
                ⚡ SALE — UP TO 50% OFF ⚡
              </h2>
            </div>
          </div>

          <div className="py-10">
            <div className="flex gap-4 mb-8">
              {["men", "women"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-semibold ${
                    activeCategory === cat
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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

      <SportsCategorySection />
      
      <div className="px-2 sm:px-4 md:px-6 lg:px-12 mx-auto hover:shadow-lg lg:mt-10 transition cursor-pointer grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 w-full mb-10 overflow-hidden max-w-full">
        {[
          {
            image:
              "https://contents.mediadecathlon.com/s1313100/k$8882b7bc41a4b99d470f8f348f5db0ce/defaut.jpg?format=auto&quality=70&f=384x0",
          },
          {
            image:
              "https://contents.mediadecathlon.com/s1313098/k$695dad62a39fd430cc8f6e67cf0a1026/defaut.jpg?format=auto&quality=70&f=384x0",
          },
          {
            image:
              "https://contents.mediadecathlon.com/s1313099/k$ed72d795df00b80e825a6984e7624439/defaut.jpg?format=auto&quality=70&f=384x0",
          },
          {
            image:
              "https://contents.mediadecathlon.com/s1320224/k$221c44ffdc1c81b9324ce0a06b6cd905/defaut.jpg?format=auto&quality=70&f=384x0",
          },
        ].map((imgs, index) => (
          <div key={index}>
            <img
              src={imgs.image}
              alt=""
              className="w-full h-full object-fill cursor-pointer hover:scale-102"
            />
          </div>
        ))}
      </div>

      <div className="max-w-full">
        <img
          src="https://contents.mediadecathlon.com/s1319284/k$ddfbbd6b132bc4e201e266616da202c5/defaut.jpg?format=auto&quality=70&f=1440x0"
          alt="Buy More Save More"
          className="w-full px-2 md:px-5 lg:px-10 max-w-full"
        />
      </div>

      <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 mx-auto py-12 max-w-full">
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

      <section className="max-w-full">
        <div className="text-center lg:px-4 pt-10 lg:pb-10 max-w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 underline underline-offset-4">
            WE ARE AVAILABLE ON
          </h2>

          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap w-full my-10 max-w-full px-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <img
              src="https://images.ctfassets.net/drk57q8lctrm/4QgGDTtQYDx6oDaW3aU7KS/34163f3bef6d82fd354a7455d07102eb/flipkart-logo.webp"
              alt="Flipkart"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <img
              src="https://www.corecommunique.com/wp-content/uploads/2017/07/Shopclues-new.png"
              alt="ShopClues"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <img
              src="https://vectorseek.com/wp-content/uploads/2025/05/Meesho-Logo-PNG-SVG-Vector.png"
              alt="Meesho"
              className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
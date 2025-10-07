import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../Product/Product";

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
import banner from "../../assets/productbanner.png";
import bigbanner from "../../assets/Bigbanner.png"

// Categories
const categories = [
  {
    img: "https://letsdressup.in/cdn/shop/articles/5-must-have-winter-wear-for-women_1100x.jpg?v=1654519311",
    title: "Women Clothes",
  },
  {
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    title: "Bridal Watch",
  },
  {
    img: "https://thesparkshop.in/wp-content/uploads/2022/10/2018-New-Fashion-Casual-Men-Shirt-Long-Sleeve-Europe-Style-Slim-Fit-Shirt-Men-High-Quality__90065.1537167939.jpg",
    title: "Men Clothes",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfvpJCXiWAGqOjNifs11AV3f0yhFDbsnBryw&s",
    title: "Sneakers",
  },
  {
    img: "https://sunglassic.com/cdn/shop/files/IMG_6269.jpg?v=1699335144&width=2000",
    title: "Sunglasses",
  },
  {
    img: "https://images.jdmagicbox.com/quickquotes/images_main/fashi-tech-women-s-stylish-hand-bag-2187874925-7iox8oxq.jpg",
    title: "Stylish Bag",
  },
];

// Products (example placeholders)
const products = [
  {
    id: 1,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  {
    id: 2,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  {
    id: 3,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Compression T-shirt",
    category: "Performance",
  },
  {
    id: 4,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    title: "Duramo 10 Shoes",
    category: "Performance",
  },
  {
    id: 5,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
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
    title: "Duramo 10 Shoes",
    subtitle: "Performance",
    price: 2499,
    original: 6599,
    discount: "-65%",
  },
  {
    id: 2,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    title: "Galaxy 6 Shoes",
    category: "Performance",
    price: 2400,
    original: 5999,
    discount: "-60%",
  },
  {
    id: 3,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    title: "Samba OG Shoes",
    category: "Originals",
    price: 4400,
    original: 10999,
    discount: "-60%",
  },
  {
    id: 4,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    title: "Ultraboost 20 Shoes",
    category: "Performance",
    price: 7600,
    original: 18999,
    discount: "-60%",
  },
  {
    id: 5,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    title: "Duramo 10 Shoes",
    category: "Performance",
    price: 2499,
    original: 6599,
    discount: "-65%",
  },
  {
    id: 6,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    title: "Galaxy 6 Shoes",
    category: "Performance",
    price: 2400,
    original: 5999,
    discount: "-60%",
  },
  {
    id: 7,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    title: "Samba OG Shoes",
    category: "Originals",
    price: 4400,
    original: 10999,
    discount: "-60%",
  },
  {
    id: 8,
    img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
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
    title: "Running Top",
    category: "Performance",
    price: 1499,
    original: 2999,
    discount: "-50%",
  },
  {
    id: 2,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    title: "Yoga Tee",
    category: "Training",
    price: 1999,
    original: 3999,
    discount: "-50%",
  },
  {
    id: 3,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    title: "Winter Jacket",
    category: "Originals",
    price: 3499,
    original: 6999,
    discount: "-50%",
  },
  {
    id: 4,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    title: "Compression Top",
    category: "Performance",
    price: 2299,
    original: 4599,
    discount: "-50%",
  },
  {
    id: 5,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    title: "Running Top",
    category: "Performance",
    price: 1499,
    original: 2999,
    discount: "-50%",
  },
  {
    id: 6,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    title: "Yoga Tee",
    category: "Training",
    price: 1999,
    original: 3999,
    discount: "-50%",
  },
  {
    id: 7,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
    title: "Winter Jacket",
    category: "Originals",
    price: 3499,
    original: 6999,
    discount: "-50%",
  },
  {
    id: 8,
    img: "https://www.cyclop.in/cdn/shop/files/1_d5b00990-6b2a-4365-849b-084d14380580_1080x.jpg?v=1689009277",
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
    img: footwear,
    title: "SHOES UNDER ₹3999",
    subtitle: "Epic Shoe Deals for Men & Women",
  },
  {
    img: tshirts,
    title: "T-SHIRTS UNDER ₹999",
    subtitle: "Unbeatable Tees Under 999",
  },
  {
    img: tops,
    title: "TOPS STARTING ₹799",
    subtitle: "Wardrobe Refresh. Tops from 799",
  },
  {
    img: jacket,
    title: "JACKETS STARTING ₹1599",
    subtitle: "Seasonal Must-Haves from 1599",
  },
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("men");
  const currentProducts =
    activeCategory === "men" ? menProducts : womenProducts;

  return (
    <main className="w-full bg-white">
      {/* Banner */}
      <div className="w-full lg:h-[80vh] md:h-[50vh] h-[30vh] pt-[60px]">
        <img
          src={banner1}
          alt="Sale Banner"
          className="w-full h-full object-fill"
        />
      </div>

      {/* Festive Deals */}
      <section className="mt-5 p-5 max-w-7xl mx-auto">
        <h2 className="text-center text-2xl font-bold">TOP FESTIVE DEALS</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {festiveDeals.map((deal, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center hover:-translate-y-2 transition"
            >
              <img
                src={deal.img}
                alt={deal.title}
                className="w-full h-auto rounded-md"
              />
              <p className="mt-1 text-xs sm:text-sm lg:text-lg font-extrabold lg:underline decoration-4 underline-offset-4">
                {deal.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-12 px-6 max-w-7xl mx-auto">
        <h2 className="font-semibold text-3xl md:text-4xl text-center">
          Best For Your Categories
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Mauris quis nisi elit curabitur sodales libero ac interdum finibus.
        </p>
        <div className="my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center hover:scale-105 transition"
            >
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 font-semibold">{cat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sports */}
      <section className="px-6 max-w-7xl mx-auto text-center">
        <h2 className="font-semibold text-xl md:text-4xl">
          SELECT YOUR SPORT, FIND YOUR GEAR, AND GET IN THE GAME!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
          {[yoga, running, compression, gloves].map((img, i) => (
            <img key={i} src={img} alt="sport" className="mb-2 hover:scale-102 transition hover:shadow-lg" />
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-black text-white px-3 py-1 text-xs rounded">
            FLAT 60% OFF
          </span>
          <span className="bg-gray-100 text-black px-3 py-1 text-xs rounded font-medium">
            BEST SELLERS ⚡
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Trending */}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <img src={banner} alt="Promo Banner" className="w-full h-auto hover:scale-102 transition" />

        {/* Toggle Buttons */}
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

          {/* Category Products */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
          <Link to={'#'} className="flex justify-center"><button className="px-4 py-2 bg-black text-white font-semibold text-xl hover:shadow-lg">View All</button></Link>
      </section>
      {/* big banner */}
      <div className="max-w-7xl mx-auto hover:scale-110 lg:mt-10 transition cursor-pointer p-5 lg:p-0">
          <img src={bigbanner} alt="" />
      </div>
      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">
          Customer Review
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-10">
          Mauris quis nisi elit curabitur sodales libero ac interdum finibus.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Reliable product, consistently delivers.",
              text: "Generation many variations of passages of even blievable lorem Ipsum is simply dummy text of the printing and typesetting industry.",
              name: "Stefanie Rashford",
            },
            {
              quote: "Excellent product, A+ customer service.",
              text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry lorem Ipsum has been the industry's standard dummy text ever since.",
              name: "Augusta Wind",
            },
            {
              quote: "Impressive quality, durable and reliable.",
              text: "Lorem Ipsum many variations of passages of there are available but they have alteration in some form by injected humour or randomised.",
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
      {/* Promo & Availability Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Discount Banner */}
        <div className="bg-[#fdf9f3] border border-dashed border-red-400 text-center py-4 rounded-md mb-10">
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
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 underline underline-offset-4">
            WE ARE AVAILABLE ON
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-16">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon"
              className="h-10 md:h-12"
            />
            <img
              src="data:image/png;base64,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"
              alt="Flipkart"
              className="h-10 md:h-12"
            />
            <img
              src="https://www.corecommunique.com/wp-content/uploads/2017/07/Shopclues-new.png"
              alt="ShopClues"
              className="h-10 md:h-12"
            />
            <img
              src="https://vectorseek.com/wp-content/uploads/2025/05/Meesho-Logo-PNG-SVG-Vector.png"
              alt="Meesho"
              className="h-10 md:h-12"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

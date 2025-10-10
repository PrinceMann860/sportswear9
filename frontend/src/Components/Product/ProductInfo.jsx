import React, { useState } from "react";
import { Star, Heart } from "lucide-react";
import { ProductCard } from "./Product";

const ProductInfo = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data
  const product = {
    id: 3,
    title: "Compression T-shirt",
    category: "Performance",
    price: "₹2,499.00",
    original: "₹6,599.00",
    discount: "-65%",
    images: [
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
      "https://assets.myntassets.com/dpr_1.5,q_30,w_800,c_limit,fl_progressive/assets/images/2025/FEBRUARY/3/L7GEjRDH_b510caa934e949b78484e8cfb577804d.jpg",
    ],
    description:
      "Engineered with moisture-wicking fabric, our Compression T-shirt provides superior breathability, flexibility, and comfort during intense workouts.",
  };

  const relatedProducts = [
    {
      id: 1,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
    {
      id: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
    {
      id: 3,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
    {
      id: 4,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBKlnopY_VdoiRKoHyB4pSTlZCnTRwpngwQ&s",
      title: "Full sleeve compression",
      category: 'GYM Sports',
      price: "₹1,499",
      discount: "-45",
      original: "₹2,450"
    },
    
  ];

  const reviews = [
    {
      name: "Aman Verma",
      rating: 5,
      text: "Superb quality and fit. The compression feels great and keeps me cool even during intense workouts!",
      images: ["https://m.media-amazon.com/images/I/71lBfyRqZ6L._UY350_.jpg"],
      date: "Sep 18, 2025",
    },
    {
      name: "Priya Sharma",
      rating: 4,
      text: "Good product! Comfortable and stretchable. Worth the price.",
      date: "Aug 29, 2025",
    },
    {
      name: "Rohit Singh",
      rating: 5,
      text: "Perfect fit and material. Love it!",
      images: ["https://m.media-amazon.com/images/I/71lBfyRqZ6L._UY350_.jpg"],
      date: "Jul 12, 2025",
    },
  ];

  return (
    <div className="pt-24 bg-gradient-to-b from-gray-200 to-white text-gray-900">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 py-10">
        {/* Left: Image Gallery */}
        <div>
          <img
            src={product.images[selectedImage]}
            alt="product"
            className="w-full rounded-2xl shadow-md transition-transform duration-300 hover:scale-101"
          />
          <div className="flex gap-3 mt-10">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  selectedImage === i
                    ? "border-red-500 scale-105"
                    : "border-gray-300"
                } transition-transform`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">{product.title}</h2>
          <p className="text-sm text-gray-600">{product.category}</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-black">
              {product.price}
            </span>
            <span className="text-gray-500 line-through">
              {product.original}
            </span>
            <span className="text-red-500 font-semibold">
              {product.discount}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            <button className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition">
              Add to Cart
            </button>
            <button className="p-3 border border-gray-400 rounded-full hover:bg-gray-100 transition">
              <Heart className="text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Banners */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-6">
        <div className="relative bg-black text-white rounded-2xl p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80')] bg-cover" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3">Train Hard. Look Good.</h3>
            <p className="text-sm mb-4 text-gray-200">
              Push your limits with SportsWear9’s high-performance collection.
            </p>
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
              Shop Now
            </button>
          </div>
        </div>

        <div className="relative bg-gray-900 text-white rounded-2xl p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80')] bg-cover" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3 text-red-500">
              New Season Drop
            </h3>
            <p className="text-sm mb-4 text-gray-200">
              Discover the latest designs crafted for speed and comfort.
            </p>
            <button className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-6 text-black">You May Also Like</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-5xl mx-auto px-4 py-12 border-t border-gray-300">
        <h3 className="text-2xl font-bold mb-6 text-black">
          Customer Reviews
        </h3>
        <div className="space-y-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">{r.name}</h4>
                <p className="text-sm text-gray-500">{r.date}</p>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < r.rating ? "text-red-500" : "text-gray-300"
                    }`}
                    fill={i < r.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-4">{r.text}</p>

              {r.images && r.images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {r.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="review"
                      className="w-28 h-28 object-cover rounded-lg border border-gray-300 hover:border-red-400 transition"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

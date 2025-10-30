// ProductInfo.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Star,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  ChevronDown,
  MapPin,
  Share2,
  Check,
  Info,
  Ruler,
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  Award,
  Leaf,
  Users,
  ArrowRight
} from "lucide-react";
import { fetchProductDetail, clearProductDetail } from "./Productdetailslice";
import RecommendedProducts from "../Home/RecommendedProducts";
import ProductGallery from "./ProductGallery"

const ProductInfo = () => {
  const { id, product_uuid } = useParams();
  const productId = id || product_uuid;
  const dispatch = useDispatch();

  const productFromState = useSelector((state) => state.productdetail?.data);
  const loading = useSelector((state) => state.productdetail?.loading);
  const error = useSelector((state) => state.productdetail?.error);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  const product = useMemo(() => {
    if (!productFromState) return null;

    const title = productFromState.name || productFromState.title || "Product";
    const description = productFromState.description || "";
    const price = productFromState.net || productFromState.price || "";
    const original = productFromState.price || productFromState.original || "";
    const discount = productFromState.disc || productFromState.discount || "";

    const specifications =
      productFromState.specifications &&
      typeof productFromState.specifications === "object"
        ? productFromState.specifications
        : {};

    let images =
      Array.isArray(productFromState.default_images) &&
      productFromState.default_images.length > 0
        ? productFromState.default_images
        : [];

    if (images.length === 0) {
      const imgs = [];
      (productFromState.variants || []).forEach((v) => {
        (v.attributes || []).forEach((a) => {
          if (Array.isArray(a.images) && a.images.length > 0) {
            a.images.forEach((im) => {
              if (!imgs.includes(im)) imgs.push(im);
            });
          }
        });
      });
      images = imgs;
    }

    if (images.length === 0 && productFromState.brand?.logo) {
      images = [productFromState.brand.logo];
    }

    const features = Array.isArray(productFromState.features)
      ? productFromState.features
      : [];

    const inStock =
      productFromState.inventory || productFromState.inStock || null;

    return {
      ...productFromState,
      title,
      description,
      price,
      original,
      discount,
      specifications,
      images,
      features,
      inStock,
    };
  }, [productFromState]);

  const colorsList = useMemo(() => {
    if (!product || !Array.isArray(product.variants)) return [];

    const map = new Map();

    product.variants.forEach((variant) => {
      const attrs = variant.attributes || [];
      const colorAttr = attrs.find((a) => a?.name?.toLowerCase() === "color");
      const sizeAttr = attrs.find((a) => a?.name?.toLowerCase() === "size");

      const colorName = colorAttr?.value || "__UNIVERSAL__";
      const hex = colorAttr?.meta?.hex || null;
      const attrImages = Array.isArray(colorAttr?.images)
        ? colorAttr.images
        : [];

      if (!map.has(colorName)) {
        map.set(colorName, {
          key: colorName,
          name: colorName === "__UNIVERSAL__" ? "Universal" : colorName,
          hex,
          images: [...attrImages],
          sizes: new Set(),
          variants: [variant],
        });
      } else {
        const entry = map.get(colorName);
        attrImages.forEach((img) => {
          if (!entry.images.includes(img)) entry.images.push(img);
        });
        entry.variants.push(variant);
      }

      if (sizeAttr?.value) {
        map.get(colorName).sizes.add(sizeAttr.value);
      }
    });

    const arr = [];
    map.forEach((v, k) => {
      arr.push({
        key: v.key,
        name: v.name,
        hex: v.hex,
        images: v.images,
        sizes: Array.from(v.sizes),
        variants: v.variants,
      });
    });

    return arr;
  }, [product]);

  useEffect(() => {
    if (!product) return;

    if (colorsList.length > 0) {
      setSelectedColor(colorsList[0].key);
      if (colorsList[0].sizes && colorsList[0].sizes.length > 0) {
        setSelectedSize(colorsList[0].sizes[0]);
      }
    }
  }, [product, colorsList]);

  const selectedColorObj = useMemo(() => {
    if (!selectedColor) return null;
    return colorsList.find((c) => c.key === selectedColor) || null;
  }, [colorsList, selectedColor]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (
      selectedColorObj &&
      Array.isArray(selectedColorObj.images) &&
      selectedColorObj.images.length > 0
    ) {
      return selectedColorObj.images;
    }
    if (Array.isArray(product.images) && product.images.length > 0)
      return product.images;
    return [];
  }, [product, selectedColorObj]);

  const handleAddToCart = () => {
    alert("Added to cart - SportsWear9 style!");
  };

  if (loading) {
    return (
      <div className="pt-20 bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-300 rounded-xl w-full h-96"></div>
            
            {/* Thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="w-20 h-20 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col items-center text-center p-3 bg-gray-200 rounded-lg">
                  <div className="w-5 h-5 bg-gray-300 rounded-full mb-2"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info Skeleton */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
              <div className="h-8 w-64 bg-gray-300 rounded"></div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
                <div className="h-4 w-8 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>

            {/* Made in India Badge */}
            <div className="h-6 w-32 bg-gray-300 rounded-full"></div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-24 bg-gray-300 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4 py-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="flex gap-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="w-12 h-12 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="h-12 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Product Highlights */}
            <div className="bg-gray-200 rounded-lg p-4">
              <div className="h-5 w-32 bg-gray-300 rounded mb-3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 w-40 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <div className="w-8 h-8 bg-gray-300"></div>
                  <div className="w-12 h-8 bg-gray-200 border-l border-r border-gray-300"></div>
                  <div className="w-8 h-8 bg-gray-300"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 h-12 bg-gray-300 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-40 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs Skeleton */}
        <div className="mt-16 border-t border-gray-200">
          <div className="flex overflow-x-auto gap-4 py-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-8 w-24 bg-gray-300 rounded"></div>
            ))}
          </div>

          {/* Tab Content Skeleton */}
          <div className="py-8">
            <div className="max-w-3xl space-y-4">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
              
              <div className="bg-gray-200 rounded-lg p-6 space-y-3">
                <div className="h-5 w-40 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-300 rounded"></div>
                      <div className="h-3 w-40 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Skeleton */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 w-64 bg-gray-300 rounded mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="space-y-3">
                <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  }

  if (error || !product) {
    return null;
  }

  // Enhanced SportsWear9-style product data
  const SportsWear9Product = {
    title: product.title,
    price: product.price,
    original: product.original,
    discount: product.discount,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    inStock: product.inStock,
    rating: 4.2,
    reviewCount: 128,
    deliveryDate: "10-15 days",
    brand: product.brand?.name || "SportsWear9",
    // Additional data
    madeIn: "India",
    warranty: "2 Years",
    sustainability: "Top Quality materials",
    usage: "Professional & Casual",
    skillLevel: "Beginner to Advanced",
    material: "100% Recycled Polyester",
    weight: "450g",
    care: "Machine Washable",
    activityType: "Running, Training, Outdoor",
    bestFor: "All weather conditions"
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const features = [
    "Lightweight material",
    "Quick dry technology",
    "UV protection",
    "Breathable fabric"
  ];

  // Trust badges data
  const trustBadges = [
    { icon: <Shield className="w-5 h-5" />, text: "2 Year Warranty" },
    { icon: <RefreshCw className="w-5 h-5" />, text: "Easy Returns" },
    { icon: <Award className="w-5 h-5" />, text: "Quality Certified" },
    { icon: <Leaf className="w-5 h-5" />, text: "Top Quality" }
  ];

  // Product highlights
  const productHighlights = [
    "Designed and tested by sports experts",
    "Suitable for multiple sports activities",
    "Durable construction for long-lasting use",
    "Comfort fit for extended wear",
    "Moisture-wicking technology",
    "Anti-odor treatment"
  ];

  return (
    <div className="pt-20 bg-white">

      {/* Main Product Section - SportsWear9 Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Product Gallery */}
          <div className="space-y-4">
            <ProductGallery images={galleryImages}/>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-blue-600 mb-2">{badge.icon}</div>
                  <span className="text-xs font-medium text-gray-700">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                {SportsWear9Product.brand}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                {SportsWear9Product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= Math.floor(SportsWear9Product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {SportsWear9Product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({SportsWear9Product.reviewCount} reviews)
              </span>
              
            </div>

            {/* Made in India Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">🇮🇳 Made in India</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {SportsWear9Product.price}
                </span>
                {SportsWear9Product.original && (
                  <span className="text-xl text-gray-500 line-through">
                    {SportsWear9Product.original}
                  </span>
                )}
              </div>
              {SportsWear9Product.discount && (
                <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                  Save {SportsWear9Product.discount}
                </span>
              )}
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Delivery in {SportsWear9Product.deliveryDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{SportsWear9Product.skillLevel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{SportsWear9Product.warranty} Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{SportsWear9Product.sustainability}</span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Color</h3>
                <span className="text-sm text-gray-500">Selected: {selectedColorObj?.name}</span>
              </div>
              <div className="flex gap-3">
                {colorsList.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => setSelectedColor(color.key)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                      selectedColor === color.key
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: color.hex || "#ccc" }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Size</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border font-medium transition-all ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Highlights */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Product Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {productHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  SportsWear9Product.inStock ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={SportsWear9Product.inStock ? 'text-green-600' : 'text-red-600'}>
                  {SportsWear9Product.inStock ? 'In stock' : 'Out of stock'}
                </span>
                <span className="text-gray-500">- Ready to ship</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Free delivery</p>
                  <p className="text-sm text-gray-600">
                    Get it by {SportsWear9Product.deliveryDate}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Store pickup available</p>
                  <p className="text-sm text-gray-600">
                    Check availability in stores near you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${SportsWear9Product.reviewCount})` },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'features', label: 'Key Features' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {SportsWear9Product.description}
                </p>
                
                {/* Usage Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Usage</h4>
                  <p className="text-gray-700 mb-4">
                    Perfect for {SportsWear9Product.activityType}. Designed for {SportsWear9Product.skillLevel} level users and ideal for {SportsWear9Product.bestFor}.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <span>View usage guide</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {SportsWear9Product.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Feature {index + 1}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold mb-6">Technical Specifications</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {Object.entries({
                    'Material': SportsWear9Product.material,
                    'Weight': SportsWear9Product.weight,
                    'Care Instructions': SportsWear9Product.care,
                    'Made In': SportsWear9Product.madeIn,
                    'Warranty': SportsWear9Product.warranty,
                    'Activity Type': SportsWear9Product.activityType,
                    'Skill Level': SportsWear9Product.skillLevel,
                    ...SportsWear9Product.specifications
                  }).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-4 px-6 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-semibold mb-6">Key Features & Benefits</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {productHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Enhanced Performance</h4>
                        <p className="text-sm text-gray-600">{highlight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {/* Review summary would go here */}
                  <div className="text-center py-8">
                    <p className="text-gray-600">Reviews loading...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold mb-6">Shipping & Returns</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Delivery Options</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Free standard delivery on orders over ₹999</li>
                      <li>• Express delivery available</li>
                      <li>• Store pickup within 2 hours</li>
                      <li>• Same day delivery in select cities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Return Policy</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 30-day return policy</li>
                      <li>• Free returns for quality issues</li>
                      <li>• Easy online return process</li>
                      <li>• No questions asked returns</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
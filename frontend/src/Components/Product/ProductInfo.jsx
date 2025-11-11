// ProductInfo.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Cart/Cartslice";
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
  ArrowRight,
} from "lucide-react";
import { fetchProductDetail, clearProductDetail } from "./Productdetailslice";
import RecommendedProducts from "../Home/RecommendedProducts";
import ProductGallery from "./ProductGallery";

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
        (v.images || []).forEach((img) => {
          if (img.url && !imgs.find(i => i.url === img.url)) {
            imgs.push(img);
          }
        });
      });
      images = imgs;
    }

    if (images.length === 0 && productFromState.brand?.logo) {
      images = [{ url: productFromState.brand.logo }];
    }

    const features = Array.isArray(productFromState.features)
      ? productFromState.features
      : [];

    // Calculate total stock from all variants
    const totalStock = (productFromState.variants || []).reduce((total, variant) => {
      const variantStock = (variant.sizes || []).reduce((sum, size) => {
        return sum + (size.stock_quantity || 0);
      }, 0);
      return total + variantStock;
    }, 0);

    const inStock = totalStock > 0;

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
      totalStock,
    };
  }, [productFromState]);

  // Get available colors from variants
  const colorsList = useMemo(() => {
    if (!product || !Array.isArray(product.variants)) return [];

    const colors = [];
    
    product.variants.forEach((variant) => {
      const colorName = variant.color || "Default";
      const colorId = variant.color_id || colorName;
      const colorCode = variant.color_code || "#ccc";
      
      // Get available sizes for this color
      const availableSizes = (variant.sizes || [])
        .filter(size => size.is_available && (size.stock_quantity || 0) > 0)
        .map(size => ({
          value: size.value || "One Size",
          variant_id: size.variant_id,
          stock_quantity: size.stock_quantity,
          price: size.price
        }));

      // Only include colors that have available sizes
      if (availableSizes.length > 0) {
        colors.push({
          key: colorId,
          name: colorName,
          hex: colorCode,
          images: variant.images || [],
          sizes: availableSizes,
          variant: variant
        });
      }
    });

    return colors;
  }, [product]);

  // Get all available sizes across all colors
  const allAvailableSizes = useMemo(() => {
    const sizesSet = new Set();
    colorsList.forEach(color => {
      color.sizes.forEach(size => {
        if (size.value) {
          sizesSet.add(size.value);
        }
      });
    });
    return Array.from(sizesSet);
  }, [colorsList]);

  // Set initial selected color and size
  useEffect(() => {
    if (colorsList.length > 0) {
      const firstAvailableColor = colorsList[0];
      setSelectedColor(firstAvailableColor.key);
      
      if (firstAvailableColor.sizes.length > 0) {
        setSelectedSize(firstAvailableColor.sizes[0].value);
      }
    }
  }, [colorsList]);

  const selectedColorObj = useMemo(() => {
    if (!selectedColor) return null;
    return colorsList.find((c) => c.key === selectedColor) || null;
  }, [colorsList, selectedColor]);

  // Get available sizes for selected color
  const availableSizesForSelectedColor = useMemo(() => {
    if (!selectedColorObj) return [];
    return selectedColorObj.sizes || [];
  }, [selectedColorObj]);

  // Get images for selected color
  const galleryImages = useMemo(() => {
    if (!product) return [];
    
    // If a color is selected and has images, use those
    if (selectedColorObj && selectedColorObj.images.length > 0) {
      return selectedColorObj.images;
    }
    
    // Otherwise use default product images
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    
    return [];
  }, [product, selectedColorObj]);

  const handleAddToCart = () => {
    if (!product || !selectedColorObj || !selectedSize) return;

    // Find the specific variant for selected color and size
    const selectedVariant = selectedColorObj.sizes.find(
      size => size.value === selectedSize
    );

    if (!selectedVariant) return;

    const payload = {
      product_uuid: product.product_uuid,
      variant_id: selectedVariant.variant_id,
      color_id: selectedColorObj.key,
      size: selectedSize,
      quantity: quantity,
      price: selectedVariant.price || product.price
    };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        alert("✅ Added to cart successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Failed to add item to cart");
      });
  };

  if (loading) {
    return (
      <div className="pt-20 bg-white animate-pulse">
        {/* Loading skeleton remains the same */}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-red-600">Error loading product details.</p>
        </div>
      </div>
    );
  }

  // Enhanced product data with actual values
  const SportsWear9Product = {
    title: product.title,
    price: `₹${product.price}`,
    original: product.original ? `₹${product.original}` : null,
    discount: product.discount ? `${product.discount}% OFF` : null,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    inStock: product.inStock,
    totalStock: product.totalStock,
    rating: product.average_rating || 4.2,
    reviewCount: product.reviews?.length || 128,
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
    bestFor: "All weather conditions",
  };

  // Trust badges data
  const trustBadges = [
    { icon: <Shield className="w-5 h-5" />, text: "2 Year Warranty" },
    { icon: <RefreshCw className="w-5 h-5" />, text: "Easy Returns" },
    { icon: <Award className="w-5 h-5" />, text: "Quality Certified" },
    { icon: <Leaf className="w-5 h-5" />, text: "Top Quality" },
  ];

  // Product highlights
  const productHighlights = [
    "Designed and tested by sports experts",
    "Suitable for multiple sports activities",
    "Durable construction for long-lasting use",
    "Comfort fit for extended wear",
    "Moisture-wicking technology",
    "Anti-odor treatment",
  ];

  return (
    <div className="pt-20 bg-white">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Product Gallery */}
          <div className="space-y-4">
            <ProductGallery 
              images={galleryImages} 
              brandLogo={product.brand?.logo ? `http://127.0.0.1:8000${product.brand.logo}` : null}
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-blue-600 mb-2">{badge.icon}</div>
                  <span className="text-xs font-medium text-gray-700">
                    {badge.text}
                  </span>
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
                <span className="text-sm text-gray-600">
                  Delivery in {SportsWear9Product.deliveryDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {SportsWear9Product.skillLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {SportsWear9Product.warranty} Warranty
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {SportsWear9Product.sustainability}
                </span>
              </div>
            </div>

            {/* Color Selection */}
            {colorsList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Color</h3>
                  <span className="text-sm text-gray-500">
                    Selected: {selectedColorObj?.name}
                  </span>
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
            )}

            {/* Size Selection */}
            {availableSizesForSelectedColor.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Size</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {availableSizesForSelectedColor.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`py-3 rounded-lg border font-medium transition-all ${
                        selectedSize === size.value
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Highlights */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Product Highlights
              </h4>
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
                  disabled={!selectedColor || !selectedSize || !SportsWear9Product.inStock}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    !selectedColor || !selectedSize || !SportsWear9Product.inStock
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <ShoppingCart size={20} />
                  {!SportsWear9Product.inStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    SportsWear9Product.inStock ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={
                    SportsWear9Product.inStock
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {SportsWear9Product.inStock 
                    ? `In stock (${SportsWear9Product.totalStock} available)` 
                    : "Out of stock"}
                </span>
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
                  <p className="font-medium text-gray-900">
                    Store pickup available
                  </p>
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
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              {
                id: "reviews",
                label: `Reviews (${SportsWear9Product.reviewCount})`,
              },
              { id: "shipping", label: "Shipping & Returns" },
              { id: "features", label: "Key Features" },
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
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <h3 className="text-lg font-semibold mb-4">
                  Product Description
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {SportsWear9Product.description}
                </p>

                {/* Usage Section */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Recommended Usage
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Perfect for {SportsWear9Product.activityType}. Designed for{" "}
                    {SportsWear9Product.skillLevel} level users and ideal for{" "}
                    {SportsWear9Product.bestFor}.
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <span>View usage guide</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {SportsWear9Product.features.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {SportsWear9Product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Feature {index + 1}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{feature}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold mb-6">
                  Technical Specifications
                </h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  {Object.entries({
                    Material: SportsWear9Product.material,
                    Weight: SportsWear9Product.weight,
                    "Care Instructions": SportsWear9Product.care,
                    "Made In": SportsWear9Product.madeIn,
                    Warranty: SportsWear9Product.warranty,
                    "Activity Type": SportsWear9Product.activityType,
                    "Skill Level": SportsWear9Product.skillLevel,
                    ...SportsWear9Product.specifications,
                  }).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-4 px-6 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-semibold mb-6">
                  Key Features & Benefits
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {productHighlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Enhanced Performance
                        </h4>
                        <p className="text-sm text-gray-600">{highlight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-4xl">
                <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={`${
                                  star <= (review.rating || 5)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.user_name || "Anonymous"}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold mb-6">
                  Shipping & Returns
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Delivery Options
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Free standard delivery on orders over ₹999</li>
                      <li>• Express delivery available</li>
                      <li>• Store pickup within 2 hours</li>
                      <li>• Same day delivery in select cities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Return Policy
                    </h4>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You might also like
          </h2>
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
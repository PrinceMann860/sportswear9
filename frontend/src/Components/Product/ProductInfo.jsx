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
  MapPin,
  Check,
  Ruler,
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  Award,
  Leaf,
  Users,
  ArrowRight,
  Shirt,
  User,
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
  const [isSticky, setIsSticky] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  // Sticky sidebar effect for desktop
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsSticky(window.scrollY > 100);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const product = useMemo(() => {
    if (!productFromState) return null;

    const title = productFromState.name || productFromState.title || "Product";
    const description = productFromState.description || "";
    
    // Enhanced price handling
    let price = productFromState.net || productFromState.price || 0;
    let original = productFromState.price || productFromState.original || 0;
    let discount = productFromState.disc || productFromState.discount || 0;
    
    // Ensure numeric values for calculations
    price = typeof price === 'string' ? parseFloat(price.replace('₹', '')) || 0 : Number(price) || 0;
    original = typeof original === 'string' ? parseFloat(original.replace('₹', '')) || 0 : Number(original) || 0;
    
    // Calculate discount if not provided
    if (!discount && original > price && original > 0) {
      discount = Math.round(((original - price) / original) * 100);
    }

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
          if (img.url && !imgs.find((i) => i.url === img.url)) {
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
    const totalStock = (productFromState.variants || []).reduce(
      (total, variant) => {
        const variantStock = (variant.sizes || []).reduce((sum, size) => {
          return sum + (size.stock_quantity || 0);
        }, 0);
        return total + variantStock;
      },
      0
    );

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
        .filter((size) => size.is_available && (size.stock_quantity || 0) > 0)
        .map((size) => ({
          value: size.value || "One Size",
          variant_id: size.variant_id,
          stock_quantity: size.stock_quantity,
          price: size.price,
        }));

      // Only include colors that have available sizes
      if (availableSizes.length > 0) {
        colors.push({
          key: colorId,
          name: colorName,
          hex: colorCode,
          images: variant.images || [],
          sizes: availableSizes,
          variant: variant,
        });
      }
    });

    return colors;
  }, [product]);

  // Get all available sizes across all colors
  const allAvailableSizes = useMemo(() => {
    const sizesSet = new Set();
    colorsList.forEach((color) => {
      color.sizes.forEach((size) => {
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
      (size) => size.value === selectedSize
    );

    if (!selectedVariant) return;

    const payload = {
      product_uuid: product.product_uuid,
      variant_id: selectedVariant.variant_id,
      color_id: selectedColorObj.key,
      quantity: quantity,
    };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        // Show success message
        const event = new CustomEvent('showToast', {
          detail: {
            message: '✅ Added to cart successfully!',
            type: 'success'
          }
        });
        window.dispatchEvent(event);
      })
      .catch((err) => {
        console.error(err);
        const event = new CustomEvent('showToast', {
          detail: {
            message: '❌ Failed to add item to cart',
            type: 'error'
          }
        });
        window.dispatchEvent(event);
      });
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    const event = new CustomEvent('showToast', {
      detail: {
        message: !isWishlisted ? '❤️ Added to wishlist' : '💔 Removed from wishlist',
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  };

  // Reference model data based on product type
  const referenceModel = useMemo(() => {
    const productTitle = product?.title?.toLowerCase() || "";

    if (
      productTitle.includes("t-shirt") ||
      productTitle.includes("tshirt") ||
      productTitle.includes("shirt")
    ) {
      return {
        type: "t-shirt",
        title: "Style Reference",
        description: "Pairs well with jeans, shorts, or layered under jackets",
        recommendations: ["Casual Look", "Sporty Style", "Layered Fashion"],
        icon: <Shirt className="w-5 h-5" />,
      };
    } else if (
      productTitle.includes("short") ||
      productTitle.includes("bottom")
    ) {
      return {
        type: "shorts",
        title: "Outfit Reference",
        description: "Great for workouts, running, or casual summer wear",
        recommendations: ["Athletic Wear", "Casual Outfit", "Beach Style"],
        icon: <User className="w-5 h-5" />,
      };
    } else if (
      productTitle.includes("jacket") ||
      productTitle.includes("hoodie")
    ) {
      return {
        type: "outerwear",
        title: "Layering Reference",
        description: "Perfect for layering over t-shirts or under coats",
        recommendations: ["Casual Layer", "Sporty Look", "Urban Style"],
        icon: <User className="w-5 h-5" />,
      };
    } else if (
      productTitle.includes("shoe") ||
      productTitle.includes("sneaker")
    ) {
      return {
        type: "footwear",
        title: "Styling Reference",
        description: "Versatile for both athletic activities and casual wear",
        recommendations: ["Athletic Use", "Casual Wear", "Street Style"],
        icon: <User className="w-5 h-5" />,
      };
    } else {
      return {
        type: "general",
        title: "Style Guide",
        description: "Perfect for various occasions and styling options",
        recommendations: ["Versatile Use", "Multiple Styles", "Easy Pairing"],
        icon: <User className="w-5 h-5" />,
      };
    }
  }, [product]);

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `₹${price}`;
  };

  if (loading) {
    return (
      <div className="pt-20 bg-white animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-200 h-20 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              <div className="bg-gray-200 h-12 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium mb-2">Error loading product details</p>
            <p className="text-red-500 text-sm">{error || "Product not found"}</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced product data with actual values
  const SportsWear9Product = {
    title: product.title,
    price: formatPrice(product.price),
    original: product.original > product.price ? formatPrice(product.original) : null,
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
    material: product.specifications?.material || "100% Recycled Polyester",
    weight: product.specifications?.weight || "450g",
    care: product.specifications?.care || "Machine Washable",
    activityType: product.specifications?.activityType || "Running, Training, Outdoor",
    bestFor: product.specifications?.bestFor || "All weather conditions",
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
    <div className="pt-20 bg-white min-h-screen">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Gallery */}
          <div
            className={`space-y-4 lg:sticky lg:top-24 lg:h-fit lg:pb-8 ${
              isSticky ? "lg:max-h-screen lg:overflow-y-auto" : ""
            }`}
          >
            <ProductGallery
              images={galleryImages}
              brandLogo={
                product.brand?.logo
                  ? `http://127.0.0.1:8000${product.brand.logo}`
                  : null
              }
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="text-blue-600 mb-2">{badge.icon}</div>
                  <span className="text-xs font-medium text-gray-700 leading-tight">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6 overflow-hidden px-4">
            {/* Brand and Title */}
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                {SportsWear9Product.brand}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 leading-tight">
                {SportsWear9Product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 flex-wrap">
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
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
              <span className="text-sm font-medium">🇮🇳 Made in India</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {SportsWear9Product.price}
                </span>
                {SportsWear9Product.original && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
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
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 py-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  Delivery in {SportsWear9Product.deliveryDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  {SportsWear9Product.skillLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  {SportsWear9Product.warranty} Warranty
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  {SportsWear9Product.sustainability}
                </span>
              </div>
            </div>

            {/* Color Selection */}
            {colorsList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-semibold text-gray-900 text-base">
                    Color
                  </h3>
                  <span className="text-sm text-gray-500">
                    Selected: {selectedColorObj?.name}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colorsList.map((color) => (
                    <button
                      key={color.key}
                      onClick={() => setSelectedColor(color.key)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === color.key
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
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
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-semibold text-gray-900 text-base">
                    Size
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableSizesForSelectedColor.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`py-2 sm:py-3 rounded-lg border font-medium transition-all text-sm sm:text-base ${
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
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3 text-base">
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
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4 border border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="font-semibold text-gray-900 text-base">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 sm:px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center font-semibold text-sm sm:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedColor ||
                    !selectedSize ||
                    !SportsWear9Product.inStock
                  }
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                    !selectedColor ||
                    !selectedSize ||
                    !SportsWear9Product.inStock
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <ShoppingCart size={18} />
                  {!SportsWear9Product.inStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`p-3 border-2 rounded-lg transition-colors flex-shrink-0 ${
                    isWishlisted 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"
                    }`} 
                  />
                </button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
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
                <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    Free delivery
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    Get it by {SportsWear9Product.deliveryDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    Store pickup available
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    Check availability in stores near you
                  </p>
                </div>
              </div>
            </div>

            {/* Buy It With Section */}
            <div className="mt-10 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Buy it with
              </h3>

              {(() => {
                const comboProducts = [
                  {
                    id: 1,
                    title: "Scott International Men's Regular Fit T-Shirt",
                    price: 799,
                    image:
                      "https://m.media-amazon.com/images/I/61hz9cK6gnL._SX679_.jpg",
                  },
                  {
                    id: 2,
                    title: "SportsWear9 Men's Cotton Shorts",
                    price: 599,
                    image:
                      "https://m.media-amazon.com/images/I/51pptfTnmhL._SX679_.jpg",
                  },
                ];

                const totalPrice =
                  parseInt(SportsWear9Product.price.replace('₹', '').replace(/,/g, '')) +
                  comboProducts.reduce((acc, p) => acc + p.price, 0);

                return (
                  <div className="flex flex-col">
                    {/* Horizontal Scroll Wrapper */}
                    <div className="flex items-start overflow-x-auto scrollbar-hide pb-4">
                      {/* Main Product */}
                      <div className="flex flex-col items-center text-center min-w-[140px] sm:min-w-[160px]">
                        <img
                          src={
                            galleryImages?.[0]?.url
                              ? `http://127.0.0.1:8000${galleryImages[0].url}`
                              : "https://via.placeholder.com/120"
                          }
                          alt="Main product"
                          className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg border border-gray-200"
                        />
                        <div className="mt-2 text-xs sm:text-sm text-gray-700 font-medium">
                          This item: {SportsWear9Product.title}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {SportsWear9Product.price}
                        </div>
                      </div>

                      {/* Plus sign */}
                      <span className="text-2xl text-gray-500 mt-12 font-semibold">
                        +
                      </span>

                      {/* Combo Products (Mapped) */}
                      {comboProducts.map((product, index) => (
                        <React.Fragment key={product.id}>
                          <div className="flex flex-col items-center text-center min-w-[140px] sm:min-w-[160px]">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg border border-gray-200"
                            />
                            <div className="mt-2 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer hover:text-blue-600">
                              {product.title}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{product.price}
                            </div>
                          </div>

                          {/* Plus sign between items */}
                          {index !== comboProducts.length - 1 && (
                            <span className="text-2xl text-gray-500 mt-12 font-semibold">
                              +
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Total Price + Button */}
                    <div className="mt-6 text-center pt-4">
                      <p className="text-gray-700 text-lg mb-1 font-medium">
                        Total price:
                      </p>
                      <p className="text-xl font-bold text-gray-900 mb-4">
                        ₹{totalPrice.toLocaleString('en-IN')}
                      </p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition">
                        Add all to Cart
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Full Width */}
        <div className="mt-12 lg:mt-16 px-4 border-t border-gray-200 w-full">
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
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
                className={`flex-shrink-0 px-4 sm:px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
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
          <div className="py-6 sm:py-8 w-full">
            {activeTab === "description" && (
              <div className="max-w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Product Description
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {SportsWear9Product.description}
                </p>

                {/* Usage Section */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
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
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {SportsWear9Product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Feature {index + 1}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {feature}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-full">
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
                      className="flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-gray-200 last:border-b-0 flex-wrap gap-2"
                    >
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        {key}
                      </span>
                      <span className="text-gray-900 font-semibold text-sm sm:text-base text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div className="max-w-full">
                <h3 className="text-lg font-semibold mb-6">
                  Key Features & Benefits
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
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
              <div className="max-w-full">
                <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-6"
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                          <span className="font-medium">
                            {review.user_name || "Anonymous"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {review.date || "Recently"}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">
                        No reviews yet. Be the first to review this product!
                      </p>
                      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Write a Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-full">
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
      <div className="border-t border-gray-300 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            You might also like
          </h2>
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
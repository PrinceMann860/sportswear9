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
} from "lucide-react";
import { Check, Info, Ruler } from "lucide-react";
import { fetchProductDetail, clearProductDetail } from "./Productdetailslice"; // adjust if your file path differs
import { ProductCard } from "./Product";
import ProductGallery from "../Infopage/ProductGallery";
import ProductSummary from "../Infopage/ProductSummary";
import ProductTabs from "../Infopage/ProductTabs";
import DeliveryInfo from "../Infopage/DeliveryInfo";
import RecommendedProducts from "../Home/RecommendedProducts";

/**
 * Notes:
 * - This file preserves your original UI exactly.
 * - It maps API data into fields your UI expects (title, images, colors, sizes, etc.).
 * - It reads product data from state.productdetail (your store key).
 */

const ProductInfo = () => {
  const { id, product_uuid } = useParams();
  const productId = id || product_uuid; // support both param names
  const dispatch = useDispatch();

  // Use separate selectors to avoid returning new objects and causing warnings
  const productFromState = useSelector((state) => state.productdetail?.data);
  const loading = useSelector((state) => state.productdetail?.loading);
  const error = useSelector((state) => state.productdetail?.error);

  // Local UI state (kept same names as original)
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product on mount / id change
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  // Normalize API product into shape your UI expects (with graceful fallbacks)
  const product = useMemo(() => {
    if (!productFromState) return null;

    // Title/name
    const title = productFromState.name || productFromState.title || "Product";

    // Description
    const description = productFromState.description || "";

    // Price fields
    const price = productFromState.net || productFromState.price || "";
    const original = productFromState.price || productFromState.original || "";
    const discount = productFromState.disc || productFromState.discount || "";

    // Specifications (API might provide array or object) -> ensure object
    const specifications =
      productFromState.specifications &&
      typeof productFromState.specifications === "object"
        ? productFromState.specifications
        : {};

    // Images: prefer default_images, else variant attribute images flattened, else brand logo
    let images =
      Array.isArray(productFromState.default_images) &&
      productFromState.default_images.length > 0
        ? productFromState.default_images
        : [];

    if (images.length === 0) {
      // gather images from variant attributes
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

    // Features (if not provided, try to infer or leave empty)
    const features = Array.isArray(productFromState.features)
      ? productFromState.features
      : [];

    // In-stock indicator
    const inStock =
      productFromState.inventory || productFromState.inStock || null;

    // Delivery date
    const deliveryDate =
      productFromState.delivery_date ||
      productFromState.deliveryDate ||
      "2-3 business days";

    // Ratings & reviews (API may be incomplete)
    const rating =
      productFromState.average_rating ?? productFromState.rating ?? null;
    const reviewCount = Array.isArray(productFromState.reviews)
      ? productFromState.reviews.length
      : 0;

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
      deliveryDate,
      rating,
      reviewCount,
    };
  }, [productFromState]);

  // Build color -> { name, hex, images, sizes (array), variants } map from variants attributes
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
        // append images uniq
        attrImages.forEach((img) => {
          if (!entry.images.includes(img)) entry.images.push(img);
        });
        entry.variants.push(variant);
      }

      if (sizeAttr?.value) {
        map.get(colorName).sizes.add(sizeAttr.value);
      }
    });

    // convert to array and sizes -> array
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

  // Show color selector only if more than one named color (exclude universal grouping unless multiple keys)
  const showColorSelector = useMemo(() => {
    if (!colorsList || colorsList.length === 0) return false;
    const named = colorsList.filter((c) => c.key !== "__UNIVERSAL__");
    if (named.length > 1) return true;
    return colorsList.length > 1 && named.length > 0;
  }, [colorsList]);

  // default selections when product loads or when colorsList changes
  useEffect(() => {
    if (!product) return;

    // if previously selected color exists in new list, keep it, else pick first
    if (selectedColor) {
      const exists = colorsList.find((c) => c.key === selectedColor);
      if (exists) {
        // if sizes available and no selectedSize, auto-select
        if (
          (!selectedSize || selectedSize === null) &&
          exists.sizes &&
          exists.sizes.length > 0
        ) {
          setSelectedSize(exists.sizes[0]);
        }
        return;
      }
    }

    // pick first color/first size (auto)
    if (colorsList.length > 0) {
      setSelectedColor(colorsList[0].key);
      if (colorsList[0].sizes && colorsList[0].sizes.length > 0) {
        setSelectedSize(colorsList[0].sizes[0]);
      } else {
        setSelectedSize(null);
      }
      setSelectedImage(0);
      return;
    }

    // if no color groups, fallback: if product.images exist, set selectedImage0
    if (product.images && product.images.length > 0) {
      setSelectedImage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, colorsList]);

  // selectedColorObj
  const selectedColorObj = useMemo(() => {
    if (!selectedColor) return null;
    return colorsList.find((c) => c.key === selectedColor) || null;
  }, [colorsList, selectedColor]);

  // decide whether to show size selector: only if selectedColorObj has sizes or if any variant has size at all and we have multiple sizes
  const showSizeSelector = useMemo(() => {
    if (!selectedColorObj) return false;
    return selectedColorObj.sizes && selectedColorObj.sizes.length > 0;
  }, [selectedColorObj]);

  // compute gallery images: priority -> selected color images -> product.images -> variant images -> brand.logo
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
    // fallback to gather any attribute images from variants
    const imgs = [];
    (product.variants || []).forEach((v) => {
      (v.attributes || []).forEach((a) => {
        if (Array.isArray(a.images)) {
          a.images.forEach((i) => {
            if (!imgs.includes(i)) imgs.push(i);
          });
        }
      });
    });
    if (imgs.length) return imgs;
    if (product.brand?.logo) return [product.brand.logo];
    return [];
  }, [product, selectedColorObj]);

  // ensure selectedImage index valid
  useEffect(() => {
    if (selectedImage >= galleryImages.length) {
      setSelectedImage(0);
    }
  }, [galleryImages, selectedImage]);

  // helper to find selectedVariant (color+size)
  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const variants = product.variants || [];

    const attrVal = (variant, attrName) => {
      const a = (variant.attributes || []).find(
        (x) => x?.name?.toLowerCase() === attrName.toLowerCase()
      );
      return a?.value ?? null;
    };

    const targetColor = selectedColorObj
      ? selectedColorObj.key === "__UNIVERSAL__"
        ? null
        : selectedColorObj.name
      : null;
    // find variant matching both color and size if both present
    let found = variants.find((v) => {
      const vColor = attrVal(v, "color");
      const vSize = attrVal(v, "size");
      const colorMatch = targetColor ? vColor === targetColor : !vColor; // if targetColor null treat as colorless/universal
      const sizeMatch = selectedSize ? vSize === selectedSize : true;
      return colorMatch && sizeMatch;
    });

    if (!found && targetColor) {
      // fallback: any variant matching color only
      found = variants.find((v) => {
        const vColor = attrVal(v, "color");
        return vColor === targetColor;
      });
    }

    if (!found) {
      found = variants[0] || null;
    }

    return found;
  }, [product, selectedColorObj, selectedSize]);

  // derived price to display (from variant if present)
  const displayPrice = useMemo(() => {
    if (selectedVariant && selectedVariant.price) return selectedVariant.price;
    return product?.price || "";
  }, [selectedVariant, product]);

  // select color handler
  const handleSelectColor = (colorKey) => {
    if (colorKey === selectedColor) return;
    setSelectedColor(colorKey);
    setSelectedImage(0);

    // auto-select first size for that color if exists
    const entry = colorsList.find((c) => c.key === colorKey);
    if (entry && entry.sizes && entry.sizes.length > 0) {
      setSelectedSize(entry.sizes[0]);
    } else {
      setSelectedSize(null);
    }
  };

  // select size handler
  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  // add to cart placeholder
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a valid product variant.");
      return;
    }
    // replace with your cart dispatch
    console.log("Add to cart variant:", selectedVariant, { quantity });
    alert("Added to cart (demo). Replace with real cart action.");
  };

  // --- Temporary small loader UI ---
  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-sm text-gray-600">Loading product...</div>
        </div>
      </div>
    );
  }

  // If error, show a small message but keep mock sections below (so page doesn't fully break)
  if (error) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <strong>Error:</strong> {String(error)}
        </div>
      </div>
    );
  }

  // If product not yet loaded, don't render main UI (keeps original UI untouched)
  if (!product) {
    return null;
  }

  // For backward-compatibility with your exact original UI variable names:
  const uiProduct = {
    title: product.title,
    images: galleryImages.length > 0 ? galleryImages : [""],
    description: product.description,
    features: product.features || [],
    sizes: (() => {
      // If any color grouping has sizes, merge unique sizes for UI (but we will show per-color sizes when showing selector)
      const allSizes = new Set();
      colorsList.forEach((c) => c.sizes.forEach((s) => allSizes.add(s)));
      return Array.from(allSizes);
    })(),
    colors: colorsList.map((c) => ({
      name: c.name,
      value: c.hex || "#efefef",
    })),
    specifications: product.specifications || {},
    inStock: product.inStock ?? product.inStock ?? product.inStock,
    deliveryDate:
      product.deliveryDate || product.delivery_date || product.deliveryDate,
    rating: product.rating ?? product.average_rating ?? null,
    reviewCount:
      product.reviewCount ?? (product.reviews ? product.reviews.length : 0),
    price: displayPrice,
    original: product.original || product.price || "",
    discount: product.discount || product.disc || "",
  };

  // compute review derived stats using your original mock reviews if API reviews absent
  const reviews =
    product.reviews && product.reviews.length > 0
      ? product.reviews
      : [
          // keep original mock reviews as placeholders (small subset)
          {
            name: "Aman Verma",
            rating: 5,
            text: "Superb quality and fit. The compression feels great and keeps me cool even during intense workouts!",
            images: [
              "https://m.media-amazon.com/images/I/71lBfyRqZ6L._UY350_.jpg",
            ],
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
            images: [
              "https://m.media-amazon.com/images/I/71lBfyRqZ6L._UY350_.jpg",
            ],
            date: "Jul 12, 2025",
          },
        ];

  const totalReviews = reviews.length;
  const ratingSum = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = totalReviews ? ratingSum / totalReviews : 0;
  const roundedAverage = Math.round(averageRating * 10) / 10;

  const ratingsCount = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const rt = Math.max(1, Math.min(5, Math.floor(r.rating || 0)));
    ratingsCount[5 - rt] += 1;
  });

  const ratingPercentages = ratingsCount.map((c) =>
    Math.round((c / (totalReviews || 1)) * 100)
  );
  const reviewImages = reviews.flatMap((r) => r.images || []);

  // Helper to render color swatch (fallback if hex missing)
  const swatchStyle = (hex) => ({
    backgroundColor: hex || "#efefef",
  });

  return (
    <div className="pt-20 bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-x-hidden">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-16 py-8 lg:py-12">
        {/* Left: Image Gallery */}
        <ProductGallery
          images={product.default_images?.map((img) => img.image_url) || []}
          brandLogo={product.brand?.logo}
        />

        {/* Right: Modern Product Information */}
        <div className="flex flex-col space-y-8">
          {/* Product Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-block bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                {product.category?.name || product.category || "Category"}
              </span>
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-gray-700">
                  {uiProduct.rating ?? "—"}
                </span>
                <span className="text-xs text-gray-500">
                  ({uiProduct.reviewCount ?? totalReviews})
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {uiProduct.title}
            </h1>
          </div>

          {/* Pricing - Modern Card Style */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                {uiProduct.price}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {uiProduct.original}
              </span>
              {uiProduct.discount && (
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  {uiProduct.discount} OFF
                </span>
              )}
            </div>
            <p className="text-blue-600 text-sm font-medium mt-2 flex items-center gap-1">
              <Check className="w-4 h-4" />
              You save{" "}
              {uiProduct.original && uiProduct.price
                ? `₹${(
                    parseFloat(
                      uiProduct.original.toString().replace(/[^\d.]/g, "")
                    ) -
                    parseFloat(
                      uiProduct.price.toString().replace(/[^\d.]/g, "")
                    )
                  ).toFixed(2)}`
                : "—"}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Product Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              {uiProduct.description}
            </p>
          </div>

          {/* Color Selection - Modern Cards */}
          {/* Only show if more than 1 color group (per your rule), otherwise skip */}
          {showColorSelector ? (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Color
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorsList.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => handleSelectColor(color.key)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedColor === color.key
                        ? "border-blue-600 bg-blue-50 shadow-md scale-105 ring-2 ring-blue-200"
                        : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-sm"
                      style={swatchStyle(color.hex)}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Size Selection - Modern Grid */}
          {showSizeSelector ? (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Size
                </h3>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  <Ruler className="w-4 h-4" />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {(selectedColorObj
                  ? selectedColorObj.sizes
                  : uiProduct.sizes
                ).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSelectSize(size)}
                    className={`py-4 rounded-xl border-2 font-semibold transition-all duration-300 ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900 shadow-md scale-105"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm hover:scale-102 bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Quantity & Actions - Modern Layout */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quantity Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 border-l border-r border-gray-300 min-w-12 text-center font-semibold bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <div
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      uiProduct.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {uiProduct.inStock ? "✓ In Stock" : "Out of Stock"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-102 shadow-md"
                >
                  Add to Cart
                </button>
                <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                  <Heart className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Services - Modern Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">
                    By {uiProduct.deliveryDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">1 Year Warranty</p>
                  <p className="text-sm text-gray-600">Quality Assured</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-Day Policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications - Modern Table */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Specifications
            </h3>
            <div className="space-y-3">
              {Object.entries(uiProduct.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                >
                  <span className="text-gray-600 font-medium">{key}</span>
                  <span className="text-gray-900 font-semibold bg-gray-50 px-3 py-1 rounded-lg">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Banners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative bg-gray-900 text-white rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden min-h-[200px]">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Train Hard. Look Good.
            </h3>
            <p className="text-sm mb-4 text-gray-200 max-w-md">
              Push your limits with SportsWear9's high-performance collection.
            </p>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-colors w-fit text-sm">
              Shop Now
            </button>
          </div>
        </div>

        <div className="relative bg-gray-800 text-white rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden min-h-[200px]">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-red-500">
              New Season Drop
            </h3>
            <p className="text-sm mb-4 text-gray-200 max-w-md">
              Discover the latest designs crafted for speed and comfort.
            </p>
            <button className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-colors w-fit text-sm">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RecommendedProducts />

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Ratings summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {roundedAverage}
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.round(averageRating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          fill={
                            i < Math.round(averageRating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-3">
                      {totalReviews} global ratings
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating breakdown */}
              <div className="mt-6 space-y-3">
                {[5, 4, 3, 2, 1].map((star, idx) => {
                  const pct = ratingPercentages[idx] ?? 0;
                  return (
                    <div
                      key={star}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: star }).map((__, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="text-yellow-500"
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm w-8">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Write a review button */}
              <div className="mt-6">
                <button className="w-full border border-gray-300 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Write a product review
                </button>
              </div>
            </div>
          </div>

          {/* Middle + Right: Enhanced Comments Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customers say */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-3">
                Customers say
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Customers find the workout gloves have a nice fit. However, the
                quality receives mixed feedback, with some customers finding
                them good while others say they are not of good quality.
              </p>
              <div className="mt-4 flex gap-4 text-sm">
                <button className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1 bg-blue-50 rounded-full transition-colors">
                  Fit
                </button>
                <button className="text-blue-600 hover:text-blue-700 font-medium px-3 py-1 bg-blue-50 rounded-full transition-colors">
                  Quality
                </button>
              </div>
            </div>

            {/* Reviews with images */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  Reviews with images
                </h4>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  See all photos
                </button>
              </div>

              {reviewImages.length > 0 ? (
                <div className="mt-4 overflow-x-auto flex gap-3 py-2 scrollbar-thin">
                  {reviewImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`review-img-${i}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500 text-center py-4">
                  No review images yet
                </div>
              )}
            </div>

            {/* Enhanced Reviews list */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900 mb-6">
                Top reviews from India
              </h4>

              <div className="space-y-6">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map(
                  (r, idx) => (
                    <div
                      key={idx}
                      className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-sm border border-gray-300">
                            {r.name ? r.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={
                                      i < r.rating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }
                                    fill={
                                      i < r.rating ? "currentColor" : "none"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {r.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {r.date}
                              </span>
                            </div>

                            {/* Enhanced Comment Text */}
                            <p className="text-gray-700 mt-2 leading-relaxed text-sm sm:text-base">
                              {r.text}
                            </p>

                            {/* Review Images */}
                            {r.images && r.images.length > 0 && (
                              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                                {r.images.map((img, j) => (
                                  <img
                                    key={j}
                                    src={img}
                                    alt={`rev-${idx}-img-${j}`}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Verified tag */}
                        {r.rating >= 4 && (
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2">
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* See more / see less */}
              {reviews.length > 3 && (
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {showAllReviews
                      ? "Show Less Reviews"
                      : `Show More Reviews (${reviews.length - 3})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

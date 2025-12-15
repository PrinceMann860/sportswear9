// ProductInfo.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModal";
import { addToCart } from "../Cart/Cartslice";
import SEO from "../Common/SEO.jsx";
import { createReview, updateReview, deleteReview, getReviewsByProduct,
} from "./ReviewSlice";
import { fetchProfile } from "../Profile/Profileslice.js";
import {Star, Heart, Truck, Shield, RefreshCw, MapPin, Check, Ruler, Plus, Minus, ShoppingCart, Clock, Award, Leaf, Users, ArrowRight, ChevronLeft, ChevronRight, ZoomIn, Shirt, User, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import { fetchProductDetail, clearProductDetail } from "./Productdetailslice";
import RecommendedProducts from "../Home/RecommendedProducts";
import ProductGallery from "./ProductGallery";

const ProductInfo = () => {
  const { id, product_uuid } = useParams();
  const productId = id || product_uuid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  // Redux states
  const productFromState = useSelector((state) => state.productdetail?.data);
  const loading = useSelector((state) => state.productdetail?.loading);
  const error = useSelector((state) => state.productdetail?.error);
  const reviewsState = useSelector((state) => state.review);

  const profileData = useSelector((state) => state.profile.data);

  // Review states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  // UI states
  // removed unused selectedImage state
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isSticky, setIsSticky] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  // Review image modal state
  const [reviewImageModalOpen, setReviewImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
  }, [dispatch, productId]);

  // Load reviews when product detail loads
  useEffect(() => {
    if (productFromState?.product_uuid) {
      dispatch(getReviewsByProduct(productFromState.product_uuid));
    }
  }, [dispatch, productFromState?.product_uuid]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, dispatch]);

  // Sticky sidebar effect for desktop
  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.querySelector(".lg\\:sticky");
      if (sidebar) {
        const rect = sidebar.getBoundingClientRect();
        setIsSticky(rect.top <= 24);
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
    price =
      typeof price === "string"
        ? parseFloat(price.replace("₹", "").replace(/,/g, "")) || 0
        : Number(price) || 0;
    original =
      typeof original === "string"
        ? parseFloat(original.replace("₹", "").replace(/,/g, "")) || 0
        : Number(original) || 0;

    // Calculate discount if not provided
    if (!discount && original > price && original > 0) {
      discount = Math.round(((original - price) / original) * 100);
    }

    const specifications =
      productFromState.specifications &&
      typeof productFromState.specifications === "object" ? productFromState.specifications : {};

    let images =
      Array.isArray(productFromState.default_images) &&
      productFromState.default_images.length > 0 ? productFromState.default_images : [];

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

    // Get reviews from product data or review state

    const reviews =
      Array.isArray(reviewsState.productReviews) && reviewsState.productReviews.length > 0
        ? reviewsState.productReviews
        : Array.isArray(productFromState?.reviews)
        ? productFromState.reviews
        : [];

    const validReviews = reviews.filter((r) => r.rating !== null);
    const averageRating = validReviews.length > 0 ? validReviews.reduce((a, r) => a + r.rating, 0) / validReviews.length : 0;

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
      reviews,
      average_rating: averageRating,
    };
  }, [productFromState, reviewsState.productReviews]);
  const refreshReviews = useCallback(() => {
    if (productFromState?.product_uuid) {
      dispatch(getReviewsByProduct(productFromState.product_uuid));
    }
  }, [dispatch, productFromState?.product_uuid]);

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

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedColorObj || !selectedSize) {
      const event = new CustomEvent("showToast", {
        detail: {
          message: "❌ Please select color and size",
          type: "error",
        },
      });
      window.dispatchEvent(event);
      return;
    }

    const selectedVariant = selectedColorObj.sizes.find(
      (size) => size.value === selectedSize
    );

    if (!selectedVariant) {
      const event = new CustomEvent("showToast", {
        detail: {
          message: "❌ Selected size is not available",
          type: "error",
        },
      });
      window.dispatchEvent(event);
      return;
    }

    if (selectedVariant.stock_quantity < quantity) {
      const event = new CustomEvent("showToast", {
        detail: {
          message: `❌ Only ${selectedVariant.stock_quantity} items available in stock`,
          type: "error",
        },
      });
      window.dispatchEvent(event);
      return;
    }

    const payload = {
      product_uuid: product.product_uuid,
      variant_id: selectedVariant.variant_id,
      color_id: selectedColorObj.key,
      quantity: quantity,
    };

    dispatch(addToCart(payload))
      .unwrap()
      .then(() => {
        // Success toast
        const event = new CustomEvent("showToast", {
          detail: {
            message: "✅ Added to cart successfully!",
            type: "success",
          },
        });
        window.dispatchEvent(event);
      })
      .catch((err) => {
        console.error(err);
        const event = new CustomEvent("showToast", {
          detail: {
            message: "❌ Failed to add item to cart",
            type: "error",
          },
        });
        window.dispatchEvent(event);
      });
  }, [product, selectedColorObj, selectedSize, quantity, dispatch]);

  // Review Handlers
  const handleSubmitReview = () => {
    if (!rating || !comment) {
      alert("Rating and comment required");
      return;
    }

    const formData = new FormData();
    formData.append("product", product.product_uuid);
    formData.append("rating", rating);
    formData.append("comment", comment);

    imageFiles.forEach((img) => formData.append("uploaded_images", img));

    videoFiles.forEach((vid) => formData.append("uploaded_videos", vid));

    dispatch(
      createReview({
        product_uuid: product.product_uuid,
        data: formData,
        isMultipart: true,
      })
    )
      .unwrap()
      .then(() => {
        setRating(0);
        setComment("");
        setImageFiles([]);
        setVideoFiles([]);
        refreshReviews();
      });
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdateReview = () => {
    const formData = new FormData();
    formData.append("rating", editRating);
    formData.append("comment", editComment);

    dispatch(
      updateReview({
        review_id: editingReview.review_id,
        data: formData,
        isMultipart: true,
      })
    )
      .unwrap()
      .then(() => {
        setEditingReview(null);
        refreshReviews(); // ✅ refresh list
      });
  };

  const handleDeleteReview = (review_id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(
        deleteReview({
          review_id,
          product_uuid: product.product_uuid,
        })
      )
        .unwrap()
        .then(() => {
          refreshReviews();
          const event = new CustomEvent("showToast", {
            detail: {
              message: "✅ Review deleted successfully!",
              type: "success",
            },
          });
          window.dispatchEvent(event);
        })
        .catch((error) => {
          const event = new CustomEvent("showToast", {
            detail: {
              message: `❌ Failed to delete review: ${
                error.message || "Unknown error"
              }`,
              type: "error",
            },
          });
          window.dispatchEvent(event);
        });
    }
  };

  // Check if review belongs to current user using profile slice
  const isCurrentUserReview = (review) => {
    const currentEmail = profileData?.email || user?.email;
    return review?.user_name === currentEmail;
  };

  // Get reviews to display
  const displayReviews = useMemo(() => {
    return Array.isArray(reviewsState.productReviews) && reviewsState.productReviews.length > 0
      ? reviewsState.productReviews
      : Array.isArray(productFromState?.reviews)
      ? productFromState.reviews
      : [];
  }, [reviewsState.productReviews, productFromState?.reviews]);

  // Helpers for image modal/carousel
  const extractImageUrl = (img) => img?.image_url || img?.url || img;

  const openImageModal = (images, startIndex = 0) => {
    const urls = Array.isArray(images) ? images.map(extractImageUrl) : [];
    setModalImages(urls);
    setModalIndex(startIndex);
    setReviewImageModalOpen(true);
  };

  const closeImageModal = () => setReviewImageModalOpen(false);

  const prevImage = () =>
    setModalIndex((i) => (i - 1 + modalImages.length) % modalImages.length);

  const nextImage = () =>
    setModalIndex((i) => (i + 1) % modalImages.length);

  // Keyboard navigation & body scroll lock for modal
  useEffect(() => {
    if (!reviewImageModalOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") closeImageModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [reviewImageModalOpen, modalImages.length]);

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
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }
    return `₹${price}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Star rating component
  const StarRatingInput = useCallback(
    ({
      rating,
      setRating,
      hoverRating,
      setHoverRating,
      size = 24,
      readonly = false,
    }) => (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-transform ${
              readonly ? "cursor-default" : "hover:scale-110 cursor-pointer"
            }`}
            onClick={() => !readonly && setRating(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
          >
            <Star
              size={size}
              className={`${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {!readonly && (
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0
              ? `${rating} star${rating !== 1 ? "s" : ""}`
              : "Select rating"}
          </span>
        )}
      </div>
    ),
    []
  );

  // Enhanced product data with actual values
  const SportsWear9Product = useMemo(
    () => ({
      title: product?.title || "",
      price: product?.price ? formatPrice(product.price) : "₹0",
      original:
        product?.original && product.original > product.price
          ? formatPrice(product.original)
          : null,
      discount: product?.discount ? `${product.discount}% OFF` : null,
      description: product?.description || "",
      features: product?.features || [],
      specifications: product?.specifications || {},
      inStock: product?.inStock || false,
      totalStock: product?.totalStock || 0,
      rating: product?.average_rating || 0,
      reviewCount: displayReviews.length || 0,
      deliveryDate: "3-10 days",
      brand: product?.brand?.name || "SportsWear9",
      madeIn: "India",
      sustainability: "Top Quality materials",
      usage: "Professional & Casual",
      skillLevel: "Beginner to Advanced",
      material: product?.specifications?.material || "100% Recycled Polyester",
      weight: product?.specifications?.weight || "450g",
      care: product?.specifications?.care || "Machine Washable",
      activityType:
        product?.specifications?.activityType || "Running, Training, Outdoor",
      bestFor: product?.specifications?.bestFor || "All weather conditions",
    }),
    [product, displayReviews]
  );

  // Trust badges data
  const trustBadges = [
    { icon: <RefreshCw className="w-5 h-5" />, text: "Easy Returns" },
    { icon: <Award className="w-5 h-5" />, text: "Quality Certified" },
    { icon: <Leaf className="w-5 h-5" />, text: "Top Quality" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Payment" },
  ];

  // Product highlights
  const productHighlights = useMemo(
    () => [
      "Designed and tested by sports experts",
      "Suitable for multiple sports activities",
      "Durable construction for long-lasting use",
      "Comfort fit for extended wear",
      "Moisture-wicking technology",
      "Anti-odor treatment",
      ...(product?.features || []),
    ],
    [product]
  );

  const handleWishlist = () => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    // Add wishlist functionality here
    const event = new CustomEvent("showToast", {
      detail: {
        message: "❤️ Added to wishlist!",
        type: "success",
      },
    });
    window.dispatchEvent(event);
  };

  // Size Guide Modal
  const SizeGuideModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="font-semibold text-gray-900 text-lg">Size Guide</h3>
          <button
            onClick={() => setShowSizeGuide(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chest (in)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waist (in)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Height (ft)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight (kg)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    size: "S",
                    chest: "34-36",
                    waist: "30-32",
                    height: "5'4-5'7",
                    weight: "55-65",
                  },
                  {
                    size: "M",
                    chest: "38-40",
                    waist: "34-36",
                    height: "5'7-5'10",
                    weight: "65-75",
                  },
                  {
                    size: "L",
                    chest: "42-44",
                    waist: "38-40",
                    height: "5'10-6'1",
                    weight: "75-85",
                  },
                  {
                    size: "XL",
                    chest: "46-48",
                    waist: "42-44",
                    height: "6'1-6'3",
                    weight: "85-95",
                  },
                  {
                    size: "XXL",
                    chest: "50-52",
                    waist: "46-48",
                    height: "6'3-6'5",
                    weight: "95-105",
                  },
                ].map((row) => (
                  <tr key={row.size}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.size}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row.chest}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row.waist}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row.height}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row.weight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Sizes may vary slightly based on the
                  specific product. Refer to the product description for exact
                  measurements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <div className="bg-gray-200 h-20 rounded w-full"></div>
              <div className="bg-gray-200 h-12 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">
              Error loading product details
            </p>
            <p className="text-red-500 text-sm mb-4">
              {error || "Product not found"}
            </p>
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

  return (
    <>
      <SEO
        title={`${product.title} - SportsWear9`}
        description={product.description.substring(0, 160)}
        keywords={`${product.title}, sports wear, fitness gear`}
        image={
          galleryImages[0]?.url
            ? `http://127.0.0.1:8000${galleryImages[0].url}`
            : null
        }
      />
      <div className="pt-20 bg-white min-h-screen">
        {/* Main Product Section */}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
          <div className="lg:flex lg:items-start lg:gap-12">
            {/* Left Column - Product Gallery */}
            <div
              className={`lg:w-1/2 space-y-4 lg:sticky lg:top-24 lg:h-fit lg:pb-8 ${
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
            <div className="lg:w-1/2 space-y-6 px-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
              {/* Brand and Title */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    {SportsWear9Product.brand}
                  </span>
                  <button
                    onClick={handleWishlist}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Add to Wishlist</span>
                  </button>
                </div>
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
                    {SportsWear9Product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({SportsWear9Product.reviewCount} reviews)
                </span>
                {SportsWear9Product.reviewCount > 0 && (
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all reviews
                  </button>
                )}
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
                  <Leaf className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {SportsWear9Product.sustainability}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    1 Year Warranty
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              {colorsList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                      Color: {selectedColorObj?.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {colorsList.length} colors available
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {colorsList.map((color) => (
                      <button
                        key={color.key}
                        onClick={() => {
                          setSelectedColor(color.key);
                          if (color.sizes.length > 0) {
                            setSelectedSize(color.sizes[0].value);
                          }
                        }}
                        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all group ${
                          selectedColor === color.key
                            ? "border-blue-600 ring-2 ring-blue-200"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        title={color.name}
                      >
                        <div
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                          style={{ backgroundColor: color.hex || "#ccc" }}
                        ></div>
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                          {color.name}
                        </div>
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
                      Size: {selectedSize || "Select size"}
                    </h3>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Ruler className="w-4 h-4" />
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSizesForSelectedColor.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setSelectedSize(size.value)}
                        className={`relative py-2 sm:py-3 rounded-lg border font-medium transition-all text-sm sm:text-base group ${
                          selectedSize === size.value
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : size.stock_quantity === 0
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        disabled={size.stock_quantity === 0}
                        title={
                          size.stock_quantity === 0
                            ? "Out of stock"
                            : `${size.stock_quantity} in stock`
                        }
                      >
                        {size.value}
                        {size.stock_quantity === 0 && (
                          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                            <div className="w-full h-px bg-gray-400 transform rotate-45"></div>
                          </div>
                        )}
                        {size.stock_quantity > 0 &&
                          size.stock_quantity < 10 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              {size.stock_quantity}
                            </div>
                          )}
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
                  {productHighlights.slice(0, 6).map((highlight, index) => (
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
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 sm:px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center font-semibold text-sm sm:text-base">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        selectedColorObj &&
                        selectedSize &&
                        selectedColorObj.sizes.find(
                          (s) => s.value === selectedSize
                        )?.stock_quantity <= quantity
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={
                      isAuthenticated
                        ? handleAddToCart
                        : () => {
                            setAuthMode("login");
                            setAuthOpen(true);
                          }
                    }
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
                    {!SportsWear9Product.inStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart();
                      navigate("/cart");
                    }}
                    disabled={
                      !selectedColor ||
                      !selectedSize ||
                      !SportsWear9Product.inStock
                    }
                    className={`py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm sm:text-base ${
                      !selectedColor ||
                      !selectedSize ||
                      !SportsWear9Product.inStock
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gray-800 hover:bg-gray-900 text-white"
                    }`}
                  >
                    Buy Now
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
                  Frequently bought together
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
                    parseInt(
                      SportsWear9Product.price
                        .replace("₹", "")
                        .replace(/,/g, "")
                    ) + comboProducts.reduce((acc, p) => acc + p.price, 0);

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
                              <div className="mt-2 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer hover:text-blue-600 line-clamp-2">
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
                          ₹{totalPrice.toLocaleString("en-IN")}
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
                  <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                    {SportsWear9Product.description}
                  </p>

                  {/* Usage Section */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Recommended Usage
                    </h4>
                    <p className="text-gray-700 mb-4">
                      Perfect for {SportsWear9Product.activityType}. Designed
                      for {SportsWear9Product.skillLevel} level users and ideal
                      for {SportsWear9Product.bestFor}.
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer hover:text-blue-700">
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
                      "Activity Type": SportsWear9Product.activityType,
                      "Skill Level": SportsWear9Product.skillLevel,
                      ...SportsWear9Product.specifications,
                    })
                      .filter(([key, value]) => value && value !== "")
                      .map(([key, value]) => (
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
                  <h3 className="text-lg font-semibold mb-6">
                    Customer Reviews
                  </h3>

                  {/* Submit Review Form */}
                  <div className="bg-gray-50 border rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-lg mb-4">
                      Write a Review
                    </h3>

                    <StarRatingInput
                      rating={rating}
                      setRating={setRating}
                      hoverRating={hoverRating}
                      setHoverRating={setHoverRating}
                    />

                    <textarea
                      className="w-full mt-4 border rounded-lg p-3"
                      rows="4"
                      placeholder="Share your experience with this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    {/* File Upload Section */}
                    <div className="mt-6 space-y-4">
                      {/* Photo Upload */}
                      <div className="border border-gray-300 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-medium">
                              Upload Photos
                            </span>
                            <span className="text-xs text-gray-500">
                              (Optional)
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {imageFiles.length > 0
                              ? `${imageFiles.length} file(s) selected`
                              : "No files selected"}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-medium">Choose Photos</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                setImageFiles([...e.target.files])
                              }
                            />
                          </label>
                          <span className="text-sm text-gray-600">
                            JPG, PNG, GIF (Max 5MB each)
                          </span>
                        </div>

                        {/* Preview selected images */}
                        {imageFiles.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                              {Array.from(imageFiles).map((file, index) => (
                                <div key={index} className="relative group">
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                    {file.type.startsWith("image/") && (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFiles = [...imageFiles];
                                      newFiles.splice(index, 1);
                                      setImageFiles(newFiles);
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video Upload */}
                      <div className="border border-gray-300 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-medium">
                              Upload Videos
                            </span>
                            <span className="text-xs text-gray-500">
                              (Optional)
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {videoFiles.length > 0
                              ? `${videoFiles.length} file(s) selected`
                              : "No files selected"}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-medium">Choose Videos</span>
                            <input
                              type="file"
                              multiple
                              accept="video/*"
                              className="hidden"
                              onChange={(e) =>
                                setVideoFiles([...e.target.files])
                              }
                            />
                          </label>
                          <span className="text-sm text-gray-600">
                            MP4, MOV (Max 50MB each)
                          </span>
                        </div>

                        {/* Preview selected videos */}
                        {videoFiles.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                              {Array.from(videoFiles).map((file, index) => (
                                <div key={index} className="relative group">
                                  <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                    <div className="text-white text-xs text-center p-2">
                                      <div className="font-bold">VIDEO</div>
                                      <div className="truncate max-w-[60px]">
                                        {file.name.split(".")[0]}
                                      </div>
                                      <div className="text-gray-400">
                                        .{file.name.split(".").pop()}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFiles = [...videoFiles];
                                      newFiles.splice(index, 1);
                                      setVideoFiles(newFiles);
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitReview}
                      disabled={!rating || !comment}
                      className={`mt-6 w-full py-3 rounded-lg font-semibold transition-colors ${
                        !rating || !comment
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Submit Review
                    </button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {displayReviews.length > 0 ? (
                      displayReviews.map((review) => {
                        // Skip reviews with null rating if you want
                        if (review.rating === null) return null;

                        return (
                          <div
                            key={review.review_id || review.id}
                            className="border rounded-lg p-5 bg-white shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {review.user_name || "Anonymous User"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {formatDate(review.created_at || review.date)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <StarRatingInput
                                  rating={review.rating || 0}
                                  readonly
                                  size={16}
                                />
                              </div>
                            </div>

                            {review.comment && review.comment.trim() !== "" && (
                              <p className="mt-3 text-gray-700 leading-relaxed">
                                {review.comment}
                              </p>
                            )}

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                  Customer Photos:
                                </p>
                                <div className="flex gap-3 flex-wrap">
                                  {review.images.map((img, i) => {
                                    const imageUrl = extractImageUrl(img);
                                    return (
                                      <div key={img.image_uuid || img.id || imageUrl} className="relative">
                                        <button
                                          type="button"
                                          onClick={() => openImageModal(review.images, i)}
                                          className="block p-0 rounded-lg overflow-hidden"
                                        >
                                          <img
                                            src={imageUrl}
                                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                            alt="Customer review photo"
                                            loading="lazy"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src =
                                                "https://via.placeholder.com/96?text=Image+Error";
                                            }}
                                          />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => window.open(imageUrl, "_blank")}
                                          className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow text-gray-600 hover:text-gray-800"
                                          title="Open full image in new tab"
                                        >
                                          <ZoomIn className="w-4 h-4" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Review Videos */}
                            {review.videos && review.videos.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                  Customer Videos:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {review.videos.map((vid, i) => {
                                    const videoUrl =
                                      vid.video_url || vid.url || vid;
                                    return (
                                      <div key={i} className="relative">
                                        <video
                                          controls
                                          className="w-full rounded-lg border border-gray-200"
                                          src={videoUrl}
                                          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M40 30 L70 50 L40 70 Z' fill='%239ca3af'/%3E%3C/svg%3E"
                                        >
                                          <source
                                            src={videoUrl}
                                            type="video/mp4"
                                          />
                                          Your browser does not support the
                                          video tag.
                                        </video>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* EDIT / DELETE - only if user is authenticated and owns review */}
                            {isAuthenticated && isCurrentUserReview(review) && (
                              <div className="flex gap-4 mt-4 pt-3 border-t border-gray-200">
                                <button
                                  onClick={() => startEdit(review)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <Edit2 size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteReview(
                                      review.review_id || review.id
                                    )
                                  }
                                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-2">
                          No reviews yet
                        </p>
                        <p className="text-gray-500 mb-4">
                          Be the first to share your experience!
                        </p>
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

        {/* Edit Review Modal */}
        {editingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Edit Your Review
                </h3>
                <button
                  onClick={() => setEditingReview(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <StarRatingInput
                    rating={editRating}
                    setRating={setEditRating}
                    hoverRating={hoverRating}
                    setHoverRating={setHoverRating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review
                  </label>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditingReview(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateReview}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    disabled={!editRating || !editComment}
                  >
                    Update Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Size Guide Modal */}
        {showSizeGuide && <SizeGuideModal />}

        {/* Auth Modal */}
        {authOpen && (
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} setMode={setAuthMode} />
        )}
      </div>
    </>
  );
};
export default ProductInfo;

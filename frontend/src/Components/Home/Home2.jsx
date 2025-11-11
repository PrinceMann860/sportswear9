
import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectAllProducts,
  selectProductsLoading,
  selectProductsError,
} from "../Product/productslice";
import {
  fetchHomepageLevels,
  selectHomepageLevels,
  selectHomepageLoading,
  selectHomepageError,
} from "./HomePageSlice"; // Import from your slice
import { ProductCard } from "../Product/Product";
import { Link } from "react-router-dom";
import PopularProductsCarousel from "../Decath/PopularProductsCarousel";
import ProductCarouselWithTitle from "../Decath/ProductCarouselWithTitle";
import CategoryGrid from "../Decath/CategoryGrid";
import LandscapeCarousel from "../Banner&Carousels/LandscapeCarousel";
import SportsGearCarousel from "../Decath/SportsGearCarousel";
import FestiveDealsGrid from "../Decath/FestiveDealsGrid";
import BMSMBanner from "../../assets/BMSM.jpg"
import HorizontalScrollCarousel from "../Banner&Carousels/HorizontalScrollCarousel";
import RecommendedProducts from "./RecommendedProducts";
import VideoGrid from "./VideoGrid";
import { DealsOfTheDay } from "../Banner&Carousels/DealsOfTheDay";
import { fetchBrands } from "../Brands/brandlistslice";

import logo1 from "../../assets/1.svg";
import logo2 from "../../assets/2.svg";
import logo3 from "../../assets/3.svg";
import logo4 from "../../assets/4.svg";
import logo5 from "../../assets/5.svg";
import logo6 from "../../assets/6.svg";
import SportsCategorySection from "./SportsCategorysection";
import SkeletonLoader from "./SkeletonLoader";

// ✅ Filtering Helpers
const transformProductData = (product) => ({
  id: product.product_uuid,
  title: product.name,
  price: `${product.price}`,
  original: product.original,
  discount: product.discount,
  brand: product.brand?.name,
  category: product.category?.name,
  img:
    `http://127.0.0.1:8000/${product.img}` ||
    "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/022814da-3098-4c8e-b6f9-3692dc1b4207/W+FLEX+EXPERIENCE+RN+12.png",
  img2:
    `http://127.0.0.1:8000/${product.img2}` ||
    "https://acrossports.s3.amazonaws.com/productPhotos/NIKE/DV0746004/DV0746004_6.jpg",
  isFeatured: product.is_featured,
});

// ✅ Hardcoded fallback data in case API fails
const fallbackData = [
  {
    level_uuid: "LVL-3F3NNHU6RQ",
    name: "Level 1",
    order: 1,
    sections: [
      {
        section_uuid: "SEC-JRJ3BTA81YDS",
        title: "section 1",
        section_type: "carousel",
        order: 2,
        extra_config: {},
        items: [
          {
            item_uuid: "ITM-JH23SY0KK0ZWGJ",
            image: "http://127.0.0.1:8000/media/homepage/defaut.avif",
            title: "banner 1",
            link: "",
            order: 1
          },
          {
            item_uuid: "ITM-F4AA2NB2JUMOT0",
            image: "http://127.0.0.1:8000/media/homepage/defaut_1.avif",
            title: "banner 1",
            link: "",
            order: 2
          },
          {
            item_uuid: "ITM-QG9LXY841QZVFP",
            image: "http://127.0.0.1:8000/media/homepage/defaut_1_SZpsUR6.avif",
            title: "banner 3",
            link: "",
            order: 3
          }
        ]
      },
      {
        section_uuid: "SEC-QXWVJQMNS36Z",
        title: "section 2",
        section_type: "filter",
        order: 3,
        extra_config: {},
        items: [
          {
            item_uuid: "ITM-I56NFBXWIA7CQN",
            image: "http://127.0.0.1:8000/media/homepage/defaut.png",
            title: "Winter Ready",
            link: "",
            order: 1
          },
          {
            item_uuid: "ITM-DG3KA5E0RU23VO",
            image: "http://127.0.0.1:8000/media/homepage/defaut2.png",
            title: "Activewear",
            link: "",
            order: 2
          },
          {
            item_uuid: "ITM-5QASR4C4W6EALE",
            image: "http://127.0.0.1:8000/media/homepage/defaut3.png",
            title: "Gym & Fintness",
            link: "",
            order: 3
          },
          {
            item_uuid: "ITM-Y1XHC4ATD6NM7P",
            image: "http://127.0.0.1:8000/media/homepage/defaut4.png",
            title: "cycling",
            link: "",
            order: 4
          },
          {
            item_uuid: "ITM-1EV6ERLIXMPIXX",
            image: "http://127.0.0.1:8000/media/homepage/defaut5.png",
            title: "Hiking & Treking",
            link: "",
            order: 5
          },
          {
            item_uuid: "ITM-CVR2LWA74VD9A8",
            image: "http://127.0.0.1:8000/media/homepage/defaut6.png",
            title: "shoes",
            link: "",
            order: 6
          },
          {
            item_uuid: "ITM-LDC34VLNYY7W7N",
            image: "http://127.0.0.1:8000/media/homepage/defaut7.png",
            title: "Bags & Backpacks",
            link: "",
            order: 7
          },
          {
            item_uuid: "ITM-NOY79LFXTHDJCS",
            image: "http://127.0.0.1:8000/media/homepage/defaut8.png",
            title: "Sports Accessories",
            link: "",
            order: 8
          }
        ]
      },
      {
        section_uuid: "SEC-I3WBNXWOQN7Q",
        title: "floor-1",
        section_type: "filter",
        order: 1,
        extra_config: {},
        items: [
          {
            item_uuid: "ITM-0SBLXF232M0DIP",
            image: "http://127.0.0.1:8000/media/homepage/1.png",
            title: "Men's activewear",
            link: "",
            order: 1
          },
          {
            item_uuid: "ITM-F29ISWDQY7S4LE",
            image: "http://127.0.0.1:8000/media/homepage/2.png",
            title: "Women's activewear",
            link: "",
            order: 2
          },
          {
            item_uuid: "ITM-2Q3TYTVEIM0VPJ",
            image: "http://127.0.0.1:8000/media/homepage/3.png",
            title: "Swimwear",
            link: "",
            order: 3
          },
          {
            item_uuid: "ITM-WMC0UNAI8JAHGI",
            image: "http://127.0.0.1:8000/media/homepage/4.png",
            title: "Accessories",
            link: "",
            order: 4
          },
          {
            item_uuid: "ITM-9B7OYA62DDQB2D",
            image: "http://127.0.0.1:8000/media/homepage/5.png",
            title: "Compression wear",
            link: "",
            order: 5
          },
          {
            item_uuid: "ITM-9ILWNLSYHFUCV6",
            image: "http://127.0.0.1:8000/media/homepage/6.png",
            title: "Cycling gear",
            link: "",
            order: 6
          },
          {
            item_uuid: "ITM-RW2YCCQYZGKWJV",
            image: "http://127.0.0.1:8000/media/homepage/7.png",
            title: "Protection",
            link: "",
            order: 7
          },
          {
            item_uuid: "ITM-EM49RU7ZKKOBIQ",
            image: "http://127.0.0.1:8000/media/homepage/8.png",
            title: "Winterwear",
            link: "",
            order: 8
          },
          {
            item_uuid: "ITM-FRKNKHY791WSQI",
            image: "http://127.0.0.1:8000/media/homepage/9.png",
            title: "Football wear",
            link: "",
            order: 9
          },
          {
            item_uuid: "ITM-781T2EL4VMR9FL",
            image: "http://127.0.0.1:8000/media/homepage/10.png",
            title: "Yoga wear",
            link: "",
            order: 10
          }
        ]
      }
    ]
  }
];

// ✅ Fallback data for other sections
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
    logo: logo2,
  },
  {
    image:
      "https://bullarfitness.com/cdn/shop/files/Accessories.jpg?v=1740035011&width=1100", // Purple background
    deal: "BUY 1 GET 1 FREE",
    look: "Premium Collections",
    logo: logo3,
  },
  {
    image:
      "https://www.verywellfit.com/thmb/Eyv2XS6jfnBy9nSnCLHe_9A71TU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/vwt-product-reebok-nano-x2-training-shoes-tstaples-133-e73e0a61fe50493daf72e839cd53dfdf.jpg", // Orange background
    deal: "UP TO 70% OFF",
    look: "Footwear & Accessories",
    logo: logo4,
  },
  {
    image:
      "https://www.fitlineindia.com/cdn/shop/files/WhatsApp_Image_2022-05-19_at_5.53.38_PM.jpg?v=1653037917&width=1500", // Deep Purple background
    deal: "EXTRA 20% OFF",
    look: "Clearance Event",
    logo: logo5,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDU7OcmNBhqYI7DCu3wOmtEOCwyTOzhknEU490QpBwnI4ngrWe1kzpwyy06N33fyeQkRo&usqp=CAU", // Emerald Green background
    deal: "NEW COLORS",
    look: "Comfort Collection",
    logo: logo6,
  },
];
const malecards = [
  {
    name: "Shorts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKo8RqkmIIBQO35p5jYlWdHMsRfGvAtAEGWPydt4a_gg5R-OuYfmA-d0LV35dL4iZePY&usqp=CAU",
    link: "#",
  },
  {
    name: "Shorts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKo8RqkmIIBQO35p5jYlWdHMsRfGvAtAEGWPydt4a_gg5R-OuYfmA-d0LV35dL4iZePY&usqp=CAU",
    link: "#",
  },
  {
    name: "Shorts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKo8RqkmIIBQO35p5jYlWdHMsRfGvAtAEGWPydt4a_gg5R-OuYfmA-d0LV35dL4iZePY&usqp=CAU",
    link: "#",
  },
  {
    name: "Shorts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKo8RqkmIIBQO35p5jYlWdHMsRfGvAtAEGWPydt4a_gg5R-OuYfmA-d0LV35dL4iZePY&usqp=CAU",
    link: "#",
  },
  {
    name: "Shorts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKo8RqkmIIBQO35p5jYlWdHMsRfGvAtAEGWPydt4a_gg5R-OuYfmA-d0LV35dL4iZePY&usqp=CAU",
    link: "#",
  },
  {
    name: "Shorts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOKo8RqkmIIBQO35p5jYlWdHMsRfGvAtAEGWPydt4a_gg5R-OuYfmA-d0LV35dL4iZePY&usqp=CAU",
    link: "#",
  },
];
const femalecards = [
  {
    name: "Leggings",
    image:
      "https://d3jbu7vaxvlagf.cloudfront.net/small/v2/category_media/basic_img_16886374027945.jpg",
    link: "#",
  },
  {
    name: "Leggings",
    image:
      "https://d3jbu7vaxvlagf.cloudfront.net/small/v2/category_media/basic_img_16886374027945.jpg",
    link: "#",
  },
  {
    name: "Leggings",
    image:
      "https://d3jbu7vaxvlagf.cloudfront.net/small/v2/category_media/basic_img_16886374027945.jpg",
    link: "#",
  },
  {
    name: "Leggings",
    image:
      "https://d3jbu7vaxvlagf.cloudfront.net/small/v2/category_media/basic_img_16886374027945.jpg",
    link: "#",
  },
  {
    name: "Leggings",
    image:
      "https://d3jbu7vaxvlagf.cloudfront.net/small/v2/category_media/basic_img_16886374027945.jpg",
    link: "#",
  },
  {
    name: "Leggings",
    image:
      "https://d3jbu7vaxvlagf.cloudfront.net/small/v2/category_media/basic_img_16886374027945.jpg",
    link: "#",
  },
];

function Home2() {
  const dispatch = useDispatch();
  const apiProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  // ✅ Use Redux for homepage data
  const homepageData = useSelector(selectHomepageLevels);
  const homepageLoading = useSelector(selectHomepageLoading);
  const homepageError = useSelector(selectHomepageError);

  const { brands } = useSelector((state) => state.brandlist);

  const [selectedGender, setSelectedGender] = useState("men");

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchHomepageLevels()); // Use Redux action instead of direct fetch
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const products = apiProducts.map(transformProductData);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.slice(0, 6);

  // ✅ Extract sections from API data with fallback
  const getSectionData = (sectionTitle) => {
    const dataToUse = homepageData && homepageData.length > 0 ? homepageData : fallbackData;
    
    if (!dataToUse || !dataToUse[0]?.sections) return [];
    
    const level = dataToUse[0];
    const section = level.sections.find(sec => sec.title === sectionTitle);
    return section ? section.items : [];
  };

  // ✅ Transform API items to match component format
  const transformToCarouselItems = (items) => {
    return items.map(item => ({
      id: item.item_uuid,
      image: item.image,
      title: item.title,
      link: item.link,
    }));
  };

  const transformToCategoryItems = (items) => {
    return items.map(item => ({
      name: item.title,
      image: item.image,
      link: item.link,
    }));
  };

  if (loading || homepageLoading)
    return (
      <div className="text-center py-10">
        <SkeletonLoader />
      </div>
    );
  
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    // <main className="w-full bg-white pt-20 overflow-x-hidden">
    <main className="w-full bg-white pt-20">
      <div>
        {/* ✅ Top Section */}
         
          {/* ✅ Section 2 - Top Category Grid */}
          <CategoryGrid 
            categories={transformToCategoryItems(getSectionData("floor-1"))} 
          />
          
           
            {/* ✅ Best selling Products */}
            <section className="px-2 sm:px-4 md:px-6 max-w-full">
              <PopularProductsCarousel products={featuredProducts} />
            </section>
           

          {/* ✅ Section 1 - Landscape Carousel */}
          <div className="w-full max-w-full mx-auto p-5 lg:p-10 rounded-2xl overflow-hidden">
            <LandscapeCarousel 
              items={transformToCarouselItems(getSectionData("floor-2"))} 
            />
          </div>
         

        {/* ✅ Floor 1 - Category Grid Below Banners */}
         
          <div className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full">
            <CategoryGrid
              title="Shop by Category"
              subtitle="Find Your Perfect Gear"
              categories={transformToCategoryItems(getSectionData("floor-1"))}
              columns="grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
              className="mb-12"
            />
          </div>
         

        {/* ✅ Rest of your existing sections remain the same */}
         
          <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full">
            <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {featuredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No featured products available.</p>
            )}
          </section>
         

        {/* ✅ Sports Gear */}
         
          <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14">
            <SportsGearCarousel
              title="Unite & Play: Shop Sports Gear"
              items={sportsGearItems}
            />
          </div>
         
        {/* ✅ Trusted Brands */}
         
          <section className="mt-12 sm:px-4 md:px-6 lg:px-12 xl:px-14 px-6 mx-auto max-w-full">
            <h2 className="font-semibold text-3xl md:text-4xl text-center">
              Trusted by Iconic Brands
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Discover collections from globally loved athletic and lifestyle
              brands.
            </p>
            <div className="my-8 grid grid-cols-5 md:grid-cols-6 xl:grid-cols-9 gap-4 sm:gap-6 max-w-full">
              {brands.map((brand, i) => (
                <Link
                  to={`/brand/${brand.name}`}
                  key={i}
                  className="flex flex-col items-center text-center hover:scale-105 transition"
                >
                  <div className="w-16 h-16 sm:w-30 sm:h-30 rounded-full overflow-hidden border border-gray-400 p-1 md:p-4 shadow-md">
                    <img
                      src={brand.logo}
                      className="w-full h-full object-cover"
                      alt={brand.name}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
         

        {/* ✅ Video Section */}
         
          <section className="mx-auto text-center px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 max-w-full">
            <h2 className="font-semibold text-xl md:text-4xl">
              Your Passion. Your Performance.
            </h2>
            <VideoGrid />
          </section>
         

        {/* ✅ Festive Deals */}
         
          <FestiveDealsGrid
            title="Festive Steal Deals!"
            items={festiveStealDeals}
          />
         

        {/* ✅ Product Carousel */}
         
          <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full">
            <ProductCarouselWithTitle
              title="The perfect Shoes is waiting"
              products={featuredProducts}
            />
          </section>
         

        {/* ✅ Horizontal Scroll Carousel */}
        {/*  
          <section className="mt-5 p-5 px-2 sm:px-4 md:px-6 lg:px-12 xl:px-14 mx-auto max-w-full">
            <h2 className="text-center text-3xl font-bold">
              Curated Deals for Every Mood
            </h2>
            <div className="mt-10">
              <HorizontalScrollCarousel items={festiveDeals} speed={0.3} />
            </div>
          </section>
          */}

        {/* ✅ Recommended Products */}
        {/*  
          <RecommendedProducts />
          */}

        {/* ✅ Deals of the Day */}
         
          <div className="px-2 sm:px-4 md:px-6 lg:px-12 mx-auto max-w-full">
            <DealsOfTheDay
              title="Shop Now: Deals of the Day"
              items={promoCards}
            />
          </div>
         



        {/* ✅ Trending Products */}
         
          <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full mt-10">
            <h2 className="text-2xl font-bold mb-4">TRENDING PRODUCTS</h2>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No featured products available.</p>
            )}
          </section>
         

        {/* ✅ Sale Video Banner */}
         
          <div className="w-full max-w-full mx-auto p-5 lg:p-10 rounded-2xl overflow-hidden">
            <LandscapeCarousel 
              items={transformToCarouselItems(getSectionData("floor-4"))} 
            />
          </div>
         

        {/* ✅ Shop by Gender */}
         
          <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full my-10">
            <div className="w-full flex justify-between">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">FEATURED <span className="font-semibold">CATEGORIES</span></h2>
              <div className="flex gap-4 mb-6 border p-1 lg:p-2 rounded-lg lg:mr-[10%]">
                {["men", "women"].map((gender) => (
                  <button
                    key={gender}
                    className={`px-4 md:px-10 py-1 lg:px-16 sm:py-2 rounded-lg md:text-xl lg:text-2xl xl:text-3xl ${
                      selectedGender === gender
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setSelectedGender(gender)}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {selectedGender === "men" && (
              <SportsGearCarousel title="Mens Products" items={malecards} />
            )}

            {selectedGender === "women" && (
              <SportsGearCarousel title="Women Products" items={femalecards} />
            )}
          </section>
         
        {/* ✅ New Arrivals */}
         
          <section className="px-2 sm:px-4 md:px-6 lg:px-12 xl:px-16 max-w-full">
            <h2 className="text-2xl font-bold mb-4">New Arrivals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
         

        {/* ✅ Sports Category Section */}
         
          <SportsCategorySection />
         

        {/* ✅ Final Banner Images */}
         
          <div className="px-2 sm:px-4 md:px-6 lg:px-12 mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 w-full mb-10 overflow-hidden max-w-full">
            {transformToCategoryItems(getSectionData("floor-5")).map((imgs, index) => (
              <img
                key={index}
                src={imgs.image}
                alt=""
                className="w-full h-full object-fill cursor-pointer hover:scale-102"
              />
            ))}
          </div>
         

        {/* ✅ Final Banner */}
         
          <div className="w-full px-2 md:px-5 lg:px-10">
            <img
              src={BMSMBanner}
              alt="Buy More Save More"
              className="w-full h-auto max-w-full border rounded-2xl md:rounded-4xl"
            />
          </div>
         
      </div>

      {/* ✅ Testimonials Section */}
       
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
                <div>
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
       

      {/* ✅ Available On */}
       
        <section className="max-w-full">
          <div className="text-center lg:px-4 pt-10 lg:pb-10 max-w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 underline underline-offset-4">
              WE ARE AVAILABLE ON
            </h2>

            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap w-full my-10 max-w-full px-4">
              {[
                {
                  src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                  alt: "Amazon",
                },
                {
                  src: "https://images.ctfassets.net/drk57q8lctrm/4QgGDTtQYDx6oDaW3aU7KS/34163f3bef6d82fd354a7455d07102eb/flipkart-logo.webp",
                  alt: "Flipkart",
                },
                {
                  src: "https://www.corecommunique.com/wp-content/uploads/2017/07/Shopclues-new.png",
                  alt: "ShopClues",
                },
                {
                  src: "https://vectorseek.com/wp-content/uploads/2025/05/Meesho-Logo-PNG-SVG-Vector.png",
                  alt: "Meesho",
                },
              ].map((brand, i) => (
                <img
                  key={i}
                  src={brand.src}
                  alt={brand.alt}
                  className="h-5 sm:h-6 md:h-8 lg:h-10 xl:h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              ))}
            </div>
          </div>
        </section>
       
    </main>
  );
}

export default Home2;

// ✅ END OF UPDATED HOME.JSX

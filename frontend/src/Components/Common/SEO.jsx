import React from "react";
import { Helmet } from "@dr.pogodin/react-helmet"

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage,
  ogImageAlt,
  productData,
  author = "Sportswear9",
  structuredData,
}) => {
  const baseUrl = window.location.origin;
  const currentUrl = canonical || window.location.href;
  
  // Default meta image
  const defaultImage = `${baseUrl}/logo_black.svg`;
  const metaImage = ogImage || defaultImage;
  
  // Generate structured data for products
  const generateProductSchema = () => {
    if (!productData) return null;
    
    const images = productData.variants
      ?.flatMap(v => v.images || [])
      .map(img => `${baseUrl}${img.url}`) || [];
    
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productData.name,
      "description": productData.description,
      "image": images,
      "brand": {
        "@type": "Brand",
        "name": productData.brand?.name || "SportStore"
      },
      "offers": {
        "@type": "Offer",
        "url": currentUrl,
        "priceCurrency": "INR",
        "price": productData.net || productData.price,
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "availability": productData.variants?.some(v => v.sizes?.some(s => s.is_available))
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      "aggregateRating": productData.average_rating ? {
        "@type": "AggregateRating",
        "ratingValue": productData.average_rating,
        "reviewCount": productData.reviews?.length || 0
      } : undefined,
      "sku": productData.product_uuid,
      "category": productData.category
    };
  };

  const schemaData = productData ? generateProductSchema() : structuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={metaImage} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:site_name" content="SportStore" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
      
      {/* Additional Product Images for SEO */}
      {productData?.variants?.flatMap(v => v.images || []).map((img, idx) => (
        <meta key={idx} property="og:image" content={`${baseUrl}${img.url}`} />
      ))}
    </Helmet>
  );
};

export default SEO;

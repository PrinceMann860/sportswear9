const SkeletonLoader = ({ type, count = 1 }) => {
  const renderCarouselSkeleton = () => (
    <div className="relative w-full">
      <div className="flex overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-xl overflow-hidden animate-pulse"
              style={{ width: '91px', height: '182px' }}
            >
              <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-3 gap-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-1 w-1 rounded-full bg-gray-300 animate-pulse"
          />
        ))}
      </div>
    </div>
  );

  const renderBannerSkeleton = () => (
    <div className="relative w-full">
      <div
        className="w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"
        style={{ height: '15.3061vw', minHeight: '60px' }}
      />
      <div className="flex justify-center items-center mt-2 gap-1.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-pulse"
          />
        ))}
      </div>
    </div>
  );

  const renderProductCardSkeleton = () => (
    <div className="w-full rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );

  const renderProductGridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderProductCardSkeleton()}</div>
      ))}
    </div>
  );

  const renderFullWidthBannerCarousel = () => (
    <div className="relative w-full animate-pulse">
      <div className="h-[199px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="flex justify-center items-center mt-2 gap-1.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-1.5 w-1.5 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'carousel':
      return renderCarouselSkeleton();
    case 'banner':
      return renderBannerSkeleton();
    case 'productCard':
      return renderProductCardSkeleton();
    case 'productGrid':
      return renderProductGridSkeleton();
    case 'fullWidthBannerCarousel':
      return renderFullWidthBannerCarousel();
    default:
      return null;
  }
};

export default SkeletonLoader;

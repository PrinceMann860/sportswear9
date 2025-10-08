import FullWidthBanner from '../Common/FullWidthBanner';
import SkeletonLoader from '../Common/SkeletonLoader';

const PromoCarousel = ({ loading }) => {
  const promoBanners = [
    {
      id: 1,
      image: 'https://media.wellmed.workers.dev/?file=MFXFCWSNJ5JVQZKIKFUVSMLWJXQ3U&mode=inline',
      imageWebp: 'https://media.wellmed.workers.dev/?file=MFXFCWSNJ5JVQZKIKFUVSMLWJXQ3U&mode=inline',
      alt: 'Fashion Sale',
      bgColor: '#F5F0EF'
    },
    {
      id: 2,
      image: 'https://media.wellmed.workers.dev/?file=I52VCN2FNZWHUZZRO5HE6TJZKYP5Q&mode=inline',
      imageWebp: 'https://media.wellmed.workers.dev/?file=I52VCN2FNZWHUZZRO5HE6TJZKYP5Q&mode=inline',
      alt: 'New Collection',
      bgColor: '#E5FFFF'
    },
    {
      id: 3,
      image: 'https://media.wellmed.workers.dev/?file=GBFHMM2QGFTEQMTWIF2XERLKJEHPY&mode=inline',
      imageWebp: 'https://media.wellmed.workers.dev/?file=GBFHMM2QGFTEQMTWIF2XERLKJEHPY&mode=inline',
      alt: 'Sports Collection',
      bgColor: '#EDF8F3'
    }
    ,
  {
    id: 4,
    image: 'https://media.wellmed.workers.dev/?file=MZTDIWBTIZQWQ2TPOR4TM6LUMRKH6&mode=inline',
    imageWebp: 'https://media.wellmed.workers.dev/?file=MZTDIWBTIZQWQ2TPOR4TM6LUMRKH6&mode=inline',
    alt: 'Outdoor Gear',
    bgColor: '#FFF0F3'
  },
  {
    id: 5,
    image: 'https://media.wellmed.workers.dev/?file=JFLESTCQJZTUUNLHLFNGCSSNGTEY4&mode=inline',
    imageWebp: 'https://media.wellmed.workers.dev/?file=JFLESTCQJZTUUNLHLFNGCSSNGTEY4&mode=inline',
    alt: 'Winter Favorites',
    bgColor: '#E5F6FF'
  }
]

  if (loading) {
    return (
      <div className="w-full bg-white py-3 sm:py-4">
        <SkeletonLoader type="fullWidthBannerCarousel" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-3 sm:py-4">
      <FullWidthBanner banners={promoBanners} />
    </div>
  );
};

export default PromoCarousel;

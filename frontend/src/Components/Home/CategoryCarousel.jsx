import HorizontalScrollCarousel from '../Common/HorizontalScrollCarousel';
import SkeletonLoader from '../Common/SkeletonLoader';

const CategoryCarousel = ({ loading }) => {
  const categoryItems = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1667073/pexels-photo-1667073.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/1667073/pexels-photo-1667073.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'T-Shirts',
      bgColor: '#EEF3F6'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'Jeans',
      bgColor: '#E9FBFA'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'Shoes',
      bgColor: '#FAEBF0'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/4904828/pexels-photo-4904828.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/4904828/pexels-photo-4904828.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'Jackets',
      bgColor: '#F7F6EE'
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/1159670/pexels-photo-1159670.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/1159670/pexels-photo-1159670.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'Watches',
      bgColor: '#F1F3F3'
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/1449667/pexels-photo-1449667.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/1449667/pexels-photo-1449667.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'Bags',
      bgColor: '#ECF9F1'
    },
    {
      id: 7,
      image: 'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'Sunglasses',
      bgColor: '#F6F5EF'
    },
    {
      id: 8,
      image: 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400',
      imageWebp: 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=400&fm=webp',
      alt: 'Sportswear',
      bgColor: '#E5F3FF'
    }
  ];

  if (loading) {
    return <SkeletonLoader type="carousel" />;
  }

  return (
    <div className="w-full py-3 sm:py-4 bg-white">
      <HorizontalScrollCarousel items={categoryItems} />
    </div>
  );
};

export default CategoryCarousel;

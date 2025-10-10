import React from 'react';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  const categories = [
    {
      id: 'men',
      name: 'Men',
      image: 'https://images.pexels.com/photos/1667073/pexels-photo-1667073.jpeg?auto=compress&cs=tinysrgb&w=800',
      subcategories: ['T-Shirts', 'Shirts', 'Jeans', 'Shoes', 'Accessories']
    },
    {
      id: 'women',
      name: 'Women',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      subcategories: ['Tops', 'Dresses', 'Jeans', 'Shoes', 'Accessories']
    },
    {
      id: 'kids',
      name: 'Kids',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
      subcategories: ['T-Shirts', 'Dresses', 'Shoes', 'Toys', 'Accessories']
    },
    {
      id: 'sports',
      name: 'Sports',
      image: 'https://images.pexels.com/photos/4904828/pexels-photo-4904828.jpeg?auto=compress&cs=tinysrgb&w=800',
      subcategories: ['Running', 'Gym', 'Football', 'Basketball', 'Equipment']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-gray-600">Discover our wide range of products across different categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">{category.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      to={`/category/${category.id}/${sub.toLowerCase()}`}
                      className="block text-sm text-gray-600 hover:text-red-500 transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/category/${category.id}`}
                  className="mt-4 block w-full text-center py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  View All {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
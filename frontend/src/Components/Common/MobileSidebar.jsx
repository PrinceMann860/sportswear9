import { useState, useEffect } from 'react';
import { X, ChevronRight, User, Heart, ShoppingBag, Gift, HelpCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ad1 from '../../assets/ad1.png'
import ad2 from '../../assets/ad2.png'

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const categories = [
    {
      id: 'men',
      name: 'Men',
      subcategories: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Jeans', 'Casual Trousers', 'Sports Shoes', 'Casual Shoes']
    },
    {
      id: 'women',
      name: 'Women',
      subcategories: ['Kurtas & Suits', 'Tops', 'T-Shirts', 'Dresses', 'Jeans', 'Heels', 'Flats']
    },
    {
      id: 'kids',
      name: 'Kids',
      subcategories: ['T-Shirts', 'Shirts', 'Jeans', 'Dresses', 'Tops', 'Toys']
    },
    {
      id: 'sports',
      name: 'Sports',
      subcategories: ['Running Shoes', 'Gym Wear', 'Sports Equipment', 'Tracksuits', 'Swimwear']
    }
  ];

  const menuItems = [
    { icon: HelpCircle, label: 'Help Center', path: '/help' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 md:hidden ${
          isOpen ? 'opacity-50 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                {user ? (
                  <>
                    <p className="font-semibold text-sm text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500">Welcome back!</p>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="font-semibold text-sm text-pink-500"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Shop By Category
                </h3>
              </div>

              {categories.map((category) => (
                <div key={category.id} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedCategory === category.id ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedCategory === category.id ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="bg-gray-50 py-2">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleNavigation(`/category/${category.id}/${sub.toLowerCase()}`)}
                          className="w-full text-left px-8 py-2 text-sm text-gray-700 hover:text-pink-500 hover:bg-white transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="py-2 border-t border-gray-200">
                  <button
                    key={'Help Center'}
                    onClick={() => handleNavigation('/contact')}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Help Center</span>
                  </button>
            </div>
            <div className='flex flex-col gap-4 '>
              <Link><img src={ad2} alt="" className='w-full h-27 cursor-pointer'/></Link>
              {/* <Link><img src={ad1} alt="" className='w-full h-40 cursor-pointer'/></Link> */}
            </div>
          </div>


          {user && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors active:scale-95"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;

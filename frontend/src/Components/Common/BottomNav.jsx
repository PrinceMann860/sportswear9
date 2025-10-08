import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'categories', icon: Search, label: 'Explore', path: '/categories' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart', path: '/cart' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
            >
              <Icon
                size={22}
                className={`${
                  active ? 'text-pink-500' : 'text-gray-600'
                } transition-colors`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[10px] mt-1 font-medium ${
                  active ? 'text-pink-500' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

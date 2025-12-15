import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const NestedDropdown = ({ 
  categories, 
  value, 
  onChange, 
  placeholder = "Select a category",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setExpandedCategories(new Set()); // Reset expanded state when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpanded = (categoryUuid, e) => {
    e.stopPropagation();
    e.preventDefault();
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryUuid)) {
      newExpanded.delete(categoryUuid);
    } else {
      newExpanded.add(categoryUuid);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSelect = (category, e) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(category.category_uuid);
    setIsOpen(false);
    setExpandedCategories(new Set()); // Reset expanded state after selection
  };

  const getSelectedCategoryName = () => {
    const findCategory = (cats, uuid) => {
      for (const cat of cats) {
        if (cat.category_uuid === uuid) return cat;
        if (cat.children) {
          const found = findCategory(cat.children, uuid);
          if (found) return found;
        }
      }
      return null;
    };
    
    const selected = findCategory(categories, value);
    return selected ? selected.name : placeholder;
  };

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.category_uuid);
    const paddingLeft = level * 20;

    return (
      <div key={category.category_uuid}>
        <div
          className={`flex items-center justify-between px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 ${
            value === category.category_uuid ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${16 + paddingLeft}px` }}
          onClick={(e) => handleSelect(category, e)}
        >
          <span className="text-sm flex-1">{category.name}</span>
          {hasChildren && (
            <button
              onClick={(e) => toggleExpanded(category.category_uuid, e)}
              className="p-1 hover:bg-blue-200 rounded transition-colors duration-150 ml-2"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-blue-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="bg-gray-25">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`input-field flex items-center justify-between w-full transition-colors duration-150 ${
          isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {getSelectedCategoryName()}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 text-gray-600"
            onClick={(e) => handleSelect({ category_uuid: '' }, e)}
          >
            <span className="text-sm">{placeholder}</span>
          </div>
          {categories.map(category => renderCategory(category))}
        </div>
      )}
    </div>
  );
};

export default NestedDropdown;
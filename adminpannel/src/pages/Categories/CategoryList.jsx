import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { categoryService } from '../../services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        ...formData,
        parent: formData.parent || null,
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.category_uuid, categoryData);
      } else {
        await categoryService.createCategory(categoryData);
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', parent: '' });
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      parent: category.parent || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (uuid) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(uuid);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', parent: '' });
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const renderCategoryOptions = (categories, level = 0) => {
    let options = [];
    categories.forEach((category) => {
      const prefix = '  '.repeat(level);
      options.push(
        <option key={category.category_uuid} value={category.category_uuid}>
          {prefix}{category.name}
        </option>
      );
      if (category.children && category.children.length > 0) {
        options = options.concat(renderCategoryOptions(category.children, level + 1));
      }
    });
    return options;
  };

  const renderCategoryCard = (category, level = 0) => {
    const marginLeft = level * 24;
    return (
      <div key={category.category_uuid} className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4" style={{ marginLeft: `${marginLeft}px` }}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              {category.slug && (
                <p className="text-gray-600 text-sm mt-1">Slug: {category.slug}</p>
              )}
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                category.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {category.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-yellow-600 hover:text-yellow-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(category.category_uuid)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="space-y-4">
            {category.children.map((child) => renderCategoryCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="input-field"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input-field"
                  placeholder="category-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="input-field"
                >
                  <option value="">No Parent (Top Level)</option>
                  {renderCategoryOptions(categories)}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No categories found. Create your first category to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => renderCategoryCard(category))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
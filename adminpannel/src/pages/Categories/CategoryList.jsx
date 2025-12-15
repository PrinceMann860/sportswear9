import React from 'react';
import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, ChevronDown, ChevronRight, FolderPlus } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../hooks/useToast';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent: '',
    is_active: true,
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
      showError('Failed to fetch categories');
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
        showSuccess('Category updated successfully');
      } else {
        await categoryService.createCategory(categoryData);
        showSuccess('Category created successfully');
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', parent: '', is_active: true });
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      showError('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      parent: category.parent || '',
      is_active: category.is_active ?? true,
    });
    setShowForm(true);
  };

  const handleAddSubCategory = (parentCategory) => {
    setFormData({
      name: '',
      slug: '',
      parent: parentCategory.category_uuid,
      is_active: true,
    });
    setShowForm(true);
  };

  const handleDelete = async (uuid) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(uuid);
        showSuccess('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
        showError('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', parent: '', is_active: true });
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

  const toggleExpanded = (categoryUuid) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryUuid)) {
      newExpanded.delete(categoryUuid);
    } else {
      newExpanded.add(categoryUuid);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleActive = async (category) => {
    try {
      const updatedData = { ...category, is_active: !category.is_active };
      await categoryService.updateCategory(category.category_uuid, updatedData);
      showSuccess(`Category ${category.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchCategories();
    } catch (error) {
      console.error('Failed to update category status:', error);
      showError('Failed to update category status');
    }
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

  const renderCategoryRow = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.category_uuid);
    const paddingLeft = level * 24;

    return (
      <React.Fragment key={category.category_uuid}>
        <tr className="hover:bg-gray-50 border-b border-gray-100">
          <td className="px-6 py-4 whitespace-nowrap" style={{ paddingLeft: `${24 + paddingLeft}px` }}>
            <div className="flex items-center">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(category.category_uuid)}
                  className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6 mr-2"></div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                {category.slug && (
                  <div className="text-xs text-gray-500">/{category.slug}</div>
                )}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <button
                onClick={() => toggleActive(category)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  category.is_active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    category.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 text-sm font-medium ${
                category.is_active ? 'text-green-700' : 'text-gray-500'
              }`}>
                {category.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {hasChildren ? `${category.children.length} subcategories` : '0'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {category.category_uuid || 'N/A'}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-3">
              <button
                onClick={() => handleAddSubCategory(category)}
                className="text-green-600 hover:text-green-900 transition-colors duration-150"
                title="Add subcategory"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(category.category_uuid)}
                className="text-red-600 hover:text-red-900 transition-colors duration-150"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && (
          <>
            {category.children.map((child) => renderCategoryRow(child, level + 1))}
          </>
        )}
      </React.Fragment>
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : formData.parent ? 'Add Subcategory' : 'Add New Category'}
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
                  disabled={!!formData.parent && !editingCategory}
                >
                  <option value="">No Parent (Top Level)</option>
                  {renderCategoryOptions(categories)}
                </select>
                {formData.parent && !editingCategory && (
                  <p className="text-sm text-blue-600 mt-1">
                    Creating subcategory under: {categories.find(c => findCategoryByUuid(c, formData.parent))?.name}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
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

      {/* Categories Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No categories found. Create your first category to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category uuid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => renderCategoryRow(category))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to find category by UUID
const findCategoryByUuid = (category, uuid) => {
  if (category.category_uuid === uuid) return category;
  if (category.children) {
    for (const child of category.children) {
      const found = findCategoryByUuid(child, uuid);
      if (found) return found;
    }
  }
  return null;
};

export default CategoryList;
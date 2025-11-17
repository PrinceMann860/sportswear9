import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Package, Image as ImageIcon, ChevronDown, ChevronRight, Palette, Save, X } from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';
import AttributeImageManager from './AttributeImageManager';

const VariantManager = ({ productUuid, product }) => {
  const [variants, setVariants] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVariants, setExpandedVariants] = useState(new Set());
  const { showSuccess, showError } = useToast();

  // Modal states
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  
  // Form data
  const [variantFormData, setVariantFormData] = useState({
    price: '',
    is_default: false,
    selectedAttributes: []
  });

  useEffect(() => {
    if (productUuid) {
      fetchData();
    }
  }, [productUuid]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [variantsData, attributesData] = await Promise.all([
        attributeService.getProductVariants(productUuid),
        attributeService.getAttributes()
      ]);
      
      setVariants(variantsData);
      setAllAttributes(attributesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showError('Failed to fetch variant data');
    } finally {
      setLoading(false);
    }
  };

  const toggleVariant = (variantId) => {
    const newExpanded = new Set(expandedVariants);
    if (newExpanded.has(variantId)) {
      newExpanded.delete(variantId);
    } else {
      newExpanded.add(variantId);
    }
    setExpandedVariants(newExpanded);
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();
    try {
      const variantData = {
        product_uuid: productUuid,
        price: variantFormData.price || '0.00',
        is_default: variantFormData.is_default,
        attribute_ids: variantFormData.selectedAttributes
      };
      
      await attributeService.createVariant(variantData);
      setShowVariantForm(false);
      resetForm();
      fetchData();
      showSuccess('Variant created successfully');
    } catch (error) {
      console.error('Failed to create variant:', error);
      showError(error.message || 'Failed to create variant');
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setVariantFormData({
      price: variant.price,
      is_default: variant.is_default,
      selectedAttributes: variant.attributes.map(attr => attr.id)
    });
    setShowVariantForm(true);
  };

  const handleUpdateVariant = async (e) => {
    e.preventDefault();
    try {
      const variantData = {
        attribute_ids: variantFormData.selectedAttributes
      };
      
      await attributeService.updateVariant(editingVariant.id, variantData);
      setShowVariantForm(false);
      setEditingVariant(null);
      resetForm();
      fetchData();
      showSuccess('Variant updated successfully');
    } catch (error) {
      console.error('Failed to update variant:', error);
      showError(error.message || 'Failed to update variant');
    }
  };

  const handleDeleteVariant = async (variantId, variantSku) => {
    if (window.confirm(`Are you sure you want to delete variant "${variantSku}"?`)) {
      try {
        await attributeService.deleteVariant(variantId);
        fetchData();
        showSuccess('Variant deleted successfully');
      } catch (error) {
        console.error('Failed to delete variant:', error);
        showError(error.message || 'Failed to delete variant');
      }
    }
  };

  const resetForm = () => {
    setVariantFormData({
      price: '',
      is_default: false,
      selectedAttributes: []
    });
    setEditingVariant(null);
  };

  const openImageManager = (variant) => {
    const colorAttribute = variant.attributes.find(attr => attr.name.toLowerCase() === 'color');
    if (colorAttribute) {
      setSelectedVariant({
        id: colorAttribute.id,
        name: colorAttribute.name,
        value: colorAttribute.value,
        meta: colorAttribute.meta || {},
        variantId: variant.id,
        productUuid,
        images: variant.images || []
      });
      setShowImageManager(true);
    } else {
      showError('No color attribute found for this variant');
    }
  };

  const handleAttributeSelection = (attributeId) => {
    setVariantFormData(prev => ({
      ...prev,
      selectedAttributes: prev.selectedAttributes.includes(attributeId)
        ? prev.selectedAttributes.filter(id => id !== attributeId)
        : [...prev.selectedAttributes, attributeId]
    }));
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  const getAttributesByType = (type) => {
    return allAttributes.filter(attr => attr.name.toLowerCase() === type.toLowerCase());
  };

  const renderAttributeValue = (attribute) => {
    if (attribute.name.toLowerCase() === 'color' && attribute.meta?.hex) {
      return (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2 border border-gray-300"
            style={{ backgroundColor: attribute.meta.hex }}
          ></div>
          <span>{attribute.value}</span>
        </div>
      );
    }
    return attribute.value;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Variants Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Variants ({variants.length})
          </h3>
          <button
            onClick={() => setShowVariantForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Variant
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No variants created for this product</p>
            <p className="text-sm">Create variants with different attribute combinations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant.id} className="border border-gray-200 rounded-lg">
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleVariant(variant.id)}
                      className="mr-3 text-gray-400 hover:text-gray-600"
                    >
                      {expandedVariants.has(variant.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">SKU: {variant.sku}</span>
                        {variant.is_default && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          variant.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {variant.is_available ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {formatPrice(variant.price)}
                        {variant.net !== variant.price && (
                          <span className="text-sm text-gray-500 ml-2">
                            Net: {formatPrice(variant.net)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {variant.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            <span className="font-medium">{attr.name}:</span>
                            <span className="ml-1">{renderAttributeValue(attr)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Stock: {variant.stock}
                    </span>
                    <button
                      onClick={() => openImageManager(variant)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Manage Images"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditVariant(variant)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit Variant"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVariant(variant.id, variant.sku)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Variant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expandedVariants.has(variant.id) && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-4">
                      {/* Variant Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Variant Details:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Price:</span>
                            <span className="ml-2 font-medium">{formatPrice(variant.price)}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Net Price:</span>
                            <span className="ml-2 font-medium">{formatPrice(variant.net)}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Stock:</span>
                            <span className="ml-2 font-medium">{variant.stock}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Status:</span>
                            <span className={`ml-2 font-medium ${
                              variant.is_available ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {variant.is_available ? 'Available' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Attributes */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Attributes:</h5>
                        <div className="flex flex-wrap gap-2">
                          {variant.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                              <span className="font-medium text-gray-900 mr-2">{attr.name}:</span>
                              {renderAttributeValue(attr)}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Images */}
                      {variant.images && variant.images.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Images ({variant.images.length}):</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {variant.images.map((image, imgIndex) => (
                              <div key={image.image_uuid || imgIndex} className="relative group">
                                <img
                                  src={image.image_url}
                                  alt={image.alt_text || `Variant image ${imgIndex + 1}`}
                                  className="w-full h-20 object-cover rounded border border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div
                                  className="w-full h-20 bg-gray-200 rounded border border-gray-200 flex items-center justify-center text-gray-400"
                                  style={{ display: 'none' }}
                                >
                                  <ImageIcon className="h-6 w-6" />
                                </div>
                                {image.is_main && (
                                  <div className="absolute top-1 left-1 bg-yellow-500 text-white px-1 py-0.5 rounded text-xs">
                                    Main
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Variant Modal */}
      {showVariantForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingVariant ? 'Edit Variant' : 'Create New Variant'}
            </h3>
            <form onSubmit={editingVariant ? handleUpdateVariant : handleCreateVariant} className="space-y-6">
              {!editingVariant && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={variantFormData.price}
                    onChange={(e) => setVariantFormData({ ...variantFormData, price: e.target.value })}
                    className="input-field"
                    placeholder="Leave empty to use product price"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If left empty, the variant will use the product's base price
                  </p>
                </div>
              )}

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={variantFormData.is_default}
                    onChange={(e) => setVariantFormData({ ...variantFormData, is_default: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Set as default variant</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Attributes *
                </label>
                <div className="space-y-4">
                  {allAttributes.map((attribute) => (
                    <div key={attribute.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        {attribute.name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {attribute.values?.map((value) => (
                          <label key={value.id} className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={variantFormData.selectedAttributes.includes(value.id)}
                              onChange={() => handleAttributeSelection(value.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm flex items-center">
                              {attribute.name.toLowerCase() === 'color' && value.meta?.hex && (
                                <div
                                  className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                                  style={{ backgroundColor: value.meta.hex }}
                                ></div>
                              )}
                              {value.value}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {variantFormData.selectedAttributes.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">Please select at least one attribute</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVariantForm(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={variantFormData.selectedAttributes.length === 0}
                  className="btn-primary disabled:opacity-50"
                >
                  {editingVariant ? 'Update Variant' : 'Create Variant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attribute Image Manager Modal */}
      {showImageManager && selectedVariant && (
        <AttributeImageManager
          attributeValue={selectedVariant}
          onClose={() => {
            setShowImageManager(false);
            setSelectedVariant(null);
          }}
          onImagesUpdated={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default VariantManager;
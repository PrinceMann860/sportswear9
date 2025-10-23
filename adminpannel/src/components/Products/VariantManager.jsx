import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Package, Image as ImageIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';
import AttributeImageManager from './AttributeImageManager';

const VariantManager = ({ productUuid, product }) => {
  const [allAttributes, setAllAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVariants, setExpandedVariants] = useState(new Set());
  const { showSuccess, showError } = useToast();

  // Modal states
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [selectedAttributeValue, setSelectedAttributeValue] = useState(null);
  
  // Form data
  const [variantFormData, setVariantFormData] = useState({
    price: '',
    is_default: false,
    selectedAttributes: {}
  });
  
  // Edit state
  const [editingVariant, setEditingVariant] = useState(null);

  useEffect(() => {
    fetchAllAttributes();
  }, []);

  const fetchAllAttributes = async () => {
    try {
      setLoading(true);
      const data = await attributeService.getAttributes();
      setAllAttributes(data);
    } catch (error) {
      console.error('Failed to fetch attributes:', error);
      showError('Failed to fetch attributes');
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
      // Convert selectedAttributes object to array of attribute value IDs
      const attributeIds = Object.values(variantFormData.selectedAttributes);
      
      const variantData = {
        product_uuid: productUuid,
        price: variantFormData.price,
        is_default: variantFormData.is_default,
        attribute_ids: attributeIds
      };
      
      await attributeService.createVariant(variantData);
      setShowVariantForm(false);
      resetForm();
      // Refresh product data by triggering a re-fetch
      window.location.reload(); // Simple refresh for now
      showSuccess('Variant created successfully');
    } catch (error) {
      console.error('Failed to create variant:', error);
      showError('Failed to create variant');
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    
    // Convert variant attributes to selectedAttributes format
    const selectedAttributes = {};
    variant.attributes.forEach(attr => {
      selectedAttributes[attr.name] = attr.id;
    });
    
    setVariantFormData({
      price: variant.price,
      is_default: variant.is_default,
      selectedAttributes
    });
    setShowVariantForm(true);
  };

  const handleUpdateVariant = async (e) => {
    e.preventDefault();
    try {
      const attributeIds = Object.values(variantFormData.selectedAttributes);
      
      const variantData = {
        price: variantFormData.price,
        is_default: variantFormData.is_default,
        attribute_ids: attributeIds
      };
      
      // Note: You'll need to implement updateVariant in attributeService
      // await attributeService.updateVariant(editingVariant.id, variantData);
      
      setShowVariantForm(false);
      setEditingVariant(null);
      resetForm();
      window.location.reload();
      showSuccess('Variant updated successfully');
    } catch (error) {
      console.error('Failed to update variant:', error);
      showError('Failed to update variant');
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        // Note: You'll need to implement deleteVariant in attributeService
        // await attributeService.deleteVariant(variantId);
        window.location.reload();
        showSuccess('Variant deleted successfully');
      } catch (error) {
        console.error('Failed to delete variant:', error);
        showError('Failed to delete variant');
      }
    }
  };

  const resetForm = () => {
    setVariantFormData({
      price: '',
      is_default: false,
      selectedAttributes: {}
    });
    setEditingVariant(null);
  };

  const handleAttributeSelection = (attributeName, valueId) => {
    setVariantFormData(prev => ({
      ...prev,
      selectedAttributes: {
        ...prev.selectedAttributes,
        [attributeName]: valueId
      }
    }));
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  const openImageManager = (attributeValue, variant) => {
    setSelectedAttributeValue({
      ...attributeValue,
      variantId: variant.id,
      productUuid
    });
    setShowImageManager(true);
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
            Product Variants ({product.variants?.length || 0})
          </h3>
          <button
            onClick={() => setShowVariantForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Variant
          </button>
        </div>

        {!product.variants || product.variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No variants created for this product</p>
            <p className="text-sm">Create variants with different attribute combinations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {product.variants.map((variant) => (
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
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {formatPrice(variant.price)}
                        {variant.net !== variant.price && (
                          <span className="text-sm text-gray-500 ml-2">
                            Net: {formatPrice(variant.net)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditVariant(variant)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVariant(variant.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expandedVariants.has(variant.id) && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Attributes:</h5>
                        <div className="flex flex-wrap gap-2">
                          {variant.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition-colors"
                              onClick={() => openImageManager(attr, variant)}
                            >
                              {attr.meta?.hex && (
                                <div
                                  className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                  style={{ backgroundColor: attr.meta.hex }}
                                ></div>
                              )}
                              <span className="font-medium">{attr.name}:</span>
                              <span className="ml-1">{attr.value}</span>
                              <ImageIcon className="h-3 w-3 ml-2 text-blue-600" />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Click on an attribute to manage its images</p>
                      </div>
                      
                      {variant.attributes.some(attr => attr.images && attr.images.length > 0) && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Images:</h5>
                          <div className="flex flex-wrap gap-2">
                            {variant.attributes.map((attr) =>
                              attr.images?.map((image, imgIndex) => (
                                <img
                                  key={`${attr.id}-${imgIndex}`}
                                  src={image}
                                  alt={`${attr.name} - ${attr.value}`}
                                  className="w-16 h-16 object-cover rounded border border-gray-200"
                                />
                              ))
                            )}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingVariant ? 'Edit Variant' : 'Create New Variant'}
            </h3>
            <form onSubmit={editingVariant ? handleUpdateVariant : handleCreateVariant} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={variantFormData.price}
                    onChange={(e) => setVariantFormData({ ...variantFormData, price: e.target.value })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-center">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Attributes *
                </label>
                <div className="space-y-4">
                  {allAttributes.map((attribute) => (
                    <div key={attribute.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{attribute.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {attribute.values.map((value) => (
                          <label
                            key={value.id}
                            className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                              variantFormData.selectedAttributes[attribute.name] === value.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={attribute.name}
                              value={value.id}
                              checked={variantFormData.selectedAttributes[attribute.name] === value.id}
                              onChange={() => handleAttributeSelection(attribute.name, value.id)}
                              className="sr-only"
                            />
                            <div className="flex items-center">
                              {value.meta?.hex && (
                                <div
                                  className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                  style={{ backgroundColor: value.meta.hex }}
                                ></div>
                              )}
                              <span className="text-sm">{value.value}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
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
                <button type="submit" className="btn-primary">
                  {editingVariant ? 'Update Variant' : 'Create Variant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attribute Image Manager Modal */}
      {showImageManager && selectedAttributeValue && (
        <AttributeImageManager
          attributeValue={selectedAttributeValue}
          onClose={() => {
            setShowImageManager(false);
            setSelectedAttributeValue(null);
          }}
          onImagesUpdated={() => {
            // Refresh the product data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default VariantManager;
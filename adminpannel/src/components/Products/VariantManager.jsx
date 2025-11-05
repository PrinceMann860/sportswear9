import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Package, Image as ImageIcon, ChevronDown, ChevronRight, Palette } from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';
import AttributeImageManager from './AttributeImageManager';
import VariantAttributeManager from './VariantAttributeManager';

const VariantManager = ({ productUuid, product }) => {
  const [allAttributes, setAllAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVariants, setExpandedVariants] = useState(new Set());
  const { showSuccess, showError } = useToast();

  // Modal states
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [selectedAttributeValue, setSelectedAttributeValue] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Form data
  const [variantFormData, setVariantFormData] = useState({
    price: '',
    is_default: false,
    variantType: 'price-color', // 'price-color' or 'size'
    selectedColor: '',
    selectedSizes: []
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
      let attributeIds = [];
      
      if (variantFormData.variantType === 'price-color') {
        if (variantFormData.selectedColor) {
          attributeIds = [variantFormData.selectedColor];
        }
      } else if (variantFormData.variantType === 'size') {
        attributeIds = variantFormData.selectedSizes;
      }
      
      const variantData = {
        product_uuid: productUuid,
        is_default: variantFormData.is_default,
        attribute_ids: attributeIds
      };

      // Only add price if it's not empty and not 0
      if (variantFormData.price && parseFloat(variantFormData.price) > 0) {
        variantData.price = variantFormData.price;
      }
      
      await attributeService.createVariant(variantData);
      setShowVariantForm(false);
      resetForm();
      window.location.reload();
      showSuccess('Variant created successfully');
    } catch (error) {
      console.error('Failed to create variant:', error);
      showError('Failed to create variant');
    }
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    
    // Determine variant type based on attributes
    const hasColor = variant.attributes.some(attr => attr.name.toLowerCase() === 'color');
    const hasSizes = variant.attributes.filter(attr => attr.name.toLowerCase() === 'size');
    
    if (hasColor && hasSizes.length <= 1) {
      setVariantFormData({
        price: variant.price,
        is_default: variant.is_default,
        variantType: 'price-color',
        selectedColor: variant.attributes.find(attr => attr.name.toLowerCase() === 'color')?.id || '',
        selectedSizes: []
      });
    } else if (hasSizes.length > 1) {
      setVariantFormData({
        price: variant.price,
        is_default: variant.is_default,
        variantType: 'size',
        selectedColor: '',
        selectedSizes: hasSizes.map(attr => attr.id)
      });
    }
    
    setShowVariantForm(true);
  };

  const handleDeleteVariant = async (variantId) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        await attributeService.deleteVariant(variantId);
        window.location.reload();
        showSuccess('Variant deleted successfully');
      } catch (error) {
        console.error('Failed to delete variant:', error);
        showError('Failed to delete variant');
      }
    }
  };

  const handleVariantUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    window.location.reload();
  };

  const resetForm = () => {
    setVariantFormData({
      price: '',
      is_default: false,
      variantType: 'price-color',
      selectedColor: '',
      selectedSizes: []
    });
    setEditingVariant(null);
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

  const getColorAttributes = () => {
    return allAttributes.find(attr => attr.name.toLowerCase() === 'color')?.values || [];
  };

  const getSizeAttributes = () => {
    return allAttributes.find(attr => attr.name.toLowerCase() === 'size')?.values || [];
  };

  const handleSizeSelection = (sizeId) => {
    setVariantFormData(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(sizeId)
        ? prev.selectedSizes.filter(id => id !== sizeId)
        : [...prev.selectedSizes, sizeId]
    }));
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
                        {parseFloat(variant.price) > 0 ? formatPrice(variant.price) : 'No price set'}
                        {variant.net !== variant.price && parseFloat(variant.net) > 0 && (
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
                            {attr.meta?.hex && (
                              <div
                                className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                                style={{ backgroundColor: attr.meta.hex }}
                              ></div>
                            )}
                            <span className="font-medium">{attr.name}:</span>
                            <span className="ml-1">{attr.value}</span>
                          </div>
                        ))}
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
                      {/* Variant Attribute Manager */}
                      <VariantAttributeManager
                        productUuid={productUuid}
                        variant={variant}
                        allAttributes={allAttributes}
                        onUpdate={handleVariantUpdate}
                      />
                      
                      {/* Image Management Section */}
                      {variant.attributes.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Attribute Images:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {variant.attributes.map((attr, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => openImageManager(attr, variant)}
                              >
                                <div className="flex items-center">
                                  {attr.meta?.hex && (
                                    <div
                                      className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                      style={{ backgroundColor: attr.meta.hex }}
                                    ></div>
                                  )}
                                  <div>
                                    <span className="font-medium text-gray-900">{attr.name}:</span>
                                    <span className="ml-1 text-gray-700">{attr.value}</span>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {attr.images?.length || 0} image{(attr.images?.length || 0) !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>
                                <ImageIcon className="h-5 w-5 text-blue-600" />
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Click on an attribute to manage its images</p>
                        </div>
                      )}
                      
                      {/* Display existing images */}
                      {variant.images && variant.images.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Variant Images:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {variant.images.map((image, imgIndex) => (
                              <div
                                key={image.image_uuid || imgIndex}
                                className="relative group"
                              >
                                <img
                                  src={image.image_url}
                                  alt={image.alt_text || `Variant image ${imgIndex + 1}`}
                                  className="w-full h-16 object-cover rounded border border-gray-200"
                                  onError={(e) => {
                                    console.error('Image failed to load:', image.image_url);
                                    e.target.style.display = 'none';
                                  }}
                                />
                                {image.is_main && (
                                  <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                                    Main
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-medium text-center px-1">
                                    {image.alt_text || 'No description'}
                                  </span>
                                </div>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingVariant ? 'Edit Variant' : 'Create New Variant'}
            </h3>
            <form onSubmit={handleCreateVariant} className="space-y-6">
              {/* Variant Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Variant Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    variantFormData.variantType === 'price-color'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="variantType"
                      value="price-color"
                      checked={variantFormData.variantType === 'price-color'}
                      onChange={(e) => setVariantFormData({ ...variantFormData, variantType: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-blue-600" />
                      <div>
                        <div className="font-medium">Price & Color</div>
                        <div className="text-sm text-gray-500">Single color variant with price</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    variantFormData.variantType === 'size'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="variantType"
                      value="size"
                      checked={variantFormData.variantType === 'size'}
                      onChange={(e) => setVariantFormData({ ...variantFormData, variantType: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <Package className="h-5 w-5 mr-2 text-green-600" />
                      <div>
                        <div className="font-medium">Size Variant</div>
                        <div className="text-sm text-gray-500">Multiple sizes, no price</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price & Color Variant */}
              {variantFormData.variantType === 'price-color' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty or 0 to use product price</p>
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
                      Select Color
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {getColorAttributes().map((color) => (
                        <label
                          key={color.id}
                          className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            variantFormData.selectedColor === color.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="color"
                            value={color.id}
                            checked={variantFormData.selectedColor === color.id}
                            onChange={(e) => setVariantFormData({ ...variantFormData, selectedColor: e.target.value })}
                            className="sr-only"
                          />
                          {color.meta?.hex && (
                            <div
                              className="w-8 h-8 rounded-full border-2 border-gray-300 mb-2"
                              style={{ backgroundColor: color.meta.hex }}
                            ></div>
                          )}
                          <span className="text-sm font-medium text-center">{color.value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Size Variant */}
              {variantFormData.variantType === 'size' && (
                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Sizes (Multiple allowed)
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {getSizeAttributes().map((size) => (
                        <label
                          key={size.id}
                          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            variantFormData.selectedSizes.includes(size.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={variantFormData.selectedSizes.includes(size.id)}
                            onChange={() => handleSizeSelection(size.id)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{size.value}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Selected: {variantFormData.selectedSizes.length} size{variantFormData.selectedSizes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}

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
            window.location.reload();
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default VariantManager;
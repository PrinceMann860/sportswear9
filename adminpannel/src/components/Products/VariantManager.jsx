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
    variantType: 'color-sizes', // 'color-sizes', 'price-color', or 'size'
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
      
      if (variantFormData.variantType === 'color-sizes') {
        // One color + multiple sizes
        if (variantFormData.selectedColor) {
          attributeIds.push(variantFormData.selectedColor);
        }
        attributeIds = [...attributeIds, ...variantFormData.selectedSizes];
      } else if (variantFormData.variantType === 'price-color') {
        // Single color variant
        if (variantFormData.selectedColor) {
          attributeIds = [variantFormData.selectedColor];
        }
      } else if (variantFormData.variantType === 'size') {
        // Multiple sizes only
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
        variantType: hasSizes.length === 0 ? 'price-color' : 'color-sizes',
        selectedColor: variant.attributes.find(attr => attr.name.toLowerCase() === 'color')?.id || '',
        selectedSizes: hasSizes.map(attr => attr.id)
      });
    } else if (hasColor && hasSizes.length > 1) {
      setVariantFormData({
        price: variant.price,
        is_default: variant.is_default,
        variantType: 'color-sizes',
        selectedColor: variant.attributes.find(attr => attr.name.toLowerCase() === 'color')?.id || '',
        selectedSizes: hasSizes.map(attr => attr.id)
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
      variantType: 'color-sizes',
      selectedColor: '',
      selectedSizes: []
    });
    setEditingVariant(null);
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  const openImageManager = (color, variant) => {
    if (color && variant) {
      setSelectedAttributeValue({
        id: color.color_id,
        name: 'Color',
        value: color.color,
        meta: { hex: color.color_code },
        variantId: variant.variant_ids?.[0] || 'unknown',
        productUuid,
        images: color.images || []
      });
      setShowImageManager(true);
    }
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
            {product.variants?.map((variant, variantIndex) => (
              <div key={variant.color_id || variantIndex} className="border border-gray-200 rounded-lg">
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleVariant(variant.color_id || variantIndex)}
                      className="mr-3 text-gray-400 hover:text-gray-600"
                    >
                      {expandedVariants.has(variant.color_id || variantIndex) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">Color: {variant.color}</span>
                        {variant.is_active && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mt-1">
                        {variant.sizes?.[0]?.price ? formatPrice(variant.sizes[0].price) : 'No price set'}
                        <span className="text-sm text-gray-500 ml-2">
                          {variant.sizes?.length || 0} size{(variant.sizes?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {variant.color_code && (
                            <div
                              className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                              style={{ backgroundColor: variant.color_code }}
                            ></div>
                          )}
                          <span className="font-medium">Color:</span>
                          <span className="ml-1">{variant.color}</span>
                        </div>
                        {variant.sizes?.map((size, sizeIndex) => (
                          <div key={size.variant_id || sizeIndex} className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            <span className="font-medium">Size:</span>
                            <span className="ml-1">{size.value}</span>
                            <span className="ml-1">({size.stock_quantity} in stock)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {variant.variant_ids?.length || 0} variant{(variant.variant_ids?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {expandedVariants.has(variant.color_id || variantIndex) && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-4">
                      {/* Size Variants */}
                      {variant.sizes && variant.sizes.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Size Variants:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {variant.sizes.map((size, sizeIndex) => (
                              <div
                                key={size.variant_id || sizeIndex}
                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                              >
                                <div>
                                  <div className="font-medium text-gray-900">Size: {size.value}</div>
                                  <div className="text-sm text-gray-600">
                                    Price: {formatPrice(size.price)}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Stock: {size.stock_quantity}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ID: {size.variant_id}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    size.is_available && size.stock_quantity > 0
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {size.is_available && size.stock_quantity > 0 ? 'Available' : 'Out of Stock'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Image Management Section */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Color Images:</h5>
                        <div className="grid grid-cols-1 gap-3">
                          <div
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => openImageManager(variant, variant)}
                          >
                            <div className="flex items-center">
                              {variant.color_code && (
                                <div
                                  className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                  style={{ backgroundColor: variant.color_code }}
                                ></div>
                              )}
                              <div>
                                <span className="font-medium text-gray-900">Color:</span>
                                <span className="ml-1 text-gray-700">{variant.color}</span>
                                <div className="text-xs text-gray-500 mt-1">
                                  {variant.images?.length || 0} image{(variant.images?.length || 0) !== 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            <ImageIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click to manage color images</p>
                      </div>
                      
                      {/* Display existing images */}
                      {variant.images && variant.images.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Color Images:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {variant.images.map((image, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="relative group"
                              >
                                <img
                                  src={typeof image === 'string' ? image : image.url || image.image_url}
                                  alt={`${variant.color} variant image ${imgIndex + 1}`}
                                  className="w-full h-16 object-cover rounded border border-gray-200"
                                  onError={(e) => {
                                    console.error('Image failed to load:', image);
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-medium text-center px-1">
                                    {variant.color}
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

      {/* Create/Edit Variant Modal - Keep existing modal code but disable for this data structure */}
      {showVariantForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Variant Management Not Available
            </h3>
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">
                This product uses a different variant structure that cannot be edited through this interface.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                The variants are managed through a different system. Please use the appropriate management tools for this product type.
              </p>
              <button
                onClick={() => {
                  setShowVariantForm(false);
                  resetForm();
                }}
                className="btn-primary"
              >
                Close
              </button>
            </div>
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
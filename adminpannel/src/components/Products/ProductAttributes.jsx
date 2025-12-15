import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Palette, Package, Settings } from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';

const ProductAttributes = ({ productUuid }) => {
  const [attributes, setAttributes] = useState([]);
  const [productAttributes, setProductAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Modal states
  const [showAddAttributeModal, setShowAddAttributeModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  
  // Form data
  const [selectedAttributeId, setSelectedAttributeId] = useState('');
  const [variantFormData, setVariantFormData] = useState({
    price: '',
    is_default: false,
    attribute_ids: []
  });

  useEffect(() => {
    if (productUuid) {
      fetchData();
    }
  }, [productUuid]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allAttributes, productAttrs, productVariants] = await Promise.all([
        attributeService.getAdminAttributes(),
        attributeService.getProductAttributes(productUuid),
        attributeService.getVariants(productUuid)
      ]);
      
      setAttributes(allAttributes);
      setProductAttributes(productAttrs);
      setVariants(productVariants);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showError('Failed to fetch attributes data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    try {
      await attributeService.addProductAttribute(productUuid, selectedAttributeId);
      setShowAddAttributeModal(false);
      setSelectedAttributeId('');
      fetchData();
      showSuccess('Attribute added to product successfully');
    } catch (error) {
      console.error('Failed to add attribute:', error);
      showError('Failed to add attribute to product');
    }
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();
    try {
      const variantData = {
        product_uuid: productUuid,
        price: variantFormData.price,
        is_default: variantFormData.is_default,
        attribute_ids: variantFormData.attribute_ids
      };
      
      await attributeService.createVariant(variantData);
      setShowVariantModal(false);
      setVariantFormData({ price: '', is_default: false, attribute_ids: [] });
      fetchData();
      showSuccess('Variant created successfully');
    } catch (error) {
      console.error('Failed to create variant:', error);
      showError('Failed to create variant');
    }
  };

  const resetForms = () => {
    setShowAddAttributeModal(false);
    setShowVariantModal(false);
    setSelectedAttributeId('');
    setVariantFormData({ price: '', is_default: false, attribute_ids: [] });
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  const getAvailableAttributes = () => {
    const productAttributeIds = productAttributes.map(pa => pa.attribute.id);
    return attributes.filter(attr => !productAttributeIds.includes(attr.id));
  };

  const getAllAttributeValues = () => {
    const values = [];
    productAttributes.forEach(pa => {
      pa.attribute.values.forEach(value => {
        values.push({
          ...value,
          attributeName: pa.attribute.name
        });
      });
    });
    return values;
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
      {/* Product Attributes Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Product Attributes
          </h3>
          <button
            onClick={() => setShowAddAttributeModal(true)}
            className="btn-primary flex items-center text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Attribute
          </button>
        </div>

        {productAttributes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No attributes assigned to this product</p>
            <p className="text-sm">Add attributes to enable variants</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productAttributes.map((productAttr) => (
              <div key={productAttr.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">{productAttr.attribute.name}</h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {productAttr.attribute.values.length} values
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productAttr.attribute.values.map((value) => (
                    <div
                      key={value.id}
                      className="flex items-center px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm"
                    >
                      {value.meta?.hex && (
                        <div
                          className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: value.meta.hex }}
                        ></div>
                      )}
                      <span>{value.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Variants Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Variants
          </h3>
          {productAttributes.length > 0 && (
            <button
              onClick={() => setShowVariantModal(true)}
              className="btn-primary flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Variant
            </button>
          )}
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No variants created for this product</p>
            {productAttributes.length === 0 ? (
              <p className="text-sm">Add attributes first to create variants</p>
            ) : (
              <p className="text-sm">Create variants with different attribute combinations</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
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
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Attributes:</h5>
                  <div className="flex flex-wrap gap-2">
                    {variant.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="flex items-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm"
                      >
                        {attr.meta?.hex && (
                          <div
                            className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                            style={{ backgroundColor: attr.meta.hex }}
                          ></div>
                        )}
                        <span className="font-medium">{attr.name}:</span>
                        <span className="ml-1">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  {variant.attributes.some(attr => attr.images && attr.images.length > 0) && (
                    <div className="mt-3">
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
            ))}
          </div>
        )}
      </div>

      {/* Add Attribute Modal */}
      {showAddAttributeModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Attribute to Product</h3>
            <form onSubmit={handleAddAttribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Attribute *
                </label>
                <select
                  required
                  value={selectedAttributeId}
                  onChange={(e) => setSelectedAttributeId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose an attribute</option>
                  {getAvailableAttributes().map((attr) => (
                    <option key={attr.id} value={attr.id}>
                      {attr.name} ({attr.values?.length || 0} values)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForms} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Attribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Product Variant</h3>
            <form onSubmit={handleCreateVariant} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Attribute Values *
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                  {getAllAttributeValues().map((value) => (
                    <label key={value.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variantFormData.attribute_ids.includes(value.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setVariantFormData({
                              ...variantFormData,
                              attribute_ids: [...variantFormData.attribute_ids, value.id]
                            });
                          } else {
                            setVariantFormData({
                              ...variantFormData,
                              attribute_ids: variantFormData.attribute_ids.filter(id => id !== value.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">
                        <span className="font-medium">{value.attributeName}:</span> {value.value}
                        {value.meta?.hex && (
                          <div
                            className="inline-block w-3 h-3 rounded-full ml-1 border border-gray-300"
                            style={{ backgroundColor: value.meta.hex }}
                          ></div>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForms} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAttributes;
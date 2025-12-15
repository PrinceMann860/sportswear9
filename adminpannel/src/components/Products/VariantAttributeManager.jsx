import { useState, useEffect } from 'react';
import { CreditCard as Edit, Trash2, Plus, Save, X, Palette, Package } from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';

const VariantAttributeManager = ({ productUuid, variant, allAttributes, onUpdate }) => {
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState('');
  const [selectedValueId, setSelectedValueId] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleUpdateAttribute = async (currentAttributeValueId, newAttributeValueId) => {
    if (currentAttributeValueId === newAttributeValueId) {
      setEditingAttribute(null);
      return;
    }

    try {
      setLoading(true);
      await attributeService.updateVariantAttribute(
        productUuid,
        variant.id,
        currentAttributeValueId,
        newAttributeValueId
      );
      
      showSuccess('Attribute updated successfully');
      setEditingAttribute(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to update attribute:', error);
      showError(error.message || 'Failed to update attribute');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttribute = async (attributeValueId, attributeName, attributeValue) => {
    if (window.confirm(`Are you sure you want to remove "${attributeName}: ${attributeValue}" from this variant?`)) {
      try {
        setLoading(true);
        await attributeService.deleteVariantAttribute(
          productUuid,
          variant.id,
          attributeValueId
        );
        
        showSuccess('Attribute removed successfully');
        onUpdate();
      } catch (error) {
        console.error('Failed to delete attribute:', error);
        showError(error.message || 'Failed to remove attribute');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddAttribute = async () => {
    if (!selectedAttributeId || !selectedValueId) {
      showError('Please select both attribute and value');
      return;
    }

    try {
      setLoading(true);
      // This would need a new API endpoint to add an attribute to existing variant
      // For now, we'll show a message that this needs to be implemented
      showError('Adding new attributes to existing variants is not yet implemented');
      
      setShowAddAttribute(false);
      setSelectedAttributeId('');
      setSelectedValueId('');
    } catch (error) {
      console.error('Failed to add attribute:', error);
      showError(error.message || 'Failed to add attribute');
    } finally {
      setLoading(false);
    }
  };

  const getAttributeValues = (attributeId) => {
    const attribute = allAttributes.find(attr => attr.id === parseInt(attributeId));
    return attribute?.values || [];
  };

  const getAvailableAttributes = () => {
    const currentAttributeIds = variant.attributes.map(attr => attr.attribute_id);
    return allAttributes.filter(attr => !currentAttributeIds.includes(attr.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h5 className="text-sm font-medium text-gray-700 flex items-center">
          <Palette className="h-4 w-4 mr-2" />
          Variant Attributes ({variant.attributes.length})
        </h5>
        {getAvailableAttributes().length > 0 && (
          <button
            onClick={() => setShowAddAttribute(true)}
            className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
            disabled={loading}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Attribute
          </button>
        )}
      </div>

      <div className="space-y-3">
        {variant.attributes.map((attr) => (
          <div
            key={attr.id}
            className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center">
              {attr.meta?.hex && (
                <div
                  className="w-4 h-4 rounded-full mr-3 border border-gray-300"
                  style={{ backgroundColor: attr.meta.hex }}
                ></div>
              )}
              <div>
                <span className="font-medium text-gray-900">{attr.name}:</span>
                <span className="ml-2 text-gray-700">{attr.value}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {editingAttribute === attr.id ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={attr.id}
                    onChange={(e) => handleUpdateAttribute(attr.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    disabled={loading}
                  >
                    {allAttributes
                      .find(a => a.name === attr.name)
                      ?.values.map(value => (
                        <option key={value.id} value={value.id}>
                          {value.value}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => setEditingAttribute(null)}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setEditingAttribute(attr.id)}
                    className="text-blue-600 hover:text-blue-900"
                    disabled={loading}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAttribute(attr.id, attr.name, attr.value)}
                    className="text-red-600 hover:text-red-900"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Attribute Modal */}
      {showAddAttribute && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Attribute to Variant</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Attribute
                </label>
                <select
                  value={selectedAttributeId}
                  onChange={(e) => {
                    setSelectedAttributeId(e.target.value);
                    setSelectedValueId('');
                  }}
                  className="input-field"
                >
                  <option value="">Choose an attribute</option>
                  {getAvailableAttributes().map(attr => (
                    <option key={attr.id} value={attr.id}>
                      {attr.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAttributeId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Value
                  </label>
                  <select
                    value={selectedValueId}
                    onChange={(e) => setSelectedValueId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Choose a value</option>
                    {getAttributeValues(selectedAttributeId).map(value => (
                      <option key={value.id} value={value.id}>
                        {value.value}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddAttribute(false);
                  setSelectedAttributeId('');
                  setSelectedValueId('');
                }}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddAttribute}
                className="btn-primary"
                disabled={loading || !selectedAttributeId || !selectedValueId}
              >
                {loading ? 'Adding...' : 'Add Attribute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default VariantAttributeManager;
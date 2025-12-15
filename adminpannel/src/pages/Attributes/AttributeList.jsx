import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, ChevronDown, ChevronRight, Palette } from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';

const AttributeList = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAttributes, setExpandedAttributes] = useState(new Set());
  const { showSuccess, showError } = useToast();

  // Modal states
  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [showValueForm, setShowValueForm] = useState(false);
  
  // Form data
  const [attributeFormData, setAttributeFormData] = useState({ name: '' });
  const [valueFormData, setValueFormData] = useState({
    attribute: '',
    value: '',
    meta: {}
  });
  
  // Edit states
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [currentAttributeId, setCurrentAttributeId] = useState(null);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const data = await attributeService.getAdminAttributes();
      setAttributes(data);
    } catch (error) {
      console.error('Failed to fetch attributes:', error);
      showError('Failed to fetch attributes');
    } finally {
      setLoading(false);
    }
  };

  const toggleAttribute = (attributeId) => {
    const newExpanded = new Set(expandedAttributes);
    if (newExpanded.has(attributeId)) {
      newExpanded.delete(attributeId);
    } else {
      newExpanded.add(attributeId);
    }
    setExpandedAttributes(newExpanded);
  };

  // Attribute handlers
  const handleCreateAttribute = async (e) => {
    e.preventDefault();
    try {
      await attributeService.createAttribute(attributeFormData);
      setShowAttributeForm(false);
      setAttributeFormData({ name: '' });
      fetchAttributes();
      showSuccess('Attribute created successfully');
    } catch (error) {
      console.error('Failed to create attribute:', error);
      showError('Failed to create attribute');
    }
  };

  const handleEditAttribute = (attribute) => {
    setEditingAttribute(attribute);
    setAttributeFormData({ name: attribute.name });
    setShowAttributeForm(true);
  };

  const handleUpdateAttribute = async (e) => {
    e.preventDefault();
    try {
      await attributeService.updateAttribute(editingAttribute.id, attributeFormData);
      setShowAttributeForm(false);
      setEditingAttribute(null);
      setAttributeFormData({ name: '' });
      fetchAttributes();
      showSuccess('Attribute updated successfully');
    } catch (error) {
      console.error('Failed to update attribute:', error);
      showError('Failed to update attribute');
    }
  };

  const handleDeleteAttribute = async (attributeId, attributeName) => {
    if (window.confirm(`Are you sure you want to delete "${attributeName}"? This will also delete all its values.`)) {
      try {
        await attributeService.deleteAttribute(attributeId);
        fetchAttributes();
        showSuccess('Attribute deleted successfully');
      } catch (error) {
        console.error('Failed to delete attribute:', error);
        showError('Failed to delete attribute');
      }
    }
  };

  // Value handlers
  const handleCreateValue = async (e) => {
    e.preventDefault();
    try {
      const valueData = {
        attribute: valueFormData.attribute,
        value: valueFormData.value,
        meta: valueFormData.meta
      };
      await attributeService.createAttributeValue(valueData);
      setShowValueForm(false);
      setValueFormData({ attribute: '', value: '', meta: {} });
      setCurrentAttributeId(null);
      fetchAttributes();
      showSuccess('Attribute value created successfully');
    } catch (error) {
      console.error('Failed to create attribute value:', error);
      showError('Failed to create attribute value');
    }
  };

  const handleEditValue = (value, attributeId) => {
    setEditingValue(value);
    setValueFormData({
      attribute: attributeId,
      value: value.value,
      meta: value.meta || {}
    });
    setShowValueForm(true);
  };

  const handleUpdateValue = async (e) => {
    e.preventDefault();
    try {
      const valueData = {
        value: valueFormData.value,
        meta: valueFormData.meta
      };
      await attributeService.updateAttributeValue(editingValue.id, valueData);
      setShowValueForm(false);
      setEditingValue(null);
      setValueFormData({ attribute: '', value: '', meta: {} });
      fetchAttributes();
      showSuccess('Attribute value updated successfully');
    } catch (error) {
      console.error('Failed to update attribute value:', error);
      showError('Failed to update attribute value');
    }
  };

  const handleDeleteValue = async (valueId, valueName) => {
    if (window.confirm(`Are you sure you want to delete "${valueName}"?`)) {
      try {
        await attributeService.deleteAttributeValue(valueId);
        fetchAttributes();
        showSuccess('Attribute value deleted successfully');
      } catch (error) {
        console.error('Failed to delete attribute value:', error);
        showError('Failed to delete attribute value');
      }
    }
  };

  const resetForms = () => {
    setShowAttributeForm(false);
    setShowValueForm(false);
    setEditingAttribute(null);
    setEditingValue(null);
    setCurrentAttributeId(null);
    setAttributeFormData({ name: '' });
    setValueFormData({ attribute: '', value: '', meta: {} });
  };

  const handleMetaChange = (key, value) => {
    setValueFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [key]: value
      }
    }));
  };

  const removeMetaKey = (key) => {
    setValueFormData(prev => {
      const newMeta = { ...prev.meta };
      delete newMeta[key];
      return {
        ...prev,
        meta: newMeta
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attributes</h1>
          <p className="text-gray-600">Manage product attributes and their values</p>
        </div>
        <button
          onClick={() => setShowAttributeForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Attribute
        </button>
      </div>

      {/* Attribute Form Modal */}
      {showAttributeForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}
            </h3>
            <form onSubmit={editingAttribute ? handleUpdateAttribute : handleCreateAttribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attribute Name *
                </label>
                <input
                  type="text"
                  required
                  value={attributeFormData.name}
                  onChange={(e) => setAttributeFormData({ ...attributeFormData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Color, Size, Material"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForms} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingAttribute ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Value Form Modal */}
      {showValueForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingValue ? 'Edit Attribute Value' : 'Add New Attribute Value'}
            </h3>
            <form onSubmit={editingValue ? handleUpdateValue : handleCreateValue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value *
                </label>
                <input
                  type="text"
                  required
                  value={valueFormData.value}
                  onChange={(e) => setValueFormData({ ...valueFormData, value: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Red, Large, Cotton"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metadata (Optional)
                </label>
                <div className="space-y-2">
                  {Object.entries(valueFormData.meta).map(([key, value]) => (
                    <div key={key} className="flex space-x-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newMeta = { ...valueFormData.meta };
                          delete newMeta[key];
                          newMeta[e.target.value] = value;
                          setValueFormData({ ...valueFormData, meta: newMeta });
                        }}
                        className="input-field flex-1"
                        placeholder="Key (e.g., hex)"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleMetaChange(key, e.target.value)}
                        className="input-field flex-1"
                        placeholder="Value (e.g., #ff0000)"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetaKey(key)}
                        className="text-red-600 hover:text-red-900 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleMetaChange('', '')}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    + Add Metadata
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForms} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingValue ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attributes List */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : attributes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attributes found. Create your first attribute to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {attributes.map((attribute) => (
              <div key={attribute.id} className="border border-gray-200 rounded-lg">
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleAttribute(attribute.id)}
                      className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                      {expandedAttributes.has(attribute.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <Palette className="h-5 w-5 mr-2 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{attribute.name}</h3>
                    <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {attribute.values?.length || 0} values
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setCurrentAttributeId(attribute.id);
                        setValueFormData({ ...valueFormData, attribute: attribute.id });
                        setShowValueForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Add Value
                    </button>
                    <button
                      onClick={() => handleEditAttribute(attribute)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAttribute(attribute.id, attribute.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expandedAttributes.has(attribute.id) && (
                  <div className="p-4 space-y-2">
                    {attribute.values?.length === 0 ? (
                      <p className="text-gray-500 text-sm">No values for this attribute</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {attribute.values?.map((value) => (
                          <div key={value.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded">
                            <div className="flex items-center">
                              {value.meta?.hex && (
                                <div
                                  className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                  style={{ backgroundColor: value.meta.hex }}
                                ></div>
                              )}
                              <span className="text-sm font-medium text-gray-900">{value.value}</span>
                              {Object.keys(value.meta || {}).length > 0 && (
                                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                                  +{Object.keys(value.meta).length} meta
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditValue(value, attribute.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteValue(value.id, value.value)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeList;
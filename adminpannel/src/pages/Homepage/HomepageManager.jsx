import { useState, useEffect, useCallback } from 'react';
import { Plus, CreditCard as Edit, Trash2, ChevronDown, ChevronRight, Image, Video, Grid2x2 as Grid, ListFilter as Filter, Tag, Save, X, Check } from 'lucide-react';
import { homepageService } from '../../services/homepageService';

const HomepageManager = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set());
  
  // Loading states for individual operations
  const [operationLoading, setOperationLoading] = useState(new Set());
  const [successAnimations, setSuccessAnimations] = useState(new Set());
  
  // Modal states
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  
  // Form data
  const [levelFormData, setLevelFormData] = useState({ name: '', order: 1 });
  const [sectionFormData, setSectionFormData] = useState({
    title: '',
    section_type: 'carousel',
    order: 1,
    extra_config: {}
  });
  const [itemFormData, setItemFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    order: 1,
    image: null,
    video_url: ''
  });
  
  // Edit states
  const [editingLevel, setEditingLevel] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [currentLevelUuid, setCurrentLevelUuid] = useState(null);
  const [currentSectionUuid, setCurrentSectionUuid] = useState(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const data = await homepageService.getLevels();
      setLevels(data);
    } catch (error) {
      console.error('Failed to fetch levels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for smooth operations
  const addOperationLoading = (id) => {
    setOperationLoading(prev => new Set([...prev, id]));
  };

  const removeOperationLoading = (id) => {
    setOperationLoading(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const showSuccessAnimation = (id) => {
    setSuccessAnimations(prev => new Set([...prev, id]));
    setTimeout(() => {
      setSuccessAnimations(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 2000);
  };

  // Optimistic updates for levels
  const updateLevelOptimistically = (levelUuid, updates) => {
    setLevels(prev => prev.map(level => 
      level.level_uuid === levelUuid 
        ? { ...level, ...updates }
        : level
    ));
  };

  const addLevelOptimistically = (newLevel) => {
    setLevels(prev => [...prev, newLevel].sort((a, b) => a.order - b.order));
  };

  const removeLevelOptimistically = (levelUuid) => {
    setLevels(prev => prev.filter(level => level.level_uuid !== levelUuid));
  };

  // Optimistic updates for sections
  const updateSectionOptimistically = (levelUuid, sectionUuid, updates) => {
    setLevels(prev => prev.map(level => 
      level.level_uuid === levelUuid
        ? {
            ...level,
            sections: level.sections?.map(section =>
              section.section_uuid === sectionUuid
                ? { ...section, ...updates }
                : section
            ) || []
          }
        : level
    ));
  };

  const addSectionOptimistically = (levelUuid, newSection) => {
    setLevels(prev => prev.map(level => 
      level.level_uuid === levelUuid
        ? {
            ...level,
            sections: [...(level.sections || []), newSection].sort((a, b) => a.order - b.order)
          }
        : level
    ));
  };

  const removeSectionOptimistically = (levelUuid, sectionUuid) => {
    setLevels(prev => prev.map(level => 
      level.level_uuid === levelUuid
        ? {
            ...level,
            sections: level.sections?.filter(section => section.section_uuid !== sectionUuid) || []
          }
        : level
    ));
  };

  // Optimistic updates for items
  const updateItemOptimistically = (levelUuid, sectionUuid, itemUuid, updates) => {
    setLevels(prev => prev.map(level => 
      level.level_uuid === levelUuid
        ? {
            ...level,
            sections: level.sections?.map(section =>
              section.section_uuid === sectionUuid
                ? {
                    ...section,
                    items: section.items?.map(item =>
                      item.item_uuid === itemUuid
                        ? { ...item, ...updates }
                        : item
                    ) || []
                  }
                : section
            ) || []
          }
        : level
    ));
  };

  const addItemOptimistically = (levelUuid, sectionUuid, newItem) => {
    setLevels(prev => prev.map(level => 
      level.level_uuid === levelUuid
        ? {
            ...level,
            sections: level.sections?.map(section =>
              section.section_uuid === sectionUuid
                ? {
                    ...section,
                    items: [...(section.items || []), newItem].sort((a, b) => a.order - b.order)
                  }
                : section
            ) || []
          }
        : level
    ));
  };

  const removeItemOptimistically = (levelUuid, sectionUuid, itemUuid) => {
    setLevels(prev => prev.map(level => 
      level.level_uuid === levelUuid
        ? {
            ...level,
            sections: level.sections?.map(section =>
              section.section_uuid === sectionUuid
                ? {
                    ...section,
                    items: section.items?.filter(item => item.item_uuid !== itemUuid) || []
                  }
                : section
            ) || []
          }
        : level
    ));
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'carousel': return Image;
      case 'grid': return Grid;
      case 'video': return Video;
      case 'filter': return Filter;
      case 'deals': return Tag;
      default: return Grid;
    }
  };

  const toggleLevel = (levelUuid) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(levelUuid)) {
      newExpanded.delete(levelUuid);
    } else {
      newExpanded.add(levelUuid);
    }
    setExpandedLevels(newExpanded);
  };

  const toggleSection = (sectionUuid) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionUuid)) {
      newExpanded.delete(sectionUuid);
    } else {
      newExpanded.add(sectionUuid);
    }
    setExpandedSections(newExpanded);
  };

  // Level handlers with optimistic updates
  const handleCreateLevel = async (e) => {
    e.preventDefault();
    const tempId = `temp-${Date.now()}`;
    const optimisticLevel = {
      level_uuid: tempId,
      name: levelFormData.name,
      order: levelFormData.order,
      sections: []
    };

    try {
      addOperationLoading(tempId);
      addLevelOptimistically(optimisticLevel);
      setShowLevelForm(false);
      setLevelFormData({ name: '', order: 1 });

      const newLevel = await homepageService.createLevel(levelFormData);
      
      // Replace optimistic update with real data
      setLevels(prev => prev.map(level => 
        level.level_uuid === tempId ? newLevel : level
      ));
      
      showSuccessAnimation(newLevel.level_uuid);
    } catch (error) {
      console.error('Failed to create level:', error);
      // Revert optimistic update
      removeLevelOptimistically(tempId);
    } finally {
      removeOperationLoading(tempId);
    }
  };

  const handleEditLevel = (level) => {
    setEditingLevel(level);
    setLevelFormData({ name: level.name, order: level.order });
    setShowLevelForm(true);
  };

  const handleUpdateLevel = async (e) => {
    e.preventDefault();
    const levelUuid = editingLevel.level_uuid;

    try {
      addOperationLoading(levelUuid);
      updateLevelOptimistically(levelUuid, levelFormData);
      setShowLevelForm(false);
      setEditingLevel(null);
      setLevelFormData({ name: '', order: 1 });

      const updatedLevel = await homepageService.updateLevel(levelUuid, levelFormData);
      
      // Update with real data
      setLevels(prev => prev.map(level => 
        level.level_uuid === levelUuid ? { ...level, ...updatedLevel } : level
      ));
      
      showSuccessAnimation(levelUuid);
    } catch (error) {
      console.error('Failed to update level:', error);
      // Revert by refetching
      fetchLevels();
    } finally {
      removeOperationLoading(levelUuid);
    }
  };

  const handleDeleteLevel = async (levelUuid) => {
    if (window.confirm('Are you sure? This will delete the level and all its sections and items.')) {
      try {
        addOperationLoading(levelUuid);
        removeLevelOptimistically(levelUuid);
        
        await homepageService.deleteLevel(levelUuid);
      } catch (error) {
        console.error('Failed to delete level:', error);
        // Revert by refetching
        fetchLevels();
      } finally {
        removeOperationLoading(levelUuid);
      }
    }
  };

  // Section handlers with optimistic updates
  const handleCreateSection = async (e) => {
    e.preventDefault();
    const tempId = `temp-${Date.now()}`;
    const optimisticSection = {
      section_uuid: tempId,
      title: sectionFormData.title,
      section_type: sectionFormData.section_type,
      order: sectionFormData.order,
      extra_config: sectionFormData.extra_config,
      items: []
    };

    try {
      addOperationLoading(tempId);
      addSectionOptimistically(currentLevelUuid, optimisticSection);
      setShowSectionForm(false);
      setSectionFormData({ title: '', section_type: 'carousel', order: 1, extra_config: {} });
      
      const newSection = await homepageService.createSection(currentLevelUuid, sectionFormData);
      
      // Replace optimistic update with real data
      updateSectionOptimistically(currentLevelUuid, tempId, newSection);
      setLevels(prev => prev.map(level => 
        level.level_uuid === currentLevelUuid
          ? {
              ...level,
              sections: level.sections?.map(section =>
                section.section_uuid === tempId
                  ? { ...newSection, items: [] }
                  : section
              ) || []
            }
          : level
      ));
      
      showSuccessAnimation(newSection.section_uuid);
      setCurrentLevelUuid(null);
    } catch (error) {
      console.error('Failed to create section:', error);
      removeSectionOptimistically(currentLevelUuid, tempId);
    } finally {
      removeOperationLoading(tempId);
    }
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionFormData({
      title: section.title,
      section_type: section.section_type,
      order: section.order,
      extra_config: section.extra_config || {}
    });
    setShowSectionForm(true);
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    const sectionUuid = editingSection.section_uuid;
    const levelUuid = levels.find(level => 
      level.sections?.some(section => section.section_uuid === sectionUuid)
    )?.level_uuid;

    try {
      addOperationLoading(sectionUuid);
      updateSectionOptimistically(levelUuid, sectionUuid, sectionFormData);
      setShowSectionForm(false);
      setEditingSection(null);
      setSectionFormData({ title: '', section_type: 'carousel', order: 1, extra_config: {} });

      const updatedSection = await homepageService.updateSection(sectionUuid, sectionFormData);
      
      updateSectionOptimistically(levelUuid, sectionUuid, updatedSection);
      showSuccessAnimation(sectionUuid);
    } catch (error) {
      console.error('Failed to update section:', error);
      fetchLevels();
    } finally {
      removeOperationLoading(sectionUuid);
    }
  };

  const handleDeleteSection = async (sectionUuid) => {
    if (window.confirm('Are you sure? This will delete the section and all its items.')) {
      const levelUuid = levels.find(level => 
        level.sections?.some(section => section.section_uuid === sectionUuid)
      )?.level_uuid;

      try {
        addOperationLoading(sectionUuid);
        removeSectionOptimistically(levelUuid, sectionUuid);
        
        await homepageService.deleteSection(sectionUuid);
      } catch (error) {
        console.error('Failed to delete section:', error);
        fetchLevels();
      } finally {
        removeOperationLoading(sectionUuid);
      }
    }
  };

  // Item handlers with optimistic updates
  const handleCreateItem = async (e) => {
    e.preventDefault();
    const tempId = `temp-${Date.now()}`;
    const optimisticItem = {
      item_uuid: tempId,
      title: itemFormData.title,
      subtitle: itemFormData.subtitle,
      link: itemFormData.link,
      order: itemFormData.order,
      video_url: itemFormData.video_url,
      image: itemFormData.image ? URL.createObjectURL(itemFormData.image) : null
    };

    const levelUuid = levels.find(level => 
      level.sections?.some(section => section.section_uuid === currentSectionUuid)
    )?.level_uuid;

    try {
      addOperationLoading(tempId);
      addItemOptimistically(levelUuid, currentSectionUuid, optimisticItem);
      setShowItemForm(false);
      setItemFormData({ title: '', subtitle: '', link: '', order: 1, image: null, video_url: '' });

      const formData = new FormData();
      formData.append('title', itemFormData.title);
      formData.append('subtitle', itemFormData.subtitle);
      formData.append('link', itemFormData.link);
      formData.append('order', itemFormData.order);
      formData.append('video_url', itemFormData.video_url);
      if (itemFormData.image) {
        formData.append('image', itemFormData.image);
      }

      const newItem = await homepageService.createItem(currentSectionUuid, formData);
      
      // Replace optimistic update with real data
      updateItemOptimistically(levelUuid, currentSectionUuid, tempId, newItem);
      setLevels(prev => prev.map(level => 
        level.level_uuid === levelUuid
          ? {
              ...level,
              sections: level.sections?.map(section =>
                section.section_uuid === currentSectionUuid
                  ? {
                      ...section,
                      items: section.items?.map(item =>
                        item.item_uuid === tempId ? newItem : item
                      ) || []
                    }
                  : section
              ) || []
            }
          : level
      ));
      
      showSuccessAnimation(newItem.item_uuid);
      setCurrentSectionUuid(null);
    } catch (error) {
      console.error('Failed to create item:', error);
      removeItemOptimistically(levelUuid, currentSectionUuid, tempId);
    } finally {
      removeOperationLoading(tempId);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemFormData({
      title: item.title,
      subtitle: item.subtitle || '',
      link: item.link || '',
      order: item.order,
      image: null,
      video_url: item.video_url || ''
    });
    setShowItemForm(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    const itemUuid = editingItem.item_uuid;
    const levelUuid = levels.find(level => 
      level.sections?.some(section => 
        section.items?.some(item => item.item_uuid === itemUuid)
      )
    )?.level_uuid;
    const sectionUuid = levels.find(level => 
      level.sections?.some(section => 
        section.items?.some(item => item.item_uuid === itemUuid)
      )
    )?.sections?.find(section => 
      section.items?.some(item => item.item_uuid === itemUuid)
    )?.section_uuid;

    try {
      addOperationLoading(itemUuid);
      const optimisticUpdates = {
        title: itemFormData.title,
        subtitle: itemFormData.subtitle,
        link: itemFormData.link,
        order: itemFormData.order,
        video_url: itemFormData.video_url
      };
      if (itemFormData.image) {
        optimisticUpdates.image = URL.createObjectURL(itemFormData.image);
      }
      
      updateItemOptimistically(levelUuid, sectionUuid, itemUuid, optimisticUpdates);
      setShowItemForm(false);
      setEditingItem(null);
      setItemFormData({ title: '', subtitle: '', link: '', order: 1, image: null, video_url: '' });

      const formData = new FormData();
      formData.append('title', itemFormData.title);
      formData.append('subtitle', itemFormData.subtitle);
      formData.append('link', itemFormData.link);
      formData.append('order', itemFormData.order);
      formData.append('video_url', itemFormData.video_url);
      if (itemFormData.image) {
        formData.append('image', itemFormData.image);
      }

      const updatedItem = await homepageService.updateItem(itemUuid, formData);
      
      updateItemOptimistically(levelUuid, sectionUuid, itemUuid, updatedItem);
      showSuccessAnimation(itemUuid);
    } catch (error) {
      console.error('Failed to update item:', error);
      fetchLevels();
    } finally {
      removeOperationLoading(itemUuid);
    }
  };

  const handleDeleteItem = async (itemUuid) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const levelUuid = levels.find(level => 
        level.sections?.some(section => 
          section.items?.some(item => item.item_uuid === itemUuid)
        )
      )?.level_uuid;
      const sectionUuid = levels.find(level => 
        level.sections?.some(section => 
          section.items?.some(item => item.item_uuid === itemUuid)
        )
      )?.sections?.find(section => 
        section.items?.some(item => item.item_uuid === itemUuid)
      )?.section_uuid;

      try {
        addOperationLoading(itemUuid);
        removeItemOptimistically(levelUuid, sectionUuid, itemUuid);
        
        await homepageService.deleteItem(itemUuid);
      } catch (error) {
        console.error('Failed to delete item:', error);
        fetchLevels();
      } finally {
        removeOperationLoading(itemUuid);
      }
    }
  };

  const resetForms = () => {
    setShowLevelForm(false);
    setShowSectionForm(false);
    setShowItemForm(false);
    setEditingLevel(null);
    setEditingSection(null);
    setEditingItem(null);
    setCurrentLevelUuid(null);
    setCurrentSectionUuid(null);
    setLevelFormData({ name: '', order: 1 });
    setSectionFormData({ title: '', section_type: 'carousel', order: 1, extra_config: {} });
    setItemFormData({ title: '', subtitle: '', link: '', order: 1, image: null, video_url: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Management</h1>
          <p className="text-gray-600">Manage homepage levels, sections, and content</p>
        </div>
        <button
          onClick={() => setShowLevelForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Level
        </button>
      </div>

      {/* Level Form Modal */}
      {showLevelForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingLevel ? 'Edit Level' : 'Add New Level'}
            </h3>
            <form onSubmit={editingLevel ? handleUpdateLevel : handleCreateLevel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level Name *
                </label>
                <input
                  type="text"
                  required
                  value={levelFormData.name}
                  onChange={(e) => setLevelFormData({ ...levelFormData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter level name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={levelFormData.order}
                  onChange={(e) => setLevelFormData({ ...levelFormData, order: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForms} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingLevel ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Form Modal */}
      {showSectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </h3>
            <form onSubmit={editingSection ? handleUpdateSection : handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title *
                </label>
                <input
                  type="text"
                  required
                  value={sectionFormData.title}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter section title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Type *
                </label>
                <select
                  required
                  value={sectionFormData.section_type}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, section_type: e.target.value })}
                  className="input-field"
                >
                  <option value="carousel">Carousel</option>
                  <option value="grid">Grid</option>
                  <option value="video">Video</option>
                  <option value="filter">Filter</option>
                  <option value="deals">Deals</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={sectionFormData.order}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, order: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForms} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingSection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Form Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter item title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={itemFormData.subtitle}
                  onChange={(e) => setItemFormData({ ...itemFormData, subtitle: e.target.value })}
                  className="input-field"
                  placeholder="Enter subtitle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link
                </label>
                <input
                  type="text"
                  value={itemFormData.link}
                  onChange={(e) => setItemFormData({ ...itemFormData, link: e.target.value })}
                  className="input-field"
                  placeholder="/products/deals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={itemFormData.video_url}
                  onChange={(e) => setItemFormData({ ...itemFormData, video_url: e.target.value })}
                  className="input-field"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setItemFormData({ ...itemFormData, image: e.target.files[0] })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={itemFormData.order}
                  onChange={(e) => setItemFormData({ ...itemFormData, order: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForms} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Levels List */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : levels.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No levels found. Create your first level to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {levels.map((level) => (
              <div 
                key={level.level_uuid} 
                className={`border border-gray-200 rounded-lg transition-all duration-200 ${
                  successAnimations.has(level.level_uuid) ? 'ring-2 ring-green-500 bg-green-50' : ''
                } ${
                  operationLoading.has(level.level_uuid) ? 'opacity-50' : ''
                }`}
              >
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleLevel(level.level_uuid)}
                      className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                      {expandedLevels.has(level.level_uuid) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
                    <span className="ml-2 text-sm text-gray-500">Order: {level.order}</span>
                    {operationLoading.has(level.level_uuid) && (
                      <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                    {successAnimations.has(level.level_uuid) && (
                      <Check className="ml-2 h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setCurrentLevelUuid(level.level_uuid);
                        setShowSectionForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                      disabled={operationLoading.has(level.level_uuid)}
                    >
                      Add Section
                    </button>
                    <button
                      onClick={() => handleEditLevel(level)}
                      className="text-yellow-600 hover:text-yellow-900"
                      disabled={operationLoading.has(level.level_uuid)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLevel(level.level_uuid)}
                      className="text-red-600 hover:text-red-900"
                      disabled={operationLoading.has(level.level_uuid)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expandedLevels.has(level.level_uuid) && (
                  <div className="p-4 space-y-3">
                    {level.sections?.length === 0 ? (
                      <p className="text-gray-500 text-sm">No sections in this level</p>
                    ) : (
                      level.sections?.map((section) => {
                        const SectionIcon = getSectionIcon(section.section_type);
                        return (
                          <div 
                            key={section.section_uuid} 
                            className={`border border-gray-100 rounded-lg ml-6 transition-all duration-200 ${
                              successAnimations.has(section.section_uuid) ? 'ring-2 ring-green-500 bg-green-50' : ''
                            } ${
                              operationLoading.has(section.section_uuid) ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="p-3 bg-gray-25 flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  onClick={() => toggleSection(section.section_uuid)}
                                  className="mr-2 text-gray-400 hover:text-gray-600"
                                >
                                  {expandedSections.has(section.section_uuid) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                                <SectionIcon className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="font-medium text-gray-900">{section.title}</span>
                                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {section.section_type}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">Order: {section.order}</span>
                                {operationLoading.has(section.section_uuid) && (
                                  <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                )}
                                {successAnimations.has(section.section_uuid) && (
                                  <Check className="ml-2 h-4 w-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setCurrentSectionUuid(section.section_uuid);
                                    setShowItemForm(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                  disabled={operationLoading.has(section.section_uuid)}
                                >
                                  Add Item
                                </button>
                                <button
                                  onClick={() => handleEditSection(section)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                  disabled={operationLoading.has(section.section_uuid)}
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSection(section.section_uuid)}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={operationLoading.has(section.section_uuid)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            {expandedSections.has(section.section_uuid) && (
                              <div className="p-3 space-y-2">
                                {section.items?.length === 0 ? (
                                  <p className="text-gray-500 text-sm">No items in this section</p>
                                ) : (
                                  section.items?.map((item) => (
                                    <div 
                                      key={item.item_uuid} 
                                      className={`flex items-center justify-between p-2 bg-white border border-gray-100 rounded ml-6 transition-all duration-200 ${
                                        successAnimations.has(item.item_uuid) ? 'ring-2 ring-green-500 bg-green-50' : ''
                                      } ${
                                        operationLoading.has(item.item_uuid) ? 'opacity-50' : ''
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        {item.image && (
                                          <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-8 w-8 object-cover rounded mr-3"
                                          />
                                        )}
                                        <div>
                                          <span className="text-sm font-medium text-gray-900">{item.title}</span>
                                          {item.subtitle && (
                                            <span className="ml-2 text-xs text-gray-500">{item.subtitle}</span>
                                          )}
                                          <span className="ml-2 text-xs text-gray-400">Order: {item.order}</span>
                                          {operationLoading.has(item.item_uuid) && (
                                            <div className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                          )}
                                          {successAnimations.has(item.item_uuid) && (
                                            <Check className="ml-2 inline-block h-3 w-3 text-green-600" />
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => handleEditItem(item)}
                                          className="text-yellow-600 hover:text-yellow-900"
                                          disabled={operationLoading.has(item.item_uuid)}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteItem(item.item_uuid)}
                                          className="text-red-600 hover:text-red-900"
                                          disabled={operationLoading.has(item.item_uuid)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
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

export default HomepageManager;
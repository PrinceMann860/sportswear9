import { useState, useEffect } from 'react';
import {
  Upload, Trash2, X, Image as ImageIcon,
  CreditCard as Edit, Save, Star, StarOff
} from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';

const AttributeImageManager = ({ attributeValue, onClose, onImagesUpdated }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState({
    alt_text: '',
    is_main: false
  });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Initialize with existing images
    if (attributeValue.images && Array.isArray(attributeValue.images)) {
      const formattedImages = attributeValue.images.map(img => ({
        id: img.image_uuid,
        url: img.image_url,
        alt_text: img.alt_text || '',
        is_main: img.is_main || false,
        uploaded_at: img.uploaded_at
      }));
      setImages(formattedImages);
    }
    setLoading(false);
  }, [attributeValue]);

  // 🔹 Handle image uploads (multipart/form-data)
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      // Upload to backend
      const result = await attributeService.uploadVariantAttributeImages(
        attributeValue.productUuid,
        attributeValue.variantId,
        attributeValue.id,
        formData
      );

      // Build new images from response
      const uploadedImages =
        result?.uploaded_images?.map((url, index) => ({
          id: `${Date.now()}-${index}`,
          url,
          alt_text: '',
          is_main: false
        })) || [];

      // ✅ Update UI immediately
      setImages(prev => [...prev, ...uploadedImages]);

      showSuccess(`${files.length} image(s) uploaded successfully`);
      onImagesUpdated?.(); // Notify parent if needed
    } catch (error) {
      console.error('Failed to upload images:', error);
      showError(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // 🔹 Edit metadata
  const handleEditImage = (image) => {
    setEditingImage(image);
    setImageMetadata({
      alt_text: image.alt_text || '',
      is_main: image.is_main || false
    });
  };

  const handleUpdateImageMetadata = async () => {
    try {
      await attributeService.updateMediaMetadata(editingImage.id, imageMetadata);

      // Update UI
      setImages(prev => prev.map(img =>
        img.id === editingImage.id ? { ...img, ...imageMetadata } : img
      ));

      setEditingImage(null);
      showSuccess('Image metadata updated successfully');
      onImagesUpdated?.();
    } catch (error) {
      console.error('Failed to update image metadata:', error);
      showError('Failed to update image metadata');
    }
  };

  // 🔹 Delete image
  const handleDeleteImage = async (image) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await attributeService.deleteVariantMedia(image.id);
        setImages(prev => prev.filter(img => img.id !== image.id));
        showSuccess('Image deleted successfully');
        onImagesUpdated?.();
      } catch (error) {
        console.error('Failed to delete image:', error);
        showError('Failed to delete image');
      }
    }
  };

  // 🔹 Set main image
  const handleSetMainImage = async (image) => {
    try {
      const updatePromises = images
        .filter(img => img.id !== image.id && img.is_main)
        .map(img => attributeService.updateMediaMetadata(img.id, { ...img, is_main: false }));

      await Promise.all(updatePromises);
      await attributeService.updateMediaMetadata(image.id, { ...image, is_main: true });

      setImages(prev =>
        prev.map(img => ({ ...img, is_main: img.id === image.id }))
      );

      showSuccess('Main image updated successfully');
      onImagesUpdated?.();
    } catch (error) {
      console.error('Failed to set main image:', error);
      showError('Failed to set main image');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">

        {/* Close Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Images for {attributeValue.name}: {attributeValue.value}
            </h3>
            <div className="flex items-center mt-2 space-x-4">
              {attributeValue.meta?.hex && (
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                    style={{ backgroundColor: attributeValue.meta.hex }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Color: {attributeValue.meta.hex}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-500">
                Variant ID: {attributeValue.variantId}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Section */}
        <div className="mb-8 relative">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload New Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50 relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50' : ''}`}
            >
              <Upload className={`h-12 w-12 mb-4 ${uploading ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="text-lg font-medium text-gray-700 mb-2">
                {uploading ? 'Uploading images...' : 'Click to upload images'}
              </span>
              <span className="text-sm text-gray-500">
                or drag and drop multiple files here
              </span>
              <span className="text-xs text-gray-400 mt-2">
                PNG, JPG, GIF up to 10MB each • Multiple files supported
              </span>
            </label>

            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* Images Grid */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              Current Images ({images.length})
            </h4>
            {images.length > 0 && (
              <span className="text-sm text-gray-500">
                Click on an image to edit details
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No images uploaded yet</p>
              <p className="text-sm">Upload images to showcase this attribute variant</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.id} className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.alt_text || `${attributeValue.name} - ${attributeValue.value}`}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => handleEditImage(image)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400"
                      style={{ display: 'none' }}
                    >
                      <ImageIcon className="h-12 w-12" />
                    </div>
                    {image.is_main && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" /> Main
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button onClick={() => handleEditImage(image)} className="text-white hover:text-blue-300 bg-blue-600 p-2 rounded-full" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleSetMainImage(image)} className="text-white hover:text-yellow-300 bg-yellow-600 p-2 rounded-full" title="Set main">
                        {image.is_main ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleDeleteImage(image)} className="text-white hover:text-red-300 bg-red-600 p-2 rounded-full" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.alt_text || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Click to edit details</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingImage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Image Details</h4>

              <img src={editingImage.url} alt="Preview" className="w-full h-32 object-cover rounded border border-gray-200 mb-4" />
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text / Description</label>
              <input
                type="text"
                value={imageMetadata.alt_text}
                onChange={(e) => setImageMetadata({ ...imageMetadata, alt_text: e.target.value })}
                className="input-field"
                placeholder={`${attributeValue.value} ${attributeValue.name} image`}
              />
              <label className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={imageMetadata.is_main}
                  onChange={(e) => setImageMetadata({ ...imageMetadata, is_main: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Set as main image</span>
              </label>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setEditingImage(null)} className="btn-secondary">Cancel</button>
                <button onClick={handleUpdateImageMetadata} className="btn-primary flex items-center">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {images.length > 0 && (
              <span>
                {images.filter(img => img.is_main).length > 0
                  ? '1 main image, '
                  : 'No main image set, '}
                {images.length} total image{images.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={onClose} className="btn-primary">Done</button>
        </div>
      </div>
    </div>
  );
};

export default AttributeImageManager;

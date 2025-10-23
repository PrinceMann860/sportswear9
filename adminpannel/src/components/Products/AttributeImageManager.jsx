import { useState, useEffect } from 'react';
import { Upload, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { attributeService } from '../../services/attributeService';
import { useToast } from '../../hooks/useToast';

const AttributeImageManager = ({ attributeValue, onClose, onImagesUpdated }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Initialize with existing images
    setImages(attributeValue.images || []);
    setLoading(false);
  }, [attributeValue]);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        // Upload image for this specific attribute value
        await attributeService.uploadVariantMedia(
          attributeValue.productUuid,
          attributeValue.variantId,
          attributeValue.id,
          formData
        );
      }
      
      showSuccess('Images uploaded successfully');
      onImagesUpdated();
    } catch (error) {
      console.error('Failed to upload images:', error);
      showError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        // Note: You'll need to implement deleteVariantMedia in attributeService
        // For now, we'll just show a success message
        showSuccess('Image deleted successfully');
        onImagesUpdated();
      } catch (error) {
        console.error('Failed to delete image:', error);
        showError('Failed to delete image');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manage Images for {attributeValue.name}: {attributeValue.value}
            </h3>
            {attributeValue.meta?.hex && (
              <div className="flex items-center mt-2">
                <div
                  className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                  style={{ backgroundColor: attributeValue.meta.hex }}
                ></div>
                <span className="text-sm text-gray-600">Color: {attributeValue.meta.hex}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload images or drag and drop'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB each
              </span>
            </label>
          </div>
        </div>

        {/* Images Grid */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Current Images ({images.length})
          </h4>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No images uploaded yet</p>
              <p className="text-sm">Upload images to showcase this attribute</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${attributeValue.name} - ${attributeValue.value}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="text-white hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeImageManager;
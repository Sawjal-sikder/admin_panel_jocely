import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { API_BASE_URL } from '../../services/auth';
import { X } from 'lucide-react';

const EditStyle = ({ isOpen, onClose, style, onStyleUpdate, useLocalUpdate = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  // Update form data when style changes
  useEffect(() => {
    if (style) {
      setFormData({
        name: style.name || '',
        description: style.description || '',
      });
    }
  }, [style]);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!style) return;

    try {
      setLoading(true);
      setError(null);



      if (useLocalUpdate) {
        // Update local data without API call
        
        const updatedStyleData = {
          id: style.id,
          name: formData.name || '',
          description: formData.description || '',
        };


        onStyleUpdate(updatedStyleData);
        onClose();
        return;
      }

      // API update logic (existing code)
      const requestBody = {
        name: formData.name || '',
        description: formData.description || '',
        // updated_at: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/ai/trade/styles/${style.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        // Try to get more detailed error information
        let errorData;
        try {
          errorData = await response.json();
          
          // Handle validation errors more gracefully
          if (errorData.email && Array.isArray(errorData.email)) {
            throw new Error(`Email validation error: ${errorData.email.join(', ')}`);
          }
          
          // Handle other field validation errors
          const validationErrors = [];
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              validationErrors.push(`${field}: ${errorData[field].join(', ')}`);
            }
          });
          
          if (validationErrors.length > 0) {
            throw new Error(`Validation errors: ${validationErrors.join('; ')}`);
          }
          
          // If no specific validation errors, use general message
          throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
          
        } catch (parseError) {
          // If JSON parsing fails, don't try to read as text since we already consumed the stream
          if (parseError.message.includes('Validation errors') || parseError.message.includes('Email validation error')) {
            throw parseError; // Re-throw our custom validation error
          }
          throw new Error(`HTTP error! status: ${response.status} - Unable to parse error response`);
        }
      }

      const updatedStyle = await response.json();
      
      // Ensure the updated Style has the ID and updated timestamp for proper list updating
      const updatedStyleWithId = {
        ...updatedStyle,
        id: updatedStyle.id,
        // updated_at: updatedStyle.updated_at || new Date().toISOString()
      };
      
      onStyleUpdate(updatedStyleWithId);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Edit Trade Style</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name of Trade Style
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
                
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description of Trade Style
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description..."
                rows="8"
                required
              />
            </div>
            
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Trade Style'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStyle;
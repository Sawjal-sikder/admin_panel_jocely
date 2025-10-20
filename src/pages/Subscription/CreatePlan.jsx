import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import { API_BASE_URL } from '../../services/auth';
import { X } from 'lucide-react';

const CreatePlan = ({ isOpen, onClose, onSuccess }) => {

    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        interval: 'month',
        interval_count: 1,
        description: '',
        trial_days: 0,
        active: true
      });
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
    
      // Update form data when plan changes
      useEffect(() => {
          setFormData({
            name: '',
            amount: '',
            interval: 'month',
            interval_count: 1,
            description: '',
            trial_days: 0,
            active: true
          });
      }, []);
    
      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : 
                   type === 'number' ? parseFloat(value) || 0 : value
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          setLoading(true);
          setError(null);
    
          // Prepare the request body - amount should be in cents
          const requestBody = {
            name: formData.name,
            amount: Math.round(formData.amount * 100), // Convert to cents
            interval: formData.interval,
            interval_count: parseInt(formData.interval_count),
            description: formData.description,
            trial_days: parseInt(formData.trial_days),
            active: formData.active
          };
    
          const response = await fetch(`${API_BASE_URL}/payment/plans/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
    
          if (!response.ok) {
            throw new Error('Failed to create plan');
          }
    
          const data = await response.json();
          console.log('Plan created successfully:', data);
          
          // Reset form
          setFormData({
            name: '',
            amount: '',
            interval: 'month',
            interval_count: 1,
            description: '',
            trial_days: 0,
            active: true
          });
          
          // Call success callback if provided
          if (onSuccess) {
            onSuccess(data);
          }
          
          // Close the modal
          onClose();
        } catch (err) {
          console.error(err);
          setError(err.message || 'An error occurred');
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
          <h3 className="text-lg font-medium text-gray-900">Create Subscription Plan</h3>
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
                Plan Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter plan name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                min="0"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
                  Interval
                </label>
                <select
                  id="interval"
                  name="interval"
                  value={formData.interval}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="interval_count" className="block text-sm font-medium text-gray-700 mb-1">
                  Interval Count
                </label>
                <input
                  type="number"
                  id="interval_count"
                  name="interval_count"
                  value={formData.interval_count}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter plan description"
              />
            </div>
            
            <div>
              <label htmlFor="trial_days" className="block text-sm font-medium text-gray-700 mb-1">
                Trial Days
              </label>
              <input
                type="number"
                id="trial_days"
                name="trial_days"
                value={formData.trial_days}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                Active Plan
              </label>
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
              {loading ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlan;

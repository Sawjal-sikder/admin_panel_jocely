import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Key, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/auth';

const Credential = () => {
  const [credentialData, setCredentialData] = useState({
    api_key: '',
    secret_key: '',
    webhook_url: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setCredentialData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });
    
    // Add validation logic here
    if (!credentialData.api_key) {
      setMessage({ type: 'error', text: 'API Key is required' });
      return;
    }

    if (!credentialData.secret_key) {
      setMessage({ type: 'error', text: 'Secret Key is required' });
      return;
    }

    const payload = {
        api_key: credentialData.api_key,
        secret_key: credentialData.secret_key,
        webhook_url: credentialData.webhook_url,
    };

    setIsLoading(true);

    try {
        const response = await api.post(`/auth/update-credentials/`, payload);
        if (response.status === 200) {
            setMessage({ type: 'success', text: 'Credentials updated successfully!' });
        } else {
            setMessage({ type: 'error', text: 'Failed to update credentials' });
        }        
    } catch (error) {
        console.error('Error updating credentials:', error);
        
        // Show specific error message from API if available
        let errorMessage = 'Failed to update credentials';
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.error) {
                errorMessage = error.response.data.error;
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } else {
                // Handle field-specific errors
                const fieldErrors = [];
                Object.keys(error.response.data).forEach(field => {
                    if (Array.isArray(error.response.data[field])) {
                        fieldErrors.push(`${field}: ${error.response.data[field].join(', ')}`);
                    } else {
                        fieldErrors.push(`${field}: ${error.response.data[field]}`);
                    }
                });
                if (fieldErrors.length > 0) {
                    errorMessage = fieldErrors.join('\n');
                }
            }
        }
        
        setMessage({ type: 'error', text: errorMessage });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>API Credentials</Card.Title>
        <p className="text-sm text-gray-600">
          Manage your API keys and access tokens for external integrations.
        </p>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          {/* Message Display */}
          {message.text && (
            <div className={`flex items-center p-4 rounded-lg ${
              message.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-700' 
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}>
              {message.type === 'error' ? (
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              )}
              <span className="text-sm font-medium whitespace-pre-line">{message.text}</span>
            </div>
          )}

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
            <div className="space-y-4">
              <Input
                label="API Key"
                name="api_key"
                type="text"
                value={credentialData.api_key}
                onChange={handleCredentialChange}
                placeholder="Enter your API key"
                required
              />
              <div className="relative">
                <Input
                  label="Secret Key"
                  name="secret_key"
                  type={showSecretKey ? "text" : "password"}
                  value={credentialData.secret_key}
                  onChange={handleCredentialChange}
                  placeholder="Enter your secret key"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Input
                label="Webhook URL (Optional)"
                name="webhook_url"
                type="url"
                value={credentialData.webhook_url}
                onChange={handleCredentialChange}
                placeholder="https://your-domain.com/webhook"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Information</h3>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Key className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    API Key Security
                  </p>
                  <p className="text-sm text-gray-500">
                    Keep your API credentials secure and never share them publicly
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update Credentials'}
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default Credential

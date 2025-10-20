import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  Save,
  Camera
} from 'lucide-react';
import useFetchData from '../../hooks/useFetchData';

const Profile = () => {
  const endpoint = '/auth/user/';
  const { data, loading, error } = useFetchData(endpoint);
  console.log('Fetched user data:', data);

  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 234 567 8900',
    company: 'Admin Panel Inc.',
    bio: 'System administrator with over 5 years of experience.',
  });

  // Update profileData when data is fetched
  useEffect(() => {
    if (data) {
      setProfileData({
        name: data.full_name || 'Admin User',
        email: data.email || 'admin@example.com',
        phone: data.phone || '+1 234 567 8900',
        company: data.company || 'Admin Panel Inc.',
        bio: data.bio || 'System administrator with over 5 years of experience.',
      });
    }
  }, [data]);


const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    alert('Settings saved successfully!');
  };

  // Show loading state
  if (loading) {
    return (
      <Card>
        <Card.Content>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading profile data...</div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <Card.Content>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">Error loading profile data. Please try again.</div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
                  <Card>
                <Card.Header>
                  <Card.Title>Profile Information</Card.Title>
                  <p className="text-sm text-gray-600">
                    Update your account profile information and email address.
                  </p>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-medium text-gray-600">
                          {profileData.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, GIF or PNG. 1MB max.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                      <Input
                        label="Phone Number"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                      />
                      <Input
                        label="Company"
                        name="company"
                        value={profileData.company}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>

  )
}

export default Profile

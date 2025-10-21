import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import api from '../../services/auth';
import { formatDate } from '../../components/ui/formatDate';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Folder,
  Package
} from 'lucide-react';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FetchCategories();
  }, []);

  const FetchCategories = async () => {
    // Fetch categories from API
    try {
      setLoading(true);
      console.log('Fetching categories from API...');
      const response = await api.get('/shop/categories/');
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Data type:', typeof response.data);
      console.log('Is array:', Array.isArray(response.data));
      
      const data = response.data;
      
      // Check if data has a nested structure (common in APIs)
      let categoriesData = data;
      if (data && data.results) {
        categoriesData = data.results;
        console.log('Using nested results:', categoriesData);
      } else if (data && data.data) {
        categoriesData = data.data;
        console.log('Using nested data:', categoriesData);
      }
      
      // Ensure data is an array before setting it
      const finalCategories = Array.isArray(categoriesData) ? categoriesData : [];
      console.log('Final categories to set:', finalCategories);
      setCategories(finalCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      // Set empty array on error to prevent filter issues
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data - in a real app, this would come from an API
  // const [categories] = useState([
  //   {
  //     id: 1,
  //     name: 'Electronics',
  //     description: 'Electronic devices and gadgets',
  //     productCount: 15,
  //     status: 'Active',
  //     createdAt: '2023-12-01',
  //     updatedAt: '2024-01-10',
  //   },
  //   {
  //     id: 2,
  //     name: 'Clothing',
  //     description: 'Apparel and fashion items',
  //     productCount: 8,
  //     status: 'Active',
  //     createdAt: '2023-12-05',
  //     updatedAt: '2024-01-08',
  //   },
  //   {
  //     id: 3,
  //     name: 'Home & Kitchen',
  //     description: 'Home appliances and kitchen tools',
  //     productCount: 12,
  //     status: 'Active',
  //     createdAt: '2023-12-10',
  //     updatedAt: '2024-01-05',
  //   },
  //   {
  //     id: 4,
  //     name: 'Sports',
  //     description: 'Sports equipment and accessories',
  //     productCount: 0,
  //     status: 'Inactive',
  //     createdAt: '2023-12-15',
  //     updatedAt: '2023-12-15',
  //   },
  //   {
  //     id: 5,
  //     name: 'Books',
  //     description: 'Educational and recreational books',
  //     productCount: 3,
  //     status: 'Active',
  //     createdAt: '2023-12-20',
  //     updatedAt: '2024-01-01',
  //   },
  // ]);

  const filteredCategories = (Array.isArray(categories) ? categories : []).filter(category => 
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const totalProducts = (Array.isArray(categories) ? categories : []).reduce((sum, category) => sum + (category.productCount || 0), 0);

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize your products with categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{Array.isArray(categories) ? categories.length : 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Folder className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(Array.isArray(categories) ? categories : []).filter(c => c.is_active).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </Card>


        {/* Categories Table */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-500">Loading categories...</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Category</Table.Header>
                    <Table.Header>Products</Table.Header>
                    <Table.Header>Status</Table.Header>
                    <Table.Header>Created</Table.Header>
                    <Table.Header>Actions</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {filteredCategories.map((category) => (
                    <Table.Row key={category.id}>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Folder className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            <div className="text-sm text-gray-500">{category.description}</div>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{category.productCount}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(category.status)}`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-sm text-gray-500">
                        {formatDate(category.created_at)}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Folder className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? 'Try adjusting your search criteria.'
                      : 'Get started by creating a new category.'
                    }
                  </p>
                  {!searchTerm && (
                    <div className="mt-6">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Categories;
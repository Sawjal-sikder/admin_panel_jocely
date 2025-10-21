import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import CreateStyle from './CreateStyle';
import EditStyle from './EditStyle';
import DeleteStyle from './DeleteStyle';
import api from '../../services/auth';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical
} from 'lucide-react';

const Product = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // for creating new product
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // for product edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // for product delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Transform API data to match the expected format for the UI
  const transformProductData = (apiProduct) => {
    return {
      id: apiProduct.id,
      name: apiProduct.name || 'N/A',
      description: apiProduct.description || 'N/A',
      category: apiProduct.category || 'N/A',
      price: apiProduct.price || '0.00',
      discount_price: apiProduct.discount_price || null,
      discount_percentage: apiProduct.discount_percentage || 0,
      type_of_product: apiProduct.type_of_product || 'N/A',
      is_active: apiProduct.is_active || false,
      image1: apiProduct.image1 || null,
      image2: apiProduct.image2 || null,
      image3: apiProduct.image3 || null,
      total_reviews: apiProduct.total_reviews || 0,
      average_rating: apiProduct.average_rating || 0,
      created_at: apiProduct.created_at || '',
      updated_at: apiProduct.updated_at || ''
    };
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/shop/products/list/');

      // With Axios, the data is directly available in response.data
      const data = response.data;

      // Handle the API response structure based on your provided data
      const rawProductsData = data.results || data.data || (Array.isArray(data) ? data : []);
      
      if (!rawProductsData || rawProductsData.length === 0) {
        console.log('No products found in API response');
        setProducts([]);
        setError('No products found');
        return;
      }
      
      // Transform API data to match UI expectations
      const transformedProducts = rawProductsData.map(transformProductData);
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setError(`API Error: ${error.response?.data?.message || error.message}`);
      
      // For testing, let's add some sample data if API fails
      const sampleData = {
        "count": 2,
        "results": [
          {
            "id": 1,
            "category": "Skincare",
            "name": "Sample Product 1",
            "description": "A sample product for testing",
            "image1": null,
            "price": "10.99",
            "discount_price": "8.99",
            "type_of_product": "Skin",
            "is_active": true,
            "discount_percentage": 18.2,
            "total_reviews": 5,
            "average_rating": 4.5
          },
          {
            "id": 2,
            "category": "Makeup",
            "name": "Sample Product 2",
            "description": "Another sample product for testing",
            "image1": null,
            "price": "25.99",
            "discount_price": null,
            "type_of_product": "Makeup",
            "is_active": false,
            "discount_percentage": 0,
            "total_reviews": 3,
            "average_rating": 3.0
          }
        ]
      };
      
      const transformedProducts = sampleData.results.map(transformProductData);
      setProducts(transformedProducts);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Debug: Log the current state
  useEffect(() => {
  }, [products, loading, error]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  const handleRefresh = () => {
    fetchProducts();
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductUpdate = (updatedProductData) => {
    fetchProducts();
  };

  const handleDeleteProduct = async (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProductId(null);
  };

  const handleProductDelete = (deletedProductId) => {
    fetchProducts();
  };


  // Format price display
  const formatPrice = (price, discountPrice) => {
    if (discountPrice) {
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 line-through">${price}</span>
          <span className="text-sm font-medium text-green-600">${discountPrice}</span>
        </div>
      );
    }
    return <span className="text-sm font-medium">${price}</span>;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and monitor your product catalog.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex justify-between sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search Products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center" disabled={loading} onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">Loading products...</div>
            </div>
          ) : (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header width="w-12">ID</Table.Header>
                  <Table.Header width="w-16">Image</Table.Header>
                  <Table.Header width="w-48 sm:w-64">Product Details</Table.Header>
                  <Table.Header width="w-20">Category</Table.Header>
                  <Table.Header width="w-24">Price</Table.Header>
                  <Table.Header width="w-20">Status</Table.Header>
                  <Table.Header width="w-24">Reviews</Table.Header>
                  <Table.Header width="w-20">Actions</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredProducts.map((product) => (
                  <Table.Row key={product.id}>
                    <Table.Cell>
                      <div className="text-sm font-medium text-gray-900">{product.id}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image1 ? (
                          <img 
                            src={product.image1} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell allowWrap={true} className="max-w-xs">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 leading-tight" title={product.name}>
                          {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
                        </div>
                        <div className="text-xs text-gray-500 leading-tight" title={product.description}>
                          {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
                        </div>
                        <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded inline-block">
                          {product.type_of_product}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {formatPrice(product.price, product.discount_price)}
                      {product.discount_percentage > 0 && (
                        <div className="text-xs text-orange-600 font-medium">
                          {product.discount_percentage}% OFF
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium">
                          ⭐ {product.average_rating.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ({product.total_reviews} reviews)
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditProduct(product)}
                          className="p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">
                {searchTerm ? 'No products found matching your search' : 'No products found'}
              </div>
            </div>
          )}
        </Card>

        {/* Edit Product Modal */}
        <EditStyle
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          style={selectedProduct}
          onStyleUpdate={handleProductUpdate}
          useLocalUpdate={false}
        />
        
        {/* Delete Product Modal */}
        <DeleteStyle
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          styleId={selectedProductId}
          onStyleDelete={handleProductDelete}
        />
        
        {/* Create Product Modal */}
        <CreateStyle
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onStyleCreate={fetchProducts}
        />
      </div>
    </Layout>
  );
};

export default Product;
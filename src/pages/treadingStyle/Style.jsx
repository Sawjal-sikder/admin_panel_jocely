import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import CreateStyle from './CreateStyle';
import EditStyle from './EditStyle';
import DeleteStyle from './DeleteStyle';
import { API_BASE_URL } from '../../services/auth';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical
} from 'lucide-react';

const TreadingStyle = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // for creating new style
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // for style edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);

  // for style delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState(null);

  // Transform API data to match the expected format for the UI
  const transformStyleData = (apiStyle) => {
    return {
      id: apiStyle.id,
      name: apiStyle.name || 'N/A',
      description: apiStyle.description || 'N/A',      
    };
  };

  // Fetch styles from API only
  const fetchStyles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/ai/trade/styles/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assuming API returns styles in a 'styles' field or directly as array
      const rawStylesData = Array.isArray(data) ? data : data.styles || data.data || [];
      
      // Transform API data to match UI expectations
      const transformedStyles = rawStylesData.map(transformStyleData);
      
      setStyles(transformedStyles);
    } catch (error) {
      setError(`API Error: ${error.message}`);
      setStyles([]); 
    } finally {
      setLoading(false);
    }
  };

  // Fetch styles on component mount
  useEffect(() => {
    fetchStyles();
  }, []);

  const filteredStyles = styles.filter(style => {
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         style.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });



  const handleRefresh = () => {
    fetchStyles();
  };

  const handleEditStyle = (style) => {
    setSelectedStyle(style);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStyle(null);
  };

  const handleStyleUpdate = (updatedStyleData) => {
    fetchStyles();
  };

  const handleDeleteStyle = async (styleId) => {
    setSelectedStyleId(styleId);
    setIsDeleteModalOpen(true);
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStyleId(null);
    handleStyleDelete(selectedStyleId);
  };

  const handleStyleDelete = (deletedStyleId) => {
    fetchStyles();
  }


  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trade Styles</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and monitor trade styles used in AI trading.
              </p>
            </div>
            {/* <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button> */}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {error} - Showing dummy data instead.
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
                  placeholder="Search Trade Styles..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center" disabled={loading} onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Trade Style
            </Button>
            </div>
          </div>
        </Card>

        {/* Styles Table */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">Loading styles...</div>
            </div>
          ) : (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header width="w-16">ID</Table.Header>
                  <Table.Header width="w-1/3">Name of Trade style</Table.Header>
                  <Table.Header width="w-1/2">Description of Trade style</Table.Header>
                  <Table.Header width="w-24">Actions</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredStyles.map((data) => (
                  <Table.Row key={data.id}>
                    <Table.Cell>
                      <div className="text-sm font-medium text-gray-900">{data.id}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-3">
                        {/* <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {data.name.charAt(0)}
                          </span>
                        </div> */}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{data.name || "-"}</div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-sm text-gray-900 w-full whitespace-normal break-words">

                        {data.description || "-"}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        {/* <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button> */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditStyle(data)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button> */}
                        <Button variant="ghost" size="sm"
                        onClick={() => handleDeleteStyle(data.id)}
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

          {!loading && filteredStyles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">No styles found</div>
            </div>
          )}
        </Card>

        {/* Edit Style Modal */}
        <EditStyle
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          style={selectedStyle}
          onStyleUpdate={handleStyleUpdate}
          useLocalUpdate={false}
        />
        {/* Delete Style Modal */}
        <DeleteStyle
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          styleId={selectedStyleId}
          onStyleDelete={handleDeleteStyle}
        />
        {/* Create Style Modal */}
        <CreateStyle
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onStyleCreate={fetchStyles}
        />

      </div>
    </Layout>
  );
};

export default TreadingStyle;
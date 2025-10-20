import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import EditPlan from './EditPlan';
import CreatePlan from './CreatePlan';
import { API_BASE_URL } from '../../services/auth';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  CreditCard
} from 'lucide-react';

const Plan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleCreatePlanSuccess = () => {
    // Trigger a refresh to fetch updated data from the server
    setRefreshTrigger(prev => prev + 1);
    setCreateModalOpen(false);
  };

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/payment/plans/all/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPlans(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [refreshTrigger]);

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handlePlanUpdate = (updatedPlan) => {
    // Trigger a refresh to fetch updated data from the server
    setRefreshTrigger(prev => prev + 1);
    setEditModalOpen(false);
    setSelectedPlan(null);
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && plan.active) ||
                         (filterStatus === 'inactive' && !plan.active);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (active) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your subscription plans and pricing
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <div className="p-4">
              <div className="text-red-800">
                <h3 className="text-sm font-medium">Error loading plans</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Actions Bar */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search plans..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  disabled={loading}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <Button className="flex items-center" disabled={loading} onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </Card>

        {/* Create Plan Modal
        <CreatePlan
          isOpen={createModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreatePlanSuccess}
        /> */}

        {/* Plans Table */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">Loading plans...</h3>
              <p className="mt-1 text-sm text-gray-500">Please wait while we fetch your subscription plans.</p>
            </div>
          ) : (
            <>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>Plan</Table.Header>
                    <Table.Header>Price</Table.Header>
                    <Table.Header>Interval</Table.Header>
                    <Table.Header>Total Cost</Table.Header>
                    <Table.Header>Trial Days</Table.Header>
                    <Table.Header>Status</Table.Header>
                    <Table.Header>Actions</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {filteredPlans.map((plan) => (
                    <Table.Row key={plan.id}>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-500">{plan.description}</div>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {plan.price_display}
                          </span>
                          <div className="text-xs text-gray-500">
                            {formatPrice(plan.amount)} per {plan.interval}
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-gray-900">
                          {plan.interval_count} {plan.interval}{plan.interval_count > 1 ? 's' : ''}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(plan.total_cost)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-gray-900">{plan.trial_days} days</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(plan.active)}`}>
                          {plan.active ? 'Active' : 'Inactive'}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          {/* <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button> */}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditPlan(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              {filteredPlans.length === 0 && !loading && (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No plans found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating a new subscription plan.'
                    }
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <div className="mt-6">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Plan
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Edit Plan Modal */}
        <EditPlan 
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          plan={selectedPlan}
          onPlanUpdate={handlePlanUpdate}
        />
        {/* Create Plan Modal */}
        <CreatePlan 
          isOpen={createModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreatePlanSuccess}
        />
      </div>
    </Layout>
  );
};

export default Plan;
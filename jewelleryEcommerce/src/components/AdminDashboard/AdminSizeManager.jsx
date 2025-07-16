import React, { useState, useEffect } from 'react';
import AdminSizeForm from './AdminSizeForm';
import { getSizes, deleteSize, updateSize } from '../../lib/api';

const AdminSizeManager = () => {
    const [showForm, setShowForm] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        try {
            setLoading(true);
            const response = await getSizes();
            if (response.success) {
                setSizes(response.data);
            } else {
                setError(response.error || 'Failed to fetch sizes');
            }
        } catch (err) {
            setError('Failed to fetch sizes');
            console.error('Error fetching sizes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSizeCreated = (newSize) => {
        setSizes(prev => [...prev, newSize]);
        setShowForm(false);
        // Show success message
        alert('Size created successfully!');
    };

    const handleDeleteSize = async (sizeId) => {
        if (window.confirm('Are you sure you want to delete this size?')) {
            try {
                await deleteSize(sizeId);
                setSizes(prev => prev.filter(size => size.id !== sizeId));
                alert('Size deleted successfully!');
            } catch (error) {
                console.error('Error deleting size:', error);
                alert('Failed to delete size');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Size Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {showForm ? 'Cancel' : 'Add New Size'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Size Form */}
            {showForm && (
                <AdminSizeForm
                    onSuccess={handleSizeCreated}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Sizes List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Existing Sizes</h2>
                </div>
                
                {sizes.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No sizes found. Create your first size above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Die No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Diameter (mm)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ball Gauge
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Wire Gauge
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Weight (g)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sizes.map((size) => (
                                    <tr key={size.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {size.dieNo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {size.diameter}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {size.ballGauge}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {size.wireGauge}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {size.weight}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteSize(size.id)}
                                                className="text-red-600 hover:text-red-900 ml-4"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSizeManager;
import React, { useState, useEffect } from 'react';
import { createSize, getSizes } from '../../lib/api';

const AdminSizeForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        dieNo: '',
        diameter: '',
        ballGauge: '',
        wireGauge: '',
        weight: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [existingDieNos, setExistingDieNos] = useState([]);
    const [submitStatus, setSubmitStatus] = useState(null);

    // Fetch existing sizes to check for duplicate die numbers
    useEffect(() => {
        fetchExistingSizes();
    }, []);

    const fetchExistingSizes = async () => {
        try {
            const response = await getSizes();
            if (response.success && Array.isArray(response.data)) {
                const dieNumbers = response.data.map(size => size.dieNo?.toString().trim());
                setExistingDieNos(dieNumbers);
            }
        } catch (error) {
            console.error('Error fetching existing sizes:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear submit status when user makes changes
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Die No validation (REQUIRED and UNIQUE)
        if (!formData.dieNo.trim()) {
            newErrors.dieNo = 'Die No is required';
        } else if (existingDieNos.includes(formData.dieNo.trim())) {
            newErrors.dieNo = 'Die No must be unique. This identifier already exists.';
        }

        // Diameter validation (OPTIONAL)
        if (formData.diameter.trim() && (isNaN(parseFloat(formData.diameter)) || parseFloat(formData.diameter) <= 0)) {
            newErrors.diameter = 'Diameter must be a positive number';
        }

        // Ball Gauge validation (OPTIONAL)
        if (formData.ballGauge.trim() && (isNaN(parseFloat(formData.ballGauge)) || parseFloat(formData.ballGauge) <= 0)) {
            newErrors.ballGauge = 'Ball Gauge must be a positive number';
        }

        // Wire Gauge validation (OPTIONAL)
        if (formData.wireGauge.trim() && (isNaN(parseFloat(formData.wireGauge)) || parseFloat(formData.wireGauge) <= 0)) {
            newErrors.wireGauge = 'Wire Gauge must be a positive number';
        }

        // Weight validation (OPTIONAL)
        if (formData.weight.trim() && (isNaN(parseFloat(formData.weight)) || parseFloat(formData.weight) <= 0)) {
            newErrors.weight = 'Weight must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setSubmitStatus({
                type: 'error',
                message: 'Please fix the errors above and try again.'
            });
            return;
        }

        setLoading(true);
        setSubmitStatus(null);

        try {
            const sizeData = {
                dieNo: formData.dieNo.trim(), // Keep as string
                diameter: formData.diameter.trim() ? parseFloat(formData.diameter.trim()) : null,
                ballGauge: formData.ballGauge.trim() ? parseFloat(formData.ballGauge.trim()) : null,
                wireGauge: formData.wireGauge.trim() ? parseFloat(formData.wireGauge.trim()) : null,
                weight: formData.weight.trim() ? parseFloat(formData.weight.trim()) : null
            };

            console.log('Creating size with data:', sizeData);

            const response = await createSize(sizeData);
            
            if (response.data) {
                setSubmitStatus({
                    type: 'success',
                    message: 'Size created successfully!'
                });

                // Reset form
                setFormData({
                    dieNo: '',
                    diameter: '',
                    ballGauge: '',
                    wireGauge: '',
                    weight: ''
                });

                // Update existing die numbers list
                setExistingDieNos(prev => [...prev, formData.dieNo.trim()]);

                // Call success callback if provided
                if (onSuccess) {
                    onSuccess(response.data);
                }
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            console.error('Error creating size:', error);
            
            let errorMessage = 'Failed to create size. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setSubmitStatus({
                type: 'error',
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            dieNo: '',
            diameter: '',
            ballGauge: '',
            wireGauge: '',
            weight: ''
        });
        setErrors({});
        setSubmitStatus(null);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Size</h2>
                <p className="text-gray-600">Add a new size configuration with unique die identifier</p>
            </div>

            {/* Status Messages */}
            {submitStatus && (
                <div className={`mb-6 p-4 rounded-md ${
                    submitStatus.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    <div className="flex items-center">
                        <div className={`flex-shrink-0 ${
                            submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {submitStatus.type === 'success' ? (
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{submitStatus.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Die No Field - REQUIRED */}
                <div>
                    <label htmlFor="dieNo" className="block text-sm font-medium text-gray-700 mb-2">
                        Die No <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="dieNo"
                        name="dieNo"
                        value={formData.dieNo}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.dieNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter unique die identifier (e.g., DIE001, A123, etc.)"
                        disabled={loading}
                    />
                    {errors.dieNo && (
                        <p className="mt-1 text-sm text-red-600">{errors.dieNo}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Die identifier must be unique (can contain letters and numbers)
                    </p>
                </div>

                {/* Diameter Field - OPTIONAL */}
                <div>
                    <label htmlFor="diameter" className="block text-sm font-medium text-gray-700 mb-2">
                        Diameter <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                        type="number"
                        id="diameter"
                        name="diameter"
                        value={formData.diameter}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.diameter ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter diameter (mm)"
                        disabled={loading}
                    />
                    {errors.diameter && (
                        <p className="mt-1 text-sm text-red-600">{errors.diameter}</p>
                    )}
                </div>

                {/* Ball Gauge Field - OPTIONAL */}
                <div>
                    <label htmlFor="ballGauge" className="block text-sm font-medium text-gray-700 mb-2">
                        Ball Gauge <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                        type="number"
                        id="ballGauge"
                        name="ballGauge"
                        value={formData.ballGauge}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.ballGauge ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter ball gauge"
                        disabled={loading}
                    />
                    {errors.ballGauge && (
                        <p className="mt-1 text-sm text-red-600">{errors.ballGauge}</p>
                    )}
                </div>

                {/* Wire Gauge Field - OPTIONAL */}
                <div>
                    <label htmlFor="wireGauge" className="block text-sm font-medium text-gray-700 mb-2">
                        Wire Gauge <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                        type="number"
                        id="wireGauge"
                        name="wireGauge"
                        value={formData.wireGauge}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.wireGauge ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter wire gauge"
                        disabled={loading}
                    />
                    {errors.wireGauge && (
                        <p className="mt-1 text-sm text-red-600">{errors.wireGauge}</p>
                    )}
                </div>

                {/* Weight Field - OPTIONAL */}
                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                        Weight <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.weight ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter weight (grams)"
                        disabled={loading}
                    />
                    {errors.weight && (
                        <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 px-6 py-3 rounded-md text-white font-medium transition-colors ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        }`} 
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Size...
                            </div>
                        ) : (
                            'Create Size'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Existing Die Numbers Info */}
            {existingDieNos.length > 0 && (
                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Die Identifiers:</h3>
                    <div className="flex flex-wrap gap-2">
                        {existingDieNos.slice(0, 20).map((dieNo, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                            >
                                {dieNo}
                            </span>
                        ))}
                        {existingDieNos.length > 20 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-600">
                                +{existingDieNos.length - 20} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Form Guidelines */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Guidelines:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Die No is required</strong> and must be unique (can contain letters and numbers)</li>
                    <li>• All other fields are optional - fill only what's available</li>
                    <li>• If provided, measurements should be in appropriate units (mm for diameter, grams for weight)</li>
                    <li>• All numeric values must be positive numbers</li>
                    <li>• You can create a size with just the Die No and add other details later</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSizeForm;

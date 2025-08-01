import { useState, useEffect, Fragment } from 'react';
import { getProducts, deleteProduct } from '../../lib/api';
import { Link } from 'react-router-dom';
import AdminNavbar from '../Navbar/AdminNavbar';
import { Dialog, Transition } from '@headlessui/react';
import EditProductForm from './EditProductForm'; // The new component for editing

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ isOpen, onClose, product, onConfirmDelete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await deleteProduct(product.id);
            onConfirmDelete(); // Notify parent to refresh list
            onClose(); // Close modal
        } catch (err) {
            console.error('Error deleting product:', err);
            setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                                >
                                    <span className="mr-2 text-red-500">⚠️</span> Confirm Deletion
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete product "<strong>{product?.name}</strong>" (ID: {product?.id})? This action cannot be undone.
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mt-4" role="alert">
                                        <strong className="font-bold">Error!</strong>
                                        <span className="block sm:inline"> {error}</span>
                                    </div>
                                )}

                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}


function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    // State for Modals
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);


    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getProducts();

            if (response.success) {
                setProducts(response.data);
                setError(null);
            } else {
                setError(response.error || 'Failed to fetch products');
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(product.id).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const formatImages = (images) => {
        if (!images) return 'No images';

        let imageArray = images;
        // If images is a string, try to parse it as JSON.
        if (typeof images === 'string') {
            try {
                imageArray = JSON.parse(images);
            } catch {
                // If parsing fails, it might be a single URL string.
                return '1 image(s)';
            }
        }
        
        // Return the count if it's an array.
        return Array.isArray(imageArray) ? `${imageArray.length} image(s)` : 'No images';
    };

    // --- Handlers for Edit Modal ---
    const handleEditClick = (product) => {
        setProductToEdit(product);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setProductToEdit(null);
    };

    const handleProductUpdated = () => {
        fetchProducts(); // Re-fetch products to show updated data
    };

    // Handlers for Delete Confirmation Modal
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleProductDeleted = () => {
        fetchProducts(); // Re-fetch products to show updated data
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminNavbar/>
            <div className="min-h-screen bg-gray-50 py-8 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                                        <span className="text-3xl mr-3">📦</span>
                                        Products Management
                                    </h1>
                                    <p className="text-gray-600 mt-2 text-lg">Manage your exquisite jewelry products with ease</p>
                                </div>
                                <div className="mt-5 sm:mt-0">
                                    <Link
                                        to="/admin/add-product"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        <span className="mr-2 text-xl">➕</span>
                                        Add New Product
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Search and Stats Section */}
                        <div className="px-6 py-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-5 sm:space-y-0">
                                <div className="relative w-full sm:w-96">
                                    <input
                                        type="text"
                                        placeholder="Search by name, category, or ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 pr-5 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 w-full text-lg transition-all duration-200"
                                    />
                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                <div className="flex items-center space-x-5 text-base text-gray-700">
                                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium shadow-sm">
                                        Total Products: <span className="font-bold">{products.length}</span>
                                    </span>
                                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium shadow-sm">
                                        Showing: <span className="font-bold">{currentProducts.length}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-300 rounded-xl p-5 mb-8 shadow-md">
                            <div className="flex items-center">
                                <svg className="h-7 w-7 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-800 text-lg font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {currentProducts.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-7xl mb-5">📦</div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
                                <p className="text-gray-600 mb-6 text-lg">
                                    {searchTerm ? 'Try adjusting your search terms or clear the search to see all products.' : 'Get started by adding your first product to the inventory.'}
                                </p>
                                {!searchTerm && (
                                    <Link
                                        to="/admin/add-product"
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md"
                                    >
                                        <span className="mr-2 text-xl">➕</span>
                                        Add Product
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Product Name
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Product ID
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Images
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentProducts.map((product) => (
                                                <tr key={product.id} className="hover:bg-blue-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                <img
                                                                    className="h-12 w-12 rounded-lg object-cover shadow-sm"
                                                                    src={product.imageUrl || 'https://placehold.co/48x48/e0e0e0/888888?text=No+Image'}
                                                                    alt={product.name}
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://placehold.co/48x48/e0e0e0/888888?text=Error';
                                                                        e.target.alt = "Image failed to load";
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-base font-medium text-gray-900">
                                                                    {product.name || 'Unnamed Product'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {product.id || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                                                            {product.category || 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {formatImages(product.images)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${product.isActive !== false
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {product.isActive !== false ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEditClick(product)}
                                                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                                            title="Edit Product"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(product)}
                                                            className="text-red-600 hover:text-red-900 ml-4 transition-colors duration-200"
                                                            title="Delete Product"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="bg-white px-4 py-5 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing{' '}
                                                    <span className="font-semibold">{indexOfFirstProduct + 1}</span>
                                                    {' '}to{' '}
                                                    <span className="font-semibold">
                                                        {Math.min(indexOfLastProduct, filteredProducts.length)}
                                                    </span>
                                                    {' '}of{' '}
                                                    <span className="font-semibold">{filteredProducts.length}</span>
                                                    {' '}results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    <button
                                                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                    >
                                                        <span className="sr-only">Previous</span>
                                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>

                                                    {Array.from({ length: totalPages }, (_, index) => {
                                                        const pageNumber = index + 1;
                                                        return (
                                                            <button
                                                                key={`page-${pageNumber}`}
                                                                onClick={() => setCurrentPage(pageNumber)}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${currentPage === pageNumber
                                                                    ? 'z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                                                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                {pageNumber}
                                                            </button>
                                                        );
                                                    })}

                                                    <button
                                                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                                        disabled={currentPage === totalPages}
                                                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                    >
                                                        <span className="sr-only">Next</span>
                                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Render Modals */}
            {productToDelete && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    product={productToDelete}
                    onConfirmDelete={handleProductDeleted}
                />
            )}
            {productToEdit && (
                <EditProductForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    product={productToEdit}
                    onSuccess={handleProductUpdated}
                />
            )}
        </>
    );
}

export default AdminProducts;

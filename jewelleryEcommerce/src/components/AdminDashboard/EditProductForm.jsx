import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { updateProduct, getSizes } from '../../lib/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icon component for the upload area
const UploadIcon = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function EditProductForm({ isOpen, onClose, product, onSuccess }) {
    const [formData, setFormData] = useState({ name: '', category: '' });
    const [currentSizes, setCurrentSizes] = useState([]); // State for the currently associated size OBJECTS.
    const [allSizes, setAllSizes] = useState([]);
    const [sizeToAdd, setSizeToAdd] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagesFiles, setImagesFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState('');
    const [imagesPreviews, setImagesPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Fetch all available sizes when the modal opens
    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await getSizes();
                if (response.success && response.data) {
                    setAllSizes(response.data);
                } else {
                    toast.error(response.error || "Could not load Size options.");
                }
            } catch (err) {
                console.error("Failed to fetch sizes:", err);
                toast.error("Could not load Size options.");
            }
        };
        if (isOpen) {
            fetchSizes();
        }
    }, [isOpen]);

    // Populate form data when the modal opens, ensuring it resets correctly every time.
    useEffect(() => {
        if (isOpen && product) {
            setFormData({
                name: product.name || '',
                category: product.category || '',
            });
            // ✅ FIX: Directly use the 'sizes' array from the product prop for display.
            // This is more reliable as it uses the data fetched from the main page.
            setCurrentSizes(Array.isArray(product.sizes) ? product.sizes : []);
            
            setImagePreview(product.imageUrl || '');
            setImagesPreviews(Array.isArray(product.images) ? product.images : []);
            setImageFile(null);
            setImagesFiles([]);
            setSizeToAdd('');
        }
    }, [product, isOpen]);

    if (!product) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'image' && files[0]) {
            setImageFile(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        } else if (name === 'images') {
            const newFiles = Array.from(files);
            setImagesFiles(newFiles);
            setImagesPreviews(newFiles.map(file => URL.createObjectURL(file)));
        }
    };

    const handleAddSize = () => {
        if (sizeToAdd) {
            const sizeObjectToAdd = allSizes.find(s => String(s.id) === sizeToAdd);
            const isAlreadyAdded = currentSizes.some(s => String(s.id) === sizeToAdd);
            if (sizeObjectToAdd && !isAlreadyAdded) {
                setCurrentSizes(prev => [...prev, sizeObjectToAdd]);
                setSizeToAdd('');
            }
        }
    };

    const handleRemoveSize = (sizeIdToRemove) => {
        setCurrentSizes(prev => prev.filter(s => String(s.id) !== String(sizeIdToRemove)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('category', formData.category);
            
            // ✅ FIX: Derive the dieIds from the `currentSizes` state at the moment of submission.
            const dieIdsToSubmit = currentSizes.map(s => s.id);
            productData.append('dieIds', JSON.stringify(dieIdsToSubmit));

            if (imageFile) {
                productData.append('image', imageFile);
            }
            if (imagesFiles.length > 0) {
                imagesFiles.forEach(file => {
                    productData.append('images', file);
                });
            }

            await updateProduct(product.id, productData);
            toast.success(`Product "${formData.name}" updated successfully!`);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating product:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update product.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // Derived state for the "Add" dropdown
    const currentSizeIds = currentSizes.map(s => String(s.id));
    const availableSizes = allSizes.filter(size => !currentSizeIds.includes(String(size.id)));

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all">
                                    <form onSubmit={handleSubmit}>
                                        <div className="p-8">
                                            <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Edit Product
                                            </Dialog.Title>
                                            <p className="mt-1 text-sm text-gray-500">Update the details for "{product.name}"</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-8">
                                            {/* Left Column: Image Uploads */}
                                            <div className="space-y-6">
                                                {/* Main Image */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                        <div className="space-y-1 text-center">
                                                            {imagePreview ? <img src={imagePreview} alt="Main preview" className="mx-auto h-24 w-24 rounded-md object-cover"/> : <UploadIcon />}
                                                            <div className="flex text-sm text-gray-600 justify-center">
                                                                <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                                    <span>Upload a file</span>
                                                                    <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleFileChange} />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Gallery Images */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                        <div className="space-y-1 text-center">
                                                            {imagesPreviews.length > 0 ? (
                                                                <div className="flex flex-wrap justify-center gap-2">
                                                                    {imagesPreviews.map((img, index) => <img key={index} src={img} alt={`Gallery preview ${index + 1}`} className="h-16 w-16 rounded-md object-cover"/>)}
                                                                </div>
                                                            ) : <UploadIcon />}
                                                            <div className="flex text-sm text-gray-600 justify-center">
                                                                <label htmlFor="images-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                                    <span>Upload files</span>
                                                                    <input id="images-upload" name="images" type="file" multiple className="sr-only" onChange={handleFileChange} />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500">Upload multiple images to replace the gallery.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Form Fields */}
                                            <div className="space-y-6">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                                </div>
                                                <div>
                                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                                    <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                                </div>
                                                {/* Modern Size Selector */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Associated Sizes (by Die No)</label>
                                                    {/* Display current sizes */}
                                                    <div className="mt-2 flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md min-h-[40px]">
                                                        {currentSizes.length > 0 ? currentSizes.map(size => (
                                                            <span key={size.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                {size.dieNo}
                                                                <button type="button" onClick={() => handleRemoveSize(size.id)} className="ml-1.5 flex-shrink-0 text-indigo-500 hover:text-indigo-700 focus:outline-none">
                                                                    <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8"><path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" /></svg>
                                                                </button>
                                                            </span>
                                                        )) : <p className="text-xs text-gray-500">No sizes selected.</p>}
                                                    </div>
                                                    {/* Add new size */}
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <select value={sizeToAdd} onChange={(e) => setSizeToAdd(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                                            <option value="" disabled>-- Add a size --</option>
                                                            {availableSizes.map(size => (
                                                                <option key={size.id} value={size.id}>{size.dieNo}</option>
                                                            ))}
                                                        </select>
                                                        <button type="button" onClick={handleAddSize} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none">
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-4 mt-8">
                                            <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={loading} className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default EditProductForm;

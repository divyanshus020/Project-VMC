import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageSlider from './ProductImages';
import ProductInfo from './ProductInfo';
import ProductSpecifications from './ProductSpecifications';
import SizeGuideModal from './SizeGuideModal';
import { getProductById } from '../../lib/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Trust indicators data
  const trustIndicators = [
    { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
    { icon: "↩️", title: "Easy Returns", desc: "30-day policy" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        const response = await getProductById(id);
        
        if (response && response.data) {
          setProduct(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-100">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Product</h3>
          <p className="text-gray-600 font-medium">Please wait while we fetch the details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-red-50">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Product Not Found</h3>
        <p className="text-gray-600 font-medium mb-6 max-w-md text-center">
          We couldn't find the product you're looking for. It might have been removed or the link is incorrect.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-lg hover:bg-amber-600 transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
            <button 
              onClick={() => handleBreadcrumbClick('/')}
              className="hover:text-amber-600 cursor-pointer transition-colors"
            >
              Home
            </button>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <button 
              onClick={() => handleBreadcrumbClick('/products')}
              className="hover:text-amber-600 cursor-pointer transition-colors"
            >
              Products
            </button>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-900 font-semibold">
              {product.name || 'Product Details'}
            </span>
          </div>
        </nav>

        {/* Main Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <ImageSlider images={product.images || []} />
              </div>
              {/* Floating Badge */}
              {product.isNew && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    New Arrival
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10">
              <ProductInfo product={product} />
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {trustIndicators.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Specifications Section */}
        <ProductSpecifications 
          product={product} 
          onOpenModal={openModal}
          onContactClick={handleContactClick}
        />
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal 
        modalImage={modalImage}
        onCloseModal={closeModal}
      />
    </div>
  );
};

export default ProductDetails;
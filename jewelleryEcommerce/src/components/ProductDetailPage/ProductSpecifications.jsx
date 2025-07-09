import React from 'react';

const ProductSpecifications = ({ product, onOpenModal, onContactClick }) => {
  // Product specifications helper
  const getProductSpecs = (product) => {
    return [
      {
        label: "Category",
        value: product.category ? 
          product.category.charAt(0).toUpperCase() + product.category.slice(1) : 
          "N/A"
      },
      {
        label: "Material",
        value: product.material || "Premium Metal"
      },
      {
        label: "Dimensions",
        value: product.dimensions || "N/A"
      },
      {
        label: "Care Instructions",
        value: "Clean with soft cloth, avoid water contact"
      }
    ];
  };

  return (
    <div className="mt-16">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Product Details & Specifications
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Information */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Product Information
            </h4>

            {/* Product Details */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm mb-2">About This Product</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description || "This premium jewelry piece is crafted with attention to detail and quality materials, perfect for adding elegance to any occasion."}
                  </p>
                </div>
                
                {product.features && (
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm mb-2">Key Features</h5>
                    <ul className="text-gray-600 text-sm space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-amber-500 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">Need more information?</h5>
                  <p className="text-gray-600 text-xs mt-1">Our experts are here to assist you</p>
                </div>
                <button 
                  onClick={onContactClick}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Specifications
            </h4>

            {/* Specifications List */}
            <div className="space-y-3">
              {getProductSpecs(product).map((spec, index) => (
                <div key={index} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium text-sm flex-shrink-0 w-1/3">
                    {spec.label}
                  </span>
                  <div className="text-gray-900 font-semibold text-sm text-right flex-1 ml-4">
                    <span>{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Information Card */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">Quality Information</h5>
                  <p className="text-gray-600 text-xs mt-1">
                    Crafted with premium materials and designed to last, this piece represents our commitment to quality and excellence.
                  </p>
                </div>
              </div>
            </div>

            {/* Certification Badge */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">Certified Authentic</h5>
                  <p className="text-gray-600 text-xs mt-1">Comes with certificate of authenticity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;
import React from 'react';
import malaGuideImg from '../../assets/catalogue/Individual sizes/MalaGuide.png';
import capGuideImg from '../../assets/catalogue/Individual sizes/SizeChart.png';

const ProductSpecifications = ({ product, onOpenModal, onContactClick }) => {
  // Static weight options for different categories
  const malaWeights = [
    "8 - 9 gm", "9 - 10 gm", "10 - 11 gm", "12 - 13 gm", "14 - 15 gm",
    "16 - 17 gm", "18 - 19 gm", "20 gm", "21 - 22 gm", "24 - 25 gm",
    "28 - 29 gm", "31 - 32 gm"
  ];
  
  const regularWeights = [
    "2-5 grams", "5-10 grams", "10-15 grams", "15-20 grams", "20+ grams"
  ];

  const getWeightDisplay = (category) => {
    if (!category) return regularWeights;
    return category.toLowerCase() === 'mala' ? malaWeights : regularWeights;
  };

  // Product specifications helper
  const getProductSpecs = (product) => {
    const baseSpecs = [
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
        label: "Available Weights",
        value: getWeightDisplay(product.category),
        isWeight: true
      },
      {
        label: "Care Instructions",
        value: "Clean with soft cloth, avoid water contact"
      }
    ];

    // Add dimensions only if not a mala
    if (product.category?.toLowerCase() !== "mala") {
      baseSpecs.splice(3, 0, {
        label: "Dimensions",
        value: product.dimensions || "N/A"
      });
    }

    return baseSpecs;
  };

  return (
    <div className="mt-16">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Product Details & Specifications
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Size Guide Images */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Size Guide
            </h4>

            {/* Size Guide Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mala Size Guide */}
              <div
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => onOpenModal(malaGuideImg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onOpenModal(malaGuideImg);
                  }
                }}
              >
                <div className="aspect-square p-4 flex items-center justify-center">
                  <img
                    src={malaGuideImg}
                    alt="Mala Size Guide"
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h5 className="text-white font-semibold text-sm">Mala Size Guide</h5>
                  <p className="text-white/80 text-xs">Find your perfect mala size</p>
                </div>
              </div>

              {/* Cap Size Guide */}
              <div
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => onOpenModal(capGuideImg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onOpenModal(capGuideImg);
                  }
                }}
              >
                <div className="aspect-square p-4 flex items-center justify-center">
                  <img
                    src={capGuideImg}
                    alt="Cap Size Guide"
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h5 className="text-white font-semibold text-sm">Cap Size Guide</h5>
                  <p className="text-white/80 text-xs">Choose the right cap size</p>
                </div>
              </div>
            </div>

            {/* Size Guide CTA */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">Need help with sizing?</h5>
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
                    {spec.isWeight ? (
                      <div className="space-y-1">
                        {spec.value.map((weight, idx) => (
                          <div
                            key={idx}
                            className="inline-block bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-medium mr-1 mb-1 border border-amber-200"
                          >
                            {weight}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>{spec.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Weight Information Card */}
            {product.category && (
              <div className={`${
                product.category.toLowerCase() === 'mala'
                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
                  : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
              } border rounded-xl p-4`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${
                      product.category.toLowerCase() === 'mala'
                        ? 'bg-purple-100'
                        : 'bg-blue-100'
                    } rounded-full flex items-center justify-center`}>
                      <svg className={`w-5 h-5 ${
                        product.category.toLowerCase() === 'mala'
                          ? 'text-purple-600'
                          : 'text-blue-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">
                      {product.category.toLowerCase() === 'mala' ? 'Mala Weight Options' : 'Weight Information'}
                    </h5>
                    <p className="text-gray-600 text-xs mt-1">
                      {product.category.toLowerCase() === 'mala'
                        ? 'Choose from different bead counts and weights for your spiritual practice'
                        : 'Available in various weight categories to suit your preference'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

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
import React from 'react';
import { ShoppingCartIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';

const EmptyCart = ({ onContinueShopping }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          {/* Empty Cart Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCartIcon className="w-12 h-12 text-amber-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-sm font-bold">0</span>
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your Cart is Empty
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Looks like you haven't added any beautiful jewelry pieces to your cart yet. 
            Discover our exquisite collection of handcrafted jewelry.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={onContinueShopping}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <SparklesIcon className="w-5 h-5 inline-block mr-2" />
              Explore Jewelry Collection
            </button>
            
            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-colors duration-200">
              <HeartIcon className="w-5 h-5 inline-block mr-2" />
              View Wishlist
            </button>
          </div>

          {/* Featured Categories */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">Popular Categories</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'].map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full cursor-pointer hover:bg-amber-100 transition-colors duration-200"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">Secure</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">Free Ship</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">Quality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;

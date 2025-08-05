import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ImageSlider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Preload images
  useEffect(() => {
    if (images && images.length > 0) {
      images.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
          if (index === 0) setIsLoading(false);
        };
        img.src = src;
      });
    }
  }, [images]);

  // Auto-slide functionality
  useEffect(() => {
    if (images && images.length > 1 && !isZoomed && !isFullscreen) {
      const interval = setInterval(() => {
        setSelectedImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images, isZoomed, isFullscreen]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsFullscreen(false);
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="space-y-6">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-500 font-medium">No image available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6" ref={containerRef}>
        {/* Main Image Display */}
        <div className="relative group">
          <div 
            className="aspect-square bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden relative cursor-zoom-in border border-gray-100 backdrop-blur-sm"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
            )}

            {/* Main Image */}
            <div className="relative w-full h-full overflow-hidden">
              <img 
                ref={imageRef}
                src={images[selectedImage]} 
                alt={`Product view ${selectedImage + 1}`}
                className={`w-full h-full object-cover transition-all duration-700 ease-out transform ${
                  isZoomed ? 'scale-150' : 'scale-100'
                } ${loadedImages.has(selectedImage) ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
                  filter: isZoomed ? 'brightness(1.1) contrast(1.05)' : 'none',
                }}
                onLoad={() => setIsLoading(false)}
              />
            </div>
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110 backdrop-blur-sm border border-gray-200"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110 backdrop-blur-sm border border-gray-200"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
              {/* Zoom Indicator */}
              {isZoomed && (
                <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-md animate-fade-in">
                  <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Zoomed In
                </div>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 backdrop-blur-sm border border-gray-200 ml-auto"
                    aria-label="Toggle fullscreen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 8V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2m-8 0H6a2 2 0 01-2-2v-2" />
                </svg>
              </button>
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  selectedImage === index
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dots Indicator for Mobile */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  selectedImage === index
                    ? 'bg-blue-500 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && createPortal(
        <div 
          className="fixed inset-0 z-[99999] bg-black flex items-center justify-center animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)'
          }}
          onClick={toggleFullscreen}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]}
              alt={`Product fullscreen ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain shadow-2xl"
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />

            {/* Close Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 border border-gray-200"
              aria-label="Close fullscreen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 border border-gray-200"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 border border-gray-200"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-6 right-6 bg-black/80 text-white px-4 py-2 rounded-full text-base font-semibold shadow-lg">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>,
        document.body
      )}

    </>
  );
};

export default ImageSlider
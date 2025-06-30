import React, { useEffect } from 'react';

const SizeGuideModal = ({ modalImage, onCloseModal }) => {
  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalImage) {
        onCloseModal();
      }
    };

    if (modalImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalImage, onCloseModal]);

  if (!modalImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onCloseModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative max-w-4xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={modalImage}
            alt="Size Guide"
            className="max-h-[85vh] w-auto rounded-2xl shadow-2xl border-4 border-white"
            id="modal-title"
          />
          <button
            onClick={onCloseModal}
            className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg border border-gray-200 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-white text-sm mt-4 text-center opacity-75">
          Press ESC or click outside to close
        </p>
      </div>
    </div>
  );
};

export default SizeGuideModal;
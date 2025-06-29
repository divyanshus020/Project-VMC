import React from 'react';

const ImageSlider = ({ images }) => {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white rounded-xl shadow overflow-hidden">
        <img src={images[0]} alt="Product" className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <img key={i} src={img} alt="Thumb" className="w-20 h-20 object-cover rounded border" />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;

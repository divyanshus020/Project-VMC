import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageSlider from './ProductImages';
import ProductInfo from './ProductInfo';
import { getProductById } from '../../lib/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-lg font-semibold">Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-lg font-semibold text-red-500">Product not found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <ImageSlider images={product.images || []} />
      <ProductInfo product={product} />
    </div>
  );
};

export default ProductDetail;



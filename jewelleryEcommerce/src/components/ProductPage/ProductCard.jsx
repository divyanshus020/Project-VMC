import React from 'react';
import { Card, Button } from 'antd';

const ProductCard = ({ product }) => {
    return (
        <Card
            hoverable
            cover={
                <img
                    alt={product.title}
                    src={product.image}
                    className="h-52 w-full object-cover"
                />
            }
            style={{
                borderRadius: 10,
                borderColor: '#D4AF37',
                minHeight: 360,
            }}
            bodyStyle={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
            }}
        >
            <h3 style={{ color: '#333333', fontWeight: 600, fontSize: '18px' }}>
                {product.title}
            </h3>
            <p style={{ color: '#666666', fontSize: '14px' }}>{product.description}</p>
            <div className="flex justify-around items-center gap-4 mt-4">
                <span style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '16px' }}>
                    Approx: {product.price}
                </span>
                <Button
                    type="primary"
                    style={{
                        backgroundColor: '#1E90FF',
                        borderColor: '#1E90FF',
                    }}
                >
                    Enquiry Now
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;

import React from 'react';

import ProductCard from './ProductCard';

import '../scss/ProductGrid.scss';

const ProductGrid = (props) => {
  const {
    products, edit=false, allowApplyCertificate=false,
    addToCertificateApplication=()=>{}, removeFromCertificateApplication=()=>{}
  } = props;

  return (
    <div className="product-grid">
      {products.map((product) => {
        if (product) {
          return (
            <ProductCard
              key={product._id} product={product} edit={edit}
              allowApplyCertificate={allowApplyCertificate}
              addToCertificateApplication={addToCertificateApplication}
              removeFromCertificateApplication={removeFromCertificateApplication}
            />
          );
        }
      })}
    </div>
  );
};

export default ProductGrid;

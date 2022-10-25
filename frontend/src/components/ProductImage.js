import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductImage = (props) => {
  const { fileId, to } = props;
  const [exists, setExists] = useState(true);

  function renderImage() {
    if (exists) {
      return (
        <img
          className="product-image"
          src={process.env.REACT_APP_API_URL + 'fetch/' + fileId}
          onError={() => {
            setExists(false);
          }} />
      );
    }

    return (
      <div
        className="product-image"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(233, 231, 231, 0.895)'
        }}>
        Image not available
      </div>
    );
  }

  if (to) {
    return (
      <Link to={to}>
        {renderImage()}
      </Link>
    );
  }

  return renderImage();
};

export default ProductImage;

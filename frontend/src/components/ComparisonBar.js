import React from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import '../scss/ComparisonBar.scss';

const ComparisonBar = function(props) {

  const { productCompList, removeProductFromComp } = props;

  return (
    <div className='comparison-bar'>
      {productCompList.map((product) => {
        return (
          <div className='product-card-container' key={product._id}>
            <ProductCard product={product} />
            <div className="delete-btn" onClick={() => removeProductFromComp(product)}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </div>
          </div>
        );
      })}
      <Button>
        <Link to="comparison">Compare</Link>
      </Button>
    </div>
  );
};

export default ComparisonBar;

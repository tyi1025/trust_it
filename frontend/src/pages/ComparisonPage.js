import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import UserHeader from '../connectedComponents/UserHeader';
import ProductImage from '../components/ProductImage';

import '../scss/ComparisonPage.scss';

const ComparisonPage = (props) => {

  const { productCompList } = props;

  function renderIngredients(ingredients) {
    if (!ingredients || ingredients.length === 0) {
      return '-';
    }
    return ingredients.map(item=>item.name).join(', ');
  }

  function renderScore(score) {
    return score;
  }

  function renderCertification(status) {
    return status;
  }

  function renderProduct(product) {
    return (
      <div className="product-column">
        <div className="product-field image">
          <ProductImage
            fileId={product.images && product.images[0]}
            to={'/product/' + product._id} />
        </div>
        <div className="product-field name">
          <Link to={'/product/' + product._id}>
            {product.name}
          </Link>
        </div>
        <div className="product-field">
          {product.category ? product.category.name : '-'}
        </div>
        <div className="product-field manufacturer">
          {product.manufacturer ? product.manufacturer.name : '-'}
        </div>
        <div className="product-field ingredients">
          {renderIngredients(product.ingredients)}
        </div>
        <div className="product-field">
          {renderScore(product.cancerScore)}
        </div>
        <div className="product-field">
          {renderScore(product.allergyScore)}
        </div>
        <div className="product-field">
          {renderScore(product.environmentScore)}
        </div>
        <div className="product-field">
          {renderScore(product.overallScore)}
        </div>
        <div className="product-field">
          {renderCertification(product.certificationStatus)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserHeader />
      <div className="comparison-page">
        <div className="product-column">
          <div className="product-field image" />
          <div className="product-field name">
            Product Name
          </div>
          <div className="product-field">
            Category
          </div>
          <div className="product-field manufacturer">
            Manufacturer
          </div>
          <div className="product-field ingredients">
            Ingredients
          </div>
          <div className="product-field">
            Cancer Score
          </div>
          <div className="product-field">
            Allergy Score
          </div>
          <div className="product-field">
            Environment Score
          </div>
          <div className="product-field">
            Overall Score
          </div>
          <div className="product-field">
            Certifitied
          </div>
        </div>
        {productCompList.map(renderProduct)}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    productCompList: state.product.productCompList
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComparisonPage);

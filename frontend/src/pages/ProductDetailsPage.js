import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { getProductById, addProductToComp } from '../actions/product';

import UserHeader from '../connectedComponents/UserHeader';
import ProductImage from '../components/ProductImage';
import Loading from '../components/Loading';

import '../scss/ProductAndIngredientDetails.scss';


import score_0 from '../images/score_0.png';
import score_1 from '../images/score_1.png';
import score_2 from '../images/score_2.png';
import score_3 from '../images/score_3.png';
import score_4 from '../images/score_4.png';
import score_5 from '../images/score_5.png';
import score_6 from '../images/score_6.png';
import score_7 from '../images/score_7.png';
import score_8 from '../images/score_8.png';
import score_9 from '../images/score_9.png';
import score_10 from '../images/score_10.png';


const ProductDetailsPage = function(props) {
  const scoreMap = {
    0: score_0,
    1: score_1,
    2: score_2,
    3: score_3,
    4: score_4,
    5: score_5,
    6: score_6,
    7: score_7,
    8: score_8,
    9: score_9,
    10: score_10
  };

  const { productId: id } = useParams();
  const {
    product, getProductById, productDetailsLoading, addProductToComp
  } = props;

  const [descriptionClass, setDescriptionClass] = useState('hidden');
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    getProductById({productId: id});
  }, []);

  function renderScore(score) {
    return (
      <div>
        <img src={scoreMap[score]} />
      </div>
    );
  }

  const displayIngredients = (list) => {
    if (list.length >= 1){
      return (
        <div className="ingredient-list">
          <div className="name-list">
            <div className="heading">
              Ingredient List
            </div>
            <div>
              {
                product.ingredients?.map((item) => {
                  return (
                    <div
                      key={'ingredient_name_' + item._id}
                      className="name">
                      <Link to={'/ingredient/' + item._id} >
                        {item.name}
                      </Link>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className="description-list">
            <div className="heading">
              Descriptions
            </div>
            {
              product.ingredients?.map((item) => {
                return (
                  <div
                    key={'ingredient_desc_' + item._id}
                    className="description">
                    <Link to={'/ingredient/' + item._id} >
                      {item.description}
                    </Link>
                  </div>
                );
              })
            }
          </div>
        </div>
      );}
  };

  const displayScores = (list) => {
    if (!(list.length >= 1)){
      return (
        <div className='product-details-container-noproduct'>
          <Button
            className="compare-button"
            onClick={() => {
              addProductToComp(product);
            }}>
            Add to compare
          </Button>
          <div className="score-container">
            <div className='text'>Overall Score:</div>
            <div className='text-noproduct'>No ingredients are available for this product...</div>
          </div>
        </div>
      );
    } else {
      console.log(list.length);
      return (
        <div className="product-details-container-right">
          <Button
            className="compare-button"
            onClick={() => {
              addProductToComp(product);
            }}>
            Add to compare
          </Button>
          <div className="score-container">
            <div className="text">Overall Score:</div>
            {renderScore(product.overallScore)}
          </div>
          <div className="score-container">
            <div className="text">Environment Score:</div>
            {renderScore(product.environmentScore)}
          </div>
          <div className="score-container">
            <div className="text">Allergy Score:</div>
            {renderScore(product.allergyScore)}
          </div>
          <div className="score-container">
            <div className="text">Cancer Score:</div>
            {renderScore(product.cancerScore)}
          </div>
        </div>
      );
    }
  };

  /// !product.length !== 0 is required because default state of product is []
  if (product && product.length !== 0) {
    return (
      <React.Fragment>
        <UserHeader />
        <div className='product-details-container'>
          <div className='product-details-container-left'>
            <div className="product-info">
              <div className='product-image-container'>
                <div className="main-image">
                  <ProductImage
                    fileId={product.images && product.images[mainImageIndex]} />
                </div>
                <div className="other-images">
                  {product.images?.map((item, index) => {
                    return (
                      <div
                        key={'product_image_' + index}
                        onClick={() => setMainImageIndex(index)}>
                        <ProductImage fileId={item} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="product-info-text">
                <div className="text-item name">
                  <div className="inner-flex">
                    <div className="title">Name</div>
                    {product.name}
                  </div>
                  {product.certificationStatus === 'certified' &&
                   <div className='certified-box'>
                     Certified by Trust-It!
                   </div>
                  }
                </div>
                <div className="text-item">
                  <div className="title">Category</div>
                  {product.category?.name}
                </div>
                <div className="text-item">
                  <div className="title">Manufacturer</div>
                  {product.manufacturer?.name}
                </div>
                {product.affiliateLink && (product.manufacturer.paid ||
                 product.manufacturer.trialStatus === 'active') &&
                 <div className="text-item">
                   <div className="title">Affiliate Link</div>
                   <a href={product.affiliateLink}>
                     {product.affiliateLink}
                   </a>
                 </div>
                }
                <div className="text-item description">
                  <div className="title">Description</div>
                  <div className={['content', descriptionClass].join(' ')}>
                    {product.description}
                  </div>
                  <div
                    className='read-more-button'
                    onClick={() => {
                      if (descriptionClass === 'hidden') {
                        setDescriptionClass('show');
                      } else if (descriptionClass === 'show') {
                        setDescriptionClass('hidden');
                      }
                    }}>
                    {descriptionClass === 'hidden' ? 'Show More' : 'Show Less'}
                  </div>
                </div>
              </div>
            </div>
            {displayIngredients(product.ingredients)}
          </div>
          {displayScores(product.ingredients)}
        </div>
        {productDetailsLoading && <Loading />}
      </React.Fragment>
    );
  } else if (productDetailsLoading) {
    return <Loading />;
  }
};

const mapStateToProps = function(state) {
  return {
    productDetailsLoading: state.product.productDetailsLoading,
    product: state.product.productDetails
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductById: (id) => {
      dispatch(getProductById(id));
    },
    addProductToComp: (product) => {
      dispatch(addProductToComp(product));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailsPage);

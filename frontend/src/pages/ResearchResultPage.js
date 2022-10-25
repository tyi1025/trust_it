import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';

import { getProductList } from '../actions/product';

import UserHeader from '../connectedComponents/UserHeader';
import ProductGrid from '../components/ProductGrid';
import PageIndex from '../components/PageIndex';
import ProductFilter from '../components/ProductFilter';
import Loading from '../components/Loading';

import '../scss/ResearchResultPage.scss';


const ResearchResultPage = (props) => {
  const location = useLocation();

  const queryParams = queryString.parse(location.search);

  const {
    getProductList, products, productListLoading
  } = props;


  const [resultFound, setResultFound] = useState(false);

  useEffect(() => {
    getProductList(queryParams);
  }, [location.search]);

  useEffect(() => {
    if(products.length > 0) {
      setResultFound(true);
    } else {
      setResultFound(false);
    }
  }, [products]);

  if(resultFound == false &&
     (Number(queryParams.page) == 1 || typeof queryParams.page === 'undefined')) {
    return (
      <div>
        <UserHeader />
        <div className="research-result-page">
          Sorry, no matches have been found...
          <FontAwesomeIcon icon={faFrown} />
        </div>
        {productListLoading && <Loading />}
      </div>
    );
  } else {
    return (
      <React.Fragment>
        <UserHeader />
        <div className="research-result-page">
          <ProductFilter />
          <ProductGrid products={products} />
          <PageIndex
            length={products.length}
            perPage={20}
            path="/search"
            resultFound={resultFound} />
        </div>
        {productListLoading && <Loading />}
      </React.Fragment>
    );
  }

};

const mapStateToProps = (state) => {
  return {
    products: state.product.productListDetails,
    productListLoading: state.product.productListLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductList: (obj) => {
      dispatch(getProductList(obj));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResearchResultPage);

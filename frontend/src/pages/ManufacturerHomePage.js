import React, { useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Loading from '../components/Loading';
import RedirectingLoading from '../components/RedirectingLoading';

import { loginSuccess } from '../actions/auth';
import { getProductsManufacturer, applyCertificate } from '../actions/product';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';
import ProductGrid from '../components/ProductGrid';
import PageIndex from '../components/PageIndex';
import ProductFilter from '../components/ProductFilter';

import '../scss/ManufacturerHomePage.scss';

const ManufacturerHomePage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = queryString.parse(location.search);

  const {
    getProductsManufacturer, products, jwtToken, manufacturer,
    applyCertificate, productListLoading, applyCertificateLoading
  } = props;

  const [resultFound, setResultFound] = useState(false);
  const [certificateIds, setCertificateIds] = useState([]);

  useEffect(() => {
    manufacturer && getProductsManufacturer(
      {...queryParams, manufacturer: manufacturer._id});
  }, [manufacturer, location.search]);


  if (!jwtToken) {
    setTimeout(() => {
      navigate('/portal/login');
    }, 5000);
    return (
      <div>
        <RedirectingLoading/>
      </div>
    );
  }

  useEffect(() => {
    if(products.length > 0) {
      setResultFound(true);
    } else {
      setResultFound(false);
    }
  }, [products]);

  if(resultFound == false &&
     !queryParams.page || (Number(queryParams.page) === 1)) {
    return (
      <React.Fragment>
        <ManufacturerHeader />
        <div className="manufacturer-home-page no-product">
          <div>No product has been uploaded yet</div>
          <Button onClick={() => navigate('/portal/new_product')}>
            <FontAwesomeIcon className="certified" icon={faPlus} />
            Add Product!
          </Button>
        </div>
        {productListLoading && <Loading />}
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <ManufacturerHeader />
        <div className="manufacturer-home-page">
          <div className="filter-row">
            <ProductFilter fullStatus={true} />
            <div className="button-container">
              <Button onClick={() => navigate('/portal/new_product')}>
                <FontAwesomeIcon className="certified" icon={faPlus} />
                Add Product!
              </Button>
            </div>
          </div>

          {certificateIds.length > 0 &&
           !(applyCertificateLoading || manufacturer.certificateQuota <= 0) &&
           <Button
             className="submit-application-button"
             onClick={() => applyCertificate(certificateIds)}>
             Submit Application!
           </Button>}

          <ProductGrid
            products={products}
            edit={true}
            allowApplyCertificate={true}
            addToCertificateApplication={(id) => {
              setCertificateIds([
                ...certificateIds,
                id
              ]);
            }}
            removeFromCertificateApplication={(id) => {
              setCertificateIds(certificateIds.filter((item) => {
                return id !== item;
              }));
            }} />
          <PageIndex
            length={products.length}
            perPage={20}
            path="/portal"
            resultFound={resultFound} />
        </div>
        {productListLoading && <Loading />}
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    jwtToken: state.auth.jwtToken,
    manufacturer: state.auth.loggedInManufacturer,

    products: state.product.productListDetails,
    productListLoading: state.product.productListLoading,

    applyCertificateLoading: state.product.applyCertificateLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: () => {
      dispatch(loginSuccess());
    },
    getProductsManufacturer: (manufacturer) => {
      dispatch(getProductsManufacturer(manufacturer));
    },
    applyCertificate: (productIds) => {
      dispatch(applyCertificate(productIds));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManufacturerHomePage);

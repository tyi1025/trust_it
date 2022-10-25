import React from 'react';
import { connect } from 'react-redux';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';
import PackagesPurchaseCard from '../components/PackagesPurchaseCard';

import RedirectingLoading from '../components/RedirectingLoading';

import { useNavigate } from 'react-router-dom';
import '../scss/PackagesPurchaseCard.scss';

const PurchasePackagePage = (props) => {

  const { jwtToken } = props;
  const navigate = useNavigate();

  if (!jwtToken) {
    setTimeout(() => {
      navigate('/portal/login');
    }, 5000);
    return (
      <div>
        <RedirectingLoading />
      </div>
    );
  }

  return (
    <div>
      <ManufacturerHeader />
      <div className='purchase-package'>
        <h1>Purchase Package Page</h1>
        <div className='flex-box'>
          <PackagesPurchaseCard title='Small Pack' number={50} cost={150} />
          <PackagesPurchaseCard title='Medium Pack' number={100} cost={250} />
          <PackagesPurchaseCard title='Big Pack' number={150} cost={300} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    jwtToken: state.auth.jwtToken
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchasePackagePage);

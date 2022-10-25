import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';
import RedirectingLoading from '../components/RedirectingLoading';

import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../actions/auth';

import '../scss/PurchasePage.scss';

const PurchasePage = (props) => {
  const {
    manufacturer, jwtToken
  } = props;

  useEffect(() => {
    loginSuccess();
  }, [manufacturer]);
  
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


  const goToTrialPage = () => {
    navigate('/portal/trial');
  };

  const goToPackagePage = () => {
    navigate('/portal/packages');
  };

  const getRemainingDays = (startDate) => {
    const date = (new Date()).getTime();
    const start_date = (new Date(startDate)).getTime();
    let remainingDays = Math.ceil((date - start_date) / (1000 * 3600 * 24));
    if(remainingDays < 30) {
      return 30 - remainingDays;
    }
    else 
      return 0;
  };

  const insertTrial = () => {
    if (manufacturer.trialStatus === 'inactive') {
      return (
        <div className='purchase-page'>
          <div className='flex-box'>
            <div className='box'>
              <h3 id = 'base'>Trial</h3>
              <p className='description'>Start your trial period with us and get familiar with our services</p>
              <button onClick={goToTrialPage}>Get Started!</button>
            </div>
          </div>
        </div>
      );} else if (manufacturer.trialStatus === 'active') {
      return (
        <div className='purchase-page'>
          <div className='box'>
            <h3 id = 'base'>Free Trial ends soon!</h3>
            <p className = 'description'>{getRemainingDays(manufacturer.trialStartDate)} days remaining until your trial period ends...</p>
          </div>
        </div> 
        
      );} else {
      return (
        goToPackagePage()
      );
    }
  };

  return (
    <div>
      <ManufacturerHeader />
      <div className='purchase-page'>
        <div className='flex-box'>
          {insertTrial()}
          <div className='box'>
            <h3 id = 'base'>Certificates Packages</h3>
            <p className='description'>You can avail these packages at discounted prices and get a chance to certify your products</p>
            <button onClick={goToPackagePage}>Buy Package!</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loginLoading,
    manufacturer: state.auth.loggedInManufacturer,
    error: state.auth.loginError,
    jwtToken: state.auth.jwtToken
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchasePage);

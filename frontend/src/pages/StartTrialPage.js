import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import RedirectingLoading from '../components/RedirectingLoading';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';
import Loading from '../components/Loading';

import { startTrial } from '../actions/checkout';

import { useNavigate } from 'react-router-dom';
import '../scss/StartTrialPage.scss';

const StartTrialPage = (props) => {

  const {
    jwtToken, manufacturer, startTrialLoading,
    startTrial, startTrialSuccess
  } = props;
  const navigate = useNavigate();

  const [startTrialClicked, setStartTrialClicked] = useState(false);

  useEffect(() => {
    if (startTrialClicked && startTrialSuccess) {
      navigate('/portal/my_plan');
    }
  }, [startTrialClicked, startTrialSuccess]);

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

  return (
    <div>
      <ManufacturerHeader />
      <div className='start-trial'>
        <div className='flex-box'>
          <div className='box'>
            <h3 id = 'new-shape'>Free Trial Period</h3>
            <div className='desc'>
              <ul className='desc-ul'>
                <p className='desc-ul-begin'>What will be offered:</p>
                <li>10 free Certificates</li>
                <li>Affiliate link to each uploaded product</li>
              </ul>
            </div>
            <p>Description and conditions for using the trial period</p>
            <button
              onClick={() => {
                startTrial();
                setStartTrialClicked(true);
              }}
              disabled={manufacturer.trialStatus !== 'inactive'}>
            Start Trial!
            </button>
          </div>
        </div>
      </div>
      {startTrialLoading && <Loading />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    jwtToken: state.auth.jwtToken,
    manufacturer: state.auth.loggedInManufacturer,
    startTrialLoading: state.checkout.startTrialLoading,
    startTrialSuccess: state.checkout.startTrialSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTrial: () => {
      dispatch(startTrial());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartTrialPage);

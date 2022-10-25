import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import RedirectingLoading from '../components/RedirectingLoading';

import { getManufacturerSelf } from '../actions/manufacturer';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';
import Loading from '../components/Loading';

import '../scss/MyPlan.scss';

const MyPlansPage = (props) => {

  const { jwtToken, manufacturer, getSelf, getManufacturerLoading } = props;
  const navigate = useNavigate();

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
    getSelf();
  }, []);

  function renderTrialStatus(status) {
    if (status === 'inactive') {
      return 'Inactive';
    }
    if (status === 'active') {
      return 'Active';
    }
    if (status === 'used') {
      return 'Expired';
    }
    return 'Unknown';
  }

  function renderRemaining(startDate) {
    const days = 30 - moment().diff(moment(startDate), 'days');
    return days;
  }

  return (
    <div>
      <ManufacturerHeader />
      <div className="my-plan-page">
        <div className="text-item">
          <div className="title">Name</div>
          {manufacturer.name}
        </div>
        <div className="text-item">
          <div className="title">Remaining of Quotas</div>
          {manufacturer.certificateQuota}
        </div>
        <div className="text-item">
          <div className="title">Trial Status</div>
          {renderTrialStatus(manufacturer.trialStatus)}
        </div>
        {manufacturer.trialStatus === 'active' && <div className="text-item">
          <div className="title">Trial Remaining</div>
          {renderRemaining(manufacturer.trialStartDate)} days
        </div>}
      </div>
      {getManufacturerLoading && <Loading />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    jwtToken: state.auth.jwtToken,
    getManufacturerLoading: state.auth.getManufacturerLoading,
    getManufacturerError: state.auth.getManufacturerError,
    manufacturer: state.auth.loggedInManufacturer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSelf: () => {
      dispatch(getManufacturerSelf());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyPlansPage);

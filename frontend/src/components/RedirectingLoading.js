import React from 'react';
import Spinner from 'react-bootstrap/Spinner';


import '../scss/Loading.scss';

const RedirectingLoading = () => {

  return (
    <div className='loading'>
      <div className="container">
        <Spinner animation="border" role="status" />
        <div className='text'>Sorry, you are not logged in. Redirecting you to Login page. Please wait...</div>
      </div>
    </div>
  );
};

export default RedirectingLoading;

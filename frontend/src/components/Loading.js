import React from 'react';
import Spinner from 'react-bootstrap/Spinner';


import '../scss/Loading.scss';

const Loading = () => {

  return (
    <div className='loading'>
      <div className="container">
        <Spinner animation="border" role="status" />
        <div className='text'>Thank you for trusting us! Please wait...</div>
      </div>
    </div>
  );
};

export default Loading;

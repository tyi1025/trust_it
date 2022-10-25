import React from 'react';
import { connect } from 'react-redux';

import UserHeader from '../connectedComponents/UserHeader';

import '../scss/HelpPage.scss';


const UserHelpPage = () => {

  return (
    <div> 
      <UserHeader />
      <div className='help'>
        <h3 className='content selected'>Welcome to the Help page!</h3><div className='content'>Here we will guide you to our services...</div>
        <div className='content'>
          <h3 className='title'>Search products</h3>
          <div className='text'>Look for products in our website to get safety score of the product based on metrics</div>
        </div>
        <div className='content'>
          <h3 className='title'>View product ingredients</h3>
          <div className='text'>Check list of ingredients of the products along with detailed descriptions</div>
        </div>
        <div className='content'>
          <h3 className='title'>Safety scores of product</h3>
          <div className='text'>Know whats the impact of product on environment or on your skin</div>
        </div>
        <div className='content'>
          <h3 className='title'>Get safety score from ingredient List</h3>
          <div className='text'>Enter ingredients in a particular product and get to know score using our calculator</div>
        </div>
        <div className='content selected'>Any questions or requests?  <div className='link'><a className='link'  href="mailto:trust-it@tum.de"> Drop us an email!</a></div>
        </div>
      </div>
    </div>          
  );
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserHelpPage);

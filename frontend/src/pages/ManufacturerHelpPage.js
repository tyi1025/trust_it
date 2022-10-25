import React from 'react';
import { connect } from 'react-redux';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';

import '../scss/HelpPage.scss';


const ManufacturerHelpPage = () => {

  return (
    <div> 
      <ManufacturerHeader />
      <div className='help'>
        <h3 className='content selected'>Welcome to the Help page!</h3><div className='content'>Here we will guide you to our services...</div>
        <div className='content'>
          <h3 className='title'>Free Trial Period</h3>
          <div className='text'>As a product manufacturer you can register to our website and can get 10 free certificates for your added products by Trust-it!</div>
        </div>
        <div className='content'>
          <h3 className='title'>Purchase Certificates</h3>
          <div className='text'>We offer three certification packages which are small, medium and big packs. You can avail any of the certificate package and can get your products certified by Trust-it!</div>
        </div>
        <div className='content'>
          <h3 className='title'>Upload and Certify Products</h3>
          <div className='text'>You can upload your product on our website and decide if you want to certify this product by Trust-it!</div>
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
)(ManufacturerHelpPage);

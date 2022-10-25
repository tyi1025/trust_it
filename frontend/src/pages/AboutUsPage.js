import React from 'react';
import { connect } from 'react-redux';

import logo from '../images/logo.png';

import UserHeader from '../connectedComponents/UserHeader';

import '../scss/AboutUs.scss';

const AboutUsPage = () => {
  return (
    <div>
      <UserHeader />
      <div className='about-us'>
        <br></br>
        <div><img src={logo} alt='...' /></div>
        <h3 className='desc'>Product database and ingredient scanner for cosmetics and personal care</h3>
        <div className='content'>We intend to help health and environmentally conscious users like you by determining the safety of products you use, or intend to use, with the help of safety scores calculated on the basis of product ingredients.</div>
        <h4 className='desc'>Trust us with the safety of product that you use!</h4>
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
)(AboutUsPage);

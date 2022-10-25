import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Navbar, Nav } from 'react-bootstrap';

import { logout } from '../actions/auth';
import logo from '../images/logo.png';

import '../scss/header.scss';

const ManufacturerHeader = (props) => {

  const { logout } = props;

  return (
    <Navbar className="header">
      <Navbar.Brand className="logo-container">
        <Link to="/">
          <img
            src={logo}
            className="trust-it-logo"
            alt="logo" />
        </Link>
      </Navbar.Brand>
      <Nav className="menu-container">
        <Nav.Item>
          <Link to={'/portal/my_plan'}>
            My Plan
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={'/portal'}>
            My Products
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to={'/portal/purchase'}>
          Buy Certificates
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/portal/help">
            Help
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/" onClick={logout}>
            Logout
          </Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};


const mapStateToProps = function(state) {
  return {
    jwtToken: state.auth.jwtToken
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManufacturerHeader);

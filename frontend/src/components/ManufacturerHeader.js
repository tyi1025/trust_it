import React from 'react';
import { Link } from 'react-router-dom';

import { Navbar, Nav } from 'react-bootstrap';

import logo from '../images/logo.png';

import '../scss/header.scss';

const ManufacturerHeader = () => {
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
            My plan
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
      </Nav>
    </Navbar>
  );
};

export default ManufacturerHeader;

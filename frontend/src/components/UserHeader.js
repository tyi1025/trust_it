import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Navbar, Nav, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';


import logo from '../images/logo.png';

import '../scss/header.scss';

const UserHeader = () => {

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate('/search?keyword=' + inputRef.current.value + '&page=1');
    }
  };

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
      <Form
        className="search-container"
        onSubmit={e=>e.preventDefault()}>
        <Form.Control
          type="text"
          ref={inputRef}
          placeholder='Search for a product...'
          onKeyDown={handleKeyDown} />
        <div className="barcode">
          <Link to="/barcode">
            <FontAwesomeIcon icon={faBarcode} />
          </Link>
        </div>
      </Form>
      <Nav className="menu-container">
        <Nav.Item>
          <Link to="/calculator">
            Calculator
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/about">
            About Us
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/help">
            Help
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/portal">
            Log In
          </Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default UserHeader;

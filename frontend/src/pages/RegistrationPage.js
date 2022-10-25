import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { register } from '../actions/auth';

import Loading from '../components/Loading';
import '../scss/Login.scss';
import { showMessage } from '../actions/checkout';
import UserHeader from '../connectedComponents/UserHeader.js';

const RegistrationPage = (props) => {
  const {
    loading, register, showMessage, manufacturer
  } = props;

  const nameRef = useRef('');
  const usernameRef = useRef('');
  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');

  const navigate = useNavigate();

  const [registrationClicked, setRegistrationClicked] = useState(false);

  useEffect(() => {
    if (registrationClicked && Object.keys(manufacturer).length > 0) {
      navigate('/portal/login/');
    }
  }, [registrationClicked, manufacturer]);

  return (
    <div>
      <UserHeader/>
      <div className="registration-container">
        <div className="page-title">
          Sign Up
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const password = passwordRef.current.value;
            const confirmPassword = confirmPasswordRef.current.value;
            if (password !== confirmPassword) {
              showMessage('Passwords do not match');
              return;
            }
            register({
              name: nameRef.current.value,
              username: usernameRef.current.value,
              password: passwordRef.current.value,
            });
            setRegistrationClicked(true);
          }}>
          <Form.Group className="form-row">
            <Form.Control type="text" placeholder="Name" ref={nameRef} />
          </Form.Group>
          <Form.Group className="form-row">
            <Form.Control type="text" placeholder="Username" ref={usernameRef} />
          </Form.Group>
          <Form.Group className="form-row">
            <Form.Control type="password" placeholder="Password" ref={passwordRef} />
          </Form.Group>
          <Form.Group className="form-row">
            <Form.Control
              type="password" placeholder="Confirm Password"
              ref={confirmPasswordRef} />
          </Form.Group>
          <Form.Group className="form-row">
            <Button
              type="submit">Sign Up</Button>
          </Form.Group>
        </Form>
        <div className="form-row message">
          Login &nbsp;<Link to="/portal/login">here</Link>&nbsp;
          if you already have an account
        </div>
        {loading && <Loading />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.registerLoading,
    manufacturer: state.auth.registeredManufacturer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (obj) => {
      dispatch(register(obj));
    },
    showMessage: (message) => {
      dispatch(showMessage(message));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationPage);

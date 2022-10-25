import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import UserHeader from '../connectedComponents/UserHeader.js';

import { login } from '../actions/auth';

import Loading from '../components/Loading';
import '../scss/Login.scss';

const LoginPage = (props) => {
  const {
    loading, manufacturer,
    login
  } = props;

  const navigate = useNavigate();
  const usernameRef = useRef('');
  const passwordRef = useRef('');

  useEffect(() => {
    if (Object.keys(manufacturer).length !== 0) {
      navigate('/portal');
    }
  }, [manufacturer]);

  return (
    <div>
      <UserHeader/>
      <div className="logout-container">
        <div className="page-title">
          Login
        </div>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            login({
              username: usernameRef.current.value,
              password: passwordRef.current.value,
            });
          }}>
          <Form.Group className="form-row">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" ref={usernameRef} />
          </Form.Group>
          <Form.Group className="form-row">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" ref={passwordRef} />
          </Form.Group>
          <Form.Group className="form-row">
            <Button
              type="submit">Login</Button>
          </Form.Group>
        </Form>
        <div className="form-row message">
          Sign up &nbsp;<Link to="/portal/registration">here</Link>&nbsp;
          if you don&apos;t have an account
        </div>
        {loading && <Loading />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loginLoading,
    manufacturer: state.auth.loggedInManufacturer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (obj) => {
      dispatch(login(obj));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);

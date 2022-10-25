import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import '../scss/MessageBox.scss';

const MessageBox = ({
  active = false,
  message = ''
}) => {
  if (!active) {
    return '';
  }

  const [show, setShow] = useState(true);
  const toggleShow = () => setShow(!show);

  return (
    <Row className='message-box'>
      <Col md={6} className="mb-2">
        <Toast show={show} onClose={toggleShow} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Trust-It!</strong>
          </Toast.Header>
          <Toast.Body className='toast-body'>{message}</Toast.Body>
        </Toast>
      </Col>
    </Row>
  );
};

export default MessageBox;
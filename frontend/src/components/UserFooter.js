import React from 'react';

import { Navbar} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGitlab } from '@fortawesome/free-brands-svg-icons';

import '../scss/footer.scss';

const UserFooter = () => {
  return (
    <Navbar className = "footer">
      <div className='footer-gitlab'>
        <a href='https://gitlab.lrz.de/users/sign_in'><FontAwesomeIcon icon={faGitlab} /></a>
      </div>
      <div className='footer-copyright'>Copyright © 2022 by Team 31 SEBA, All Rights Reserved.</div>
    </Navbar>
  );
};

export default UserFooter;

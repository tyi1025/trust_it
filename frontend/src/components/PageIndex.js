import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const PageIndex = (props) => {
  const location = useLocation();

  const {length, perPage, resultFound, path=location.pathname} = props;
  const queryParams = queryString.parse(location.search);
  !queryParams.page && (queryParams.page = 1);

  const fillPage = length / perPage;
  const prevElm = (
    <div className="button prev-button">
      <FontAwesomeIcon icon={faAngleLeft} />
      Previous
    </div>
  );
  const nextElm = (
    <div className="button next-button">
      Next
      <FontAwesomeIcon icon={faAngleRight} />
    </div>
  );

  if(fillPage >= 1 && parseInt(queryParams.page) > 1 && resultFound == true){
    return (
      <div className="page-index">
        <Link to={`${path}?${queryString.stringify({...queryParams, page: Number(queryParams.page) - 1})}`}>
          {prevElm}
        </Link>
        <Link to={`${path}?${queryString.stringify({...queryParams, page: Number(queryParams.page) + 1})}`}>
          {nextElm}
        </Link>
      </div>
    );
  } else if ((fillPage < 1 && fillPage > 0 || resultFound == false) && parseInt(queryParams.page) == 1){
    return (
      <div className="page-index">
        {prevElm}
        {nextElm}
      </div>
    );
  } else if (fillPage < 1 && fillPage > 0 || resultFound == false){
    return (
      <div className="page-index">
        <Link to={`${path}?${queryString.stringify({...queryParams, page: Number(queryParams.page) - 1})}`}>
          {prevElm}
        </Link>
        {nextElm}
      </div>
    );
  } else {
    return (
      <div className="page-index">
        {prevElm}
        <Link to={`${path}?${queryString.stringify({...queryParams, page: Number(queryParams.page) + 1})}`}>
          {nextElm}
        </Link>
      </div>
    );
  }
};

export default PageIndex;

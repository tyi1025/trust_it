import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import '../scss/ProductFilter.scss';

const ProductFilter = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { path=location.pathname, fullStatus=false } = props;

  const queryParams = queryString.parse(location.search);

  const [filterShowing, setFilterShowing] = useState(false);
  const [keyword, setKeyword] = useState(queryParams.keyword || '');
  const [noneStatus, setNoneStatus] = useState(
    !!queryParams.none_status);
  const [pendingStatus, setPendingStatus] = useState(
    !!queryParams.pending_status);
  const [certifiedStatus, setCertifiedStatus] = useState(
    !!queryParams.certified_status);
  const [minScore, setMinScore] = useState(queryParams.min_score || 1);
  const [maxScore, setMaxScore] = useState(queryParams.max_score || 10);

  function applyFilter() {
    queryParams['keyword'] = keyword;
    noneStatus ? (queryParams['none_status'] = '1') :
      delete queryParams['none_status'];
    pendingStatus ? (queryParams['pending_status'] = '1') :
      delete queryParams['pending_status'];
    certifiedStatus ? (queryParams['certified_status'] = '1') :
      delete queryParams['certified_status'];
    queryParams['min_score'] = minScore;
    queryParams['max_score'] = maxScore;

    navigate(`${path}?${queryString.stringify(queryParams)}`);
  }

  function renderCertificationStatus() {
    if (fullStatus) {
      return (
        <React.Fragment>
          <Form.Label>Certification Status</Form.Label>
          <div className="status-checkbox-container">
            <Form.Check
              id="certified-checkbox" type="checkbox" label="Certified"
              checked={certifiedStatus}
              onChange={e => { setCertifiedStatus(e.target.checked); }} />
            <Form.Check
              id="pending-checkbox" type="checkbox" label="Pending"
              checked={pendingStatus}
              onChange={e => { setPendingStatus(e.target.checked); }} />
            <Form.Check
              id="none-checkbox" type="checkbox" label="Uncertified"
              checked={noneStatus}
              onChange={e => { setNoneStatus(e.target.checked); }} />
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Form.Check
          id="certified-checkbox" type="checkbox"
          label="Show only certified products" checked={certifiedStatus}
          onChange={e => {setCertifiedStatus(e.target.checked);}}/>
      </React.Fragment>
    );
  }

  return (
    <div className="product-filter">
      <div className="filter-top-bar">
        <Button onClick={() => setFilterShowing(!filterShowing)}>
          <span className="button-text">Filter</span>
          {filterShowing ?
            <FontAwesomeIcon icon={faCaretUp} /> :
            <FontAwesomeIcon icon={faCaretDown} />}
        </Button>
        <Form.Control
          className="form-row"
          type="text"
          placeholder="Search your products here..."
          value={keyword}
          onChange={(e) => {setKeyword(e.target.value);}}
          onKeyDown={(e) => e.keyCode === 13 && applyFilter()} />
      </div>
      <div
        className={
          ['filter-content', filterShowing ? 'showing' : 'hidden'].join(' ')
        }>
        <Form.Group className="form-row">
          {renderCertificationStatus()}
        </Form.Group>
        <Form.Group className="form-row score">
          <div className="score-container">
            <Form.Label>Min Score</Form.Label>
            <div className="score-container-2">
              <Form.Control
                type="text" value={minScore}
                onChange={e=>setMinScore(e.target.value)} />
              <Form.Range
                min="1" max="10" value={minScore}
                onChange={e=>setMinScore(e.target.value)}
              />
            </div>
          </div>
          <div className="score-container">
            <Form.Label>Max Score</Form.Label>
            <div className="score-container-2">
              <Form.Control
                type="text" value={maxScore}
                onChange={e=>setMaxScore(e.target.value)} />
              <Form.Range
                min="1" max="10" value={maxScore}
                onChange={e=>setMaxScore(e.target.value)} />
            </div>
          </div>
        </Form.Group>
        <Form.Group className="form-row">
          <Button onClick={applyFilter}>
            Apply Filter
          </Button>
        </Form.Group>
      </div>
    </div>
  );
};

export default ProductFilter;

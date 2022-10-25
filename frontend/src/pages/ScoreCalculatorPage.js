import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';

import UserHeader from '../connectedComponents/UserHeader';
import { getIngredientListScore, setIngredientListGiven } from '../actions/ingredient';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import '../scss/ScoreCalculatorPage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import score_0 from '../images/score_0.png';
import score_1 from '../images/score_1.png';
import score_2 from '../images/score_2.png';
import score_3 from '../images/score_3.png';
import score_4 from '../images/score_4.png';
import score_5 from '../images/score_5.png';
import score_6 from '../images/score_6.png';
import score_7 from '../images/score_7.png';
import score_8 from '../images/score_8.png';
import score_9 from '../images/score_9.png';
import score_10 from '../images/score_10.png';

const ScoreCalculatorPage = function(props) { 
  const [ingredientList, setIngredientList] = useState('');
  const {
    ingredientScore, ingredientScoreLoading, getIngredientListScore, ingredientListGiven,
    setIngredientListGiven, ingredientScoreError
  } = props;

  useEffect(() => {
    getIngredientListScore(ingredientList);
    setIngredientList([]);
    setIngredientListGiven(false);
  }, []);

  const navigate = useNavigate();

  const scoreMap = {
    0: score_0,
    1: score_1,
    2: score_2,
    3: score_3,
    4: score_4,
    5: score_5,
    6: score_6,
    7: score_7,
    8: score_8,
    9: score_9,
    10: score_10
  };

  function renderScore(score) {
    return (
      <div>
        <img src={scoreMap[score]} />
      </div>
    );
  }

  function refreshPage() {
    window.location.reload(false);
  }

  if (ingredientScoreLoading) {
    return (
      <div className='loading'>
        <div className="container">
          <Spinner animation="border" role="status" />
          <div className='text'>Thank-you for trusting us! Please wait while we compute scores for you!</div>
        </div>
      </div>
    );
  }
  if(!ingredientListGiven || ingredientScoreError) {
    return (
      <div>
        <UserHeader />
        <div className='score-calculator calculator'>
          <div><h1>Ingredients score calculator</h1></div>
          <div className='area'> <textarea type="text" placeholder='Enter or copy/paste seperated by new line ingredients list from reputed retailers or websites...' name="ingredients" value={ingredientList} onChange={e => setIngredientList(e.target.value)}/>
          </div>
          <div><button onClick={() => getIngredientListScore(ingredientList)}>Compute scores!</button></div>
        </div>
      </div>
    ); 
  }
  return (
    <div key={ingredientScore._id}>
      <UserHeader />   
      <div className='score-calculator'>
        <div className='results'>
          <div className="ingredient-list">
            <div className="name-list">
              <div className="heading">
                Ingredient List
              </div>
              <div>
                {
                  ingredientScore.ingredientList?.map((item) => {
                    return (
                      <div
                        key={item._id}
                        className="name">
                        <Link to={'/ingredient/' + item._id} >
                          {item.name}
                        </Link>
                      </div>
                    );
                  })
                }
              </div>
            </div>
            <div className="description-list">
              <div className="heading">
                Descriptions
              </div>
              {
                ingredientScore.ingredientList?.map((item) => {
                  return (
                    <div key={item._id} className="description">
                      <div>{item.description}</div>
                      <button className='show-more' onClick={() => navigate('/ingredient/' + item._id)}>Show more</button></div>
                    
                  );
                })
              }
            </div>
          </div>
          <div className='score-list'>
            <div className="score-container">
              <div className="text">Overall Score:</div>
              {renderScore(Math.round(ingredientScore.overallScore))}
            </div>
            <div className="score-container">
              <div className="text">Environment Score:</div>
              {renderScore(Math.round(ingredientScore.environmentScore))}
            </div>
            <div className="score-container">
              <div className="text">Allergy Score:</div>
              {renderScore(Math.round(ingredientScore.allergyScore))}
            </div>
            <div className="score-container">
              <div className="text">Cancer Score:</div>
              {renderScore(Math.round(ingredientScore.cancerScore))}
            </div>
          </div>
        </div>
        <button className='button_compute' onClick={() => refreshPage()}>Compute scores for another list!</button>
      </div>
    </div>
  );};

const mapStateToProps = function(state) {
  return {
    ingredientListGiven: state.ingredient.ingredientListGiven,
    ingredientScoreLoading: state.ingredient.ingredientScoreLoading,
    ingredientScore: state.ingredient.ingredientScore,
    ingredientScoreError: state.ingredient.ingredientScoreError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getIngredientListScore: (ingredientList) => {
      dispatch(getIngredientListScore(ingredientList));
    },
    setIngredientListGiven: (given) => {
      dispatch(setIngredientListGiven(given));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreCalculatorPage);

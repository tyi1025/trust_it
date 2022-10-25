import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';

import UserHeader from '../connectedComponents/UserHeader';

import { useParams } from 'react-router-dom';
import { getIngredientById } from '../actions/ingredient';

import '../scss/ProductAndIngredientDetails.scss';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Loading from '../components/Loading';

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

const IngredientDetailsPage = function (props) {
  const { ingredientId: id } = useParams();
  const {
    ingredient, getIngredientById, ingredientDetailsLoading
  } = props;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getIngredientById(id);
  }, []);

  function renderScore(score) {
    return (
      <div>
        <img src={scoreMap[score]} />
      </div>
    );
  }

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

  return (
    <div>
      <UserHeader />
      <div className='ingredient-details-container'>
        <div><h1>Ingredient details</h1></div>
        <div className = 'top' key={ingredient._id}>
          <div>Ingredient name: <b>{ingredient.name}</b></div>
          <div><button className='modalbutton' onClick={handleShow}>
          See detailed product description
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Ingredient description of { ingredient.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{ingredient.description}</Modal.Body>
            <Modal.Footer>
              <Button className='comparebutton' onClick={handleClose}>
              Close
              </Button>
            </Modal.Footer>
          </Modal></div>
        </div>
        <div> 
          
          <div className='ingredient-details-container'>
            <div className='effects'>
              <div className='effects-list'>
                <div className='name-list'>
                  <div className="heading">
                    Effect
                  </div>
                  <div>
                    {
                      ingredient.effects && ingredient.effects.map((effect) => {
                        return (
                          <div
                            key={effect._id}
                            className="name">
                            {effect.name}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
                <div className='type-list'>
                  <div className="heading">
                    Effect Type
                  </div>
                  <div>
                    {
                      ingredient.effects && ingredient.effects.map((effect) => {
                        return (
                          <div
                            key={effect._id}
                            className="type">
                            {effect.effectType}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
                <div className='score-list'>
                  <div className="heading">
                    Score
                  </div>
                  <div>
                    {
                      ingredient.effects && ingredient.effects.map((effect) => {
                        return (
                          <div
                            key={effect._id}
                            className="score">
                            {renderScore(effect.score)}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
      </div>
      {ingredientDetailsLoading && <Loading />}
    </div>
  );
};

const mapStateToProps = function(state) {
  return {
    ingredientDetailsLoading: state.ingredient.ingredientDetailsLoading,
    ingredient: state.ingredient.ingredientDetails
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getIngredientById: (id) => {
      dispatch(getIngredientById(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IngredientDetailsPage);

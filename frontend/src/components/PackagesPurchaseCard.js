import React from 'react';

import { useNavigate } from 'react-router-dom';
import '../scss/PackagesPurchaseCard.scss';

import certificate_1 from '../images/certificate_1.png';
import certificate_2 from '../images/certificate_2.png';
import certificate_3 from '../images/certificate_3.png';

const PackagesPurchaseCard = (props) => {

  const navigate = useNavigate();

  //Should pass also what kind of purchase has been selected, e.g. 50 Certificates - 150 euro
  const goToCheckoutPage = () => {
    navigate('/portal/checkout', {
      state: {cost: props.cost, amount: props.number}});
  };

  const getImage = (number) => {
    if(number == 50)
      return certificate_1;
    else if(number == 100)
      return certificate_2;
    else if(number == 150)
      return certificate_3;
  };

  return (
    <div className='purchase-package'>
      <div className='box'>
        <img src = {getImage(props.number)}></img>
        <div id ='shape'> 
          <p className='pack_name'>{props.title}</p>
        </div> 
        <div className='description'>
          <p>No. of Certificates: {props.number}</p>
          <p>Price: {props.cost}€</p>
          <button onClick={goToCheckoutPage}>Buy Now!</button> 
        </div>
      </div>
    </div> 
  );
};

export default PackagesPurchaseCard;

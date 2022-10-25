import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import ManufacturerHeader from '../connectedComponents/ManufacturerHeader';
import StripeCardForm from '../components/StripeCardForm';
import Loading from '../components/Loading';
import { preCheckout, postCheckout } from '../actions/checkout';

const CheckoutPage = (props) => {
  const {
    preCheckoutLoading, postCheckoutLoading, paymentIntent, invoice,
    preCheckout, postCheckout
  } = props;

  const stripeTestPromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoading = preCheckoutLoading || postCheckoutLoading ||
    !paymentIntent || Object.keys(paymentIntent).length === 0;

  useEffect(() => {
    preCheckout(location.state.cost * 100);
  }, [preCheckout, location.state.cost]);

  useEffect(() => {
    invoice && navigate('/portal/invoice/' + invoice._id);
  }, [navigate, invoice]);

  if (paymentIntent) {
    return (
      <div>
        <ManufacturerHeader />
        <div className='invoice-page'>
          <h1>Enter Payment Details</h1>
          <div>
            <Elements stripe={stripeTestPromise} options={{ clientSecret: paymentIntent.client_secret }}>
              <StripeCardForm
                onSuccess={(result) => {
                  postCheckout(result.paymentIntent, location.state.amount);
                }} />
            </Elements>
          </div>
        </div>
        {isLoading && <Loading />}
      </div>
    );
  } else {
    return <Loading />;
  }
};

const mapStateToProps = (state) => {
  return {
    preCheckoutLoading: state.checkout.preCheckoutLoading,
    preCheckoutError: state.checkout.preCheckoutError,
    paymentIntent: state.checkout.paymentIntent,
    postCheckoutLoading: state.checkout.postCheckoutLoading,
    postCheckoutError: state.checkout.postCheckoutError,
    invoice: state.checkout.invoice
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    preCheckout: (amount) => {
      dispatch(preCheckout(amount));
    },
    postCheckout: (paymentIntent, amount) => {
      dispatch(postCheckout(paymentIntent, amount));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutPage);

import React, { useState } from 'react';

import {
  useStripe, useElements, PaymentElement
} from '@stripe/react-stripe-js';

function StripeCardForm(props) {
  const { onSuccess } = props;

  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    onSuccess(result);
    setLoading(false);

  };

  return (
    <form
      onSubmit={handleSubmit}>
      {loading && <div>Loading...</div>}
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
}

export default StripeCardForm;

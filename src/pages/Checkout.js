import React, { useContext, useState } from 'react';
import { CartContext } from '../context/cart';
import { UserContext } from '../context/user';
import { useHistory } from 'react-router-dom';
import EmptyCart from '../components/Cart/EmptyCart';

//react stripe elements
import {
  CardElement,
  StripeProvider,
  Elements,
  injectStripe,
} from 'react-stripe-elements';

import submitOrder from '../strapi/submitOrder';

function Checkout(props) {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user, showAlert, alert, hideAlert } = useContext(UserContext);

  const history = useHistory();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const isEmpty = !name || alert.show;

  async function handleSubmit(event) {
    showAlert({ msg: 'submitting order... please wait' });
    event.preventDefault();
    const response = await props.stripe
      .createToken()
      .catch((error) => console.log(error));

    const { token } = response;
    if (token) {
      setError('');
      const { id } = token;
      let order = await submitOrder({
        name: name,
        total: total,
        items: cart,
        stripeTokenId: id,
        userToken: user.token,
      });

      if (order) {
        showAlert({ msg: 'your oder is complete' });
        clearCart();
        history.push('/');
        return;
      } else {
        showAlert({
          msg: 'there was an error with your order. please try again',
          type: 'danger',
        });
      }
    } else {
      hideAlert();
      setError(response.error.message);
    }
  }

  if (cart.length < 1) return <EmptyCart />;

  return (
    <section className='section form'>
      <h2 className='section-title'>checkout</h2>
      <form className='checkout-form'>
        <h3>
          order total : <span>${total}</span>
        </h3>
        {/* name */}
        <div className='form-control'>
          <label htmlFor='name'>name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        {/* stripe */}
        <div className='stripe-input'>
          <label htmlFor='card-element'>credit or debit card</label>
          <p className='stripe-info'>
            test using this credit card : <span>4242 4242 4242 4242</span>
            <br />
            enter any 5 digits for the zip code
            <br />
            enter any 3 digits of cvc
          </p>
        </div>
        {/* stripe elements */}
        <CardElement className='card-element'></CardElement>
        {/* stripe errors */}
        {error && <p className='form-empty'>{error}</p>}
        {isEmpty ? (
          <p className='form-empty'>please fill out name field</p>
        ) : (
          <button
            className='btn btn-primary btn-block'
            type='submit'
            onClick={handleSubmit}
          >
            submit
          </button>
        )}
      </form>
    </section>
  );
}

const CardForm = injectStripe(Checkout);

const StripeWrapper = () => {
  return (
    <StripeProvider apiKey='pk_test_51HAHEaHuNb6rUZ6Tq7tM57arnl87sMeciO01FLbBmnZdxRDH21w52zgIZwRMRnoQcKKaXyzEOuTutHxBQTg1OhOE00iD6vdUiG'>
      <Elements>
        <CardForm></CardForm>
      </Elements>
    </StripeProvider>
  );
};

export default StripeWrapper;

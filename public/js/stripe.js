/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51SVyCsIDbL9Q5UNHj3vbuM0XERApykx9opwmd9g2YZNfZkhFZlEb3R0LhptLKAhvvFn1g7J1dEUtjr4St4ql8NEV00Pkn6m0pO');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};

import { createRoot } from 'react-dom/client'
import './index.css'


import {BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import App from './App.jsx'
const stripePromise = loadStripe(
  "pk_test_51QxOcnDSMxyLZpYGs0hGB3dXIRWqprkTo0iCx0WL2OTAN1Yd7KTISlMfFqEAhmD2k6QmkziLm28rYXcOShHhtSbn00SoZvM2VD"
);


createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
)

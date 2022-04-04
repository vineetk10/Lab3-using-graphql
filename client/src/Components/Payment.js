import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from 'axios';
import { API } from "../backend";
import { isAutheticated} from './../auth/helper/authapicalls';
import { useHistory } from 'react-router-dom'
const Paymentb = ({ products }) => {
  const history = useHistory();
    const {user} = isAutheticated()
  const SaveOrder = async ()=>{
    let OrderId = axios
    .post(
       `${API}/SaveOrder`,{"UserId":user.UserId, "Items": products} )
    .then((response) => {
      if (response.status == 201) {
        console.log(response);
      }
    })
    .catch((e) => console.log(e));
    history.push('/purchases');

  }
  const getAmount = () => {
    let amount = 0;
    products.map(p => {
      amount = amount + p.Price;
    });
    return amount;
  };

  return (
    <div>
      <h3>Your bill is {getAmount()} $</h3>
      <Button onClick={SaveOrder}>Proceed to checkout</Button>
    </div>
  );
};

export default Paymentb;

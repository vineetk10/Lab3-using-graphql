import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from 'axios';
import { API } from "../backend";
import { isAutheticated} from './../auth/helper/authapicalls';
import { useHistory } from 'react-router-dom'
import { connect } from "react-redux";
import { CHANGE_TOTAL_PRICE } from "../action.types";

const Paymentb = ({ products,totalPrice,markComplete }) => {
  const history = useHistory();
    const {user} = isAutheticated()
  const SaveOrder = async ()=>{
    let OrderId = axios
    .post(
       `${API}/SaveOrder`,{"UserId":user._id, "Items": products} )
    .then((response) => {
      if (response.status == 201) {
        console.log(response);
      }
    })
    .catch((e) => console.log(e));
    history.push('/purchases');

  }
  
  useEffect(()=>{
      let amount = 0;
      products.map(p => {
        amount = amount + p.price;
      })
    markComplete(amount);
  },[])
  return (
    <div>
      <h3>Your bill is {totalPrice} $</h3>
      <Button onClick={SaveOrder}>Proceed to checkout</Button>
    </div>
  );
};
const mapStateToProps = state => {
  return {totalPrice: state.cartPrice};
};

const mapDispatchToProps = (dispatch) => ({
  markComplete: (totalPrice) => {
      dispatch({
          type: CHANGE_TOTAL_PRICE,
          payload: totalPrice
        });
  },
});
export default connect(mapStateToProps,mapDispatchToProps)(Paymentb);

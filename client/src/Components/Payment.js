import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from 'axios';
import { API } from "../backend";
import { isAutheticated} from './../auth/helper/authapicalls';
import { useHistory } from 'react-router-dom'
import { connect } from "react-redux";
import { CHANGE_TOTAL_PRICE } from "../action.types";
import {
  gql,
  useMutation
} from "@apollo/client";

const SaveOrderString = gql`
mutation ($UserId: ID, $Items: [InputItem]) {
    saveOrder(UserId: $UserId, Items: $Items ){
    successMessage
  }
}
`;
const Paymentb = ({ products,totalPrice,markComplete }) => {
  const [mutateFunction, { data, loading, error }] = useMutation(SaveOrderString);
  const history = useHistory();
    const {user} = isAutheticated()
  const SaveOrder = async ()=>{
    let productWithQuantitiesMoreThanZero = products.filter((product)=>product.quantity!=="0").reduce((acc, curr)=>{
      const newObj = {count: 1,
        isFavorite: curr.isFavorite,
        itemDescription: curr.itemDescription,
        itemImageUrl: curr.itemImageUrl,
        itemName: curr.itemName,
        price: curr.price,
        quantity: curr.quantity,
        salesCount: curr.salesCount
        }
        acc.push(newObj);
        return acc;
    },[]);


    mutateFunction({
      variables: {
          UserId: user._id,
          Items: productWithQuantitiesMoreThanZero
      }
  })
  if (error)
      console.log(`Submission error! ${error.message}`);

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

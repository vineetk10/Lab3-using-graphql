import React, { useEffect, useState } from 'react'
import { API } from "../backend";
import {isAutheticated} from '../auth/helper/authapicalls'
import Header from './Core/Header';
import ItemCard from "./ItemCard"
import { Container } from 'react-bootstrap';
function Purchases() {
    const {user}= isAutheticated();
    const [purchases, setPurchases] = useState([]);
    const getAllPurchases = (UserId)=>{
        fetch(`${API}/GetAllPurchases`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({UserId: UserId })
          })
          .then(response => {
            console.log(response);
            
            return response.json();
          })
          .then(jsonResponse=>{
            console.log(jsonResponse);
            setPurchases(jsonResponse.orders.orders);
             return jsonResponse;
          })
          .catch(err => console.log(err));
    }

    useEffect(()=>{
        getAllPurchases(user._id);
    },[])
  return (
    <div className="row" id="cards">
        <Header/>
        {purchases.map((order,index)=>{
          return(<Container style={{border: '1px solid rgba(0, 0, 0, 0.05)'}}>
            <p>Order Date : {order.orderDate}</p>
            
            {order.items.map((item,index)=>{
              return (
                  <div key={index} className="col-4 mb-4">
                  <ItemCard addtoCart={false} item={item}/>
                </div>   
              )
            })}
          </Container>)
            })}
    </div>
  )
}

export default Purchases
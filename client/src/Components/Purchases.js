import React, { useEffect, useState } from 'react'
import { API } from "../backend";
import {isAutheticated} from '../auth/helper/authapicalls'
import Header from './Core/Header';
import ItemCard from "./ItemCard"
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
            setPurchases(jsonResponse.purchases);
             return jsonResponse;
          })
          .catch(err => console.log(err));
    }

    useEffect(()=>{
        getAllPurchases(user.UserId);
    },purchases)
  return (
    <div className="row" id="cards">
        <Header/>
        {purchases.map((item,index)=>{
                        return(
                            <div key={index} className="col-4 mb-4">
                                <ItemCard addtoCart={false} item={item}/>
                             </div>   
                        )
                    })}
    </div>
  )
}

export default Purchases
import React, { useEffect, useState } from 'react'
import { API } from "../backend";
import {isAutheticated} from '../auth/helper/authapicalls'
import Header from './Core/Header';
import ItemCard from "./ItemCard"
import { Container } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

function Purchases() {
    const {user}= isAutheticated();
    const [purchases, setPurchases] = useState([]);
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

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
            const endOffset = itemOffset + 2;
            setCurrentItems(jsonResponse.orders.orders.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(jsonResponse.orders.orders.length / 2));
             return jsonResponse;
          })
          .catch(err => console.log(err));
    }
    const handlePageClick = (event) => {
      const newOffset = (event.selected * 2) % purchases.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };
    useEffect(()=>{
         getAllPurchases(user._id);
        
    },[itemOffset])
  return (
    <>
      <div className="row" id="cards">
              <Header/>
              {currentItems.map((order,index)=>{
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
      <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< previous"
              renderOnZeroPageCount={null}
        />
    </>
    
  )
}

export default Purchases
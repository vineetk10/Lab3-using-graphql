import React, { useState, useEffect } from "react";
import ItemCard from "../Components/CartCard.js";
import Header from "./Core/Header";
import { loadCart } from "./Core/cartHelper.js";
import Paymentb from "./Payment.js";

const Cart = ({totalPrice,markComplete}) => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = () => {
    return (
      <div>
        <div className="row" id="cards">
        {products.map((product, index) => (
           <div key={index} className="col-4 mb-4">
              <ItemCard
                key={index}
                item={product}
                removeFromCart={true}
                addtoCart={false}
              />
            </div>   
        ))}
        </div>
      </div>
    );
  };
  const loadCheckout = () => {
    return (
      <div>
        <h2>This section for checkout</h2>
      </div>
    );
  };

  return (
      <>
        <Header/>
        <div className="row text-center">
        {/* <h2>This section is to load products</h2> */}
          <div className="col-8">
            {products.length > 0 ? (
              loadAllProducts(products)
            ) : (
              <h4>No products</h4>
            )}
          </div>
        <div className="col-4">
          <Paymentb products={products} setReload={setReload} />
        </div>
      </div>
      </>
     
  );
};


export default Cart

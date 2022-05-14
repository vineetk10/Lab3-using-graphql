import React, { useEffect, useState,useContext} from 'react';
import { Card ,Button,Dropdown} from 'react-bootstrap';
import { Heart, HeartFill,Pencil} from 'react-bootstrap-icons';
import { API } from "../backend";
import {isAutheticated,signout} from '../auth/helper/authapicalls'
import { useHistory } from 'react-router-dom'
import { Redirect } from "react-router-dom";
import { addItemToCart, removeItemFromCart } from "./Core/cartHelper.js";
import { CurrencyContext} from "../context/CurrencyContext";
import EditItemModal from "./EditItemModal"
import { connect } from "react-redux";
import "../css/Cards.css"
import { CHANGE_TOTAL_PRICE } from "../action.types";

const {user}= isAutheticated();
const Cards =({
  // currency,
  edit,
  item,
  addtoCart = true,
  removeFromCart = false,
  defaultIsFav = false,
  currency,
  totalPrice,
  markComplete
})=>{
  const history = useHistory();
  const [imgUrl, setImgUrl] = useState(null);
    const [fav,setFav] = useState(defaultIsFav);
    const reader = new FileReader();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [quantity, setQuantity] = useState(1);
    const imgPath = `/images/${item.ItemImage}`
    const [redirect, setRedirect] = useState(false);
    const [isGift, setIsGift] = useState(false);
    const [note, setNote] = useState();

    // const { currency, dispatch1} = useContext(CurrencyContext);
    const FavClick = ()=>{
        let val = !fav;
        setFav(!fav);
        if(val)
        {
            fetch(`${API}/SaveFavItem`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({UserId:user._id, Item: item,IsFavorite:true })
              })
              .then(response => {
                return response.json();
              })
              .then(jsonResponse=>{
                 return jsonResponse.json();
              })
              .catch(err => console.log(err));
        }
        else
        {
            fetch(`${API}/RemoveFavItem`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({UserId:user._id, ItemId: item._id,IsFavorite:true })
              })
              .then(response => {
                return response.json();
              })
              .then(jsonResponse=>{
                 return jsonResponse.json();
              })
              .catch(err => console.log(err));
        }
        if(defaultIsFav)
          window.location.reload();
    }

  const addToCart = () => {
    item.Quantity -= 1;
    addItemToCart(item, () => setRedirect(true));
  };

  const getARedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCart = addtoCart => {
    return (
      addtoCart && (
        <button
          onClick={addToCart}
          className="btn btn-block btn-outline-success mt-2 mb-2"
        >
          Add to Cart
        </button>
      )
    );
  };

  const showRemoveFromCart = removeFromCart => {
    return (
      removeFromCart && (
        <button
          onClick={() => {
            item.Quantity+=1;
            removeItemFromCart(item.ItemId);
            // setReload(!reload);
            window.location.reload();
          }}
          className="btn btn-block btn-outline-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };
    const ItemClick = ()=>{
      history.push({
        pathname:"/item", 
        state: {  // location state
          item:item,
          imgPath: imgPath
        }
      });
    }

    const changeQuantity = (e)=>{
        if(e.target.value>=quantity)
          markComplete(totalPrice+item.price);
        else
          markComplete(totalPrice-item.price);
        item.quantity = e.target.value;
        setQuantity(e.target.value);
    }

    const changeGiftOption = (e)=>{
      setIsGift(e.target.checked);
      item.isGift = e.target.checked;
    }

    const changeNote = (e)=>{
      setNote(e.target.value);
      item.note = e.target.value;
    }

    return(
        <Card style={{ width: '20rem' }}>
          <div className="card_icons">
            {!fav ? <Heart onClick={FavClick} size={30} color="black"/>:
                  <HeartFill onClick={FavClick} size={30} color="red"/>}
              {edit && <Pencil onClick={handleShow} size={30}/>}
              <EditItemModal show ={show} setShow={setShow} handleClose={handleClose} item={item}/>
          </div>
           <Card.Img onClick={ItemClick} variant="top" src=""/>
            <Card.Body  >
            {getARedirect(redirect)}
                <Card.Title>{item.itemName}</Card.Title>
                <Card.Text className="card-text">
                  <div className="card-text-description" onClick={ItemClick}>
                    {item.itemDescription}
                  </div>
                 <input  onChange={changeQuantity} type="number"></input>
                </Card.Text>
                <p>Price: {quantity* item.price} {currency}</p>
                <p>Quantity: {quantity}</p>
                {item.ShopName && <p>Shop Name: {item.ShopName}</p>}
                {item.OrderDate && <p>Order Date: {item.OrderDate}</p>}
                <div>
                  <input onChange={changeGiftOption} type="checkbox" id="gift"  name="scales"></input>
                  <label for="gift">This order is a gift</label>
                </div>
                <textarea onChange={changeNote} placeholder='Add a note to MOBODUC (optional)'></textarea>
            </Card.Body>
            <div className="col-12">{showAddToCart(addtoCart)}</div>
                <div className="col-12">{showRemoveFromCart(removeFromCart)}</div>
      </Card>
    )
}

const mapStateToProps = state => {
  return { currency: state.currency , totalPrice: state.cartPrice};
};


const mapDispatchToProps = (dispatch) => ({
    markComplete: (totalPrice) => {
        dispatch({
            type: CHANGE_TOTAL_PRICE,
            payload: totalPrice
          });
    },
  });

export default connect(mapStateToProps,mapDispatchToProps)(Cards)
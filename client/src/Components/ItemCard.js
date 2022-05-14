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
import {
  gql,
  useMutation
} from "@apollo/client";

const SaveFavItem = gql`
mutation ($UserId: ID, $Item: InputItem, $IsFavorite: Boolean) {
  saveFavItem(UserId: $UserId, Item: $Item, IsFavorite: $IsFavorite ){
    successMessage
  }
}
`;
const RemoveFavItem = gql`
mutation ($UserId: ID, $ItemId: ID, $IsFavorite: Boolean) {
  removeFavItem(UserId: $UserId, ItemId: $ItemId, IsFavorite: $IsFavorite ){
    successMessage
  }
}
`;
const {user}= isAutheticated();
const Cards =({
  // currency,
  edit,
  item,
  addtoCart = true,
  removeFromCart = false,
  defaultIsFav = false,
  currency
})=>{
  const [mutateFunction, { data, loading, error }] = useMutation(SaveFavItem);
  const [mutateFunction1, { data1, loading1, error1 }] = useMutation(RemoveFavItem);
  console.log(item);
  const history = useHistory();
  const [imgUrl, setImgUrl] = useState(null);
    const [fav,setFav] = useState(defaultIsFav);
    const reader = new FileReader();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [quantity, setQuantity] = useState(0);

    const imgPath = `/${item.itemImageUrl}`
    const [redirect, setRedirect] = useState(false);
    // const { currency, dispatch1} = useContext(CurrencyContext);
    const FavClick = ()=>{
        let val = !fav;
        setFav(!fav);
        if(val)
        {
            const newObj = {
              count: item.count,
              isFavorite: item.isFavorite,
              itemDescription: item.itemDescription,
              itemImageUrl: item.itemImageUrl,
              itemName: item.itemName,
              price: item.price,
              quantity: item.quantity,
              salesCount: item.salesCount
              }

          mutateFunction({
            variables: {
                UserId: user._id,
                Item: newObj,
                IsFavorite:true
            }
        })
        if (error)
            console.log(`Submission error! ${error.message}`);
        }
        else
        { 
          mutateFunction1({
            variables: {
                UserId: user._id,
                ItemId: item._id,
                IsFavorite:true
            }
        })
        if (error)
            console.log(`Submission error! ${error.message}`);
        }
        if(defaultIsFav)
          window.location.reload();
    }

  const addToCart = () => {
    // item.quantity = 1;
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

    return(
        <Card style={{ width: '20rem' }}>
          <div className="card_icons">
            {!fav ? <Heart onClick={FavClick} size={30} color="black"/>:
                  <HeartFill onClick={FavClick} size={30} color="red"/>}
              {edit && <Pencil onClick={handleShow} size={30}/>}
              <EditItemModal show ={show} setShow={setShow} handleClose={handleClose} item={item}/>
          </div>
           {/* <img onClick={ItemClick} variant="top" src={`${API}/images/${item.itemImageUrl}`}></img> */}
           <img onClick={ItemClick} variant="top" src=''></img>
            <Card.Body  >
            {getARedirect(redirect)}
                <Card.Title>{item.itemName}</Card.Title>
                <Card.Text>
                    {item.itemDescription}
                </Card.Text>
                <p>Price: {item.price} {currency}</p>
                <p>Quantity: {item.quantity}</p>
                {item.shopName && <p>Shop Name: {item.shopName}</p>}
                {item.OrderDate && <p>Order Date: {item.OrderDate}</p>}
            </Card.Body>
            <div className="col-12">{showAddToCart(addtoCart)}</div>
                <div className="col-12">{showRemoveFromCart(removeFromCart)}</div>
      </Card>
    )
}

const mapStateToProps = state => {
  return { currency: state.currency };
};


export default connect(mapStateToProps)(Cards)
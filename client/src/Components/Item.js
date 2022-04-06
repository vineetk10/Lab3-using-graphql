import React,{useState,useContext} from 'react'
import {Container,Row,Col,Button} from 'react-bootstrap'
import { useLocation } from 'react-router-dom';
import "../css/Item.css"
import { Heart, HeartFill} from 'react-bootstrap-icons';
import { Redirect } from "react-router-dom";
import EtsyNavbar from './Core/Navbar';
import { addItemToCart } from "./Core/cartHelper";
import { CurrencyContext} from "../context/CurrencyContext";
import Footer from './Core/Footer';
function Item() {
    const location = useLocation();
    const [redirect, setRedirect] = useState(false);
    const { currency, dispatch1} = useContext(CurrencyContext);
    const getARedirect = redirect => {
      if (redirect) {
        return <Redirect to="/cart" />;
      }
    };
    const addToCart = () => {
      // if(location.state.item.Quantity>0)
      //   location.state.item.Quantity-=1;
      addItemToCart(location.state.item, () => setRedirect(true));
    };
  return (
    <div>
      <EtsyNavbar/>
      {getARedirect(redirect)}
        <Container className='items'>
                <Row className="items_row">
                    <Col md={6}>
                      <div className="itemDiv">
                       <img className="ItemImage" src={location.state.imgPath} alt="/logo.png"/>
                      </div>
                    </Col>
                    <Col md={1}>
                      <Heart/>
                    </Col>
                    <Col md={5}>
                      <Row>
                        <p>{location.state.item.itemDescription}</p>
                        <p>{location.state.item.price} {currency}</p>
                      </Row>
                      <Row>

                      </Row>
                      <Row>
                        {location.state.item.quantity>0 ? <Button onClick={addToCart}>Add to cart</Button> :
                          <div>Out Of Stock</div>}
                      </Row>
                    </Col>
                </Row>
        </Container>
        <Footer/>
    </div>
  )
}

export default Item
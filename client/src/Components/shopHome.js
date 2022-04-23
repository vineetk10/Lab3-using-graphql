import React,{useState,useEffect} from 'react'
import Header from './Core/Header'
import { useLocation } from "react-router-dom";
import {Container,Row,Col,Button} from 'react-bootstrap'
import { ShopWindow } from 'react-bootstrap-icons';
import { isAutheticated } from './../auth/helper/authapicalls';
import ItemModal from './ItemModal';
import ShopModal from './ShopModal';
import { API } from "../backend";
import ItemCard from "./ItemCard"
import Footer from './Core/Footer';
const {user} = isAutheticated();
function ShopHome(props) {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const handleClose = () => setShow(false);
  const handleShopClose = () => setShowShopModal(false);
  const [items,setItems] = useState([]);
  const handleShow = () => setShow(true);
  const handleShowShop = () => setShowShopModal(true);
  const [imagePath, setImagePath] = useState();
  const [shopImagePath, setShopImagePath] = useState();
  const [myUser, setMyUser] = useState(user);

  const getUser =(id)=>{
    fetch(`${API}/GetUser`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({UserId: id })
    })
    .then(response => {
      return response.json();
    })
    .then(jsonResponse=>{
      setMyUser(jsonResponse.user);
      // setImagePath(`/public/images/${jsonResponse.path[0].ImageName}`);
       return jsonResponse;
    })
    .catch(err => console.log(err));
  }

  useEffect(()=>{
    getUser(user._id);
  },[])

  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col md={3}>
            {/* <ShopWindow/> */}
            <a className="avatar user-avatar-circle">
              {myUser?.shop?.shopImageUrl ? <img className="avatar_img user-avatar-circle-img" src={`${API}/images/${myUser.shop.shopImageUrl}`} alt="vineet Karmiani"></img>
              :  <img className="avatar_img user-avatar-circle-img" src="https://www.etsy.com/images/avatars/default_avatar_400x400.png" alt="vineet Karmiani"></img>}
            </a>
          </Col>
          <Col md={5}>
            <Row>
               <p>{myUser?.shop?.shopName}</p>
            </Row>
            <Row>
              <Col>
                <Button onClick={handleShowShop} variant="dark">Edit Shop</Button>
                <ShopModal show ={showShopModal} setShow={setShowShopModal} handleClose={handleShopClose} shopId={""}/>
              </Col>
              <Col>
              <Button  variant="light">Favorite Shop</Button>
              </Col>
            </Row>
          </Col>
          {/* <Col md={4}>
          </Col> */}
          <Col md={1}>
            <p>SHOP OWNER</p>
            {myUser && myUser.imagePath ? <img className="avatar_img user-avatar-circle-img" alt="" src={`${API}/images/${myUser.imagePath}`}></img>
            : <img className="avatar_img user-avatar-circle-img" alt="https://www.etsy.com/images/avatars/default_avatar_400x400.png" src="https://www.etsy.com/images/avatars/default_avatar_400x400.png"></img>}
            {myUser && <p>{myUser.firstName}</p>}
          </Col>
        </Row>
        <Row>
          <Col md={4}>
          <Button onClick={handleShow} variant="dark">Add Item</Button>
          <ItemModal show ={show} setShow={setShow} handleClose={handleClose} shopId={""}/>
          </Col>
          <Col md={8}>
              <div className="row" id="cards">
                    {myUser && myUser?.shop?.items && myUser.shop.items.map((item,index)=>{
                        return(
                            <div key={index} className="col-4 mb-4">
                                <ItemCard edit={true} item={item}/>
                             </div>   
                        )
                    })}
                </div>
          </Col>
        </Row>
      </Container>
      <br/>
      <Footer/>
    </div>
  )
}

export default ShopHome
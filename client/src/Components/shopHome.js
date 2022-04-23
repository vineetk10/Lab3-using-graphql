import React,{useState,useEffect} from 'react'
import Header from './Core/Header'
import { useLocation } from "react-router-dom";
import {Container,Row,Col,Button} from 'react-bootstrap'
import { ShopWindow } from 'react-bootstrap-icons';
import { isAutheticated } from './../auth/helper/authapicalls';
import ItemModal from './ItemModal';
import { API } from "../backend";
import ItemCard from "./ItemCard"
import Footer from './Core/Footer';
const {user} = isAutheticated();
function ShopHome(props) {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [items,setItems] = useState([]);
  const handleShow = () => setShow(true);
  const [imagePath, setImagePath] = useState();
  const getAllItemsOfShop = async() => {
    let it= await fetch(`${API}/GetItemsOfShop`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({UserId: user._id })
    })
    .then(response => {
      return response.json();
    })
    .then(jsonResponse=>{
      setItems(jsonResponse.items.shop.items);
       return jsonResponse;
    })
    .catch(err => console.log(err));

  }
  const getUserImagePath = (id)=>{
    fetch(`${API}/GetUserImagePath`, {
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
      setImagePath(jsonResponse.path[0].imagePath);
      // setImagePath(`/public/images/${jsonResponse.path[0].ImageName}`);
      console.log(jsonResponse.path[0].ImageName)
       return jsonResponse;
    })
    .catch(err => console.log(err));
  }
  useEffect(()=>{
    getAllItemsOfShop();
    getUserImagePath(user._id);
  },[])

  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col md={3}>
            {/* <ShopWindow/> */}
            <a className="avatar user-avatar-circle">
              {imagePath ? <img className="avatar_img user-avatar-circle-img" src={imagePath} alt="vineet Karmiani"></img>
              :  <img className="avatar_img user-avatar-circle-img" src="https://www.etsy.com/images/avatars/default_avatar_400x400.png" alt="vineet Karmiani"></img>}
            </a>
          </Col>
          <Col md={5}>
            <Row>
               <p></p>
            </Row>
            <Row>
              <Col>
                <Button   variant="dark">Edit Shop</Button>
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
            {imagePath ? <img className="avatar_img user-avatar-circle-img" alt="" src={`${API}/images/${imagePath}`}></img>
            : <img className="avatar_img user-avatar-circle-img" alt="https://www.etsy.com/images/avatars/default_avatar_400x400.png" src="https://www.etsy.com/images/avatars/default_avatar_400x400.png"></img>}
            {user && <p>{user.firstName}</p>}
          </Col>
        </Row>
        <Row>
          <Col md={4}>
          <Button onClick={handleShow} variant="dark">Add Item</Button>
          <ItemModal show ={show} setShow={setShow} handleClose={handleClose} shopId={""}/>
          </Col>
          <Col md={8}>
              <div className="row" id="cards">
                    {items && items.map((item,index)=>{
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
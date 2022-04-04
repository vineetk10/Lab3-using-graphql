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
  const [imagePath, setImagePath] = useState("https://www.etsy.com/images/avatars/default_avatar_400x400.png");
  const getAllItemsOfShop = async() => {
    let it= await fetch(`${API}/GetItemsOfShop`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({UserId: user.UserId })
    })
    .then(response => {
      return response.json();
    })
    .then(jsonResponse=>{
      setItems(jsonResponse.items);
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
      setImagePath("/images/"+jsonResponse.path[0].ImageName);
      // setImagePath(`/public/images/${jsonResponse.path[0].ImageName}`);
      console.log("/images/"+jsonResponse.path[0].ImageName)
       return jsonResponse;
    })
    .catch(err => console.log(err));
  }
  useEffect(()=>{
    getAllItemsOfShop();
    // getUserImagePath(user.UserId);
  },[])

  return (
    <div>
      <Header />
      <Container>
        <Row>
          <Col md={1}>
            <ShopWindow/>
          </Col>
          <Col md={3}>
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
          <Col md={4}>
          </Col>
          <Col md={1}>
            <p>SHOP OWNER</p>
            <img className="avatar_img user-avatar-circle-img" src={imagePath} alt=""></img>
            {user && <p>{user.FullName}</p>}
          </Col>
        </Row>
        <Row>
          <Col md={4}>
          <Button onClick={handleShow} variant="dark">Add Item</Button>
          <ItemModal show ={show} setShow={setShow} handleClose={handleClose} shopId={""}/>
          </Col>
          <Col md={8}>
              <div className="row" id="cards">
                    {items.map((item,index)=>{
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
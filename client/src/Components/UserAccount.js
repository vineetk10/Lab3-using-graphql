import React,{useEffect,useState,useContext} from 'react'
import Header from './Core/Header'
import {Container,Row,Col} from 'react-bootstrap'
import {Image,Pen,Heart,ShopWindow,Plus} from 'react-bootstrap-icons'
import {isAutheticated,signout} from '../auth/helper/authapicalls'
import "../css/UserAccount.css"
import { useHistory } from "react-router-dom";
import Cards from './Core/Card'
import ItemCard from "./ItemCard"
import { API } from "../backend";
import { SearchContext } from "../context/SearchContext";
import { DropdownButton,Dropdown } from 'react-bootstrap'
import { connect } from "react-redux";
const {user}= isAutheticated();

function UserAccount({search}) {
    // const { search } = useContext(SearchContext);
    const history = useHistory();
    const [items,setItems] = useState([]);
    const [sortBy, setSortBy] = useState("Price");
    const [lowerLimit, setLowerLimit] = useState(0);
    const [higherLimit, setHigherLimit] = useState(1000);
    
    const getMyProfile=()=>{
        history.push("/personProfile");
    }
    const getAllFavoriteItems = async(UserId) => {
        let it= await fetch(`${API}/GetAllFavoriteItems`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({UserId: UserId })
        })
        .then(response => {
        console.log(response);
        
        return response.json();
        })
        .then(jsonResponse=>{
        setItems(jsonResponse.items.favorite);
        return jsonResponse;
        })
        .catch(err => console.log(err));
    }
    const handleSelect=(e)=>{
        console.log(e);
        setSortBy(e);
      }
      const handleFilterSelect = (e)=>{
        const limits = e.split("-");
        setLowerLimit(limits[0]);
        setHigherLimit(limits[1]);
      }
useEffect(()=>{
    if(user)
      getAllFavoriteItems(user._id);
},[])
  return (
    <div>
    <Header/>
    <Container>
        <Row className='person_logo_name'>
            <Col md={4}>
                <Row>
                    <Col><Image className='rounded-circle' size={100}/></Col>
                    <Col>
                        <Row>
                            <Col className='person__name'>
                                {user.FullName} <Pen onClick={getMyProfile} size={20}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                0 followers     0 following
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            {search && search.length!==0 && 
                <>
                 <DropdownButton  variant="Secondary" id="dropdown-basic-button" title="Sort by:" onSelect={handleSelect}>
                  <Dropdown.Item eventKey="Price">Price</Dropdown.Item>
                  <Dropdown.Item eventKey="Quantity">Quantity</Dropdown.Item>
                  <Dropdown.Item eventKey="SalesCount">Sales Count</Dropdown.Item>
                </DropdownButton>
                <DropdownButton  variant="Secondary" id="dropdown-basic-button" title="Filter by:" onSelect={handleFilterSelect}>
                <Dropdown.Item eventKey="0-10000">0-10000</Dropdown.Item>
                  <Dropdown.Item eventKey="0-50">0-50</Dropdown.Item>
                  <Dropdown.Item eventKey="51-100">51-100</Dropdown.Item>
                  <Dropdown.Item eventKey="101-500">101-500</Dropdown.Item>
                  <Dropdown.Item eventKey="501-1000">501-1000</Dropdown.Item>
                  <Dropdown.Item eventKey="1001-10000">1001-10000</Dropdown.Item>
                </DropdownButton>
                </>
               
             }
        </Row>
        {/* <Row className='person_favorite'>
            <Col md={4}>
                <Row>
                <Col className='person_favorite_items position-relative'><Heart className="person_favorite_icon" size={30} color="black"/></Col>
                <Col className='person_favorite_shops'><ShopWindow className="person_favorite_icon" size={30} color="black"/></Col>
                <Col className='person_favorite_collection'><Plus className="person_favorite_icon" size={30} color="black"/></Col>
                </Row>
            </Col>
        </Row> */}
        <Row className='person_favorite_items'>
                <p>Favorites</p>
                {/* {items.map((item,index)=>{
                return(
                <div key={index} className="col-4 mb-4">
                    <ItemCard item={item} defaultIsFav={true}/>
                </div> )
                })} */}

{(!search || search.length===0) ? items.map((item,index)=>{
                        return(
                            <div key={index} className="col-4 mb-4">
                                <ItemCard item={item} defaultIsFav={true}/>
                             </div>   
                        )
                    }) : items.filter((item)=>item.itemName.toLowerCase().includes(search.toLowerCase()) && item.price>=lowerLimit && item.price<=higherLimit).sort((a,b)=>a[sortBy]-b[sortBy]).map((item,index)=>{
                      return(
                          <div key={index} className="col-4 mb-4">
                              <ItemCard item={item} defaultIsFav={true}/>
                           </div>   
                        )
                    })
                  }
        </Row>
    </Container>
    </div>
  )
}
const mapStateToProps = state => {
    return { search: state.search };
  };
  export default connect(mapStateToProps)(UserAccount)
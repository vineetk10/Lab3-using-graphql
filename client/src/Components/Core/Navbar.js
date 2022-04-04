import React,{useState,useContext, useEffect} from 'react'
import {Navbar,Nav,Container,FormControl,Button,NavDropdown} from 'react-bootstrap'
import { Heart,Bell, PersonCircle,Cart4,CaretDownFill,BoxArrowLeft, ShopWindow,Search } from 'react-bootstrap-icons';
import {isAutheticated,signout} from '../../auth/helper/authapicalls'
import "../../css/Navbar.css"
import SigninModal from '../SigninModal';
import { SearchContext } from "../../context/SearchContext";
import { CHANGE_SEARCH } from "../../context/action.types";
import { API } from "../../backend";
import { Link, Redirect,useHistory } from 'react-router-dom';
const {user}= isAutheticated();
function EtsyNavbar() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchText,setSearchText] = useState("");
    const { dispatch } = useContext(SearchContext);
    const [shop, setShop] = useState();
    const [item, setItem] = useState([]);
    const history = useHistory();
    const signUserOut = ()=>{
        signout();
        history.push("/");
        window.location.reload();
    }

    const handleSearch = (e)=>{
        if(e.key==="Enter" || !e.key){
            dispatch({
                type: CHANGE_SEARCH,
                payload: searchText
              });
        }
        else{
            setSearchText(e.target.value);
        }
    }
    const handleChange = event=>{
        setSearchText(event.target.value);
    }
    const getShopOfUser = ()=>{
         fetch(`${API}/GetShopOfUser`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({UserId: user.UserId })
          })
          .then(jsonResponse=>{
            // setShop(jsonResponse.items);
             return jsonResponse.json();
          })
          .then(jsonResponse=>{
              console.log(jsonResponse.shopId[0].ShopId);
            setShop(jsonResponse.shopId[0].ShopId);
             return jsonResponse;
          })
          .catch(err => console.log(err));
    }

    useEffect(()=>{
        // if(user)
        //     getShopOfUser();
    },[])
  return (
    <Navbar bg="light" variant="light">
        <Container>
            <Navbar.Brand href="#home">Etsy</Navbar.Brand>
                <Nav className="me-auto">
                <FormControl className="Navbar_Search me-2" type="search" placeholder="Search" aria-label="Search" onChange={handleChange} onKeyPress={handleSearch}/>
              <div>  <Search size={30} onClick={handleSearch}/></div>
                {user && user.token ?
                <>
                     <Nav.Link href="/person"><Heart size={30} color="black"/></Nav.Link>
                    {user && shop &&  <Nav.Link as={Link} to={{
        pathname: '/shopHome',
        state: { shopId: shop},
      }}><ShopWindow size={30} color="black"/></Nav.Link>}
                    <Nav.Link href="#pricing">
                        <span className='Navbar_Dropdown'>
                            <PersonCircle size={30} color="black"/>
                            <NavDropdown  id="basic-nav-dropdown">
                    
                                <NavDropdown.Item href="/person"><PersonCircle size={30} color="black"/> {user.FullName}</NavDropdown.Item>
                                <NavDropdown.Item href="/shop"><ShopWindow/> Create Shop</NavDropdown.Item>
                                <NavDropdown.Item onClick={signUserOut}><BoxArrowLeft/>  Sign out</NavDropdown.Item>
                            </NavDropdown>
                        </span>
                    </Nav.Link>
                    <Nav.Link href="/cart"><Cart4 size={30} color="black"/></Nav.Link>
                    
                    
                </>
               
                :
                <>
                    <Button variant="light" onClick={handleShow}>Sign in</Button>
                    {/* <Nav.Link href="#pricing"> */}
                            <Cart4 size={30} color="black"/>
                    {/* </Nav.Link> */}
                    <SigninModal show ={show} setShow={setShow} handleClose={handleClose}/>
                </>
                }
            </Nav>
        </Container>
  </Navbar>
  )
}

export default EtsyNavbar
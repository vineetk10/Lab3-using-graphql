import React,{useState,useEffect,useContext} from 'react'
import Header from './Core/Header'
import { API } from "../backend";
import ItemCard from "./ItemCard"
import { isAutheticated } from './../auth/helper/authapicalls';
import Footer from './Core/Footer';
import { SearchContext } from "../context/SearchContext";
import { DropdownButton,Dropdown } from 'react-bootstrap'
const {user} = isAutheticated();
function Home() {
  const { search } = useContext(SearchContext);
  const [items,setItems] = useState([]);
  const [sortBy, setSortBy] = useState("Price");
  const [lowerLimit, setLowerLimit] = useState(0);
  const [higherLimit, setHigherLimit] = useState(1000);

  const getAllItemsOfOtherShops = async(UserId) => {
    let it= await fetch(`${API}/GetAllItems`, {
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
      setItems(jsonResponse.items);
       return jsonResponse;
    })
    .catch(err => console.log(err));
  }
  const getAllItems = async() => {
    let it= await fetch(`${API}/GetAllItems`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      console.log(response);
      
      return response.json();
    })
    .then(jsonResponse=>{
      setItems(jsonResponse.items);
       return jsonResponse;
    })
    .catch(err => console.log(err));
  }
  useEffect(()=>{
    if(user)
      getAllItemsOfOtherShops(user.UserId);
    else
      getAllItems();
  },[])
  const handleSelect=(e)=>{
    console.log(e);
    setSortBy(e);
  }
  const handleFilterSelect = (e)=>{
    const limits = e.split("-");
    setLowerLimit(limits[0]);
    setHigherLimit(limits[1]);
  }
  return (
    <div className='Home'>
        <Header/>
        <div className="row" id="cards">
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
                    {(!search || search.length===0) ? items && items.map((item,index)=>{
                        return(
                            <div key={index} className="col-4 mb-4">
                                <ItemCard item={item}/>
                             </div>   
                        )
                    }) : items.filter((item)=>item.itemName.toLowerCase().includes(search.toLowerCase()) && item.price>=lowerLimit && item.price<=higherLimit).sort((a,b)=>a[sortBy]-b[sortBy]).map((item,index)=>{
                      return(
                          <div key={index} className="col-4 mb-4">
                              <ItemCard item={item}/>
                           </div>   
                        )
                    })
                  }
                </div>
                <br/>
           <Footer/>  
    </div>
  )
}

export default Home
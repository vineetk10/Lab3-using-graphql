import React,{useState,useEffect,useContext} from 'react'
import Header from './Core/Header'
import { API } from "../backend";
import ItemCard from "./ItemCard"
import { isAutheticated } from './../auth/helper/authapicalls';
import Footer from './Core/Footer';
import { SearchContext } from "../context/SearchContext";
import { DropdownButton,Dropdown } from 'react-bootstrap'
import { connect } from "react-redux";
import { useApolloClient } from '@apollo/client';
import {
  gql,
} from "@apollo/client";

const getAllItemsByQuery = gql`
query GetAllItems {
  items{
    isFavorite,
    itemDescription,
    itemImageUrl,
    itemName,
    price,
    quantity,
    salesCount
  }
}
`;


const getItemsOfOtherShops = gql`
query GetAllItemsOfOtherShops($UserId: ID!) {
  itemsOfOtherShops(UserId: $UserId){
    _id,
    isFavorite,
    itemDescription,
    itemImageUrl,
    itemName,
    price,
    quantity,
    salesCount
  }
}
`;

const {user} = isAutheticated();
function Home({search}) {
  // const { search } = useContext(SearchContext);
  const client = useApolloClient();
  console.log(client.link.options);
  const [items,setItems] = useState([]);
  const [sortBy, setSortBy] = useState("Price");
  const [lowerLimit, setLowerLimit] = useState(0);
  const [higherLimit, setHigherLimit] = useState(1000);

  const getAllItemsOfOtherShops = async(UserId) => {
    
    const {data} = await client.query({
      query: getItemsOfOtherShops,
      variables : {
            UserId: UserId
          }
    })
    setItems(data.itemsOfOtherShops);
  }
  const getAllItems = async() => {
    const { data } = await client.query({
      query: getAllItemsByQuery
    })
    setItems(data.items);
  }

  useEffect(()=>{
    if(user)
      getAllItemsOfOtherShops(user._id);
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

const mapStateToProps = state => {
  return { search: state.search };
};
export default connect(mapStateToProps)(Home);

// export default Home
import React, { useEffect, useState } from 'react'
import { API } from "../backend";
import { isAutheticated } from '../auth/helper/authapicalls'
import Header from './Core/Header';
import ItemCard from "./PurchasesCard"
import { Container } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useApolloClient } from '@apollo/client';
import {
  gql,
} from "@apollo/client";

const getPurchases = gql`
query GetAllPurchases($UserId: ID!) {
  purchases(UserId: $UserId){
    _id,
    orders {
      _id,
      orderDate,
      items{
        itemName,
        itemDescription,
        price,
        quantity,
        isFavorite,
        itemImageUrl,
        owner
    }
  }
  }
}
`;
function Purchases() {
  const client = useApolloClient();
  const { user } = isAutheticated();
  const [purchases, setPurchases] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const getAllPurchases = async (UserId) => {
    const { data } = await client.query({
      query: getPurchases,
      variables: {
        UserId: UserId
      }
    })

    setPurchases(data.purchases.orders);
    const endOffset = itemOffset + pageSize;
    setCurrentItems(data.purchases.orders.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.purchases.orders.length / pageSize));
  }
  const handlePageClick = (event) => {
    const newOffset = (event.selected * pageSize) % purchases.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const handleSelect = (e) => {
    console.log(e);
    setPageSize(e);
  }

  useEffect(() => {
    getAllPurchases(user._id);
  }, [itemOffset, pageSize])
  return (
    <>
      <div className="row" id="cards">
        <Header />
        <DropdownButton onSelect={handleSelect} variant="Secondary" id="dropdown-basic-button" title="Dropdown button">
          <Dropdown.Item eventKey="2">2</Dropdown.Item>
          <Dropdown.Item eventKey="5">5</Dropdown.Item>
          <Dropdown.Item eventKey="10">10</Dropdown.Item>
        </DropdownButton>
        {currentItems.map((order, index) => {
          return (<Container style={{ border: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <p>Order Date : {order.orderDate}</p>

            {order.items.map((item, index) => {
              return (
                <div key={index} className="col-4 mb-4">
                  <ItemCard addtoCart={false} item={item} />
                </div>
              )
            })}
          </Container>)
        })}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>

  )
}

export default Purchases
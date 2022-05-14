import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import "../css/Shop.css"
import { API } from "../backend";
import Header from "../Components/Core/Header"
import { useHistory } from 'react-router-dom'
import { isAutheticated } from '../auth/helper/authapicalls';
import {
  gql,
  useMutation
} from "@apollo/client";

const SaveShop = gql`
mutation ($userId: ID, $shopName: String) {
  saveShop(userId: $userId, shopName: $shopName ){
    successMessage
  }
}
`;
function Shop() {
  const [mutateFunction, { data, loading, error }] = useMutation(SaveShop);
  const { user } = isAutheticated();
  const [shopName, setShopName] = useState("");
  const history = useHistory();
  const CheckAvailability = async () => {
    let isAvailableJson = await fetch(`${API}/CheckAvailability`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ shopName: shopName })
    })
      .then(response => {
        return response.json();
      })
      .then(jsondata => {
        return jsondata
      })
      .catch(err => console.log(err));
    //   .then(jsondata => {
    //     return jsondata})

    if (!isAvailableJson.isAvailable)
      alert("Not Available");
    else
      alert("Available");
  }

  const SaveChanges = async () => {
    if (shopName.length > 0) {
      mutateFunction({
        variables: {
          userId: user._id,
          shopName: shopName
        }
      })
      if (error)
        console.log(`Submission error! ${error.message}`);
      history.push({
        pathname: "/shopHome"
      });
    }
  }
  const handleChange = name => event => {
    setShopName(event.target.value);
  }

  return (
    <div>
      <Header />
      <Container className="shop">
        <Row className="shop_heading">
          <Col>
            Name Your Shop
          </Col>
        </Row>
        <Row className="shop_nameTextbox">
          <Col md={4}>

          </Col>
          <Col md={2}>
            <input onChange={handleChange("shopName")} type="text"></input>
          </Col>
          <Col md={2}>
            <Button onClick={CheckAvailability} className="shop_nameTextbox_button" variant="light">Check Availability</Button>
          </Col>
          <Col md={4}>

          </Col>
        </Row>
        <Row>
          <Button onClick={SaveChanges} className="shop_nameTextbox_button" variant="dark">Save And Continue</Button>
        </Row>
      </Container>
    </div>
  )
}

export default Shop

import React, { useState } from 'react'
import { Modal, DropdownButton, Dropdown, Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
// import Create from '../teacher/CreateQuestionPaper';
import { isAutheticated, signin, authenticate } from './../auth/helper/authapicalls';
import { API } from "../backend";
import axios from 'axios'
import { useApolloClient } from '@apollo/client';
import {
    gql,
    useMutation
} from "@apollo/client";
// import { SaveItemString } from '../Components/mutation/mutation';
const SaveItemString = gql`
mutation ($UserId: ID, $Name: String,$Description: String, $Price:String, $Quantity: String) {
    addItem(UserId: $UserId, Name: $Name, Description:$Description, Price:$Price, Quantity:$Quantity, ){
    successMessage
  }
}
`;
const { user } = isAutheticated();

const ItemModal = ({ show, setShow, handleClose, shopId }) => {
    const [mutateFunction, { data, loading, error }] = useMutation(SaveItemString);
    const [myImage, setMyImage] = useState("https://www.etsy.com/images/avatars/default_avatar_400x400.png");
    // const client = useApolloClient();
    const [values, setValues] = useState({
        Name: "",
        Description: "",
        Price: "",
        Quantity: "",
        success: false,
        newCategory: "",
        error: {
            Name: "Name is compulsory",
            Description: "Description is compulsory",
        }
    })
    const [categories, setCategories] = useState(["Clothing", "Jewellery", "Entertainment", "Home Decor", "Art"]);
    const { Name, Description, Price, Quantity, success, newCategory } = values
    const [redirect, setRedirect] = useState(false);
    const { user } = isAutheticated();

    const getARedirect = (redirect) => {
        if (redirect) {
            return <Redirect to="/" />
        }
    }

    const handleChange = name => event => {
        let errors = values.error;
        errors[name] = event.target.value.length === 0 ? [name] + " is compulsory" : '';
        setValues({ ...values, [name]: event.target.value })
    }
    const onImageChange = event => {
        let img = event.target.files[0];
        setMyImage(img)
    }
    const ValidateSurveyEntries = (errors) => {
        let valid = true;
        Object.values(errors).forEach((val) => {
            if (val.length > 0 && valid) {
                valid = false;
            }
        })
        return valid;
    }

    const SaveItem = async (event) => {
        event.preventDefault();
        if (!ValidateSurveyEntries(values.error)) {
            console.log("Invalid form");
            return;
        }


        var formData = new FormData();
        formData.append('myImage', myImage);

        // axios
        //     .post(
        //         `${API}/SaveItem`, formData)
        //     .then((response) => {
        //         if (response.status == 201) {
        //             console.log(response);
        //             success("Data saved successfully");
        //         }
        //     })
        //     .catch((e) => console.log(e));
     
        mutateFunction({
            variables: {
                UserId: user._id,
                Name: Name,
                Description: Description,
                Price: Price,
                Quantity: Quantity
            }
        })
        if (error)
            console.log(`Submission error! ${error.message}`);

        handleClose();
    }
    const handleSelect = (e) => {
        console.log(e);
    }

    const AddCategory = () => {
        setCategories([...categories, newCategory]);
        setValues({ ...values, newCategory: "" })
    }
    return (

        <Modal show={show} onHide={handleClose}>
            {getARedirect(redirect)}
            <Modal.Header closeButton>
                <Modal.Title>Add Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id="form" enctype="multipart/form-data" method="post">
                    <div className="form-group">
                        <p>Name</p>
                        <input type="textbox" className="form-control" onChange={handleChange("Name")} />
                        <br />
                    </div>
                    {/* <div class="form-group form-inline">                            
        <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
    </div> */}
                    <div className="form-group form-inline">
                        <label for="exampleInputEmail1">Choose Image </label>
                        <input type="file" name="myImage" onChange={(e) => onImageChange(e)} />
                    </div>
                    <br />
                    <DropdownButton variant="Secondary" id="dropdown-basic-button" title="Choose Category" onSelect={handleSelect}>
                        {categories.map((category) => {
                            return <Dropdown.Item eventKey={category}>{category}</Dropdown.Item>
                        })}
                        {/* <Dropdown.Item eventKey="Clothing">Clothing</Dropdown.Item>
                        <Dropdown.Item eventKey="Jewellery">Jewellery</Dropdown.Item>
                        <Dropdown.Item eventKey="Entertainment">Entertainment</Dropdown.Item>
                        <Dropdown.Item eventKey="Home Decor">Home Decor</Dropdown.Item>
                        <Dropdown.Item eventKey="Art">Art</Dropdown.Item> */}
                    </DropdownButton>
                    <br />
                    <span><input type="textbox" className="form-control" onChange={handleChange("newCategory")} /></span><Button onClick={AddCategory}>Add Category</Button>
                    <div className="form-group">
                        <p>Description</p>
                        <input type="textbox" className="form-control" onChange={handleChange("Description")} />
                        <br />
                    </div>
                    <div className="form-group">
                        <p>Price</p>
                        <input type="textbox" className="form-control" onChange={handleChange("Price")} />
                        <br />
                    </div>
                    <div className="form-group">
                        <p>Quantity</p>
                        <input type="textbox" className="form-control" onChange={handleChange("Quantity")} />
                        <br />
                    </div>
                    <input type="submit" onClick={SaveItem} value="Create new item"></input>
                </form>
            </Modal.Body>
            <Modal.Footer>
                {/* <button onClick={SaveItem} className="btn btn-warning rounded">Add Item</button> */}
            </Modal.Footer>
        </Modal>
    )
}

export default ItemModal;
import React,{useState} from 'react'
import { Modal,DropdownButton,Dropdown } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
// import Create from '../teacher/CreateQuestionPaper';
import { isAutheticated,signin,authenticate } from './../auth/helper/authapicalls';
import { API } from "../backend";
import axios from 'axios'
const EditItemModal = ({show,setShow,handleClose,item})=>{
    const [myImage,setMyImage] = useState(item.ItemImage);
    const [values,setValues] = useState({
        Name: item?item.itemName:"",
        Description: item?item.itemDescription:"",
        Price: item?item.price:"",
        Quantity: item?item.quantity:"",
        success: false,
        error: {
            Name: "",
            Description: "",
        }
    })

    const {Name,Description,Price,Quantity,success} = values
    const [redirect,setRedirect] = useState(false);
    const {user} = isAutheticated()

    const getARedirect =(redirect)=>{
        if(redirect){
          return <Redirect to="/" />
        }
      }

      const handleChange = name => event => {
        let errors = values.error;
        errors[name] =  event.target.value.length === 0 ? [name]+" is compulsory" : '';
        setValues({...values,[name]:event.target.value})
    }
    const onImageChange = event => {
          let img = event.target.files[0];
          setMyImage(img)
    }
    const ValidateSurveyEntries = (errors)=>{
        let valid = true;
        Object.values(errors).forEach((val)=>{
            if(val.length>0 && valid){
                valid = false;
            }
        })
        return valid;
    }

    const SaveItem = async(event)=>{
        event.preventDefault();
        if(!ValidateSurveyEntries(values.error))
        {
            console.log("Invalid form");
            return;
        }
        var formData = new FormData();
        var fileField = document.querySelector("input[type='file']");

        formData.append('UserId', user._id);
        formData.append('Name', Name);
        formData.append('Description', Description);
        formData.append('Price', Price);
        formData.append('Quantity', Quantity);
        formData.append('ItemId', item.itemId);
        formData.append('myImage', myImage);

        axios
     .post(
        `${API}/EditItem`,formData )
     .then((response) => {
       if (response.status == 201) {
         console.log(response);
         success("Data saved successfully");
       }
     })
     .catch((e) => console.log(e));
        
    handleClose();
}
    const handleSelect=(e)=>{
        console.log(e);
      }

    return(
        
    <Modal show={show} onHide={handleClose}>
        {getARedirect(redirect)}
                <Modal.Header closeButton>
                <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form id="form" enctype="multipart/form-data" method="post">
                    <div className="form-group">
                        <p>Name</p>
                        <input type="textbox" value={Name} className="form-control" onChange={handleChange("Name")}/>
                        <br/>
                    </div>
                    {/* <div class="form-group form-inline">                            
        <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
    </div> */}
                    <div className="form-group form-inline">
                        <label for="exampleInputEmail1">Choose Image </label>
                        <input type="file" name="myImage" onChange={(e)=>onImageChange(e)}/>
                    </div>
                    <br/>
                    <DropdownButton  variant="Secondary" id="dropdown-basic-button" title="Choose Category" onSelect={handleSelect}>
                        <Dropdown.Item eventKey="Clothing">Clothing</Dropdown.Item>
                        <Dropdown.Item eventKey="Jewellery">Jewellery</Dropdown.Item>
                        <Dropdown.Item eventKey="Entertainment">Entertainment</Dropdown.Item>
                        <Dropdown.Item eventKey="Home Decor">Home Decor</Dropdown.Item>
                        <Dropdown.Item eventKey="Art">Art</Dropdown.Item>
                    </DropdownButton>
                    <div className="form-group">
                        <p>Description</p>
                        <input type="textbox" value={Description} className="form-control" onChange={handleChange("Description")}/>
                        <br/>
                    </div>
                    <div className="form-group">
                        <p>Price</p>
                        <input type="textbox" value={Price} className="form-control" onChange={handleChange("Price")}/>
                        <br/>
                    </div>
                    <div className="form-group">
                        <p>Quantity</p>
                        <input type="textbox" value={Quantity} className="form-control" onChange={handleChange("Quantity")}/>
                        <br/>
                    </div>
                    <input type="submit" onClick={SaveItem} value="Edit Item"></input>
                </form>
                </Modal.Body>
                <Modal.Footer>
                {/* <button onClick={SaveItem} className="btn btn-warning rounded">Add Item</button> */}
                </Modal.Footer>
        </Modal>
    )
} 

export default EditItemModal;
import React,{useState} from 'react'
import { Modal,DropdownButton,Dropdown, Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
// import Create from '../teacher/CreateQuestionPaper';
import { isAutheticated,signin,authenticate } from '../auth/helper/authapicalls';
import { API } from "../backend";
import axios from 'axios'
const {user} = isAutheticated();
const ShopModal = ({show,setShow,handleClose,shopId})=>{
    const [myImage,setMyImage] = useState("https://www.etsy.com/images/avatars/default_avatar_400x400.png");
    const [redirect,setRedirect] = useState(false);
    const {user} = isAutheticated()

    const getARedirect =(redirect)=>{
        if(redirect){
          return <Redirect to="/" />
        }
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

    const EditShop = async(event)=>{
        event.preventDefault();
        
        var formData = new FormData();
        var fileField = document.querySelector("input[type='file']");
        formData.append('UserId', user._id);
        formData.append('myImage', myImage);

        axios
     .post(
        `${API}/EditShop`,formData )
     .then((response) => {
       if (response.status == 201) {
         console.log(response);
       }
     })
     .catch((e) => console.log(e));
        
    handleClose();
}
    
    return(
        
    <Modal show={show} onHide={handleClose}>
        {getARedirect(redirect)}
                <Modal.Header closeButton>
                <Modal.Title>Edit Shop</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form id="form" enctype="multipart/form-data" method="post">
                   
                    <div className="form-group form-inline">
                        <label for="exampleInputEmail1">Choose Image </label>
                        <input type="file" name="myImage" onChange={(e)=>onImageChange(e)}/>
                    </div>
                    <br/>
                    
                    <input type="submit" onClick={EditShop} value="Edit Shop"></input>
                </form>
                </Modal.Body>
                <Modal.Footer>
                {/* <button onClick={SaveItem} className="btn btn-warning rounded">Add Item</button> */}
                </Modal.Footer>
        </Modal>
    )
} 

export default ShopModal;
import React,{useState} from 'react'
import { Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
// import Create from '../teacher/CreateQuestionPaper';
import { isAutheticated,signin,authenticate } from './../auth/helper/authapicalls';

const ChangeNameModal = ({show,setShow,handleClose})=>{
    const [values,setValues] = useState({
        FirstName: "",
        LastName: "",
        success: false,
        error: {
            FirstName: "FirstName is compulsory",
            LastName: "LastName is compulsory",
        }
    })

    const {FirstName,LastName,success} = values
    const [redirect,setRedirect] = useState(false);
    const {user} = isAutheticated()

    const getARedirect =(redirect)=>{
        if(redirect){
          return <Redirect to="/personProfile" />
        }
      }

      const handleChange = name => event => {
        let errors = values.error;
        errors[name] =  event.target.value.length === 0 ? [name]+" is compulsory" : '';
        setValues({...values,[name]:event.target.value})
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

    const SaveChanges = event=>{
        if(!ValidateSurveyEntries(values.error))
        {
            console.log("Invalid form");
            return;
        }
        // ModifyName({FirstName:FirstName, LastName:LastName})
        // .then(data =>{
        //     if(data.error){
        //       setValues({...values,error:data.error,loading:false})
        //       console.log(data.error)
        //     }else{
        //         setRedirect(true);
        //         setShow(false);
        //         console.log("sign in successful")
        //     }
        //   })
        //   .catch(err=>console.log(err))
    }

    return(
        
    <Modal show={show} onHide={handleClose}>
        {getARedirect(redirect)}
                <Modal.Header closeButton>
                <Modal.Title>Sign in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    <div className="form-group">
                        <p>First Name</p>
                        <input type="textbox" className="form-control" onChange={handleChange("FirstName")}/>
                        <br/>
                    </div>
                    <div className="form-group">
                        <p>Last Name</p>
                        <input type="textbox" className="form-control" onChange={handleChange("LastName")}/>
                        <br/>
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                <button onClick={SaveChanges} className="btn btn-warning rounded">Save Changes</button>
                </Modal.Footer>
        </Modal>
    )
} 

export default ChangeNameModal;
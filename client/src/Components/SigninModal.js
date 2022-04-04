import React,{useState} from 'react'
import { Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
// import Create from '../teacher/CreateQuestionPaper';
import { isAutheticated,signin,authenticate,signup } from './../auth/helper/authapicalls';

const SigninModal = ({show,setShow,handleClose})=>{
    const [values,setValues] = useState({
        Email: "",
        UserPassword: "",
        Name:"",
        success: false,
        error: {
            Email: "Email is compulsory",
            UserPassword: "UserPassword is compulsory",
        }
    })
    const [isSignIn, setIsSignIn] = useState(true);
    const {Email,UserPassword,Name,success} = values
    const [redirect,setRedirect] = useState(false);
    const {user} = isAutheticated()

    const getARedirect =(redirect)=>{
        if(redirect){
          return <Redirect to="/"/>
        }
      }

      const handleChange = name => event => {
        // let errors = values.error;
        // errors[name] =  event.target.value.length === 0 ? [name]+" is compulsory" : '';
        setValues({...values,[name]:event.target.value})
    }
    const handleRegister = ()=>{
        setIsSignIn(false);
    }

    const handleSignIn = ()=>{
        setIsSignIn(true);
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

    const signIn = event=>{
        // if(!ValidateSurveyEntries(values.error))
        // {
        //     console.log("Invalid form");
        //     return;
        // }
        signin({email:Email, password:UserPassword})
        .then(data =>{
            if(data.error){
              setValues({...values,error:data.error,loading:false})
              console.log(data.error)
              alert(data.error)
            }else{
              authenticate(data,() => {
                setRedirect(true);
                setShow(false);
                handleClose();
                window.location.reload();
              })
            }
          })
          .catch(err=>console.log(err))
    }

    const register = event=>{
        // if(!ValidateSurveyEntries(values.error))
        // {
        //     console.log("Invalid form");
        //     return;
        // }
        signup({fullName: Name,email:Email, encry_password:UserPassword})
        .then(data =>{
            if(data.error){
              setValues({...values,error:data.error,loading:false})
              console.log(data.error)
            }else{
                setIsSignIn(true);
                console.log("sign up successful")
            }
          })
          .catch(err=>console.log(err))
    }

    return(
        
    <Modal show={show} onHide={handleClose}>
        {getARedirect(redirect)}
                <Modal.Header closeButton>
                <Modal.Title> </Modal.Title>
                <button onClick={handleSignIn} className="btn btn-warning rounded">SignIn</button>
                </Modal.Header>
                <Modal.Body>
                <form>
                    {!isSignIn && <div className="form-group">
                        <p>Full Name</p>
                        <input type="textbox" className="form-control" onChange={handleChange("Name")}/>
                        <br/>
                    </div>}
                    <div className="form-group">
                        <p>Email address</p>
                        <input type="textbox" className="form-control" onChange={handleChange("Email")}/>
                        <br/>
                    </div>
                    <div className="form-group">
                        <p>Password</p>
                        <input type="password" className="form-control" onChange={handleChange("UserPassword")}/>
                        <br/>
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                   {isSignIn && <p onClick={handleRegister}>Register</p>}
                {isSignIn ? <button onClick={signIn} className="btn btn-warning rounded">Sign in</button>
                :  <button onClick={register} className="btn btn-warning rounded">Register</button>}
                </Modal.Footer>
        </Modal>
    )
} 

export default SigninModal;
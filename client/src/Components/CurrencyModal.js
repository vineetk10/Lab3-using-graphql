import React,{useState,useMemo,useContext} from 'react'
import { Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { isAutheticated,signin,authenticate,signup } from './../auth/helper/authapicalls';
import getAllISOCodes from 'iso-country-currency'
import { CurrencyContext} from "../context/CurrencyContext";
import { CHANGE_CURRENCY } from "../context/action.types";
const CurrencyModal = ({show,setShow,handleClose})=>{
    const [values,setValues] = useState({
        success: false,
        error: {
            
        }
    })
    const { currency, dispatch1} = useContext(CurrencyContext);

    const [redirect,setRedirect] = useState(false);
    const {user} = isAutheticated()
    const options = useMemo(() => countryList().getData(), [])
    const currencies = getAllISOCodes.getAllISOCodes()
    const newCurr = currencies.map((curr)=>{
        return {value: curr.symbol, label: curr.symbol+" "+curr.countryName+" ("+curr.currency+")"};
    })
    const getARedirect =(redirect)=>{
        if(redirect){
          return <Redirect to="/" />
        }
      }

      const handleCurrency = event => {
            dispatch1({
                type: CHANGE_CURRENCY,
                payload: event.value
              });
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

   

    return(
        
    <Modal show={show} onHide={handleClose}>
        {getARedirect(redirect)}
                <Modal.Header closeButton>
                <Modal.Title>Select Currency</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>Select Currency: <span><Select options={newCurr}  onChange={handleCurrency} /></span></p>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
        </Modal>
    )
} 

export default CurrencyModal;
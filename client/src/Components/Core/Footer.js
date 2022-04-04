import React,{useState} from 'react'
import "../../css/Footer.css"
import CurrencyModal from '../CurrencyModal';
function Footer() {
  const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <div className="footer">
        <span onClick={handleShow} className="">&nbsp; United States &nbsp; | &nbsp; English (US) &nbsp; | &nbsp; $ (USD)</span>
        <CurrencyModal show ={show} setShow={setShow} handleClose={handleClose}/>
    </div>
  )
}

export default Footer
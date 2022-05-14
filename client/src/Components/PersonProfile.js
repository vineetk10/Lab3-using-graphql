import React, { useState, useMemo } from 'react'
import Header from './Core/Header'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { isAutheticated, signout } from '../auth/helper/authapicalls'
import ChangeNameModal from './ChangeNameModal';
import countryList from 'react-select-country-list'
import Select from 'react-select'
import { API } from "../backend";
import "../css/PersonProfile.css"
import axios from 'axios'
import {
    gql,
    useMutation
  } from "@apollo/client";
  
  const SaveUserInfo = gql`
  mutation ($UserId: ID, $Gender: String,$Country: String,$City: String,$BirthdayMonth: String,$BirthdayYear: String,$About: String) {
    saveUser(UserId: $UserId, Gender: $Gender, Country: $Country, City:$City, BirthdayMonth:$BirthdayMonth, BirthdayYear: $BirthdayYear, About: $About ){
      successMessage
    }
  }
  `;
const { user } = isAutheticated();
function PersonProfile() {
    const [mutateFunction, { data, loading, error }] = useMutation(SaveUserInfo);
    const [myImage, setMyImage] = useState("https://www.etsy.com/images/avatars/default_avatar_400x400.png");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [sendImage, setSendImage] = useState();
    const options = useMemo(() => countryList().getData(), [])
    // const [gender, setGender] = useState('private');

    const onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setSendImage(img)
            setMyImage(URL.createObjectURL(img))
        }
    };

    const [values, setValues] = useState({
        gender: "",
        country: "",
        city: "",
        month: "",
        day: "",
        about: "",
        favorite: ""
        // UserPassword: "",
        // success: false,
        // error: {
        //     Email: "Email is compulsory",
        //     UserPassword: "UserPassword is compulsory",
        // }
    })
    const { gender, country, city, month, day, about, favorite } = values
    const handleChange = name => event => {
        // let errors = values.error;
        // errors[name] =  event.target.value.length === 0 ? [name]+" is compulsory" : '';
        if (event.target)
            setValues({ ...values, [name]: event.target.value })
        else
            setValues({ ...values, [name]: event.label })
    }

    const SaveUser = async (event) => {
        mutateFunction({
            variables: {
                UserId: user._id,
                Gender: gender,
                Country: country,
                City: city,
                BirthdayMonth: month,
                BirthdayYear: day,
                About: about,

            }
        })
        if (error)
            console.log(`Submission error! ${error.message}`);

        // var formData = new FormData();

        // formData.append('UserId', user._id);
        // formData.append('Gender', gender);
        // formData.append('Country', country);
        // formData.append('City', city);
        // formData.append('BirthdayMonth', month);
        // formData.append('BirthdayYear', day);
        // formData.append('About', about);
        // formData.append('myImage', sendImage);
    }
    return (
        <div>
            <Header />
            <form id="form" enctype="multipart/form-data" method="post">
                <div className='personProfile_Details'>
                    <div className="personProfile_Details_Heading">
                        <p>Your Public Profile</p>
                        <p>View Profile</p>
                    </div>
                    <Container className="square border border-2 personProfile_Details_Info">
                        <Row className="personProfile_Details_Info_Heading">
                            <Col>
                                <p>Profile Picture <span>
                                    {/* <img src={this.state.image} /> */}
                                    <input type="file" name="myImage" onChange={(e) => onImageChange(e)} />
                                </span></p>
                            </Col>
                        </Row>
                        <Row className="personProfile_Details_Info_ProfilePic">
                            <a className="avatar user-avatar-circle">
                                <img className="avatar_img user-avatar-circle-img" src={myImage} alt="vineet Karmiani"></img>
                            </a>
                            <p>Must be a .jpg, .gif or .png file smaller than 10MB and at least 400px by 400px.</p>
                            <hr
                                style={{
                                    color: 'black',
                                    backgroundColor: 'black',
                                    height: 1.5
                                }}
                            />
                        </Row>
                        <Row>
                            <div className="input-group" id="name" role="group" aria-labelledby="your-name-label">
                                <label className="label your-name-label">Your Name </label>
                                <p className="full-name">{user.FullName}
                                    <a onClick={handleShow} className="request-name-change overlay-trigger" href="#namechange-overlay" rel="#namechange-overlay" aria-describedby="your-name-label">Change or remove</a>
                                </p>
                            </div>
                            <hr style={{ color: 'black', backgroundColor: 'black', height: 1.5 }} />
                        </Row>
                        <Row>
                            <div className="input-group gender registration-hidden" onChange={handleChange("gender")} role="group" aria-labelledby="gender-group-label">
                                <label className="label" id="gender-group-label">Gender</label>
                                <div className="radio-group" id="gender">
                                    <input type="radio" value="female" name="gender" id="female" />
                                    <label for="female">Female</label>
                                    <input type="radio" value="male" name="gender" id="male" />
                                    <label for="male">Male</label>
                                    <input type="radio" value="private" name="gender" id="private" />
                                    <label for="private">Rather not say</label>
                                    <input type="radio" name="gender" id="custom" />
                                    <label for="custom">Custom</label>
                                    <input type="text" name="gender" id="custom_gender" maxlength="64" aria-label="enter custom gender" disabled="" className="hidden text" />
                                </div>
                            </div>
                            <hr style={{ color: 'black', backgroundColor: 'black', height: 1.5 }} />
                        </Row>
                        <Row>
                            <div className="input-group location-city">
                                <label>City</label>
                                <div>
                                    <input type="text" onChange={handleChange("city")}></input>
                                </div>
                            </div>
                            <p>Select Country: <span><Select options={options} onChange={handleChange("country")} /></span></p>
                            <div >
                                Start typing and choose from a suggested city to help others find you.
                            </div>
                            <hr style={{ color: 'black', backgroundColor: 'black', height: 1.5 }} />
                        </Row>
                        <Row>
                            <div className="input-group registration-hidden" role="group" aria-labelledby="birthday-group-label">
                                <label className="label" id="birthday-group-label">Birthday</label>
                                <span id="birthday-group">
                                    <select id="birth-month" name="birth-month" aria-label="Month" onChange={handleChange("month")}>
                                        <option value="">- month -</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>

                                    <select id="birth-day" name="birth-day" aria-label="Day" onChange={handleChange("day")}>
                                        <option value="">- day -</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                        <option value="25">25</option>
                                        <option value="26">26</option>
                                        <option value="27">27</option>
                                        <option value="28">28</option>
                                        <option value="29">29</option>
                                        <option value="30">30</option>
                                        <option value="31">31</option>
                                    </select>
                                </span>
                                <span className="inline-input-error-message" id="birthday-error">
                                    Please enter a valid birth date.</span>
                            </div>
                            <hr style={{ color: 'black', backgroundColor: 'black', height: 1.5 }} />
                        </Row>
                        <Row>
                            <div className="input-group">
                                <label className="label" for="bio">About</label>
                                <textarea onChange={handleChange("about")} className="bio text text-wide" id="bio" aria-describedby="bio-disclaimer"></textarea>
                                <p className="inline-message">
                                    <span id="bio-disclaimer">Tell people a little about yourself.</span>
                                    <span className="inline-input-error-message" id="bio-length-error">
                                        Your entry is too long. Please shorten it to fewer than 20,000
                                        characters.
                                    </span>
                                </p>
                            </div>
                            <hr style={{ color: 'black', backgroundColor: 'black', height: 1.5 }} />
                        </Row>
                        <Row>
                            <div className="input-group">
                                <label className="label" for="bio">Favorite Materials</label>
                                <textarea onChange={handleChange("favorite")} className="bio text text-wide" id="bio" aria-describedby="bio-disclaimer"></textarea>
                                <p className="inline-message">
                                    <span id="bio-disclaimer">Share up to 13 materials that you like. Separate each material with a comma.</span>
                                    <span className="inline-input-error-message" id="bio-length-error">
                                        Your entry is too long. Please shorten it to fewer than 20,000
                                        characters.
                                    </span>
                                </p>
                            </div>
                        </Row>
                    </Container>
                    <Button onClick={SaveUser} className="personProfile_Button" variant="dark">Save Changes</Button>
                    <ChangeNameModal show={show} setShow={setShow} handleClose={handleClose} />
                </div>
            </form>


        </div>
    )
}

export default PersonProfile
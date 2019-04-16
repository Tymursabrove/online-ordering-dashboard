import React, { Component } from 'react';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import './NameAddress.css'; 
import axios from 'axios';
import apis from "../../../apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class NameAddress extends Component {

  constructor(props) {
    super(props);

    this.handleRestaurantNameChange = this.handleRestaurantNameChange.bind(this);
    this.handleRestaurantPhoneNumber = this.handleRestaurantPhoneNumber.bind(this);
    this.handleRestaurantStreet = this.handleRestaurantStreet.bind(this);
    this.handleRestaurantCounty = this.handleRestaurantCounty.bind(this);
    this.handleRestaurantCity = this.handleRestaurantCity.bind(this);
    this.handleRestaurantPostalCode = this.handleRestaurantPostalCode.bind(this);
    this.handleRestaurantCountry = this.handleRestaurantCountry.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      _id: "",
      catererName: "",
      isNameEmpty: false,
      catererPhoneNumber: "",
      isPhoneNumberEmpty: false,
      catererStreet: "",
      isStreetEmpty: false,
      catererCity: "",
      isCityEmpty: false,
      catererPostalCode: "",
      catererCounty: "",
      isCountyEmpty: false,
      catererCountry: "",
      isCountryEmpty: false,
      isNextButtonActive: false,
      isProceedButtonVisible: false,
      isSaving: false,
    };

    this.CountyData  = [
      "Dublin",
      "Cork",
      "Limerick",      
      "Galway",
      "Waterford",
      "Antrim",
      "Armagh",
      "Carlow",
      "Cavan",
      "Clare",
      "Cork",
      "Donegal",
      "Down",
      "Fermanagh",
      "Kerry",
      "Kildare",
      "Kilkenny",
      "Laois",
      "Leitrim",
      "Londonderry",
      "Longford",
      "Louth",
      "Mayo",
      "Meath",
      "Monaghan",
      "Offaly",
      "Roscommon",
      "Sligo",
      "Tipperary",
      "Tyrone",
      "Westmeath",
      "Wexford",
      "Wicklow",
    ];

    this.CountryData  = [
      {
        "code": "+7 840",
        "value": "Abkhazia"
      },
      {
        "code": "+93",
        "value": "Afghanistan"
      },
      {
        "code": "+355",
        "value": "Albania"
      },
      {
        "code": "+213",
        "value": "Algeria"
      },
      {
        "code": "+1 684",
        "value": "American Samoa"
      },
      {
        "code": "+376",
        "value": "Andorra"
      },
      {
        "code": "+244",
        "value": "Angola"
      },
      {
        "code": "+1 264",
        "value": "Anguilla"
      },
      {
        "code": "+1 268",
        "value": "Antigua and Barbuda"
      },
      {
        "code": "+54",
        "value": "Argentina"
      },
      {
        "code": "+374",
        "value": "Armenia"
      },
      {
        "code": "+297",
        "value": "Aruba"
      },
      {
        "code": "+247",
        "value": "Ascension"
      },
      {
        "code": "+61",
        "value": "Australia"
      },
      {
        "code": "+672",
        "value": "Australian External Territories"
      },
      {
        "code": "+43",
        "value": "Austria"
      },
      {
        "code": "+994",
        "value": "Azerbaijan"
      },
      {
        "code": "+1 242",
        "value": "Bahamas"
      },
      {
        "code": "+973",
        "value": "Bahrain"
      },
      {
        "code": "+880",
        "value": "Bangladesh"
      },
      {
        "code": "+1 246",
        "value": "Barbados"
      },
      {
        "code": "+1 268",
        "value": "Barbuda"
      },
      {
        "code": "+375",
        "value": "Belarus"
      },
      {
        "code": "+32",
        "value": "Belgium"
      },
      {
        "code": "+501",
        "value": "Belize"
      },
      {
        "code": "+229",
        "value": "Benin"
      },
      {
        "code": "+1 441",
        "value": "Bermuda"
      },
      {
        "code": "+975",
        "value": "Bhutan"
      },
      {
        "code": "+591",
        "value": "Bolivia"
      },
      {
        "code": "+387",
        "value": "Bosnia and Herzegovina"
      },
      {
        "code": "+267",
        "value": "Botswana"
      },
      {
        "code": "+55",
        "value": "Brazil"
      },
      {
        "code": "+246",
        "value": "British Indian Ocean Territory"
      },
      {
        "code": "+1 284",
        "value": "British Virgin Islands"
      },
      {
        "code": "+673",
        "value": "Brunei"
      },
      {
        "code": "+359",
        "value": "Bulgaria"
      },
      {
        "code": "+226",
        "value": "Burkina Faso"
      },
      {
        "code": "+257",
        "value": "Burundi"
      },
      {
        "code": "+855",
        "value": "Cambodia"
      },
      {
        "code": "+237",
        "value": "Cameroon"
      },
      {
        "code": "+1",
        "value": "Canada"
      },
      {
        "code": "+238",
        "value": "Cape Verde"
      },
      {
        "code": "+ 345",
        "value": "Cayman Islands"
      },
      {
        "code": "+236",
        "value": "Central African Republic"
      },
      {
        "code": "+235",
        "value": "Chad"
      },
      {
        "code": "+56",
        "value": "Chile"
      },
      {
        "code": "+86",
        "value": "China"
      },
      {
        "code": "+61",
        "value": "Christmas Island"
      },
      {
        "code": "+61",
        "value": "Cocos-Keeling Islands"
      },
      {
        "code": "+57",
        "value": "Colombia"
      },
      {
        "code": "+269",
        "value": "Comoros"
      },
      {
        "code": "+242",
        "value": "Congo"
      },
      {
        "code": "+243",
        "value": "Congo, Dem. Rep. of (Zaire)"
      },
      {
        "code": "+682",
        "value": "Cook Islands"
      },
      {
        "code": "+506",
        "value": "Costa Rica"
      },
      {
        "code": "+385",
        "value": "Croatia"
      },
      {
        "code": "+53",
        "value": "Cuba"
      },
      {
        "code": "+599",
        "value": "Curacao"
      },
      {
        "code": "+537",
        "value": "Cyprus"
      },
      {
        "code": "+420",
        "value": "Czech Republic"
      },
      {
        "code": "+45",
        "value": "Denmark"
      },
      {
        "code": "+246",
        "value": "Diego Garcia"
      },
      {
        "code": "+253",
        "value": "Djibouti"
      },
      {
        "code": "+1 767",
        "value": "Dominica"
      },
      {
        "code": "+1 809",
        "value": "Dominican Republic"
      },
      {
        "code": "+670",
        "value": "East Timor"
      },
      {
        "code": "+56",
        "value": "Easter Island"
      },
      {
        "code": "+593",
        "value": "Ecuador"
      },
      {
        "code": "+20",
        "value": "Egypt"
      },
      {
        "code": "+503",
        "value": "El Salvador"
      },
      {
        "code": "+240",
        "value": "Equatorial Guinea"
      },
      {
        "code": "+291",
        "value": "Eritrea"
      },
      {
        "code": "+372",
        "value": "Estonia"
      },
      {
        "code": "+251",
        "value": "Ethiopia"
      },
      {
        "code": "+500",
        "value": "Falkland Islands"
      },
      {
        "code": "+298",
        "value": "Faroe Islands"
      },
      {
        "code": "+679",
        "value": "Fiji"
      },
      {
        "code": "+358",
        "value": "Finland"
      },
      {
        "code": "+33",
        "value": "France"
      },
      {
        "code": "+596",
        "value": "French Antilles"
      },
      {
        "code": "+594",
        "value": "French Guiana"
      },
      {
        "code": "+689",
        "value": "French Polynesia"
      },
      {
        "code": "+241",
        "value": "Gabon"
      },
      {
        "code": "+220",
        "value": "Gambia"
      },
      {
        "code": "+995",
        "value": "Georgia"
      },
      {
        "code": "+49",
        "value": "Germany"
      },
      {
        "code": "+233",
        "value": "Ghana"
      },
      {
        "code": "+350",
        "value": "Gibraltar"
      },
      {
        "code": "+30",
        "value": "Greece"
      },
      {
        "code": "+299",
        "value": "Greenland"
      },
      {
        "code": "+1 473",
        "value": "Grenada"
      },
      {
        "code": "+590",
        "value": "Guadeloupe"
      },
      {
        "code": "+1 671",
        "value": "Guam"
      },
      {
        "code": "+502",
        "value": "Guatemala"
      },
      {
        "code": "+224",
        "value": "Guinea"
      },
      {
        "code": "+245",
        "value": "Guinea-Bissau"
      },
      {
        "code": "+595",
        "value": "Guyana"
      },
      {
        "code": "+509",
        "value": "Haiti"
      },
      {
        "code": "+504",
        "value": "Honduras"
      },
      {
        "code": "+852",
        "value": "Hong Kong SAR China"
      },
      {
        "code": "+36",
        "value": "Hungary"
      },
      {
        "code": "+354",
        "value": "Iceland"
      },
      {
        "code": "+91",
        "value": "India"
      },
      {
        "code": "+62",
        "value": "Indonesia"
      },
      {
        "code": "+98",
        "value": "Iran"
      },
      {
        "code": "+964",
        "value": "Iraq"
      },
      {
        "code": "+353",
        "value": "Ireland"
      },
      {
        "code": "+972",
        "value": "Israel"
      },
      {
        "code": "+39",
        "value": "Italy"
      },
      {
        "code": "+225",
        "value": "Ivory Coast"
      },
      {
        "code": "+1 876",
        "value": "Jamaica"
      },
      {
        "code": "+81",
        "value": "Japan"
      },
      {
        "code": "+962",
        "value": "Jordan"
      },
      {
        "code": "+7 7",
        "value": "Kazakhstan"
      },
      {
        "code": "+254",
        "value": "Kenya"
      },
      {
        "code": "+686",
        "value": "Kiribati"
      },
      {
        "code": "+965",
        "value": "Kuwait"
      },
      {
        "code": "+996",
        "value": "Kyrgyzstan"
      },
      {
        "code": "+856",
        "value": "Laos"
      },
      {
        "code": "+371",
        "value": "Latvia"
      },
      {
        "code": "+961",
        "value": "Lebanon"
      },
      {
        "code": "+266",
        "value": "Lesotho"
      },
      {
        "code": "+231",
        "value": "Liberia"
      },
      {
        "code": "+218",
        "value": "Libya"
      },
      {
        "code": "+423",
        "value": "Liechtenstein"
      },
      {
        "code": "+370",
        "value": "Lithuania"
      },
      {
        "code": "+352",
        "value": "Luxembourg"
      },
      {
        "code": "+853",
        "value": "Macau SAR China"
      },
      {
        "code": "+389",
        "value": "Macedonia"
      },
      {
        "code": "+261",
        "value": "Madagascar"
      },
      {
        "code": "+265",
        "value": "Malawi"
      },
      {
        "code": "+60",
        "value": "Malaysia"
      },
      {
        "code": "+960",
        "value": "Maldives"
      },
      {
        "code": "+223",
        "value": "Mali"
      },
      {
        "code": "+356",
        "value": "Malta"
      },
      {
        "code": "+692",
        "value": "Marshall Islands"
      },
      {
        "code": "+596",
        "value": "Martinique"
      },
      {
        "code": "+222",
        "value": "Mauritania"
      },
      {
        "code": "+230",
        "value": "Mauritius"
      },
      {
        "code": "+262",
        "value": "Mayotte"
      },
      {
        "code": "+52",
        "value": "Mexico"
      },
      {
        "code": "+691",
        "value": "Micronesia"
      },
      {
        "code": "+1 808",
        "value": "Midway Island"
      },
      {
        "code": "+373",
        "value": "Moldova"
      },
      {
        "code": "+377",
        "value": "Monaco"
      },
      {
        "code": "+976",
        "value": "Mongolia"
      },
      {
        "code": "+382",
        "value": "Montenegro"
      },
      {
        "code": "+1664",
        "value": "Montserrat"
      },
      {
        "code": "+212",
        "value": "Morocco"
      },
      {
        "code": "+95",
        "value": "Myanmar"
      },
      {
        "code": "+264",
        "value": "Namibia"
      },
      {
        "code": "+674",
        "value": "Nauru"
      },
      {
        "code": "+977",
        "value": "Nepal"
      },
      {
        "code": "+31",
        "value": "Netherlands"
      },
      {
        "code": "+599",
        "value": "Netherlands Antilles"
      },
      {
        "code": "+1 869",
        "value": "Nevis"
      },
      {
        "code": "+687",
        "value": "New Caledonia"
      },
      {
        "code": "+64",
        "value": "New Zealand"
      },
      {
        "code": "+505",
        "value": "Nicaragua"
      },
      {
        "code": "+227",
        "value": "Niger"
      },
      {
        "code": "+234",
        "value": "Nigeria"
      },
      {
        "code": "+683",
        "value": "Niue"
      },
      {
        "code": "+672",
        "value": "Norfolk Island"
      },
      {
        "code": "+850",
        "value": "North Korea"
      },
      {
        "code": "+1 670",
        "value": "Northern Mariana Islands"
      },
      {
        "code": "+47",
        "value": "Norway"
      },
      {
        "code": "+968",
        "value": "Oman"
      },
      {
        "code": "+92",
        "value": "Pakistan"
      },
      {
        "code": "+680",
        "value": "Palau"
      },
      {
        "code": "+970",
        "value": "Palestinian Territory"
      },
      {
        "code": "+507",
        "value": "Panama"
      },
      {
        "code": "+675",
        "value": "Papua New Guinea"
      },
      {
        "code": "+595",
        "value": "Paraguay"
      },
      {
        "code": "+51",
        "value": "Peru"
      },
      {
        "code": "+63",
        "value": "Philippines"
      },
      {
        "code": "+48",
        "value": "Poland"
      },
      {
        "code": "+351",
        "value": "Portugal"
      },
      {
        "code": "+1 787",
        "value": "Puerto Rico"
      },
      {
        "code": "+974",
        "value": "Qatar"
      },
      {
        "code": "+262",
        "value": "Reunion"
      },
      {
        "code": "+40",
        "value": "Romania"
      },
      {
        "code": "+7",
        "value": "Russia"
      },
      {
        "code": "+250",
        "value": "Rwanda"
      },
      {
        "code": "+685",
        "value": "Samoa"
      },
      {
        "code": "+378",
        "value": "San Marino"
      },
      {
        "code": "+966",
        "value": "Saudi Arabia"
      },
      {
        "code": "+221",
        "value": "Senegal"
      },
      {
        "code": "+381",
        "value": "Serbia"
      },
      {
        "code": "+248",
        "value": "Seychelles"
      },
      {
        "code": "+232",
        "value": "Sierra Leone"
      },
      {
        "code": "+65",
        "value": "Singapore"
      },
      {
        "code": "+421",
        "value": "Slovakia"
      },
      {
        "code": "+386",
        "value": "Slovenia"
      },
      {
        "code": "+677",
        "value": "Solomon Islands"
      },
      {
        "code": "+27",
        "value": "South Africa"
      },
      {
        "code": "+500",
        "value": "South Georgia and the South Sandwich Islands"
      },
      {
        "code": "+82",
        "value": "South Korea"
      },
      {
        "code": "+34",
        "value": "Spain"
      },
      {
        "code": "+94",
        "value": "Sri Lanka"
      },
      {
        "code": "+249",
        "value": "Sudan"
      },
      {
        "code": "+597",
        "value": "Suriname"
      },
      {
        "code": "+268",
        "value": "Swaziland"
      },
      {
        "code": "+46",
        "value": "Sweden"
      },
      {
        "code": "+41",
        "value": "Switzerland"
      },
      {
        "code": "+963",
        "value": "Syria"
      },
      {
        "code": "+886",
        "value": "Taiwan"
      },
      {
        "code": "+992",
        "value": "Tajikistan"
      },
      {
        "code": "+255",
        "value": "Tanzania"
      },
      {
        "code": "+66",
        "value": "Thailand"
      },
      {
        "code": "+670",
        "value": "Timor Leste"
      },
      {
        "code": "+228",
        "value": "Togo"
      },
      {
        "code": "+690",
        "value": "Tokelau"
      },
      {
        "code": "+676",
        "value": "Tonga"
      },
      {
        "code": "+1 868",
        "value": "Trinidad and Tobago"
      },
      {
        "code": "+216",
        "value": "Tunisia"
      },
      {
        "code": "+90",
        "value": "Turkey"
      },
      {
        "code": "+993",
        "value": "Turkmenistan"
      },
      {
        "code": "+1 649",
        "value": "Turks and Caicos Islands"
      },
      {
        "code": "+688",
        "value": "Tuvalu"
      },
      {
        "code": "+1 340",
        "value": "U.S. Virgin Islands"
      },
      {
        "code": "+256",
        "value": "Uganda"
      },
      {
        "code": "+380",
        "value": "Ukraine"
      },
      {
        "code": "+971",
        "value": "United Arab Emirates"
      },
      {
        "code": "+44",
        "value": "United Kingdom"
      },
      {
        "code": "+1",
        "value": "United States"
      },
      {
        "code": "+598",
        "value": "Uruguay"
      },
      {
        "code": "+998",
        "value": "Uzbekistan"
      },
      {
        "code": "+678",
        "value": "Vanuatu"
      },
      {
        "code": "+58",
        "value": "Venezuela"
      },
      {
        "code": "+84",
        "value": "Vietnam"
      },
      {
        "code": "+1 808",
        "value": "Wake Island"
      },
      {
        "code": "+681",
        "value": "Wallis and Futuna"
      },
      {
        "code": "+967",
        "value": "Yemen"
      },
      {
        "code": "+260",
        "value": "Zambia"
      },
      {
        "code": "+255",
        "value": "Zanzibar"
      },
      {
        "code": "+263",
        "value": "Zimbabwe"
      }
    ];

  }

  handleRestaurantNameChange(e) {
    this.setState({ 
      catererName: e.target.value,
      isNameEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantPhoneNumber(e) {
    if(isNaN(e.target.value)){
      //Letters
    }
    else if (e.target.value.includes("+") || e.target.value.includes("-") || e.target.value.includes(".")) {
      //Letters
    }
    else {
      //Valid Number
      this.setState({ 
        catererPhoneNumber: e.target.value,
        isPhoneNumberEmpty: e.target.value == "" ? true : false
      },() => {
        this.checkAllInput()
      })
    }
  }
  
  handleRestaurantStreet(e) {
    this.setState({ 
      catererStreet: e.target.value,
      isStreetEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantCounty(e) {
    this.setState({ 
      catererCounty: e.target.value,
      isCountyEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantCity(e) {
    this.setState({ 
      catererCity: e.target.value,
      isCityEmpty: e.target.value == "" ? true : false
    },() => {
      this.checkAllInput()
    })
  }

  handleRestaurantPostalCode(e) {
    this.setState({ catererPostalCode: e.target.value });
  }

  handleRestaurantCountry(e) {
    this.setState({ 
      catererCountry: e.target.value, 
      isCountryEmpty: e.target.value == "" ? true : false,
    },() => {
      this.checkAllInput()
    })
  }

  checkAllInput = () => {
    const {catererName, catererPhoneNumber, catererStreet, catererCity, catererCounty, catererCountry} = this.state
    if (catererName != "" && catererPhoneNumber != "" && catererStreet != "" && catererCity != "" && catererCounty != "" && catererCountry != "") {
      //Activate Next Button
      this.setState({ 
        isNextButtonActive: true, 
      });
    }
    else {
      this.setState({ 
        isNextButtonActive: false, 
      });
    }
  }

  handleSave() {

    this.setState({
      isSaving: true,
    })

    const {catererName, catererPhoneNumber, catererStreet, catererCity, catererCounty, catererCountry, catererPostalCode, _id} = this.state

    var phoneNumber;
    var fulladdress;

    //Phone number format
    var countrycode = catererCountry.split("+")[1];
    var firstchar = catererPhoneNumber.charAt(0);
    if (firstchar === '0') {
      phoneNumber = catererPhoneNumber.slice( 1 );
    }
    else {
      phoneNumber = catererPhoneNumber.slice();
    }
    phoneNumber = '+' + countrycode + phoneNumber

    //Full address format
    fulladdress = catererStreet + ', ' + catererCity + ', ' + catererCounty + ', ' + catererPostalCode + ', ' + catererCountry.split("+")[0];
    
    //Data to be saved
    var data = {
      catererName: catererName,
      catererPhoneNumber: phoneNumber,
      catererAddress: fulladdress,
      catererCity: catererCity,
      catererCounty: catererCounty,
      catererCountry: catererCountry.split("+")[0]
    }
   // alert(JSON.stringify(data))

    var headers = {
      'Content-Type': 'application/json',
      //'Authorization': jwtToken,
    }

    var url = apis.UPDATEcaterer;

    if (_id !== "") {
      url = url + +"?_id=" + _id;
    }

    axios.put(url, data, {headers: headers})
      .then((response) => {
        if (response.status === 201) {
          toast(<SuccessInfo/>, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
          this.setState({
            isProceedButtonVisible: true,
            isSaving: false,
          })
        }
      })
      .catch((error) => {
        //alert("error updating! " + error)
        toast(<ErrorInfo/>, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        this.setState({
          isSaving: false,
        })
      });
  }

  handleProceed = () => {
    this.props.history.push('/caterer/basics/description')
  }

  render() {
    const {isNameEmpty, isPhoneNumberEmpty, isStreetEmpty, isCityEmpty, isCountyEmpty, isCountryEmpty, isNextButtonActive, isProceedButtonVisible, isSaving, addressManual} = this.state

    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" md="6">
            <Card >
              <CardHeader>
                <strong>What's your business name & address?</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="company">Restaurant *</Label>
                  <Input style={{color: 'black'}} value={this.state.catererName} onChange={(e) => this.handleRestaurantNameChange(e)} type="text" id="company" placeholder="Enter your restaurant name" invalid={isNameEmpty ? true : false} />
                  <FormFeedback>Please enter your restaurant name</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="telephone">Phone Number *</Label>
                  <Input style={{color: 'black'}} value={this.state.catererPhoneNumber} onChange={(e) => this.handleRestaurantPhoneNumber(e)} type="text" id="telephone" placeholder="Enter your restaurant phone number (e.g: 0831456789)" invalid={isPhoneNumberEmpty ? true : false}/>
                  <FormFeedback>Please enter your phone number</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="street">Street *</Label>
                  <Input style={{color: 'black'}} value={this.state.catererStreet} onChange={(e) => this.handleRestaurantStreet(e)} type="text" id="street" placeholder="Enter street name" invalid={isStreetEmpty ? true : false}/>
                  <FormFeedback>Please enter restaurant street name</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="county">County *</Label>
                  <Input value={this.state.catererCounty} onChange={(e) => this.handleRestaurantCounty(e)} style={{color: this.state.catererCounty == "" ? 'grey': 'black'}} type="select" name="select" id="select" invalid={isCountyEmpty ? true : false}>
                  <option value='' disabled>Select County</option>
                  {this.CountyData.map(county =>
                    <option style={{color:'black'}} key={county} value={county}>{county}</option>
                  )}
                  </Input>
                </FormGroup>
                <FormGroup row className="my-0">
                  <Col xs="8">
                    <FormGroup>
                      <Label htmlFor="city">City *</Label>
                      <Input style={{color: 'black'}} value={this.state.catererCity} onChange={(e) => this.handleRestaurantCity(e)} type="text" id="city" placeholder="Enter your city" invalid={isCityEmpty ? true : false}/>
                      <FormFeedback>Please enter your restaurant based city</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input style={{color: 'black'}} value={this.state.catererPostalCode} onChange={(e) => this.handleRestaurantPostalCode(e)} type="text" id="postal-code" placeholder="Postal Code"/>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="country">Country *</Label>
                  <Input value={this.state.catererCountry} onChange={(e) => this.handleRestaurantCountry(e)} style={{color: this.state.catererCountry == "" ? 'grey': 'black'}} type="select" name="select" id="select" invalid={isCountryEmpty ? true : false}>
                  <option value='' disabled>Select Country</option>
                  {this.CountryData.map(country =>
                    <option style={{color:'black'}} key={country.value} value={country.value+""+country.code}>{country.value} {country.code}</option>
                  )}
                  </Input>
                </FormGroup>

                <div className="form-actions">
                  {isProceedButtonVisible ? 
                  <Button style={{marginLeft:10}} onClick={() => this.handleProceed()} className="float-right" color="success">Proceed</Button>
                  : null}
                  <Button disabled={isNextButtonActive? false : true} onClick={this.handleSave} className="float-right" type="submit" color="primary">{isSaving ? "Saving..." : "Save" }</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer hideProgressBar/>
      </div>
    );
  }
}

const SuccessInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/checked.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'green'}}>Successfully Saved</b>
   
  </div>
)

const ErrorInfo = ({ closeToast }) => (
  <div>
    <img style={ { marginLeft:10, objectFit:'cover', width: 25, height: 25 }} src={require("../../../assets/img/cancel.png")} />

     <b style={{marginLeft:10, marginTop:5, color: 'red'}}>Error saving data. Please try again</b>
   
  </div>
)

export default NameAddress;

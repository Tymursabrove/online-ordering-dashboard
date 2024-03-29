import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Label,
  FormGroup,
  UncontrolledDropdown,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Table,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Collapse,
} from "reactstrap";
import './CatererDetail.css'
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import Dotdotdot from "react-dotdotdot";
import ContentLoader, { Facebook } from "react-content-loader";
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import StarRatingComponent from "react-star-rating-component";
import axios from "axios";
import apis from "../../../apis";

const glutenfreeIcon = require('../../../assets/img/glutenfree1.png');
const hotIcon = require('../../../assets/img/fire.png');
const spicyIcon = require('../../../assets/img/pepper.png');
const vegeIcon = require('../../../assets/img/lettuce.png');
const healthyIcon = require('../../../assets/img/fruit.png');
const halalicon = require('../../../assets/img/halalsign.png');
const closeIcon = require('../../../assets/img/close.png');

class CatererDetail extends Component {
  constructor(props) {
    super(props);

    this.refObj = {}

    this.toggleMenuModal = this.toggleMenuModal.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleSpecialInstruction = this.handleSpecialInstruction.bind(this);

    this.state = {
      todayDay: null,
      loading: true,
      cartloading: true,
      orderType: "delivery",
      updateCartItem: false,
      selectedPrice: 0,
      selectedSelection: [],
      selectedQuantity: 1,
      activeMenu: null,
      specialInstructionOpen: false,
      specialInstruction: '',
      menuModalOpen: false,
      selectedMenu: "All Menu",
      menuDropDownOpen: false,
      fetchedmenu: [],
      menu: [],
      menutitle: [],
      cartitem: [],
      cartToBeOrder: [],
      review: [
        {
          name: "Kieran",
          location: 'Limerick, Ireland',
          comment: "Everyone was very happy. Hearty sandwiches. Very nice dessert sandwiches",
          time: "5 days ago",
          rating: 5,
        },
        {
          name: "Qiana",
          location: 'Dublin, Ireland',
          comment: "The food smelled pretty good and staff seemed excited because they eat there on their own time. The only downside is they delivered 45 mins. early, which is better than being late. I guess it didn't matter much since we did sandwiches and not something that would be bad if it got cold (i.e., pasta or other hot entree).",
          time: "7 days ago",
          rating: 4,
        },
        {
          name: "Aldo",
          location: 'Limerick, Ireland',
          comment: "Food is on time, great experience, food is delicious",
          time: "8 days ago",
          rating: 5,
        },
        {
          name: "Connie",
          location: 'Limerick, Ireland',
          comment: "The food was delicious and the presentation looked great. Perfect portions. We will order again!",
          time: "15 days ago",
          rating: 4,
        },
        {
          name: "Chandra",
          location: 'Limerick, Ireland',
          comment: "First time ordering from Italian Gourmet for this group. Everything was a big hit--even though they were a bit early.",
          time: "1 month ago",
          rating: 5,
        },
      ],
      quantity: [1,2,3,4,5,6,7,8,9,10,11,12,13],
      restaurantInfo: {
        /*catererID: "",
        catererName: "Flannery Restaurant & Pub",
        profilesrc: "https://www.psdgraphics.com/wp-content/uploads/2016/08/restaurant-logo.png",
        coversrc: "http://www.fedracongressi.com/fedra/wp-content/uploads/2016/09/minisandwich.jpg",
        catererDescrip: "Specialized in American Burger style mealset. Our American subs are our specialty, and our Special Grileld with spiced capicola and prosciuttini is the number one customer favorite. Our portions won't leave your stomachs rumbling, and our flavors always go down easy.",
        catererAddress: "30, O'Connell St, Dublin, Ireland",
        rating: "4.7",
        numofreview: "150",
        deliveryhours: "Mon-Fri: 10am-3pm",
        deliveryfee: 3,
        minimumspend: 50*/
      },
      orderNotOverMinSpending: false
    };
  }

  componentDidMount() {
    this.getCatererDetail();
    this.getCatererMenu();

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];

    this.setState({
      todayDay: dayName
    });
  }

  restructureMenu = () => {
    var finalresult = [];

    var result = this.state.fetchedmenu.reduce(function(r, a) {
      r[a.categorytag] = r[a.categorytag] || [];
      r[a.categorytag].push(a);
      return r;
    }, Object.create(null));

    for (var key in result) {
      var result2 = result[key].reduce(function(r, a) {
        r[a.categoryname] = r[a.categoryname] || [];
        r[a.categoryname].push(a);
        return r;
      }, Object.create(null));

      var parentObject = {
        menutitle: key,
        menuitem: []
      };

      for (var key2 in result2) {
        var childObject = {
          categoryname: key2,
          items: result2[key2]
        };
        parentObject["menuitem"].push(childObject);
      }

      finalresult.push(parentObject);
    }

    console.log(JSON.stringify(finalresult));

    this.setState({
      menu: finalresult,
      loading: false,
    },() => {
      this.listmenu()
    })
  }

  
  listmenu = () => {
    var menu = this.state.menu
    var menutitleArray = ["All Menu"];
    for (let i = 0; i < menu.length; i++) { 
      var menutitle = menu[i].menutitle
      menutitleArray.push(menutitle)
    }
    this.setState({
      menutitle: menutitleArray
    })
  }

  getCatererDetail= () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETcaterer;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          var restaurantInfo = this.state.restaurantInfo
          restaurantInfo.catererID = response.data[0]._id;
          restaurantInfo.catererName = typeof response.data[0].catererName !== 'undefined' ? response.data[0].catererName : "";
          restaurantInfo.profilesrc = typeof response.data[0].profilesrc !== 'undefined' ? response.data[0].profilesrc : "";
          restaurantInfo.coversrc = typeof response.data[0].coversrc !== 'undefined' ? response.data[0].coversrc : "https://stmed.net/sites/default/files/food-wallpapers-28249-101905.jpg";
          restaurantInfo.catererAddress = typeof response.data[0].catererAddress !== 'undefined' ? response.data[0].catererAddress : "";
          restaurantInfo.rating = typeof response.data[0].rating !== 'undefined' ? response.data[0].rating : 0;
          restaurantInfo.numofreview = typeof response.data[0].numofreview !== 'undefined' ? response.data[0].numofreview : 0;
          restaurantInfo.deliveryfee = typeof response.data[0].deliveryfee !== 'undefined' ? response.data[0].deliveryfee : 0;
          restaurantInfo.minimumspend = typeof response.data[0].minimumspend !== 'undefined' ? response.data[0].minimumspend : 0;
          restaurantInfo.deliveryhours = typeof response.data[0].deliveryhours !== 'undefined' ? response.data[0].deliveryhours : [];
          this.setState({
            restaurantInfo: restaurantInfo
          })
        } 
      })
      .catch((error) => {
      });
  }

  getCatererMenu= () => {
    var headers = {
      'Content-Type': 'application/json',
    }

    var url = apis.GETmenu;

    axios.get(url, {withCredentials: true}, {headers: headers})
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            fetchedmenu: response.data,
          },() => {
            this.restructureMenu();
          })
        } 
      })
      .catch((error) => {
      });
  }

  signIn(e) {
    e.preventDefault();
    this.props.history.push("/login");
  }

  navItemClicked = selectedMenu => {
    this.setState({
      selectedMenu: selectedMenu,
      menuDropDownOpen: false
    }, () => {
      var index = this.state.menu.findIndex(x => x.menutitle === selectedMenu);
      if (index > 0) {
        this.refObj[index].current.scrollIntoView({behavior: 'smooth'});
      }
    })
  };

  selectOrderType = (orderType) => {
    this.setState({
      orderType,
    },() => {
      this.calculateCartTotalPrice()
    })
  }

  menuItemClicked = (_id) => {
    var menuindex = this.state.fetchedmenu.findIndex(x => x._id==_id);
    this.setState({
      menuModalOpen: !this.state.menuModalOpen,
      activeMenu: this.state.fetchedmenu[menuindex]
    });
  };

  cartItemClicked = (_id, quantity, selection, totalprice, instruction) => {
    var menuindex = this.state.fetchedmenu.findIndex(x => x._id==_id);
    this.setState({
      menuModalOpen: !this.state.menuModalOpen,
      activeMenu: this.state.fetchedmenu[menuindex],
      selectedPrice: totalprice,
      selectedSelection: typeof selection === 'undefined' ? [] : selection,
      selectedQuantity: quantity,
      specialInstructionOpen: typeof instruction === 'undefined' ? false : true,
      specialInstruction: typeof instruction === 'undefined' ? '' : instruction,
      updateCartItem: true,
    });
  };

  checkOutClicked = (previewVal) => {
    if (previewVal) {
      alert("Items Checked Out!")
    }
  }

  toggleCuisineDropDown = () => {
    this.setState({
      menuDropDownOpen: !this.state.menuDropDownOpen
    });
  };

  toggleMenuModal() {
    this.setState({
      menuModalOpen: !this.state.menuModalOpen,
      selectedPrice: 0,
      selectedSelection: [],
      selectedQuantity: 1,
      specialInstructionOpen: false,
      specialInstruction: '',
      updateCartItem: false,
    });
  }

  toggleSpecialInstruction = () => {
    this.setState({
      specialInstructionOpen: !this.state.specialInstructionOpen
    });
  };

  findIcon = (iconname) => {
    var iconPath;
    if (iconname == 'Hot') { iconPath = hotIcon }
    else if (iconname == 'Spicy') { iconPath = spicyIcon }
    else if (iconname == 'Halal') { iconPath = halalicon }
    else if (iconname == 'Gluten Free') { iconPath = glutenfreeIcon }
    else if (iconname == 'Vegetarian') { iconPath = vegeIcon }
    else if (iconname == 'Healthy') { iconPath = healthyIcon }
    return iconPath
  }

  calculateCartTotalPrice = () => {
    const {cartitem, orderType, restaurantInfo, fetchedmenu} = this.state

    var cartTotalPrice = 0;

    for (let i = 0; i < cartitem.length; i++) { 
      cartTotalPrice =  cartTotalPrice + cartitem[i].totalprice;
    }


    if (orderType === "delivery") {
      cartTotalPrice =  cartTotalPrice + restaurantInfo.deliveryfee
    }

    return (Number(cartTotalPrice).toFixed(2));
  }

  calculatePricePerPerson = (bulkprice, serves) => {
    return (Number(bulkprice/serves).toFixed(2));
  }

  calculateMenuTotalPrice = (priceperunit) => {
    const {selectedQuantity, selectedSelection, selectedPrice} = this.state
    var totalprice = selectedPrice;
    var totalSelectedSelectionPrice = 0;

    for (let i = 0; i < selectedSelection.length; i++) { 
      for (let x = 0; x < selectedSelection[i].selectionitem.length; x++) { 
        totalSelectedSelectionPrice =  totalSelectedSelectionPrice + selectedSelection[i].selectionitem[x].selectionitemprice;
      } 
    }

    priceperunit = priceperunit + totalSelectedSelectionPrice;
    totalprice = priceperunit * selectedQuantity;
  
    this.setState({
      selectedPrice: totalprice
    })
  }


  findSelectionIndex = (selectioncategory, selectionitemtitle) => {
    var returnval;
    var index = this.state.selectedSelection.findIndex(x => x.selectioncategory==selectioncategory);

    if (index >= 0) {
      var itemindex = this.state.selectedSelection[index].selectionitem.findIndex(x => x.selectionitemtitle==selectionitemtitle)
      if (itemindex >= 0) {
        returnval = true
      }
      else {
        returnval = false
      }
    }
    else {
      returnval = false
    }
    return (returnval)
  }

  findQuantityRange = (minimumquantity) => {
    var index = this.state.quantity.findIndex(x => x==minimumquantity);
    var quantityrange = this.state.quantity.slice(index, this.state.quantity.length)
    return quantityrange
  }
 
  handleQuantityChange(e, priceperunit) {
    this.setState({ 
      selectedQuantity: e.target.value, 
    } ,() => {
      this.calculateMenuTotalPrice(priceperunit)
    })
  }

  handleSpecialInstruction(e) {
    this.setState({ 
      specialInstruction: e.target.value, 
    })
  }

  addToCart = () => {
    const {selectedPrice, selectedSelection, selectedQuantity, activeMenu, specialInstruction} = this.state;
 
    var addToCartItem = {
      _id: activeMenu._id,
      quantity: selectedQuantity,
      title: activeMenu.title,
      serveperunit: activeMenu.serveperunit,
      totalprice: selectedPrice === 0 ? activeMenu.priceperunit : selectedPrice,
    }

    if (specialInstruction !== '') {
      addToCartItem.instruction = specialInstruction
    }

    if (selectedSelection.length !== 0) {
      addToCartItem.selection = selectedSelection
    }

    var newCartItem = this.state.cartitem;
    newCartItem.push(addToCartItem);

    this.setState({
      cartitem: newCartItem
    },() => {
      this.toggleMenuModal()
    })
  }

  deleteCart = (index) => {

    this.setState({
      cartloading: true
    })
    
    const {selectedPrice, selectedSelection, selectedQuantity, activeMenu, specialInstruction, cartToBeOrder, orderType, restaurantInfo} = this.state;

    var newCartItem = this.state.cartitem.slice();
    newCartItem.splice(index, 1)

    this.setState({
      cartitem: newCartItem
    },() => {
      this.toggleMenuModal()
    })
  };

  updateCart = () => {
    const {selectedPrice, selectedSelection, selectedQuantity, activeMenu, specialInstruction} = this.state;

    var index = this.state.cartitem.findIndex(x => x._id==activeMenu._id);

    var updateCartItem = {
      _id: activeMenu._id,
      quantity: selectedQuantity,
      title: activeMenu.title,
      serveperunit: activeMenu.serveperunit,
      totalprice: selectedPrice === 0 ? activeMenu.priceperunit : selectedPrice,
    }

    if (specialInstruction !== '') {
      updateCartItem.instruction = specialInstruction
    }

    if (selectedSelection.length !== 0) {
      updateCartItem.selection = selectedSelection
    }

    var newCartItem = this.state.cartitem;
    newCartItem.splice(index, 1, updateCartItem)

    this.setState({
      cartitem: newCartItem
    },() => {
      this.toggleMenuModal()
    })
  }

  handleRadioBoxChange = (e, selectioncategory, selectionitemtitle, selectionitemprice, priceperunit) => {

    var selectedSelection = this.state.selectedSelection
    var index = selectedSelection.findIndex(x => x.selectioncategory==selectioncategory);

    if (index >=0) {
      var addSelectionItem = {
        selectionitemtitle: selectionitemtitle,
        selectionitemprice: selectionitemprice,
      }
      selectedSelection[index].selectionitem.splice(0, 1)
      selectedSelection[index].selectionitem.push(addSelectionItem)
    }
    else {
      var addSelection = {
        selectioncategory: selectioncategory,
        selectionitem: [
          {
            selectionitemtitle: selectionitemtitle,
            selectionitemprice: selectionitemprice,
          }
        ]
      }
      selectedSelection.push(addSelection) 
    }

    this.setState({ 
      selectedSelection: selectedSelection, 
    } ,() => {
      this.calculateMenuTotalPrice(priceperunit)
    })
  }

  checkBoxFull = (selectionmaxnum, selectioncategory) => {
    var returnval = false;
    var selectedSelection = this.state.selectedSelection
    var index = selectedSelection.findIndex(x => x.selectioncategory==selectioncategory);

    if (index >= 0) {
      if (selectedSelection[index].selectionitem.length === selectionmaxnum) {
        returnval = true
      }
    }

    return returnval;
  }

  handleCheckBoxChange = (e, selectioncategory, selectionmaxnum, selectionitemtitle, selectionitemprice, priceperunit) => {

    var selectedSelection = this.state.selectedSelection
    var index = selectedSelection.findIndex(x => x.selectioncategory==selectioncategory);

    //If selectioncategory exist
    if (index >=0) {
      var selectionitemindex = selectedSelection[index].selectionitem.findIndex(x => x.selectionitemtitle==selectionitemtitle);

      //If selectionitemtitle exist, uncheck
      if (selectionitemindex >=0) {
        selectedSelection[index].selectionitem.splice(selectionitemindex, 1)

        if (selectedSelection[index].selectionitem.length === 0) {
          selectedSelection.splice(index, 1)
        }
      }
      //If selectionitemtitle not exist, check
      else {
        var addSelectionItem = {
            selectionitemtitle: selectionitemtitle,
            selectionitemprice: selectionitemprice,
        }
        if (selectedSelection[index].selectionitem.length < selectionmaxnum) {
          selectedSelection[index].selectionitem.push(addSelectionItem)
        }
      }
    }
    //If selectioncategory not exist
    else {
      var addSelection = {
        selectioncategory: selectioncategory,
        selectionmaxnum: selectionmaxnum,
        selectionitem: [
          {
            selectionitemtitle: selectionitemtitle,
            selectionitemprice: selectionitemprice,
          }
        ]
      }
      selectedSelection.push(addSelection)
    }

    this.setState({ 
      selectedSelection: selectedSelection, 
    } ,() => {
      this.calculateMenuTotalPrice(priceperunit)
    })
  }

 
  renderNavItem() {

    var itemsarray = [];

    var menutitle = this.state.menutitle;

    for (let i = 0; i < menutitle.length; i++) {
      if(i > 4 && i < menutitle.length) {
        itemsarray.push(
          <NavItem>
            <UncontrolledDropdown
              nav
              isOpen={this.state.menuDropDownOpen}
              toggle={() => {
                this.toggleCuisineDropDown();
              }}
            >
              <DropdownToggle
                style={{
                  fontWeight: "600",
                  color:
                    this.state.menutitle
                      .slice(5, menutitle.length)
                      .includes(this.state.selectedMenu) ||
                    this.state.menuDropDownOpen
                      ? "#20a8d8"
                      : "black",
                  backgroundColor: "white",
                  fontSize: 15
                }}
                nav
                caret
              >
                {this.state.menutitle
                  .slice(5, menutitle.length)
                  .includes(this.state.selectedMenu)
                  ? this.state.selectedMenu
                  : "More"}
              </DropdownToggle>
              <DropdownMenu right style={{ right: "auto" }}>
                <Table style={{ margin: 0 }} borderless>
                  <tbody>{this.renderMoreMenu(5, 12)}</tbody>
                </Table>
              </DropdownMenu>
            </UncontrolledDropdown>
            <div
              style={{
                height: 2,
                width: "100%",
                backgroundColor: this.state.menutitle
                  .slice(5, menutitle.length)
                  .includes(this.state.selectedMenu)
                  ? "#20a8d8"
                  : "transparent"
              }}
            />
          </NavItem>
        )
        break
      }
      else {
        itemsarray.push(
          <NavItem>
            <NavLink
              onClick={() => this.navItemClicked(menutitle[i])}
              style={{
                paddingRight: 20,
                paddingLeft: menutitle[i] === "All Menu" ? 0 : 20,
                fontWeight: "600",
                color: this.state.selectedMenu === menutitle[i] ? "#20a8d8" : "black",
                fontSize: 15
              }}
              href="#"
            >
              {" "}
              {menutitle[i]}
            </NavLink>
            <div
              style={{
                height: 2,
                width: "100%",
                backgroundColor:
                  this.state.selectedMenu === menutitle[i] ? "#20a8d8" : "transparent"
              }}
            />
          </NavItem>
        );
      }
    }

    return  <Nav className="float-left" pills>{itemsarray}</Nav>;

  }

  renderMoreMenu(startindex, lastindex) {
    var itemsarray = [];

    var menutitle = this.state.menutitle;

    for (let i = startindex; i < lastindex; i++) {
      itemsarray.push(
        <td>
          <Button
            onClick={() => this.navItemClicked(menutitle[i])}
            block
            color="ghost-link"
          >
            {menutitle[i]}
          </Button>
        </td>
      );
    }

    return <tr>{itemsarray}</tr>;
  }

  /////////////////////////////////////////Menu Modal Rendering//////////////////////////////////////////////////////////////

  renderMenuModal() {

    var activeMenu = this.state.activeMenu

    return (
      <Modal isOpen={this.state.menuModalOpen} toggle={this.toggleMenuModal}>
        <ModalBody>
          <b style={{ color: "#20a8d8", fontSize: 19 }}>{activeMenu.title}</b>

          <p style={{ fontWeight: '700', marginTop:10, fontSize: 14, opacity: 0.8}}>Serves: <b style={{color: 'green'}}>{activeMenu.serveperunit}</b> | Minimum order: <b style={{color: 'darkorange'}}>{activeMenu.minimumquantity}</b></p>

          <div style={{ marginTop: 10 }}>
            <span>
              {activeMenu.descrip}
            </span>
          </div>

          {typeof activeMenu.markitem === 'undefined' || activeMenu.markitem.length === 0 ? null : this.renderIcon(activeMenu.markitem)} 

          <div style={{ marginTop: 20 }}>
            <FormGroup>
              <Label>Select Quantity</Label>
              <Input value={this.state.selectedQuantity} onChange={(e) => this.handleQuantityChange(e, activeMenu.priceperunit)} style={{color:'black'}} type="select">
              {this.findQuantityRange(activeMenu.minimumquantity).map(quantity =>
                <option style={{color:'black'}} key={quantity} value={quantity}>{quantity}</option>
              )}
              </Input>
            </FormGroup>
          </div>
 
          <div style={{ marginTop: 20 }}>
            {typeof activeMenu.selection === 'undefined' || activeMenu.selection.length === 0? null : this.renderSelection(activeMenu.selection, activeMenu.priceperunit)} 
          </div>

          <Button onClick={() => {this.toggleSpecialInstruction()}} outline color="primary" className="btn-pill" ><i className={this.state.specialInstructionOpen ? "fa fa-minus" : "fa fa-plus"} ></i>&nbsp;&nbsp;Add Special Instruction</Button>

          <Collapse style={{paddingTop: 20}} isOpen={this.state.specialInstructionOpen}>
            <Input value={this.state.specialInstruction} onChange={(e) => this.handleSpecialInstruction(e)} style={{color: 'black'}} type="textarea" rows="3" placeholder="Add your special instructions here.." />
          </Collapse>
          
          <div style={{marginTop:20, marginBottom:20, height:1, backgroundColor: 'gray', opacity: 0.3, width: '100%'}}/>

          <Row>
            <Col xs="6">

              {activeMenu.dishtype === 'bulk' ? 
              <span> <b style={{fontSize: 19, fontWeight: '600'}}>€{Number(this.state.selectedPrice === 0 ? activeMenu.priceperunit : this.state.selectedPrice).toFixed(2)}</b> <Label style={{fontStyle: 'italic'}}>(€{this.calculatePricePerPerson(this.state.selectedPrice === 0 ? activeMenu.priceperunit : this.state.selectedPrice, activeMenu.serveperunit)} / person)</Label></span>
              :
              <span> <b style={{fontSize: 19, fontWeight: '600'}}>€{Number(this.state.selectedPrice === 0 ? activeMenu.priceperunit : this.state.selectedPrice).toFixed(2)}</b> <Label style={{fontStyle: 'italic'}}>/ person</Label></span>
              }

            </Col>
          
            <Col style={{textAlign:'end',}} xs="6">
              <Button style={{fontSize: 17, padding: 10}} onClick={() => this.state.updateCartItem ? this.updateCart() : this.addToCart()} color="primary">
                {this.state.updateCartItem ? "Update Cart" : "Add to Cart"}
              </Button>
            </Col>  
          </Row>
        </ModalBody>
       
      </Modal>
    );
  }

  renderSelection(selection, priceperunit) {
    var selectionarray = [];
    for (let i = 0; i < selection.length; i++) {
      selectionarray.push(
        <Card>
          <CardHeader style={{fontWeight: '600'}}>
            Select {selection[i].selectionmaxnum} {selection[i].selectioncategory}
          </CardHeader>
          <CardBody>
            {selection[i].selectionmaxnum === 1 ? this.renderRadioboxSelectionItems(selection[i].selectioncategory, selection[i].selectionitem, priceperunit) : this.renderCheckboxSelectionItems(selection[i].selectioncategory, selection[i].selectionmaxnum, selection[i].selectionitem, priceperunit)}
          </CardBody>
        </Card>
      );
    }
    return <FormGroup>{selectionarray}</FormGroup>;
  }

  renderRadioboxSelectionItems(selectioncategory, selectionitem, priceperunit) {
    var selectionitemarray = [];
    for (let i = 0; i < selectionitem.length; i++) {
      selectionitemarray.push(
        <Col xs="12" sm="6" md="6">
          {selectionitem[i].selectionitemprice === 0 ? 
          (
            <FormGroup style={{ paddingLeft: 0, marginTop: 10 }}check className="checkbox">
              <Radio
                checked={this.findSelectionIndex(selectioncategory, selectionitem[i].selectionitemtitle)}
                onChange={(e) => this.handleRadioBoxChange(e, selectioncategory, selectionitem[i].selectionitemtitle, selectionitem[i].selectionitemprice, priceperunit)}
                value={selectionitem[i].selectionitemtitle}
                name={selectionitem[i].selectionitemtitle}
                style={{padding:0, marginRight: 10}}
              />
              <Label check className="form-check-label">
                {selectionitem[i].selectionitemtitle}
              </Label>
            </FormGroup>
          ) 
          : 
          (
            <FormGroup style={{ paddingLeft: 0, marginTop: 10 }}check className="checkbox">
              <Radio
                checked={this.findSelectionIndex(selectioncategory, selectionitem[i].selectionitemtitle)}
                onChange={(e) => this.handleRadioBoxChange(e, selectioncategory, selectionitem[i].selectionitemtitle, selectionitem[i].selectionitemprice, priceperunit)}
                value={selectionitem[i].selectionitemtitle}
                name={selectionitem[i].selectionitemtitle}
                style={{padding:0, marginRight: 10}}
              />
              <Label check className="form-check-label">
                {selectionitem[i].selectionitemtitle} (+€
                {Number(selectionitem[i].selectionitemprice).toFixed(2)})
              </Label>
            </FormGroup>
          )}
        </Col>
      );
    }
    return <Row>{selectionitemarray}</Row>;
  }

  renderCheckboxSelectionItems(selectioncategory, selectionmaxnum, selectionitem, priceperunit) {
    var selectionitemarray = [];
    for (let i = 0; i < selectionitem.length; i++) {
      selectionitemarray.push(
        <Col xs="12" sm="6" md="6">
          {selectionitem[i].selectionitemprice === 0 ? 
          (
            <FormGroup style={{ paddingLeft: 0, marginTop: 10 }}check className="checkbox">
              <Checkbox
                checked={this.findSelectionIndex(selectioncategory, selectionitem[i].selectionitemtitle)}
                onChange={(e) => this.handleCheckBoxChange(e, selectioncategory, selectionmaxnum, selectionitem[i].selectionitemtitle, selectionitem[i].selectionitemprice, priceperunit)}
                value={selectionitem[i].selectionitemtitle}
                style={{padding:0, marginRight: 10}}
              />
              <Label check className="form-check-label">
                {selectionitem[i].selectionitemtitle}
              </Label>
            </FormGroup>
          ) 
          : 
          (
            <FormGroup style={{ paddingLeft: 0, marginTop: 10 }}check className="checkbox">
              <Checkbox
                checked={this.findSelectionIndex(selectioncategory, selectionitem[i].selectionitemtitle)}
                onChange={(e) => this.handleCheckBoxChange(e, selectioncategory, selectionmaxnum, selectionitem[i].selectionitemtitle, selectionitem[i].selectionitemprice, priceperunit)}
                value={selectionitem[i].selectionitemtitle}
                style={{padding:0, marginRight: 10}}
              />
              <Label check className="form-check-label">
                {selectionitem[i].selectionitemtitle} (+€
                {Number(selectionitem[i].selectionitemprice).toFixed(2)})
              </Label>
            </FormGroup>
          )}
        </Col>
      );
    }
    return <Row>
    {selectionitemarray}
    {this.checkBoxFull(selectionmaxnum, selectioncategory) ? <Col style={{marginTop: 20}} xs="12"><Label style={{fontWeight: '600', color: 'darkorange'}}>Maximum {selectionmaxnum} selections</Label></Col> : null}
    </Row>;
  }

  /////////////////////////////////////////Cart Rendering//////////////////////////////////////////////////////////////

  renderCartSelectionItem(selectionitem) {
    var itemstext = '';

    for (let i = 0; i < selectionitem.length; i++) {
      if (i == 0) {
        itemstext = selectionitem[i].selectionitemtitle
      }
      else {
        itemstext = itemstext + ', ' + selectionitem[i].selectionitemtitle
      }
    }
    return <div><Label style={{ cursor: 'pointer', opacity: 0.7, }}>{itemstext}</Label></div>;
  }

  renderCartSelection(selection) {
    var itemsarray = [];

    for (let i = 0; i < selection.length; i++) {
      itemsarray.push(
        <p style={{textSize: 13, opacity: 0.7, margin: 0 }}>
          <span>&#8226;</span> {selection[i].selectioncategory}:
          {this.renderCartSelectionItem(selection[i].selectionitem)}
        </p>
      );
    }

    return <div>{itemsarray}</div>;
  }

  renderInstruction(instruction) {
    var itemsarray = [];

    for (let i = 0; i < 1; i++) {
      itemsarray.push(
        <p style={{ textSize: 13, opacity: 0.7, margin: 0 }}>
          <span>&#8226;</span> Instruction:
          <div>
            <Label style={{ cursor: 'pointer', opacity: 0.7, }}>
              {instruction}
            </Label>
          </div>
        </p>
      );
    }

    return <div>{itemsarray}</div>;
  }

  renderTableItems() {
    var itemarray = [];

    var cartitem = this.state.cartitem;

    for (let i = 0; i < cartitem.length; i++) {
      itemarray.push(
        <tr style={{cursor: 'pointer',}} onClick={() => this.cartItemClicked(cartitem[i]._id, cartitem[i].quantity, cartitem[i].selection, cartitem[i].totalprice, cartitem[i].instruction)}>
          <td style={{  fontWeight: "500" }}>
            {cartitem[i].quantity}
          </td>
          <td style={{  textAlign: "start" }}>
            <Dotdotdot clamp={2}>
              <p
                style={{
                  marginBottom: 5,
                  fontWeight: "500",
                  color: "#20a8d8",
                  overflow: "hidden"
                }}
              >
                {cartitem[i].title}
              </p>
            </Dotdotdot>
            <p style={{ fontStyle: 'italic', marginBottom: 5, textSize: 13, opacity: 0.7 }}>
              serves {cartitem[i].serveperunit}
            </p>
            {
              typeof cartitem[i].selection === 'undefined' ? null : 
              this.renderCartSelection(cartitem[i].selection)
            }
            {
              typeof cartitem[i].instruction === 'undefined' ? null : 
                this.renderInstruction(cartitem[i].instruction)
            }
          </td>

          <td style={{ width: "20%", textAlign: "start" }}>
            €{Number(cartitem[i].totalprice).toFixed(2)}
          </td>
          <td
            style={{
              padding: 0,
              paddingTop: 10,
              textAlign: "start"
            }}
          >
            <img
              style={{
                cursor: "pointer",
                height: 15,
                width: 15,
                objectFit: "cover"
              }}
              onClick={() => this.deleteCart(i)}
              src={closeIcon}
              alt=""
            />
          </td>
        </tr>
      );
    }

    return <tbody>{itemarray}</tbody>;
  }

  renderNotEmptyCart(previewVal) {
    return (
      <CardBody style={{ textAlign: "center" }}>
        <Table borderless>{this.renderTableItems()}</Table>

        <Row>
          <Col>
            <Card
              style={{
                cursor: "pointer",
                borderColor: this.state.orderType === "delivery" ? "#20a8d8" : null
              }}
              onMouseOver=""
              onClick={() => this.selectOrderType("delivery")}
            >
              <CardBody style={{margin: 0, padding:10}}>
                <h6 style={{ marginTop: 5, textAlign: "center", color: this.state.orderType === "delivery" ? "#20a8d8" : null }}>
                  Delivery
                </h6>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                cursor: "pointer",
                borderColor: this.state.orderType === "pickup" ? "#20a8d8" : null
              }}
              onMouseOver=""
              onClick={() => this.selectOrderType("pickup")}
            >
              <CardBody style={{margin: 0, padding:10}}>
                <h6 style={{ marginTop: 5, textAlign: "center", color: this.state.orderType === "pickup" ? "#20a8d8" : null }}>
                  Pick Up
                </h6>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Collapse isOpen={this.state.orderType === "delivery"} >
          <Table borderless>
            <tbody>
              <tr>
                <td
                  style={{ fontSize: 16, textAlign: "start" }}
                >
                  Delivery Fee
                </td>
                <td style={{ fontSize: 16, textAlign: "end" }}>
                  €{Number(this.state.restaurantInfo.deliveryfee).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Collapse>

        <div
          style={{
            height: 1,
            backgroundColor: "gray",
            opacity: 0.5,
            width: "100%"
          }}
        />

        <Table borderless>
          <tbody>
            <tr>
              <td
                style={{ fontSize: 16, fontWeight: "600", textAlign: "start" }}
              >
                TOTAL
              </td>
              <td style={{ fontSize: 16, fontWeight: "600", textAlign: "end" }}>
                €{this.calculateCartTotalPrice()}
              </td>
            </tr>
          </tbody>
        </Table>

        <Button
          style={{
            color: "white",
            backgroundColor: "#ff7043",
            marginTop: 30,
            padding: 15,
            fontWeight: "600",
            fontSize: 16
          }}
          onClick={() => this.checkOutClicked(previewVal)}
          block
        >
          Checkout
        </Button>

        {this.state.orderNotOverMinSpending ? 
        <div>
        <Label
          style={{
            marginTop: 20,
            color: "red",
            textAlign: "center",
            fontSize: 15
          }}
        >
          Total order price has to be more than minimum order €{Number(this.state.restaurantInfo.minimumspend).toFixed(2)}
        </Label>
        </div>
        : null }

        <div>
        <Label
          style={{
            marginTop: 20,
            color: "gray",
            textAlign: "center",
            fontSize: 15
          }}
        >
          Minimum Order Value: €{Number(this.state.restaurantInfo.minimumspend).toFixed(2)}
        </Label>
        </div>

      </CardBody>
    );
  }

  renderEmptyCart() {
    return (
      <CardBody style={{ textAlign: "center" }}>
        <img
          style={{
            objectFit: "cover",
            width: 150,
            height: 150,
            opacity: 0.3,
            display: "inline"
          }}
          src={
            "https://cdn4.iconfinder.com/data/icons/shopping-21/64/shopping-02-512.png"
          }
        />
        <div>
        <Label
          style={{
            marginTop: 20,
            color: "gray",
            textAlign: "center",
            fontSize: 15
          }}
        >
          You have 0 item in your cart.
        </Label>
        </div>
        <div>
        <Label
          style={{
            marginTop: 10,
            color: "gray",
            textAlign: "center",
            fontSize: 15
          }}
        >
          Select a menu item to start your order.
        </Label>
        </div>
        <Button
          style={{
            color: "white",
            backgroundColor: "#ff7043",
            marginTop: 30,
            padding: 15,
            fontWeight: "600",
            fontSize: 16
          }}
          disabled
          block
        >
          Checkout
        </Button>
        <div>
        <Label
          style={{
            marginTop: 20,
            color: "gray",
            textAlign: "center",
            fontSize: 15
          }}
        >
           Minimum Order Value: €{Number(this.state.restaurantInfo.minimumspend).toFixed(2)}
        </Label>
        </div>
      </CardBody>
    );
  }

  renderCart(previewVal) {
    return (
      <Card
        style={{
          boxShadow: "0px 2px 2px #9E9E9E",
          borderWidth: 0
        }}
      >
        <CardHeader
          style={{
            backgroundColor: "rgba(13, 152, 186, 0.8)",
            textAlign: "center"
          }}
        >
          <Label style={{ fontWeight: "600", color: "white", fontSize: 17 }}>
            Your Cart
          </Label>
        </CardHeader>

        {this.state.cartitem.length === 0
          ? this.renderEmptyCart()
          : this.renderNotEmptyCart(previewVal)}
      </Card>
    );
  }

  /////////////////////////////////////////Menu Rendering//////////////////////////////////////////////////////////////

  renderMenu() {
    var menuarray = [];

    var menutab = this.state.menu;

    for (let i = 0; i < menutab.length; i++) {
      this.refObj[i] = React.createRef();
      menuarray.push(
        <Col key={i} xs="12">
          <div ref={this.refObj[i]} > </div>
          {i === 0 ? null : (
            <div
              style={{
                marginTop: 20,
                marginBottom: 30,
                height: 1,
                backgroundColor: "gray",
                opacity: 0.2,
                width: "100%"
              }}
            />
          )}
          {this.renderCategory(menutab[i].menuitem)}
        </Col>
      );
    }

    return (
    <Row >
      {menuarray}
    </Row>
    );
  }

  renderCategory(menuitem) {
    var categoryarray = [];

    var categorytab = menuitem;

    for (let i = 0; i < categorytab.length; i++) {
      categoryarray.push(
        <Col xs="12">
          {this.renderCategoryItems(
            categorytab[i].items,
            categorytab[i].categoryname,
          )}
        </Col>
      );
    }

    return <Row>{categoryarray}</Row>;
  }

  renderCategoryItems(items, categoryname) {
    var itemsarray = [];

    for (let i = 0; i < items.length; i++) {
      itemsarray.push(
        <Col xs="12" sm="12" md="12" lg="6">
          <Card className="card-1" onClick={() => this.menuItemClicked(items[i]._id)} style={{ cursor: "pointer" }}>
            <CardBody
              style={{
                cursor: "pointer",
                marginTop: 15,
                marginBottom: 10,
                padding: 0,
                height: "100%"
              }}
            >
              <Col>
                <div class="row">
                  <Col style={{padding: 0,}}>
                    <Label
                      style={{
                        display: "inline-block",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: 150,
                        width: "100%",
                        textAlign: "start",
                        cursor: "pointer",
                        marginLeft: 15,
                        color: "#20a8d8"
                      }}
                      className="h5"
                    >
                      {items[i].title}
                    </Label>
                  </Col>
                  
                </div>
                <div class="row">
                  <Label
                    style={{
                      opacity: 0.5,
                      cursor: "pointer",
                      marginLeft: 15,
                      fontWeight: "600",
                      fontfStyle: "italic"
                    }}
                  >
                    Serves {items[i].serveperunit}
                  </Label>
                  {items[i].minimumquantity > 1 ? 
                    <Label
                      style={{
                        opacity: 0.5,
                        cursor: "pointer",
                        marginLeft: 5,
                        fontWeight: "600",
                        fontfStyle: "italic"
                      }}
                    >
                    &#9679; Minimum {items[i].minimumquantity}
                    </Label>
                    :
                    null
                  }
                  {typeof items[i].markitem === 'undefined' ? null : this.renderMarkAsIcon(items[i].markitem)}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Dotdotdot clamp={2}>
                    <p style={{ cursor: "pointer", overflow: "hidden" }}>
                      {items[i].descrip}
                    </p>
                  </Dotdotdot>
                </div>

                <div class="row" style={{ marginTop: 10, }}>
                  <Label
                    style={{
                      cursor: "pointer",
                      marginLeft: 15, 
                    }}
                    className="h5 float-left"
                  >
                    €{Number(items[i].priceperunit).toFixed(2)}
                  </Label>
                </div>

              </Col>
            </CardBody>
          </Card>
        </Col>
      );
    }

    return (
      <Row>
        <Col xs="12">
          <Label style={{ marginBottom: 10, marginRight: 5 }} className="h5">
            {categoryname}
          </Label>
        </Col>
        {itemsarray}
      </Row>
    );
  }

  renderReview() {
    var itemsarray = [];

    var review = this.state.review

    for (let i = 0; i < review.length; i++) {
      itemsarray.push(
        <Col xs="12">
          <Card style={{boxShadow: 'none', borderWidth: 0}}>
            <CardBody
              style={{ padding: 0,}}
            >
              <Row>
                <Col xs="12">
                  <Label
                    className="h5"
                  >
                    {review[i].name}
                  </Label>
                </Col>

                <Col xs="12">
                  <Label>
                    {review[i].location}
                  </Label>
                </Col>

                <Col xs="12">
                  <Row style={{marginLeft:0}} className="justify-content">
                  <StarRatingComponent
                    name="rating"
                    emptyStarColor="#D3D3D3"
                    starCount={5}
                    editing={false}
                    value={review[i].rating}
                  />
                  <Label
                    style={{
                      opacity: 0.7,
                      marginLeft: 15,
                      fontfStyle: "italic"
                    }}
                  >
                    {review[i].time}
                  </Label>
                  </Row>
                </Col>

                <Col xs="12">
                  <p style={{ overflow: "hidden" }}>
                    {review[i].comment}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      );
    }

    return (
      <Row>
        <Col xs="12">
          <Label style={{ marginBottom: 30, fontSize: 19, }} className="h5">
            Reviews for {this.state.restaurantInfo.catererName}
          </Label>
        </Col>
        {itemsarray}
        <Col xs="12">
          <Label style={{ color: '#20a8d8', cursor: 'pointer' }} className="h5">
            See More
          </Label>
        </Col>
      </Row>
    );
  }

  renderAbout() {
    var restaurantInfo = this.state.restaurantInfo
    return (
      <Row>
        <div style={{ marginLeft: 10, width: 80, height: 80, position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
          <img style={{ objectFit:'cover', width: 'auto', height: '100%', display: 'inline' }} src={this.state.restaurantInfo.profilesrc}/>
        </div>
              
        <Col xs="12">
          <Label style={{ marginTop: 20 }} className="h4">
            {restaurantInfo.catererName}
          </Label>
        </Col>

        <Col xs="12">
          <Label style={{ marginTop:10, fontWeight: '600' }}>
            {restaurantInfo.catererAddress}
          </Label>
        </Col>

        <Col xs="12">
        <Row style={{marginLeft:0 }} className="justify-content">
          <StarRatingComponent
            name="rate1"
            emptyStarColor="#D3D3D3"
            starCount={5}
            editing={false}
            value={restaurantInfo.rating}
          />
           {restaurantInfo.rating === 0 ? null : <b style={{ marginLeft: 5, color: "darkorange" }}>{restaurantInfo.rating}</b> }
          {restaurantInfo.numofreview === 0 ? 
          <Label style={{ fontWeight: '500', marginLeft: 5, color: "darkorange" }}>
            No Ratings Yet
          </Label>
          :
          <Label style={{ fontWeight: '500', marginLeft: 5, color: "darkorange" }}>
            ({restaurantInfo.numofreview}) Reviews
          </Label>}
        </Row>
        </Col>

        <Col xs="12">
          <p style={{ marginTop: 10, overflow: "hidden" }}>
            {restaurantInfo.descrip}
          </p>
        </Col>
        <Col style={{margin: 0, padding : 0}} xs="12">
          <Table style={{margin: 0, padding : 0}} borderless>
          <tbody>
              <tr>
                <td><p style={{padding: 0, margin: 0, fontWeight: '600'}}>Delivery Fee:</p></td>
                <td><p style={{padding: 0, margin: 0}}>€{Number(restaurantInfo.deliveryfee).toFixed(2)}</p></td>
              </tr>
              <tr>
                <td><p style={{padding: 0, margin: 0, fontWeight: '600'}}>Minimum Spending:</p></td>
                <td><p style={{padding: 0, margin: 0}}>€{Number(restaurantInfo.minimumspend).toFixed(2)}</p></td>
              </tr>
              <tr>
                <td><p style={{padding: 0, margin: 0, fontWeight: '600'}}>Opening Hours:</p></td>
                <td><p style={{padding: 0, margin: 0}}>{this.renderOpeningHours()}</p></td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }

  reformatInput = (time) => {
    if (time.length > 3 ) {
      time = time.slice(0, 2) + ":" + time.slice(2, 4)
      
    }
    else {
      time = "0" + time.slice(0, 1) + ":" + time.slice(1, 3)
    }
    return time
  }

  renderOpeningHours() {
    var itemsarray = [];

    var deliveryhours = this.state.restaurantInfo.deliveryhours;

    if (typeof this.state.restaurantInfo.deliveryhours !== 'undefined') {
      if (deliveryhours.length > 0) {
        for (let i = 0; i < deliveryhours.length; i++) {
          itemsarray.push(
            <Col xs="6" sm="6" md="4" lg="4">
              <span style={{fontWeight: this.state.todayDay === deliveryhours[i].day ? '700' : null}}>
                <p style={{margin: 0}}>
                  {deliveryhours[i].day}
                </p>
                {deliveryhours[i].starttime === 0 && deliveryhours[i].closetime === 0 ? 
                 <p style={{margin: 0, marginBottom: 10}}>Off</p>
                 :
                <p style={{margin: 0, marginBottom: 10}}>
                  {this.reformatInput(deliveryhours[i].starttime.toString())}&nbsp;-&nbsp;{this.reformatInput(deliveryhours[i].closetime.toString())}
                </p>
                }
              </span>
            </Col>
          );
        }
      }
    }

    return (
      <Row
      >
        {itemsarray}
      </Row>
    );
  }

  renderIcon(markitem) {
    var iconarray = [];
    for (let i = 0; i < markitem.length; i++) {
      iconarray.push(
        <span style={{opacity: 0.8}}>
          {markitem[i]}
          <img
            style={{
              marginLeft: 5,
              marginRight:10, 
              marginBottom: 5,
              height: 20,
              width: 20,
              objectFit: "cover"
            }}
            src={this.findIcon(markitem[i])}
            alt=""
          ></img>
        </span>
      );
    }
    return (
      <Row
        style={{
          textAlign: "start",
          marginTop:20, 
        }}
      >
        <Col>
        {iconarray}
        </Col>
      </Row>
    );
  }

  renderMarkAsIcon(markitem) {
    var iconarray = [];
    for (let i = 0; i < markitem.length; i++) {
      iconarray.push(
        <img
          key={i} 
          style={{
            marginLeft: 5,
            marginBottom: 5,
            height: 20,
            width: 20,
            objectFit: "cover"
          }}
          src={this.findIcon(markitem[i])}
          alt=""
        />
      );
    }
    return (
      <Col
        style={{
          textAlign: "end",
          flex: 1
        }}
      >
        {iconarray}
      </Col>
    );
  }

  renderLoadingItems() {
    var itemsarray = [];

    for (let i = 0; i < 6; i++) {
      itemsarray.push(
        <Col key={i} xs="12" sm="6" md="6" lg="6">
          <ContentLoader height="350">
            <rect x="0" y="0" rx="6" ry="6" width="100%" height="220" />
            <rect x="0" y="240" rx="4" ry="4" width="300" height="13" />
            <rect x="0" y="265" rx="3" ry="3" width="100%" height="20" />
          </ContentLoader>
        </Col>
      );
    }

    return (
      <Row
        style={{
          marginTop: 10
        }}
      >
        {itemsarray}
      </Row>
    );
  }


  render() {
    const {
      preview,
    } = this.props;

    const menutitlelength = this.state.menutitle.length;
    const previewVal = preview || false;

    return (
      <div style={{backgroundColor: 'white'}}>
         {previewVal ? null : <NavBar signIn={e=>this.signIn(e)}/> }
      <div className="app align-items-center">

          <Container>
            <Row
              style={{ marginTop: 20, marginBottom: 50 }}
              className="justify-content-center"
            >
              <img
                style={{ objectFit: "cover", width: "100%", height: 300 }}
                src={this.state.restaurantInfo.coversrc}
              />

              <Col xs="0" sm="1" md="3" lg="3" />

              <Col xs="12" sm="10" md="6" lg="6">
                <Card
                  style={{ textAlign: "center", marginTop: -250 }}
                >
                  <CardBody>
                    
                    <div style={{width: 80, height: 80, position: 'relative', margin: 'auto', overflow: 'hidden', borderRadius: '50%'}}>
                      <img style={{ objectFit:'cover', width: 'auto', height: '100%', display: 'inline' }} src={this.state.restaurantInfo.profilesrc}/>
                    </div>

                    <Label style={{ marginTop:10, marginLeft: 10 }} className="h4">{this.state.restaurantInfo.catererName}</Label>

                    <Row className="justify-content-center">
                      <StarRatingComponent
                        name="rate1"
                        emptyStarColor="#D3D3D3"
                        starCount={5}
                        editing={false}
                        value={this.state.restaurantInfo.rating}
                      />
                      {this.state.restaurantInfo.rating === 0 ? null : <b style={{ marginLeft: 5, color: "darkorange" }}>{this.state.restaurantInfo.rating}</b> }
                      {this.state.restaurantInfo.numofreview === 0 ? 
                      <Label style={{ fontWeight: '500', marginLeft: 5, color: "darkorange" }}>
                        No Ratings Yet
                      </Label>
                      :
                      <Label style={{ fontWeight: '500', marginLeft: 5, color: "darkorange" }}>
                        ({this.state.restaurantInfo.numofreview}) Reviews
                      </Label>}
                    </Row>

                    <Label style={{ marginTop: 10 }} className="h6">
                      {this.state.restaurantInfo.address}
                    </Label>

                  </CardBody>
                </Card>
              </Col>

              <Col xs="0" sm="1" md="3" lg="3" />

              <Col style={{ marginTop: 30, marginBottom: 20 }} xs="12" md="12">
                {this.renderNavItem()}
                
              </Col>

              <Col style={{ marginTop: 20 }} xs="12" sm="12" md="7" lg="7">
                {this.state.loading ? this.renderLoadingItems() : this.renderMenu()}
              </Col>

              <Col style={{ marginTop: 20 }} xs="0" sm="0" md="5" lg="5">
                {this.renderCart(previewVal)}
              </Col>

              {previewVal ? null : <div style={{marginTop:30, marginBottom:20, height:1, backgroundColor: 'gray', opacity: 0.3, width: '100%'}}/>}

              <Col style={{ marginTop: 20 }} xs="12" sm="12" md="7" lg="7">
                {previewVal ? null : this.renderReview()}
              </Col>

              <Col style={{ marginTop: 20 }} xs="0" sm="0" md="5" lg="5"></Col>

              <div style={{marginTop:30, marginBottom:20, height:1, backgroundColor: 'gray', opacity: 0.3, width: '100%'}}/>

              <Col style={{ marginTop: 20 }} xs="12" sm="12" md="7" lg="7">
                {this.renderAbout()}
              </Col>

              <Col style={{ marginTop: 20 }} xs="0" sm="0" md="5" lg="5"></Col>
              
            </Row>

            {this.state.menuModalOpen ? this.renderMenuModal() : null}
          </Container>
        </div>
        {previewVal ? null : <Footer />}
      </div>
    );
  }
}

export default CatererDetail;

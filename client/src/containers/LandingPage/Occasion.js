import React, { Component } from 'react';
import { Button, Row, Col, Card, CardBody } from 'reactstrap';
import './styles.css'

class Occasion extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      occasions:
      [
        {
          title: 'Breakfast',
          src: 'https://www.dublinskylonhotel.com/cmsGallery/imagerow/11256/resized/1200x798/breakfast_hot_buffet_1.jpg',
          hover: false,
        },
        {
          title: 'Events',
          src: 'http://prod.static9.net.au/_/media/2018/08/16/13/09/dessert-cob-loaf-filled-with-chocolate-ganache-dipping-sauce.jpg',
          hover: false,
        },
        {
          title: 'Lunch',
          src: 'https://assets.bonappetit.com/photos/57d8322a304c2be47da77111/master/w_1200,c_limit/lunch-al-desko-main.jpg',
          hover: false,
        },
        {
          title: 'Finger Food',
          src: 'https://www.yummyhealthyeasy.com/wp-content/uploads/2018/06/Low-Carb-Avocado-Shrimp-Cucumber-Appetizer-3.jpg',
          hover: false,
        },
        {
          title: 'Buffets',
          src: 'https://www.capetownmagazine.com//media_lib/r2/69b757ced9a28df9b5601ae29eeed959.img.jpg',
          hover: false,
        },
        {
          title: 'Office Daily',
          src: 'https://holycitycrossfit.com/wp-content/uploads/2018/12/HolidayParty_1.jpg',
          hover: false,
        },
      ]
    }
  }

  handleSelectedCardClick(index) {

  
  }

  toggle(index) {
    var newoccasions = this.state.occasions
    newoccasions[index].hover = !this.state.occasions[index].hover
    this.setState({ occasions: newoccasions });
  }

  renderItems() {

    var itemsarray = [];

    var occasions = this.state.occasions

    for(let i = 0; i < occasions.length; i++){
      itemsarray.push(
        <Col xs="12" sm="6" md="6" lg="4">
          <Card onMouseEnter={() => this.toggle(i)} onMouseLeave={() => this.toggle(i)} style={{cursor: 'pointer', boxShadow: 'none'}}  onClick={() => this.handleSelectedCardClick(i)}>
            <CardBody style={{position:'relative', padding: 0, height: 220}}>
              <img style={ { objectFit:'cover', width: '100%', height: '100%' }} src={occasions[i].src}  />
              <div style={{ backgroundColor: 'black', opacity: occasions[i].hover ? 0.1 : 0.3, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}> </div> 
              <h5 style={{fontWeight: '600', fontSize: 20, color: 'white', top:95, left:0, right:0, position: 'absolute', width: '100%', textAlign: 'center'}} >{occasions[i].title} </h5>
            </CardBody>
          </Card>
        </Col>
      )
    }

    return(
      <Row style={{marginTop: 50}}>
        {itemsarray}
      </Row>
    )
  }

  render() {
    return (
      <section  style={{backgroundColor: 'white'}} id="occasion" className="white">
        <div className="container">
          <div style={{margin:0}} className="row">
            <div style={{height:1, opacity: 0.2, backgroundColor: 'black', borderWidth: 1}} className="col l1"></div>
            <div style={{marginTop: 60}} className="center-align">
              <h2 style={{textAlign: 'center', fontSize: 34}}>Catering for various occasions</h2>
              {this.renderItems()}
            </div>
            <div style={{height:1, marginTop:50, opacity: 0.2, backgroundColor: 'gray', borderWidth: 1}} className="col l1"></div>
          </div>
        </div>
      </section>
    );
  }
};

export default Occasion;

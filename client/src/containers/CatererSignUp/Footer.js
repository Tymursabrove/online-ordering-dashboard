import React, { Component } from 'react';
import { Row, Col} from 'reactstrap';
import './styles.css'

const Footer = () => {
  return (
    <Row style={{padding:15, margin:0, backgroundColor: '#696969'}} className="justify-content-center">
      <p style={{textAlign: 'center'}}>
        <b style={{color:'white'}}>FoodieBee © 2019 All Rights Reserved</b><br />
        <a style={{color:'white'}} href="">Terms of Use</a>
        <b style={{color:'white'}}> | </b>
        <a style={{color:'white'}} href="">Privacy Policy</a>
      </p>
      <Col style={{textAlign: 'center'}} xs="12">
        <a style={{color: 'white', marginLeft: 10, marginRight: 5}} href="#" className="fa fa-facebook socialfa brandlogo"></a>
        <a style={{color: 'white', marginLeft: 5, marginRight: 5}} href="#" className="fa fa-twitter socialfa brandlogo"></a>   
        <a style={{color: 'white', marginLeft: 5, marginRight: 5}} href="#" className="fa fa-instagram socialfa brandlogo"></a>
        <a style={{color: 'white', marginLeft: 5, marginRight: 10}} href="#" className="fa fa-linkedin socialfa brandlogo"></a>         
      </Col>
   
    </Row>
  );
};

export default Footer;

import React from 'react';
import '../assets/css/Header.css'
import logo from '../assets/img/anchor.svg';

const Header = (props) => {
  return (
    <div className="header">
    <img src={logo} className="logo" alt="logo" />
      <h1>{props.headline}</h1>
    </div>)
  }
  
export default Header;
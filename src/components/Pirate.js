import React, { Component } from 'react';
import '../assets/css/Pirate.css'

class Pirate extends Component {
  render(){
    const { details } = this.props;

    if (this.props.uid === null) {
      return (
        <div className='pirate'>
        <ul>
        <li>{details.name}</li>
        <li>{details.weapon}</li>
        <li>{details.vessel}</li>
        </ul>
        </div>
      )
    }

    return (
      <div className='pirate'>
      <ul>
      <li>{details.name}</li>
      <li>{details.weapon}</li>
      <li>{details.vessel}</li>
      <li><button onClick={() => this.props.removePirate(this.props.index)}>✖︎</button></li>
      </ul>
      </div>
      )
    }
  }
  export default Pirate;
import React, { Component } from 'react';
import AddPirateForm from './AddPirateForm';

class PirateForm extends Component {
  render(){
    return (
      <div>
      <h3>Pirate Form Component</h3>
        <AddPirateForm addPirate={this.props.addPirate} />
        <button onClick={this.props.loadSamples}>Load Sample Pirates</button>
      </div>
      )
  }
  
}

export default PirateForm;
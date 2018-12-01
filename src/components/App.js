import React, { Component } from 'react';
import Pirate from './Pirate'
import Header from './Header'
import PirateForm from './PirateForm'

import axios from 'axios';

class App extends Component {
  
  constructor() {
    super();
    this.addPirate = this.addPirate.bind(this);
    this.removePirate = this.removePirate.bind(this);
    this.state = {
      pirates: {},
      isLoading: true,
      error: null
    }
  }
  
  componentDidMount(){
    this.setState({ isLoading: true });
    axios.get('http://localhost:3005/api/pirates')
    .then(response => this.setState({
      pirates: response.data,
      isLoading: false
    }))
    .catch(error => this.setState({
      error,
      isLoading: false
    }));
  }
  
  render() {
    
    const { isLoading, error } = this.state;
    
    if (error) {
      return <p>{error.message}</p>;
    }
    
    if (isLoading) {
      return <p>Loading ...</p>;
    }
    
    return (
      <div className="App">
      <Header headline="Pirates!" />
      
      {
        Object.keys(this.state.pirates)
        .map(key =>
          <Pirate key={key}
          index={key}
          details={this.state.pirates[key]}
          removePirate={this.removePirate} />)
        }
        
        <PirateForm loadSamples={this.loadSamples} addPirate={this.addPirate} />
        </div>
        );
      }
      
      removePirate(key){
        const pirates = { ...this.state.pirates }
        let pirateDel = this.state.pirates[key]._id
        axios.get(`http://localhost:3005/api/pirates/${pirateDel}`)
        .then(delete pirates[key])
        .then(this.setState({pirates}))
      }
      
      // addPirate(pirate) {
      //   const locPirates = { ...this.state.pirates }
      //   console.log(locPirates)
      //   axios.post('http://localhost:3005/api/pirates/', pirate)
      //   .then(response => console.log(response.data))
      //     .then(locPirates[pirate] = pirate)
      //     .then(console.log(locPirates))
      //     // .then(response => this.setState({
      //     //   pirates: response.data
      //     // }))
      //   // replaces all state with returned values
      // }
      
      addPirate(pirate) {
        console.log(pirate)
        const locPirates = { ...this.state.pirates }
        // console.log(locPirates)
        fetch('http://localhost:3005/api/pirates/',
        {
          method: 'post',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify(pirate)
        })
        .then(response => response.json()
        .then(data => ({
          data: data,
          status: response.status
        }))
        .then(res => locPirates[pirate] = res.data)
        )
        // .then(console.log(locPirates))  // object object
        .then(this.setState({
          pirates: locPirates
        }))
        .then (console.log(locPirates))
        // replaces all state with returned values
      }
      
    }
    
    export default App;
    
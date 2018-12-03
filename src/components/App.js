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
      return (
        <React.Fragment>
        <Header headline="Loading!" />
        <p>Loading ...</p>
        </React.Fragment>
        ) 
      }
      
      return (
        <React.Fragment>
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
          </React.Fragment>
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
        //   this.setState({ isLoading: true });
        //   const locPirates = { ...this.state.pirates }
        //   axios.post('http://localhost:3005/api/pirates/', pirate)
        //   .then(response => {
        //     locPirates[pirate] = response.data
        //     this.setState({ pirates: locPirates, isLoading: false })
        //   })
        // }
  
        addPirate(pirate) {
          this.setState({ isLoading: true });
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
            .then(response => {
              locPirates[pirate] = response.data;
              this.setState({ pirates: locPirates, isLoading: false })
            })
          )
        }
        
      }
      
      export default App;
      
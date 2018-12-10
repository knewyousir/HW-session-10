import React, { Component } from 'react';
import Pirate from './Pirate'
import Header from './Header'
import PirateForm from './PirateForm'
import piratesFile from '../data/sample-pirates-object';
import base from '../base'

class App extends Component {
  
  constructor() {
    super();
    this.addPirate = this.addPirate.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.removePirate = this.removePirate.bind(this);
    this.updatePirate = this.updatePirate.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      pirates: {},
      uid: null,
      isLoading: true,
      error: null
    }
  }
  
  componentDidMount(){
    this.ref = base.syncState(`kevin-birk-pirates/pirates`, {
      context: this,
      state: 'pirates'
    })

    base.onAuth( (user) => {
      if (user) {
        this.authHandler(null, { user })
      }
    })
  }
  
  render() {
    
    const logout = <button onClick={ () => this.logout() } >Log Out</button>

    if (this.state.uid === null) {
      return (
        <div className="App">
        <Header headline="Pirates!" />

        {
        Object.keys(this.state.pirates)
        .map(key =>
          <Pirate key={key}
          index={key}
          details={this.state.pirates[key]}
          uid={this.state.uid} />)
        }

        {this.renderLogin()}

        <PirateForm
          updatePirate={this.updatePirate}
          pirates={this.state.pirates}
          loadSamples={this.loadSamples}
          addPirate={this.addPirate}
          removePirate={this.removePirate}
          uid={this.state.uid} />
        </div>
      )
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
          removePirate={this.removePirate}
          uid={this.state.uid} />)
        }

        {logout}
        
        <PirateForm
          updatePirate={this.updatePirate}
          pirates={this.state.pirates}
          loadSamples={this.loadSamples}
          addPirate={this.addPirate}
          uid={this.state.uid} />
        </div>
        )
      }
      
  loadSamples() {
    this.setState({
      pirates: piratesFile
      })
    }
      
  removePirate(key){
    const pirates = { ...this.state.pirates }
    pirates[key] =null;
    this.setState({pirates})
    }
      
  addPirate(pirate) {
    const pirates = { ...this.state.pirates }
    const timestamp = Date.now()
    pirates[`pirate-${timestamp}`] = pirate
    this.setState({ pirates })
  }

  updatePirate(key, updatedPirate){
    const pirates = {...this.state.pirates};
    pirates[key] = updatedPirate;
    this.setState({ pirates })
  }

  renderLogin() {
    return (
      <React.Fragment>
        <p>Sign In</p>
        <button onClick={ () => this.authenticate('github') } >Log in with Github </button>
        <button onClick={ () => this.authenticate('google') } >Log in with Google </button>
      </React.Fragment>
    )
  }

  authenticate(provider) {
    console.log(provider);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData);
    if (err){
      console.log(err);
      return;
    }
    this.setState({
      uid: authData.user.uid
    })
  }

  logout() {
    base.unauth();
    this.setState({ uid: null});
  }
      
}
    
export default App;
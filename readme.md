# IX - React Router, RealTime DataBases

## Homework

Create an account on Firebase and retrofit the done files to use your own database.

1. Create a free account at [Firebase](https://firebase.com/)
1. Create a new project called `<firstname>-<lastname>-pirates`
1. Create Project
1. Go to the empty database (left hand menu)

Click on Create Database at the top and choose `Start in Test Mode`.

This changes the defaults to:

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
  }
}
```

In Firebase click on Project Overview > Add Firebase to your web app.

Extract the following information:

```js
apiKey: "XXXXXXXX",
authDomain: "XXXXXXXX",
databaseURL: "XXXXXXXXX",
```

And use it in your copy of `base.js`:

```js
import Rebase from 're-base';

const base = Rebase.createClass({
  apiKey: "XXXXXXXXXXX",
  authDomain: "test-pirates-b5b9a.firebaseapp.com",
  databaseURL: "https://test-pirates-b5b9a.firebaseio.com",
  projectId: "test-pirates-b5b9a",
  storageBucket: "test-pirates-b5b9a.appspot.com",
  messagingSenderId: "758151016053"
});

export default base;
```

## Reading


## Persisting the Data Continued

`cd` into `express-pirates` `npm i` and `code .`
`cd` into `react-pirates` `npm i` and `code .`

In session-10-express run `npm start` to fire up the express app. 

In session-10-react run `npm start` to fire up the react app.

Review and test the loading state. 

## Routing in react-pirates

We will add routing to our current project. The goal is to create a master / detail view for our pirates.

Install the router:

`npm install --save react-router-dom`

`Index.js`:

```js
import { BrowserRouter } from 'react-router-dom'
...
ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))
```

## Main Routes

Create a navbar for top level routing. We will use `NavLink` to take advantage of the `active` states it provides.

`Nav.js`:

```js
import React from 'react';
import {NavLink} from 'react-router-dom';

function Nav(){
  return (
    <ul className="nav">
      <li>
        <NavLink exact to='/'>Home</NavLink>
      </li>
      <li>
        <NavLink to='/add'>About Pirates</NavLink>
      </li>
      <li>
        <NavLink to='/pirates'>Pirates</NavLink>
      </li>
    </ul>
  )
}

export default Nav
```

Import it in `App.js` and add it below the header in the render method.

`App.js`:

```js
import Nav from './Nav';
...
return (
  <div className="App">
    <Header headline="Pirates!" />
    <Nav />
```

Import `Nav.css` into `Nav.js`:

`import '../assets/css/Nav.css';`

Create a component for the root route.

`Home.js`:

```js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h2>Home</h2>
      <Link to='/pirates'>See em All</Link>
    </div>
    )
  }
  
export default Home;
```

Import `Home` into `App.js`.

`import Home from './Home';`

## Routing and Switching

`App.js`:

 ```js
import { Route, Switch } from 'react-router-dom';
...
return(
  <Route>
    <React.Fragment>
    <Header headline='Pirates!' />
    <Nav />
    <Switch>
      <Route exact path='/' component={Home} />
      <Route render={() => {
        return <h2>Not found</h2>
      }} />
    </Switch>
    </React.Fragment>
  </Route>
)
```

Note that we can use `<Route render={}>` instead of specifying a component.

 <!-- ```js
 return(
    <Route>
      <React.Fragment>
      <Header headline='Pirates!' />
      <Nav />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route 
          path='/add'
          render={ (props) => <AddPirateForm {...props}  addPirate={this.addPirate} />}
        />
        <Route 
          path='/pirates' 
          render={ (props) => <Pirates {...props} details={this.state.pirates} /> } />
        <Route render={function(){
          return <h2>Not found</h2>
        }} />
      </Switch>
      </React.Fragment>
    </Route>
  )
}
``` -->

Expand the routes to include components for `/pirates` and a new route `/pirates:number`.

`App.js`:

```js
import Pirates from './Pirates';
import PirateDetail from './PirateDetail';
...
return(
  <Route>
    <React.Fragment>
    <Header headline='Pirates!' />
    <Nav />
    <Switch>
    <Route exact path='/' component={Home} />
    <Route exact path='/pirates' component={Pirates} />
    <Route path='/pirates/:number' component={PirateDetail} />
    <Route render={ () => {
      return <h2>Not found</h2>
    }} />
  </Switch>
    </React.Fragment>
  </Route>
)
```

`PirateDetail` and `Pirates` are simple functional components. We will edit `Pirates` to make it a class-based component that returns a hard coded link.

`Pirates.js`:

```js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Pirate.css';

class Pirates extends Component {
  render(){
    return (
      <div className='pirate'>
      <ul>
        <li><Link to={`pirates/10`}>Pirates</Link></li>
        </ul>
      </div>
      )
    }
  }
  export default Pirates;
```

Edit `PirateDetail` to include a Link back to home.

`PirateDetail.js`:

```js
import React from 'react';
import { Link } from 'react-router-dom';

const PirateDetail = () => (
  <React.Fragment>
  <h2>PirateDetail</h2>
  <Link to='/pirates'>Back</Link>
  </React.Fragment>
  )
  
  export default PirateDetail;
```

We are going to [render the Pirates component](https://reacttraining.com/react-router/web/api/Route) instead of using the component method: `<Route exact path='/pirates' component={AllPirates}/>`. This will allow us to pass in additional props to the component as well as the Route props (match, location, history).

Use the `render` route to pass state to Pirates.

`App.js`:

```js
<Route exact path='/pirates' render={(props) => (
  <Pirates {...props} details={this.state.pirates}  />
)} />
```

Use the React inspector to examine the Pirate component. Note that it has access to a details prop in addition to the routing props.

Use the details props to render our pirates list.

Edit `Pirates.js`:

```js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Pirate.css';

class Pirates extends Component {
  
  render(){
    const { details } = this.props;
    return (
      <div className='pirate'>
      <ul>

        {
          details.map( p => (
            <li key={p._id}>
              <Link to={`pirates/${p._id}`}>{p.name}</Link>
            </li>
          ))
        }
        </ul>
      </div>
      )
    }
  }
  export default Pirates;
```

Make this change to `Pirate.css`:

```css
.pirate ul {
  display: flex;
  flex-direction: column;
  list-style: none;
}
```

OUr links are referencing the `PirateDetail` component but with the static content. Let's make it dynamic.

Edit `PirateDetail`:

```js
import React from 'react';
import { Link } from 'react-router-dom'

const PirateDetail = (props) => {

const pirate = props.details.filter(
  p => p._id === props.match.params.number
  )
  
  console.log(pirate)
  
  return (
    <div className='pirate'>
    <ul>
    <li>{pirate[0].name}</li>
    </ul>
    <Link to='/pirates'>Back</Link>
    </div>
    )
  }
  
  export default PirateDetail
```

Note the error. We will need to pass state to this component as well.

`App.js`:

```js
<Route path='/pirates/:number' render={(props) => (
  <PirateDetail {...props} details={this.state.pirates} />
  )
} />
```

<!-- ISSUE - already added match props above -->

<!-- Inspect the `PirateDetail` component using React's tools.

Recall the method used in the previous (non routing) version of Pirate.js:

```js
render(){
    const { details } = this.props;
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
```

We need to use the routing props to access the match.params.number.

Before we can do that we will edit the component from one that only returns JSX:

```js
import React from 'react'
import { Link } from 'react-router-dom'

const PirateDetail = (props) => (
  <div className='pirate'>
  <ul>
    <li>Pirate Detail</li>
  </ul>
  <Link to='/pirates'>Back</Link>
  </div>
)

export default PirateDetail
```

To a function that has a return:

```js
import React from 'react';
import { Link } from 'react-router-dom'

const PirateDetail = (props) => {
  
  return (

    )
  }
  
export default PirateDetail
```

We extract the url parameters:

```js
import React from 'react';
import { Link } from 'react-router-dom'

const PirateDetail = (props) => {

  const pirate = props.details.filter(
  p => p._id === props.match.params.number
  )
  
  return (
    <div className='pirate'>
      <ul>
        <li>Pirate Detail</li>
      </ul>
      <Link to='/pirates'>Back</Link>
    </div>
    )
  }
  
export default PirateDetail
```

The filter returns an arrary of one item.

`console.log(pirate)`

`console.log(pirate[0])` -->

Add the additional details.

```js
import React from 'react';
import { Link } from 'react-router-dom'

const PirateDetail = (props) => {

const pirate = props.details.filter(
  p => p._id === props.match.params.number
  )
  
  const pirateDeet = pirate[0];
  
  return (
    <div className='pirate'>
    <ul>
    <li>Name: {pirateDeet.name}</li>
    <li>Vessel: {pirateDeet.vessel}</li>
    <li>Weapon: {pirateDeet.weapon}</li>
    </ul>
    <Link to='/pirates'>Back</Link>
    </div>
    )
  }
  
  export default PirateDetail
```

REFRESHING PROBLEMS! Need a central data store.

## Real Time Data

Up to this point we have been using our Express API for data services. We will now use Firebase - a cloud-hosted, NoSQL database that stores and syncs our data in realtime.

[Rebase](https://www.npmjs.com/package/rebase) is a utility that we are going to use to connect to Firebase and bind the data so whenever your data changes, your state will be updated.

`npm install re-base@2.2.0 --save`

In `src` create `base.js`:

```js
import Rebase from 're-base'

const base = Rebase.createClass({

})

export default base;
```

### Add domain, database URL, API key

In Firebase click on Project Overview > Add Firebase to your web app.

Extract the following information:

```js
apiKey: "XXXXXXXX",
authDomain: "XXXXXXXX",
databaseURL: "XXXXXXXXX",
```

In `base.js`:

```js
import Rebase from 're-base';

const base = Rebase.createClass({
  apiKey: "AIzaSyCqEN7JHnqqHFqRE6Tc0mAgAQ1KyoCgSHo",
  authDomain: "test-pirates-b5b9a.firebaseapp.com",
  databaseURL: "https://test-pirates-b5b9a.firebaseio.com",
  projectId: "test-pirates-b5b9a",
  storageBucket: "test-pirates-b5b9a.appspot.com",
  messagingSenderId: "758151016053"
});

export default base;
```

* `App.js`:

```js
import base from '../base';
```

## React Component Lifecycle

[Documentation](https://reactjs.org/docs/react-component.html).

`componentWillMount` - hooks into component before it is displayed.

`App.js`:

```js
componentWillMount(){
  this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
    context: this,
    state: 'pirates'
  })
}
```

Note the path and the object.

```js
componentWillUmount(){
  base.removeBinding(this.ref)
}
```

Entire App.js:

```js
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import Pirates from './Pirates';
import PirateDetail from './PirateDetail';
import Header from './Header'
import Home from './Home';
import Nav from './Nav';

import base from '../base';

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      pirates: {}
    }
  }

  componentDidMount(){
    this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
      context: this,
      state: 'pirates'
    })
  }

  componentWillUmount(){
    base.removeBinding(this.ref)
  }
  
  render() {
      
      return(
        <Route>
        <React.Fragment>
        <Header headline='Pirates!' />
        <Nav />
        <Switch>
        <Route exact path='/' component={Home} />
        
        <Route exact path='/pirates' render={(props) => (
          <Pirates {...props} details={this.state.pirates}  />
          )
        } />
        
        <Route path='/pirates/:number' render={(props) => (
          <PirateDetail {...props} details={this.state.pirates} />
          )
        } />
        
        </Switch>
        </React.Fragment>
        </Route>
        )
      }
    }
    
    export default App;
```

Pirates.js:

```js
import React, { Component } from 'react';
import Pirate from './Pirate'
import '../assets/css/Pirate.css';

class Pirates extends Component {
  
  render(){
    return (
      <div className='pirate'>
      <ul>
        {
          Object.keys(this.props.details).map( key => (
            <Pirate key={key}
            details={this.props.details[key]}
            />
          ))
        }
        </ul>
      </div>
      )
    }
  }
  export default Pirates;
  ```



To delete a pirate we need to accomodate Firebase:

```js
removePirate(key){
  const pirates = {...this.state.pirates}
  pirates[key] = null
  this.setState({pirates})
}
```

Add support for deletion.

```js
import React, { Component } from 'react';
import Pirates from './Pirates';
import PirateDetail from './PirateDetail';

import Header from './Header'
import Home from './Home';
import base from '../base';
import Nav from './Nav';
import { Route, Switch } from 'react-router-dom'

class App extends Component {
  
  constructor() {
    super();
    this.removePirate = this.removePirate.bind(this);
    this.state = {
      pirates: {}
    }
  }

  componentDidMount(){
    this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
      context: this,
      state: 'pirates'
    })
  }

  componentWillUmount(){
    base.removeBinding(this.ref)
  }

  removePirate(key){
    console.log(key)
    const pirates = {...this.state.pirates}
    pirates[key] = null
    this.setState({pirates})
  }
  
  render() {
      
      return(
        <Route>
        <React.Fragment>
        <Header headline='Pirates!' />
        <Nav />
        <Switch>
        <Route exact path='/' component={Home} />
        
        <Route exact path='/pirates' render={(props) => (
          <Pirates {...props} details={this.state.pirates}
          removePirate  = {this.removePirate}  />
          )
        } />
        
        <Route path='/pirates/:number' render={(props) => (
          <PirateDetail {...props} details={this.state.pirates} />
          )
        } />
        
        </Switch>
        </React.Fragment>
        </Route>
        )
      }
    }
    
    export default App;
```

Pirates.js

```js
import React, { Component } from 'react';
import Pirate from './Pirate'
import '../assets/css/Pirate.css';

class Pirates extends Component {
  
  render(){
    return (
      <div className='pirate'>
      <ul>
        {
          Object.keys(this.props.details).map( key => (
            <Pirate key={key}
            index={key}
            details={this.props.details[key]}
            removePirate = {this.props.removePirate}
            />
          ))
        }
        </ul>
      </div>
      )
    }
  }
  export default Pirates;
  ```

  Pirate.js

  ```js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Pirate.css'

class Pirate extends Component {
  render(){
    const { details } = this.props;
    return (
      <React.Fragment>
          <Link to={`pirates/${details._id}`}>{details.name}</Link> 
          <li><button onClick={() => this.props.removePirate(this.props.index)}>✖︎</button></li>
        </React.Fragment>
      )
    }
  }
  export default Pirate;
```

PiratesDetails

```js
import React from 'react';
import { Link } from 'react-router-dom'

const PirateDetail = (props) => {

const pirate = props.details.filter(
  p => p._id === props.match.params.number
  )
  
  const pirateDeet = pirate[0];
  
  return (
    <div className='pirate'>
    <ul>
    <li>Name: {pirateDeet.name}</li>
    <li>Vessel: {pirateDeet.vessel}</li>
    <li>Weapon: {pirateDeet.weapon}</li>
    </ul>
    <Link to='/pirates'>Back</Link>
    </div>
    )
  }
  
  export default PirateDetail
  ```

Test in the browser. Check that the Database > Rules are set properly:

```js
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Bi-Directional Data

We will now use `AddPirateForm` to allow the user to edit the pirates from a single location.

Set a route 

```
import React from 'react';
import {NavLink} from 'react-router-dom';
import '../assets/css/Nav.css'

function Nav(){
  return (
    <ul className="nav">
      <li>
        <NavLink exact to='/'>Home</NavLink>
      </li>
      <li>
        <NavLink to='/add'>Add Pirate</NavLink>
      </li>
      <li>
        <NavLink to='/pirates'>Pirates</NavLink>
      </li>
    </ul>
  )
}

export default Nav
```

Add it to App:

```
import AddPirateForm from './AddPirateForm';
...
<Route path='/add' component={AddPirateForm} />
```

```
<Route path='/add' render={ (props) => (
  <AddPirateForm {...props} /> )} />
```

Make the state available to the `PirateForm`

```js
<Route path='/add' render={ (props) => (
  <AddPirateForm
  {...props}
  details={this.state.pirates}
  addPirate={this.addPirate} />)} />
```

AddPirateForm

```js
import React, { Component } from 'react';
import '../assets/css/AddPirateForm.css';

class AddPirateForm extends Component {

  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
  }

  render() {
    
    return (
      <React.Fragment>
        {Object.keys(this.props.details).map(this.renderPirates)}
      <form ref={ (input)=>this.pirateForm = input } onSubmit={ (e) => this.createPirate(e) }>
        <input ref={ (input) => this.name = input } type="text" placeholder="Pirate name" />
        <input ref={ (input) => this.vessel = input } type="text" placeholder="Pirate vessel" />
        <input ref={ (input) => this.weapon = input } type="text" placeholder="Pirate weapon" />
        <button type="submit">Add Pirate</button>
      </form>
      </React.Fragment>
    )
  }

  renderPirates(key){
    const pirate = this.props.details[key]
    return (
    <div key={key}>
      <p>{key}</p>
      <input value={pirate.name} type="text" name="name" placeholder="Pirate name" />
      <input value={pirate.weapon} type="text" name="weapon" placeholder="Pirate weapon" />
      <input value={pirate.vessel} type="text" name="vessel" placeholder="Pirate vessel" />
    </div>
    )
  }

  createPirate(e) {
    e.preventDefault();
  
    const pirate = {
      name: this.name.value,
      vessel: this.vessel.value,
      weapon: this.weapon.value,
    }
    this.props.addPirate(pirate);
    this.pirateForm.reset()
  }


}

export default AddPirateForm;
```

React only allows you to put state into a field if you have the intention of editing it. We will use `onChange`.

```jsx
<input value={pirate.name}
  onChange={ (e) => this.handleChange(e, key) }
  type="text" name="name" placeholder="Pirate name" />
```

Create the method:

```js
handleChange(e, key){
  const pirate = this.props.details[key]
}
```

Remember to bind it in the constructor:

```js
constructor() {
  super();
  this.renderPirates = this.renderPirates.bind(this);
  this.handleChange = this.handleChange.bind(this);
}
```

Test by sending the pirate to the console:

```js
  handleChange(e, key){
    const pirate = this.props.details[key]
    console.log(pirate)
    console.log(e.target)
    console.log(e.target.value)
    console.log(e.target.name, e.target.value)
  }
```

Note the values for `e.target.name` and `e.target.value`.

Values need to be put into state.

<!-- We need a copy of the object. This is the old method:

`const updatedPIrate = Object.assign([], pirate)` -->

We will use spread operator and overlay the new properties on top of it. `e.target.name` gives us the property name so we will use what's known as a computed property:

```js
handleChange(e, key){
  const pirate = this.props.details[key]
  const updatedPirate = {
    ...pirate,
    [e.target.name]: e.target.value
  }
  console.log(updatedPirate)
}
```

## Moving the Function to App.js

Pass the updated pirate to the App component for updating.

* `App.js`:

```js
updatePirate(key, updatedPirate){
  const pirates = {...this.state.pirates};
  pirates[key] = updatedPirate;
  this.setState({ pirates })
}
```

Pass the method to the component.

`updatePirate={this.updatePirate}`:

```js
<PirateForm
  updatePirate={this.updatePirate}
  pirates={this.state.pirates}
  addPirate={this.addPirate}
  loadSamples={this.loadSamples}
/>
```

Bind it.

* `App.js`:

```js
constructor() {
  super();
  this.addPirate = this.addPirate.bind(this);
  this.loadSamples = this.loadSamples.bind(this)
  this.updatePirate = this.updatePirate.bind(this)
  this.state = {
    pirates: {}
  }
}
```

* `PirateForm.js`:

```js
handleChange(e, key){
  const pirate = this.props.pirates[key]
  const updatedPirate = {
    ...pirate,
    [e.target.name]: e.target.value
  }
  this.props.updatePirate(key, updatedPirate);
}
```

Test and note the data sync between the form and the Pirate listing above.

Add the onChange handler to the other fields.

```js
renderPirates(key){
  const pirate = this.props.details[key]
  return (
    <div key={key}>
    <p>{key}</p>
    <input value={pirate.name} onChange={ (e) => this.handleChange(e, key) } type="text" name="name" placeholder="Pirate name" />
    <input value={pirate.weapon} onChange={ (e) => this.handleChange(e, key) } type="text" name="weapon" placeholder="Pirate weapon" /> 
    <input value={pirate.vessel} onChange={ (e) => this.handleChange(e, key) } type="text" name="vessel" placeholder="Pirate vessel" /> 
    </div>
    )
  }
```

Test and exmine Firebase. We now have two way communication with the database. No Submit button required.

## Authentication

* Firebase:

Enable Github authentication in Firebase under `Authentication > Sign In Method`

* Github:

Sign in, navigate to `Settings` (top left under your account). Find `Developer Settings > OAuth Apps` and register a new OAuth application.

Copy the URL from Firebase and enter the Client ID and Client Secret into Firebase.

* `AddPirateForm.js`:

```js
renderLogin(){
  return (
    <div>
    <p>Sign in</p>
    <button onClick={ () => this.authenticate('github') } >Log in with Github</button>
    </div>
    )
}
```

and bind it

```js
this.renderLogin = this.renderLogin.bind(this);
```

Set an initial value for uid in state:

```js
constructor() {
  super();
  this.renderPirates = this.renderPirates.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.renderLogin = this.renderLogin.bind(this);
  this.state = {
    uid: null
  }
}
```

Add an if statement that shows a button to log in:

<!-- ```js
render(){
  const logout = <button>Log Out</button>;
  if(!this.state.uid) {
    return <div>{this.renderLogin()}</div>
  }

  return (
    <div>
    {logout}
    <h3>Pirate Form Component</h3>
    {Object.keys(this.props.pirates).map(this.renderPirates)}
    <h3>Pirate Form Component</h3>
    <AddPirateForm addPirate={this.props.addPirate} />
    <button onClick={this.props.loadSamples}>Load Sample Pirates</button>`
    </div>
    )
  }
}
``` -->

```js
render(){

  const logout = <button>Log Out</button>;
  if(!this.state.uid) {
    return <div>{this.renderLogin()}</div>
  }

  return (
    <div>
    {logout}
    <h3>Pirate Form Component</h3>
    {Object.keys(this.props.pirates).map(this.renderPirates)}
      <AddPirateForm addPirate={this.props.addPirate} />
      <button onClick={this.props.loadSamples}> Load Sample Pirates </button>
    </div>
    )
}
```

Note the code location here - in the render method but not in the return. Also note the use of the `logout` variable in the return statement.

Create the authenticate method and bind it

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.state = {
      uid: null
    }
  }

  authenticate(provider){
    console.log(`Trying to log in with ${provider}`)
  }
```

And click on the button to test.

Import base:

```js
import base from '../base';
```

```js
authenticate(provider){
  console.log(`Trying to log in with ${provider}`);
  base.authWithOAuthPopup(provider, this.authHandler);
}

authHandler(err, authData) {
  console.log(authData)
}
```

Test.

Bind the authHandler:

`this.authHandler = this.authHandler.bind(this);`

If no error add uid to state.

```js
authHandler(err, authData) {
  console.log(authData)
  if (err){
    console.log(err);
    return;
  }
  this.setState({
    uid: authData.user.uid
  })
}
```

Test and note any messages in the console. Make changes in Firebase to allow the sign in provider if necessary.

Refresh is a problem. Use a lifecycle hook.

```js
componentDidMount(){
  base.onAuth((user) => {
    if(user) {
      this.authHandler(null, {user});
    }
  })
}
```

Log Out

```js
logout(){
  base.unauth();
  this.setState({uid: null})
}
```

Bind it

`this.logout = this.logout.bind(this);`

Add a call to the method in the button

```js
render(){
  const logout = <button onClick={() => this.logout()}>Log Out</button>;
```

Test by logging in and out. Note the user in Firebase. This can be deleted if you need to re-login.


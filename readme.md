# IX - React, React Router

## Homework

Update state in react-pirates using returned data from the back end. Or, simply resolve the current state updates so there is no [Object][object].

<!-- Review the Routing notes and complete a nested route to the pirates display page that links to a pirate detail screen. -->

<!-- For your final project you will create a version of the recipes list and details pages in React.

Of course, if you wish you can do something entirely original. Just propose it. -->

## Reading

* [React Router](https://reacttraining.com/react-router/web/guides/quick-start)

## Persisting the Data Continued

CD into `express-pirates` `npm i` and `code .`
CD into `react-pirates` `npm i` and `code .`

`npm i` and fire up the express app. `npm i` and fire up the react app.

## Loading Review

The loading state should be used to indicated that an asynchronous request is happening. Set an `isLoading` property in the constructor:

```js
  this.state = {
    pirates: {},
    isLoading: true
  }
}
```

Turn it off once the data is loaded:

```js
componentDidMount(){
  this.setState({ isLoading: true });
  fetch('http://localhost:3005/api/pirates')
  .then(response => response.json())
  .then(pirates => this.setState({pirates, isLoading: false}))
}
```

In your render() method you can use React’s conditional rendering to display either a loading indicator or the resolved data.

```js
render() {

  const { isLoading } = this.state;

  if (isLoading) {
    return <p>Loading ...</p>;
  }
```

Test the loading by going to Chrome dev tools `> Network > Online` and set it to `Slow 3G`. 

As an exercise you could try implementing a [React Content Loader](https://github.com/danilowoz/react-content-loader).

## Error Handling

The second state that you could keep in your local state would be an error state. Create a new entry in state:

```js
  this.state = {
    pirates: {},
    isLoading: false,
    error: null
  }
}
```

Add error handling to the initialization and a new render method to support it:

```js
componentDidMount(){
  this.setState({ isLoading: true });
  fetch('http://localhost:3005/api/pirates')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Something went wrong ...');
    }
  })
  .then(pirates => this.setState({pirates, isLoading: false}))
  .catch(error => this.setState({ error, isLoading: false }));
}

  render() {
  
    if (this.error) {
      return <p>{this.error.message}</p>;
    }
  
    if (this.isLoading) {
      return <p>Loading ...</p>;
    }
```

Use destructuring:

```js
render() {
  const { isLoading, error } = this.state;

  if (error) {
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading ...</p>;
  }
```

Try to induce an error by changing the connection string to the back end.

## Axios

You can substitute the native fetch API with another library. A commonly used library for fetching data is axios. It simplifies error reporting and is compatible with browsers that do not support the fetch API.

`cd` into `react-pirates` and install axios in your project with `npm install axios -S`.

Refactor using axios instead of the fetch API:

```js
import axios from 'axios';
...
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
```

Axios returns a JavaScript promise but you don’t have to resolve the promise two times, because axios already returns a JSON response for you. When using axios all errors are caught in the `catch()` block. 

## Removing Pirates

Currently our `removePirate` function removes pirates from state but has no effect on the database.

Let's use axios and a get query to delete a pirate.

```js
removePirate(key){
  const pirates = {...this.state.pirates}
  console.log(key)
  console.log(this.state.pirates[key]._id)
  let pirateDel = this.state.pirates[key]._id;
  axios.get(`http://localhost:3005/api/pirates/${pirateDel}`)
  .then(delete pirates[key])
  .then(this.setState({pirates}))
}
```

Create a corresponding end point in `express` for deleting a pirate.

```js
app.get('/api/pirates/:id', function(req, res){
  let id = req.params.id;
  Pirate.deleteOne({ _id: id}, result => {
    return res.sendStatus(200)
  })
})
```

We no longer need our React Load Sample Pirates. Delete - `App.js`:

```js
// import piratesFile from './data/sample-pirates-object';
...
// this.loadSamples = this.loadSamples.bind(this);
...
// loadSamples() {
//   this.setState({
//     pirates: piratesFile
//   })
// }
```

Edit: 

```js
<PirateForm addPirate={this.addPirate} />
```

And in the PirateForm:

```js
<h3>Pirate Form Component</h3>
  <AddPirateForm addPirate={this.props.addPirate} />
  // <button onClick={this.props.loadSamples}>Load Sample Pirates</button>
</div>
```

## Adding Pirates

React `App.js`:

```js
addPirate(pirate) {
  console.log(pirate)
  const pirates = {...this.state.pirates}
  axios.post('http://localhost:3005/api/pirates/', pirate )
  .then(response => response.data)
  .then(this.setState({ pirates: pirates }))
}
```

Express:

```js
app.post('/api/pirates', function(req, res){
  Pirate.create( req.body, (err, pirate) => {
    if (err) return console.log(err);
    return res.send(pirate)
  })
})
```

Try adding a pirate using the form. You need to refresh the page afterwards in order to see the pirate.

Let's update state after the post operation.

React `App.js`:

```js
addPirate(pirate) {
  const pirates = { ...this.state.pirates }
  axios.post('http://localhost:3005/api/pirates/', pirate)
  pirates[pirate] = pirate
  this.setState({ pirates: pirates })
}
```

Axios returns a promise. Use the promise to add the new pirate to pirates and then update state:

```js
addPirate(pirate) {
  const pirates = { ...this.state.pirates }
  axios.post('http://localhost:3005/api/pirates/', pirate)
  .then ( pirates[pirate] = pirate )
  .then(this.setState({ pirates: pirates }))
}
```

<!-- .then(response => this.setState({ pirates: response.data })) -->

## Routing

We will create a separate project to examine React's front end router.

Create a new project in today's directory.

`npx create-react-app simple-router`

Move the `components` folder from the `other` directory into the `src` folder. 

`cd` into it, `code .` and `npm start` it.

Clean up the default distro by deleting unnecessary files.

Review [static routing](https://reacttraining.com/react-router/core/guides/philosophy) in ExpressJS. Compare this to React's [dynamic routing](https://reacttraining.com/react-router/core/guides/philosophy/dynamic-routing).

React Router offers environment specific packages for web browsers or [native web apps](https://facebook.github.io/react-native/)) versions.

Since we are in a browser we'll install `react-router-dom`.

`npm i -S react-router-dom`

Next we need to decide between [hash routing](https://reacttraining.com/react-router/web/api/HashRouter) and [browser routing](https://reacttraining.com/react-router/web/api/BrowserRouter). The hash router is appropriate for static websites so we will use the `BrowserRouter`.

The browser router only works with a single child so let's nest our `App` component within it.

`index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))
```

Examine the `Router` component using the React browser add in and note the history props. The most important property of a history object is `location`. The location object reflects where your application currently is. Under the hood, React router is using the html5 [history API](https://css-tricks.com/using-the-html5-history-api/). Prior to this, SPA developers commonly used [url hashes](https://coderexample.com/single-page-apps-jquery-routing/) (which do not cause a page refresh) to load and off load DOM elements.

Let's implement some top level routing in `App`.

First, render the imported components.

`App`:

```js
import React from 'react'
import Header from './Header'
import Main from './Main'

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

export default App
```

We will implement routes in Main.

Edit `Main`:

```js
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Pirates from './Pirates'
import Gallery from './Gallery'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/pirates' component={Pirates}/>
      <Route path='/gallery' component={Gallery}/>
    </Switch>
  </main>
)

export default Main
```

The `<Route>` component is the main building block of React Router. Anywhere that you want to only render content based on the location’s pathname, you should use a `<Route>` element. A `<Route>` expects a `path `prop - is a string that describes the pathname that the route matches . 

Since `/` is part of `/pirates` and `/gallery` it matches both of them. We need to use `exact` on this route.

You can manually change the path in the browser's location field (e.g. `http://localhost:3001/pirates`) to see the effects.

We will create links in the `Header` component.

Edit `Header`:

```js
import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/pirates'>Pirates</Link></li>
        <li><Link to='/gallery'>Gallery</Link></li>
      </ul>
    </nav>
  </header>
)

export default Header
```

`Header` creates links that can be used to navigate between routes that are declared in `Main`. 

Instead of `<a href="/">` we use `<Link to="/">`. `<Link>`s use the `to` prop to describe the location that they should navigate to. Wherever you render a `<Link>`, an anchor (`<a>`) will be rendered in your application’s HTML. `<Link>`s do not cause a page refresh.

Another type of link is provided called [NavLink](https://reacttraining.com/react-router/web/api/NavLink). It  applies a class of active when the path is matched.

Edit `Header`:

```js
import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><NavLink exact to='/'>Home</NavLink></li>
        <li><NavLink to='/pirates'>Pirates</NavLink></li>
        <li><NavLink to='/gallery'>Gallery</NavLink></li>
      </ul>
    </nav>
  </header>
)

export default Header
```

Create `Pirate.css` in `src`:

```css
nav ul {
  display: flex;
  list-style: none;
}
nav ul a {
  color: #007eb6;
  text-decoration: none;
  padding: 0.25rem;
}
.active {
  color: #fff;
  background: #007eb6;
}
```

And in `index.js`:

`import './Pirate.css'`

### Nested Routes

The pirate detail route is not included in Main's primary `<Switch>`. It will be rendered by the Pirates component which is rendered whenever the path begins with `/pirates`.

Edit `Pirates.js` to include nested routes.

`Pirates`:

```js
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import AllPirates from './AllPirates'
import Pirate from './Pirate'

const Pirates = () => (
  <Switch>
    <Route exact path='/pirates' component={AllPirates}/>
    <Route path='/pirates/:number' component={Pirate}/>
  </Switch> 
)

export default Pirates
```

The Pirates component matches one of two different routes depending on the full pathname.

Note the use of params here. `:number` will be captured and stored in props as `match.params.number` in a `pirate` detail component.

Create stub templates for  `AllPirates` and `Pirate`.

`AllPirates`:

```js
import React from 'react';

const AllPirates = () => (
  <p>AllPirates</p>
)

export default AllPirates;
```

`Pirate`:

```js
import React from 'react';

const Pirate = () => (
  <p>Pirate</p>
)

export default Pirate;
```

### Displaying a list of pirates

We will need something to clock on at the `/pirates` route. We'll use a list of pirates. 

Create `api.js` - a simple data API that will be used to get the data for our components - inside `src`:

```js
const PiratesAPI = {
  pirates: [{
    "number": 1,
    "name": "John Rackham",
    "image": "avatar.svg",
    "desc": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam fuga minus molestiae placeat ad iure asperiores nam, recusandae dolor quasi debitis, eveniet reiciendis veritatis et! Sit provident, praesentium laborum tempore.",
    "year": 1724,
    "weapon": "Sword",
    "vessel": "Bounty"
  }, {
    "number": 2,
    "name": "Donald Trump",
    "image": "avatar.svg",
    "desc": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia consectetur, praesentium eaque ad odit. Nihil molestiae ut temporibus commodi natus delectus cumque architecto, eligendi ad repellat, quasi porro eos dignissimos.",
    "year": 1800,
    "weapon": "Twitter",
    "vessel": "Bounty"
  }, {
    "number": 3,
    "name": "Sea Dog",
    "image": "avatar.svg",
    "desc": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem autem rerum, nam minima dolorum blanditiis, velit aliquid assumenda illum totam magni sint laudantium laboriosam odit minus distinctio repellendus. Cumque, quod.",
    "year": 1684,
    "weapon": "Sword",
    "vessel": "Bounty"
  }, {
    "number": 4,
    "name": "Jean Lafitte",
    "image": "avatar.svg",
    "desc": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus pariatur ratione dicta, neque sed, odio maxime, saepe autem libero dolore nobis. Dicta deleniti, illo natus nemo suscipit impedit quod amet!",
    "year": 1629,
    "weapon": "Sword",
    "vessel": "Bounty"
  }, {
    "number": 5,
    "name": "Crab McPirate",
    "image": "avatar.svg",
    "desc": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam magnam ullam eveniet eius provident, omnis quos ex quam maiores id fugit accusantium ea ipsa tenetur excepturi vero quis nulla aliquid!",
    "year": 1734,
    "weapon": "Sword",
    "vessel": "Bounty"
  },
  {
    "number": 6,
    "name": "Crabby McPirate",
    "image": "avatar.svg",
    "desc": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam magnam ullam eveniet eius provident, omnis quos ex quam maiores id fugit accusantium ea ipsa tenetur excepturi vero quis nulla aliquid!",
    "year": 1734,
    "weapon": "Sword",
    "vessel": "Bounty"
  }],
  all: function() { 
    return this.pirates
  },
  get: function(id) {
    const isPirate = p => p.number === id
    return this.pirates.find(isPirate)
  }
}

export default PiratesAPI
```

Note the two functions: `all` and `get` included in the api. We'll use them in AllPirates to iterate over all of the pirates and create a link to their details page.

Edit `AllPirates`:

```js
import React from 'react'
import PiratesAPI from '../api'
import { Link } from 'react-router-dom'

const AllPirates = () => (
  <React.Fragment>
  <ul>
    {
      PiratesAPI.all().map(p => (
        <li key={p.number}>
          <Link to={`/pirates/${p.number}`}>{p.name}</Link>
        </li>
      ))
    }
  </ul>
  </React.Fragment>
)

export default AllPirates
```

Note the use of `key` and the unique pirate number being used to create the link. Try removing the `key` to see the warning message. 

`<React.Fragment>` is simply a way of creating a nested call to React.createComponent() - not really necessary here but useful when you don't want to use a `div`.

Our route `<Route path='/pirates/:number' component={Pirate}/>` is working but should display additional information to the user.

Import the api and `Link` from the router. Also, use a function with a return value.

`Pirate.js`:

```js
import React from 'react';
import PiratesAPI from '../api'
import { Link } from 'react-router-dom'

const Pirate = () => {
  return (
    <p>Pirate</p>
  )
}

export default Pirate;
```

Now we can use the router props to extract the param:

```js
import React from 'react';
import PiratesAPI from '../api'
import { Link } from 'react-router-dom'

const Pirate = (props) => {
  console.log(props.match.params.number)
  return (
    <p>Pirate</p>
  )

}

export default Pirate;
```

Note that the param is a string:

`console.log(typeof(props.match.params.number))`

We'll use the `get` function in our api to find the pirate by its number:

```js
import React from 'react';
import PiratesAPI from '../api'
import { Link } from 'react-router-dom'

const Pirate = (props) => {
  
  const pirate = PiratesAPI.get(
    parseInt(props.match.params.number, 10)
  )

  console.log(pirate)

  return (
    <p>Pirate</p>
  )

}

export default Pirate;
```

Now we can populate the return with properties from the pirate object:

```js
import React from 'react'
import PiratesAPI from '../api'
import { Link } from 'react-router-dom'

const Pirate = (props) => {

  const pirate = PiratesAPI.get(
    parseInt(props.match.params.number, 10)
  )
  
  return (
    <div>
      <h1>{pirate.name} (#{pirate.number})</h1>
      <h2>Weapon: {pirate.weapon}</h2>
      <Link to='/pirates'>Back</Link>
    </div>
  )
}

export default Pirate
```

The variable `Pirate` looks up the pirate using the number parsed from the URL's pathname. 

If no pirate is found with the given number, then a message is displayed.

```js
import React from 'react'
import PiratesAPI from '../api'
import { Link } from 'react-router-dom'

const Pirate = (props) => {
  console.log(props.match.params.number)
  const pirate = PiratesAPI.get(
    parseInt(props.match.params.number, 10)
  )

  if (!pirate) {
    return <div>Sorry, but the pirate was not found</div>
  }
  
  return (
    <div>
      <h1>{pirate.name} (#{pirate.number})</h1>
      <h2>Weapon: {pirate.weapon}</h2>
      <Link to='/pirates'>Back</Link>
    </div>
  )
}

export default Pirate
```

We used path params to capture a variable. Examine a single Pirate component and find the `match.params.number` property. (The variable is stored as a string.) We convert it to a number using `parseInt` base 10 and use it to fire the `get` function in our API. We also add a provision for a pirate of that number not being found.

Save and shut down the simple router.

## Routing in react-pirates

We will attempt to add routing to our current project. The goal is to create a master / detail view for our pirates.

Install

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

Looking at the structure of components, it appears that we will have to use `App` as a branching point for our route.

`App.js`:

```js
import { Switch, Route } from 'react-router-dom';
import Pirates from './components/Pirates';
import PirateDetail from './components/PirateDetail';
...
    return (
      <div className="App">
        <Header headline="Pirates!" />
    
        <Switch>
          <Route exact path='/' component={Pirates} />
    
          <Route path='/pirates/:number' component={PirateDetail} />
        </Switch>
    
        <PirateForm addPirate={this.addPirate} />
      </div>
    );
  }
```

We need to create a `PirateDetail` and a `Pirates` component. We will no longer be using the `Pirate` component.

`PirateDetail`:

```js
import React from 'react';

const PirateDetail = () => (
  <p>PirateDetail</p>
)

export default PirateDetail;
```

`Pirates.js`:

```js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Pirate.css';

class Pirate extends Component {
  render(){
    return (
      <div className='pirate'>
      <ul>
        <li><Link to={`pirates/10`}>Pirate</Link></li>
        </ul>
      </div>
      )
    }
  }
  export default Pirate;
```

Edit `PirateDetail` to include a Link back to home.

`PirateDetail.js`:

```js
import React from 'react'
import { Link } from 'react-router-dom'

const PirateDetail = (props) => (
  <div className='pirate'>
  <ul>
    <li>Pirate Detail</li>
  </ul>
  <Link to='/'>Back</Link>
  </div>
)

export default PirateDetail
```

For this example we are going to use a different [method for rendering the component](https://reacttraining.com/react-router/web/api/Route). In the previous exercise we used the `<Route component>` method: `<Route exact path='/pirates' component={AllPirates}/>` Here we will use the `<Route render>` method. This will allow us to pass in additional props on top of the Route props (match, location, history).

We will use the `render` route to pass state to Pirates:

```js
return (
  <div className="App">
    <Header headline="Pirates!" />

    <Switch>
      <Route exact path='/' render={(props) => (
      <Pirates {...props} details={this.state.pirates}  />
      )} />

      <Route path='/pirates/:number' component={PirateDetail} />
    </Switch>

    <PirateForm addPirate={this.addPirate} />
  </div>
);
```

Use the React inspector to examine the Pirate component. Note that it has access to a details prop in addition to the routing props.

Now we will use the details props to render our pirates list.

Edit `Pirates.js`:

```js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Pirate.css';

class Pirate extends Component {
  
  render(){
    const { details } = this.props.details;
    return (
      <div className='pirate'>
      <ul>

        {
          this.props.details.map( p => (
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
  export default Pirate;
```

NB: `Pirate.css`:

```css
.pirate ul {
  display: flex;
  flex-direction: column;
  list-style: none;
}
```

Let's try fleshing out the detail view.

Edit `PirateDetail`:

```js
import React from 'react';
import { Link } from 'react-router-dom'

const PirateDetail = (props) => {

const pirate = props.details.filter(
  p => p._id === props.match.params.number
  // p => p.name === 'Gary Glitter'
  )
  
  console.log(pirate)
  
  return (
    <div className='pirate'>
    <ul>
    <li>{pirate[0].name}</li>
    </ul>
    <Link to='/'>Back</Link>
    </div>
    )
  }
  
  export default PirateDetail
```

We will need to pass state to this component as well:

```js
<Switch>
  <Route exact path='/' render={(props) => (
  <Pirates {...props} details={this.state.pirates}  />
  )} />

  <Route path='/pirates/:number' render={(props) => (
    <PirateDetail {...props} details={this.state.pirates} />
  )} />
</Switch>
```

## Notes

`<React.Fragment>`


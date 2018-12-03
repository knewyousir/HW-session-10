# IX - React, React Router

`https://itnext.io/that-data-looks-so-fetching-on-you-understanding-the-js-fetch-api-880eae0c8d25`
`https://stackoverflow.com/questions/37555031/why-does-json-return-a-promise`
`https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch`
`https://reactjs.org/docs/state-and-lifecycle.html`

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

## Adding Pirates Using Fetch

React `App.js`:

```js
addPirate(pirate) {
  this.setState({ isLoading: true });
  const locPirates = { ...this.state.pirates }
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

Try adding a pirate using the form.

## Adding Pirates Using Axios

```js
addPirate(pirate) {
  console.log(pirate)
  const pirates = {...this.state.pirates}
  axios.post('http://localhost:3005/api/pirates/', pirate )
  .then(response => response.data)
  .then(this.setState({ pirates: pirates }))
}
```

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


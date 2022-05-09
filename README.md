# CHAT CHALLENGE


## Installation

Use [Create React App](https://github.com/facebook/create-react-app).

Once it has finished installing, open the directory, and run:

```sh
npm install --save socket.io-client@2.2.0
```

Which installs [socket.io](https://socket.io/). This will allow us real-time communications.

## Cleaning up

Clean the directory. Remove:
- `App.css`
- `App.test.js`
- `logo.svg`

Remove references to
- `App.css` in `App.js`
- `logo.svg` in `App.js`

## Wiring

Then, import socket-io in `App.js`:

```js
// App.js
...
import io from 'socket.io-client';
...
```

Finally, make it so socket.io runs when the app mounts:

```js
// App.js -- this is  the full file
import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {

  state = {
    isConnected:false
  }
  socket = null

  componentWillMount(){

    this.socket = io('https://codi-server2.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })

    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

    /** this will be useful way, way later **/
    this.socket.on('room', old_messages => console.log(old_messages))


  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  render() {
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
      </div>
    );
  }
}

export default App;

```

Try the app, run `npm start` (or `yarn start`).

You should see `status: connected`. If internet cuts off, this will turn to `status: disconnected`.

The server is set to send something as soon as you connect.

The event listener `this.socket.on('connect')` is common to all Apps that use `socket.io`. This server though has many more methods in its API.

The first of which is `ping`. Let's try to implement it. Next to where you have `socket.on('connect')`, write:

```js
...
this.socket.on('pong!',()=>{
  console.log('the server answered!')
})
...
```

And lower, in `render`:

```js
  render() {
    return (
      <div className="App">
        <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
        {/* We add the line below: */}
        <button onClick={()=>this.socket.emit('ping!')}>ping</button>
      </div>
    );
  }
```

**note**: it's important to use `ping!` and `pong!`, because `ping` and `pong` (without exclamation marks) are reserved by `socket.io` for internal usage.

Try it; open your console, press the button. You should see 'the server answered!'

This chat server is special though; when it sends back the `pong!` message, sends with it a payload ("payload" just means "some data"). To read it, let's put an argument where we receive the `pong!`

```js
  this.socket.on('pong!',(additionalStuff)=>{
    console.log('server answered!', additionalStuff)
  })
```

Try it!

Very good! Let's do one more thing now: get the unique ID of your user (each user gets a unique ID from the socket server).

```js
  state = {
    isConnected:false,
    id:null
  }
  ...
  this.socket.on('youare',(answer)=>{
    this.setState({id:answer.id})
  })
  ...
  render() {
    return (<div className="App">
      <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
      {/* add: */}
      <div>id: {this.state.id}</div>
      <button onClick={()=>this.socket.emit('ping!')}>ping</button>
      {/* and also add: */}
      <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
    </div>);
  }
```

Now we can get our unique ID (we can say we are "logged in").

We have:

1 - connected to the server
2 - verified we are connected
3 - have a way to ping the server to receive arbitrary data
4 - have a way to receive our user id and store it in the state

We're going to do two more things:

### 1 - Get a list of friends

We're going to receive the other connected people from the server. The server is already emitting this as soon as you connect, and calling it "peeps". Receive this array and **display it**, so you can see who is connected Display also the amount (which is just the `length` property of the array).  

Don't forget to add an empty array to the state so you don't get errors when you `map` over the array of `peeps`.
Next, you will listen on "new connection" and add the new id to your list of "peeps". Listen to "new disconnection" as well and remove the id from your list of "peeps".

Once that works, do 

### 2 - A Mysterious Event Listener

We're going to create a listen to the message "next" from the server:

```js
this.socket.on('next',(message_from_server)=>console.log(message_from_server))
```

And put a button that sends "give me next" to the server.
Follow the messages you recieve from the server till the end!

### 3 - Deploy your chat client to Heroku!

Once you have completed your chat client with whatever tweaks, designs and features you have created, deploy it to Heroku (check their documentation) and send us the link! This will signal the end of the challenge!

### 4 - Optionals to the second part of the Challenge

Create a nice UI for your chat application and add as many features as you like to it. We will be judging those for the  prize of this challenge. May the best app win!
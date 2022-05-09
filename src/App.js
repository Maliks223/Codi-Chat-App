import React, { Component } from "react";
import io from "socket.io-client";
import "./App.css";

class App extends Component {
  state = {
    isConnected: false,
    id: null,
    peeps: [],
    input: "",
    messages: [],
  };
  socket = null;

  componentWillMount() {
    this.socket = io("https://codi-server2.herokuapp.com");

    this.socket.on("connect", (e) => {
      this.setState({ isConnected: true });
      this.socket.emit("whoami");
    });
    this.socket.on("pong!", () => {
      console.log("the server answered!");
    });
    this.socket.on("peeps", (peeps) => {
      this.setState({ peeps: peeps });
    });
    this.socket.on("new connection", (id) => {
      this.setState({ peeps: [...this.state.peeps, id] });
    });
    this.socket.on("new disconnection", (idToRemove) => {
      this.setState({
        peeps: this.state.peeps.filter((id) => id !== idToRemove),
      });
    });
    this.socket.on("pong!", (additionalStuff) => {
      console.log("server answered!", additionalStuff);
    });
    this.socket.on("youare", (answer) => {
      this.setState({ id: answer.id });
    });
    // this.socket.on('next',(message_from_server)=>console.log(message_from_server))
    this.socket.on("disconnect", () => {
      this.setState({ isConnected: false });
    });

    /** this will be useful way, way later **/
    this.socket.on("room", (old_messages) =>
      this.setState({ messages: old_messages })
    );
    this.socket.on("room_message", (message) => {
      console.log(message);
      this.setState({ messages: [...this.state.messages, { ...message }] });
      this.setState({ input: "" });
    });
  }

  componentWillUnmount() {
    this.socket.close();
    this.socket = null;
  }

  render() {
    return (
      <div className="App">
        <div className="header"></div>
        <div className="main"></div>
        <div className="content">
          <div className="left-side">
            <div className="left-side-header">
              <h1>
                <span class="dot"></span>
                <span>Online Users ({this.state.peeps.length})</span>
              </h1>
            </div>
            <div className="left-side-content">
              {this.state.peeps.map((person, index) => {
                return <div key={index}>{person}</div>;
              })}
            </div>
          </div>
          <div className="right-side">
            <div className="right-side-header"></div>
            <div className="right-side-content">
              {this.state.messages.map((message, index) => {
                return (
                  <div key={index} className={message.id === this.state.id ? 'right-msg' : 'left-msg'}>
                    <h1>{message.name}</h1>
                    <h2>{message.date}</h2>
                    <h3>{message.text}</h3>
                  </div>
                );
              })}
            </div>
            <div className="input-message">
              <input
                type="text"
                value={this.state.input}
                onChange={(e) => this.setState({ input: e.target.value })}
              />
              <button
              className="send-msg"
                onClick={() =>
                  this.socket.emit("message", {
                    text: this.state.input,
                    id: this.state.id,
                    name: "Maliks",
                  })
                }
              >
                Send
              </button>
            </div>
          </div>
          {/* <div>status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
      <div>id: {this.state.id}</div> */}
        </div>
      </div>
    );
  }
}

export default App;

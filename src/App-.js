//import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/ads/');


export default class App extends Component {

  state = {
    isLoggedIn: false,
    messages: [],
    value: ''
  }


  onButtonClicked = (e) => {
    client.send(JSON.stringify({
      type: "message",
      message: this.state.value
    }));
    e.preventDefault();
  }

  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer.type);
      if (dataFromServer) {
        this.setState((state) =>
          ({
            messages: [...state.messages,
            {
              msg: dataFromServer.message,
            }]
          })
        );
      }
    };
  }


  render() {
    return (
      <div>
        {this.state.isLoggedIn ?
          <div>

            {this.state.messages.map(message => <p>message: {message.msg}</p>)}

            <form onSubmit={this.onButtonClicked}>
              <input placeholder="as_you_want"
                value={this.state.value}
                onChange={e => {
                  this.setState({ value: e.target.value });
                  this.value = this.state.value;
                }}
              />
              <input type="submit" value="Submit" />
            </form>

          </div>
          :
          <div>
            <form onSubmit={value => this.setState({ isLoggedIn: true, userName: value })}>
              <input placeholder="Enter Username" />
              <input type="submit" value="Submit" />
            </form>
          </div>
        }
      </div>
    )
  };
}
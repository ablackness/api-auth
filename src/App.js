import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Lock from 'auth0-lock';
const axios = require('axios');

class App extends Component {

// componentWillMount() {
//   this.lock = new Lock('RtRXTv64TE6Bo3F0PkjctLW6UVGMWVHl','codeblack.auth0.com', {
//     allowedConnections: ["Username-Password-Authentication","google-oauth2","facebook","twitter"],
//     rememberLastLogin: false,
//     socialButtonStyle: "big",
//     languageDictionary: {"title":"CAC"},
//     language: "en",
//     theme: {"primaryColor":"#3A99D8"}
//   })
// }

  render() {
    return (
      <Home lock = {this.lock} />
    )
  }
}

class Home extends Component {
  constructor() {
    super()

    this.showLock = this.showLock.bind(this);
    this.makeAxiosCall = this.makeAxiosCall.bind(this);
  }

  showLock() {
    this.props.lock.show();
  }

  makeAxiosCall() {
    console.log('axios call');
    var access_token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJVWTBPRUl6UTBJMU1qTTJOMFF5TURJNE1USkZRMFV5UkRWRE1USkdNREl4UkVJM05FWTVOZyJ9.eyJpc3MiOiJodHRwczovL2NvZGVibGFjay5hdXRoMC5jb20vIiwic3ViIjoidmd5UFBZTTRDVjNPUFVkOTBiaXhCZDFhYU9yVVNVWW1AY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImlhdCI6MTUxMjUyNzY5NywiZXhwIjoxNTEyNjE0MDk3LCJzY29wZSI6IndyaXRlOmluZm8iLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.y8N2B3i8pbl9oBpFUJlcD43gfjizieA492p6-vWg32EnqWZprsh9lVIWasirNXt4FZwudkvISeeFoXZbTV36qxP6pxtvM-HxuXN7W-FUhIpVn9RiFQ8wcNfC8dJFV9NpDi9gixFV0bf5DItfTFYmMSvtip_bw3i5x3RYaUZaYPG_NFQgZHUuu9G_sFXGGSeqZd_aTBAe42XKCGgknJVkpWLgtd8uxRNygNZn55854mbYexsk_d5acrCIefJaATxA0saTRH6FcZKz8S0MVs65QCPAG2BsaofzjKA9CBRSCp5VARVCuQY77l6CXKLubRgs95LtpnU7pviBxnDgnb8e5g';  
    // axios.get('http://localhost:8080/api/info', {headers: {Authorization: access_token}})
    //   .then(response => {
    //     console.log(response);
    //   })
    axios.post('http://localhost:8080/api/info', {name: 'something else', time: 'later'}, {headers: {Authorization: access_token}})
      .then(response => {
        console.log(response);
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.makeAxiosCall}>Click to Login</button>
      </div>
    )
  }
}

export default App;

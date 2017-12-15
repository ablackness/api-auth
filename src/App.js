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

    this.state = {
      access_token: null,
      expired: false,
      created_at: '',
      expiry_time: 86400,
      outputText: ['Text will appear here']
    }

    this.showLock = this.showLock.bind(this);
    this.makeAxiosCall = this.makeAxiosCall.bind(this);
    this.makePostCall = this.makePostCall.bind(this);
    this.authorizeClient = this.authorizeClient.bind(this);
    this.mapOverData = this.mapOverData.bind(this);

  }

  showLock() {
    this.props.lock.show();
  }

  authorizeClient() {
    const now = new Date().getTime() / 1000;
    console.log(now - this.state.created_at);
    console.log(process.env.CLIENT_ID);
    if (!this.state.access_token || (now - this.state.created_at > this.state.expiry_time)) {
      console.log('token is invalid, getting new token');
      axios.post('https://codeblack.auth0.com/oauth/token', {
        "audience": "http://localhost:8080",
        "grant_type": "client_credentials",
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET
      })
      .then( response => {
        this.setState({
          access_token: response.data.access_token,
          created_at: new Date().getTime() / 1000
        })
      });
    } else (console.log('token is still valid: ', this.state.access_token))

    // this.state.access_token ? console.log('token exists', this.state.access_token) : console.log('Token doesn\'t exist or is invalid, please request a token')
  }

  makeAxiosCall() {
    axios.get('https://ab-auth0-test.herokuapp.com/api/info', {headers: {Authorization: 'Bearer ' + this.state.access_token}})
    .then(response => {
      console.log(response);
      this.setState({
        outputText: response.data
      }) 
    })
  }
  
  makePostCall() {
    console.log('post');
    axios.post('https://ab-auth0-test.herokuapp.com/api/info', {name: 'something else', time: 'later'}, {headers: {Authorization: 'Bearer ' + this.state.access_token}})
    .then(response => {
      console.log(response);
    })
  }

  mapOverData(data) {
    return (
      data.map( item => {
        return <li key={item}>{item}</li>
      })
    )
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
        <button onClick={this.authorizeClient}>Click to Login</button>
        <button onClick={this.makeAxiosCall}>Make get call</button>
        <button onClick={this.makePostCall}>Make post call</button>
        <h4>Output will appear below</h4>
        <ul>{this.mapOverData(this.state.outputText)}</ul>
        
      </div>
    )
  }
}

export default App;

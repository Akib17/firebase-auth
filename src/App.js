import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
firebase.initializeApp(firebaseConfig)

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    image: '',
    password: '',
    error: '',
    formSwitch: false,
    isValid: true
  })
  const signInHandler = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user
        const signInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          image: photoURL
        }
        setUser(signInUser)
        console.log(user.image)
      })
      .catch(err => {
        console.log(err.message)
      })
  }
  const singOutHandler = () => {
    firebase.auth().signOut()
      .then(res => {
        const singOutUser = {
          isSignIn: false,
          name: '',
          email: '',
          image: ''
        }
        setUser(singOutUser)
      })
      .catch(err => {
        console.log(err.message)
      })
  }
  // Form Validation
  let validEmail = email => /^([a-z 0-9\.-]+)@([a-z0-9]+).([a-z0-9]{2,10}).([a-z0-9]{2, 10})?$/.test(email)
  var strongRegex = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)
  const inputHandler = (e) => {
    const userInfo = {
      ...user,
      [e.target.name]: e.target.value
    }
    let isValid = true
    if (e.target.name === 'email') {
      isValid = validEmail(e.target.value)
    }
    if (e.target.name === 'password') {
      isValid = strongRegex(e.target.value)
    }
    userInfo.isValid = isValid
    setUser(userInfo)
  }
  const createAccount = (e) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res)
          const newUser = { ...user }
          newUser.isSignIn = true
          newUser.error = ''
          setUser(newUser)
        })
        .catch(err => {
          console.log(err)
          const newUser = { ...user }
          newUser.isSignIn = false
          newUser.error = err.message
          setUser(newUser)
        })
    } else {
      console.log('Email or Password is INVALID')
    }

    e.preventDefault();
    document.getElementById('form').reset()
  }
  const formSwitch = e => {
    if (e.target.checked) {
      const newUser = { ...user }
      newUser.formSwitch = true
      setUser(newUser)
    } else {
      const newUser = { ...user }
      newUser.formSwitch = false
      setUser(newUser)
    }
  }
  const signInUser = e => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res)
          const newUser = { ...user }
          newUser.isSignIn = true
          newUser.error = ''
          setUser(newUser)
          console.log(user)
        })
        .catch(err => {
          console.log(err)
          const newUser = { ...user }
          newUser.isSignIn = false
          newUser.error = err.message
          setUser(newUser)
        })
    }
    e.preventDefault()
  }
  return (
    <div className="App">
      {
        user.isSignIn ? <button className="btn btn-info mt-4" onClick={singOutHandler}>Sign Out</button> :
          <button className="btn btn-info mt-4" onClick={signInHandler}>Sign In</button>
      }
      {
        user.isSignIn &&
        <div className="userInfo">
          <h3> Welcome to {user.name} </h3>
          <h5> {user.email} </h5>
          <img src={user.image} alt="" />
        </div>
      }

      <div className="container">
        <div className="row my-5">
          <div className="col-8 offset-2">
            <div className="form-group">
              <input className="form-check-input" type="checkbox" name="Switch form" id="registeredUser" onChange={formSwitch} />
              <label className="form-check-label" htmlFor="registeredUser">Registered user?</label>
            </div>
            <form style={{display: user.formSwitch ? 'block' : 'none'}} onSubmit={signInUser} id="form">
              <input type="text" onBlur={inputHandler} name="email" placeholder="Your email" className="form-control" />
              <br />
              <input type="password" onBlur={inputHandler} name="password" placeholder="Your password" className="form-control" />
              <br />
              <input type="submit" value="Sign In" className="btn btn-info" />
            </form>
            <form style={{display: user.formSwitch ? 'none' : 'block'}} onSubmit={createAccount} id="form">
              <input type="text" onBlur={inputHandler} name="name" className="form-control" placeholder="Your name" />
              <br />
              <input type="text" onBlur={inputHandler} name="email" placeholder="Your email" className="form-control" />
              <br />
              <input type="password" onBlur={inputHandler} name="password" placeholder="Your password" className="form-control" />
              <br />
              <input type="submit" value="Create Account" className="btn btn-info" />
            </form>
            {
              user.error && <p className="mt-3" style={{ color: 'red' }}> {user.error} </p>
            }
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;

import React, { useContext, useState } from 'react';
import './Login.css'
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.confiq';
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }else {
    firebase.app(); 
  }


const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: false
      })

    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };
    
    const handleGoogleSignIn = () => {
        var googleProvider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(googleProvider)
        .then(res => {
            const {displayName, email} = res.user;
            const signInUser = {name: displayName, email};
            // console.log(signInUser);
            setLoggedInUser(signInUser);
            history.replace(from);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log(errorCode, errorMessage, email, credential)
        });
    }

    const handleFacebookSignIn = () => {
        var facebookProvider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(facebookProvider)
        .then(res => {
            const {displayName, email} = res.user;
            const signInUser = {name: displayName, email};
            // console.log(signInUser);
            setLoggedInUser(signInUser);
            history.replace(from);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.log(errorCode, errorMessage, email, credential)
        });
    }

    const handleBlur = (event) => {
        // console.log(event.target.name, event.target.value);
        let isFieldValid = true;
        if(event.target.name == 'email'){
            isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
        }
        if(event.target.name == 'password'){
            const passwordValid = event.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(event.target.value)
            // console.log(passwordValid && passwordHasNumber)
            isFieldValid = passwordValid && passwordHasNumber
        }
        if(isFieldValid){
            const newUserInfo = {...user};
            newUserInfo[event.target.name] = event.target.value;
            setUser(newUserInfo)
        }
    }

    const handleSubmit = (e) => {
        if(newUser && user.email && user.password){
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const newUserInfo = {...user};
                newUserInfo.error = '';
                newUserInfo.success = true;
                setLoggedInUser(newUserInfo);

                updateUserName(user.name)

                history.replace(from);
            })
            .catch((error) => {
                const newUserInfo = {...user}
                newUserInfo.error = error.message;
                newUserInfo.success = false;
                setLoggedInUser(newUserInfo);
            });
        }
        if(!newUser && user.email && user.password){
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(res => {
                const newUserInfo = {...user};
                newUserInfo.error = '';
                newUserInfo.success = true;
                setLoggedInUser(newUserInfo);

                console.log('Sign in User SuccessFully', res.user);

                history.replace(from);
            })
            .catch((error) => {
                const newUserInfo = {...user}
                newUserInfo.error = error.message;
                newUserInfo.success = false;
                setLoggedInUser(newUserInfo);
            });

        }
        e.preventDefault();
    }

    const updateUserName = name => {
        const user = firebase.auth().currentUser;
    
        user.updateProfile({
          displayName: name
        }).then(function() {
          console.log('Update User Name Succesfully')
        }).catch(function(error) {
          console.log(error)
        });
      }
    return (
        <div className="login">
            <h1>This is Login Page</h1>
            <button onClick={handleGoogleSignIn}>Google Sign In</button> 
             &nbsp;
            <button onClick={handleFacebookSignIn}>Facebook Sign In</button>
            {/* <p>Name: {loggedInUser.name}</p> */}

            <br />
            <p>Or</p>

            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
            <label htmlFor="newUser">New User Sign Up</label>

            <form action="" onSubmit={handleSubmit}>
                {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Enter Your Name" />}
                <br />
                <input type="email" name="email" onBlur={handleBlur} placeholder="Enter Your Email" />
                <br />
                <input type="password" name="password" onBlur={handleBlur} placeholder="Enter Your Password" />
                <br />
                <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
            </form>

            {/* <p style={{color: 'red'}}>{user.error}</p>
            { user.success && <p style={{color: 'green'}}>User {newUser ? 'Create' : 'LogIn'} A Succesfully</p>} */}
        </div>
    );
};

export default Login;
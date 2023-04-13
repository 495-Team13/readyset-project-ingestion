import React, { useState } from "react";
import { LoginHeader } from "./LoginHeader";
export const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [theme, setTheme] = useState(props.themeState);

    const changeTheme = (newTheme) => {
        console.log("changed theme");
        setTheme(newTheme);
    }

    /*const handleSubmit = (e) => {
        console.log("submitted to api");
        fetch('https://ingestion-sandbox.dev.readysetvr.com/testFlask/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // edited below
              username: username,
              password: password
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Invalid username or password');
            }
            console.log("response ok");
            return response.json();
          })
          .then(data => {
            const { access_token } = data;
            // Store the access token in local storage or cookie
            localStorage.setItem('access_token', access_token);
            // added below
            props.onSwitch('Projects', '', theme);
          })
          .catch(error => {
            // edited below 
            props.onSwitch('Error', error, theme);
          });
          console.log("?");
    }*/

    const handleSubmit = (e) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type","application/json");

      var raw = JSON.stringify({
        "username": "admin",
        "password": "password"
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://ingestion-sandbox.dev.readysetvr.com/api/login", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        localStorage.setItem("access_token", result);
        props.onSwitch('Projects','',theme);
      })
      .catch(error => console.log('error', error));
    }

    return (
        <div id={theme} className="background">
            <div id={theme}><LoginHeader theme={theme} switchTheme={changeTheme}></LoginHeader></div>
            <div id={theme} className="login"> 
              <table className="login"><tbody>
                <tr><td><h4 id={theme} className="login">USERNAME</h4></td></tr>
                <tr><td><input className="login" type="text"></input></td></tr>
                <tr><td><h4 id={theme} className="login">PASSWORD</h4></td></tr>
                <tr><td><input className="login" type="text"></input></td></tr>
                <tr><td><button id={theme} className="login" onClick={handleSubmit}>LOG IN</button></td></tr>
              </tbody></table> 
            </div> 
        </div> 
    )
}

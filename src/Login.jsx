import React, { useState } from "react";
import { LoginHeader } from "./LoginHeader";
export const Login = (props) => {

    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [theme, setTheme] = useState(props.themeState);

    const changeTheme = (newTheme) => {
        console.log("changed theme");
        setTheme(newTheme);
    }

    const handleSubmit = (e) => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type","application/json");

      var raw = JSON.stringify({
        "username": username,
        "password": password
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
        if(result === "\"error\":\"Invalid username or password\"") {
            window.location.reload();
        } else {
            console.log(result, "\"error\":\"Invalid username or password\"");
        }
        localStorage.setItem("access_token", result);
        ((username === 'admin') ? localStorage.setItem("a", true) : localStorage.setItem("a", false));
        props.onSwitch('Projects','',theme);
      })
      .catch(error => {
          console.log('error1', error)
      });
    }

    return (
        <div id={theme} className="background">
            <div id={theme}><LoginHeader theme={theme} switchTheme={changeTheme}></LoginHeader></div>
            <div id={theme} className="login"> 
              <table className="login"><tbody>
                <tr><td><h4 id={theme} className="login">USERNAME</h4></td></tr>
                <tr><td><input className="login" type="text" onChange={(e)=>set_username(e.target.value)}></input></td></tr>
                <tr><td><h4 id={theme} className="login">PASSWORD</h4></td></tr>
                <tr><td><input className="login" type="text" onChange={(e)=>set_password(e.target.value)}></input></td></tr>
                <tr><td><button id={theme} className="login" onClick={handleSubmit}>LOG IN</button></td></tr>
              </tbody></table> 
            </div> 
        </div> 
    )
}

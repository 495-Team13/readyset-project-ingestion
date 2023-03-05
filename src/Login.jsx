import React, { useState } from "react";
import { LoginHeader } from "./LoginHeader";
export const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [theme, setTheme] = useState(props.themeState);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }

    const handleSubmit = (e) => {
        /* for now just print out the username entered and assume information is valid unless name entered is "invalid" 
        e.preventDefault();
        username === "invalid" ? props.onSwitch('Login', '', theme) : props.onSwitch('Projects', '', theme); */
        fetch('/api/login/', {
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
    }

    return (
        <div id={theme} className="background">
            <div id={theme}><LoginHeader theme={theme} switchTheme={changeTheme}></LoginHeader></div>
            <div id={theme} className="login">
                    <form className="login" id={theme}>
                        <label htmlFor="username">USERNAME</label>
                        <br/>
                        <input className="login" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="" id="username" name="username"/>
                        <br/>
                        <label htmlFor="password">PASSWORD</label>
                        <br/>
                        <input className="login" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="" id="password" name="password"/>
                        <br/>
                        <button className="login" onClick={handleSubmit}>LOG IN</button>
                    </form>
                </div>
        </div> 
    )
}
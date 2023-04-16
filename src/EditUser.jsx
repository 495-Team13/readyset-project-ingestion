import React, { useEffect, useState } from "react";
import { MainHeader } from "./MainHeader";

export const EditUser = (props) => {
  
  const [theme, setTheme] = useState(props.themeState);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('No defaults provided');
  
  const render = () => {
        var mounted = true;
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        
        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"   
        };
                
        console.log(props.stateVars);
        fetch("https://ingestion-sandbox.dev.readysetvr.com/api/users/get/" + props.stateVars, requestOptions)
                .then(response => response.json())
                .then(fetchData => {
                    if(mounted) {
                        setUsername(fetchData.username);
                        setPassword(fetchData.password);
                    }
                });
        return () => mounted = false;
  }
  
  useEffect(() => {
    render();
  }, [])
    
  const changeTheme =(newTheme) => {
    setTheme(newTheme);
  }
  
  const saveRecord = () => {
    /* api call goes here */ 
    console.log(username);
    console.log(password);
  }
  
  return (
    <div className="background" id={theme}>
      <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
      <table>
        <tbody>
          <tr>
            <td><h2 className="editrecord">Current user: {props.stateVars}</h2></td>
          </tr>
          <tr>
            <td><p>Username: </p></td>
            <td><p>Password: </p></td>
          </tr>
          <tr> 
              <td><input className="editrecord" type="text" placeholder={username} onChange={(e) => setUsername(e.target.value)}></input></td>
              <td><input className="editrecord" type="text" placeholder={password} onChange={(e) => setPassword(e.target.value)}></input></td>
              <td><button className="editrecord" onClick={() => saveRecord()}>Save</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
  
}

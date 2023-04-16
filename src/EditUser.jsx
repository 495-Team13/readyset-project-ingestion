import React, { useEffect, useState } from "react";
import { MainHeader } from "./MainHeader";

export const EditUser = (props) => {
  
  const [theme, setTheme] = useState(props.themeState);
  const [data, setData] = useState([]);
  
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
                        setData(fetchData);   
                        console.log(data.username);
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
  
  return (
    <div className="background" id={theme}>
      <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
      <table>
        <tbody>
          <tr>
            <td><h2>{props.stateVars}</h2></td>
          </tr>
          <tr>
            <td><p>This is text</p></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
  
}

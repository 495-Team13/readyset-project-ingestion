import React, { useState } from "react";
import { MainHeader } from "./MainHeader";
/* placeholder data in form of JSON file, will be replaced with the same information taken from database 
var data = require("./test-data.json"); */

export const Projects = (props) => {

    const [value, setValue] = useState('');
    const [theme, setTheme] = useState(props.themeState);
    var data = [
            { "name": "project1" },
            { "name": "project11" },
            { "name": "project26" }
        ];

    const getProjects = () => {
        /* old request
        fetch('http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/projects/all', {
            method: 'GET',
            headers: {
                // ??? changed to token from login ???
              'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
          })
          .then(response => {
            data = response.json;
            return data;
          })
          .catch(error => {
            props.onSwitch('Error', 'Error ' + error, theme);
          });
          */
        // new request
        var myHeaders = new Headers();
        const token = "Bearer " + localStorage.getItem("access_token");
        myHeaders.append("Authorization",token);
        // var raw = null;
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"   
        };
        console.log('in projects', myHeaders, requestOptions);
        fetch("http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/projects/all",requestOptions)          
          .then(response => {
            data = response.json;
            return data;
          })
          .catch(error => {
            props.onSwitch('Error', 'Error ' + error, theme);
          });
    }

    const changeTheme =(newTheme) => {
        setTheme(newTheme);
    }

    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        props.onSwitch("EditProject", searchTerm, theme);
    }

    const deleteButton = (item) => {
        /* send name of project to be deleted to the db 
        console.log("delete item " + item); */
        fetch('http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/projects/delete/', {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: item.name
            })
          })
          .then(response => {
            console.log(item.name + " successfully deleted.");
          })
          .catch(error => {
            props.onSwitch('Error', error, theme);
          });
    }

    return (
        <div className="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table className="projects" id={theme}> 
                <tbody>
                    <tr>
                        <td><table><tbody><tr>
                            <td><h2 className="projects">Projects</h2></td>
                            <td><button className="projects" id="add-project" onClick={() => props.onSwitch('EditProject', 'Untitled', theme)}>+</button></td>
                            <td><input className="projects" value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Search..."></input></td>
                        </tr></tbody></table></td>
                    </tr>
                    <tr>
                        <td>
                        <div className="search-container"> 
                                <div className="dropdown">
                                    {getProjects()}
                                    {data.filter(item => {
                                        const searchTerm = value.toLowerCase();
                                        const name = item.name.toLowerCase();

                                        return (searchTerm && name.startsWith(searchTerm)) || value === '';
                                    }).map((item)=> (
                                        <div className="dropdown-row"  key={item.name}>
                                            <table><tbody><tr>
                                                <td><p>{item.name}</p></td>
                                                <td><button className="projects" id="green" onClick={()=>onSearch(item.name)}>Edit</button></td>
                                                <td><button className="projects" id="red" onClick={()=>deleteButton}>Delete</button></td>
                                            </tr></tbody></table>
                                        </div>
                                    ))} 
                                </div> 
                            </div>
                         </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

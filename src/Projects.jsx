import React, { useState } from "react";
import { MainHeader } from "./MainHeader";
/* placeholder data in form of JSON file, will be replaced with the same information taken from database 
var data = require("./test-data.json"); */

export const Projects = (props) => {

    const [value, setValue] = useState('');
    const [theme, setTheme] = useState(props.themeState);
    
    const getProjects = () => {
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        var data;

        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"   
        };
        
        console.log('in projects', requestOptions);
        fetch("http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/projects/all", requestOptions)
                .then(response => response.json())
                .then(fetchData => {
                   data = fetchData
                });
        return (
            <ol>
                data.map(item => {<li key={item.name}>{item.name}</li>})
            </ol>
        );
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
                            </div> 
                         </div>
                         </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

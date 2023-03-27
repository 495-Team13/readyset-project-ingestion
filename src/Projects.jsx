import React, { useState } from "react";
import { MainHeader } from "./MainHeader";
/* placeholder data in form of JSON file, will be replaced with the same information taken from database 
var data = require("./test-data.json"); */

export const Projects = (props) => {

    const [value, setValue] = useState('');
    const [theme, setTheme] = useState(props.themeState);
    var data = [
            { "project_name": "project1" },
            { "project_name": "project11" },
            { "project_name": "project26" }
        ];

    const getProjects = () => {
        console.log('in projects', localStorage.getItem('access_token'));
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
              name: item.project_name
            })
          })
          .then(response => {
            console.log(item.project_name + " successfully deleted.");
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
                                        const project_name = item.project_name.toLowerCase();

                                        return (searchTerm && project_name.startsWith(searchTerm)) || value === '';
                                    }).map((item)=> (
                                        <div className="dropdown-row"  key={item.project_name}>
                                            <table><tbody><tr>
                                                <td><p>{item.project_name}</p></td>
                                                <td><button className="projects" id="green" onClick={()=>onSearch(item.project_name)}>Edit</button></td>
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
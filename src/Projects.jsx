import React, { useState } from "react";
import { MainHeader } from "./MainHeader";
/* placeholder data in form of JSON file, will be replaced with the same information taken from database 
var data = require("./test-data.json"); */

export const Projects = (props) => {

    const [value, setValue] = useState('');
    const [theme, setTheme] = useState(props.themeState);
    var data;
    
    const getProjects = () => {
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;

        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"   
        };
        
        console.log('in projects', requestOptions);
        // old fetch
        /*fetch("http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/projects/all",requestOptions)          
          .then(response => {
            const res = response.json();
            console.log(res);
            var data = [{"name":"filtering json response should not be hard"}];
            console.log(data);
            res.forEach((item) => {
               console.log(item.name); 
            });
            return data;
          })
          .catch(error => {
            props.onSwitch('Error', 'Error ' + error, theme);
          });*/
        // new fetch from tutorial
        fetch("http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/projects/all", requestOptions)
        .then(response => response.json())
        .then(data => {return data;});
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
                                    {
                                        data = getProjects();
                                        console.log(data);

                                        for (item of data) {
                                           console.log(item.name);   
                                        }
                                    }
                                    {console.log("old filtering");/*data.filter(item => {
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
                                    ))*/} 
                                </div> 
                            </div>
                         </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

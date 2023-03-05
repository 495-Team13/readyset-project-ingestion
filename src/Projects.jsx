import React, { useState } from "react";
import { MainHeader } from "./MainHeader";
import InfiniteScroll from "react-infinite-scroll-component";
/* placeholder data in form of JSON file, will be replaced with the same information taken from database */ 
var data = require("./test-data.json");

export const Projects = (props) => {

    const [value, setValue] = useState('');
    const [theme, setTheme] = useState(props.themeState);

    const changeTheme =(newTheme) => {
        setTheme(newTheme);
    }

    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        props.onSwitch("EditProject", searchTerm, theme);
    }

    const deleteButton = (item) => {
        /* send name of project to be deleted to the db */ 
        console.log("delete item " + item);
    }

    return (
        <div className="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table className="projects" id={theme}> 
                <tbody>
                    <tr>
                        <td><table><tr>
                            <td><h2 className="projects">Projects</h2></td>
                            <td><button className="projects" id="add-project" onClick={() => props.onSwitch('EditProject', 'Untitled', theme)}>+</button></td>
                            <td><input className="projects" value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Search..."></input></td>
                        </tr></table></td>
                    </tr>
                    <tr>
                        <td>
                        <div className="search-container"> 
                                <div className="dropdown">
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
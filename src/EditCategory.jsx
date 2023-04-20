import { MainHeader } from "./MainHeader";
import React, { useEffect, useState } from "react";

export const EditCategory = (props) => {

    const [theme, setTheme] = useState(props.themeState);
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    
    const render = () => {
        var mounted = true;
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        
        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"   
        };
        if(props.stateVars === "Untitled") {
            setName("Untitled");
            setData([]);
        } else {
            fetch("https://ingestion-sandbox.dev.readysetvr.com/api/categories/get/" + props.stateVars, requestOptions)
                .then(response => response.json())
                .then(fetchData => {
                    if(mounted) {
                        setName(fetchData.name);   
                        setData(fetchData.templates);
                    }
                });
        }
        return () => mounted = false;    
    }
    
    useEffect(() => {
        render();
    }, []);

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }
    
    const onSearch = (templateName) => {
          props.onSwitch("EditTemplate", templateName, theme);
          console.log(templateName); 
    }
    
    const deleteTemplate = (templateName) => {
            /* delete api call */
    }
    
    const edit = () => {
            /* update api call */
    }

    return(
        <div id={theme} class="background">
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
                        <table className="projects" id={theme}> 
                            <tbody>
                                <tr>
                                    <td><table><tbody><tr>
                                        <td><h2 className="projects">Category</h2></td>
                                        <td><input className="projects" value={name} onChange={(e) => setName(e.target.value)} type="text" placeHolder={name}></input></td>
                                        <td><button className="projects" id="update-name" onClick={() => edit()}>Update</button></td>
                                        <td><button className="projects" id="add-project" onClick={() => props.onSwitch('EditTemplate', 'Untitled', theme)}>+</button></td>
                                        <td><input className="projects" value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Search..."></input></td>
                                    </tr></tbody></table></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="search-container"> 
                                            <div className="dropdown">
                                                {data.filter(item => {
                                                    const searchTerm = value.toLowerCase();
                                                    const name = item.toLowerCase();

                                                    return (searchTerm && name.startsWith(searchTerm)) || value === '';
                                                }).map((item) => (
                                                    <div className="dropdown-row"  key={item}>
                                                        <table><tbody><tr>
                                                            <td><p>{item}</p></td>
                                                            <td><button className="projects" id="green" onClick={()=>onSearch(item)}>Edit</button></td>
                                                            <td><button className="projects" id="red" onClick={()=>deleteTemplate(item)}>Delete</button></td>
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

import React, { useEffect, useState } from "react";
import { MainHeader } from "./MainHeader";

export const Projects = (props) => {

    const [value, setValue] = useState('');
    const [theme, setTheme] = useState(props.themeState);
    const [data, setData] = useState([]);
    
    useEffect(() => {
        var mounted = true;
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        
        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"   
        };
        
        console.log(requestOptions);
        
        fetch("http://ingestion-sandbox.dev.readysetvr.com/api/projects/all", requestOptions)
                .then(response => response.json())
                .then(fetchData => {
                    if(mounted) {
                        setData(fetchData);   
                    }
                });
        return () => mounted = false;
    }, [])
    
    const changeTheme =(newTheme) => {
        setTheme(newTheme);
    }

    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        props.onSwitch("EditProject", searchTerm, theme);
    }

    const deleteButton = (item) => {
        console.log(item.name);
        
        const obj = JSON.parse(localStorage.getItem('access_token'));
        const token = "Bearer " + obj.access_token;
        
        var raw = JSON.stringify({
            "name":item.name
        });
        
        var requestOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type":"application/json",
                "Authorization":token
            },
            body: raw,
            redirect:"follow"
        };
        
        console.log(requestOptions);
        
        fetch('http://ingestion-sandbox.dev.readysetvr.com/api/projects/delete', requestOptions)
          .then(response => {
            console.log(response);
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
                                    {data.filter(item => {
                                        const searchTerm = value.toLowerCase();
                                        const name = item.name.toLowerCase();

                                        return (searchTerm && name.startsWith(searchTerm)) || value === '';
                                    }).map((item) => (
                                        <div className="dropdown-row"  key={item.name}>
                                            <table><tbody><tr>
                                                <td><p>{item.name}</p></td>
                                                <td><button className="projects" id="green" onClick={()=>onSearch(item.name)}>Edit</button></td>
                                                <td><button className="projects" id="red" onClick={()=>deleteButton(item)}>Delete</button></td>
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

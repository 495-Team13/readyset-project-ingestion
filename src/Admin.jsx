import React, { useEffect, useState } from "react";
import { MainHeader } from "./MainHeader";

export const Admin = (props) => {
  
    const [value, setValue] = useState('');
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
                
        fetch("https://ingestion-sandbox.dev.readysetvr.com/api/users/all", requestOptions)
                .then(response => response.json())
                .then(fetchData => {
                    if(mounted) {
                        setData(fetchData); 
                    }
                });
        return () => mounted = false;
    }
    
    useEffect(() => {
        const flag = localStorage.getItem("a");
        if(flag === true) {
          console.log("access granted");
          render();
        } else {
          alert("Please log in as admin to make changes");
          props.onSwitch("Login", '', theme);
        }
    }, [])
    
    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }

    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        props.onSwitch("EditUser", searchTerm, theme);
        render();
    }

    const deleteButton = (item) => {        
        const obj = JSON.parse(localStorage.getItem('access_token'));
        const token = "Bearer " + obj.access_token;
        
        var raw = JSON.stringify({
            "username":item
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
                
        fetch('https://ingestion-sandbox.dev.readysetvr.com/api/users/delete/' + item, requestOptions)
          .then(response => {
            render();
          })
          .catch(error => {
            props.onSwitch('Error', error, theme);
          });
    }
  
  return(
    <div className="background" id={theme}>
      <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
      <table className="editproject" id={theme}> 
                <tbody>
                    <tr>
                        <td><table><tbody><tr>
                            <td><h2 className="editproject">Users</h2></td>
                            <td><button className="editproject" id="add-project" onClick={() => props.onSwitch('EditUser', 'Untitled', theme)}>+</button></td>
                            <td><input className="editproject" value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder="Search..."></input></td>
                            <td><button className="editproject" onClick={()=> render()}>Refresh</button></td>
                        </tr></tbody></table></td>
                    </tr>
                    <tr>
                        <td>
                        <div className="search-container"> 
                            <div className="dropdown">
                                    {data.filter(item => {
                                        const searchTerm = value.toLowerCase();
                                        const name = item.username.toLowerCase();

                                        return (searchTerm && name.startsWith(searchTerm)) || value === '';
                                    }).map((item) => (
                                        <div className="dropdown-row"  key={item.username}>
                                            <table><tbody><tr>
                                                <td><p>{item.username}</p></td>
                                                <td><button className="editproject" id="green" onClick={()=>onSearch(item.username)}>Edit</button></td>
                                                <td><button className="editproject" id="red" onClick={()=>deleteButton(item.username)}>Delete</button></td>
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
  ); 
}

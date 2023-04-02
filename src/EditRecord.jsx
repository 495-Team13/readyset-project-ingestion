// TODO: discern between editing record and new record 
//(e.g. load in the existing record data and populate the fields with them).
import React, { useState } from "react";
import { MainHeader } from "./MainHeader";

export const EditRecord = (props) => {

    const [recordData, setRecordData] = useState([]);
        /* Form variables for sending to db*/
    const [recordName, setRecordName] = useState(props.stateVars);
    const [productUPC, setProductUPC] = useState('');
    const [drc, setDRC] = useState('');
    const [upcOfItemInDRC, setUPCOfItemInDRC] = useState('');
    const [productName, setProductName] = useState('');
    const [itemCount, setItemCount] = useState('');
    const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
    const [weightVolume, setWeightVolume] = useState('');
    const [unitOfMeasurement2, setUnitOfMeasurement2] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [neww, setNew] = useState('');
    const [templateType, setTemplateType] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [depth, setDepth] = useState('');
    const [additionalHeight, setAdditionalHeight] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [workflow, setWorkflow] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [theme, setTheme] = useState(props.themeState);
    
    useEffect(() => {
        var mounted = true;
        
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        var requestOptions = {
            method: "GET",
            headers: {"Authorization":token},
            redirect: "follow"
        };
        if(props.stateVars === "Untitled") {
            setProducts("default"); 
        } else {
            const str = 'http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/products/get/' + props.stateVars;
            fetch(str, requestOptions)
              .then(response => response.json())
              .then(fetchData => {
                    console.log(fetchData)
                    if(mounted) {
                        setAdditionalInfo(fetchData.add_info);
                        set
                    }
              });
        }
        return () => mounted = false;
    }, [])

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }

    const saveRecord = () => { 
        const count = {
            "measurement": itemCount,
            "unit": unitOfMeasurement
        }
        const amount = { 
            "measurement": weightVolume,
            "unit": unitOfMeasurement2
        }
        const product = {
            "upc": productUPC,
            "drc_upc": upcOfItemInDRC,
            "name": productName,
            "count": count,
            "amount": amount,
            "template_name": templateName,
            "width": width,
            "height": height,
            "depth": depth,
            "add_height": additionalHeight,
            "add_info": additionalInfo
          }
          
          const project_name = "";
          
          fetch('http://ingestion-sandbox.dev.readysetvr.com/testFlask/api/products/add/' + project_name, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("access_token"),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
          })
          .then(response => {
            // handle the response
            console.log("saved record");
          })
          .catch(error => {
            // handle the error
            console.log(error);
          });
    }

    const clearRecord = () => {
        setProductUPC('');
        setDRC('');
        setUPCOfItemInDRC('');
        setProductName('');
        setItemCount('');
        setUnitOfMeasurement('');
        setWeightVolume('');
        setUnitOfMeasurement2('');
        setTemplateName('');
        setNew('');
        setWidth('');
        setHeight('');
        setDepth('');
        setAdditionalHeight('');
        setFormDescription('');
        setWorkflow('');
        setAdditionalInfo('');
    }

    return(
        <div class="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table class="editrecord">
                <tr>
                    <td><table><tbody><tr>
                        <td><h4>Record&nbsp;Name</h4></td>
                        <td><input className="editrecord" type="text" placeholder={recordName} onChange={(e) => setRecordName(e.target.value)}></input></td>
                        <td><button className="editrecord" onClick={() => {props.onSwitch('Projects','', theme)}}>Return</button></td>
                        <td><button className="editrecord" onClick={saveRecord()}>Save</button></td>
                        <td><button className="editrecord" onClick={clearRecord()}>Clear</button></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Product&nbsp;UPC</h5></td>
                        <td><h5 className="editrecord">DRC</h5></td>
                        <td><h5 className="editrecord">UPC&nbsp;of&nbsp;item&nbsp;in&nbsp;DRC</h5></td>
                        {/* gltf file here */} 
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" onChange={(e) => setProductUPC(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setDRC(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setUPCOfItemInDRC(e.target.value)}></input></td>     
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr><h5>Product Name (Brand Name Flavor)</h5></tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr><input className="editrecord" type="text" onChange={(e) => setProductName(e.target.value)}></input></tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Item Count (if listed)</h5></td>
                        <td><h5 className="editrecord">Unit of measurement</h5></td>
                        <td><h5 className="editrecord">Weight / Volume</h5></td>
                        <td><h5 className="editrecord">Unit of measurement</h5></td> 
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" onChange={(e) => setItemCount(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setUnitOfMeasurement(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setWeightVolume(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setUnitOfMeasurement2(e.target.value)}></input></td> 
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Template Name</h5></td>
                        <td><h5 className="editrecord">New</h5></td>
                        <td><h5 className="editrecord">Template Type</h5></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" onChange={(e) => setTemplateName(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setNew(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setTemplateType(e.target.value)}></input></td> 
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Width</h5></td>
                        <td><h5 className="editrecord">Height</h5></td>
                        <td><h5 className="editrecord">Depth</h5></td>
                        <td><h5 className="editrecord">Additional Height</h5></td>
                        <td><h5 className="editrecord">Form Description</h5></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" onChange={(e) => setWidth(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setHeight(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setDepth(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setAdditionalHeight(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" onChange={(e) => setFormDescription(e.target.value)}></input></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Workflow</h5></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" onChange={(e) => setWorkflow(e.target.value)}></input></td>
                    </tr></tbody></table></td>

                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Additional Information</h5></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" onChange={(e) => setAdditionalInfo(e.target.value)}></input></td>
                    </tr></tbody></table></td>
                </tr>
            </table>
        </div>
    ) 

}

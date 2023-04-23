import React, { useEffect, useState } from "react";
import { MainHeader } from "./MainHeader";

export const EditRecord = (props) => {

    const [theme, setTheme] = useState(props.themeState);
        /* Form variables for sending to db*/    
    const [projectName, setProjectName] = useState('');
    const [addHeight, setAddHeight] = useState('');
    const [addInfo, setAddInfo] = useState('');
    const [amountMeasurement, setAmountMeasurement] = useState('');
    const [amountUnit, setAmountUnit] = useState('');
    const [countNum, setCountNum] = useState('');
    const [countUnit, setCountUnit] = useState('');
    const [depth, setDepth] = useState('');
    const [drcUpc, setDrcUpc] = useState('');
    const [height, setHeight] = useState('');
    const [name, setName] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [upc, setUpc] = useState('');
    const [width, setWidth] = useState('');
        /* Template variables to populate the '?' fields */
    const [donor_shape, set_donor_shape] = useState('');
    const [form_desc, set_form_desc] = useState('');
    const [gltf, set_gltf] = useState('');
    const [notes, set_notes] = useState('');
    const [product_upc, set_product_upc] = useState('');
    const [type, set_type] = useState('');
    const [workflow, set_workflow] = useState('');
        /* Inferred Hooks */
    const [drc, set_drc] = useState('No');
    
    useEffect(() => {
        var mounted = true;
        
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;
        var requestOptions = {
            method: "GET",
            headers: {
                "Authorization":token,
            },
            redirect: "follow"
        };
        if(props.stateVars === "new record") {
            clearRecord(); 
        } else {
            const str = 'https://ingestion-sandbox.dev.readysetvr.com/api/products/get/' + props.stateVars;
            fetch(str, requestOptions)
              .then(response => response.json())
              .then(fetchData => {
                    console.log(fetchData)
                    if(mounted) {
                        setAddHeight(fetchData.add_height);
                        setAddInfo(fetchData.add_info);
                        setAmountMeasurement(fetchData.amount.measurement);
                        setAmountUnit(fetchData.amount.unit);
                        setCountNum(fetchData.count.num);
                        setCountUnit(fetchData.count.unit);
                        setDepth(fetchData.depth);
                        setDrcUpc(fetchData.drc_upc);
                        if(fetchData.drc_upc !== '') {
                            set_drc('Yes');
                        }
                        setHeight(fetchData.height);
                        setName(fetchData.name);
                        setTemplateName(fetchData.template_name);
                        setUpc(fetchData.upc);
                        setWidth(fetchData.width);
                    }
                    fetch("/api/templates/get/"+fetchData.template_name,requestOptions)
                        .then(response => response.json())
                        .then(fetchData => {
                            set_donor_shape(fetchData.donor_shape);
                            set_form_desc(fetchData.form_desc);
                            set_gltf(fetchData.gltf);
                            set_notes(fetchData.notes);
                            set_product_upc(fetchData.product_upc);
                            set_type(fetchData.type);
                            set_workflow(fetchData.workflow);
                        })
              });
        }
        return () => mounted = false;
    }, [])

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    }

    const saveRecord = () => { 
        const count = {
            "measurement": countNum,
            "unit": countUnit
        }
        const amount = { 
            "measurement": amountMeasurement,
            "unit": amountUnit
        }
        const product = {
            "upc": upc,
            "drc_upc": drcUpc,
            "name": name,
            "count": count,
            "amount": amount,
            "template_name": templateName,
            "width": width,
            "height": height,
            "depth": depth,
            "add_height": addHeight,
            "add_info": addInfo
          }
        
        const obj = JSON.parse(localStorage.getItem("access_token"));
        const token = "Bearer " + obj.access_token;

        if(props.stateVars === "new record") {
            var requestOptions = {
                method: "POST",
                headers: {
                    "Authorization":token,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(product),
                redirect: "follow"
            };
            const project = JSON.parse(localStorage.getItem("current_project"))
            const projectName = project.current_project;
            console.log(projectName);
            fetch('https://ingestion-sandbox.dev.readysetvr.com/api/products/add/' + projectName, requestOptions)
            .then(response => {
                response.json()
            })
            .then(data => {
                console.log(data)
            })
        } else {
            console.log(props.stateVars);
            var requestOptions = {
                method: "PUT",
                headers: {
                    "Authorization":token,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(product),
                redirect: "follow"
            };
            fetch('https://ingestion-sandbox.dev.readysetvr.com/api/products/edit/' + upc, requestOptions)
                .then(response => {
                    response.json()
            })
            .then(data => {
                console.log(data)   
            })
        }
    }

    const clearRecord = () => {
        setAddHeight('');
        setAddInfo('');
        setAmountMeasurement('');
        setAmountUnit('');
        setCountNum('');
        setCountUnit('');
        setDepth('');
        setDrcUpc('');
        setHeight('');
        setName('');
        setTemplateName('');
        setUpc('');
        setWidth('');
    }

    return(
        <div class="background" id={theme}>
            <MainHeader current_theme={theme} switchTheme={changeTheme} onSwitch={(stateName, stateVars, theme) => props.onSwitch(stateName, stateVars, theme)} />
            <table className="editrecord">
                <div className="grid-container">
                <tr>
                    <td><table><tbody><tr>
                        <td><h4>Record&nbsp;Name</h4></td>
                        <td><input className="editrecord" type="text" placeholder={name} onChange={(e) => setName(e.target.value)}></input></td>
                        <td><button className="editrecord" onClick={() => {props.onSwitch('Projects','', theme)}}>Return</button></td>
                        <td><button className="editrecord" onClick={() => saveRecord()}>Save</button></td>
                        <td><button className="editrecord" onClick={() => clearRecord()}>Clear</button></td>
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
                        <td><input className="editrecord" type="text" placeHolder={upc} onChange={(e) => setUpc(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeHolder={drc} ></input></td>
                        <td><input className="editrecord" type="text" placeHolder={drcUpc} onChange={(e) => setDrcUpc(e.target.value)}></input></td> 
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr><h5>Product Name (Brand Name Flavor)</h5></tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr><input className="editrecord" type="text" placeholder={name} onChange={(e) => setName(e.target.value)}></input></tr></tbody></table></td>
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
                        <td><input className="editrecord" type="text" placeholder={countNum} onChange={(e) => setCountNum(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeholder={countUnit} onChange={(e) => setCountUnit(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeholder={amountMeasurement} onChange={(e) => setAmountMeasurement(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeholder={amountUnit} onChange={(e) => setAmountUnit(e.target.value)}></input></td> 
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
                        <td><input className="editrecord" type="text" placeholder={templateName} onChange={(e) => setTemplateName(e.target.value)}></input></td>
                        <td><input className="editrecord" type="checkbox"></input></td>
                        <td><input className="editrecord" type="text" placeholder={type} ></input></td> 
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
                        <td><input className="editrecord" type="text" placeholder={width} onChange={(e) => setWidth(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeholder={height} onChange={(e) => setHeight(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeholder={depth} onChange={(e) => setDepth(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeholder={addHeight} onChange={(e) => setAddHeight(e.target.value)}></input></td>
                        <td><input className="editrecord" type="text" placeholder={form_desc}></input></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Workflow</h5></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" placeholder={workflow} ></input></td>
                    </tr></tbody></table></td>

                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><h5 className="editrecord">Additional Information</h5></td>
                    </tr></tbody></table></td>
                </tr>
                <tr>
                    <td><table><tbody><tr>
                        <td><input className="editrecord" type="text" placeholder={addInfo} onChange={(e) => setAddInfo(e.target.value)}></input></td>
                    </tr></tbody></table></td>
                </tr>
                </div>
            </table>
        </div>
    ) 

}

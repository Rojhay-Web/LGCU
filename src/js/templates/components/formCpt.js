import React, { Component } from 'react';
import axios from 'axios';

var rootPath = "";
//var rootPath = "http://localhost:1111";

/* Form */
class FormCpt extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tmpForm:{
                "title":"", "returnAddress":"",
                "elements":[]
            },
            requiredData:[],
            formData:{},
            status:0,
            loading: false
        }
        
        this.formElement = this.formElement.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.validateFormData = this.validateFormData.bind(this);
    }

    componentDidMount(){ 
        this.initFormData(this.props.form);
    }

    formElement(el){
        switch(el.type) {
            case "input":
                return <input type="text" name={el.name} className={(this.state.requiredData.indexOf(el.name) > -1 ? "empty":"")} placeholder={el.placeholder +(el.required ?"*":"")} value={this.state.formData[el.name] || ''} onChange={(e) => this.onElementChange(e)}/>;
            case "textarea":
                    return <textarea name={el.name} className={(this.state.requiredData.indexOf(el.name) > -1 ? "empty":"")} placeholder={el.placeholder +(el.required ?"*":"")} value={this.state.formData[el.name]|| ''} onChange={(e) => this.onElementChange(e)} />;
            case "checkbox":
                return <div className={"form-checkbox " + (this.state.requiredData.indexOf(el.name) > -1 ? "empty":"")} placeholder={el.placeholder +(el.required ?"*":"")} value={this.state.formData[el.name]|| false}><input type="checkbox" name={el.name} onChange={(e) => this.onElementChange(e)}/><label>{el.placeholder +(el.required ?"*":"")}</label></div>;
            default:
                return <div></div>;
        }
    }

    render(){        
        return(
            <div className="lgcu-form">
                {this.state.loading && <i className="loading fas fa-redo-alt fa-spin"></i> }
                {this.state.status === 0 ?
                <div className="lgcu-form-container">
                    <div className="form-info">(* Required Field)</div>
                    {this.props.form.type === "core" && this.props.form.elements.map((item,i) => (
                        <div key={i} className={"form-element sz-"+item.sz}>{ this.formElement(item) }</div>
                    ))}

                    {this.props.form.type === "section" && this.props.form.elements.map((section,i) => (
                        <div className="form-section-container" key={i}>
                            <h2>{section.title}</h2>
                            {section.directions && <p className="directionsInfo">{section.directions}</p>}
                            {section.directionList && 
                                <ul className="directionsInfo">
                                    {section.directionList.map((litem,j) => (
                                        <li key={j}>{litem}</li>
                                    ))}
                                </ul>
                            }
                            {section.elements.map((item,k) => (
                                <div key={k} className={"form-element sz-"+item.sz}>{ this.formElement(item) }</div>
                            ))}                        
                        </div>
                    ))}


                    <div className="btn-container">
                        <div className="lBtn c2" onClick={this.submitForm}><span>Submit</span><i className="btn-icon far fa-paper-plane"></i></div>
                    </div>
                </div>

                : 
                <div className="lgcu-form-container submitted">
                    <h2>{this.props.form.sendMessage}</h2>
                </div> 
                }
            </div>
        );
    }

    initFormData(tmpForm) {
        var self = this;
        try {
            if(tmpForm.elements && tmpForm.elements.length > 0) {
                var tmpData = {};                
               
                tmpForm.elements.forEach(function(item){
                    if(tmpForm.type === "section"){
                        item.elements.forEach(function(subitem){
                            tmpData[subitem.name] = subitem.value;
                        });
                    }
                    else {
                        tmpData[item.name] = item.value;        
                    }           
                });
                
                self.setState({ formData:tmpData });
            }
        }
        catch(ex){
            console.log("Error init form: ",ex);
        }
    }

    onElementChange(event){
        var self = this;
        try {
            var tmpData = this.state.formData;
            var name = event.target.name;

            if(name in tmpData) {
                tmpData[name] = (event.target.type === 'checkbox' ? event.target.checked : event.target.value);
                self.setState({ formData:tmpData });
            }
        }
        catch(ex){
            console.log("Error changeing element: ",ex);
        }
    }

    validateFormData(){
        var self = this;
        var missingData = [];
        try {
            this.props.form.elements.forEach(function(item) {
                if(self.props.form.type === "section"){
                    item.elements.forEach(function(subitem){
                        if(subitem.required){
                            if(!(subitem.name in self.state.formData) || !self.state.formData[subitem.name] || self.state.formData[subitem.name].length === 0){
                                missingData.push(subitem.name);
                            }
                        }
                    });
                }
                else {
                    if(item.required){
                        if(!(item.name in self.state.formData) || !self.state.formData[item.name] || self.state.formData[item.name].length === 0){
                            missingData.push(item.name);
                        }
                    }
                }          
            });
        }
        catch(ex){
            console.log("Error validating form: ",ex);
        }

        return missingData;
    }

    submitForm(){
        var self = this;
        try {
            this.setState({ requiredData: this.validateFormData(), loading: true }, ()=> {
                if(self.state.requiredData.length > 0 ){
                    self.setState({ loading: false});
                    alert("Please update required fields");
                }
                else {
                    var postData = { 
                            email: self.props.form.sendAddress, 
                            subject:self.props.form.subject, 
                            title: self.props.form.title, 
                            formData: self.state.formData, 
                            additionalData:self.props.form.additionalData
                    };

                    axios.post(rootPath + "/api/sendEmail", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.results === "Email Sent"){
                            self.setState({status: 1, loading: false }, () =>{
                                alert("Form Submitted");
                                self.initFormData(self.props.form);
                            });                            
                        }
                        else {
                            alert("Error Submitting Form");
                            console.log("[Error] Submitting Form: ", response.data.errorMessage);
                        }
                    });                
                }
            });
            
        }
        catch(ex){
            alert("error submitting form");
        }
    }
}

export default FormCpt;
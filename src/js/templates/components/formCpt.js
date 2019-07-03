import React, { Component } from 'react';
import axios from 'axios';

//var rootPath = "";
var rootPath = "http://localhost:1111";

/* Form */
class FormCpt extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tmpForm:{
                "title":"", "returnAddress":"",
                "elements":[
                    {"type":"","sz":1, "required":false, "name":"", "placeholder":"", "value":"", "valueList":[]}
                ]
            },
            requiredData:[],
            formData:{}
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
                return <input type="text" name={el.name} className={(this.state.requiredData.indexOf(el.name) > -1 ? "empty":"")} placeholder={el.placeholder} value={this.state.formData[el.name]} onChange={(e) => this.onElementChange(e)}/>;
            case "textarea":
                    return <textarea name={el.name} className={(this.state.requiredData.indexOf(el.name) > -1 ? "empty":"")} placeholder={el.placeholder} value={this.state.formData[el.name]} onChange={(e) => this.onElementChange(e)} />;
            default:
                return <div></div>;
        }
    }

    render(){        
        return(
            <div className="lgcu-form">                
                {this.props.form.elements.map((item,i) => (
                    <div key={i} className={"form-element sz-"+item.sz}>{ this.formElement(item) }</div>
                ))}

                <div className="btn-container">
                    <div className="lBtn c2" onClick={this.submitForm}><span>Submit</span><i className="btn-icon far fa-paper-plane"></i></div>
                </div>
            </div>
        );
    }

    initFormData(tmpForm) {
        var self = this;
        try {
            if(tmpForm.elements && tmpForm.elements.length > 0) {
                var tmpData = {};
                tmpForm.elements.forEach(function(item){
                    tmpData[item.name] = item.value;                   
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
                tmpData[name] = event.target.value
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
                if(item.required){
                    if(!(item.name in self.state.formData) || !self.state.formData[item.name] || self.state.formData[item.name].length == 0){
                        missingData.push(item.name);
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
            this.setState({ requiredData: this.validateFormData() }, ()=> {
                if(self.state.requiredData.length > 0 ){
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
                        if(response.data.results == "Email Sent"){
                            alert("Form Submitted");
                            self.initFormData(self.props.form);
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
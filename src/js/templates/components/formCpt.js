import React, { Component } from 'react';
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
            formData:{}
        }
        
        this.formElement = this.formElement.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount(){ 
        this.initFormData(this.props.form);
    }

    formElement(el){
        switch(el.type) {
            case "input":
                return <input type="text" name={el.name} placeholder={el.placeholder} value={this.state.formData[el.name]} />;
            case "textarea":
                    return <textarea name={el.name} placeholder={el.placeholder} value={this.state.formData[el.name]} />;
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
                tmpForm.elements.foreach(function(item){
                    tmpData[item.name] = tmpData[item.value];
                });
                self.setState({ formData:tmpData });
            }
        }
        catch(ex){
            console.log("Error init form: ",ex);
        }
    }

    onElementChange(event, el){
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
            console.log("Error changeing element: ", el);
        }
    }

    submitForm(){
        try {
            alert("form submitted");
        }
        catch(ex){
            alert("error submitting form");
        }
    }
}

export default FormCpt;
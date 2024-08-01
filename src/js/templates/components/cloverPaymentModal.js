import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

let rootPath = (window.location.href.indexOf("localhost") > -1 ? "http://localhost:2323" : "");
let portalWindow, bc;

class CloverCardPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId:null, chargeItems: [], request_code: null, email: "",
            errorList: []
        }

        this.onElementChange = this.onElementChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.formValidation = this.formValidation.bind(this);
        this.setBroadcastChannel = this.setBroadcastChannel.bind(this);
        this.startApp = this.startApp.bind(this);
        this.openPortal = this.openPortal.bind(this);

        this.componentCleanup = this.componentCleanup.bind(this);
    }

    onElementChange(event){
        var self = this;
        try {
            var name = event.target.name;
            var value = event.target.value;

            self.setState({ [name]:value }, () => { self.formValidation(); });
        }
        catch(ex){
            console.log("Error with element change: ",ex);
        }
    }

    resetForm(){
        try {
            this.setState({
                email: "", studentId:null, chargeItems: [], request_code: null,
                errorList: []
            });
        }
        catch(ex){
            console.log("Error Resetting form: ",ex);
        }
    }

    closeForm(){
        this.props.handleClose();
        this.resetForm();
    }

    formValidation(){
        let tmpErrorList = [],
            validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
        try {
            // Check Cardholder Email
            if(!(this.state.email.length > 0 && this.state.email.match(validRegex))){
                tmpErrorList.push("email");
            }

            if(this.state.request_code === null) {
                tmpErrorList.push("request_code");
            }

            if(this.state.chargeItems?.length <= 0){
                tmpErrorList.push("charge items");
            }
        }
        catch(ex){
            console.log("Error with form validation: ",ex);
        }

        this.setState({ errorList: tmpErrorList });
    }

    startApp(){
        try {
            let specs ='height=100,width=100,status=no,menubar=no,toolbar=no,top=200,left=200',
                windowPath = 'http://localhost:3000/payment-portal?code=4858f04a1d3b4b848f23a8cf3d9f9119';
                //windowPath = 'http://localhost:2323/v2/api/oauth-start';
            portalWindow = window.open(windowPath, '_blank', specs);

        }
        catch(ex){
            error.log(`starting app: ${ex}`);
        }
    }

    openPortal(){
        try {
            if(this.state.errorList.length > 0){
                console.log(this.state.errorList);
            }
            else {
                let postData = JSON.stringify({ 
                    request_code: this.state.request_code, email: this.state.email,
                    chargeItems: this.state.chargeItems
                });
    
                fetch(`${rootPath}/v2/api/lgcuCheckout`, {
                    method: "POST", body: postData,
                    headers: { "Accept": "application/json", "Content-Type":"application/json"}
                })
                .then((response) => response.json())
                .then((res)=> {
                    if(res?.results?.href){
                        let specs ='height=500,width=500,status=no,menubar=no,toolbar=no,top=200,left=200';
                            
                        window.open(res.results.href, '_blank', specs);
                    }
                    else {
                        // Open Toast
                        console.log(res.error);
                    }
                }).catch((err) =>{
                    console.log(`Error With Submitting Form [DF01]: ${err}`);
                });
            }
        }
        catch(ex){
            console.log(`Opening Portal: ${ex}`);
        }
    }

    setBroadcastChannel(){
        let self = this;
        try {
            bc = new BroadcastChannel("clover-payment");
            bc.onmessage = (e) => {
                switch(e?.data?.key){
                    case "request-code":
                        self.setState({ request_code: e?.data?.value }, () => { self.formValidation(); });
                        break;
                    default:
                        console.log(e.data);
                        break;
                }
            };
        }
        catch(ex){
            console.log(`Setting Broadcast Channel: ${ex}`);
        }
    }

    componentDidMount(){
        let self = this;
        this.setState({ studentId: self.props.studentId, chargeItems: self.props.chargeItems },()=> {
            self.setBroadcastChannel();
            self.startApp();
        });
    }

    componentCleanup(){
        if(portalWindow){ portalWindow.close(); }
    }

    componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    render(){  
        return(
            <Modal dialogClassName="lgcuModal" show={this.props.show} backdrop="static" size="lg" onHide={this.closeForm}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="card-payment-container">
                        <div className="details-container card-details">
                            <p className="description">Your student application will not be processed until your student application fee is submitted.  Please submit your student application fee online using either your application ID provided after your online application was submitted or the name used on your student application.</p>
                        </div>
                        <div className="details-container payment-details">
                            <div className="form-section-container">
                                <div className="form-element sz-10">
                                    <span>Email</span>
                                    <input type="text" name="email" className={(this.state.errorList.indexOf("email") > -1 ? "error":"")} placeholder="" value={this.state.email} onChange={(e) => this.onElementChange(e)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="btn-container">
                        <div className={"lBtn clear t1" +(this.state.errorList?.length <= 0 ? "" : " disable")} onClick={this.openPortal}><span>Open Payment Portal</span><i className="btn-icon far fa-credit-card"></i></div>
                        <div className={"lBtn clear t1"} onClick={this.closeForm}><span>Cancel</span><i className="btn-icon far fa-times-circle"></i></div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CloverCardPayment;
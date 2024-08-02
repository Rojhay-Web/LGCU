import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

let rootPath = (window.location.href.indexOf("localhost") > -1 ? "http://localhost:2323" : "");
let portalWindow, bc;

class CloverCardPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId:null, chargeItems: [], request_code: null, email: "",
            errorList: [], returnMessage:{"type":"", "message":""}, initRCode: false
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
                errorList: [], returnMessage:{"type":"", "message":""}, initRCode: false
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
        let self = this;
        try {
            self.setState({ returnMessage: {"type":"processing", "message":"Retrieving Payment Session"} }, ()=> {
                let specs ='height=100,width=100,status=no,menubar=no,toolbar=no,top=200,left=200',
                // windowPath = 'http://localhost:3000/payment-portal?code=5d2fa2d180d34c1887da09aa817f4d77';
                windowPath = `${rootPath}/v2/api/oauth-start`;
                // windowPath = 'https://lgcu-local.loca.lt/payment-portal?code=407aa2d1764940bb9822d4560a6a441a';
                portalWindow = window.open(windowPath, '_blank', specs);
                
                setTimeout(function(){
                    if(!self.state.request_code) { 
                        self.setState({ returnMessage: {"type":"error", "message":`Please Make Sure Popup Blocker Is Disabled`} });
                    }
                }, 3000);
            });
        }
        catch(ex){
            console.log(`starting app: ${ex}`);
        }
    }

    openPortal(){
        let self = this;
        try {
            if(this.state.errorList.length > 0){
                console.log(this.state.errorList);
            }
            else {
                self.setState({ returnMessage: {"type":"processing", "message":"Complete Payment In Payment Portal Window"} },()=> {
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
                            let specs ='height=600,width=500,status=no,menubar=no,toolbar=no,top=200,left=200';
                                
                            window.open(res.results.href, '_blank', specs);
                        }
                        else {
                            // Open Toast
                            console.log(res.error);
                            self.setState({ returnMessage: {"type":"error", "message":res.error} });
                        }
                    }).catch((err) =>{
                        console.log(`Error With Submitting Form [DF01]: ${err}`);
                        self.setState({ returnMessage: {"type":"error", "message":"Error With Submitting Form [DF01]"} });
                    });
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
                        self.setState({ 
                            request_code: e?.data?.value, returnMessage: {"type":"", "message":""}
                        }, () => { self.formValidation(); });
                        break;
                    case "payment-status":
                        if(e?.data?.value === "success"){
                            self.setState({ returnMessage: {"type":"success", "message":"Succesful Charge"} });
                            self.props.cbFunc();
                        }             
                        else {
                            self.setState({ returnMessage: {"type":"error", "message":`Payment ${e?.data?.value}`} });
                        }           
                        
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
        this.setState({ studentId: this.props.studentId, chargeItems: this.props.chargeItems });
    }

    componentDidUpdate(_prevProps){
        let self = this;
        if(this.props.show && !this.state.initRCode){
            this.setState({ initRCode: true }, ()=> {
                self.setBroadcastChannel();
                self.startApp();
            });
        }
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
                    <div className={"error-message" + (this.state.errorList.length > 0 ? " errorDisplay" : "")}><span>Please resolve the issues to complete the processing of your payment</span></div>
                    <div className={"status-message " + this.state.returnMessage.type}>
                        <span>Processing Transaction Please Wait...</span>

                        {!this.state.request_code && <i className="refresh fas fa-redo-alt" onClick={this.startApp}/>}
                    </div>

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
                        {this.state.returnMessage.type !== "success" && <div className={"lBtn clear t1" +(this.state.errorList?.length <= 0 ? "" : " disable")} onClick={this.openPortal}><span>Open Payment Portal</span><i className="btn-icon far fa-credit-card"></i></div> }
                        <div className={"lBtn clear t1"} onClick={this.closeForm}>
                            <span>{this.state.returnMessage.type === "success" ? "Close" : "Cancel"}</span>
                            <i className="btn-icon far fa-times-circle"></i>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CloverCardPayment;
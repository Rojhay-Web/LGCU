import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

let rootPath = (window.location.href.indexOf("localhost") > -1 ? "http://localhost:2323" : "");
let bc, clover_rcode_url = 'http://localhost:3000/payment-portal?code=fc18efcbde6c417ea20c3ea666160f22'; //`${rootPath}/v2/api/oauth-start`;

/* Body */
class CardPaymentV2 extends Component{
    constructor(props) {
        super(props);
        this.state = {
            request_code: null,
            cardDisplayNum: "XXXXXXXXXXXXXXXX",
            cardNum:"", cardExpMth:"00",
            cardExpYr:"0000", cardName:"", cvv:"", 
            cardEmail:"", cardType:"visa",

            cardAddress:"", cardCity:"", cardState:"",
            cardZip:"", cardCountry:"US",

            chargeTotal:0.00,
            adhocTotal: 0,

            monthList:["01","02","03","04","05","06","07","08","09","10","11","12"],
            cardTypeList:[
                { display:"Visa", value: "VISA"},
                { display:"Mastercard", value: "MC"},
                { display:"American Express", value: "AMEX"},
                { display:"Discover", value: "DISCOVER"},
                { display:"Diners Club", value: "DINERS_CLUB"},
                { display:"JCB", value: "JCB"}
            ],
            countryList:[], yearList:[], errorList:[], initRequestCode: false,
            returnMessage:{"type":"", "message":""}
        }   
        
        this.onElementChange = this.onElementChange.bind(this);
        this.getYrList = this.getYrList.bind(this);
        this.getCountryList = this.getCountryList.bind(this);
        this.cardFormValidation = this.cardFormValidation.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.setBroadcastChannel = this.setBroadcastChannel.bind(this);
    }

    onElementChange(event){
        var self = this;
        try {
            var name = event.target.name;
            var value = event.target.value;
            var maxLength = event.target.maxLength;
            var step = event.target.step;

            if(name in this.state && (!maxLength || maxLength < 0 || value.length <= maxLength)) {
                if(name === "cardNum"){
                    var tmpDisplayNum = [];
                    for(var i=0; i < 16; i++){
                        if(value.length > i){
                            tmpDisplayNum.push(value[i]);
                        }
                        else {
                            tmpDisplayNum.push("X");
                        }
                    }

                    self.setState({ [name]:value, cardDisplayNum: tmpDisplayNum.join("")});
                }
                else if(step !== ""){
                    if(value.indexOf(".") < 0 || (value.length - value.indexOf(".") <= 3)){
                        self.setState({ [name]:value });
                    }
                }
                else {
                    self.setState({ [name]:value });
                }
            }
        }
        catch(ex){
            console.log("Error with element change: ",ex);
        }
    }

    getYrList(){
        try {
            let yrList = [], d = new Date(), yr = d.getFullYear();
            
            for(var i =0; i < 8; i++){
                yrList.push(yr);
                yr = yr + 1;
            }

            this.setState({ yearList: yrList });
        }
        catch(ex){
            console.log("Error getting year list: ",ex);
        }
    }

    getCountryList() {
        let self = this;
        try {
            fetch('https://restcountries.com/v2/all', {
                method: 'GET', headers: { "Accept": "application/json", "Content-Type":"application/json"}
            })
            .then((response) => response.json())
            .then((res)=> {
                let coList = res.map(x => { return { name:x.name, alpha3Code:x.alpha2Code };});
                self.setState({countryList: coList });
            })
            .catch(function (error) {
                    // handle error
                console.log("Error getting country code list: ",error);
            }); 
        }
        catch(ex){
            console.log("Error getting country code list: ",ex);
        }
    }

    resetForm(){
        try {
            this.setState({
                request_code: null,
                cardDisplayNum: "XXXXXXXXXXXXXXXX",
                cardNum:"", cardExpMth:"00", cardExpYr:"00",
                cardName:"", cardType:"visa", cvv:"",
                cardCountry:"US", cardZip:"", cardEmail:"",
                cardAddress:"", cardCity:"", cardState:"",
                chargeTotal:0, errorList:[], adhocTotal: 0,
                returnMessage:{"type":"", "message":""}
            });
        }
        catch(ex){
            console.log("Error Resetting form: ",ex);
        }
    }

    closeForm(){
        if(this.state.returnMessage.type !== "processing"){
            this.props.handleClose();
            this.resetForm();
        }
    }

    cardFormValidation(){
        var status = false;
        var tmpErrorList = [];
    
        try {
            // Request Code
            if(this.state.request_code === null) {
                tmpErrorList.push("request_code");
            }

            // Check Cardholder Name
            if(this.state.cardName.length === 0){
                tmpErrorList.push("cardName");
            }
            
            // Check Card Type
            if(this.state.cardType.length === 0){
                tmpErrorList.push("cardType");
            }
            
            // Check Card Number
            if(this.state.cardNum.length !== 16){
                tmpErrorList.push("cardNum");
            }
            
            // Check Expiration Date
            if(this.state.cardExpMth === "00"){
                tmpErrorList.push("cardExpMth");
            }
            if(this.state.cardExpYr === "00"){
                tmpErrorList.push("cardExpYr");
            }
            // Check CSV
            if(this.state.cvv.length !== 3){
                tmpErrorList.push("cvv");
            }

            // Check Email
            var srtTst = this.state.cardEmail.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i);
            if(!srtTst || srtTst.length === 0){
                tmpErrorList.push("cardEmail");
            }

            // Check Address
            if(this.state.cardAddress.length === 0){
                tmpErrorList.push("cardAddress");
            }
            // Check City
            if(this.state.cardCity.length === 0){
                tmpErrorList.push("cardCity");
            }
            // Check State
            if(this.state.cardState.length === 0){
                tmpErrorList.push("cardState");
            }

            // Check Country Code
            if(this.state.cardCountry.length === 0){
                tmpErrorList.push("cardCountry");
            }
            // Check Postal code
            if(this.state.cardZip.length === 0){
                tmpErrorList.push("cardZip");
            }

            status = (tmpErrorList.length === 0);
            this.setState({ errorList: tmpErrorList });
        }
        catch(ex){
            console.log("Error with form validation: ",ex);
        }

        return status;
    }

    submitForm(){
        var self = this;
        try {
            if(this.state.returnMessage.type !== "processing" && this.cardFormValidation()){
                let bannerMessage = {"type":"", "message":""},
                    chargeForm = {
                        request_code: this.state.request_code,
                        title: this.props.title,
                        description: this.props.description,
                        email: this.state.cardEmail, 
                        card_info:{
                            number: this.state.cardNum,
                            exp_month: this.state.cardExpMth,
                            exp_year: this.state.cardExpYr,
                            cvv: this.state.cvv,
                            country: this.state.cardCountry,
                            brand: this.state.cardType,
                            address: this.state.cardAddress,
                            city: this.state.cardCity,
                            state: this.state.cardState,
                            zip: this.state.cardZip
                        },
                        chargeItems:(this.props?.adhoc ? 
                            [{ name: `Student adhoc payment`, price: this.state.adhocTotal }] 
                            : this.props.chargeItems
                        ),
                        studentId: this.props?.studentId
                    };
                
                self.setState({ returnMessage: {"type":"processing", "message":""} }, () =>{
                    let postData = JSON.stringify(chargeForm);

                    fetch(`${rootPath}/v2/api/lgcuCharge`, {
                        method: "POST", body: postData,
                        headers: { "Accept": "application/json", "Content-Type":"application/json"}
                    })
                    .then((response) => response.json())
                    .then((res)=> {
                        if(res.errorMessage == null){
                            // Successful Charge
                            bannerMessage.type = "success";
                            bannerMessage.message = "Succesful Charge";
                            self.props.cbFunc();
                        }
                        else {
                            console.log("[Error] Processing Payment: ", response.errorMessage);
                            // Error Banner
                            bannerMessage.type = "error";
                            bannerMessage.message = (response.results.Error ? response.results.Error.messages[0].description : response.errorMessage);
                        }

                        self.setState({ returnMessage: bannerMessage });
                    });
                });                
            }
        }
        catch(ex){
            console.log("Error with form validation: ",ex);
        }
    }

    setBroadcastChannel(){
        let self = this;
        try {
            bc = new BroadcastChannel("clover-payment");
            bc.onmessage = (e) => {
                switch(e?.data?.key){
                    case "request-code":
                        self.setState({ request_code: e?.data?.value, initRequestCode: false });
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
        // Get Year List    
        this.getYrList();

        // Get Country List
        this.getCountryList();

        // Calc Charge Total
        let tmpChargeTotal = 0;
        try {
            if(this.props?.chargeItems){
                this.props.chargeItems.forEach((c)=>{
                    tmpChargeTotal += c.price;
                });
            }
        }
        catch(ex) {
            console.log(`Calc Charge Total: ${ex}`);
        }
        this.setBroadcastChannel();
        this.setState({ 
            studentId: this.props.studentId, chargeItems: this.props.chargeItems,
            chargeTotal: tmpChargeTotal, initRequestCode: true
        }); 
    }

    componentWillUnmount(){
        this.resetForm();
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
                        {this.state.returnMessage.type !== "processing" && 
                            <span>{this.state.returnMessage.message}</span>
                        }
                        {this.state.returnMessage.type === "processing" && 
                            <span>Processing Transaction Please Wait...</span>
                        }
                    </div>

                    <div className="card-payment-container">
                        <div className="details-container card-details">
                            <p className="description">{this.props?.formDescription}</p>
                            <div className="card-form">
                                <div className="form-container">
                                    {this.state.initRequestCode ? 
                                        <div className='clover_req_code'>
                                            <iframe src={clover_rcode_url} title="clover request code container" style={{ height:'50px', width:'50px' }}></iframe>
                                        </div> : <></>
                                    }
                                    <div className="card-display">
                                        <div className="card-number">
                                            <span>{this.state.cardDisplayNum.substring(0, 4)}</span>
                                            <span>{this.state.cardDisplayNum.substring(4, 8)}</span>
                                            <span>{this.state.cardDisplayNum.substring(8, 12)}</span>
                                            <span>{this.state.cardDisplayNum.substring(12, 16)}</span>
                                        </div>
                                        <div className="card-exp">
                                            <span className="title">Exp</span>
                                            <span>{this.state.cardExpMth}</span>
                                            <span>/</span>
                                            <span>{this.state.cardExpYr}</span>
                                        </div>
                                        <div className="card-name">
                                            <span>{this.state.cardName || "Cardholder Name"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-container fill">
                                    <div className="form-section-container">
                                        <div className="form-element sz-7"><span>Cardholder Name</span><input type="text" name="cardName" className={(this.state.errorList.indexOf("cardName") > -1 ? "error":"")} placeholder="Cardholder Name" value={this.state.cardName} onChange={(e) => this.onElementChange(e)}/></div>
                                        <div className="form-element sz-3"><span>Card Type</span>
                                            <select name="cardType" className={(this.state.errorList.indexOf("cardType") > -1 ? "error":"")} value={this.state.cardType} onChange={(e) => this.onElementChange(e)}>
                                                {this.state.cardTypeList.map((type,i) => 
                                                    <option key={i} value={type.value}>{type.display}</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="form-element sz-10"><span>Card Number</span><input type="number" maxLength="16" name="cardNum" className={(this.state.errorList.indexOf("cardNum") > -1 ? "error":"")} placeholder="" value={this.state.cardNum} onChange={(e) => this.onElementChange(e)}/></div>

                                        <div className="form-element sz-3"><span>Exp Month</span>
                                            <select name="cardExpMth" className={(this.state.errorList.indexOf("cardExpMth") > -1 ? "error":"")} value={this.state.cardExpMth} onChange={(e) => this.onElementChange(e)}>
                                                <option value="00">Month</option>
                                                {this.state.monthList.map((month,i) => 
                                                    <option key={i} value={month}>{month}</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="form-element sz-3"><span>Exp Year</span>
                                            <select name="cardExpYr" className={(this.state.errorList.indexOf("cardExpYr") > -1 ? "error":"")} value={this.state.cardExpYr} onChange={(e) => this.onElementChange(e)}>
                                                <option value="00">Year</option>
                                                {this.state.yearList.map((year,i) => 
                                                    <option key={i} value={year}>{year}</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="form-element sz-4"><span>Card CVV</span><input type="number" maxLength="3" name="cvv" className={(this.state.errorList.indexOf("cvv") > -1 ? "error":"")} placeholder="" value={this.state.cvv} onChange={(e) => this.onElementChange(e)}/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="details-container payment-details">
                            <div className="form-section-container">
                            <div className="form-element sz-10"><span>Email Address</span><input type="text" name="cardEmail" className={(this.state.errorList.indexOf("cardEmail") > -1 ? "error":"")} placeholder="Email" value={this.state.cardEmail} onChange={(e) => this.onElementChange(e)}/></div>
                            </div>
                            
                            <div className="section-split lrg" />

                            <div className="form-section-container">                                
                                <div className="form-element sz-10"><span>Address</span><input type="text" name="cardAddress" className={(this.state.errorList.indexOf("cardAddress") > -1 ? "error":"")} placeholder="Address" value={this.state.cardAddress} onChange={(e) => this.onElementChange(e)}/></div>                
                                <div className="form-element sz-7"><span>City</span><input type="text" name="cardCity" className={(this.state.errorList.indexOf("cardCity") > -1 ? "error":"")} placeholder="City" value={this.state.cardCity} onChange={(e) => this.onElementChange(e)}/></div>                
                                <div className="form-element sz-3"><span>State</span><input type="text" name="cardState" className={(this.state.errorList.indexOf("cardState") > -1 ? "error":"")} placeholder="State" value={this.state.cardState} onChange={(e) => this.onElementChange(e)}/></div>                

                                <div className="form-element sz-6"><span>Country</span>
                                    <select name="cardCountry" className={(this.state.errorList.indexOf("cardCountry") > -1 ? "error":"")} value={this.state.cardCountry} onChange={(e) => this.onElementChange(e)}>
                                        <option value="">Country</option>
                                        {this.state.countryList.map((country,i) => 
                                            <option key={i} value={country.alpha3Code}>{country.name}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-element sz-4"><span>Postal Code</span><input type="number" name="cardZip" className={(this.state.errorList.indexOf("cardZip") > -1 ? "error":"")} placeholder="Postal Code" value={this.state.cardZip} onChange={(e) => this.onElementChange(e)}/></div>                
                            </div>
                            <div className="charge-total">
                                <div className="chargeTitle">Total: </div>
                                <div className="chargeAmount">
                                    <span>$</span>
                                    {this.props?.adhoc ?
                                        <input type="number" name="adhocTotal" step=".01" value={this.state.adhocTotal} onChange={(e) => this.onElementChange(e)} />
                                        : <span>{this.state.chargeTotal}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="btn-container">
                        {this.state.returnMessage.type !== "success" && <div className={"lBtn clear t1" +(this.state.returnMessage.type === "processing" || this.state.errorList?.length > 0 ? " disable" : "")} onClick={this.submitForm}><span>Submit</span><i className="btn-icon far fa-credit-card"></i></div> }
                        <div className={"lBtn clear t1" +(this.state.returnMessage.type === "processing" ? " disable" : "")} onClick={this.closeForm}>
                            <span>{this.state.returnMessage.type === "success" ? "Close" : "Cancel"}</span>
                            <i className="btn-icon far fa-times-circle"></i>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CardPaymentV2;
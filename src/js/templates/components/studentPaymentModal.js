import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

var AppIdGlobal = "";
var rootPath = "";
//var rootPath = "http://localhost:1111";

/* Body */
class StudentPayment extends Component{
    constructor(props) {
        super(props);
        this.state = {
            cardDisplayNum: "XXXXXXXXXXXXXXXX",
            cardNum:"",
            cardExpMth:"00",
            cardExpYr:"00",
            cardFirstName:"",
            cardLastName:"",
            cardCSV:"",
            cardCountry:"",
            cardZip:"",
            cardEmail:"",
            chargeTotal:0,

            countryList:[],
            monthList:["01","02","03","04","05","06","07","08","09","10","11","12"],
            yearList:[],
            errorList:[],
            returnMessage:{"type":"", "message":""}
        }   
        
        this.onElementChange = this.onElementChange.bind(this);
        this.getYrList = this.getYrList.bind(this);
        this.getCountryList = this.getCountryList.bind(this);
        this.cardFormValidation = this.cardFormValidation.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }

    onElementChange(event){
        var self = this;
        try {
            var name = event.target.name;
            var value = event.target.value;
            var maxLength = event.target.maxLength;
            var step = event.target.step;

            if(name in this.state && (!maxLength || maxLength < 0 || value.length <= maxLength)) {
                if(name == "cardNum"){
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
                else if(step != ""){
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
            var yrList = [];
            var d = new Date();
            var yr = d.getFullYear();
            
            for(var i =0; i < 8; i++){
                yrList.push(yr.toString().slice(2));
                yr = yr + 1;
            }
            this.setState({ yearList: yrList });
        }
        catch(ex){
            console.log("Error getting year list: ",ex);
        }
    }

    getCountryList() {
        var self = this;
        try {
        axios.get('https://restcountries.eu/rest/v2/all')
            .then(function (res) {
                var coList = res.data.map(x => { return {name:x.name, alpha3Code:x.alpha3Code};});
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
                cardDisplayNum: "XXXXXXXXXXXXXXXX",
                cardNum:"", cardExpMth:"00", cardExpYr:"00",
                cardFirstName:"", cardLastName:"", cardCSV:"",
                cardCountry:"", cardZip:"", cardEmail:"",
                chargeTotal:0, errorList:[], returnMessage:{"type":"", "message":""}
            });
        }
        catch(ex){
            console.log("Error Resetting form: ",ex);
        }
    }

    closeForm(){
        if(this.state.returnMessage.type != "processing"){
            this.props.handleClose();
            this.resetForm();
        }
    }

    componentDidMount(){
        var self = this;
        // Get Year List    
        self.getYrList();  
        self.getCountryList(); 
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
                        {this.state.returnMessage.type != "processing" && 
                            <span>{this.state.returnMessage.message}</span>
                        }
                        {this.state.returnMessage.type == "processing" && 
                            <span>Processing Transaction Please Wait...</span>
                        }
                    </div>

                    <div className="card-payment-container">
                        <div className="details-container card-details">
                            <p className="description">Courses will be added to students account after payment has been processed.  Students will have a 2 weeks grace period after course registration to remove course (Please contact admissions@lenkesongcu.com to unegister from any course).</p>
                            <div className="card-form">
                                <div className="form-container">
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
                                            <span>{this.state.cardFirstName +" "+this.state.cardLastName || "Name"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-container fill">
                                    <div className="form-section-container">
                                        <div className="form-element sz-5"><span>Firstname</span><input type="text" name="cardFirstName" className={(this.state.errorList.indexOf("cardFirstName") > -1 ? "error":"")} placeholder="Firstname" value={this.state.cardFirstName} onChange={(e) => this.onElementChange(e)}/></div>
                                        <div className="form-element sz-5"><span>Lastname</span><input type="text" name="cardLastName" className={(this.state.errorList.indexOf("cardLastName") > -1 ? "error":"")} placeholder="LastName" value={this.state.cardLastName} onChange={(e) => this.onElementChange(e)}/></div>
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
                                        <div className="form-element sz-4"><span>Card CSV</span><input type="number" maxLength="3" name="cardCSV" className={(this.state.errorList.indexOf("cardCSV") > -1 ? "error":"")} placeholder="" value={this.state.cardCSV} onChange={(e) => this.onElementChange(e)}/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="details-container payment-details">
                            <div className="form-section-container"></div>
                            
                            <div className="section-split lrg" />

                            <div className="form-section-container">
                                <div className="form-element sz-10"><span>Email Address</span><input type="text" name="cardEmail" className={(this.state.errorList.indexOf("cardEmail") > -1 ? "error":"")} placeholder="Email" value={this.state.cardEmail} onChange={(e) => this.onElementChange(e)}/></div>
                                <div className="form-element sz-4"><span>Country</span>
                                    <select name="cardCountry" className={(this.state.errorList.indexOf("cardCountry") > -1 ? "error":"")} value={this.state.cardCountry} onChange={(e) => this.onElementChange(e)}>
                                        <option value="">Country</option>
                                        {this.state.countryList.map((country,i) => 
                                            <option key={i} value={country.alpha3Code}>{country.name}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-element sz-6"><span>Postal Code</span><input type="number" name="cardZip" className={(this.state.errorList.indexOf("cardZip") > -1 ? "error":"")} placeholder="Postal Code" value={this.state.cardZip} onChange={(e) => this.onElementChange(e)}/></div>                
                            </div>
                            <div className="charge-total">
                                <div className="chargeTitle">Total: </div>
                                <div className="chargeAmount">
                                    <span>$</span>
                                    <input type="number" name="chargeTotal" step=".01" value={(this.props.adhoc == true ? this.state.chargeTotal: this.props.totalPrice)} onChange={(e) => this.onElementChange(e)} readOnly={this.props.adhoc != true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="btn-container">
                        {this.state.returnMessage.type != "success" && <div className={"lBtn clear t1" +(this.state.returnMessage.type == "processing" ? " disable" : "")} onClick={this.submitForm}><span>Submit</span><i className="btn-icon far fa-credit-card"></i></div> }
                        <div className={"lBtn clear t1" +(this.state.returnMessage.type == "processing" ? " disable" : "")} onClick={this.closeForm}><span>Cancel</span><i className="btn-icon far fa-times-circle"></i></div>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }

    cardFormValidation(){
        var status = false;
        var tmpErrorList = [];
    
        try {
            // Check First & Last Name
            if(this.state.cardFirstName.length == 0){
                tmpErrorList.push("cardFirstName");
            }
            if(this.state.cardLastName.length == 0){
                tmpErrorList.push("cardLastName");
            }

            // Check Card Number
            if(this.state.cardNum.length !== 16){
                tmpErrorList.push("cardNum");
            }
            
            // Check Expiration Date
            if(this.state.cardExpMth == "00"){
                tmpErrorList.push("cardExpMth");
            }
            if(this.state.cardExpYr == "00"){
                tmpErrorList.push("cardExpYr");
            }
            // Check CSV
            if(this.state.cardCSV.length !== 3){
                tmpErrorList.push("cardCSV");
            }
            // Check Email
            var srtTst = this.state.cardEmail.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i);
            if(!srtTst || srtTst.length == 0){
                tmpErrorList.push("cardEmail");
            }
            // Check Country Code
            if(this.state.cardCountry.length == 0){
                tmpErrorList.push("cardCountry");
            }
            // Check Postal code
            if(this.state.cardZip.length == 0){
                tmpErrorList.push("cardZip");
            }

            status = (tmpErrorList.length == 0);
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
            if(this.state.returnMessage.type != "processing" && this.cardFormValidation()){
                var cardExp = this.state.cardExpMth+this.state.cardExpYr;
                var charge = parseInt(this.props.totalPrice);
                var tmpCharge = 0;
                var bannerMessage = {"type":"", "message":""};

                var sessionInfo = localStorage.getItem(this.props.mySessKey);
                var localUser = JSON.parse(sessionInfo);

                
                var chargeForm = 
                {
                    userInfo:{
                        _id: localUser._id,
                        studentId: this.props.studentInfo.studentId
                    },
                    transactionInfo: {
                        userEmail: this.state.cardEmail, chargeDescription: (this.props.adhoc == true ? "myLGCU Account Payment" : "Student Course Payment"),
                        cardInfo:{
                            cardNumber: this.state.cardNum, cardExp: cardExp, cardCode: this.state.cardCSV,
                            firstname: this.state.cardFirstName, lastname: this.state.cardLastName, 
                            zip: this.state.cardZip, country: this.state.cardCountry,
                        },
                        chargeItems:[]
                    }
                };
                
                if(this.props.adhoc == true){
                    var chargeItem = {name:"Account Payment", description:"A payment made by the student via the myLGCU Account Portal", quantity:1, price: parseFloat(this.state.chargeTotal).toFixed(2) };
                    chargeForm.transactionInfo.chargeItems.push(chargeItem);
                }
                else {
                    // Calculate Course Charges
                    this.props.queuedCourses.forEach(function(course){
                        var courseCharge = self.props.creditRate * course.credits;
                        courseCharge = parseInt(courseCharge,10);
                        var chargeItem = {name:"Course Registration", description:"Course Id: "+ course.id +", Course: "+ course.name+", credit: "+course.credits, quantity:1, price: courseCharge.toFixed(2) };
                        
                        tmpCharge = tmpCharge + courseCharge;
                        chargeForm.transactionInfo.chargeItems.push(chargeItem);
                    });

                    if(this.props.currentCourses.length == 0){
                        var chargeItem = {name:"Technology Fee", description:"Student Semester Technology Fee", quantity:1, price: this.props.technologyFee.toFixed(2) };
                        
                        tmpCharge = tmpCharge + this.props.technologyFee;
                        chargeForm.transactionInfo.chargeItems.push(chargeItem);
                    }
                }

                if(this.props.adhoc != true && charge !== tmpCharge) {
                    alert("Error with charge alignment please contact admin");
                }
                else {
                    self.setState({ returnMessage: {"type":"processing", "message":""} }, () =>{
                        axios.post(rootPath + "/api/accountCharge", chargeForm, {'Content-Type': 'application/json'})
                        .then(function(resp) {
                            try {
                                var response = resp.data;
                                if(response.errorMessage == null){
                                    // Successful Charge
                                    if(response.results.messages){
                                        if(response.results.messages.resultCode && response.results.messages.resultCode == "Ok"){
                                            // Success
                                            alert((self.props.adhoc == true ? "Charge was successful" : "Charge was successful your courses are now being added"));
                                            bannerMessage.type = "success";
                                            bannerMessage.message = response.results.transactionResponse.messages.message[0].description;
                                            
                                            if(self.props.adhoc != true ) { self.props.registerCourseList(); }
                                            self.closeForm();
                                        }
                                        else {
                                            // Error
                                            alert("Error Processing Payment [E1]: "+ response.results.transactionResponse.messages.message[0].description);
                                            bannerMessage.type = "error";
                                            bannerMessage.message = response.results.transactionResponse.messages.message[0].description;
                                        }
                                    }
                                }
                                else {
                                    alert("Error Processing Payment [E2]: " +  response.errorMessage);
                                    console.log("[Error] Error Processing Payment: ", response.errorMessage);
                                    bannerMessage.type = "error";
                                    bannerMessage.message = response.results.transactionResponse.errors.error[0].errorText;
                                }
                            }
                            catch(ex){
                                alert("Error Processing Payment Please Contact: info@lenkesongcu.com");
                                bannerMessage.type = "error";
                                bannerMessage.message = "Error Processing Payment Please Contact: info@lenkesongcu.com";
                            }

                            self.setState({ returnMessage: bannerMessage });
                        });
                    });
                }
            }
        }
        catch(ex){
            console.log("Error with form validation: ",ex);
        }
    }
}

export default StudentPayment;
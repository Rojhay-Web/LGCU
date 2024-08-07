import React, { Component } from 'react';
import axios from 'axios';

import CardPaymentV2 from '../components/cloverCardPaymentModal';

let rootPath = (window.location.href.indexOf("localhost") > -1 ? "http://localhost:2323" : "");
let bc, clover_rcode_url = 'http://localhost:3000/payment-portal?code=0bd0e7de792145fe823c42d67ef6433a'; //`${rootPath}/v2/api/oauth-start`;
let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

/* Body */
class MyAccount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            request_code: null,
            spinner: false,
            modalStatus:false,
            initRequestCode: false,
            studentInfo:{ studentId:0, talentlmsId:0, degree: "", class:"", gpa:0, fulltime:false },
            accountTransactions:[]
        }

        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.loadAccountInfo = this.loadAccountInfo.bind(this);
        this.loadAccountCharges = this.loadAccountCharges.bind(this);
        this.loadStudentInfo = this.loadStudentInfo.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.convertItemData = this.convertItemData.bind(this);
        this.setBroadcastChannel = this.setBroadcastChannel.bind(this);
    }

    convertItemData(data,type){
        var ret = "";
        try {
            if(type === "date"){
                var d = new Date(data);
                ret = (d.getMonth()+1) + "-" + d.getDate() + "-" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() < 10 ? "0"+d.getMinutes() : d.getMinutes());
            }
            else if(type === "amount"){
                ret = (data / 100);
                ret = USDollar.format(ret);
            }
        }
        catch(ex){
            console.log("Error converting data: ",ex);
        }
        return ret;
    }

    toggleSpinner(status){
        this.setState({ spinner: status });
    }

    modalShow(){
        this.setState({ modalStatus: true });
    }

    modalHide(){
        this.setState({ modalStatus: false });
    }

    loadAccountInfo(){
        var self = this;

        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);

            if(sessionInfo){ 
                var localUser = JSON.parse(sessionInfo);
                var postData = { requestUser: { _id: localUser._id}, userInfo: { _id: localUser._id} };

                self.toggleSpinner(true);

                axios.post(rootPath + "/api/searchUserTransactions", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert("Error retreiving user transactions: ", response.errorMessage);
                    }
                    else {
                        var accountTransactions = response.data.results.sort(function(a,b){
                            return new Date(b.transaction_date) - new Date(a.transaction_date);
                        });

                        self.setState({ accountTransactions: accountTransactions}, ()=> { self.toggleSpinner(false); });
                    }
                });   
            }
            else {
                
            }
        }
        catch(ex){
            alert("[Error] Loading Student Account Info: ", ex);
            self.toggleSpinner(false);
        }
    }

    loadAccountCharges(){
        let self = this;

        try {
            let sessionInfo = localStorage.getItem(this.props.mySessKey);
            if(sessionInfo && self.state.request_code){
                let localUser = JSON.parse(sessionInfo);
                let postData = { 
                    request_code: self.state.request_code,
                    studentId: localUser.studentId
                };

                fetch(`${rootPath}/v2/api/mylgcuAccount`,{
                    method: "POST", body: JSON.stringify(postData),
                    headers: { "Accept": "application/json", "Content-Type":"application/json"}
                })
                .then((response) => response.json())
                .then((res)=> {
                    if(res.error){
                        alert(`Error retreiving user transactions: ${res.error}`);
                    }
                    else {
                        let accountTransactions = res.results.sort(function(a,b){
                            return new Date(b.createdTime) - new Date(a.createdTime);
                        });

                        self.setState({ accountTransactions: accountTransactions }, ()=> { 
                            self.toggleSpinner(false); 
                        });
                    }
                });
            }
        }
        catch(ex){
            self.toggleSpinner(false);
        }
    }

    loadStudentInfo() {
        var self = this;

        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);

            if(sessionInfo){ 
                var localUser = JSON.parse(sessionInfo);
                var postData = { requestUser: { _id: localUser._id}, userInfo: { _id: localUser._id, full:true} };

                self.toggleSpinner(true);

                axios.post(self.props.rootPath + "/api/getUserById", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert(response.data.errorMessage );
                    }
                    else {
                        var userInfo = response.data.results;
                        var tmpStudent = {  fulltime: (userInfo.studentInfo.fulltime === true),
                                            military: userInfo.military, studentId: userInfo.studentId, 
                                            talentlmsId: userInfo.talentlmsId };
                        self.setState({ studentInfo: tmpStudent });
                    }
                });   
            }
            else {
                self.setState({ studentInfo: {} });
            }
            self.toggleSpinner(false);
        }
        catch(ex){
            alert("[Error] Loading Student Info: ", ex);
            self.toggleSpinner(false);
        }
    }

    setBroadcastChannel(){
        let self = this;
        try {
            bc = new BroadcastChannel("clover-payment");
            bc.onmessage = (e) => {
                switch(e?.data?.key){
                    case "request-code":
                        self.setState({ request_code: e?.data?.value, initRequestCode: false },()=>{
                            self.loadAccountCharges();
                        });
                        break;
                    default:
                        break;
                }
            };
        }
        catch(ex){
            console.log(`Setting Broadcast Channel: ${ex}`);
        }
    }

    componentDidMount(){ 
        this.loadStudentInfo();
        this.setBroadcastChannel();
        this.setState({ initRequestCode: true });
        // this.loadAccountInfo();
    }

    render(){  
        return(
            <div className="mylgcu-account">
               {/* Spinner */}
               {this.state.spinner && <div className="spinner"><i className="fas fa-cog fa-spin"/><span>Loading</span></div> }

               {/* Student Payment */}
                <CardPaymentV2 
                    title="Student Account Payment" 
                    description='Account General Payment'
                    formDescription="General Account Payment"
                    show={this.state.modalStatus} handleClose={this.modalHide} 
                    chargeItems={[]} studentId={this.state.studentInfo} 
                    cbFunc={this.modalHide} adhoc={true}
                />

               {/* Make A Payment Btn*/}
               <div className="mylgcu-content-section addUser">
                    <div className="btn-container">
                        <div className="lBtn c2" onClick={this.modalShow}><span>Make Payment</span> <i className="far fa-credit-card"></i></div>
                    </div> 
                </div>

                {/* Student Account Records */}
                <div className="mylgcu-content-section inverse account-fitted-section">
                    <div className="section-title">My Account</div>
                    
                    {this.state.initRequestCode ? 
                        <div className='clover_req_code'>
                            <iframe src={clover_rcode_url} title="clover request code container" style={{ height:'50px', width:'50px' }}></iframe>
                        </div> : <></>
                    }

                    {this.state.accountTransactions.map((item, i) => (
                        <div className="content-block sz10" key={i}>
                            <div className="account-info">
                                <div className="account-block">
                                    <span className="account-icon success"><i className="fas fa-check"></i></span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">Transaction Date</span>
                                    <span>{this.convertItemData(item.createdTime, "date")}</span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">Transaction Id</span>
                                    <span>{item.id}</span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">Transaction Status</span>
                                    <span>{item.payType}</span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">Total Charge</span>
                                    <span>{this.convertItemData(item.total,"amount")}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default MyAccount;
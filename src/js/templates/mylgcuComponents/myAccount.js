import React, { Component } from 'react';
import { UncontrolledCollapse } from 'reactstrap';
import axios from 'axios';

import StudentPayment from '../components/studentPaymentModal';

/* Body */
class MyAccount extends Component{
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            modalStatus:false,
            studentInfo:{ studentId:0, talentlmsId:0, degree: "", class:"", gpa:0, fulltime:false },
            accountTransactions:[]
        }

        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.loadAccountInfo = this.loadAccountInfo.bind(this);
        this.loadStudentInfo = this.loadStudentInfo.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
    }

    componentDidMount(){ 
        this.loadStudentInfo();
        this.loadAccountInfo();
    }

    render(){  
       
        return(
            <div className="mylgcu-account">
               {/* Spinner */}
               {this.state.spinner && <div className="spinner"><i className="fas fa-cog fa-spin"/><span>Loading</span></div> }

               {/* Student Payment */}
               <StudentPayment title="Student Account Payment" show={this.state.modalStatus} handleClose={this.modalHide} studentInfo={this.state.studentInfo} mySessKey={this.props.mySessKey} adhoc={true}/>

               {/* Make A Payment Btn*/}
               <div className="mylgcu-content-section addUser">
                    <div className="btn-container">
                        <div className="lBtn c2" onClick={this.modalShow}><span>Make Payment</span> <i className="far fa-credit-card"></i></div>
                    </div> 
                </div>

                {/* Student Account Records */}
                <div className="mylgcu-content-section inverse account-fitted-section">
                    <div className="section-title">My Account</div>

                    {this.state.accountTransactions.map((item, i) => (
                        <div className="content-block sz10" key={i}>
                            <div className="account-info">
                                <div className="account-block">
                                    <span className="account-icon success"><i className="fas fa-check"></i></span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">Transaction Date</span>
                                    <span>{item.submitTime}</span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">Transaction Id</span>
                                    <span>{item.transactionId}</span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">{item.order.invoiceNumber}</span>
                                    <span>{item.order.description}</span>
                                </div>

                                <div className="account-block">
                                    <span className="subText">Total Charge</span>
                                    <span>$ {item.amount.toFixed(2)}</span>
                                </div>

                                <div className="account-block">
                                    <span className="account-icon info" id={"toggler"+i}><i className="fas fa-info"></i></span>
                                </div>
                            </div>

                            <UncontrolledCollapse toggler={"#toggler"+i} className="account-toggler">
                                <table className="account-table overview-table">
                                    <thead>
                                        <tr className="header">
                                            <th>Charge Name</th>
                                            <th>Charge Description</th>
                                            <th>Charge Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.lineItems.map((charge,k) => (
                                            <tr key={k}>
                                                <td>{charge.name}</td>
                                                <td>{charge.description}</td>
                                                <td>$ {charge.price.toFixed(2)}</td>
                                            </tr>
                                        ))}                                        
                                    </tbody>
                                </table>
                            </UncontrolledCollapse>
                        </div>
                    ))}
                </div>
            </div>
        );
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

                axios.post(self.props.rootPath + "/api/searchUserTransactions", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert("Error retreiving user transactions: ", response.errorMessage);
                    }
                    else {
                        var accountTransactions = response.data.results.filter(function(item){
                            return item.errorMessage == null;
                        }).map(function(item){
                            return item.results;
                        })
                        .sort(function(a,b){
                            return new Date(b.submitTime) - new Date(a.submitTime);
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
                        var tmpStudent = {  fulltime: (userInfo.studentInfo.fulltime == true),
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
}

export default MyAccount;
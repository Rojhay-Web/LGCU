import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

/* Images */
import back1 from '../../assets/site/mylgcuBack.jpeg';
import logo from '../../assets/LGCULogo2_full.PNG';
/* Components */
import MyProfile from './mylgcuComponents/myProfile';
import MyAccount from './mylgcuComponents/myAccount';
import MyCourses from './mylgcuComponents/myCourses';
import MyAdmin from './mylgcuComponents/myAdmin';

var mySessKey = "mylgcu_aditum";
var rootPath = "";
//var rootPath = "http://localhost:1111";

/* Header */
class myLGCUHeader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            userId:null,
            modalStatus: false
        }

        this.modalHide = this.modalHide.bind(this);
        this.userAccess = this.userAccess.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    componentDidMount(){
        this.getUserInfo();
    }

    modalHide(){
        this.setState({ modalStatus: false });
    }

    getUserInfo(){
        var self = this;
        try {
            var sessionInfo = localStorage.getItem(mySessKey);
            var signOut = true;
            
            if(sessionInfo){
                var localUser = JSON.parse(sessionInfo);
                if(localUser.lastLogin != null){
                    signOut = false;
                    self.setState({name: localUser.fullname, userId: localUser._id, lastLogin: Date.now(), modalStatus: false });
                }
            }


            if(signOut) {
                localStorage.removeItem(mySessKey);
                this.setState({ name: null, userId:null, lastLogin:null, modalStatus: true });
            }
        }
        catch(ex){
            console.log("[Error] Getting User Info: ",ex);
        }
    }

    userAccess(status){
        this.getUserInfo();
        window.location.reload();
    }

    signOut() {
        localStorage.removeItem(mySessKey);
        this.getUserInfo();
    }

    render(){        
        return(
            <div className="headerCard mylgcuHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="myLGCU back img" src={back1} /></div>
                    {this.state.userId ? 
                        <div className="mylgcu-info">
                            <div className="info-welcome">
                                <p>Welcome, {this.state.name} to <span className="c2">myLGCU</span></p>
                                <p>your student portal.</p>
                            </div>
                            <div className="solid-back">
                                <span>Please use the tools below to access your Lenkeson Global Christian University courses, account, and resources.</span>
                            </div>

                            <div className="btn-container">
                                <div className="lBtn clear t2" onClick={this.signOut}><span>Sign Out</span><i className="btn-icon fas fa-sign-out-alt"></i></div>
                            </div>
                        </div>
                        :
                        <div className="mylgcu-info">
                            <div className="info-welcome">
                                <p>Please sign in to access your <span className="c2">myLGCU</span> account</p>                               
                            </div>
                        </div>
                    }
                </div> 

                <SignInModal show={this.state.modalStatus} handleClose={this.modalHide} userAccess={this.userAccess} />               
            </div>
        );
    }
}

/* Body */
class myLGCU extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedPage:"profile",
            name: null,
            userId:null,
            userAccess: false
        }

        this.setPage = this.setPage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0); 
        this.getUserInfo(); 
        this.setState({ selectedPage: "profile" });
    }

    render(){   
        return(
            <div className="inner-page-body mylgcuPage">
                {this.state.userId ? 
                    <div className="userAccess">
                        <section className="mylgcu-section">
                            { this.setPage() }
                        </section>

                        <section className="mylgcu-nav-container">
                            <div className={"mylgcu-nav-item" + (this.state.selectedPage == "profile" ? " selected" :"")} onClick={(e) => this.changePage("profile")}><i className="far fa-user-circle"></i> <span>Profile</span></div>
                            <div className={"mylgcu-nav-item" + (this.state.selectedPage == "courses" ? " selected" :"")} onClick={(e) => this.changePage("courses")}><i className="fas fa-book-reader"></i> <span>Courses</span></div>
                            <div className={"mylgcu-nav-item" + (this.state.selectedPage == "account" ? " selected" :"")} onClick={(e) => this.changePage("account")}><i className="fas fa-file-invoice-dollar"></i> <span>Account</span></div>
                            {this.state.admin && <div className={"mylgcu-nav-item" + (this.state.selectedPage == "admin" ? " selected" :"")} onClick={(e) => this.changePage("admin")}><i className="fas fa-user-shield"></i> <span>Admin</span></div> }
                        </section>
                    </div>
                :
                    <div className="userAccess">
                        <h1 className="noAccess">Please Sign in to access your <span className="c2">myLGCU</span> account</h1>
                    </div>
                }
            </div>
        );
    }

    getUserInfo(){
        var self = this;
        try {
            var sessionInfo = localStorage.getItem(mySessKey);
            
            if(sessionInfo){
                var localUser = JSON.parse(sessionInfo);
                self.setState({ userAccess: true, name: localUser.fullname, userId: localUser._id, admin: localUser.admin });
            }
            else {
                self.setState({ userAccess: false, name: null, userId: null });
            }
        }
        catch(ex){
            console.log("[Error] Getting User Info: ",ex);
        }
    }

    changePage(pageTitle){
        this.setState({selectedPage: pageTitle.toLowerCase() });
    }

    setPage(){
        switch(this.state.selectedPage.toLowerCase()){
            case "profile":
                return <MyProfile user={this.state.userInfo} rootPath={rootPath} mySessKey={mySessKey} />;                
            case "courses":
                return <MyCourses user={this.state.userInfo} rootPath={rootPath} mySessKey={mySessKey} />;
            case "account":
                return <MyAccount user={this.state.userInfo} rootPath={rootPath} mySessKey={mySessKey} />;
            case "admin":
                return <MyAdmin user={this.state.userInfo} rootPath={rootPath} mySessKey={mySessKey} />;
            default:
                return <div>No Page Selected</div>;
        }
    }
}

export {myLGCU, myLGCUHeader};

/* Sign in Modal */
class SignInModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            email:"",
            password:"",
            error:null
        }

        this.onElementChange = this.onElementChange.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount(){}

    onElementChange(event){
        var self = this;
        try {
            var tmpData = this.state;
            var name = event.target.name;

            if(name in tmpData) {
                self.setState({ [name]: event.target.value });
            }
        }
        catch(ex){
            console.log("Error changing text: ",ex);
        }
    }
    login(e){
        var self = this;
        try {
            var postData = { loginInfo:{"email":this.state.email, "password":this.state.password}};
            /* Call Login */
            axios.post(rootPath + "/api/userLogin", postData, {'Content-Type': 'application/json'})
            .then(function(response) {
                if(response.data.errorMessage){
                    self.setState({ error: response.data.errorMessage });
                }
                else {
                    var tmpUser = {email: self.state.email, fullname: response.data.results.fullname, lastLogin: Date.now(),
                                    _id: response.data.results._id, admin: response.data.results.admin};
                    localStorage.setItem(mySessKey, JSON.stringify(tmpUser));
                    self.props.userAccess(true);
                }
            });             
        }
        catch(ex){
            console.log("Error with user login: ",ex);
        }
    }

    render(){    
        return(
            <Modal dialogClassName="signinModal" show={this.props.show} backdrop="static" size="xl" onHide={this.closeForm}>
                <Modal.Body>
                    <div className="signin-container">
                        {this.state.error && 
                            <div className="signin-error-message">{this.state.error}</div>
                        }
                        <div className="header-container">
                            <img alt="logo img" className="headerLogo" src={logo}/>
                            <div className="textLogo">
                                <div className="logoLine">Lenkeson Global</div>
                                <div className="logoLine">Christian University</div>
                            </div>
                        </div>

                        <h1>Sign In to MyLGCU</h1>

                        <div className="form-element">
                            <span>Email</span>
                            <input type="text" name="email" className="" placeholder="Your Email" value={this.state.email} onChange={(e) => this.onElementChange(e)}/>
                        </div>

                        <div className="form-element">
                            <span>Password</span>
                            <input type="password" name="password" className="" placeholder="" value={this.state.password} onChange={(e) => this.onElementChange(e)}/>
                        </div>

                        <div className="forgot-link">
                            <a href="https://lenkesongcu.talentlms.com" target="_blank">Forgot Password?</a>
                        </div>

                        <div className="form-btn-container">
                            <div className="lBtn c1" onClick={this.login}><span>Sign In</span><i className="btn-icon fas fa-unlock-alt"></i></div>
                            <a href="" className="lBtn c2"><span>Return Home</span><i className="btn-icon fas fa-home"></i></a>
                        </div>  
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
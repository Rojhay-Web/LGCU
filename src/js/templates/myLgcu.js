import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/site/mylgcuBack.jpeg';

/* Components */
import MyProfile from './mylgcuComponents/myProfile';
import MyAccount from './mylgcuComponents/myAccount';
import MyCourses from './mylgcuComponents/myCourses';

/* Header */
class myLGCUHeader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: "Joe Smith"
        }
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard mylgcuHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="myLGCU back img" src={back1} /></div>
                    <div className="mylgcu-info">
                        <div className="info-welcome">
                            <p>Welcome, {this.state.name} to <span className="c2">myLGCU</span></p>
                            <p>your student portal.</p>
                        </div>
                        <div className="solid-back">
                            <span>Please use the tools below to access your Lenkeson Global Christian University courses, account, and resources.</span>
                        </div>
                    </div>
                </div>                
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
            userInfo:{id:"", email:"", pwd:""}
        }

        this.setPage = this.setPage.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div className="inner-page-body mylgcuPage">
                <section className="mylgcu-section">
                    { this.setPage() }
                </section>

                <section className="mylgcu-nav-container">
                    <div className={"mylgcu-nav-item" + (this.state.selectedPage == "profile" ? " selected" :"")} onClick={(e) => this.changePage("profile")}><i className="far fa-user-circle"></i> <span>Profile</span></div>
                    <div className={"mylgcu-nav-item" + (this.state.selectedPage == "courses" ? " selected" :"")} onClick={(e) => this.changePage("courses")}><i className="fas fa-book-reader"></i> <span>Courses</span></div>
                    <div className={"mylgcu-nav-item" + (this.state.selectedPage == "account" ? " selected" :"")} onClick={(e) => this.changePage("account")}><i className="fas fa-file-invoice-dollar"></i> <span>Account</span></div>
                    <div className="mylgcu-nav-item"><i className="fas fa-chalkboard-teacher"></i> <span>TalentLMS</span></div>
                    <div className={"mylgcu-nav-item" + (this.state.selectedPage == "admin" ? " selected" :"")} onClick={(e) => this.changePage("admin")}><i className="fas fa-user-shield"></i> <span>Admin</span></div>
                </section>
            </div>
        );
    }

    changePage(pageTitle){
        this.setState({selectedPage: pageTitle.toLowerCase() });
    }

    setPage(){
        switch(this.state.selectedPage.toLowerCase()){
            case "profile":
                return <MyProfile user={this.state.userInfo} />;
                break;
            case "courses":
                return <MyCourses user={this.state.userInfo} />;
                break;
            case "account":
                return <MyAccount user={this.state.userInfo} />;
                break;
            default:
                return <div>No Page Selected</div>;
                break;
        }
    }
}

export {myLGCU, myLGCUHeader};
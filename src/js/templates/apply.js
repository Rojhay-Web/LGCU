import React, { Component } from 'react';
import queryString from 'query-string';

/* Images */
import back1 from '../../assets/site/mini/img13.jpg';
import appImg from '../../assets/site/mini/img14.jpg';

/* Header */
class ApplyHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard applyHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="Apply img" src={back1} /></div>
                    <h1>Apply Online</h1>                    
                    <div className="solid-back">
                        <span>Complete an online application to become apart of the Lenkeson Global Christian University community.</span>
                    </div>

                    <div className="btn-container">
                        <a href="/apply?type=student" className="lBtn clear t1"><span>Student Application</span><i className="btn-icon fas fa-graduation-cap"></i></a>
                        <div className="btn-split-txt">Or</div>
                        <a href="/apply?type=faculty" className="lBtn clear t1"><span>Faculty Application</span><i className="btn-icon fas fa-chalkboard-teacher"></i></a>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Apply extends Component{
    constructor(props) {
        super(props);
        this.state={
            params:""
        }

        this.getAppType = this.getAppType.bind(this);
        this.setApplication = this.setApplication.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.getAppType();
    }

    render(){        
        return(
            <div className="inner-page-body applyPage">
                <section className="apply-section" id="appbody">
                    {this.setApplication()}
                </section>
            </div>
        );
    }

    getAppType(){
        var self = this;
        var appType = "";
        try {
            var values = queryString.parse(this.props.location.search);
            appType = ("type" in values ? values.type : "");
        }
        catch(ex){
            console.log("Error getting App type: ",ex);
        }

        this.setState({params: appType });
    }

    setApplication(){        
        switch(this.state.params){
            case "student":
                return <div className="application-container">
                    <h2 className="lrgTitle ctr" data-text="Student Application">Student Application</h2>
                    <div className="section-container">
                        <p className="app-info">Student Application Coming Soon, for immediate information please email us at <a href="mailto:info@lenkesongcu.org">info@lenkesongcu.org</a></p>
                    </div>
                </div>;
                break;
            case "faculty":
                return <div className="application-container">
                        <h2 className="lrgTitle ctr" data-text="Faculty Application">Faculty Application</h2>
                        <div className="section-container">
                            <p className="app-info">Faculty Application Coming Soon, for immediate information please email us at <a href="mailto:info@lenkesongcu.org">info@lenkesongcu.org</a></p>
                        </div>
                    </div>;
                break;
            default:
                return <div className="application-container">
                        <h2 className="lrgTitle ctr" data-text="Online Applications">Online Applications</h2>
                        <div className="section-container">
                            <p className="app-info">We are happy your are interested in joining the LGCU community please select and application to continue.</p>
                            <div className="btn-container">
                                <a href="/apply?type=student" className="lBtn clear t1"><span>Student Application</span><i className="btn-icon fas fa-graduation-cap"></i></a>
                                <div className="btn-split-txt">Or</div>
                                <a href="/apply?type=faculty" className="lBtn clear t1"><span>Faculty Application</span><i className="btn-icon fas fa-chalkboard-teacher"></i></a>
                            </div>
                            <div className="img-container"><img src={appImg} /></div>
                        </div>
                    </div> ;
                break;
        }
    }
}

export { Apply, ApplyHeader};
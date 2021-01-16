import React, { Component } from 'react';
import queryString from 'query-string';
import ReactGA from 'react-ga';

/* Data */
import academicData from '../data/academics.json';

/* Images */
import back1 from '../../assets/site/mini/img13.jpg';
import appImg from '../../assets/site/mini/img14.jpg';

/* Components */
import FormCpt from './components/formCpt';
import StudentApp from './components/studentApp';
import CardPayment from './components/cardPaymentModal';

/* Header */
class ApplyHeader extends Component{
    
    render(){        
        return(
            <div className="headerCard applyHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="Apply img" src={back1} /></div>
                    <h1>Apply Online</h1>                    
                    <div className="solid-back">
                        <span>Complete an online application to become a part of the Lenkeson Global Christian University community.</span>
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
            params:"",
            facultyApplication:{
                "title":"faculty application", "sendAddress":"web.lgcu@gmail.com",//"admin@lenkesongcu.org",
                "subject":"Faculty Application", "additionalData":{}, "type":"section",
                "sendMessage":"Thank you we have received your application we will be review your application and be in contact with you.",
                "elements":[
                    {"title":"Applicant Information", "elements":[
                        {"type":"input","sz":3, "required":true, "name":"firstName", "placeholder":"First Name", "value":"", "valueList":[]},
                        {"type":"input","sz":3, "required":false, "name":"middleName", "placeholder":"Middle Name", "value":"", "valueList":[]},
                        {"type":"input","sz":4, "required":true, "name":"lastName", "placeholder":"Last Name", "value":"", "valueList":[]},
                        {"type":"input","sz":10, "required":true, "name":"email", "placeholder":"Email", "value":"", "valueList":[]},
                        {"type":"input","sz":10, "required":true, "name":"address", "placeholder":"Home Address", "value":"", "valueList":[]},
                        {"type":"input","sz":5, "required":true, "name":"city", "placeholder":"City", "value":"", "valueList":[]},
                        {"type":"input","sz":2, "required":true, "name":"state", "placeholder":"State", "value":"", "valueList":[]},
                        {"type":"input","sz":3, "required":true, "name":"postal", "placeholder":"Postal Code", "value":"", "valueList":[]},
                        {"type":"input","sz":3, "required":false, "name":"dayphone", "placeholder":"Daytime Phone", "value":"", "valueList":[]},
                        {"type":"input","sz":3, "required":false, "name":"eveningphone", "placeholder":"Evening Phone", "value":"", "valueList":[]},
                        {"type":"input","sz":4, "required":true, "name":"mobilephone", "placeholder":"Mobile Phone", "value":"", "valueList":[]},
                        
                        {"type":"input","sz":5, "required":true, "name":"ssn", "placeholder":"Social Security Number", "value":"", "valueList":[]},
                        {"type":"input","sz":5, "required":true, "name":"driverlicense", "placeholder":"Drivers License", "value":"", "valueList":[]},                       
                    ]},
                    {"title":"Emergency Contact Information", "elements":[
                        {"type":"input","sz":5, "required":true, "name":"emergencyname", "placeholder":"Name", "value":"", "valueList":[]},
                        {"type":"input","sz":3, "required":false, "name":"emergencyrelationship", "placeholder":"Relationship", "value":"", "valueList":[]},
                        {"type":"input","sz":2, "required":true, "name":"emergencyphone", "placeholder":"Phone Number", "value":"", "valueList":[]},
                        {"type":"input","sz":10, "required":false, "name":"emergencyaddress", "placeholder":"Address", "value":"", "valueList":[]},
                        {"type":"input","sz":5, "required":false, "name":"emergencycity", "placeholder":"City", "value":"", "valueList":[]},
                        {"type":"input","sz":2, "required":false, "name":"emergencystate", "placeholder":"State", "value":"", "valueList":[]},
                        {"type":"input","sz":3, "required":false, "name":"emergencypostal", "placeholder":"Postal Code", "value":"", "valueList":[]}
                    ]},
                    {"title":"Position", "elements":[
                        {"type":"input","sz":10, "required":true, "name":"position", "placeholder":"Faculty Position Applied For", "value":"", "valueList":[]},
                        {"type":"checkbox","sz":3, "required":false, "name":"veteran", "placeholder":"Are You A US Veteran", "value":"", "valueList":[]},
                        {"type":"input","sz":7, "required":false, "name":"veteranbranch", "placeholder":"Branch", "value":"", "valueList":[]},
                        {"type":"textarea","sz":10, "required":false, "name":"veteranskill", "placeholder":"Specific Skills Acquired", "value":"", "valueList":[]}
                    ]},
                    {"title":"Educational Experience", "elements":[
                        {"type":"input","sz":10, "required":true, "name":"highestdegree", "placeholder":"Highest Degree Earned", "value":"", "valueList":[]},                        
                        {"type":"textarea","sz":10, "required":false, "name":"otherdegrees", "placeholder":"Other Degrees Earned", "value":"", "valueList":[]}
                    ]},
                    {"title":"Employment History", "directions":"List employment history for the past 5 years without any gap. Include the following information for each: ", "directionList":["Employer Name","Employer Address","Total Years Of Employment","Name of Supervisor","Employer Phone Number","Why did you leave?"], "elements":[
                        {"type":"textarea","sz":10, "required":true, "name":"employmenthistory", "placeholder":"Employment History", "value":"", "valueList":[]}
                    ]}
                ]
            },
            modalStatus: false,
            appId:"",
            cbFunc: function(){ }
        }

        this.getAppType = this.getAppType.bind(this);
        this.setApplication = this.setApplication.bind(this);
        this.loadMajorData = this.loadMajorData.bind(this);
        this.appFeeForm = this.appFeeForm.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.initialReactGA = this.initialReactGA.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.getAppType();
        this.initialReactGA();
    }

    initialReactGA(){
        ReactGA.initialize('UA-147138083-1');
        ReactGA.pageview('/apply');
    }

    render(){        
        return(
            <div className="inner-page-body applyPage">
                <section className="apply-section" id="appbody">
                    {this.setApplication()}
                </section>

                <CardPayment title="Student Application Fee" show={this.state.modalStatus} handleClose={this.modalHide} appId={this.state.appId} cbFunc={this.state.cbFunc}/>
            </div>
        );
    }

    modalShow(){
        this.setState({ modalStatus: true });
    }

    modalHide(){
        this.setState({ modalStatus: false });
    }

    getAppType(){
        var appType = "";
        try {
            var values = queryString.parse(this.props.location.search);
            appType = ("type" in values ? values.type : "");

            if(appType === "student"){
                // Load Degree info
                this.loadMajorData();
            }
        }
        catch(ex){
            console.log("Error getting App type: ",ex);
        }

        this.setState({params: appType });
    }

    loadMajorData(){
        try {
            // academicData
            var areaInit = Object.keys(academicData);
            var degreeKey = {};

            areaInit.forEach(function(area){
                var tmpDegreeList = Object.keys(academicData[area].degrees);
                tmpDegreeList.forEach(function(degree){
                    var tmpList = academicData[area].degrees[degree].map(a => a.title +(a.degreeTitle ? " "+a.degreeTitle :""));
                    if(degree in degreeKey){
                        degreeKey[degree] = degreeKey[degree].concat(tmpList);
                    }
                    else {
                        degreeKey[degree] = tmpList;
                    }
                });
            });                     
        }
        catch(ex){
            console.log("Error getting Major data: ",ex);
        }
    }

    appFeeForm(appId, callback){
        //var self = this;
        try {
            this.setState({ appId: appId, cbFunc: callback}, () =>{
                //self.modalShow();
            });
        }
        catch(ex){
            console.log("Error opening app fee form: ",ex);
        }
    }

    setApplication(){        
        switch(this.state.params){
            case "student":
                return <div className="application-container">
                        <h2 className="lrgTitle ctr" data-text="Student Application">Student Application</h2>
                        <div className="section-container">
                            <StudentApp appFeeForm={this.appFeeForm} modalHide={this.modalHide}/>
                        </div>
                </div>;
            case "faculty":
                return <div className="application-container">
                        <h2 className="lrgTitle ctr" data-text="Faculty Application">Faculty Application</h2>
                        <div className="section-container">                            
                            <FormCpt form={this.state.facultyApplication} />
                            <p className="form-info">Please submit via email at admin@lenkesongcu.org copies of unofficial transcripts, Curriculum Vitae or resume. If hired, official transcripts will be required. Official State issued government identifications and background check will be required if employment is offered. All required documents must be submitted to Human Resources before beginning employment. Employment offer will be made only based on student enrollment.</p>
                            
                            <h3 className="lrgTitle ctr" data-text="CERTIFICATION OF APPLICATION">CERTIFICATION OF APPLICATION</h3>
                            <p className="form-info">I certify that all information provided on this application is accurate. I understand that if I provide false information to Lenkeson Global Christian University, no employment will be offered. This is also cause for termination.</p>
                            <p className="form-info">I authorize Lenkeson Global Christian University to contact educational institutions that I attended and former/current employers to release information regarding enrollment, graduation and job performance. Furthermore, I authorize Lenkeson Global Christian University to contact references listed on the job application to release information about me.</p>

                            <h3 className="lrgTitle ctr" data-text="NON-DISCRIMINATION POLICY">NON-DISCRIMINATION POLICY</h3>
                            <p className="form-info">Lenkeson Global Christian University is a Christ-centered institution of higher learning and is committed to provide cutting-edge academic education to men and women without discriminating against any individual on the basis of gender, race, color, religion, national origin, and intellectually and physically challenged individuals. However, the university reserves the right to refuse admission to persons or hire faculty or staff who do not support its values. LGCU is an equal opportunity employer.</p>                                                        
                        </div>
                    </div>;
            default:
                return <div className="application-container">
                        <h2 className="lrgTitle ctr" data-text="Online Applications">Online Applications</h2>
                        <div className="section-container">
                            <p className="app-info">We are happy you are interested in joining the LGCU community. Please select an application to continue.</p>
                            <div className="btn-container">
                                <a href="/apply?type=student" className="lBtn clear t1"><span>Student Application</span><i className="btn-icon fas fa-graduation-cap"></i></a>
                                <div className="btn-split-txt">Or</div>
                                <a href="/apply?type=faculty" className="lBtn clear t1"><span>Faculty Application</span><i className="btn-icon fas fa-chalkboard-teacher"></i></a>
                            </div>
                            <div className="appFeeSub" onClick={this.modalShow}>Application Fee Submissions</div>
                            <div className="img-container"><img src={appImg} alt="application fee" /></div>
                        </div>
                    </div> ;
        }
    }
}

export { Apply, ApplyHeader};
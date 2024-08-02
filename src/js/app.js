import React, { Component } from 'react';
import { Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import { createBrowserHistory } from 'history';
import $ from 'jquery';

import StoryblokService from './utils/storyblok.service';
import marked from 'marked'

/* Components */
import Layout from './templates/layout';

import { Home, HomeHeader } from './templates/home';
/*import { UC, UCHeader } from './templates/uc';*/
import { Academics, AcademicsHeader } from './templates/academics';
import { StudyArea, StudyAreaHeader } from './templates/studyArea';
import { Admissions, AdmissionsHeader } from './templates/admissions';
import { Faculty, FacultyHeader } from './templates/faculty';
import { Tuition, TuitionHeader } from './templates/tuition';
import { About, AboutHeader } from './templates/about';
import { Contact, ContactHeader } from './templates/contactus';
import { Apply, ApplyHeader } from './templates/apply';
import { myLGCU, myLGCUHeader} from './templates/myLgcu';
import { Cosmetology, CosmetologyHeader } from './templates/cosmetology';
import { PaymentPortal, PaymentStatusPortal } from './templates/paymentPortal';


import TranslateVideo from './templates/components/translateVideoModal';

/* Styles */
import "../css/app.less";

const stb = new StoryblokService();
const history = createBrowserHistory(); 

const routes = [
    {path:"/about", component:About, headerComponent:AboutHeader},
    {path:"/academics", component:Academics, headerComponent:AcademicsHeader},
    {path:"/studyarea/:studyArea?", component:StudyArea, headerComponent:StudyAreaHeader},
    {path:"/admissions", component:Admissions, headerComponent:AdmissionsHeader},
    {path:"/faculty", component:Faculty, headerComponent:FacultyHeader},
    {path:"/tuition", component:Tuition, headerComponent:TuitionHeader},
    {path:"/contactus", component:Contact, headerComponent:ContactHeader},
    {path:"/cosmetology", component:Cosmetology, headerComponent:CosmetologyHeader},
    {path:"/apply", component:Apply, headerComponent:ApplyHeader},
    {path:"/mylgcu", component:myLGCU, headerComponent:myLGCUHeader},
];

const plainRoutes = [
    {path:"/payment-portal", component: PaymentPortal },
    {path: "/payment-status/:status", component: PaymentStatusPortal }
];

// API Route
//var rootPath = "";
var rootPath = (window.location.href.indexOf("localhost") > -1 ? "http://localhost:2323" : "");

const PlainRoutes = route => (
    <Route path={route.path} render={props => ( <route.component {...props} />)} />
);

const SiteRoutes = route => (
    <Route path={route.path} render={props => ( 
        <Layout 
            bodyElm={route.component} headerElm={route.headerComponent} 
            hoursofoperation={route.layoutData.hoursofoperation}
            address={route.layoutData.address}
            mainLine={route.layoutData.mainLine}
            email={route.layoutData.email}
            copyrightDate={route.layoutData.copyrightDate}
            routeProps={props}
        />
    )} />
);

const HomeRoute = (layoutData) => (
    <Route exact path="/" render={props => ( 
        <Layout 
            bodyElm={Home} headerElm={HomeHeader}
            hoursofoperation={layoutData.hoursofoperation}
            address={layoutData.address}
            mainLine={layoutData.mainLine}
            email={layoutData.email}
            copyrightDate={layoutData.copyrightDate}
            routeProps={props}
        />
    )} />
);

function MobileNav(props){       
    return (
        <div className={"sidenav-container" + (props.sidebarOpen ? " active": "")}>
            <div className="nav-close" onClick={() => props.setSidebarDisplay(false)}><i className="fas fa-times"></i></div>
            <div className="sidenav-section">
                <div className="search-bar">
                    <div className="gcse-search"/>
                </div>
            </div>
            <div className="sidenav-section">
                <Link className="sidenav-link" to="/about" onClick={() => props.setSidebarDisplay(false)}>About</Link>
                <Link className="sidenav-link" to="/academics" onClick={() => props.setSidebarDisplay(false)}>Academics</Link>
                <Link className="sidenav-link" to="/admissions" onClick={() => props.setSidebarDisplay(false)}>Admissions</Link>
                <Link className="sidenav-link" to="/faculty" onClick={() => props.setSidebarDisplay(false)}>Faculty & Staff</Link>
                <Link className="sidenav-link" to="/tuition" onClick={() => props.setSidebarDisplay(false)}>Tuition</Link>
            </div>
            <div className="sidenav-section">
                <Link className="sidenav-header-link" to="/contactus" onClick={() => props.setSidebarDisplay(false)}>Contact Us</Link>
                <a href="https://www.givelify.com/givenow/1.0/?token=eyJvcmdfaWQiOiJNelUyT1RFfiIsImJhZGdlX2ltYWdlIjoiYjMucG5nIn0~" target="_blank" rel="noopener noreferrer" className="sidenav-header-link" onClick={() => props.setSidebarDisplay(false)}>Donate</a>
                <Link className="sidenav-header-link" to="/apply" onClick={() => props.setSidebarDisplay(false)}>Apply Now</Link>
            </div>

            <div className='sidenav-section phone-footer'>
                <span className="sidenav-no-link"><i className="fab fa-whatsapp" /> +1 407.493.9827</span>
            </div>
        </div>
    );
}

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            navChange: false,
            sidebarOpen: false,
            modalStatus: false,
            copyrightDate: "2019",
            mlAccess:false,
            hoursofoperation:[],
            contact:[],
            address:[]            
        };

        this.getLayout = this.getLayout.bind(this);
        this.getLayoutData = this.getLayoutData.bind(this);
        this.setSidebarDisplay = this.setSidebarDisplay.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.setMLAccess = this.setMLAccess.bind(this);
        this.getCopyrightDate = this.getCopyrightDate.bind(this);
        this.lgcuCheck = this.lgcuCheck.bind(this);
    }
    
    setMLAccess(status){
        this.setState({ mlAccess: status });
    }

    modalShow(){
        this.setState({ modalStatus: true });
    }

    modalHide(){
        this.setState({ modalStatus: false });
    }

    setSidebarDisplay(status) {
        this.setState({ sidebarOpen: status }, () =>{
            document.body.classList.toggle('noscroll', status);
        });
    }

    getLayout(){
        var self = this;
        try {
            stb.getInitialProps({"query":"layout"}, 'cdn/stories/layout', function(page){
                if(page){
                    var layoutbody = page.data.story.content;
                    
                    /* Alerts */
                    if(layoutbody.alerts && layoutbody.alerts.length > 0){
                        var rawMarkup = "";
                        var alertList = layoutbody.alerts.filter(function(item) { return item.component.toLowerCase() === "alert"; });
                        
                        alertList.forEach(function(item){  
                            rawMarkup = (item.text ? marked(item.text) : "");
                            $("#notifications").append("<div class=\"alert alert-"+item.type+" alert-dismissible fade show\" role=\"alert\"><div class=\"alert-title\">"+item.title +"</div><div class=\"alert-text\">"+rawMarkup+"</div><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div>")
                        });
                    } 
                    
                    /* Footer */
                    var tmpAddress = (layoutbody.address ? layoutbody.address.filter(function(item) { return item.component.toLowerCase() === "footerline"; }) : []);
                    var tmpContact = (layoutbody.contact ? layoutbody.contact.filter(function(item) { return item.component.toLowerCase() === "footerline"; }) : []);
                    var tmpHoursofoperation = (layoutbody.hoursofoperation ? layoutbody.hoursofoperation.filter(function(item) { return item.component.toLowerCase() === "footerline"; }) : []);

                    self.setState({ 
                        address: tmpAddress, contact: tmpContact, hoursofoperation: tmpHoursofoperation, 
                        mainLine: layoutbody.mainline, email: layoutbody.email
                    });                
                }
            });
        }
        catch(ex){
            console.log("Error Getting Alerts: ",ex);
        }
    }

    getLayoutData(){
        return {
            hoursofoperation: this.state.hoursofoperation, 
            email: this.state.email,
            contact: this.state.contact, 
            address: this.state.address, 
            mainLine: this.state.mainLine,
            copyrightDate: this.state.copyrightDate
        }
    }

    getCopyrightDate(){
        var self = this;
        try {
            axios.get(rootPath + "/api/getCopyrightDate", {'Content-Type': 'application/json'})
            .then(function(response) {
                if(!response.data.errorMessage){
                   self.setState({ copyrightDate: response.data.results });
                }
            });   
        }
        catch(ex){
            console.log("Error Retrieving Copyright Date: ",ex);
        }
    }

    lgcuCheck(){
        var self = this;
        try {
            axios.get(rootPath + "/api/lgcuCheck", {'Content-Type': 'application/json'})
            .then(function(response) {
                if(response.data.errorMessage || !response.data.results){ console.log("[Error] Checking LGCU")}
            });   
        }
        catch(ex){
            console.log(`Error With LGCU Check: ${ex}`);
        }
    }

    componentDidMount(){
        var self = this;
        stb.initEditor(this);

        this.getLayout();
        this.getCopyrightDate(); this.lgcuCheck();
        self.unlisten = history.listen(location => { 
            if(self.sidebarOpen) { self.setSidebarDisplay(false); }
        });                     
    }

    componentWillUnmount() { this.unlisten(); }    

    render(){    
        return(            
            <Router history={history}>
                <div className="nav-body">
                    <MobileNav setSidebarDisplay={this.setSidebarDisplay} sidebarOpen={this.state.sidebarOpen}/>

                    <HomeRoute {...this.getLayoutData()} />
                    { routes.map((route, i) => <SiteRoutes key={i} {...route} layoutData={this.getLayoutData()} />) }
                    { plainRoutes.map((route, i) => <PlainRoutes key={i} {...route} />) }

                    <div className="translate-btn" title="Translate Our Website" onClick={this.modalShow}><i className="fas fa-language"></i></div>
                    <div className="translateModal"><TranslateVideo show={this.state.modalStatus} handleClose={this.modalHide}/></div>
                </div>  
            </Router>
        )
    }
}

export default App;
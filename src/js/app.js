import React, { Component } from 'react';
import { Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import { createBrowserHistory } from 'history';
import $ from 'jquery';

import StoryblokService from './utils/storyblok.service';
import marked from 'marked'

/* Components */
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

import TranslateVideo from './templates/components/translateVideoModal';

/* Styles */
import "../css/app.less";

/* Images */
import logo from '../assets/LGCULogo2.jpg';

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
    {path:"/mylgcu", component:myLGCU, headerComponent:myLGCUHeader}
];

// API Route
//var rootPath = "";
var rootPath = (window.location.href.indexOf("localhost") > -1 ? "http://localhost:2323" : "");

const HeaderRoutes = route => (
    <Route path={route.path} render={props => ( <route.headerComponent {...props} />)} />
);

const SiteRoutes = route => (
    <Route path={route.path} render={props => ( <route.component {...props} />)} />
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
        this.setSidebarDisplay = this.setSidebarDisplay.bind(this);
        this.listenToScroll = this.listenToScroll.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.setMLAccess = this.setMLAccess.bind(this);
        this.getCopyrightDate = this.getCopyrightDate.bind(this);
        this.lgcuCheck = this.lgcuCheck.bind(this);
    }
    
    setMLAccess(status){
        this.setState({ mlAccess: status });
    }

    render(){    
        return(            
            <Router history={history}>
                <div className="nav-body">
                    <MobileNav setSidebarDisplay={this.setSidebarDisplay} sidebarOpen={this.state.sidebarOpen}/>
                    <div className="app-body">
                        <div className={"app-nav" + (this.state.navChange ? " page-nav" : " full-nav")}>
                            <nav className="navbar navbar-expand-lg nav-top navbar-dark bg-dark">                                
                                <Link className="nav-item mini-nav-link" to="/mylgcu">my<span className="c2">LGCU</span></Link>
                                <span className="nav-item mini-nav-link no-link">Donations</span>
                                <a href="https://www.givelify.com/givenow/1.0/?token=eyJvcmdfaWQiOiJNelUyT1RFfiIsImJhZGdlX2ltYWdlIjoiYjMucG5nIn0~" target="_blank" rel="noopener noreferrer" className="nav-item mini-nav-link donation-link"><span className="givelify-logo">Givelify</span></a>
                                <a href="https://www.paypal.com/mep/dashboard" target="_blank" rel="noopener noreferrer" className="nav-item mini-nav-link donation-link"><i className="fab fa-paypal"/>aypal</a>
                                <span className="nav-item mini-nav-link no-link"><i className="fab fa-whatsapp" /> +1 407.493.9827</span>
                                <Link className="nav-item mini-nav-link" to="/apply">Apply Now</Link>  
                                
                                <div className="nav-item search-bar">
                                    <div className="gcse-search"></div>
                                </div>                              
                            </nav>
                            <nav className="navbar navbar-expand-lg nav-bottom">
                                <Link className="navbar-brand" to="/">
                                    <img alt="logo img" className="headerLogo" src={logo}/>
                                    <div className="textLogo">
                                        <div className="logoLine">Lenkeson Global</div>
                                        <div className="logoLine">Christian University</div>
                                    </div>
                                </Link>

                                <button className="navbar-toggler" type="button" aria-label="Toggle navigation" onClick={() => this.setSidebarDisplay(true)}>
                                    <span className="navbar-toggler-icon"><i className="fas fa-bars"></i></span>
                                </button>
                                <div className="collapse navbar-collapse" id="">
                                    <div className="collapse-container">
                                        <Link className="nav-item nav-link" to="/about">About</Link>
                                        <Link className="nav-item nav-link" to="/academics">Academics</Link>
                                        <Link className="nav-item nav-link" to="/admissions">Admissions</Link>
                                        <Link className="nav-item nav-link" to="/faculty">Faculty & Staff</Link>
                                        <Link className="nav-item nav-link" to="/tuition">Tuition</Link>
                                        <Link className="nav-item nav-link" to="/contactus">Contact Us</Link>
                                    </div>
                                </div>
                            </nav>
                        </div>

                        <div className="app-header-body">
                            <div className={"header-cover" + (this.state.navChange ? " appear" : "")}></div>                        
                            <Route exact path="/" component={HomeHeader} />
                            {routes.map((route, i) => <HeaderRoutes key={i} {...route} />) }
                        </div>

                        <div className="app-inner-body">
                            {/* Inner Header */ }
                            <div className={"inner-nav" + (this.state.navChange ? " hidden-nav" : "")}>                            
                                <nav className="navbar navbar-expand-lg nav-bottom">                               
                                    <div className="collapse navbar-collapse">
                                        <Link className="nav-item nav-link" to="/about">About</Link>
                                        <Link className="nav-item nav-link" to="/academics">Academics</Link>
                                        <Link className="nav-item nav-link" to="/admissions">Admissions</Link>
                                        <Link className="nav-item nav-link" to="/faculty">Faculty & Staff</Link>
                                        <Link className="nav-item nav-link" to="/tuition">Tuition</Link>
                                        <Link className="nav-item nav-link" to="/contactus">Contact Us</Link>
                                    </div>
                                </nav>
                            </div>
                            
                            <div id="notifications"/>
                            {/* Body */}
                            <Route exact path="/" component={Home} />
                            { routes.map((route, i) => <SiteRoutes key={i} {...route} />) }
                        </div>

                        {/* Footer */}
                        <div className="footer">
                            <div className="footer-section">
                                <div className="footer-logo">
                                    <img alt="logo img" className="headerLogo" src={logo}/>
                                    <div className="textLogo">
                                        <div className="logoLine">Lenkeson Global</div>
                                        <div className="logoLine">Christian University</div>
                                    </div>
                                </div>

                                <div className="social-container">
                                    <a href="https://www.youtube.com/channel/UCDaaMIpTKOPEBKVuiRTYDdA" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-youtube"></i></a>
                                    <a href="https://www.facebook.com/lenkesonu1" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-facebook"></i></a>
                                    <a href="https://www.instagram.com/lenkesongcu/" target="_blank" rel="noopener noreferrer" className="social-link"><i className="fab fa-instagram"></i></a>
                                </div>                                                            
                            </div>
                            <div className="footer-section">
                                <div className="footer-info">Hours of Operation:</div>
                                {this.state.hoursofoperation.map((item,i) =>
                                    <div className="footer-info" key={i}>{item.text}</div>
                                )}
                            </div>
                            <div className="footer-section">
                                <div className="footer-link-section">
                                    <Link className="footer-link" to="/admissions">Admissions</Link>
                                    <Link className="footer-link" to="/academics">Academics</Link>
                                    <a href="https://www.givelify.com/givenow/1.0/?token=eyJvcmdfaWQiOiJNelUyT1RFfiIsImJhZGdlX2ltYWdlIjoiYjMucG5nIn0~" target='_blank'  rel="noopener noreferrer" className="footer-link">Donate</a>
                                    <Link className="footer-link" to="/apply">Apply</Link>
                                    <Link className="footer-link" to="/contactus">Contact Us</Link>
                                    <Link className="footer-link" to="/mylgcu">myLGCU</Link>
                                </div>
                            </div>
                            <div className="footer-section full address">
                                <div className="address-section">
                                    <div className="footer-info title">Office:</div>
                                    {this.state.address.map((item,i) =>
                                        <div className="footer-info" key={i}>{item.text}</div>
                                    )}                               
                                </div>
                                <div className="address-section">
                                    <div className="footer-info title">Main Line:</div>
                                    <div className="footer-info">{this.state.mainLine}</div>                                    
                                </div>

                                <div className="address-section">
                                    <div className="footer-info title">Email:</div>
                                    <div className="footer-info">{this.state.email}</div>
                                </div>

                                <div className="address-section">
                                    <Link className="add-link" to="/contactus">
                                        <i className="far fa-address-card"/>
                                        <span>Additional Contacts</span>
                                    </Link>
                                </div>
                            </div>
                
                            <div className="footer-section full policy-foot">
                                <div className="accordian" id="policyAccordion">
                                    <div className="footer-info-container">
                                        <div className="footer-copyright">
                                            <i className="far fa-copyright"/>
                                            <span>{this.state.copyrightDate}. Lenkeson Global Christian University, Inc. All Rights Reserved.</span>
                                        </div>
                                        <div className="policy-btns">
                                            <a className="policy-btn" data-toggle="collapse" href="#policyOne" aria-expanded="false" aria-controls="policyOne">Non-Discrimination Statement</a>
                                            <a className="policy-btn" data-toggle="collapse" href="#policyTwo" aria-expanded="false" aria-controls="policyTwo">Privacy Policy</a>
                                        </div>
                                    </div>
                                    <div className="policy-txt">
                                        <div id="policyOne" className="policy-collapse collapse" data-parent="#policyAccordion">
                                            <p className="policy">Lenkeson Global Christian University is a Christ-centered institution of higher learning and is committed to provide cutting-edge academic education to men and women without discriminating against any individual on the basis of gender, race, color, religion, national origin, and intellectually and physically challenged individuals. However, the university reserves the right to refuse admission to persons or hire faculty or staff who do not support its values. LGCU is an equal opportunity employer.</p>
                                        </div>
                                        <div id="policyTwo" className="policy-collapse collapse" data-parent="#policyAccordion">
                                            <p className="policy bold">How do We Gather Information?</p>
                                            <p className="policy">Lenkeson Global Christian University fully shares the legitimate concerns of our users regarding the submission of personal information via the University website or other means of communication such as other sites, mobile applications, email, phone calls, postal mail and forms submitted from individuals and face to face interaction. We respect the privacy of all individual users. For this reason, we carefully explain the collection and handling of data from our users.</p>
                                            <p className="policy">Keep in mind that some information is provided to us through a number of websites and internet technology services. In addition, we collect information that is submitted to the University on a voluntary basis. Furthermore, we may collect information through third parties including education partners, business organizations and non-affiliated groups and compare it with information we collect. We will not sell, share or loan your information with other third parties. However, information collected may be shared to meet federal regulations.</p>
                                            <p className="policy bold">Why We Gather Information?</p>
                                            <p className="policy">The primary means of gathering information is by completing the University web form. This form gathers basic information from the individual users expressing their interest in our University. Once the form is completed and submitted, it is directed to the department that handles the collection of the data. You may choose not to provide us with information. However, if you are interested in applying for admissions or submitting a job application, you will be required to submit the proper data to process your application. Failure to provide the required information may result of denying your request for either admissions or employment.</p>
                                            <p className="policy bold">Changes in Our Privacy Policy</p>
                                            <p className="policy">Lenkeson Global Christian University reserves the right to make changes to its Privacy Policy without notifying individual users prior to the effective date and time of the changes.</p>
                                            <p className="policy bold">Contact US</p>
                                            <p className="policy">For questions regarding our Privacy Policy, please contact us via email or phone located on our Website.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="translate-btn" title="Translate Our Website" onClick={this.modalShow}><i className="fas fa-language"></i></div>
                    <div className="translateModal"><TranslateVideo show={this.state.modalStatus} handleClose={this.modalHide}/></div>
                </div>  
            </Router>
        )
    }

    modalShow(){
        this.setState({ modalStatus: true });
    }

    modalHide(){
        this.setState({ modalStatus: false });
    }

    listenToScroll() {
        try {
            var innerPage = document.getElementsByClassName("app-inner-body");
            var height = (innerPage && innerPage.length > 0 ? innerPage[0].getBoundingClientRect().top : 0);

            if(height <= 95) { 
                if(!this.state.navChange){               
                    this.setState({navChange: true });
                }
            }
            else {
                if(this.state.navChange){
                    this.setState({navChange: false });
                }
            }
        }
        catch(ex){

        }
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
        window.addEventListener('scroll', this.listenToScroll);
        stb.initEditor(this);

        this.getLayout();
        this.getCopyrightDate(); this.lgcuCheck();
        self.unlisten = history.listen(location => { 
            if(self.sidebarOpen) { self.setSidebarDisplay(false); }
        });                     
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll);
        this.unlisten();
    }    
}

export default App;
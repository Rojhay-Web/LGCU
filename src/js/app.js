import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from 'history';

/* Components */
import { Home, HomeHeader } from './templates/home';
import { UC, UCHeader } from './templates/uc';
import { Academics, AcademicsHeader } from './templates/academics';
import { StudyArea, StudyAreaHeader } from './templates/studyArea';
import { Admissions, AdmissionsHeader } from './templates/admissions';

/* Styles */
import "../css/app.less";

/* Images */
import logo from '../assets/LGCULogo.png';

const history = createBrowserHistory();


const routes = [
    {path:"/about", component:UC, headerComponent:UCHeader},
    {path:"/academics", component:Academics, headerComponent:AcademicsHeader},
    {path:"/studyarea/:studyArea?", component:StudyArea, headerComponent:StudyAreaHeader},
    {path:"/admissions", component:Admissions, headerComponent:AdmissionsHeader},
    {path:"/faculty", component:UC, headerComponent:UCHeader},
    {path:"/tuition", component:UC, headerComponent:UCHeader}
];


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
                <Link className="sidenav-header-link" to="/">Contact Us</Link>
                <Link className="sidenav-header-link" to="/">Donate</Link>
                <Link className="sidenav-header-link" to="/">Apply</Link>
            </div>
            <div className="sidenav-section">
                <Link className="sidenav-link" to="/about">About</Link>
                <Link className="sidenav-link" to="/academics">Academics</Link>
                <Link className="sidenav-link" to="/admissions">Admissions</Link>
                <Link className="sidenav-link" to="/faculty">Faculty & Staff</Link>
                <Link className="sidenav-link" to="/tuition">Tuition</Link>
            </div>
        </div>
    );
}

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            navChange: false,
            sidebarOpen: false
        };

        this.setSidebarDisplay = this.setSidebarDisplay.bind(this);
        this.listenToScroll = this.listenToScroll.bind(this);
    }

    render(){     
        return(            
            <Router>
                <div className="nav-body">
                    <MobileNav setSidebarDisplay={this.setSidebarDisplay} sidebarOpen={this.state.sidebarOpen}/>
                    <div className="app-body">
                        <div className={"app-nav" + (this.state.navChange ? " page-nav" : " full-nav")}>
                            <nav className="navbar navbar-expand-lg nav-top navbar-dark bg-dark">                                
                                <Link className="nav-item mini-nav-link" to="/">my<span className="c2">LGCU</span></Link>
                                <Link className="nav-item mini-nav-link" to="/">Donate</Link>
                                <Link className="nav-item mini-nav-link" to="/">Apply</Link>                                
                            </nav>
                            <nav className="navbar navbar-expand-lg nav-bottom">
                                <Link className="navbar-brand" to="/">
                                    <img className="headerLogo" src={logo}/>
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
                                    </div>
                                </nav>
                            </div>
                            
                            {/* Body */}
                            <Route exact path="/" component={Home} />
                            { routes.map((route, i) => <SiteRoutes key={i} {...route} />) }
                        </div>

                        {/* Footer */}
                        <div className="footer">
                            <div className="footer-section">
                                <div className="footer-logo">
                                    <img className="headerLogo" src={logo}/>
                                    <div className="textLogo">
                                        <div className="logoLine">Lenkeson Global</div>
                                        <div className="logoLine">Christian University</div>
                                    </div>
                                </div>
                                <div className="footer-info">704.953.1609</div>
                                <div className="footer-info">info@lenkesongcu.org</div>
                            </div>
                            <div className="footer-section">
                                <div className="footer-link-section">
                                    <Link className="footer-link" to="/admissions">Admissions</Link>
                                    <Link className="footer-link" to="/academics">Academics</Link>
                                    <Link className="footer-link" to="/">Donate</Link>
                                    <Link className="footer-link" to="/">Apply</Link>
                                    <Link className="footer-link" to="/">Contact Us</Link>
                                    <Link className="footer-link" to="/">myLGCU</Link>
                                </div>
                            </div>

                            <div className="footer-section full">
                                <p className="nonDiscrimination">Lenkeson Global Christian University is a Christ-centered institution of higher learning and is committed to provide cutting-edge academic education to men and women without discriminating against any individual on the basis of gender, race, color, religion, national origin, and intellectually and physically challenged individuals. However, the university reserves the right to refuse admission to persons or hire faculty or staff who do not support its values. LGCU is an equal opportunity employer.</p>
                            </div>
                        </div>
                    </div>
                </div>  
            </Router>
        )
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

    componentDidMount(){
        var self = this;
        window.addEventListener('scroll', this.listenToScroll); 
        self.unlisten = history.listen(location => {            
            console.log("location changed");
            //self.setSidebarDisplay(false);
        });                     
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll);
        this.unlisten();
    }    
}

export default App;
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

/* Components */
import { Home, HomeHeader } from './templates/home';
import { UC, UCHeader } from './templates/uc';

/* Styles */
import "../css/app.less";

/* Images */
import logo from '../assets/LGCULogo.png';

const routes = [
    {path:"/about", component:UC, headerComponent:UCHeader},
    {path:"/academics", component:UC, headerComponent:UCHeader},
    {path:"/admissions", component:UC, headerComponent:UCHeader},
    {path:"/staff", component:UC, headerComponent:UCHeader},
    {path:"/tuition", component:UC, headerComponent:UCHeader}
];

const HeaderRoutes = route => (
    <Route path={route.path} render={props => ( <route.headerComponent {...props} />)} />
);

const SiteRoutes = route => (
    <Route path={route.path} render={props => ( <route.component {...props} />)} />
);

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            navChange: false
        };
        this.listenToScroll = this.listenToScroll.bind(this);
    }

    render(){     
        return(
            <Router>
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

                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                <div className="collapse-container">
                                    <Link className="nav-item nav-link" to="/about">About</Link>
                                    <Link className="nav-item nav-link" to="/academics">Academics</Link>
                                    <Link className="nav-item nav-link" to="/admissions">Admissions</Link>
                                    <Link className="nav-item nav-link" to="/staff">Staff</Link>
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
                                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                    <Link className="nav-item nav-link" to="/about">About</Link>
                                    <Link className="nav-item nav-link" to="/academics">Academics</Link>
                                    <Link className="nav-item nav-link" to="/admissions">Admissions</Link>
                                    <Link className="nav-item nav-link" to="/staff">Staff</Link>
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
                        <div>Footer</div>
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
                    this.setState({navChange: true }, () =>{
                        console.log("In Change");
                    });
                }
            }
            else {
                if(this.state.navChange){
                    this.setState({navChange: false }, () =>{
                        console.log("Out Change");
                    });
                }
            }
        }
        catch(ex){

        }
    }

    componentDidMount(){
        window.addEventListener('scroll', this.listenToScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll)
    }
}

export default App;
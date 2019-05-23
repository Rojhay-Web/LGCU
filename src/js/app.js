import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

/* Components */
import Home from './templates/home';
import HomeHeader from './templates/headers/homeHeader';

import UC from './templates/uc';
import UCHeader from './templates/headers/ucHeader';

/* Styles */
import "../css/app.less";

const routes = [
    {path:"/about", component:UC, headerComponent:UCHeader}
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
        this.state = {};
    }

    render(){     
        return(
            <Router>
                <div className="app-body">
                    <div className="app-header-body">                        
                        <Route exact path="/" component={HomeHeader} />
                        {routes.map((route, i) => <HeaderRoutes key={i} {...route} />) }
                    </div>
                    <div className="app-inner-body">
                        {/* Inner Header */ }
                        <Link className="" to="/">Home</Link>
                        <Link className="" to="/about">About</Link>
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
   componentDidMount(){
       console.log("Change");
   }
}

export default App;
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

/* Components */

/* Styles */
import "../css/app.less";

const routes = [];

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){     
        return(
            <Router>
                <div className="app-body">
                    <div className="app-inner-body">
                        {/* Header*/ }

                        {/* Body */}
                        <h1>Hello</h1>
                    </div>

                    {/* Footer */}
                    <div className="footer">
                        <div>Footer</div>
                    </div>
                </div>
            </Router>
        )
    }
   componentDidMount(){}
}

export default App;
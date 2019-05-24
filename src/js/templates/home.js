import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/back1.jpeg';
import back2 from '../../assets/temp/back2.jpeg';

/* Header */
class HomeHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard homeHeader">
                <div className="header-card-container">
                    <div className="cardImg"><img src={back1}/></div>

                    <div className="frontInfo">
                        <h1>
                            <span>Global Access Through</span> 
                            <span>Affordable Higher Education</span>
                        </h1>
                        <p>"Those from among you shall build the wast places; 
                            You shall raise the foundation of many generations;
                            You shall be called the repairer of the breach and the restorer of paths to dwell in"
                            (Isaiah 58:12)</p>
                    </div>                    
                </div>
            </div>
        );
    }
}

/* Body */
class Home extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        window.scrollTo(0, 0);
    }

    render(){        
        return(
            <div>HOME</div>
        );
    }
}

export {Home, HomeHeader};
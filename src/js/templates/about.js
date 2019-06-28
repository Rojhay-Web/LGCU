import React, { Component } from 'react';

import back1 from '../../assets/temp/back11.jpeg';

/* Header */
class AboutHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard aboutHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img src={back1} /></div>
                    <h1>About LGCU</h1>                    
                    <div className="solid-back">
                        <span>Developing and empowering adult learners through twenty-first century virtual academic</span>
                        <span>Education to successfully transform and lead organizations with integrity in a diverse society.</span>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class About extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div>Under Construction</div>
        );
    }
}

export {About, AboutHeader};
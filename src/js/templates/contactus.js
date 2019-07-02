import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/back12.jpeg';

/* Header */
class ContactHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard contactusHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img src={back1} /></div>
                    <h1>Contact Us</h1>                    
                    <div className="solid-back">
                        <span>Reach out to us to get more information on the great opportunities that we have at LGCU</span>                        
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Contact extends Component{
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

export {Contact, ContactHeader};
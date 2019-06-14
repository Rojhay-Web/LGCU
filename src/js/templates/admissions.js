import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/img7.jpeg';

/* Header */
class AdmissionsHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard admissionsHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img src={back1} /></div>
                    <h1>Admissions</h1>                    
                    <div className="solid-back">
                        <span>Whether you are interested to enroll in our associate, bachelors, masters or doctoral programs,</span>
                        <span>the admission process is explained below regarding the steps that you need to take to be fully admitted at LGCU.</span>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Admissions extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div className="inner-page-body admissionsPage">
                <section className="admissions-section">
                    <h2 className="lrgTitle ctr c1" data-text="Undergraduate Admissions">Undergraduate Admissions</h2>
                    
                </section>
            </div>
        );
    }
}

export {Admissions, AdmissionsHeader};
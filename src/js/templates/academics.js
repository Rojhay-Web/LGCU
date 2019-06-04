import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/img4.jpeg';

/* Header */
class AcademicsHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard academicHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img src={back1} /></div>
                    <h1>Academics</h1>                    
                    <div className="solid-back">
                        <span>Lenkeson Global Christian University is a Christ-centered institution of higher learning &</span>
                        <span>Is committed to provide cutting-edge academic education to men and women.</span>
                    </div>

                    <div className="btn-container">
                        <a href="#" className="lBtn clear t1"><span>View Areas Of Study</span><i className="btn-icon fas fa-arrow-right"></i></a>
                        <a href="#" className="lBtn clear t1"><span>Find Your Degree</span><i className="btn-icon fas fa-search"></i></a>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Academics extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div>Academics</div>
        );
    }
}

export {Academics, AcademicsHeader};
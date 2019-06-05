import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/img4.jpeg';

/* Data */
import academicData from '../data/academics.json';

/* Components */
import FindDegree from './components/findDegree';

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
                        <a href="#findDegree" className="lBtn clear t1"><span>Find Your Degree</span><i className="btn-icon fas fa-search"></i></a>
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
        this.state = {
        }
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
    }

    render(){        
        return(
            <div className="inner-page-body academicsPage">
                <section className="academic-section findDegree" id="findDegree">
                    <h2 className="lrgTitle ctr c1" data-text="Find Your Degree">Find Your Degree</h2>
                    <div className="section-container">
                        <p>Lenkeson Global Christian University is a leading online higher learning institution, established to meet the academic and professional needs of college traditional age and working adults. With an array of majors and degrees find the LGCU program that is for you.</p>
                        <FindDegree academicData={academicData} />
                    </div>
                </section>
            </div>
        );
    }
}

export {Academics, AcademicsHeader};
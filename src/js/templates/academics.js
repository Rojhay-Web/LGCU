import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/img4.jpeg';

/* Data */
import academicData from '../data/academics.json';

/* Components */
import FindDegree from './components/findDegree';
import AcademicSlider from './components/academicSlider';

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
                        <a href="/academics#viewArea" className="lBtn clear t1"><span>View Areas Of Study</span><i className="btn-icon fas fa-arrow-right"></i></a>
                        <a href="/academics#findDegree" className="lBtn clear t1"><span>Find Your Degree</span><i className="btn-icon fas fa-search"></i></a>
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
            academicList:[]
        }
        this.buildDataList = this.buildDataList.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.buildDataList();
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

                <section className="academic-section alternate patterned">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr c1" data-text="Take The Next Step">Take The Next Step</h2>

                        <div className="btn-container">
                            <a href="/contactus" className="lBtn clear t1"><span>Request More Information</span><i className="btn-icon fas fa-info-circle"></i></a>
                            <a href="/apply" className="lBtn c1"><span>Apply</span><i className="btn-icon far fa-edit"></i></a>
                        </div>
                    </div>                    
                </section>

                <section className="academic-section viewArea" id="viewArea">
                    <h2 className="lrgTitle ctr c1" data-text="Schools of Study">Schools of Study</h2>

                    <div className="section-container area-container">
                        {this.state.academicList.map((item,i) => (
                            <AcademicSlider key={i} academicInfo={academicData[item]} direction={(i%2 == 0 ? "right" : "left")} theme={academicData[item].colorTheme}/>
                        ))}                        
                    </div>
                </section>
            </div>
        );
    }

    buildDataList(){
        try {
            this.setState({academicList: Object.keys(academicData)});
        }
        catch(ex){
            console.log("Error building data list: ",ex);
        }
    }
}

export {Academics, AcademicsHeader};
import React, { Component } from 'react';
import ReactGA from "react-ga4";

/* Images */
import back1 from '../../assets/site/mini/img4.jpg';

/* Data */
import academicData from '../data/academics.json';

/* Components */
import FindDegree from './components/findDegree';
import AcademicSlider from './components/academicSlider';

/* Header */
class AcademicsHeader extends Component{

    render(){        
        return(
            <div className="headerCard academicHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="Academic Header img" src={back1} /></div>
                    <h1>Academics</h1>                    
                    <div className="solid-back">
                        <span>Lenkeson Global Christian University is a Christ-centered institution of higher learning &</span>
                        <span>is committed to providing twenty-first century academic education to men and women globally.</span>
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
        this.initialReactGA = this.initialReactGA.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.buildDataList();
        this.initialReactGA();
    }

    initialReactGA(){
        ReactGA.initialize('G-K5C0Q6ZKKD');
        ReactGA.send({ hitType: "pageview", page: "/academics", title: "Academics" });
        //ReactGA.pageview('/academics');
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
                
                <section className="academic-section alternate3">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr cw" data-text="Empowerment Symposium">Leadership Empowerment Symposium</h2>

                        <div className="btn-container">
                            <a href="https://docs.google.com/forms/d/1BKfk167s7aiufkQziqMKD3ILpscMmhfGDJxtSaqK6uM/edit" target="_blank" className="lBtn clear t4"><span>Sign-up</span><i className="btn-icon far fa-edit"></i></a>
                        </div>
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
                    <p className="subTitle ctr c1">All programs at LGCU are geared towards empowering current & emerging Christian leaders both in the church setting as well as Christian Leadership in the marketplace.</p>

                    <div className="section-container area-container">
                        {this.state.academicList.map((item,i) => (
                            <AcademicSlider key={i} academicInfo={academicData[item]} direction={(i%2 === 0 ? "right" : "left")} theme={academicData[item].colorTheme}/>
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
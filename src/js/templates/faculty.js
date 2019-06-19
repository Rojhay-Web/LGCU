import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/back10.jpeg';
import defaultProfile from '../../assets/no-user.jpg';

/* Header */
class FacultyHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard facultyHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img src={back1} /></div>
                    <h1>Faculty & Staff</h1>                    
                    <div className="solid-back">
                        <span>Meet our world class faculty working for Lenkeson Global Christian University</span>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Faculty extends Component{
    constructor(props) {
        super(props);

        this.slide1 = React.createRef();
        this.slide2 = React.createRef();

        this.controlSlider = this.controlSlider.bind(this);
        this.checkScrollLoc = this.checkScrollLoc.bind(this);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div className="inner-page-body facultyPage">
                <section className="faculty-section">
                    <h2 className="lrgTitle ctr" data-text="Administration">Administration</h2>
                    <div className="section-container">
                        <div className="indProfile">
                            <img src={defaultProfile} />
                            <div className="info title">President/CEO</div>
                            <div className="info name">Kenel Stevenson, B.S., M.A., M.Ed., M.S., Ph.D.</div>
                            <div className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                            <div className="info">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                            <div className="info">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</div>
                        </div>
                    </div>
                </section>

                <section className="faculty-section alternate">
                    <div className="info-slider">
                            <div className="info-slider-container" ref={this.slide1}>
                                <div className="slider-card title base">
                                    <h1 className="name">Dr. David Duren</h1>
                                    <div className="title">Dean & Vice-President School of Business Administration, Finance & Staff Recruitment</div>
                                </div>
                                <div className="slider-card img">
                                    <img className="full" src={defaultProfile} />
                                </div>
                                
                                <div className="slider-card title c2">
                                    <h1 className="name">Dr. Leonel Bernal</h1>
                                    <div className="title">Dean & Vice-President School of Theology and Biblical Studies, Institutional Advancement & Student Enrollment</div>
                                </div>
                                <div className="slider-card img c2">
                                    <img className="full" src={defaultProfile} />
                                </div>

                                <div className="slider-card title light">
                                    <h1 className="name">Mrs. Anita Stevenson</h1>
                                    <div className="title">Dean of Academic Affairs, Student Services and Doctoral Residency</div>
                                </div>
                                <div className="slider-card img light">
                                    <img className="full" src={defaultProfile} />
                                </div>
                                
                                <div className="slider-card title base">
                                    <h1 className="name">Mr. Stuart Lawrence</h1>
                                    <div className="title">University Registrar/Director of Admissions and Enrollment</div>
                                </div>
                                <div className="slider-card img">
                                    <img className="full" src={defaultProfile} />
                                </div>
                                <div className="slider-close"/>
                            </div>

                            <div className={"slider-ctrl prev" + (this.checkScrollLoc(this.slide1, "prev") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide1, "prev")}><i className="fas fa-caret-left"></i></div>
                            <div className={"slider-ctrl next" + (this.checkScrollLoc(this.slide1, "next") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide1, "next")}><i className="fas fa-caret-right"></i></div>
                        </div>
                </section>

                <section className="faculty-section">
                    <h2 className="lrgTitle ctr" data-text="Board of Directors">Board of Directors</h2>
                    <div className="section-container">
                        <div className="indProfile">
                            <img src={defaultProfile} />
                            <div className="info title">Executive Board Member</div>
                            <div className="info name">MSGT Stuart J. Lawrence</div>
                            <div className="info">MSgt Stuart J. Lawrence is currently a Political-Military Analyst and Senior Non Commissioned Officer on the Europe Eurasia Regional Center’s 1-A Branch, for Europe, Eurasia regional Center, Intelligence Directorate, DIA HQ, Washington DC.</div>
                            <div className="info">MSgt Sergeant Lawrence emigrated from Jamaica in April of 1996, joined the US Air Force in August and graduated Basic Training with honors in October of that same year.</div>
                            <div className="info">MSgt Lawrence began his career in the air force as an aircraft Electro/Environmental Systems Engineer on the now retired C-141 Starlifter at McGuire Air Force Base (AFB) New Jersey. After 3 years of working on the C-141 he opted for a change in pace and applied to retrain into the Flight Engineer career field. He graduated from Flight Engineer school in April of 2001 with honors and was assigned to Dover AFB, Delaware as a crewmember on one of the world’s largest cargo aircraft, the C-5 Galaxy.</div>
                            <div className="info">In October of 2002 Stuart attended the Air Force’s Airman Leadership School where he graduated with honors. In February and May of 2005, after attending Wesley College and Wilmington University in Dover, DE, MSgt Lawrence was awarded Associate Degrees in Electrical Engineering and Professional Aeronautics respectively from the Community College of the Air Force.</div>
                            <div className="info">During his time as a Flight Engineer at Dover AFB, he was selected to fly several high profile Presidential and Humanitarian missions. Of note, Stuart flew two Presidential missions in direct support of the Middle East Peace process to Egypt and Jordan. Stuart also flew missions in support of NASA and in support of transferring President Reagan’s remains across the country. He also received a Humanitarian Service Medal for missions flown in support of an Indonesian Tsunami, a major Pakistani earthquake and Hurricane Katrina.</div>                            
                        </div>
                    </div>
                </section>

                <section className="faculty-section alternate">
                    <div className="info-slider">
                            <div className="info-slider-container" ref={this.slide2}>
                                <div className="slider-card title base">
                                    <h1 className="name">Mr. Reginald Spears</h1>
                                    <div className="title">Board Member</div>
                                </div>
                                <div className="slider-card img">
                                    <img className="full" src={defaultProfile} />
                                </div>
                                
                                <div className="slider-card title c1">
                                    <h1 className="name">Rev. George Rucker</h1>
                                    <div className="title">Board Member</div>                                    
                                </div>
                                <div className="slider-card img c1">
                                    <img className="full" src={defaultProfile} />
                                </div>

                                <div className="slider-card title light">
                                    <h1 className="name">Attorney Tiffany Wilson, Esq.</h1>
                                    <div className="title">Board Member</div>
                                </div>
                                <div className="slider-card img light">
                                    <img className="full" src={defaultProfile} />
                                </div>                               
                                
                                <div className="slider-close"/>
                            </div>

                            <div className={"slider-ctrl prev" + (this.checkScrollLoc(this.slide2, "prev") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide2, "prev")}><i className="fas fa-caret-left"></i></div>
                            <div className={"slider-ctrl next" + (this.checkScrollLoc(this.slide2, "next") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide2, "next")}><i className="fas fa-caret-right"></i></div>
                        </div>
                </section>
            </div>
        );
    }

    controlSlider(ref, dir){
        try {
            var scrollSz = 450;

            if(dir === "prev"){
                ref.current.scrollLeft = ref.current.scrollLeft - scrollSz;
            }
            else if(dir === "next"){
                ref.current.scrollLeft = ref.current.scrollLeft + scrollSz;
            }
        }
        catch(ex){
            console.log("Error with slider control: ", ex);
        }
    }

    checkScrollLoc(ref, dir){
        var ret = true;
        try {
            
            /*if(dir === "prev"){
                if(ref.current.scrollLeft <= 0) {
                    ret = false;
                }
            }
            else if(dir === "next"){
                if((ref.current.scrollLeft + ref.current.offsetWidth) >= ref.current.scrollWidth) {
                    ret = false;
                }
            }*/
        }
        catch(ex){
            console.log("Error with check scroll: ", ex);
        }
        return ret;
    }
}

export {Faculty, FacultyHeader};
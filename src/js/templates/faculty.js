import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/site/mini/back10.jpg';
import defaultProfile from '../../assets/no-user.jpg';
import sLawrenceImg from '../../assets/SJLawrence.png';
import KStevensonImg from '../../assets/KStevenson.jpg';
import DDurenImg from '../../assets/DDuren.jpg';
import BernalImg from '../../assets/Bernal.jpg';

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
                    <div className="backImg"><img alt="Faculty Header img" src={back1} /></div>
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
                            <img alt="President img" src={KStevensonImg} />
                            <div className="info title">President/CEO</div>
                            <div className="info name">Kenel Stevenson, B.S., M.A., M.Ed., M.S., Ph.D.</div>
                            <div className="info">Dr. Stevenson has served as a World Languages and Linguistics instructor; Department Chair; Adult ESL instructor; ESL coordinator and teacher; Multicultural Education Adjunct Professor at graduate level; School Administrator; Founding President of not-for-profit organizations and post-secondary institutions of higher learning;</div>
                            <div className="info">He earned a Bachelor’s of Science in Church Ministries and Christian Education from Southwestern Assemblies of God University, Waxahachie, Texas; a Masters of Education in Educational Leadership/Administration from Regent University, Virginia Beach, Virginia; a Master’s of Science in Professional Education with an emphasis in Secondary Education from Saint Joseph’s University, Philadelphia, Pennsylvania; a Masters of Arts in Public Policy and Public Administration from Liberty University, Lynchburg, VA; a Certificate of Advanced Graduate Studies (CAGS) in Higher Education Leadership; a Doctor of Philosophy (PhD) in Education with a specialization in Higher Education Leadership/Administration from Capella University, Minneapolis, Minnesota.</div> 
                            <div className="info">Additionally, he earned two diplomas in Clinical Pastoral Education (CPE), and completed postgraduate studies in the following disciplines: English as a Second Language (ESL), French and Theology from LaSalle University, Regent University School of Divinity, University of Pennsylvania Health Systems and West Chester University. Furthermore, he conducted extensive research regarding challenges faced by Latinos to complete secondary and higher education in the United States. He is a polyglot.</div>
                            <div className="info">His doctoral dissertation titled: “Academic, Social and Economic Challenges Faced by Latinos to Attain Postsecondary Education” is published globally via ProQuest.</div>
                        </div>
                    </div>
                </section>

                <section className="faculty-section alternate">
                    <div className="info-slider">
                            <div className="info-slider-container" ref={this.slide1}>
                                <div className="slider-vertical flip">
                                    <div className="slider-card title base bio-card">
                                        <h1 className="name">Dr. David Duren</h1>
                                        <div className="title">
                                            <p>Vice-President of Business, Finance & Staff Recruitment</p>
                                            <p>Dean of the School of Business Administration</p>
                                        </div>

                                        <div className="faculty-bio" id="bioAccordionDuren">
                                            <a className="bio-btn" data-toggle="collapse" href="#bioOne" aria-expanded="false" aria-controls="bioOne">Read Bio</a>
                                            <div id="bioOne" className="bio-txt collapse" data-parent="#bioAccordionDuren">
                                                <p>Dr. Duren's academic preparation includes a BS in Business Administration from S. C. State
                                                University, MBA from Pfeiffer University, Doctorate in Business Administration (DBA)
                                                from the University of Phoenix and completing a Doctoral Certification of Advanced
                                                Graduates Studies in Advanced Accounting at Northcentral University.</p>
                                                <p>With over 35 years, including
                                                hospitality, banking, distribution, manufacturing, professional accounting, nonprofits, and
                                                communications. The positions he has held include Controller, Director of Accounting,
                                                Asst. Controller, and Staff.  My experience includes employment in banks, utility
                                                companies, public accounting, non-profit organizations, manufacturing companies and
                                                other areas of Corporate America.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slider-card img">
                                        <img alt="David Duren img" src={DDurenImg} />
                                    </div>
                                </div>

                                <div className="slider-vertical">
                                    <div className="slider-card title c2">
                                        <h1 className="name">Dr. Leonel Bernal</h1>
                                        <div className="title">
                                            <p>Vice-President School of Theology and Biblical Studies, Institutional Advancement & Student Enrollment, International Recruitment</p>
                                            <p>Dean of the School of Theology and Biblical Studies</p>
                                        </div>
                                        <a href="tel:4074340002" className="phone"><i className="fas fa-phone"></i> <span>407.434.0002</span></a>
                                    </div>
                                    <div className="slider-card img c2">
                                        <img alt="Bernal img" src={BernalImg} />
                                    </div>
                                </div>

                                <div className="slider-vertical flip">
                                    <div className="slider-card title light">
                                        <h1 className="name">Mrs. Anita Stevenson</h1>
                                        <div className="title">Dean of Academic Affairs, Student Services and Doctoral Residency</div>
                                    </div>
                                    <div className="slider-card img light">
                                        <img alt="Default img" src={defaultProfile} />
                                    </div>
                                </div>

                                <div className="slider-vertical">
                                    <div className="slider-card title c3">
                                        <h1 className="name">Mrs. Marisol Rivera Bryant</h1>
                                        <div className="title">Administrative Secretary</div>
                                        <a href="tel:4075642992" className="phone"><i className="fas fa-phone"></i> <span>407.564.2992</span></a>
                                    </div>
                                    <div className="slider-card img c3">
                                        <img alt="Default img" src={defaultProfile} />
                                    </div>
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
                            <img alt="S Lawrence img" src={sLawrenceImg} />
                            <div className="info title">Vice Chair of the Board of Directors</div>
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

                                <div className="slider-card title light">
                                    <h1 className="name">Attorney Tiffany Wilson, Esq.</h1>
                                    <div className="title">Board Member</div>
                                </div>
                                <div className="slider-card img light">
                                    <img alt="default img" src={defaultProfile} />
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
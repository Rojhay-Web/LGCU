import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/site/mini/img7.jpg';

import img1 from '../../assets/site/mini/back8.jpg';
import img2 from '../../assets/site/mini/back5.jpg';
import img3 from '../../assets/site/mini/back0.jpg';

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
                    <div className="backImg"><img alt="Admissions Background img" src={back1} /></div>
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
        this.state = {
            checkScroll:false
        }

        this.UGRef = React.createRef();
        this.GARef = React.createRef();

        this.controlSlider = this.controlSlider.bind(this);
        this.checkScrollLoc = this.checkScrollLoc.bind(this);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div className="inner-page-body admissionsPage">
                <section className="admissions-section">
                    <h2 className="lrgTitle ctr c1" data-text="Undergraduate Admissions">Undergraduate Admissions</h2>
                    
                    <div className="info-slider">
                        <div className="info-slider-container" ref={this.UGRef}>
                            <div className="slider-card title base">
                                <h1>Undergraduate Requirements</h1>
                            </div>
                            <div className="slider-card img">
                                <img alt="Undergraduate img" src={img1} />
                            </div>
                            <div className="slider-card c2">
                                <h2 className="line-split">The following documents are required for prospective students:</h2>
                                <div className="number-list">
                                    <div className="number">1</div>
                                    <div className="info">Online Application</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">2</div>
                                    <div className="info">High School Diploma or GED from a US secondary or recognized foreign institution</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">3</div>
                                    <div className="info">US $50.00 application fee <span>(non-refundable)</span></div>
                                </div>
                                <div className="number-list">
                                    <div className="number">4</div>
                                    <div className="info">Two References <span>(one from a school teacher or administrator and the other from an employer)</span></div>
                                </div>
                                <div className="number-list">
                                    <div className="number">5</div>
                                    <div className="info">A desktop or laptop with internet services</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">6</div>
                                    <div className="info">An initial interview may be required</div>
                                </div>
                            </div>

                            <div className="slider-card light">
                                <h2 className="line-split">Transfer of Credits</h2>
                                <p>For the Associate degrees, a maximum of 30 credit hours from an accredited or candidate institution of higher learning can be transferred in. For the baccalaureate degree, a maximum of 90 credit hours can be transferred into Lenkeson Global Christian University. Transferred adult students must be at least 24 years old.</p>
                            </div>
                            <div className="slider-close"/>
                        </div>

                        <div className={"slider-ctrl prev" + (this.checkScrollLoc(this.UGRef, "prev") ? "" : " noshow")} onClick={()=> this.controlSlider(this.UGRef, "prev")}><i className="fas fa-caret-left"></i></div>
                        <div className={"slider-ctrl next" + (this.checkScrollLoc(this.UGRef, "next") ? "" : " noshow")} onClick={()=> this.controlSlider(this.UGRef, "next")}><i className="fas fa-caret-right"></i></div>
                    </div>
                </section>

                <section className="admissions-section c3">
                    <h2 className="lrgTitle ctr" data-text="Graduate Admissions">Graduate Admissions</h2>
                    
                    <div className="info-slider">
                        <div className="info-slider-container" ref={this.GARef}>
                            <div className="slider-card title base">
                                <h1>Graduate Requirements</h1>
                            </div>
                            <div className="slider-card img">
                                <img alt="Graduate img" src={img2} />
                            </div>
                            <div className="slider-card title c1">
                                <h2>Masters Degree Requirements</h2>
                            </div>
                            <div className="slider-card light">
                                <h2 className="line-split">The following documents are required for prospective students:</h2>
                                <div className="number-list">
                                    <div className="number">1</div>
                                    <div className="info">Online Application</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">2</div>
                                    <div className="info">All official undergraduate transcripts and degree posted from an accredited college or university</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">3</div>
                                    <div className="info">2.5 GPA on a 4.0 scale</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">4</div>
                                    <div className="info">US $50.00 application fee <span>(non-refundable)</span></div>
                                </div>                                
                            </div>

                            <div className="slider-card base">
                                <h2 className="line-split">The following documents are required for prospective students (continued):</h2>
                                <div className="number-list">
                                    <div className="number">5</div>
                                    <div className="info">Goal statement in 300-500 words</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">6</div>
                                    <div className="info">Three References <span>(one from current employer or college instructor)</span></div>
                                </div>
                                <div className="number-list">
                                    <div className="number">7</div>
                                    <div className="info">Up to 12 graduate credit hours from a previous college or university can be transferred in toward the program of interest to Lenkeson Global Christian University </div>
                                </div>
                                <div className="number-list">
                                    <div className="number">8</div>
                                    <div className="info">An initial interview may be required</div>
                                </div>
                            </div>
                            <div className="slider-card img">
                                <img alt="Doctoral img" src={img3} />
                            </div>
                            <div className="slider-card title c2">
                                <h2>Doctoral Program Requirements</h2>
                            </div>

                            <div className="slider-card light">
                                <h2 className="line-split">The following documents are required for prospective students:</h2>
                                <div className="number-list">
                                    <div className="number">1</div>
                                    <div className="info">Online Application</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">2</div>
                                    <div className="info">Master’s degree earned with a 3.0 GPA on a 4.0 scale from an accredited college or university</div>
                                </div>                                
                                <div className="number-list">
                                    <div className="number">3</div>
                                    <div className="info">US $50.00 application fee <span>(non-refundable)</span></div>
                                </div>                       
                                <div className="number-list">
                                    <div className="number">4</div>
                                    <div className="info">Graduate and postgraduate official transcripts from all colleges or universities attended.</div>
                                </div> 
                                <div className="number-list">
                                    <div className="number">5</div>
                                    <div className="info">Goal statement in 700-1000 words regarding professional experience, ability to pursue and complete doctoral studies, and future plan.</div>
                                </div>        
                            </div>

                            <div className="slider-card base">
                                <h2 className="line-split">The following documents are required for prospective students (continued):</h2>
                                <div className="number-list">
                                    <div className="number">6</div>
                                    <div className="info">A copy of current resume or vitae with the following information <span>(Work history; Academic achievement; Community leadership; Teaching experience or previous internship; For the Ph.D. in Global and Strategic Leadership, leadership experience or mid-level managerial experience is required.)</span></div>
                                </div>                                
                                <div className="number-list">
                                    <div className="number">7</div>
                                    <div className="info">Must be currently employed or having access to engage in scholar-practitioner’s activities while completing doctoral program.</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">8</div>
                                    <div className="info">Three reference letters <span>(one from current employer, or college instructor)</span></div>
                                </div>                                
                            </div>
                            <div className="slider-card light">
                                <h2 className="line-split">The following documents are required for prospective students (continued):</h2>
                                <div className="number-list">
                                    <div className="number">9</div>
                                    <div className="info">A laptop computer and internet services are required for research and residencies.</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">10</div>
                                    <div className="info">An initial interview may be required</div>
                                </div>
                                <div className="number-list">
                                    <div className="number">11</div>
                                    <div className="info">Up to 15 credit hours from a master’s degree from an accredited college or university may be transferred into the doctoral program at Lenkeson Global University.</div>
                                </div>
                            </div>

                            <div className="slider-close"/>
                        </div>

                        <div className={"slider-ctrl prev" + (this.checkScrollLoc(this.GARef, "prev") ? "" : " noshow")} onClick={()=> this.controlSlider(this.GARef, "prev")}><i className="fas fa-caret-left"></i></div>
                        <div className={"slider-ctrl next" + (this.checkScrollLoc(this.GARef, "next") ? "" : " noshow")} onClick={()=> this.controlSlider(this.GARef, "next")}><i className="fas fa-caret-right"></i></div>
                    </div>
                </section>

                <section className="admissions-section">
                    <h2 className="lrgTitle ctr c1" data-text="International Students Admissions">International Students Admissions</h2>
                    <div className="section-container international">
                        <p>International students applying to Lenkeson Global Christian University may view it as a new experience. Whether you are interested to enroll in our associate, bachelors, masters or doctoral programs, the admission process is explained below regarding the steps that you need to take to be fully admitted at LGCU.</p>
                        <p>As you are in the process of making a lifetime decision to enroll at LGCU, our International Admissions staff are delighted to assist you throughout the entire process. Please follow the steps outlined below to submit your student application to Lenkeson Global Christian University:</p>

                        <div className="number-list">
                            <div className="number">1</div>
                            <div className="info">Apply Online</div>
                        </div>
                        <p>The first requirement in the admission process is to submit your full student application to Lenkeson Global Christian University. In addition, you will be required to submit several documents required by our Admission Committee to decide on your official admission. You will have the options to apply online or submit the application via email to <a href="mailto:internationaladmissions@lenkesongcu.org">Internationaladmissions@lenkesongcu.org</a></p>

                        <h2>Application Deadline</h2>
                        <p>The International Admissions committee needs ample time to process your application.</p>

                        <p>Therefore, we are requesting that you submit your full application three months prior to your official enrollment date.</p>

                        <p>The following documents are required for admission consideration:</p>
                        <ul>
                            <li>Admissions essay</li>
                            <li>High School & College transcripts<span>(Prospective students who have completed high school or coursework at the college level     outside of the United States are required to have their transcripts evaluated by an organization that is affiliated with the National Association of Credential Services.)</span></li>
                            <li>Proof of English Proficiency is required:</li>
                        </ul>

                        <p>Please submit one of the following test results:</p>
                        <ul>
                            <li>Test of English as a Foreign Language (TOEFL) - Score: 62</li>
                            <li>International Language Testing System (IELTS) - Score: 6.0</li>
                            <li>Pearson Test of English (PTE) - Score: 52</li>
                            <li>International Test of English Proficiency (ITEP) - Score: 3.5</li>
                            <li>Language Consultants International (LCI): Successful Completion of Level 5-6</li>
                        </ul>

                        <p>Submit a photocopy of your passport or a government issued ID. Scan and email document to <a href="mailto:internationaladmissions@lenkesongcu.org">Internationaladmissions@lenkesongcu.org</a></p>

                        <div className="number-list">
                            <div className="number">2</div>
                            <div className="info">Application Fee</div>
                        </div>  
                        <p>Application fee: $50.00 U.S. currency and Confirmation Deposit - $250.00 can be paid online or call:</p> 
                        <div className="address-info">
                            <span>Admissions Office</span> 
                            <span>(877) xxx xxxx</span>
                            <span>Pay by phone, Monday through Friday</span>
                            <span>9 a.m. - 9 p.m. and Saturday 10 a.m. - 6 p.m.</span>
                        </div>

                        <h3>International Transfer Students</h3>
                        <p>Additional documents are required when transferring from another institution of higher learning within the United States.</p>

                        <div className="number-list">
                            <div className="number">3</div>
                            <div className="info">Enroll and register for courses</div>
                        </div>

                        <div className="number-list">
                            <div className="number">4</div>
                            <div className="info">Attend Online Enrollment Orientation</div>
                        </div>
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

export {Admissions, AdmissionsHeader};
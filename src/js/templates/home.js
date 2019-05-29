import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

/* Images */
import back1 from '../../assets/temp/back1.jpeg';
import back2 from '../../assets/temp/back2.jpeg';
import back3 from '../../assets/temp/back3.jpeg';
import back4 from '../../assets/temp/back4.jpeg';

import img1 from '../../assets/temp/img1.jpeg';
import img2 from '../../assets/temp/img2.jpeg';
import img3 from '../../assets/temp/img3.jpeg';
import img4 from '../../assets/temp/img4.jpeg';
import img5 from '../../assets/temp/img5.jpeg';



/* Header */
class HomeHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard homeHeader">
                <div className="header-card-container">
                    <div className="cardImg"><img src={back1}/></div>

                    <div className="frontInfo">
                        <h1>
                            <span>Global Access Through</span> 
                            <span>Affordable Higher Education</span>
                        </h1>
                        <p>"Those from among you shall build the wast places; 
                            You shall raise the foundation of many generations;
                            You shall be called the repairer of the breach and the restorer of paths to dwell in"
                            (Isaiah 58:12)</p>
                        
                        <a href="/" className="lBtn c3"><span>Contact Us</span><i className="btn-icon fas fa-envelope"></i></a>
                    </div>                    
                </div>
            </div>
        );
    }
}

/* Body */
class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:0,
            studyAreas:[                
                {title:"Undergraduate Studies", icon:"fas fa-user-graduate", img:img5, link:"/", description:"The School of Undergraduate Studies is designed to equip traditional college age students, adult learners, and working professionals, individuals who are first time college students, either returning to college, or pursuing studies in their professional fields that they may be effective in their specific location in the labor market or church ministries."},
                {title:"Business Administration", icon:"fas fa-briefcase", img:img2, link:"/", description:"The School of Business Administration is designed to prepare men and women to become innovators, business leaders, and problem-solvers in the twenty-first century. "},
                {title:"Education", icon:"fas fa-university", img:img3, link:"/", description:"The School of Education is designed to develop current and emerging educators and school leaders to meet the educational challenges of the twenty-first century. Learners are equipped with academic and educational tools to deliver state- of- the- art instructional information using diverse teaching and learning methods through constructionist processes."},
                {title:"Global & Strategic Leadership", icon:"fas fa-globe-americas", img:img4, link:"/", description:"The School of Global and Strategic Leadership is designed to equip organizational leaders with the necessary tools to respond to the challenges that require transformational changes and strategic leadership to succeed in the twenty-first century."},
                {title:"Theology & Biblical Studies", icon:"fas fa-bible", img:img1, link:"/", description:"The School of Theology and Biblical Studies is designed to prepare men and women in the disciplines of biblical and theological studies by equipping them with the necessary tools to become transformative servant-leaders in local church ministries, the marketplace, global and strategic missions. "}
            ],
            facts:[
                {value:35, valueSub:"%", text:"Of the college student population is veterans, working parents and perpetual students." },
                {value:1.09, valueSub:"Million", text:"International students are enrolled in United States colleges" },
                {value:33, valueSub:"%", text:"Of all college students are taking at least one course online" }
            ],
            testimonials: [
                {name:"Jane Doe", title:"Student", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},
                {name:"John Smith", title:"Student", text:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
                {name:"Tim Plane", title:"Teacher", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
                {name:"Mark Jackson", title:"Student", text:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
                {name:"Michael Wilson", title:"Alumni", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
            ]
        }

        this.changeStudyArea = this.changeStudyArea.bind(this);
    }

    changeStudyArea(id){
        try {
            if(id >= 0 && id < this.state.studyAreas.length){
                this.setState({ selectedId: id});
            }
        }
        catch(ex){
            console.log("Error changing area: ",ex);
        }
    }

    componentDidMount(){
        window.scrollTo(0, 0);
    }

    render(){        
        return(
            <div className="inner-page-body homePage">
                {/*<section className="home-section">
                    <div className="section-container">
                        <h2 className="lrgTitle" data-text="About LGCU">About LGCU</h2>
                        <p className="section-txt">Lenkeson Global Christian University is a leading online higher learning institution, established to meet the academic and professional needs of college traditional age and working adults, to award associate, baccalaureate, master's, and doctorate degrees.</p>
                    </div>
                </section>*/}
                <section className="home-section">
                    <div className="section-container">
                        <div className="split-section">
                            <div className="multi-img-container">
                                <img className="multi-img lrg" src={img1} />
                                <img className="multi-img sm" src={img2} />
                            </div>

                            <div className="split-content">
                                <h2 className="lrgTitle" data-text="Why LGCU">Why LGCU</h2>
                                <p>At LGCU, learners and faculty are engaged in academic and professional learning that is centered on developing and empowering working professionals to succeed in church ministries and other professional fields.</p>
                                <a href="/" className="lBtn c2"><span>Contact Us</span><i className="btn-icon fas fa-at"></i></a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-section alternate patterned">
                    <div className="section-container">
                        <div className="facts-container">
                            {this.state.facts.map((item,i) => (
                                <div className="factItem" key={i}>
                                    <div className="item-number">
                                        <span className="number">{item.value}</span>
                                        <span className="itemSub">{item.valueSub}</span>
                                    </div>
                                    <div className="item-text">
                                        <p>{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                    
                </section>

                <section className="home-section">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr" data-text="Areas Of Study">Areas Of Study</h2>

                        <div className="studyTabs">
                            <div className="tabPanel">                                
                                {this.state.studyAreas.map((item,i) => (
                                    <div className={"tabItem" + (this.state.selectedId == i ? " selected" : "")} key={i} onClick={() => this.changeStudyArea(i)}>
                                        <i className={"studyicon " + item.icon}></i>
                                        <span>{item.title}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="tabContent">                                
                                <div className="content-info">
                                    <p>{this.state.studyAreas[this.state.selectedId].description}</p>
                                    <div className="lBtn-group">
                                        <a href="/" className="lBtn c2"><span>More Information</span><i className="btn-icon fas fa-ellipsis-h"></i></a>
                                    </div>
                                </div>
                                <div className="img-container"><img src={this.state.studyAreas[this.state.selectedId].img} /></div>
                            </div>
                        </div>
                    </div>
                </section>               
                
                <section className="home-section alternate patterned">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr c2" data-text="Testimonials">Testimonials</h2>

                        <Carousel className="testimonial-carousel" showThumbs={false} showStatus={false} interval={7000} infiniteLoop autoPlay>
                            {this.state.testimonials.map((item,i) =>
                                <div className="testimonial-item" key={i}>
                                    <p>"{item.text}"</p>
                                    <p className="testimonial-title">{item.name}, <span>{item.title}</span></p>
                                </div>
                            )}
                        </Carousel>
                    </div>
                    {/*<div className="back-img"><img src={back4}/></div>*/}
                </section>
            </div>
        );
    }
}

export {Home, HomeHeader};
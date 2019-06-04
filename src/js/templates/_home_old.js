import {useSpring, animated} from 'react-spring'
import {Spring, interpolate} from 'react-spring/renderprops'

import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

/* Components */
import TABS from './components/tabs';

/* Images */
import logo from '../../assets/LGCULogo.png';

import back0 from '../../assets/temp/back0.jpeg';
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
                    <div className="cardImg"><img src={back0}/></div>

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

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.1]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

/* Body */
class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedId:0,
            counter:false,
            studyAreas:[                
                {title:"Undergraduate Studies", icon:"fas fa-user-graduate", img:img5, link:"/", description:"The School of Undergraduate Studies is designed to equip traditional college age students, adult learners, and working professionals, individuals who are first time college students, either returning to college, or pursuing studies in their professional fields that they may be effective in their specific location in the labor market or church ministries."},
                {title:"Business Administration", icon:"fas fa-briefcase", img:img2, link:"/", description:"The School of Business Administration is designed to prepare men and women to become innovators, business leaders, and problem-solvers in the twenty-first century. "},
                {title:"Education", icon:"fas fa-university", img:img3, link:"/", description:"The School of Education is designed to develop current and emerging educators and school leaders to meet the educational challenges of the twenty-first century. Learners are equipped with academic and educational tools to deliver state- of- the- art instructional information using diverse teaching and learning methods through constructionist processes."},
                {title:"Global & Strategic Leadership", icon:"fas fa-globe-americas", img:img4, link:"/", description:"The School of Global and Strategic Leadership is designed to equip organizational leaders with the necessary tools to respond to the challenges that require transformational changes and strategic leadership to succeed in the twenty-first century."},
                {title:"Theology & Biblical Studies", icon:"fas fa-bible", img:img1, link:"/", description:"The School of Theology and Biblical Studies is designed to prepare men and women in the disciplines of biblical and theological studies by equipping them with the necessary tools to become transformative servant-leaders in local church ministries, the marketplace, global and strategic missions. "}
            ],
            facts:[
                {value: 35, decimal:false, valueSub:"%", text:"Of the college student population is veterans, working parents and perpetual students." },
                {value: 1.09, decimal:true, valueSub:"Million", text:"International students are enrolled in United States colleges" },
                {value: 33, decimal:false, valueSub:"%", text:"Of all college students are taking at least one course online" }
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
        this.setCounter = this.setCounter.bind(this);
        this.listenToScroll = this.listenToScroll.bind(this);
    }
    
    setCounter(val){
        this.setState({counter:val});
    }

    listenToScroll() {
        try {
            var y = window.scrollY;
            var counterEl = document.getElementById("counter");

            if(!this.state.counter && y >= (counterEl.offsetTop + (counterEl.clientHeight*.4))){
                this.setCounter(true);
            }           
        }
        catch(ex){
            console.log("Error with Scroll List: ", ex);
        }
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
        window.addEventListener('scroll', this.listenToScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll);
    }

    render(){                
        return(
            <div className="inner-page-body homePage">                
                <section className="home-section">
                    <div className="section-container">
                        <div className="split-section">
                            <div className="multi-img-container">
                                <img className="multi-img lrg" src={back1} />
                                <img className="multi-img sm" src={img1} />
                            </div>

                            <div className="split-content">
                                <h2 className="lrgTitle" data-text="Why LGCU">Why LGCU</h2>
                                <p>At LGCU, learners and faculty are engaged in academic and professional learning that is centered on developing and empowering working professionals to succeed in church ministries and other professional fields.</p>
                                <a href="/" className="lBtn c2"><span>More About LGCU</span><i className="btn-icon fas fa-info-circle"></i></a>
                            </div>                                                    
                        </div>
                    </div>
                </section>

                <section className="home-section alternate patterned" id="counter">
                    <div className="section-container">
                        <div className="facts-container">
                            {this.state.facts.map((item,i) => (
                                <div className="factItem" key={i}>
                                    <div className="item-number">
                                        <Spring from={{ number: 0 }} to={{ number: (this.state.counter ? item.value : 0) }} config={{duration: 2000}}>
                                            {val => <animated.span className="number">{(item.decimal ? val.number.toFixed(2) : Math.floor(val.number))}</animated.span>}
                                        </Spring>
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
                        <TABS list={this.state.studyAreas} />
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
                </section>
            </div>
        );
    }
}

export {Home, HomeHeader};
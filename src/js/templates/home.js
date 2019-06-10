import {useSpring, animated} from 'react-spring'
import {Spring, interpolate} from 'react-spring/renderprops'

import React, { Component, useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

/* Data */
import academicData from '../data/academics.json';

/* Components */
import TABS from './components/tabs';
import AcademicSlider from './components/academicSlider';

/* Images */
import logo from '../../assets/LGCULogo.png';

import back0 from '../../assets/temp/back0.jpeg';
import back1 from '../../assets/temp/back1.jpeg';
import back2 from '../../assets/temp/back2.jpeg';
import back3 from '../../assets/temp/back3.jpeg';
import back4 from '../../assets/temp/back4.jpeg';
import back5 from '../../assets/temp/back5.jpeg';
import back6 from '../../assets/temp/back6.jpeg';
import back7 from '../../assets/temp/back7.jpeg';
import back8 from '../../assets/temp/back8.jpeg';
import back9 from '../../assets/temp/back9.jpeg';

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
                    <div className="cardImg"><img src={back9}/></div>

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
function Home(props){
    
    const [academicList, setAcademicList] = useState([]);
    const [counter, setCounter] = useState(false);
    const [imgprops, setIProps] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))

    const facts = [
                {value: 35, decimal:false, valueSub:"%", text:"Of the college student population is veterans, working parents and perpetual students." },
                {value: 1.09, decimal:true, valueSub:"Million", text:"International students are enrolled in United States colleges" },
                {value: 33, decimal:false, valueSub:"%", text:"Of all college students are taking at least one course online" }
    ];
    const testimonials = [
                {name:"Jane Doe", title:"Student", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},
                {name:"John Smith", title:"Student", text:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
                {name:"Tim Plane", title:"Teacher", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
                {name:"Mark Jackson", title:"Student", text:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
                {name:"Michael Wilson", title:"Alumni", text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
    ];              
    
    function listenToScroll() {
        try {
            var y = window.scrollY;
            var counterEl = document.getElementById("counter");

            if(!counter && y >= (counterEl.offsetTop + (counterEl.clientHeight*.4))){
                setCounter(true);
            }           
        }
        catch(ex){
            console.log("Error with Scroll List: ", ex);
        }
    }
    
    function buildDataList(){
        try {
            var tmpList = Object.keys(academicData);
            var retList = [{"title":"LGCU Schools", "colorTheme":"c2", "description":"Developing and empowering adult learners through twenty-first century virtual academic education to successfully transform and lead organizations with integrity in a diverse society.", "img":"img4.jpeg"}];
            tmpList.forEach(function(item){ retList.push(academicData[item]); });

            setAcademicList(retList);
        }
        catch(ex){
            console.log("Error building data list: ",ex);
        }
    }

    /*useEffect(() => {         
        window.addEventListener('scroll', listenToScroll);
        window.scrollTo(0, 0);
        buildDataList();

        return function cleanup(){ 
            window.removeEventListener('scroll', listenToScroll);
        };
    });*/

    useEffect(() => window.scrollTo(0, 0), []);
    useEffect(() => buildDataList(), []);
    useEffect(() => window.addEventListener('scroll', listenToScroll), []);    
    //function componentWillUnmount() { window.removeEventListener('scroll', listenToScroll); }
    
    function calc(x,y){
        var container = document.getElementById("imgSplit");
        return [-(y - container.offsetHeight / 2) / 20, (x - container.offsetWidth / 2) / 20, 0.9];
    }
    const trans = (x, y, s) => `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

    return(
        <div className="inner-page-body homePage">                
            <section className="home-section">
                <div className="section-container">
                    <div className="split-section" id="imgSplit">
                        <animated.div className="multi-img-container" onMouseMove={({ clientX: x, clientY: y }) => setIProps({ xys: calc(x, y) })} onMouseLeave={() => setIProps({ xys: [0, 0, 1] })} style={{ transform: imgprops.xys.interpolate(trans) }}>
                            <img className="multi-img lrg" src={back7} />
                            <img className="multi-img sm" src={img1} />
                        </animated.div>

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
                        {facts.map((item,i) => (
                            <div className="factItem" key={i}>
                                <div className="item-number">
                                    <Spring from={{ number: 0 }} to={{ number: (counter ? item.value : 0) }} config={{duration: 2000}}>
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
                    {/* Slide Maze */}
                    {academicList.length == 6 && 
                        <div className="slide-maze">
                            <div className="maze-lvl">
                                <div className="lvl-horizontal">
                                    <AcademicSlider academicInfo={academicList[0]} direction={"right"} theme={"solo"}/>
                                    <AcademicSlider academicInfo={academicList[1]} direction={"left"} theme={"solo"}/>
                                </div>
                                <div className="lvl-vertical">
                                    <AcademicSlider academicInfo={academicList[2]} direction={"bottom"} theme={"solo"}/>
                                </div>
                            </div>
                            <div className="maze-lvl">
                                <div className="lvl-vertical">
                                    <AcademicSlider academicInfo={academicList[3]} direction={"bottom"} theme={"solo"}/>
                                </div>
                                <div className="lvl-horizontal">
                                    <AcademicSlider academicInfo={academicList[4]} direction={"left"} theme={"solo"}/>
                                    <AcademicSlider academicInfo={academicList[5]} direction={"right"} theme={"solo"}/>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </section> 

            <section className="home-section alternate patterned">
                <div className="section-container">
                    <h2 className="lrgTitle ctr c2" data-text="Testimonials">Testimonials</h2>

                    <Carousel className="testimonial-carousel" showThumbs={false} showStatus={false} interval={7000} infiniteLoop autoPlay>
                        {testimonials.map((item,i) =>
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

export {Home, HomeHeader};
import {useSpring, animated} from 'react-spring'
import {Spring} from 'react-spring/renderprops'
import ReactGA from 'react-ga';

import React, { Component, useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import SbEditable from 'storyblok-react';
import StoryblokService from '../utils/storyblok.service';

/* Data */
import academicData from '../data/academics.json';

/* Components */
import AcademicSlider from './components/academicSlider';

/* Images */
import introVideo from '../../assets/site/intro_video.mov';
import aboutLgcu from '../../assets/site/about_lgcu.mov';

import img8 from '../../assets/site/mini/img8.jpg';
import img11 from '../../assets/site/mini/img11.jpg';
import asic_logo from '../../assets/site/mini/asic_logo.jpg';

const stb = new StoryblokService();

/* Header */
class HomeHeader extends Component{

    render(){        
        return(
            <div className="headerCard homeHeader">
                <div className="header-card-container">
                    <div className="cardImg">
                        {/*<img alt="Home back img" className="backImg img" src={back9}/>*/}
                        <video className="backImg" alt="Home back video" autoPlay loop muted>
                            <source src={introVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="frontInfo">
                        <h1>
                            <span>Global Access Through Online</span> 
                            <span>Affordable Higher Education</span>
                        </h1>
                        <p><span>"Those from among you shall build the waste places; 
                            You shall raise the foundation of many generations;
                            You shall be called the repairer of the breach and the restorer of paths to dwell in"</span>
                            (Isaiah 58:12)</p>
                        
                        <a href="/contactus" className="lBtn c3"><span>Contact Us</span><i className="btn-icon fas fa-envelope"></i></a>
                        <a href="/files/LGCU_Web_Tutorial.pdf" target="_blank" className="lBtn clear t2"><span>Web Tutorial</span><i className="btn-icon fas fa-question-circle"></i></a>
                    </div>                    
                </div>
            </div>
        );
    }
}

/* Body */
function Home(props){
    
    const [academicList, setAcademicList] = useState([]);
    const [videoList, setVideoList] = useState([]);
    const [testimonials, setTestimonialList] = useState([]);
    const [counter, setCounter] = useState(false);
    const [imgprops, setIProps] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))
    const [imgprops2, setI2Props] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))

    const facts = [
                {value: 35, decimal:false, valueSub:"%", text:"Of the college student population is veterans, working parents and perpetual students." },
                {value: 1.09, decimal:true, valueSub:"Million", text:"International students are enrolled in United States colleges" },
                {value: 33, decimal:false, valueSub:"%", text:"Of all college students are taking at least one course online" }
    ];          
    
    function buildDataList(){
        try {
            var tmpList = Object.keys(academicData);
            var retList = [{"title":"LGCU Schools", "colorTheme":"c2", "description":"Developing and empowering adult learners through twenty-first century virtual academic education to successfully transform and lead organizations with integrity in a diverse society.", "img":"img4.jpg"}];
            tmpList.forEach(function(item){ retList.push(academicData[item]); });

            setAcademicList(retList);
        }
        catch(ex){
            console.log("Error building data list: ",ex);
        }
    }

    function initialReactGA(){
        ReactGA.initialize('UA-147138083-1');
        ReactGA.pageview('/home');
    }

    function loadPageData(){
        
        try {
            stb.initEditor(this);
            stb.getInitialProps({"query":"home"}, 'cdn/stories/home', function(page){
                if(page){
                    var medialist = stb.getContentType("medialist", page);
                    var tmpItemList = (medialist.mediaitems ? medialist.mediaitems.filter(function(item) { return item.component.toLowerCase() === "mediaitem"; }) : []);
                    setVideoList(tmpItemList);

                    var testimonialList = stb.getContentType("testimoniallist", page);
                    var tmptestimonialList = (testimonialList.list ? testimonialList.list.filter(function(item) { return item.component.toLowerCase() === "testimonialitem"; }) : []);
                    setTestimonialList(tmptestimonialList);                  
                }
            });
        }
        catch(ex){
            console.log("Error Loading Page Data: ",ex);
        }
    }

    useEffect(() => window.scrollTo(0, 0), []);
    useEffect(() => loadPageData(), []);
    useEffect(() => buildDataList(), []);
    useEffect(() => initialReactGA(), []);
    
    useEffect(() => window.addEventListener('scroll', function(){
        try {
            var y = window.scrollY;
            var counterEl = document.getElementById("counter");

            if(counterEl && !counter && y >= (counterEl.offsetTop + (counterEl.clientHeight*.4))){
                setCounter(true);
            }           
        }
        catch(ex){
            console.log("Error with Scroll List: ", ex);
        }
    }), [counter]); 

    

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
                        {(imgprops && imgprops.xys &&
                            <animated.div className="multi-img-container" onMouseMove={({ clientX: x, clientY: y }) => setIProps({ xys: calc(x, y) })} onMouseLeave={() => setIProps({ xys: [0, 0, 1] })} style={{ transform: imgprops.xys.interpolate(trans) }}>
                                <img alt="Home info img" className="multi-img lrg" src={img11} />
                                <img alt="Home info img mini" className="multi-img sm" src={img8} />
                            </animated.div>
                        )}

                        <div className="split-content">
                            <h2 className="lrgTitle" data-text="Why LGCU">Why LGCU?</h2>
                            <p>At LGCU, learners and faculty are engaged in academic and professional online learning that is centered on developing and empowering working professionals to succeed in church ministries and other professional fields.</p>
                            <div className="btn-container">
                                <a href="/about" className="lBtn c2"><span>More About LGCU</span><i className="btn-icon fas fa-info-circle"></i></a>
                            </div>
                        </div>                                                    
                    </div>
                </div>
            </section>  

            <section className="home-section">
                <div className="section-container">
                    <div className="split-section" id="imgSplit">
                        <div className="split-content">
                           <h2  className="lrgTitle" data-text="Accreditation">Accreditation</h2>
                            <p className='small'>Lenkeson Global Christian University is accredited by Accreditation Service for International Schools, Colleges and Universities (ASIC). ASIC accreditation helps students and parents make a more informed choice and will also help a school, college, university, training provider or distance education provider, demonstrate to the international student body that they are a high quality institution.</p>
                            <p className='small'>ASIC is recognized by UKVI in UK and is a full member of The International Network for Quality Assurance Agencies in Higher Education (INQAAHE), is a member of the BQF (British Quality Foundation) and are institutional members of EDEN (European Distance and E-Learning Network).</p>
                        </div>

                        <div className="multi-img-container mini-plate">
                            <img alt="Accreditation" className="multi-img lrg" src={asic_logo} />
                        </div>                                                    
                    </div>
                </div>
            </section> 

            <section className="home-section alternate2 patterned">
                <div className="section-container">
                    <h2 className="lrgTitle ctr" data-text="LGCU Media">LGCU Media</h2>
                    
                    <div className="media-container">
                        <div className="media-item">
                            <h3 className="media-title">About Lenkeson Global Christian University</h3>
                            <video className="media-video" alt="About Lenkeson Global Christian University video" controls>
                                <source src={aboutLgcu} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        {videoList.map((item,i) =>
                            <SbEditable content={item} key={i}>
                                <div className="media-item" key={i}>
                                    <h3 className="media-title">{item.title}</h3>
                                    <iframe title={item.title +" video"} className="media-video" src={item.link}></iframe>
                                </div>
                            </SbEditable>
                        )}
                    </div>                    
                </div>                    
            </section>    

            <section className="home-section alternate2 patterned" id="counter">
                <div className="section-container">
                    <h2 className="lrgTitle ctr" data-text="College Stats">College Stats</h2>

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
                    {academicList.length === 8 && 
                        <div className="slide-maze">
                            <div className="maze-lvl">
                                <div className="lvl-horizontal">
                                    <AcademicSlider academicInfo={academicList[0]} direction={"right"} theme={"solo"} displayLink={false}/>
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
                            <div className="maze-lvl">
                                <div className="lvl-horizontal">
                                    <AcademicSlider academicInfo={academicList[6]} direction={"right"} theme={"solo"}/>
                                    <AcademicSlider academicInfo={academicList[7]} direction={"left"} theme={"solo"}/>
                                </div>
                                <div className="lvl-vertical">
                                    {/*<AcademicSlider academicInfo={academicList[0]} direction={"bottom"} theme={"solo"} displayLink={false}/>*/}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </section> 

            <section className="home-section alternate patterned">
                <div className="section-container">
                    <h2 className="lrgTitle ctr" data-text="Testimonials">Testimonials</h2>

                    {(testimonials && testimonials.length > 0) && 
                        <Carousel className="testimonial-carousel" showThumbs={false} showStatus={false} interval={7000} infiniteLoop autoPlay>
                            {testimonials.map((item,i) =>
                                <div className="testimonial-item" key={i}>
                                    <p>"{item.text}"</p>
                                    <p className="testimonial-title">{item.name}, <span>{item.title}</span></p>
                                </div>
                            )}
                        </Carousel>
                    }
                </div>                    
            </section>                    
        </div>
    );
    
}

export {Home, HomeHeader};
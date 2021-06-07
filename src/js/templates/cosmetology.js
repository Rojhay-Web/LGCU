import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/site/mini/back13.jpg';
import img1 from '../../assets/site/mini/beautyFlyer1.jpg';

/* Header */
class CosmetologyHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard admissionsHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="About header img" src={back1} /></div>
                    <h1>Cosmetology</h1>                    
                    <div className="solid-back">
                        <span>We are here to meet all of your Beauty Trades professional needs.</span>
                        <span>We also include professional development classes with Faces of Beauty School of Cosmetology and Workforce Training</span>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Cosmetology extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ window.scrollTo(0, 0); }

    render(){        
        return(
            <div className="inner-page-body cosmetologyPage">
                <section className="cosmetology-section">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr" data-text="Cosmetology Joint Program">Cosmetology Joint Program</h2>
                        <div className="section-container cosmetology">
                            <div className="img"><img alt="About Mission img" src={img1} /></div>
                            
                            <div className="split-content">
                                <p><b>Faces of Beauty School of Cosmetology and Workforce Training</b> is located in West Nassau Bahamas. We are a registered institution providing our students with education in the discipline areas of:</p>
                                <ul>
                                    <li>Cosmetology</li>
                                    <li>Barbering</li>
                                    <li>Nail Technology</li>
                                    <li>Facial Make up</li>
                                    <li>Esthetics</li>
                                    <li>Massage Therapy</li>
                                </ul>

                                <p>We are here to meet all of your Beauty Trades professional needs. We also include professional development classes with each discipline which includes:</p>
                                <ul>
                                    <li>Exceptional Customer Service</li>
                                    <li>Fundamentals of Communication</li>
                                    <li>Personal Leadership</li>
                                    <li>Professional Ethics</li>
                                </ul>
                            </div>
                        </div>

                        <div className="section-container cosmetology-info">
                            <p>Feel free to call or Whatsapp the school @ 242.809.6533 or 242.824.6533</p>
                            <p className="position-title">Dr. H Shyann Williams (CEO/President)</p>
                            <p className="position-title">Dr. Latoya Roberts (Vice President)</p>
                            <p className="position-title">Dr. Harry Alexis (2nd Vice President)</p>
                            <p className="position-title">Dr. Zelrona Mackey (Provost)</p>

                            <h3>Online Classes Available Worldwide!!!</h3>
                        </div>
                    </div>                    
                </section>
            </div>
        );
    }
}

export {Cosmetology, CosmetologyHeader};
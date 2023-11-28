import React, { Component } from 'react';
import ReactGA from "react-ga4";

import SbEditable from 'storyblok-react';
import StoryblokService from '../utils/storyblok.service';

/* Images */
import back1 from '../../assets/site/mini/back12.jpg';
import emailImg from '../../assets/site/mini/email.jpg';

/* Components */
import FormCpt from './components/formCpt';

const stb = new StoryblokService();

/* Header */
class ContactHeader extends Component{
   
    render(){        
        return(
            <div className="headerCard contactusHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="Contact Header img" src={back1} /></div>
                    <h1>Contact Us</h1>                    
                    <div className="solid-back">
                        <span>Reach out to us to get more information on the great opportunities that we have at LGCU.</span>                        
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Contact extends Component{
    constructor(props) {
        super(props);
        this.state = {
            contactCards:[],
            contactForm:{
                "title":"contact us", "sendAddress":"lenkeson8@gmail.com",
                "subject":"Contact Us Form Submission", "additionalData":{}, "type":"core",
                "sendMessage":"Thank you we have received message we will respond as soon as we get the opportunity.",
                "elements":[
                    {"type":"input","sz":7, "required":true, "name":"name", "placeholder":"Name", "value":"", "valueList":[]},
                    {"type":"input","sz":7, "required":true, "name":"email", "placeholder":"Email", "value":"", "valueList":[]},
                    {"type":"textarea","sz":10, "required":true, "name":"message", "placeholder":"Message", "value":"", "valueList":[]}
                ]
            }
        }
        this.initialReactGA = this.initialReactGA.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.initialReactGA();
        this.loadPageData();
    }

    initialReactGA(){
        ReactGA.initialize('G-K5C0Q6ZKKD');
        ReactGA.send({ hitType: "pageview", page: "/contactUs", title: "ContactUs" });
        //ReactGA.pageview('/contactUs');
    }

    loadPageData(){
        var self = this;
        try {
            stb.initEditor(this);
            stb.getInitialProps({"query":"contactus"}, 'cdn/stories/contactus', function(page){
                if(page){
                    var body = page.data.story.content.contactList;
                    
                    if(body) { 
                        var tmpBody = body.filter(function(item){ return item.component.toLowerCase() === "contactcard"; });                       
                        self.setState({ contactCards: tmpBody });
                    }
                }
            });
        }
        catch(ex){
            console.log("Error Loading Page Data: ",ex);
        }
    }

    render(){        
        return(
            <div className="inner-page-body contactus">
                <section className="contactus-section contact-form">
                    <div className="section-container">                        
                        <div className="split-info">
                            {/*<div className="split-img"><img alt="Contact info img" src={emailImg} /></div>*/}
                            <div className="split-contacts">
                                <h2 className="lrgTitle ctr c0" data-text="Get In Touch">Get In Touch</h2>
                                <p>We would love to hear from you with any questions about our university and how it can best serve you.</p>
                                <div className="card-box">
                                    {this.state.contactCards.map((card,i) =>
                                        <div className="card-container" key={i}>
                                            <i className="far fa-address-card" />
                                            <div className="info">
                                                <div className="contact-title">{card.title}</div> 
                                                <div className="contact-info">{card.contactText}</div>
                                                <div className="contact-info sub">{card.subText}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="split-txt">
                                <h2 className="lrgTitle ctr" data-text="Contact Us">Contact Us</h2>
                                <p>Thank you for your interest in LGCU. Complete the form to get in touch with our offices to answer any questions regarding our university.</p>
                                <FormCpt form={this.state.contactForm} />
                            </div>                            
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export {Contact, ContactHeader};
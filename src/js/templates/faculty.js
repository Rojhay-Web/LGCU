import React, { Component } from 'react';
import ReactGA from 'react-ga';

import StoryblokService from '../utils/storyblok.service';
import SbEditable from 'storyblok-react';

import marked from 'marked'

/* Images */
import back1 from '../../assets/site/mini/back10.jpg';
import defaultProfile from '../../assets/no-user.jpg';

const stb = new StoryblokService();

/* Header */
class FacultyHeader extends Component{
   
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
        this.state = {
            pages:[]
        }

        this.controlSlider = this.controlSlider.bind(this);
        this.initialReactGA = this.initialReactGA.bind(this);
        this.checkBio = this.checkBio.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.initialReactGA();
        this.loadPageData();
    }

    initialReactGA(){
        ReactGA.initialize('UA-147138083-1');
        ReactGA.pageview('/faculty');
    }

    render(){        
        return(
            <div className="inner-page-body facultyPage">
                {this.state.pages.map((page,i) =>                    
                    <div key={i}>
                        <section className="faculty-section">
                            <SbEditable content={page}>
                                <h2 className="lrgTitle ctr" data-text={page.SectionTitle}>{page.SectionTitle}</h2>
                                <div className="section-container">
                                    <div className="indProfile">
                                        <img alt="President img" src={page.LeadImage} />
                                        <div className="info title">{page.LeadTitle}</div>
                                        <div className="info name">{page.LeadName}</div>
                                        <div className="info" dangerouslySetInnerHTML={this.body(page.LeadInfo)}/>
                                    </div>
                                </div>
                            </SbEditable>
                        </section>

                        <section className="faculty-section alternate">
                            <div className="info-slider">
                                <div className="info-slider-container" ref={this[page._uid]}>
                                    {page.list.map((card,j)=>
                                        <div className={"slider-vertical" + (j%2 === 0 ? " flip" : "")} key={j}>
                                            <SbEditable content={card}>
                                                <div className={"slider-card title " + card.backgroundcolor + (card.bio !== "" ? " bio-card" : "")} id={"bioCard"+card.cardId}>
                                                    <h1 className="name">{card.name}</h1>
                                                    <div className="title" dangerouslySetInnerHTML={this.body(card.title)}/>
                                                    {card.phone !== "" &&
                                                        <a href={"tel:"+card.phone} className="phone"><i className="fas fa-phone"></i> <span>{card.phone}</span></a>
                                                    }
                                                    {card.bio !== "" && 
                                                        <div className="faculty-bio" id={"bioAccordion"+card.cardId}>
                                                            <a className={"bio-btn " + card.backgroundcolor} data-toggle="collapse" href={"#bio"+card.cardId} aria-expanded="false" aria-controls={"bio"+card.cardId} onClick={() => this.checkBio("bioCard"+card.cardId)}>Read Bio</a>
                                                            <div id={"bio"+card.cardId} className="bio-txt collapse" data-parent={"#bioAccordion"+card.cardId} dangerouslySetInnerHTML={this.body(card.bio)}/>
                                                        </div>
                                                    }
                                                </div>
                                                <div className={"slider-card img "+ card.backgroundcolor}>
                                                    <img alt={card.name} src={(card.img === "" ? defaultProfile : card.img)} />
                                                </div>
                                            </SbEditable>
                                        </div>
                                    )}

                                    <div className="slider-close"/>
                                </div>

                                <div className="slider-ctrl prev" onClick={()=> this.controlSlider(this[page._uid], "prev")}><i className="fas fa-caret-left"></i></div>
                                <div className="slider-ctrl next" onClick={()=> this.controlSlider(this[page._uid], "next")}><i className="fas fa-caret-right"></i></div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        );
    }

    loadPageData(){
        var self = this;
        try {
            stb.initEditor(this);
            stb.getInitialProps({"query":"faculty"}, 'cdn/stories/faculty', function(page){
                if(page){
                    var body = page.data.story.content.body;
                    
                    if(body) { 
                        var index = 0;
                       
                        body.forEach(function(item){
                            if(item.component && item.component.toLowerCase() === "facultysection" ) {
                                self[item._uid] = React.createRef();
                            }

                            item.backgroundcolor = (item.backgroundcolor ? item.backgroundcolor : "");
                            item.SectionTitle = (item.SectionTitle ? item.SectionTitle : "");

                            item.list.forEach(function(sub){                                
                                sub.cardId = index;
                                index++;
                            });
                        });
                       
                        self.setState({ pages: body });
                    }
                }
            });
        }
        catch(ex){
            console.log("Error Loading Page Data: ",ex);
        }
    }

    body(text) {
        var rawMarkup = "";
        try {
            if(text) {
                rawMarkup = marked(text);
            }
        
        }
        catch(ex){
            console.log("Error getting body Text: ",ex);
        }
        return { __html:  rawMarkup};
    }

    checkBio(id){
        var ret = false;
        try {
            var cardElement = document.getElementById(id);

            if(!cardElement.classList.contains("txtOpen")){
                cardElement.classList.add("txtOpen");
            }
            else {
                cardElement.classList.remove("txtOpen");
            }
        }
        catch(ex){
            console.log("Error checking bio: ",ex);
        }

        return ret;
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
}

export {Faculty, FacultyHeader};
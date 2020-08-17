import React, { Component } from 'react';
import ReactGA from 'react-ga';

import SbEditable from 'storyblok-react';
import StoryblokService from '../utils/storyblok.service';
import marked from 'marked';

/* Images */
import back1 from '../../assets/site/mini/img7.jpg';

const stb = new StoryblokService();

/* Header */
class AdmissionsHeader extends Component{
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
            checkScroll:false,
            pages:[]
        }

        this.controlSlider = this.controlSlider.bind(this);
        this.initialReactGA = this.initialReactGA.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
        this.getSection = this.getSection.bind(this);
        this.getSliderCard = this.getSliderCard.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.initialReactGA();
        this.loadPageData();
    }

    initialReactGA(){
        ReactGA.initialize('UA-147138083-1');
        ReactGA.pageview('/admissions');
    }

    loadPageData() {
        var self = this;
        try {
            stb.initEditor(this);
            stb.getInitialProps({"query":"admissions"}, 'cdn/stories/admissions', function(page){
                if(page){
                    var body = page.data.story.content.body;
                    
                    if(body) {
                        body.forEach(function(item){
                            if(item.component && item.component.toLowerCase() === "cardsingle_slider" ) {
                                self[item._uid] = React.createRef();
                            }

                            item.backgroundcolor = (item.backgroundcolor ? item.backgroundcolor : "");
                            item.SectionTitle = (item.SectionTitle ? item.SectionTitle : "");
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

    getSection(item){
        try {
            switch(item.component.toLowerCase()){
                case "cardsingle_slider":
                    return <div className="info-slider">
                        <SbEditable content={item}>
                            <div className="info-slider-container" ref={this[item._uid]}>
                                <div className="slider-card title base">
                                    <h1>{item.CardTitle}</h1>
                                </div>
                                {item.cardlist.map((card,i) => this.getSliderCard(card,i) )}
                                
                                <div className="slider-close"/>
                            </div>
                        </SbEditable>
                        <div className="slider-ctrl prev" onClick={()=> this.controlSlider(this[item._uid], "prev")}><i className="fas fa-caret-left"></i></div>
                        <div className="slider-ctrl next" onClick={()=> this.controlSlider(this[item._uid], "next")}><i className="fas fa-caret-right"></i></div>
                    </div>;
                case "textsection":
                    return <div className="section-container international" dangerouslySetInnerHTML={this.body(item.text)} />
                default:
                    return <div></div>;
            }
        }
        catch(ex){
            console.log("Error Getting, Section Contant: ",ex);
        }
    }

    getSliderCard(card, key){
        try {
            switch(card.component.toLowerCase()){
                case "cardsingle_img":
                    return <div className="slider-card img" key={key}><img alt={"admissions"} src={card.img} /></div>;
                case "cardsingle_numberlist":
                    return <div className={"slider-card " + card.backgroundcolor} key={key}>
                        <h2 className="line-split">{card.title}</h2>
                        {card.list.map((item,i) =>
                            <div className="number-list" key={i}>
                                <div className="number">{item.number}</div>
                                <div className="info">{item.text} <span>{item.subtext}</span></div>
                            </div>
                        )}
                    </div>;
                case "cardsingle_text":
                    return <div className={"slider-card " + card.backgroundcolor} key={key}>
                        <SbEditable content={card}>
                            <h2 className="line-split">{card.title}</h2>
                            <p>{card.text}</p>
                        </SbEditable>
                    </div>;
                case "cardsingle_title":
                    return <div className={"slider-card title " + card.backgroundcolor} key={key}>
                        <h2>{card.title}</h2>
                    </div>;
                default:
                    return <div key={key}></div>;
            }
        }
        catch(ex){
            console.log("Error Getting, Section Contant: ",ex);
        }
    }


    render(){        
        return(
            <div className="inner-page-body admissionsPage">
                {this.state.pages.map((page,i) =>
                    <section className={"admissions-section " + page.backgroundcolor } key={i}>
                        <h2 className="lrgTitle ctr" data-text={page.SectionTitle}>{page.SectionTitle}</h2>

                        {this.getSection(page)}
                    </section>
                )}
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
}

export {Admissions, AdmissionsHeader};
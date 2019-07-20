import React, { Component } from 'react';

class AcademicSlider extends Component{
    constructor(props) {
        super(props);
        this.state = {
            academicInfo: this.props.academicInfo,
            titleLink:""
        }

        this.sliderLink = this.sliderLink.bind(this);
    }

    componentDidMount(){ 
        this.sliderLink(this.props.academicInfo.title);
    }

    render(){        
        return(
            <div className={"academicSlider " + this.props.direction}>
                <div className="slider-container title">
                    <h1>{this.state.academicInfo.title}</h1>
                    <div className="lBtn-group">
                        {this.props.displayLink !== false &&
                            <a href={"/studyarea" + this.state.titleLink} className="lBtn link"><span>Learn More</span><i className="btn-icon fas fa-graduation-cap"/></a>
                        }
                    </div>
                </div>
                <div className="slider-container info">
                    <div className={"img-slider " + this.props.theme}><img alt="slider img" src={'../images/site/'+ this.props.academicInfo.img} /></div>
                    <div className="info-container">
                        <p>{this.state.academicInfo.description}</p>
                    </div>
                </div>
            </div>
        );
    }

    sliderLink(title){
        var ret = "";
        try {
            ret = "/"+title.replace(/([&\/\\()])/g,"_").split(' ').join("").toLowerCase();
        }
        catch(ex){
            console.log("Error Building Link Title: ", ex);
            ret = "";
        }

        this.setState({titleLink: ret });
    }
}

export default AcademicSlider;
import React, { Component } from 'react';

import img5 from '../../../assets/temp/img5.jpeg';

class AcademicSlider extends Component{
    constructor(props) {
        super(props);
        this.state = {
            academicInfo: this.props.academicInfo
        }
    }

    componentDidMount(){ }

    render(){        
        return(
            <div className={"academicSlider " + this.props.direction}>
                <div className="slider-container title">
                    <h1>{this.state.academicInfo.title}</h1>
                    <div className="lBtn-group">
                        <a href="/" className="lBtn link"><span>Learn More</span><i className="btn-icon fas fa-graduation-cap"/></a>
                    </div>
                </div>
                <div className="slider-container info">
                    <div className={"img-slider " + this.props.theme}><img src={'../images/tmp/'+ this.props.academicInfo.img} /></div>
                    <div className="info-container">
                        <p>{this.state.academicInfo.description}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default AcademicSlider;
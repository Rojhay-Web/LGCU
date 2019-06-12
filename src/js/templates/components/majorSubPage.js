import React, { Component } from 'react';

/* Body */
class MajorSub extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ 
        var tst = this.props.majorData;
    }

    render(){        
        return(
            <div className="inner-page-body studyPage">
                <section className="studyArea-section">
                    {this.props.majorData.courses.map((item,i) => (
                        <div className="course-section" key={i}>
                            {item.courses.map((course,j) => (
                                <div key={j}>{course}</div>
                            ))}
                            <p>{item.subtitle}</p>
                        </div>
                    ))}
                </section>
            </div>
        );
    }
}

export default MajorSub;
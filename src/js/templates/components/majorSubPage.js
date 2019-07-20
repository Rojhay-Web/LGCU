import React, { Component } from 'react';

/* Data */
import courseData from '../../data/courses.json';

/* Body */
class MajorSub extends Component{
    constructor(props) {
        super(props);

        this.getCourse = this.getCourse.bind(this);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="inner-page-body studyPage">
                <section className="studyArea-section"></section>

                {(this.props.majorData && this.props.majorData.courses !== undefined) && 
                    <section className="studyArea-section">
                        <h2 className="lrgTitle ctr" data-text="Curriculum">Curriculum</h2>

                        
                        <div className="section-container">
                            {this.props.majorData.courses.length === 0 && 
                                <div className="course-section noCourseData">                                    
                                    <span>To get information or any general questions regarding our {this.props.majorData.title} degree please contact our admissions team at </span>
                                    <a href="mailto:admissions@lenkesongcu.org">admissions@lenkesongcu.org</a>
                                    <span> and request the course curriculum and degree information.</span>                                    
                                </div>
                            }

                            {this.props.majorData.courses.map((item,i) => (
                                <div className="course-section" key={i}>
                                    <p className="course-title">{item.subtitle}</p>
                                    <table className="course-table">
                                        {item.courses.map((course,j) => (
                                            <tr key={j}>
                                                <td>{this.getCourse(course).section}</td>
                                                <td>{this.getCourse(course).id}</td>
                                                <td>{this.getCourse(course).title}</td>
                                                <td>{this.getCourse(course).credit}</td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            ))}

                            {this.props.majorData.concentrations && this.props.majorData.concentrations.map((item,i) => (
                                <div className="course-section" key={i}>
                                    <p className="course-title">{item.title}</p>
                                    <table className="course-table">
                                        {item.courses.map((course,j) => (
                                            <tr key={j}>
                                                <td>{this.getCourse(course).section}</td>
                                                <td>{this.getCourse(course).id}</td>
                                                <td>{this.getCourse(course).title}</td>
                                                <td>{this.getCourse(course).credit}</td>
                                            </tr>
                                        ))}
                                    </table>                           
                                </div>
                            ))}

                            {this.props.majorData.specialization && this.props.majorData.specialization.map((item,i) => (
                                <div className="course-section" key={i}>
                                    <h2 className="lrgTitle ctr sub concentrations-title" data-text={item.title}>{item.title}</h2>
                                    <table className="course-table">
                                        {item.courses.map((course,j) => (
                                            <tr key={j}>
                                                <td>{this.getCourse(course).section}</td>
                                                <td>{this.getCourse(course).id}</td>
                                                <td>{this.getCourse(course).title}</td>
                                                <td>{this.getCourse(course).credit}</td>
                                            </tr>
                                        ))}
                                    </table>                           
                                </div>
                            ))}
                        </div>
                    </section>
                }
            </div>
        );
    }

    getCourse(courseId){
        var ret = {"section": "NA","id": 0, "title": "Unknown Course", "credit": 0};
        try {
            if(courseId in courseData){
                ret = courseData[courseId];
            }
        }
        catch(ex){
            console.log("Error Getting Course Info: ", ex);
        }
        return ret;
    }
}

export default MajorSub;
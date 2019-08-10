import React, { Component } from 'react';

/* Data */
import courseData from '../../data/courses.json';

/* Body */
class MajorSub extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fullTitle:"",
            majorData:{}
        }
        this.getCourse = this.getCourse.bind(this);
        this.loadMajorData = this.loadMajorData.bind(this);
    }

    componentDidMount(){
        this.loadMajorData(this.props.majorData);
        var dL = this.props.majorData.degreeLvl.charAt(0).toUpperCase() + this.props.majorData.degreeLvl.slice(1);
        var mt = this.props.majorData.title.charAt(0).toUpperCase() + this.props.majorData.title.slice(1) + (this.props.majorData.degreeTitle ? " "+this.props.majorData.degreeTitle : "");
        
        this.setState({ fullTitle: dL+ " In " + mt});
    }

    render(){        
        return(
            <div className="inner-page-body studyPage">
                <section className="studyArea-section"></section>

                {(this.state.majorData && this.state.majorData.courses !== undefined) && 
                    <section className="studyArea-section">                       
                        
                        <div className="section-container">
                            <h2 className="lrgTitle ctr fullTitle">{this.state.fullTitle}</h2>
                            <p>Our {this.state.majorData.title} degree is one of the many competitive {this.state.majorData.degreeLvl} degrees that we offer here at Lenkenson Global Christian University.  If you are interested in becoming a student please submit a <a href="/apply?type=student">Student Application</a> or for more information please contact our admissions staff directly via email <a href="mailto:admissions@lenkesongcu.org">admissions@lenkesongcu.org</a></p>

                            <h2 className="lrgTitle ctr" data-text="Curriculum">Curriculum</h2>

                            {this.state.majorData.courses.length === 0 && 
                                <div className="course-section noCourseData">                                    
                                    <span>To get information or any general questions regarding our {this.state.majorData.title} degree please contact our admissions team at </span>
                                    <a href="mailto:admissions@lenkesongcu.org">admissions@lenkesongcu.org</a>
                                    <span> and request the course curriculum and degree information.</span>                                    
                                </div>
                            }

                            {this.state.majorData.courses.map((item,i) => (
                                <div className="course-section" key={i}>
                                    <p className="course-title">{item.subtitle}</p>
                                    <table className="course-table">
                                        {item.courses.map((course,j) => (
                                            <tr key={j}>
                                                <td>{course.section}</td>
                                                <td>{course.id}</td>
                                                <td>{course.title}</td>
                                                <td>{course.credit}</td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            ))}

                            {this.state.majorData.concentrations && this.state.majorData.concentrations.map((item,i) => (
                                <div className="course-section" key={i}>
                                    <p className="course-title">{item.title}</p>
                                    <table className="course-table">
                                        {item.courses.map((course,j) => (
                                            <tr key={j}>
                                                <td>{course.section}</td>
                                                <td>{course.id}</td>
                                                <td>{course.title}</td>
                                                <td>{course.credit}</td>
                                            </tr>
                                        ))}
                                    </table>                           
                                </div>
                            ))}

                            {this.state.majorData.specialization && this.state.majorData.specialization.map((item,i) => (
                                <div className="course-section" key={i}>
                                    <h2 className="lrgTitle ctr sub concentrations-title" data-text={item.title}>{item.title}</h2>
                                    <table className="course-table">
                                        {item.courses.map((course,j) => (
                                            <tr key={j}>
                                                <td>{course.section}</td>
                                                <td>{course.id}</td>
                                                <td>{course.title}</td>
                                                <td>{course.credit}</td>
                                            </tr>
                                        ))}
                                    </table>                           
                                </div>
                            ))}

                            {this.state.majorData.gradtotal &&
                                <div className="course-section gradTotal">
                                    <h2>Total number of required hours for graduation: {this.state.majorData.gradtotal}</h2>
                                </div>
                            }
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

    loadMajorData(major){
        var self = this;
        /* Course Data */
        major.courses.forEach(function(section){
            var tmpCourseList = [];
            section.courses.forEach(function(course){
                var tmpCourse = self.getCourse(course);
                if(tmpCourse.id !== 0){
                    tmpCourseList.push(tmpCourse);
                }
            });
            section.courses = tmpCourseList;
        });

        /* Concentrations */
        if(major.concentrations){
            major.concentrations.forEach(function(section){
                var tmpConcentrations = [];
                section.courses.forEach(function(course){
                    var tmpCourse = self.getCourse(course);
                    if(tmpCourse.id !== 0){
                        tmpConcentrations.push(tmpCourse);
                    }
                });
                section.courses = tmpConcentrations;
            });

            
        }

        /* Specialization */
        if(major.specialization){
            major.specialization.forEach(function(section){
                var tmpSpecialization = [];
                section.courses.forEach(function(course){
                    var tmpCourse = self.getCourse(course);
                    if(tmpCourse.id !== 0){
                        tmpSpecialization.push(tmpCourse);
                    }
                });
                section.courses = tmpSpecialization;
            });
        }

        this.setState({ majorData: major});
    }
}

export default MajorSub;
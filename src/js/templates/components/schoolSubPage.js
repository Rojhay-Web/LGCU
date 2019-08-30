import React, { Component } from 'react';

/* Body */
class SchoolSub extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){ }

    render(){        
        return(
            <div className="inner-page-body studyPage">
                
                <section className="studyArea-section">
                    <h2 className="lrgTitle ctr" data-text="About Our School">About Our School</h2>
                    {(Object.keys(this.props.data.degrees).length > 0) &&
                        <div className="section-container">
                         <p>{this.props.data.fullDescription}</p>
                        </div>
                    }
                </section>
                

                {(Object.keys(this.props.data.degrees).length > 0) &&
                    <section className="studyArea-section alternate patterned">
                        <div className="section-container">
                            <h2 className="lrgTitle ctr c1" data-text="Take The Next Step">Take The Next Step</h2>

                            <div className="btn-container">
                                <a href="/contactus" className="lBtn clear t1"><span>Request More Information</span><i className="btn-icon fas fa-info-circle"></i></a>
                                <a href="/apply" className="lBtn c1"><span>Apply</span><i className="btn-icon far fa-edit"></i></a>
                            </div>
                        </div>                    
                    </section>
                }

                {(Object.keys(this.props.data.degrees).length > 0) &&
                    <section className="studyArea-section">
                        <h2 className="lrgTitle ctr" data-text="Degrees & Majors">Degrees & Majors</h2>
                        <div className="section-container">
                            {this.props.data.degreeList.map((item,i) => (
                                <div className="degreeSection" key={i}>
                                    <h3 className="degreeTitle">{item}</h3>
                                    {this.props.data.degrees[item].map((major,j) => (
                                        <a href={this.props.baseUrl +"?majorId="+major.id} key={j} className="majorLink">
                                            <i className="fas fa-chevron-right" />
                                            <span>{major.title}</span>
                                            {major.degreeTitle && <span className="subText">{major.degreeTitle}</span>}
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section> }
                    {(Object.keys(this.props.data.degrees).length == 0) && 
                        <section className="studyArea-section">
                            <div className="section-container noDegreeData">
                                <span>To obtain information or any general questions regarding our School of {this.props.data.title} please contact our admissions team at </span>
                                <a href="mailto:admissions@lenkesongcu.org">admissions@lenkesongcu.org</a>
                            </div>
                        </section>
                    }
            </div>
        );
    }
}

export default SchoolSub;
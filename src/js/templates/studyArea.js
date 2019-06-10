import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/img4.jpeg';

/* Data */
import academicData from '../data/academics.json';

/* Header */
class StudyAreaHeader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            displayValue: false,
            valid: false,
            data:{}
        }

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
        this.loadData();
    }

    render(){        
        return(
            <div className="headerCard academicHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img src={"../images/tmp/"+this.state.data.img} /></div>
                    <h1>{"The School of " + this.state.data.title}</h1>                    
                    <div className="solid-back">
                        <span>{this.state.data.description}</span>
                    </div>
                </div>                
            </div>
        );
    }

    loadData(){
        try {
            var tmpData = academicData;

            if(this.props.match.params.studyArea && (this.props.match.params.studyArea in academicData)){
                this.setState({ displayValue:true, valid:true, data: academicData[this.props.match.params.studyArea]});
            }
            else {
                this.setState({ displayValue:true, valid:false });
            }
        }
        catch(ex){
            console.log("Error Loading Data: ", ex);
        }
    }
}

/* Body */
class StudyArea extends Component{
    constructor(props) {
        super(props);

        this.state = {
            displayValue: false,
            valid: false,
            data:{degreeList:[]}
        }

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.loadData();
    }

    render(){        
        return(
            <div className="inner-page-body studyPage">
                <section className="studyArea-section">
                    <h2 className="lrgTitle ctr" data-text="About Our School">About Our School</h2>
                    <div className="section-container">
                        <p>{this.state.data.fullDescription}</p>
                    </div>
                </section>

                <section className="studyArea-section alternate patterned">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr c2" data-text="Take The Next Step">Take The Next Step</h2>

                        <div className="btn-container">
                            <a href="/" className="lBtn clear t2"><span>Request More Information</span><i className="btn-icon fas fa-info-circle"></i></a>
                            <a href="/" className="lBtn c2"><span>Apply</span><i className="btn-icon far fa-edit"></i></a>
                        </div>
                    </div>                    
                </section>

                <section className="studyArea-section">
                    <h2 className="lrgTitle ctr" data-text="Degrees & Majors">Degrees & Majors</h2>
                    <div className="section-container">
                        {this.state.data.degreeList.map((item,i) => (
                            <div className="degreeSection" key={i}>
                                <h3 className="degreeTitle">{item}</h3>
                                {this.state.data.degrees[item].map((major,j) => (
                                    <a href="/" key={j} className="majorLink">
                                        <i className="fas fa-chevron-right" />
                                        <span>{major.title}</span>
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    loadData(){
        try {
            if(this.props.match.params.studyArea && (this.props.match.params.studyArea in academicData)){
                var tmpData = academicData[this.props.match.params.studyArea];
                tmpData.degreeList = Object.keys(tmpData.degrees);

                this.setState({ displayValue:true, valid:true, data: tmpData});
            }
            else {
                this.setState({ displayValue:true, valid:false });
            }
        }
        catch(ex){
            console.log("Error Loading Data: ", ex);
        }
    }
}

export {StudyArea, StudyAreaHeader};
import React, { Component } from 'react';

/* Images */
import back1 from '../../assets/temp/img4.jpeg';

/* Data */
import academicData from '../data/academics.json';

/* Components */
import SchoolSub from './components/schoolSubPage';
import MajorSub from './components/majorSubPage';

/* Header */
class StudyAreaHeader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            displayValue: 0,
            data:{},
            majorData:{},
            baseUrl:""
        }

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){
        this.loadData();
    }

    render(){        
        return(
            <div className="headerCard studyHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img src={"../images/tmp/"+this.state.data.img} /></div>
                    
                    <div className="lrg-title">
                        <span>{(this.state.majorData ? this.state.majorData.title : "")}</span>
                        {(this.state.majorData && this.state.majorData.degreeTitle) && <span className="subText">({this.state.majorData.degreeTitle})</span>}
                    </div>  
                    <div className={(this.state.majorData.title ? "sub-title": "lrg-title")}>{"The School of " + this.state.data.title}</div>  

                    <div className="solid-back">
                        <span>{this.state.data.description}</span>
                    </div>

                    <div className="acCrumb">
                        <a href="/academics" className="acCrumb-item acCrumb-link">Academics</a>

                        <span className="acCrumb-item">/</span>
                        {(!this.state.majorData.title ?
                        <span className="acCrumb-item acCrumb-link acCrumb-active">{this.state.data.title}</span>
                        :<a href={this.state.baseUrl} className="acCrumb-item acCrumb-link">{this.state.data.title}</a> )}

                        {this.state.majorData.title &&
                            <div className="acCrumb-item optional-link">
                                <span className="acCrumb-item">/</span>
                                <span className="acCrumb-item acCrumb-active">{this.state.majorData.title}</span>
                            </div>
                        }
                    </div>
                </div>                
            </div>
        );
    }

    loadData(){
        try {            
            if(this.props.match.params.studyArea && (this.props.match.params.studyArea in academicData)){
                let params = new URLSearchParams(this.props.location.search);
                var majorId = params.get("majorId");
                var tmpArea = academicData[this.props.match.params.studyArea];
                var tmpMajor = [];
                var displayNum = 1;

                var areaUrlTitle = tmpArea.title.replace(/([&\/\\()])/g,"_").split(' ').join("").toLowerCase();
                var baseUrl = "/studyarea/"+areaUrlTitle;

                if(majorId != null){
                    var degreeList = Object.keys(tmpArea.degrees);
                    for(var i =0; i < degreeList.length; i++){
                        tmpMajor = tmpArea.degrees[degreeList[i]].filter(function(item){  return item.id == majorId; });
                        if(tmpMajor.length > 0) { 
                            displayNum = 2; tmpMajor = tmpMajor[0]; break;
                        }
                    }
                }

                this.setState({ displayValue:displayNum, data: tmpArea, majorData: tmpMajor, baseUrl:baseUrl});
            }
            else {
                this.setState({ displayValue:1, valid:false });
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
            displayValue: 0,
            valid: false,
            data:{degreeList:[]},
            majorData:{},
            baseUrl:""
        }

        this.loadData = this.loadData.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.loadData();
    }

    render(){        
        return(
            <div className="study-container">
                {(() => {
                    switch(this.state.displayValue){
                        case 0:
                            return <span>Loading...</span>;
                        case 1:
                            return <SchoolSub data={this.state.data} baseUrl={this.state.baseUrl} />;
                        case 2:
                            return <MajorSub majorData={this.state.majorData} />;
                        default:
                            return <div>Invalid Param</div>;
                    }
                })()}
                
            </div>
        );
    }

    loadData(){
        try {
            if(this.props.match.params.studyArea && (this.props.match.params.studyArea in academicData)){
                var tmpData = academicData[this.props.match.params.studyArea];
                tmpData.degreeList = Object.keys(tmpData.degrees);

                var areaUrlTitle = tmpData.title.replace(/([&\/\\()])/g,"_").split(' ').join("").toLowerCase();
                var baseUrl = "/studyarea/"+areaUrlTitle;
                
                let params = new URLSearchParams(this.props.location.search);
                var majorId = params.get("majorId");
                var tmpArea = academicData[this.props.match.params.studyArea];
                var tmpMajor = [];
                var displayNum = 1;

                if(majorId != null){ 
                    /*displayNum = -1;*/
                    for(var i =0; i < tmpData.degreeList.length; i++){
                        tmpMajor = tmpArea.degrees[tmpData.degreeList[i]].filter(function(item){  return item.id == majorId; });
                        if(tmpMajor.length > 0) { displayNum = 2; tmpMajor = tmpMajor[0]; break; }
                    }                                     
                }

                this.setState({ displayValue:displayNum, data: tmpData, baseUrl:baseUrl, majorData: tmpMajor});
            }
            else {
                this.setState({ displayValue:-1 });
            }
        }
        catch(ex){
            console.log("Error Loading Data: ", ex);
        }
    }   
}

export {StudyArea, StudyAreaHeader};
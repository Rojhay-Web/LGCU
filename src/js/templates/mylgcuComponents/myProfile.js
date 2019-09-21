import React, { Component } from 'react';
import axios from 'axios';

/* Data */
import academicData from '../../data/academics.json';
import courseData from '../../data/courses.json';

/* Body */
/* Status code
    0: Not Completed
    1: Registered
    2: In Progress
    3: Completed
*/
class MyProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id:null,
            name:null,
            email: null,
            address: null,
            degree:null,
            degreelvl:null,
            gpa: 0,
            totalCredits: 0,
            overviewData: []
        }

        this.getCourseStatus = this.getCourseStatus.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    componentDidMount(){ 
        this.getUserInfo();
    }

    render(){        
        return(
            <div className="mylgcu-profile">
                {/* Student Profile */}
               <div className="mylgcu-content-section">
                   <div className="section-title">Profile</div>

                   <div className="content-block sz5">
                       <div className="block-container">
                            <div className="content-title">Name:</div>
                            <div className="content-info">{this.state.name}</div>
                       </div>
                   </div>

                   <div className="content-block sz5">
                        <div className="block-container">
                            <div className="content-title">Email:</div>
                            <div className="content-info">{this.state.email}</div>
                       </div>
                   </div>

                   <div className="content-block sz10">
                        <div className="block-container">
                            <div className="content-title">Address:</div>
                            <div className="content-info">{this.state.address}</div>
                       </div>
                   </div>
               </div>
                {/* Student Info */}
               <div className="mylgcu-content-section">
                   <div className="section-title">Student Information</div>

                   <div className="content-block sz2">
                       <div className="block-container">
                            <div className="content-title">Student Id:</div>
                            <div className="content-info">{this.state.studentId}</div>
                       </div>
                   </div>

                   <div className="content-block sz4">
                        <div className="block-container">
                            <div className="content-title">Degree:</div>
                            <div className="content-info">{this.state.degreelvl} in {this.state.degree}</div>
                       </div>
                   </div>
                   
                   <div className="content-block sz2">
                       <div className="block-container">
                            <div className="content-title">Total Credits:</div>
                            <div className="content-info">{this.state.totalCredits || ""}</div>
                       </div>
                   </div>

                   <div className="content-block sz2">
                       <div className="block-container">
                            <div className="content-title">GPA:</div>
                            <div className="content-info">{this.state.gpa || ""}</div>
                       </div>
                   </div>
               </div>

                {/* Degree Overview */}
                <div className="mylgcu-content-section">
                   <div className="section-title">Degree Overview</div>

                   <div className="content-block sz10">
                       <div className="block-container overview">
                            <table className="overview-table">
                                <thead>
                                    <tr className="header">
                                        <th></th>
                                        <th>Course Code</th>
                                        <th>Course Title</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.overviewData.map((item, i) =>(
                                        <tr key={i} className="dataRow">
                                            <td><span className="courseNumber">{i+1}</span></td>
                                            <td><span className="courseCode">{item.courseCode.name} {item.courseCode.id}</span></td>
                                            <td><span className="courseTitle">{item.title}</span></td>
                                            <td><span className={"courseStatus status"+item.statusCode}>{this.getCourseStatus(item.statusCode)}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                       </div>
                   </div>
               </div>
            </div>
        );
    }

    getUserInfo(){
        var self = this;
        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);
            
            if(sessionInfo){
                var localUser = JSON.parse(sessionInfo);

                var postData = { requestUser: { _id: localUser._id}, userInfo: { _id: localUser._id} };
                axios.post(self.props.rootPath + "/api/getUserById", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        self.setState({ error: response.errorMessage });
                    }
                    else {
                        var userInfo = response.data.results;

                        self.setState({ _id:userInfo._id, studentId: userInfo.studentId, name: userInfo.fullname, email: userInfo.email,
                                        address: userInfo.address, degree: userInfo.degree.major, degreeId: userInfo.degree.code,
                                        degreelevl:userInfo.degree.level, totalCredits: userInfo.studentInfo.credits, gpa: userInfo.studentInfo.gpa
                        }, () =>{ self.getCourseList(self.state.degreeId); });
                    }
                });     
            }
            else {
                self.setState({ _id:null, studentId: null, name: null, address: null, degree: null, 
                    degreeId: null, degreelevl:null, totalCredits: 0, gpa: 0}, () =>{ self.getCourseList(null); });
            }
        }
        catch(ex){
            console.log("[Error]: Error Getting User Info: ",ex);
        }
    }

    getCourseList(degreeId){
        var self = this;
        try {
           // Get Course list from TalentLMS

           // Get Major Course List
           var major = null;
           var courseList = [];
           var academics = Object.keys(academicData);
           
           if(degreeId != null){           
                academics.forEach(function(school){
                    var levels = Object.keys(academicData[school].degrees);
                    levels.forEach(function(lvl){
                        var degrees = academicData[school].degrees[lvl];
                        degrees.forEach(function(degree){
                            if(degree.id.toLowerCase() == degreeId.toLowerCase()){
                                major = degree;
                            }
                        });
                    });
                });

                if(major != null){
                    major.courses.forEach(function(section){
                        section.courses.forEach(function(course){
                            if(course in courseData){
                                courseList.push({courseCode:{name:courseData[course].section, id:courseData[course].id}, title: courseData[course].title, statusCode:0 });
                            }                        
                        });
                    });
                }
            }

           // Create overviewData List
           self.setState({overviewData: courseList });
        }
        catch(ex){
            console.log("[Error]: Error Getting Course List: ",ex);
        }
    }

    getCourseStatus(code){
        var ret = "";
        try {
            switch(code){
                case 0:
                    ret = "Not Completed"
                    break;
                case 1:
                    ret = "Registered"
                    break;
                case 2:
                    ret = "In Progress"
                    break;
                case 3:
                    ret = "Completed"
                    break;
                default:
                    ret = "NA"
                    break;
            }
        }
        catch(ex){
            console.log("error getting status code: ",ex);
        }
        return ret;
    }
}

export default MyProfile;
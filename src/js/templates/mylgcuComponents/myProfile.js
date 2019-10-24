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
            overviewData: [],
            currentCourses:[],
            courseSearch:[],
            spinner:false
        }

        this.getCourseStatus = this.getCourseStatus.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.loadStudentCourses = this.loadStudentCourses.bind(this);
        this.loadCourses = this.loadCourses.bind(this);
        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.getCourseId = this.getCourseId.bind(this);
    }

    componentDidMount(){ 
        this.getUserInfo();
    }

    render(){        
        return(
            <div className="mylgcu-profile">
                {/* Spinner */}
               {this.state.spinner && <div className="spinner"><i className="fas fa-cog fa-spin"/><span>Loading</span></div> }

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

                {/* Student Resources */}
                <div className="mylgcu-content-section">
                    <div className="section-title">Student Resources</div>

                    <div className="resource-container">
                        <a href="https://lenkesongcu.talentlms.com/" target="_blank" className="resource-link">
                            <i className="fas fa-chalkboard-teacher"></i>
                            <span>TalentLMS</span>
                        </a>
                    </div>
                    <div className="resource-container">
                        <a href="https://iii.ocls.info/patroninfo/top" target="_blank" className="resource-link">
                            <i className="fas fa-book-reader"></i>
                            <span>Online Library</span>
                        </a>
                    </div>
                    <div className="resource-container">
                        <a href="https://www.mbsdirect.net/" className="resource-link">
                            <i className="fas fa-book"></i>
                            <span>LGCU Bookstore</span>
                        </a>
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

    toggleSpinner(status){
        this.setState({ spinner: status });
    }

    getUserInfo(){
        var self = this;
        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);
            
            if(sessionInfo){
                var localUser = JSON.parse(sessionInfo);

                var postData = { requestUser: { _id: localUser._id}, userInfo: { _id: localUser._id, full:true} };
                axios.post(self.props.rootPath + "/api/getUserById", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        self.setState({ error: response.errorMessage });
                    }
                    else {
                        var userInfo = response.data.results;

                        self.setState({ _id:userInfo._id, studentId: userInfo.studentId, talentlmsId:userInfo.talentlmsId, name: userInfo.fullname, email: userInfo.email,
                                        address: userInfo.address, degree: userInfo.degree.major, degreeId: userInfo.degree.code,
                                        degreelvl:userInfo.degree.level, totalCredits: userInfo.studentInfo.credits, gpa: userInfo.studentInfo.gpa
                        }, () =>{ 
                            self.loadStudentCourses(self.state.talentlmsId.id,function(){
                                self.loadCourses(function() {
                                    self.getCourseList(self.state.degreeId);
                                });
                            });                           
                        });
                    }
                });     
            }
            else {
                self.setState({ _id:null, studentId: null, name: null, address: null, degree: null, 
                    degreeId: null, degreelvl:null, totalCredits: 0, gpa: 0}, () =>{ self.getCourseList(null); });
            }
        }
        catch(ex){
            console.log("[Error]: Error Getting User Info: ",ex);
        }
    }

    loadStudentCourses(talentlmsId, callback){
        var self = this;

        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);

            if(sessionInfo){ 
                var localUser = JSON.parse(sessionInfo);
                var postData = { requestUser: { _id: localUser._id}, userInfo: { id: talentlmsId } };

                self.toggleSpinner(true);

                axios.post(self.props.rootPath + "/api/getTLMSUserById", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert(response.data.errorMessage );
                    }
                    else {
                        var userInfo = response.data.results;
                        self.setState({ currentCourses: userInfo.courses }, () => { callback(); });
                    }
                });   
            }
            else {
                self.setState({ currentCourses: [] }, () => { callback(); });
            }
            self.toggleSpinner(false);
        }
        catch(ex){
            alert("[Error] Loading Student Course Info: ", ex);
            self.toggleSpinner(false);
        }
    }

    loadCourses(callback) {
        var self = this;

        try {
            self.toggleSpinner(true);

            axios.get(self.props.rootPath + "/api/getCourses", {'Content-Type': 'application/json'})
            .then(function(response) {
                if(response.data.errorMessage){
                    alert(response.data.errorMessage );
                }
                else {
                   self.setState({ courseSearch: response.data.results }, () => { callback(); });
                }
            });   
            self.toggleSpinner(false);
        }
        catch(ex){
            alert("[Error] Loading Courses: ", ex);
            callback();
            self.toggleSpinner(false);
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
                                var courseId = self.getCourseId(courseData[course].section, courseData[course].id);

                                var compareCourse = self.state.currentCourses.filter(function(c){ return c.id == courseId; });
                                var status = 0;
                                if(compareCourse.length > 0){
                                    status = 1;
                                }
                                courseList.push({courseCode:{name:courseData[course].section, id:courseData[course].id}, title: courseData[course].title, statusCode:status });
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

    getCourseId(code, id) {
        var val = 0;
        try {
            var ret = this.state.courseSearch.filter(function(course){ return (course.courseCode == code && course.courseId == id); })

            val = (ret && ret.length > 0 ? ret[0].id : 0);
        }
        catch(ex){
            console.log("Error Getting course id: ",ex);
        }

        return val;
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
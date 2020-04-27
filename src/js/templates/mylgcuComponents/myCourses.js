import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';

import "react-table/react-table.css";
import 'react-table-hoc-fixed-columns/lib/styles.css';

import StudentPayment from '../components/studentPaymentModal';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

/* Body */
class MyCourses extends Component{
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            modalStatus:false,
            searchQuery:"",
            technologyFee:125,
            totalPrice:0,
            creditRate:0,
            studentInfo:{ studentId:0, talentlmsId:0, degree: "", class:"", gpa:0, fulltime:false },
            currentCourses:[],
            queuedCourses:[],
            courseSearch:[]
        }

        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.loadStudentInfo = this.loadStudentInfo.bind(this);
        this.loadCourses = this.loadCourses.bind(this);
        this.loadStudentCourses = this.loadStudentCourses.bind(this);
        this.addCourse = this.addCourse.bind(this);
        this.getCourseInfo = this.getCourseInfo.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.getSemesterCredits = this.getSemesterCredits.bind(this);
        this.getPrice = this.getPrice.bind(this);
        this.modalShow = this.modalShow.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.registerCourseList = this.registerCourseList.bind(this);
    }

    componentDidMount(){ 
        this.loadStudentInfo();
        this.loadCourses();
    }

    
    render(){
        var self = this;   
        var filterData = this.state.courseSearch.filter(function(course){ 
            var ret = false;
            try {
                
                ret = ((self.state.searchCourseQuery != "") &&
                (  (course.name && course.name.toLowerCase().indexOf(self.state.searchCourseQuery.toLowerCase()) >= 0)
                || (course.courseCode && course.courseCode.toLowerCase().indexOf(self.state.searchCourseQuery.toLowerCase()) >= 0)
                || (course.courseId && course.courseId.toLowerCase().indexOf(self.state.searchCourseQuery.toLowerCase()) >= 0)
                ));
            }
            catch(ex){
                console.log(course);
                console.log("[Error] filtering search: ",ex);
            }

            return ret;
        });

        var courseColumns = [    
            { Header: 'Course Code', accessor: 'courseCode', fixed: 'left' },
            { Header: 'Course Id', id: 'courseId', fixed: 'left', accessor: d => Number(d.courseId) },
            { Header: 'Course Name', accessor: 'name', fixed: 'left' },
            { Header: 'Credits', id: 'credits', fixed: 'left', accessor: d => Number(d.credits) },
            { Header: '', fixed: 'right', Cell: row => (
                <div className="course-btn">
                    <div className="lBtn c2" onClick={() => this.addCourse(row.original)}><span>Add Course</span><i className="btn-icon fas fa-plus-circle"></i></div>
                </div>
            ) }
        ];

        return(
            <div className="mylgcu-course">
               {/* Spinner */}
               {this.state.spinner && <div className="spinner"><i className="fas fa-cog fa-spin"/><span>Loading</span></div> }

               {/* Student Payment */}
               <StudentPayment title="Student Course Registration Payment" show={this.state.modalStatus} handleClose={this.modalHide} registerCourseList={this.registerCourseList} totalPrice={this.state.totalPrice} creditRate={this.state.creditRate} studentInfo={this.state.studentInfo} queuedCourses={this.state.queuedCourses} currentCourses={this.state.currentCourses} technologyFee={this.state.technologyFee} mySessKey={this.props.mySessKey}/>

                {/* Student Base Info */}
                <div className="mylgcu-content-section inverse">
                    <div className="content-block center sz4">
                        <div className="block-label-title">Degree</div>
                        <div className="block-text">{ this.state.studentInfo.degree }</div>
                    </div>

                    <div className="content-block center sz2">
                        <div className="block-label-title">Class</div>
                        <div className="block-text">{ this.state.studentInfo.class }</div>
                    </div>

                    <div className="content-block center sz2">
                        <div className="block-label-title">GPA</div>
                        <div className="block-text">{ this.state.studentInfo.gpa }</div>
                    </div>

                    <div className="content-block center sz2">
                        <div className="block-label-title">Student Type</div>
                        <div className="block-text">{ (this.state.studentInfo.fulltime === true ? 'full-time' : 'part-time')}</div>
                    </div>
                </div>

                {/* Current Courses*/}
                <div className="mylgcu-content-section">
                    <div className="section-title">My Courses</div>

                    <div className="content-block sz10">
                        <div className="block-container overview">
                            <table className="overview-table">
                                <thead>
                                    <tr className="header">
                                        <th></th>
                                        <th>Course Name</th>
                                        <th>Course Code</th>
                                        <th>Course Id</th>
                                        <th>Credits</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.currentCourses.map((item, i) =>(
                                        <tr key={i} className="dataRow">
                                            <td><span className="courseNumber">{i+1}</span></td>
                                            <td><span className="courseCode">{item.name}</span></td>
                                            <td><span className="courseCode">{ this.getCourseInfo("courseCode", item.id) }</span></td>
                                            <td><span className="courseId">{ this.getCourseInfo("courseId", item.id) }</span></td>
                                            <td><span className="credits">{ this.getCourseInfo("credits", item.id) }</span></td>
                                            <td>{/*<span className="courseEdit"><i className="fas fa-times"></i></span>*/}</td>
                                        </tr>
                                    ))}

                                    {this.state.queuedCourses.map((item, i) =>(
                                        <tr key={i} className="dataRow queued">
                                            <td><span className="courseNumber">Q</span></td>
                                            <td><span className="courseCode">{item.name}</span></td>
                                            <td><span className="courseCode">{ item.courseCode }</span></td>
                                            <td><span className="courseId">{ item.courseId }</span></td>
                                            <td><span className="credits">{ item.credits }</span></td>
                                            <td><span className="courseEdit"><i className="fas fa-times" onClick={()=>this.removeCourse(item.id)}></i></span></td>
                                        </tr>
                                    ))}

                                    {(this.state.currentCourses.length == 0 && this.state.queuedCourses.length == 0) && 
                                        <tr className="noDataRow">
                                            <td colSpan="6">No Courses Added</td>
                                        </tr>
                                    }
                                    {(this.state.currentCourses.length > 0 || this.state.queuedCourses.length > 0) && 
                                        <tr className="noDataRow creditCount">
                                            <td colSpan="4">
                                                <span>Total Semester Credits: {this.getSemesterCredits()}</span>
                                            </td>
                                            <td colSpan="2">
                                                {this.state.queuedCourses.length > 0 && <div className="lBtn clear" onClick={this.getPrice}><span>Register</span><i className="btn-icon fas fa-chalkboard"></i></div> }
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                       </div>
                    </div>
                </div>
                
                {/* Search Courses*/}
                <div className="mylgcu-content-section">
                    <div className="section-title">Find Courses</div>

                    <div className="content-block sz10">
                        <div className="block-container search-block">                            
                            <div className="content-info icon"><i className="fas fa-search"></i><input type="text" name="searchQuery" className="" placeholder="Search Course" value={this.state.searchQuery} onChange={(e) => this.onSearchChange(e)}/></div>
                        </div>
                    </div>


                    <div className="content-block sz10">
                        <ReactTableFixedColumns data={filterData} columns={courseColumns}></ReactTableFixedColumns>
                    </div>
                </div>
            </div>
        );
    }

    toggleSpinner(status){
        this.setState({ spinner: status });
    }

    modalShow(){
        this.setState({ modalStatus: true });
    }

    modalHide(){
        this.setState({ modalStatus: false });
    }

    onSearchChange(e){
        var self = this;
        try {
            var name = e.target.name;           
            self.setState({ [name]: e.target.value });
        }
        catch(ex){
            console.log("[Error] changing search: ",ex);
        }
    }
    
    addCourse(newCourse){
        try {
            var tmpQueue =  this.state.queuedCourses;
            var queuedCourses = tmpQueue.filter(function(course){
                return course.id == newCourse.id;
            });

            var currentCourses = this.state.currentCourses.filter(function(course){
                return course.id == newCourse.id;
            });

            if(queuedCourses.length > 0 || currentCourses.length > 0){
                alert("Course has already been added");
            }
            else {
                tmpQueue.push(newCourse);
                this.setState({ queuedCourses: tmpQueue });
            }
        }
        catch(ex){
            alert("Error adding course: ",ex);
        }
    }

    removeCourse(courseId){
        try {
            var tmpQueue =  this.state.queuedCourses;
            var index = tmpQueue.map(e => e.id).indexOf(courseId);
            if(index >= 0){
                tmpQueue.splice(index,1);
                this.setState({ queuedCourses: tmpQueue });
            }
        }
        catch(ex){
            alert("Error Removing Course: ",ex);
        }
    }

    getSemesterCredits(){
        var total = 0;

        try {
            
            var tmpQueue =  this.state.queuedCourses;
            var tmpCurrent = this.state.currentCourses;

            if(tmpQueue){
                for(var i = 0; i < tmpQueue.length; i++){
                    total = total + parseInt(tmpQueue[i].credits);
                } 
            }
            
            if(tmpCurrent){
                for(var i = 0; i < tmpCurrent.length; i++){
                    total = total + parseInt(this.getCourseInfo("credits", tmpCurrent[i].id));
                }  
            }        
        }
        catch(ex){
            alert("Error getting semester credits: ",ex);
        }

        return total;
    }

    getPrice(){
        var totalPrice = 0;
        var creditRate = 0;

        try {           
             var queuedTotal = this.state.queuedCourses.map(function(q) { return parseInt(q.credits);}).reduce((a, b) => a + b, 0);
             /* Calculate Semester Charge */
             var fulltime = (this.getSemesterCredits() >= 12);
             
             /* Military */
             if(this.state.studentInfo.military === true) {
                 if(this.state.studentInfo.level == "doctorate") {
                     creditRate = 265;
                 }
                 else if(this.state.studentInfo.level == "masters"){
                     creditRate = 255;
                 }
                 else {
                     creditRate = 225;
                 }
             }
             else {
                 if(this.state.studentInfo.level == "doctorate") {
                     creditRate = (fulltime ? 550 : 575);
                 }
                 else if(this.state.studentInfo.level == "masters"){
                     if(this.state.studentInfo.school.toLowerCase() == "theology & biblical studies"){
                         creditRate = (fulltime ? 375 : 395);
                     }
                     else if(this.state.studentInfo.school.toLowerCase() == "education"){
                         creditRate = (fulltime ? 390 : 415);
                     }
                     else {
                         creditRate = (fulltime ? 495 : 515);
                     }
                 }
                 else {
                     creditRate = (fulltime ? 295 : 315);
                 }
             }

             totalPrice = creditRate * queuedTotal;

             if(this.state.currentCourses.length == 0){
                 totalPrice = totalPrice + this.state.technologyFee;
             }
        }
        catch(ex){
            console.log("Error getting total price: ",ex);
        }

        this.setState({ totalPrice: totalPrice, creditRate: creditRate, modalStatus: true });
    }

    registerCourseList() {
        var self = this;
        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);

            if(sessionInfo){ 
                var tmpQueue =  this.state.queuedCourses;
                var localUser = JSON.parse(sessionInfo);
                var courseStatus = [];

                self.toggleSpinner(true);

                tmpQueue.forEach(function(course){
                    var postData = { requestUser: { _id: localUser._id}, userInfo: { studentId: self.state.studentInfo.studentId, talentlmsId: self.state.studentInfo.talentlmsId }, courseInfo:course };

                    axios.post(self.props.rootPath + "/api/courseRegister", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.errorMessage){
                            courseStatus.push({id: course.id, name: course.name, status: false, error: response.data.errorMessage});
                        }
                        else {
                            courseStatus.push({id: course.id, name: course.name, status: true});
                        }

                        if(courseStatus.length == tmpQueue.length){
                            self.toggleSpinner(false);
                            var noRegister = courseStatus.filter(function(item){ return item.status == false; });

                            if(noRegister.length > 0){
                                alert("Unable to register you for the following courses: " + noRegister.map(function(elem){ return elem.name; }).join(","));
                            } 
                            else {
                                alert("Successfully registered for all courses");
                            }

                            self.setState({ queuedCourses: []}, () => {
                                self.loadStudentCourses(self.state.studentInfo.talentlmsId.id);
                            });
                        }
                    });  
                }); 
            }
            self.toggleSpinner(false);
        }
        catch(ex){
            console.log("Error registering course list: ",ex);
        }
    }

    getCourseInfo(type, id){
        var self = this;
        try {
            if(!this.state.courseSearch){
                return "";
            }
            else {
                var selectedCourse = this.state.courseSearch.filter(function(course){
                    return course.id == id;
                });

                if(selectedCourse.length > 0 && (type in selectedCourse[0])){
                    return selectedCourse[0][type];
                }
                else {
                    return "";
                }
            }
        }
        catch(ex){

        }
    }

    loadStudentInfo() {
        var self = this;

        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);

            if(sessionInfo){ 
                var localUser = JSON.parse(sessionInfo);
                var postData = { requestUser: { _id: localUser._id}, userInfo: { _id: localUser._id, full:true} };

                self.toggleSpinner(true);

                axios.post(self.props.rootPath + "/api/getUserById", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert(response.data.errorMessage );
                    }
                    else {
                        var userInfo = response.data.results;
                        var tmpStudent = { degree: userInfo.degree.level +" in "+userInfo.degree.major, class: userInfo.studentInfo.class,
                                            level: userInfo.studentInfo.level, school: userInfo.studentInfo.school,
                                            gpa: userInfo.studentInfo.gpa,  fulltime: (userInfo.studentInfo.fulltime == true),
                                            military: userInfo.military, studentId: userInfo.studentId, talentlmsId: userInfo.talentlmsId };
                        self.setState({ studentInfo: tmpStudent }, () =>{
                            self.loadStudentCourses(userInfo.talentlmsId.id);
                        });
                    }
                });   
            }
            else {
                self.setState({ studentInfo: { degree: "", class:"", gpa:0, fulltime:false } });
            }
            self.toggleSpinner(false);
        }
        catch(ex){
            alert("[Error] Loading Student Info: ", ex);
            self.toggleSpinner(false);
        }
    }

    loadStudentCourses(talentlmsId){
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
                        self.setState({ currentCourses: userInfo.courses });
                    }
                });   
            }
            else {
                self.setState({ currentCourses: [] });
            }
            self.toggleSpinner(false);
        }
        catch(ex){
            alert("[Error] Loading Student Course Info: ", ex);
            self.toggleSpinner(false);
        }
    }

    loadCourses() {
        var self = this;

        try {
            self.toggleSpinner(true);

            axios.get(self.props.rootPath + "/api/getCourses", {'Content-Type': 'application/json'})
            .then(function(response) {
                if(response.data.errorMessage){
                    alert(response.data.errorMessage );
                }
                else {
                   self.setState({ courseSearch: response.data.results });
                }
            });   
            self.toggleSpinner(false);
        }
        catch(ex){
            alert("[Error] Loading Courses: ", ex);
            self.toggleSpinner(false);
        }
    }
}

export default MyCourses;
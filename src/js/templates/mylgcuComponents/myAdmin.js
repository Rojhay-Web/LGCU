import React, { Component } from 'react';
import { UncontrolledCollapse } from 'reactstrap';
import axios from 'axios';

import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';

import "react-table/react-table.css";
import 'react-table-hoc-fixed-columns/lib/styles.css';

/* Data */
import academicData from '../../data/academics.json';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

/* Body */
class MyAdmin extends Component{
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            studentCollapse: true,
            courseCollapse: false,
            accountCollapse: false,
            searchQuery: "",
            searchCourseQuery:"",
            searchResults:null,
            selectedUser: {
                _id:null,
                firstname:"", lastname:"",  email:"", address:"", phone:"", 
                military:false, admin: false, gpa:0,
                degree:{ school:"", code:"", major:"", declareDate: null },
                studentId:"", accountId:"", talentlmsId:{}
            },
            degreeList:[], areaList:[], majorResults:[],
            updateType:null,
            courseSearch:[],
            currentCourses:[],
            queuedCourses:[],
            accountTransactions:[]
        }

        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
        this.buildFilterList = this.buildFilterList.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.majorSelectChange = this.majorSelectChange.bind(this);
        this.newStudent = this.newStudent.bind(this);
        this.clearStudentForm = this.clearStudentForm.bind(this);
        this.selectStudent = this.selectStudent.bind(this);
        this.getStudentInfo = this.getStudentInfo.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
        this.searchEnterQuery = this.searchEnterQuery.bind(this);
        this.saveStudent = this.saveStudent.bind(this);
        this.refreshStudentID = this.refreshStudentID.bind(this);
        this.createTalentLmsId = this.createTalentLmsId.bind(this);
        this.createAuthNetId = this.createAuthNetId.bind(this);

        this.loadCourses = this.loadCourses.bind(this);
        this.loadStudentCourses = this.loadStudentCourses.bind(this);
        this.getCourseInfo = this.getCourseInfo.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.getSemesterCredits = this.getSemesterCredits.bind(this);
        this.registerCourseList = this.registerCourseList.bind(this);
        this.unregisterCourseList = this.unregisterCourseList.bind(this);
        this.queueCourse = this.queueCourse.bind(this);
        this.loadAccountInfo = this.loadAccountInfo.bind(this);
    }

    componentDidMount(){
        this.loadCourses();
        this.buildFilterList();
    }

    render(){   
        const filteredResults = this.state.majorResults;
        const { studentCollapse, courseCollapse, accountCollapse } = this.state;
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
                    <div className="lBtn c2" onClick={() => this.queueCourse(row.original)}><span>Add Course</span><i className="btn-icon fas fa-plus-circle"></i></div>
                </div>
            ) }
        ];

        return(
            <div className="mylgcu-admin">
                {/* Spinner */}
                {this.state.spinner && <div className="spinner"><i className="fas fa-cog fa-spin"/><span>Loading</span></div> }

                {/* Search Section */}
                <div className="mylgcu-content-section inverse">
                    <div className="section-title">Student Search</div>

                    <div className="content-block sz9">
                        <div className="block-label-title">Search</div>
                        <div className="block-container">                            
                            <div className="content-info icon"><i className="fas fa-search"></i><input type="text" name="searchQuery" className="" placeholder="Search Name, Email, or Student ID" value={this.state.searchQuery} onChange={(e) => this.onSearchChange(e)} onKeyPress={(e) => this.searchEnterQuery(e)}/></div>
                        </div>
                    </div>

                    <div className="content-block search-container sz1">                          
                        <div className="search-btn" onClick={this.searchEnterQuery}><i className="btn-icon fas fa-search"></i></div>
                    </div>
                </div>

                <div className="mylgcu-content-section addUser">
                    <div className="btn-container">
                        <div className="lBtn c2" onClick={this.newStudent}><span>New Student</span><i className="btn-icon fas fa-user-plus"></i></div>
                    </div> 
                </div>

                {/* Results Section */}                
                {this.state.searchResults != null &&
                    <div className="mylgcu-content-section">
                        <div className="section-title">Search Results <span>({this.state.searchResults.length} results)</span></div>

                        <div className="results-container">
                            <div className="results-subcontainer">
                                {this.state.searchResults.map((item,i) =>
                                    <div key={i} className="result-item" onClick={(e) => this.selectStudent(item._id)}>
                                        <div className="user-icon"><i className="far fa-user"/></div>
                                        <div className="user-info">
                                            <div className="info-name">{item.fullname}</div>
                                            <div className="info-email">{item.email}</div>
                                            <div className="info-id">{item.studentId}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }

                {/* Student Section*/}
                {this.state.updateType != null &&
                    <div className="collapse-section">
                        <div className="collapse-title" onClick={() => this.setState({studentCollapse: !studentCollapse}) } aria-expanded={studentCollapse} aria-controls="studentInfo"><span>Student Info</span> <i className={"fas " + (studentCollapse? "fa-chevron-up" : "fa-chevron-down")}></i></div>
                        {this.state.studentCollapse && 
                        <div className="mylgcu-content-section inverse" id="studentInfo">                        
                            <div className="section-title">Student Information</div>
                                
                            <div className="content-block sz3">
                                <div className="block-label-title">First Name:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="firstname" className="" placeholder="First Name" value={this.state.selectedUser.firstname} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                            </div>

                            <div className="content-block sz3">
                                <div className="block-label-title">Last Name:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="lastname" className="" placeholder="Last Name" value={this.state.selectedUser.lastname} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                            </div>

                            <div className="content-block sz4">
                                <div className="block-label-title">Email:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="email" className="" placeholder="Email" value={this.state.selectedUser.email} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                            </div>

                            <div className="content-block sz7">
                                <div className="block-label-title">Address:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="address" className="" placeholder="Address" value={this.state.selectedUser.address} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                            </div>

                            <div className="content-block sz3">
                                <div className="block-label-title">Phone:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="phone" className="" placeholder="Phone" value={this.state.selectedUser.phone} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                            </div>

                            <div className="content-block sz6">
                                <div className="block-label-title">Student Classification:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="class" placeholder="student class" value={this.state.selectedUser.studentInfo.class} readOnly/></div>
                                </div>
                            </div>

                            <div className="content-block sz4">
                                <div className="block-label-title">GPA:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="gpa" placeholder="gpa" value={this.state.selectedUser.gpa} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                            </div>

                            {/* IDs */}
                            <div className="content-block sz3">
                                <div className="block-label-title">Student ID:</div>
                                <div className="block-container">                            
                                    <div className="content-info generator">
                                        <span className="IdGenerator" onClick={this.refreshStudentID}><i className="fas fa-sync-alt"></i></span>
                                        <input type="text" name="studentId" className="" placeholder="Student id" value={this.state.selectedUser.studentId} readOnly/>
                                    </div>
                                </div>
                            </div>

                            {/*<div className="content-block sz3">
                                <div className="block-label-title">Acccount ID:</div>
                                <div className="block-container">                            
                                    <div className="content-info generator">
                                        <span className="IdGenerator" onClick={this.createAuthNetId}><i className="fas fa-sync-alt"></i></span>
                                        <input type="text" name="accountId" className="" placeholder="Account id" value={this.state.selectedUser.accountId} readOnly/>
                                    </div>
                                </div>
                            </div>*/}

                            <div className="content-block sz3">
                                <div className="block-label-title">TalentLMS ID:</div>
                                <div className="block-container">                            
                                    <div className="content-info generator">
                                        <span className="IdGenerator" onClick={this.createTalentLmsId}><i className="fas fa-sync-alt"></i></span>
                                        <input type="text" name="talentlmsId" className="" placeholder="Talentlms id" value={ (this.state.selectedUser.talentlmsId ? this.state.selectedUser.talentlmsId.id + " | "+this.state.selectedUser.talentlmsId.login : "") } readOnly/>
                                    </div>
                                </div>
                            </div>

                            <div className="content-block sz2">
                                <div className="block-label-title">Is Military</div>
                                <div className="block-container no-back">                            
                                    <div className="content-info">
                                        <label className="switch">
                                            <input type="checkbox" name="military" checked={this.state.selectedUser.military} onChange={(e) => this.onElementChange(e)}/>
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="content-block sz2">
                                <div className="block-label-title">Is Admin</div>
                                <div className="block-container no-back">                            
                                    <div className="content-info">
                                        <label className="switch">
                                            <input type="checkbox" name="admin" checked={this.state.selectedUser.admin} onChange={(e) => this.onElementChange(e)}/>
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                                    
                            <div className="degree-block">                                                
                                {/* Degree Info */}
                                <div className="degree-container">
                                    <div className="full-list-container">                            
                                        <div className="list-container">
                                            {this.state.degreeList.map((item, i) => (
                                                <div key={i} className={"filterBtn degreeItem " + (item.status ? " active" : "")} onClick={() => this.toggleFilter("degreeList", i)}>
                                                    <i className={"far " + (item.status ? "fa-check-circle" : "fa-circle")}></i>
                                                    <span>{item.title}</span>
                                                </div>
                                            ))}
                                        </div>                                
                                    </div>
                                        
                                    {/* Degree */}
                                    <div className="content-block sz3">
                                        <div className="block-label-title">Degree School:</div>
                                        <div className="block-container">                            
                                            <div className="content-info">{this.state.selectedUser.degree.school || ""}</div>
                                        </div>
                                    </div>

                                    <div className="content-block sz4">
                                        <div className="block-label-title">Degree Major:</div>
                                        <div className="block-container">                            
                                            <div className="content-info">{this.state.selectedUser.degree.major || ""}</div>
                                        </div>
                                    </div>

                                    <div className="content-block sz1">
                                        <div className="block-label-title">Degree Level:</div>
                                        <div className="block-container">                            
                                            <div className="content-info">{this.state.selectedUser.degree.level || ""}</div>
                                        </div>
                                    </div>

                                    <div className="content-block sz2">
                                        <div className="block-label-title">Degree ID:</div>
                                        <div className="block-container">                            
                                            <div className="content-info">{this.state.selectedUser.degree.code || ""}</div>
                                        </div>
                                    </div>

                                    {this.state.majorResults.length > 0 &&
                                        <div className="result-search-container">
                                            <div className="results-list">
                                                <div className="results-container">
                                                    {filteredResults.map((item, i) => (
                                                        <div className={"result-item " + item.theme} key={i} onClick={(e) => this.majorSelectChange(item)}>
                                                            <div className={"result-icon " + item.theme} />
                                                            <div className="item-info-container">
                                                                <div className="degree-title"><span>{item.degree}</span> <span>{(item.degreeTitle ? item.degreeTitle : "")}</span></div>
                                                                <div className="major-title">
                                                                    {item.subtitle && <span className="sub-title">{item.subtitle} - </span>}
                                                                    <span className="major-title">{item.title}</span>
                                                                </div>
                                                            </div>
                                                         </div>
                                                        ))}
                                                    {filteredResults.length === 0 && <div className="result-message">Sorry we did not return any results for that search.</div>}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="content-block sz10">
                                <div className="btn-container">
                                    <div className="lBtn c2" onClick={this.saveStudent}><span>Save Student</span><i className="btn-icon far fa-save"></i></div>
                                </div> 
                            </div>
                        </div>  
                        }
                    </div>                 
                }

                {/* Course Section */}
                {this.state.updateType == "update" &&
                    <div className="collapse-section">
                        <div className="collapse-title" onClick={() => this.setState({courseCollapse: !courseCollapse}) } aria-expanded={courseCollapse} aria-controls="courseInfo"><span>Student Courses</span> <i className={"fas " + (courseCollapse ? "fa-chevron-up" : "fa-chevron-down")}></i></div>
                        {this.state.courseCollapse && 
                        <div className="mylgcu-content-section inverse" id="studentInfo">                        
                           <div className="section-title">Student Courses</div> 
                           
                           <div className="content-block sz10 mini-height">
                                <div className="block-container search-block">                            
                                    <div className="content-info icon"><i className="fas fa-search"></i><input type="text" name="searchCourseQuery" className="" placeholder="Search Course" value={this.state.searchCourseQuery} onChange={(e) => this.onSearchChange(e)} /></div>
                                </div>
                                
                                <ReactTableFixedColumns data={filterData} columns={courseColumns} />
                           </div>

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
                                                    <td><span className="courseEdit" onClick={()=> this.unregisterCourseList(item)}><i className="fas fa-times"></i></span></td>
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
                                                        {this.state.queuedCourses.length > 0 && <div className="lBtn clear" onClick={this.registerCourseList}><span>Register</span><i className="btn-icon fas fa-chalkboard"></i></div> }
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>  
                        }
                    </div>                 
                }

                {/* Account Section */}
                {this.state.updateType == "update" &&
                    <div className="collapse-section">
                        <div className="collapse-title" onClick={() => this.setState({accountCollapse: !accountCollapse}) } aria-expanded={accountCollapse} aria-controls="accountInfo"><span>Student Account</span> <i className={"fas " + (accountCollapse ? "fa-chevron-up" : "fa-chevron-down")}></i></div>
                        {this.state.accountCollapse && 
                            <div className="mylgcu-content-section inverse" id="accountInfo">                        
                                <div className="section-title">Student Account</div> 
                            
                                {this.state.accountTransactions.map((item, i) => (
                                    <div className="content-block sz10" key={i}>
                                        <div className="account-info">
                                            <div className="account-block">
                                                <span className="account-icon success"><i className="fas fa-check"></i></span>
                                            </div>

                                            <div className="account-block">
                                                <span className="subText">Transaction Date</span>
                                                <span>{item.submitTime}</span>
                                            </div>

                                            <div className="account-block">
                                                <span className="subText">Transaction Id</span>
                                                <span>{item.transactionId}</span>
                                            </div>

                                            <div className="account-block">
                                                <span className="subText">{item.order.invoiceNumber}</span>
                                                <span>{item.order.description}</span>
                                            </div>

                                            <div className="account-block">
                                                <span className="subText">Total Charge</span>
                                                <span>$ {item.amount.toFixed(2)}</span>
                                            </div>

                                            <div className="account-block">
                                                <span className="account-icon info" id={"toggler"+i}><i className="fas fa-info"></i></span>
                                            </div>
                                        </div>

                                        <UncontrolledCollapse toggler={"#toggler"+i} className="account-toggler">
                                            <table className="account-table overview-table">
                                                <thead>
                                                    <tr className="header">
                                                        <th>Charge Name</th>
                                                        <th>Charge Description</th>
                                                        <th>Charge Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.lineItems.map((charge,k) => (
                                                        <tr key={k}>
                                                            <td>{charge.name}</td>
                                                            <td>{charge.description}</td>
                                                            <td>$ {charge.price.toFixed(2)}</td>
                                                        </tr>
                                                    ))}                                        
                                                </tbody>
                                            </table>
                                        </UncontrolledCollapse>
                                    </div>
                                ))}
                            </div>  
                        }
                    </div>
                }
            </div>
        );
    }

    toggleSpinner(status){
        this.setState({spinner: status });
    }

    refreshStudentID(){
        var self = this;
        try {
            this.toggleSpinner(true);
            var sessionInfo = localStorage.getItem(self.props.mySessKey);
            
            if(sessionInfo) {
                var localUser = JSON.parse(sessionInfo);
                
                if(!this.state.selectedUser || !this.state.selectedUser._id)
                {
                    alert("Student not active, please create student then create id");
                }
                else {
                    var postData = { 
                        requestUser: { _id: localUser._id}, 
                        userInfo: { _id: this.state.selectedUser._id } 
                    };

                    axios.post(self.props.rootPath + "/api/generateStudentId", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.errorMessage){
                            alert("Unable to refresh student ID: "+ response.data.errorMessage);
                        }
                        else {                        
                            var student = self.state.selectedUser;
                            student.studentId = response.data.results;

                            self.setState({ updateType: "update", selectedUser: student
                            }, ()=> { alert("Successfully refreshed student ID: "); });
                        }
                        self.toggleSpinner(false);
                    });  
                }
            }
        }
        catch(ex){            
            alert("[Error] Refreshing Student Id: ", ex);
            self.toggleSpinner(false);
        }
    }

    createTalentLmsId(){
        var self = this;
        try {
            this.toggleSpinner(true);
            var sessionInfo = localStorage.getItem(self.props.mySessKey);
            
            if(sessionInfo) {
                var localUser = JSON.parse(sessionInfo);
                
                if(!this.state.selectedUser || !this.state.selectedUser._id)
                {
                    alert("Student not active, please create student then create id");
                }
                else {
                    var postData = { 
                        requestUser: { _id: localUser._id}, 
                        userInfo: { _id: this.state.selectedUser._id, firstname:this.state.selectedUser.firstname, lastname:this.state.selectedUser.lastname, email:this.state.selectedUser.email, retry:0 } 
                    };

                    axios.post(self.props.rootPath + "/api/createTLMSUser", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.errorMessage){
                            alert("Unable to create TalentLMS ID: "+ response.data.errorMessage);
                        }
                        else {                        
                            var student = self.state.selectedUser;
                            student.talentlmsId = response.data.results;

                            self.setState({ updateType: "update", selectedUser: student
                            }, ()=> { alert("Successfully created TalentLMS ID: "); });
                        }
                        self.toggleSpinner(false);
                    });  
                }
            }
        }
        catch(ex){            
            alert("[Error] Creating TalentLMS ID: ", ex);
            self.toggleSpinner(false);
        }
    }

    createAuthNetId(){
        var self = this;
        try {
            this.toggleSpinner(true);
            var sessionInfo = localStorage.getItem(self.props.mySessKey);
            
            if(sessionInfo) {
                var localUser = JSON.parse(sessionInfo);
                
                if(!this.state.selectedUser || !this.state.selectedUser._id)
                {
                    alert("Student not active, please create student then create id");
                }
                else {
                    var postData = { 
                        requestUser: { _id: localUser._id}, 
                        userInfo: { _id: this.state.selectedUser._id } 
                    };

                    axios.post(self.props.rootPath + "/api/createAuthNETAccount", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.errorMessage){
                            alert("Unable to create Authorize.NET ID: "+ response.data.errorMessage);
                        }
                        else {                        
                            var student = self.state.selectedUser;
                            student.accountId = response.data.results;

                            self.setState({ updateType: "update", selectedUser: student
                            }, ()=> { alert("Successfully created Authorize.NET ID: "); });
                        }
                        self.toggleSpinner(false);
                    });  
                }
            }
        }
        catch(ex){            
            alert("[Error] Creating TalentLMS ID: ", ex);
            self.toggleSpinner(false);
        }
    }

    saveStudent(){
        var self = this;
        try {
            self.toggleSpinner(true);
            var sessionInfo = localStorage.getItem(self.props.mySessKey);
            
            if(sessionInfo) {
                var localUser = JSON.parse(sessionInfo);
                var url = (this.state.updateType == "new" ? "/api/createUser" : "/api/updateUser");

                var postData = { 
                    requestUser: { _id: localUser._id}, 
                    userInfo: this.state.selectedUser 
                };

                axios.post(self.props.rootPath + url, postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert("Unable to update/add student: "+ response.data.errorMessage);
                    }
                    else {
                        var student = response.data.results;
                        self.setState({ updateType: "update", 
                            selectedUser:{
                                firstname:student.firstname, lastname:student.lastname, email:student.email, 
                                address:student.address, phone: student.phone || "", admin:student.admin, 
                                military:student.military, studentInfo:student.studentInfo, gpa: (student.studentInfo ? student.studentInfo.gpa : 0),
                                degree:student.degree, _id:student._id, studentId:student.studentId || "", 
                                accountId:student.accountId || "", talentlmsId:student.talentlmsId
                            }
                        }, ()=> { alert("Successfully updated/added student "); });
                    }
                    self.toggleSpinner(false);
                });  
            }
        }
        catch(ex){
            console.log("Error saving student:",ex);
            self.toggleSpinner(false);
        }
    }

    selectStudent(studentid){
        var self = this;
        try{
            if(this.state.updateType != null){
                // Alert
                if(window.confirm("Do you want to select this student, all of your unsaved work will be lost?")) {
                    // Clear form 
                    self.clearStudentForm(function(){ 
                        // Get Student Information
                        self.getStudentInfo(studentid);
                    });
                }                                
            }
            else {
                this.clearStudentForm(function(){ 
                    // Get Student Information
                    self.getStudentInfo(studentid);
                });                
            }
        }
        catch(ex){
            console.log("[Error] selecting current student: ",ex);
        }
    }

    newStudent(){
        var self = this;
        try {
            if(this.state.updateType != null){
                // Alert
                if(window.confirm("Do you want to begin creating a new student, all of your unsaved work will be lost?")) {
                    // Clear Previous Search
                    self.setState({ searchQuery:"", searchResults: null });
                    // Clear form begin new student
                    self.clearStudentForm(function(){ self.setState({ updateType: "new" }); });
                }                                
            }
            else {
                // Clear Previous Search
                self.setState({ searchQuery:"", searchResults: null });
                // Clear form begin new student
                this.clearStudentForm(function(){ self.setState({ updateType: "new" }); });                
            }
        }
        catch(ex){
            console.log("[Error] setting new student: ",ex);
        }
    }
    
    clearStudentForm(callback){
        var self = this;
        try{           
            
            this.setState({ 
                selectedUser:{_id:null, firstname:"", lastname:"",  email:"", address:"", phone:"",
                degree:{ school:"", code:"", major:"", declareDate: null },  
                studentId:"", accountId:"", talentlmsId:{ id:"", login:""},
                studentInfo:{gpa:0, class:"freshman"}
                }
            }, ()=> { 
                    callback(); });
        }
        catch(ex){
            console.log("[Error] clearing form: ",ex);
        }
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
    searchEnterQuery(e){
        try {
            if(e.charCode == 13 && e.shiftKey == false) {
                e.preventDefault();
                this.searchQuery();
            }
        }
        catch(ex){
            console.log("Error with search entry: ",ex);
        }
    }
    searchQuery(){
        var self = this;
        try {
            var query = this.state.searchQuery;
            self.toggleSpinner(true);

            if(query.length <= 0){
                self.setState({ searchResults: [] });
            }
            else {
                var sessionInfo = localStorage.getItem(self.props.mySessKey);
                if(sessionInfo) {
                    var localUser = JSON.parse(sessionInfo);

                    var postData = { 
                        requestUser: { _id: localUser._id}, 
                        searchInfo: { query: query} 
                    };
                    axios.post(self.props.rootPath + "/api/userSearch", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.errorMessage){
                            self.setState({ error: response.data.errorMessage, searchResults: [] });
                        }
                        else {
                            self.setState({searchResults: response.data.results });
                        }
                        self.toggleSpinner(false);
                    });  
                } 
            }
        }
        catch(ex){
            console.log("[Error] searching students: ",ex);
            self.toggleSpinner(false);
        }
    }

    getStudentInfo(id){
        var self = this;
        try {
            if(id.length <= 0){
                self.setState({ error: "DB Id is not valid please contact site admin" });
            }
            else {
                var sessionInfo = localStorage.getItem(self.props.mySessKey);
                self.toggleSpinner(true);

                if(sessionInfo) {
                    var localUser = JSON.parse(sessionInfo);

                    var postData = { 
                        requestUser: { _id: localUser._id}, 
                        userInfo: { _id: id, full: true} 
                    };
                    axios.post(self.props.rootPath + "/api/getUserById", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.data.errorMessage){
                            self.setState({ error: response.data.errorMessage, selectedUser: {}, updateType:null });
                        }
                        else {
                            var student = response.data.results;
                            self.setState({ updateType: "update", 
                                selectedUser:{
                                    firstname:student.firstname, lastname:student.lastname, email:student.email, 
                                    address:student.address, phone: student.phone || "", admin:student.admin,
                                    military: student.military, studentInfo:student.studentInfo, gpa: (student.studentInfo ? student.studentInfo.gpa : 0),
                                    degree:student.degree, _id:student._id, studentId:student.studentId || "", 
                                    accountId:student.accountId || "", talentlmsId:student.talentlmsId
                                }
                            }, () => {
                                // Load Student Course Info
                                if(self.state.selectedUser.talentlmsId.id) {
                                    self.loadStudentCourses(self.state.selectedUser.talentlmsId.id);
                                }
                                if(self.state.selectedUser._id) {
                                    self.loadAccountInfo(self.state.selectedUser._id);
                                }
                            });
                        }
                        self.toggleSpinner(false);
                    });  
                } 
            }
        }
        catch(ex){
            console.log("[Error] getting student: ",ex);
            self.toggleSpinner(false);
        }
    }
    onElementChange(e){
        var self = this;
        try {
            var tmpData = this.state.selectedUser;
            var name = e.target.name;

            if(name in tmpData) {
                tmpData[name] = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
                self.setState({ selectedUser:tmpData });
            }
        }
        catch(ex){
            console.log("Error changing element: ",ex);
        }
    }

    majorSelectChange(item) {
        try {           
            var degreeTitle =  (item.degreeTitle ? item.degreeTitle:"") +" "+(item.subtitle ? item.subtitle +" - ":"") + item.title;
            
            var tmpStudent = this.state.selectedUser;
            tmpStudent.degree = { school:item.area, code:item.id, major:degreeTitle, level: item.degree, declareDate: new Date()};
            this.setState({ selectedUser: tmpStudent });
        }
        catch(ex){
            console.log("Error with Major select change: ",ex);
        }
    }

    toggleFilter(type,id){
        var self = this;
        try {
            var tmpList = this.state[type];
            tmpList[id].status = !tmpList[id].status;

            this.setState({ [type]:tmpList }, ()=> {
                self.degreeSearch();
            });
        }
        catch(ex){
            console.log("Error toggling filter: ",ex);
        }
    }

    buildFilterList(){
        try {
            var self = this;
            if(academicData) {
                var areaInit = Object.keys(academicData);
                var degreeKey = {};
                var tmpDegree = [];
                var tmpArea = [];

                areaInit.forEach(function(item){
                    tmpArea.push({ idLink:item, title:academicData[item].title, colorTheme: academicData[item].colorTheme, status: false });
                    var degreeInit = Object.keys(academicData[item].degrees);
                    degreeInit.forEach(function(dItem){
                        degreeKey[dItem] = true;
                    });
                });

                Object.keys(degreeKey).forEach(function(item){
                    tmpDegree.push({title:item, status: false });
                });

                this.setState({ degreeList: tmpDegree, areaList:tmpArea });
            }
        }
        catch(ex){
            console.log("Error Building Filder List: ", ex);
        }
    }

    degreeSearch(){
        var self = this;
        try {
            var retList = [];
            var activeAreaFilter = this.state.areaList.filter(function(x) { return x.status === true; });
            var activeDegreeFilter = this.state.degreeList.filter(function(x) { return x.status === true; });

            activeAreaFilter = ((!activeAreaFilter || activeAreaFilter.length <= 0) && activeDegreeFilter.length > 0 ? this.state.areaList : activeAreaFilter);
            activeDegreeFilter = ((!activeDegreeFilter || activeDegreeFilter.length <= 0) && activeAreaFilter.length > 0 ? this.state.degreeList : activeDegreeFilter);

            activeAreaFilter.forEach(function(area){
                var tmpArea = academicData[area.idLink];
                activeDegreeFilter.forEach(function(degree){
                    var tmpDegree = tmpArea.degrees[degree.title];
                    if(tmpDegree){
                        tmpDegree.forEach(function(major){
                            var areaUrlTitle = area.title.replace(/([&\/\\()])/g,"_").split(' ').join("").toLowerCase();
                            var url = areaUrlTitle+"-"+major.title;

                            if(major.concentrations && major.concentrations.length > 0){
                                major.concentrations.forEach(function(concentration) {
                                    retList.push({id:major.id, title:major.title, subtitle:concentration.title, theme:area.colorTheme, degreeTitle:major.degreeTitle, degree: degree.title, area: area.title, url: url});
                                });
                            }

                            if(major.specialization && major.specialization.length > 0){
                                major.specialization.forEach(function(specialization) {
                                    retList.push({id:major.id, title:major.title, subtitle:specialization.title, theme:area.colorTheme, degreeTitle:major.degreeTitle, degree: degree.title, area: area.title, url: url});
                                });
                            }                            
                            retList.push({id:major.id, title:major.title, degreeTitle: major.degreeTitle, theme:area.colorTheme, degree: degree.title, area: area.title, url: url});                                                      
                        });
                    }
                });
            });

            this.setState({ majorResults: retList.sort(function(a,b){ return (a.title.toUpperCase() < b.title.toUpperCase() ? -1 : 1)}) });
        }
        catch(ex){
            console.log("Error With Degree Search: ", ex);
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

    getCourseInfo(type, id){
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

    queueCourse(newCourse){
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
            alert("Error queueing course: ",ex);
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

    unregisterCourseList(course){
        var self = this;
        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);
            if(sessionInfo){ 
                var localUser = JSON.parse(sessionInfo);

                self.toggleSpinner(true);

                var postData = { requestUser: { _id: localUser._id}, userInfo: { studentId: self.state.selectedUser.studentId, talentlmsId: self.state.selectedUser.talentlmsId }, courseInfo:course };

                axios.post(self.props.rootPath + "/api/courseUnregister", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert("Unable to unregister student for the following courses: " + response.data.errorMessage);
                    }
                    else {
                        self.loadStudentCourses(self.state.selectedUser.talentlmsId.id);
                    }
                });  
            }
        }
        catch(ex){
            console.log("Error unregistering course: ",ex);
        }
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
                    var postData = { requestUser: { _id: localUser._id}, userInfo: { studentId: self.state.selectedUser.studentId, talentlmsId: self.state.selectedUser.talentlmsId }, courseInfo:course };

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
                                self.loadStudentCourses(self.state.selectedUser.talentlmsId.id);
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

    loadAccountInfo(_id){
        var self = this;

        try {
            var sessionInfo = localStorage.getItem(this.props.mySessKey);

            if(sessionInfo){ 
                var localUser = JSON.parse(sessionInfo);
                var postData = { requestUser: { _id: localUser._id}, userInfo: { _id: _id} };

                self.toggleSpinner(true);

                axios.post(self.props.rootPath + "/api/searchUserTransactions", postData, {'Content-Type': 'application/json'})
                .then(function(response) {
                    if(response.data.errorMessage){
                        alert("Error retreiving user transactions: ", response.errorMessage);
                    }
                    else {
                        var accountTransactions = response.data.results.filter(function(item){
                            return item.errorMessage == null;
                        }).map(function(item){
                            return item.results;
                        })
                        .sort(function(a,b){
                            return new Date(b.submitTime) - new Date(a.submitTime);
                        });

                        self.setState({ accountTransactions: accountTransactions}, ()=> { self.toggleSpinner(false); });
                    }
                });   
            }
            else {
                
            }
        }
        catch(ex){
            alert("[Error] Loading Student Account Info: ", ex);
            self.toggleSpinner(false);
        }
    }
}

export default MyAdmin;
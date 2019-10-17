import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import withFixedColumns from 'react-table-hoc-fixed-columns';

import "react-table/react-table.css";
import 'react-table-hoc-fixed-columns/lib/styles.css';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

var courseColumns = [    
    { Header: 'Course Code', accessor: 'courseCode', fixed: 'left' },
    { Header: 'Course Id', accessor: 'courseId', fixed: 'left' },
    { Header: 'Course Name', accessor: 'name', fixed: 'left' },
    { Header: 'Credits', accessor: 'credits', fixed: 'left' }
];

/* Body */
class MyCourses extends Component{
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            studentInfo:{ degree: "", class:"", gpa:0, fulltime:false },
            currentCourses:[],
            courseSearch:[]
        }

        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.loadStudentInfo = this.loadStudentInfo.bind(this);
        this.loadCourses = this.loadCourses.bind(this);
    }

    componentDidMount(){ 
        this.loadStudentInfo();
        this.loadCourses();
    }

    render(){   
        var filterData = this.state.courseSearch;

        return(
            <div className="mylgcu-course">
               {/* Spinner */}
               {this.state.spinner && <div className="spinner"><i className="fas fa-cog fa-spin"/><span>Loading</span></div> }

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
                                        <th>Course Type</th>
                                        <th>Course Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.currentCourses.map((item, i) =>(
                                        <tr key={i} className="dataRow">
                                            <td><span className="courseNumber">{i+1}</span></td>
                                            <td><span className="courseCode">{item.name}</span></td>
                                            <td><span className="courseTitle"></span></td>
                                            <td></td>
                                        </tr>
                                    ))}

                                    {this.state.currentCourses.length == 0 && 
                                        <tr className="noDataRow">
                                            <td colSpan="4">No Courses Added</td>
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
                        <ReactTableFixedColumns data={filterData} columns={courseColumns}></ReactTableFixedColumns>
                    </div>
                </div>
            </div>
        );
    }

    toggleSpinner(status){
        this.setState({ spinner: status });
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
                                            gpa: userInfo.studentInfo.gpa,  fulltime: (userInfo.studentInfo.fulltime == true)};
                        self.setState({ studentInfo: tmpStudent });
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
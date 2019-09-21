import React, { Component } from 'react';
import axios from 'axios';

/* Data */
import academicData from '../../data/academics.json';

/* Body */
class MyAdmin extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: "",
            searchResults:[],
            selectedUser: {
                firstname:"", lastname:"",  email:"", address:"",
                degree:{ school:"", code:"", major:"", declareDate: null },
                studentId:null, accountId:null, talentlmsId:null
            },
            degreeList:[], areaList:[], majorResults:[],
            updateType:null
        }

        this.onElementChange = this.onElementChange.bind(this);
        this.buildFilterList = this.buildFilterList.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.majorSelectChange = this.majorSelectChange.bind(this);
        this.newStudent = this.newStudent.bind(this);
        this.clearStudentForm = this.clearStudentForm.bind(this);
        this.selectStudent = this.selectStudent.bind(this);
        this.getStudentInfo = this.getStudentInfo.bind(this);
        this.searchQuery = this.searchQuery.bind(this);
    }

    componentDidMount(){
        this.buildFilterList();
    }

    render(){   
        const filteredResults = this.state.majorResults;

        return(
            <div className="mylgcu-admin">
                {/* Search Section */}
                <div className="mylgcu-content-section inverse">
                    <div className="section-title">Student Search</div>

                    <div className="content-block sz9">
                        <div className="block-label-title">Search</div>
                        <div className="block-container">                            
                            <div className="content-info icon"><i className="fas fa-search"></i><input type="text" name="searchQuery" className="" placeholder="Search Name, Email, or Student ID" value={this.state.searchQuery} onChange={(e) => this.onSearchChange(e)}/></div>
                        </div>
                    </div>

                    <div className="content-block search-container sz1">                          
                        <div className="search-btn" onClick={this.searchQuery}><i className="btn-icon fas fa-search"></i></div>
                    </div>
                </div>

                <div className="mylgcu-content-section addUser">
                    <div className="btn-container">
                        <div className="lBtn c2" onClick={this.newStudent}><span>New Student</span><i className="btn-icon fas fa-user-plus"></i></div>
                    </div> 
                </div>

                {/* Results Section */}                
                {this.state.searchQuery.length > 0 &&
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
                    <div className="mylgcu-content-section inverse">
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

                        {/* IDs */}
                        <div className="content-block sz3">
                            <div className="block-label-title">Student ID:</div>
                            <div className="block-container">                            
                                <div className="content-info generator">
                                    <span className="IdGenerator"><i className="fas fa-recycle"></i></span>
                                    <input type="text" name="studentId" className="" placeholder="Student id" value={this.state.selectedUser.studentId} readOnly/>
                                </div>
                            </div>
                        </div>

                        <div className="content-block sz3">
                            <div className="block-label-title">Acccount ID:</div>
                            <div className="block-container">                            
                                <div className="content-info generator">
                                    <span className="IdGenerator"><i className="fas fa-recycle"></i></span>
                                    <input type="text" name="accountId" className="" placeholder="Account id" value={this.state.selectedUser.accountId} readOnly/>
                                </div>
                            </div>
                        </div>

                        <div className="content-block sz3">
                            <div className="block-label-title">TalentLMS ID:</div>
                            <div className="block-container">                            
                                <div className="content-info generator">
                                    <span className="IdGenerator"><i className="fas fa-recycle"></i></span>
                                    <input type="text" name="talentlmsId" className="" placeholder="Talentlms id" value={this.state.selectedUser.talentlmsId.id + " | "+this.state.selectedUser.talentlmsId.login} readOnly/>
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
                                <div className="content-block sz4">
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
                    </div>
                }
            </div>
        );
    }

    selectStudent(studentid){
        var self = this;
        try{
            if(this.state.updateType != null){
                // Alert
                if(window.confirm("Do you want to select this student, all of your unsaved work will be lost?")) {
                    // Clear form 
                    self.clearStudentForm(function(){ 
                        // Add Loading Animation                        
                        // Get Student Information
                        self.getStudentInfo(studentid);
                    });
                }                                
            }
            else {
                this.clearStudentForm(function(){ 
                    // Add Loading Animation
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
                    // Clear form begin new student
                    self.clearStudentForm(function(){ self.setState({ updateType: "new" }); });
                }                                
            }
            else {
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
            
            this.setState({ selectedUser:{firstname:"", lastname:"",  email:"", address:"", 
                degree:{ school:"", code:"", major:"", declareDate: null },  
                studentId:null, accountId:null, talentlmsId:{}}}, ()=> {callback(); });
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
    searchQuery(){
        var self = this;
        try {
            var query = this.state.searchQuery;

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
                    });  
                } 
            }
        }
        catch(ex){
            console.log("[Error] searching students: ",ex);
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
                                    address:student.address, phone: student.phone, admin:student.admin,
                                    degree:student.degree, _id:student._id, studentId:student.studentId, 
                                    accountId:student.accountId, talentlmsId:student.talentlmsId
                                }
                            });
                        }
                    });  
                } 
            }
        }
        catch(ex){
            console.log("[Error] getting student: ",ex);
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
            tmpStudent.degree = { school:item.area, code:item.id, major:degreeTitle, declareDate: new Date()};
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
}

export default MyAdmin;
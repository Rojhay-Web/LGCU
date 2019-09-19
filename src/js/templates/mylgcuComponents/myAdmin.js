import React, { Component } from 'react';

/* Data */
import academicData from '../../data/academics.json';

/* Body */
class MyAdmin extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: "",
            searchResults:[
                {_id:"abc123", id:"3001001", name:"Tony Wilson"}, {_id:"xyz123", id:"3001002", name:"Jason Warrick"},
                {_id:"abc456", id:"3001003", name:"Adrian Henkerson"}, {_id:"xyz456", id:"3001004", name:"Dak Prescott"},
                {_id:"abc789", id:"3001005", name:"Alvin Kamara"}, {_id:"xyz789", id:"3001006", name:"Ben Rothlisberger"},
                {_id:"abc012", id:"3001007", name:"Cameron Newton"}, {_id:"xyz012", id:"3001008", name:"Will Smith"},
                {_id:"abc345", id:"3001009", name:"Mya Reed"}, {_id:"xyz345", id:"3001010", name:"Diangelo Russel"},
                {_id:"abc678", id:"3001011", name:"Nancy Drew"}, {_id:"xyz678", id:"3001012", name:"Erika Coleman"},
                {_id:"abc901", id:"3001013", name:"Tony Wilson"}, {_id:"xyz901", id:"3001014", name:"Jason Rowe"},
                {_id:"abc234", id:"3001015", name:"Jack Wilson"}, {_id:"xyz234", id:"3001016", name:"Will Turner"},
                {_id:"abc567", id:"3001017", name:"Andrew Phillips"}, {_id:"xyz567", id:"3001018", name:"Felica Coliver"}
            ],
            selectedUser: {
                firstName:"", lastName:"",  email:"", address:"",
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

                    <div className="content-block sz10">
                        <div className="block-label-title">Search</div>
                        <div className="block-container">                            
                            <div className="content-info icon"><i className="fas fa-search"></i><input type="text" name="searchQuery" className="" placeholder="Search Name Or Student ID" value={this.state.searchQuery} onChange={(e) => this.onSearchChange(e)}/></div>
                        </div>
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
                                    <div key={i} className="result-item" onClick={(e) => this.selectStudent(item.id)}>
                                        <div className="user-icon"><i className="far fa-user"/></div>
                                        <div className="user-info">
                                            <div className="info-name">{item.name}</div>
                                            <div className="info-id">{item.id}</div>
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
                                <div className="content-info"><input type="text" name="firstName" className="" placeholder="First Name" value={this.state.selectedUser.firstName} onChange={(e) => this.onElementChange(e)}/></div>
                            </div>
                        </div>

                        <div className="content-block sz3">
                                <div className="block-label-title">Last Name:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="lastName" className="" placeholder="Last Name" value={this.state.selectedUser.lastName} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                        </div>

                        <div className="content-block sz4">
                                <div className="block-label-title">Email:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="email" className="" placeholder="Email" value={this.state.selectedUser.email} onChange={(e) => this.onElementChange(e)}/></div>
                                </div>
                        </div>

                        <div className="content-block sz10">
                                <div className="block-label-title">Address:</div>
                                <div className="block-container">                            
                                    <div className="content-info"><input type="text" name="address" className="" placeholder="Address" value={this.state.selectedUser.address} onChange={(e) => this.onElementChange(e)}/></div>
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
                                        <div className="content-info">{this.state.selectedUser.degree.school}</div>
                                    </div>
                                </div>

                                <div className="content-block sz4">
                                    <div className="block-label-title">Degree Major:</div>
                                    <div className="block-container">                            
                                        <div className="content-info">{this.state.selectedUser.degree.major}</div>
                                    </div>
                                </div>

                                <div className="content-block sz2">
                                    <div className="block-label-title">Degree ID:</div>
                                    <div className="block-container">                            
                                        <div className="content-info">{this.state.selectedUser.degree.code}</div>
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
                        self.setState({ updateType: "update" });
                        // Get Student Information
                        self.setState({ selectedUser:{firstName:"Tony", lastName:"James",  email:"t.James@gmail.com", address:"123 test street, wilmington, DE. 19711", 
                            degree:{ school:"Education", code:"BA-BA", major:"Business Administration", declareDate: null },  
                            studentId:"30010001", accountId:"456", talentlmsId:"123"}});
                    });
                }                                
            }
            else {
                this.clearStudentForm(function(){ 
                    self.setState({ updateType: "update" });
                    // Get Student Information
                    self.setState({ selectedUser:{firstName:"Tony", lastName:"James",  email:"t.James@gmail.com", address:"123 test street, wilmington, DE. 19711", 
                            degree:{ school:"Education", code:"BA-BA", major:"Business Administration", declareDate: null },  
                            studentId:"30010001", accountId:"456", talentlmsId:"123"}});
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
            
            this.setState({ selectedUser:{firstName:"", lastName:"",  email:"", address:"", 
                degree:{ school:"", code:"", major:"", declareDate: null },  
                studentId:null, accountId:null, talentlmsId:null}}, ()=> {callback(); });
        }
        catch(ex){
            console.log("[Error] clearing form: ",ex);
        }
    }

    onSearchChange(e){
        var self = this;
        try {
            var name = e.target.name;
            self.setState({ [name]: e.target.value }, () =>{
                self.searchQuery(self.state.searchQuery);
            });
        }
        catch(ex){
            console.log("[Error] changing search: ",ex);
        }
    }
    searchQuery(query){
        try {

        }
        catch(ex){
            console.log("[Error] searching students: ",ex);
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
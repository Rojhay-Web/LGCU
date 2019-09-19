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
                {id:"3001001", name:"Tony Wilson"}, {id:"3001002", name:"Jason Warrick"},
                {id:"3001003", name:"Adrian Henkerson"}, {id:"3001004", name:"Dak Prescott"},
                {id:"3001005", name:"Alvin Kamara"}, {id:"3001006", name:"Ben Rothlisberger"},
                {id:"3001007", name:"Cameron Newton"}, {id:"3001008", name:"Will Smith"},
                {id:"3001009", name:"Mya Reed"}, {id:"3001010", name:"Diangelo Russel"},
                {id:"3001011", name:"Nancy Drew"}, {id:"3001012", name:"Erika Coleman"},
                {id:"3001013", name:"Tony Wilson"}, {id:"3001014", name:"Jason Rowe"},
                {id:"3001015", name:"Jack Wilson"}, {id:"3001016", name:"Will Turner"},
                {id:"3001017", name:"Andrew Phillips"}, {id:"3001018", name:"Felica Coliver"}
            ],
            selectedUser: {
                firstName:"", lastName:"",  email:"", address:"",
                degree:{ school:"", code:"", major:"", declareDate: null },
                studentId:null, accountId:null, talentlmsId:null
            },
            degreeList:[], areaList:[], majorResults:[]
        }

        this.onElementChange = this.onElementChange.bind(this);
        this.buildFilterList = this.buildFilterList.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.majorSelectChange = this.majorSelectChange.bind(this);
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
                            <div className="content-info icon"><i className="fas fa-search"></i><input type="text" name="search" className="" placeholder="Search Name Or Student ID" value={this.state.searchQuery} onChange={(e) => this.onSearchChange(e)}/></div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="mylgcu-content-section">
                    <div className="section-title">Search Results <span>({this.state.searchResults.length} results)</span></div>

                    <div className="results-container">
                        <div className="results-subcontainer">
                            {this.state.searchResults.map((item,i) =>
                                <div key={i} className="result-item">
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

                {/* Student Section*/}
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
            </div>
        );
    }

    onSearchChange(e){
        var self = this;
        try {
            var name = e.target.name;
            self.setState({ [name]: e.target.value });
        }
        catch(ex){
            console.log("Error changing search: ",ex);
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
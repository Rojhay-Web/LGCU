import React, { Component } from 'react';
import axios from 'axios';

/* Data */
import academicData from '../../data/academics.json';


var rootPath = "";
//var rootPath = "http://localhost:1111";

class StudentApp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedSection:"ApplicationInfo",
            sectionsTypes:{
                "ApplicationInfo":{status:false, fields:["firstName","middleName","lastName","email","address","city","state","postal","dayphone","eveningphone","mobilephone","ssn","driverlicense"]},
                "EContactInfo":{status:false, fields:["emergencyname","emergencyrelationship","emergencyphone","emergencyaddress","emergencycity","emergencystate","emergencypostal"]},
                "DegreeInfo":{status:false, fields:["degreeType","veteran","veteranbranch","veteranskill"]},
                "EduEmpHistory":{status:false, fields:["highestdegree","otherdegrees","employmenthistory"]}
            },
            applicationId:null,
            majorResults:[],
            degreeList:[],
            sendAddress:"admin@lenkesongcu.org",
            form: {
                firstName:{"title":"First Name","required":true, "value":""},
                middleName:{"title":"Middle Name","required":false, "value":""},
                lastName:{"title":"Last Name","required":true, "value":""},
                email:{"title":"Email","required":true, "validation":"email", "value":""},
                address:{"title":"Address","required":true, "value":""},
                city:{"title":"City","required":true, "value":""},
                state:{"title":"State","required":true, "value":""},
                postal:{"title":"Postal Code","required":true, "value":""},
                dayphone:{"title":"Daytime Phone","required":true, "value":""},
                eveningphone:{"title":"Evening Phone","required":false, "value":""},
                mobilephone:{"title":"Mobile Phone","required":false, "value":""},
                ssn:{"title":"Social Security Number","required":true, "value":""},
                driverlicense:{"title":"Drivers License","required":false, "value":""},

                emergencyname:{"title":"Emergency Contact Name","required":true, "value":""},
                emergencyrelationship:{"title":"Emergency Contact Relationship","required":false, "value":""},
                emergencyphone:{"title":"Emergency Contact Phone","required":true, "value":""},
                emergencyaddress:{"title":"Emergency Contact Address","required":false, "value":""},
                emergencycity:{"title":"Emergency Contact City","required":false, "value":""},
                emergencystate:{"title":"Emergency Contact State","required":false, "value":""},
                emergencypostal:{"title":"Emergency Contact Postal Code","required":false, "value":""},

                degreeType:{"title":"Degree Type","required":true, "value":""},
                veteran:{"title":"Are You A US Veteran","required":true, "toggle":true, "value":false},
                veteranbranch:{"title":"Branch","required":false, "value":""},
                veteranskill:{"title":"Specific Skills Acquired","required":false, "value":""},

                highestdegree:{"title":"Highest Degree Earned","required":true, "value":""},
                otherdegrees:{"title":"Other Degrees","required":false, "value":""},
                employmenthistory:{"title":"Employment History","required":true, "value":""},
            }
        }

        this.buildFilterList = this.buildFilterList.bind(this);
        this.onElementChange = this.onElementChange.bind(this);
        this.changeSelectedSection = this.changeSelectedSection.bind(this);
        this.isLastSection = this.isLastSection.bind(this);
        this.nextSection = this.nextSection.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    componentDidMount(){
        var self = this;
        this.setState({selectedSection:"ApplicationInfo"},() =>{
            self.buildFilterList();
        });        
    }

    render(){       
        var self = this; 
        const filteredResults = this.state.majorResults;

        return(
            <div className="studentAppForm">
                <div className="form-nav">
                    <div className={"form-nav-item" + (this.state.selectedSection == "ApplicationInfo" ? " active":"") + (this.state.sectionsTypes.ApplicationInfo.status ? " completed":"")} onClick={(e)=> this.changeSelectedSection("ApplicationInfo",false)}><i className="nav-icon fas fa-user-edit" /></div>
                    <div className={"form-nav-item" + (this.state.selectedSection == "EContactInfo" ? " active":"") + (this.state.sectionsTypes.EContactInfo.status ? " completed":"")} onClick={(e)=> this.changeSelectedSection("EContactInfo",false)}><i className="nav-icon fas fa-id-card" /></div>
                    <div className={"form-nav-item" + (this.state.selectedSection == "DegreeInfo" ? " active":"") + (this.state.sectionsTypes.DegreeInfo.status ? " completed":"")} onClick={(e)=> this.changeSelectedSection("DegreeInfo",false)}><i className="nav-icon fas fa-user-graduate" /></div>
                    <div className={"form-nav-item" + (this.state.selectedSection == "EduEmpHistory" ? " active":"") + (this.state.sectionsTypes.EduEmpHistory.status ? " completed":"")} onClick={(e)=> this.changeSelectedSection("EduEmpHistory",false)}><i className="nav-icon fas fa-history" /></div>
                </div>
                <div className="form-container">
                    {this.state.selectedSection == "ApplicationInfo" && 
                        <div className="form-section-container">
                            <h2>Applicant Information</h2>
                            <div className="form-element sz-3"><span>First Name *</span><input type="text" name="firstName" className="" placeholder="First Name" value={this.state.form.firstName.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-3"><span>Middle Name</span><input type="text" name="middleName" className="" placeholder="Middle Name" value={this.state.form.middleName.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-4"><span>Last Name *</span><input type="text" name="lastName" className="" placeholder="Last Name" value={this.state.form.lastName.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-10"><span>Email *</span><input type="text" name="email" className="" placeholder="Email" value={this.state.form.email.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-10"><span>Address *</span><input type="text" name="address" className="" placeholder="Address" value={this.state.form.address.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-5"><span>City *</span><input type="text" name="city" className="" placeholder="City" value={this.state.form.city.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-2"><span>State *</span><input type="text" name="state" className="" placeholder="State" value={this.state.form.state.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-3"><span>Postal Code *</span><input type="text" name="postal" className="" placeholder="Postal Code" value={this.state.form.postal.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-3"><span>Daytime Phone *</span><input type="text" name="dayphone" className="" placeholder="Daytime Phone" value={this.state.form.dayphone.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-3"><span>Evening Phone</span><input type="text" name="eveningphone" className="" placeholder="Evening Phone" value={this.state.form.eveningphone.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-4"><span>Mobile Phone</span><input type="text" name="mobilephone" className="" placeholder="Mobile Phone" value={this.state.form.mobilephone.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-5"><span>Social Security Number *</span><input type="text" name="ssn" className="" placeholder="Social Security Number" value={this.state.form.ssn.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-5"><span>Drivers License</span><input type="text" name="driverlicense" className="" placeholder="Drivers License" value={this.state.form.driverlicense.value} onChange={(e) => this.onElementChange(e)}/></div>
                        </div> 
                    }
                    {this.state.selectedSection == "EContactInfo" && 
                        <div className="form-section-container">
                            <h2>Emergency Contact Information</h2>
                            <div className="form-element sz-5"><span>Name *</span><input type="text" name="emergencyname" className="" placeholder="Name" value={this.state.form.emergencyname.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-3"><span>Relationship</span><input type="text" name="emergencyrelationship" className="" placeholder="Relationship" value={this.state.form.emergencyrelationship.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-2"><span>Phone Number *</span><input type="text" name="emergencyphone" className="" placeholder="Phone Number" value={this.state.form.emergencyphone.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-10"><span>Address</span><input type="text" name="emergencyaddress" className="" placeholder="Address" value={this.state.form.emergencyaddress.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-5"><span>City</span><input type="text" name="emergencycity" className="" placeholder="City" value={this.state.form.emergencycity.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-3"><span>State</span><input type="text" name="emergencystate" className="" placeholder="State" value={this.state.form.emergencystate.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-2"><span>Postal Code</span><input type="text" name="emergencypostal" className="" placeholder="Postal Code" value={this.state.form.emergencypostal.value} onChange={(e) => this.onElementChange(e)}/></div>
                        </div>
                    }

                    {this.state.selectedSection == "DegreeInfo" && 
                        <div className="form-section-container">
                            <h2>Degree Information</h2>
                            {/* Degree Info */}
                            <div className="degree-container">
                                <div className="full-list-container">  
                                    <div className="form-element sz-10"><span>Degree Choice *</span></div>                                                                      
                                    <div className="list-container">
                                            {this.state.degreeList.map((item,i) => (
                                                <div key={i} className={"filterBtn degreeItem " + (item.status ? " active":"")} onClick={()=> this.toggleFilter("degreeList",i)}>
                                                    <i className={"far "+ (item.status ? "fa-check-circle": "fa-circle")}></i>
                                                    <span>{item.title}</span>                                
                                                </div>
                                            ))}
                                    </div>
                                    <div className="form-element sz-10"><input type="text" name="degreeType" className="disabled" placeholder="" value={this.state.form.degreeType.value} disabled/></div>
                                </div>
                                
                                {this.state.majorResults.length > 0 &&
                                    <div className="result-search-container">
                                        <div className="results-list">                          
                                            <div className="results-container">
                                                {filteredResults.map((item,i) =>(
                                                    <div className={"result-item " + item.theme } key={i} onClick={(e) => this.majorSelectChange("degreeType", item)}>
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

                            <div className="form-element sz-3"><span>Veteran Status *</span><div className="form-checkbox" placeholder="I am a US veteran" value={this.state.form.veteran.value}><input type="checkbox" name="veteran" onChange={(e) => this.onElementChange(e)}/><label>Are You A US Veteran</label></div></div>
                            <div className="form-element sz-7"><span>Branch</span><input type="text" name="veteranbranch" className="" placeholder="Branch" value={this.state.form.veteranbranch.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-10"><span>Specific Skills Acquired</span><textarea type="text" name="veteranskill" className="" placeholder="Specific Skills Acquired" value={this.state.form.veteranskill.value} onChange={(e) => this.onElementChange(e)}/></div>
                        </div> 
                    }
                    {this.state.selectedSection == "EduEmpHistory" && 
                        <div className="form-section-container">
                            <h2>Previous Educational/Employment Experience</h2>
                            <div className="form-element sz-10"><span>Highest Degree Earned *</span><input type="text" name="highestdegree" className="" placeholder="Highest Degree Earned" value={this.state.form.highestdegree.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-10"><span>Other Degrees Earned</span><textarea type="text" name="otherdegrees" className="" placeholder="Other Degrees Earned" value={this.state.form.otherdegrees.value} onChange={(e) => this.onElementChange(e)}/></div>
                            <div className="form-element sz-10">
                                <span>List employment history for the past 5 years without any gap. Include the following information for each *: </span>
                                <ul>
                                    <li>Employer Name</li>
                                    <li>Employer Address</li>
                                    <li>Total Years Of Employment</li>
                                    <li>Name of Supervisor</li>
                                    <li>Emplorer Phone Number</li>
                                    <li>Why did you leave?</li>
                                </ul>
                                <textarea type="text" name="employmenthistory" className="" placeholder="Employment History" value={this.state.form.employmenthistory.value} onChange={(e) => this.onElementChange(e)}/>
                            </div>
                            
                            <p className="form-info">Please submit via email at admin@lenkesongcu.org copies of unofficial transcripts, Curriculum Vitae or resume. If offered admissions, official transcripts will be required. Official State issued government identifications will be required if admission is offered. All required documents must be submitted to the Admissions Office before registering for classes. For more information regarding admissions requirements, please log into the University Website www.lenkesongcu.org and click on admissions. Please read and sign the Certification of Application and Non-Discrimination Policy below.</p>       
                            <h3 className="lrgTitle ctr" data-text="CERTIFICATION OF APPLICATION">CERTIFICATION OF APPLICATION</h3>
                            <p className="form-info">I certify that all information provided on this application is accurate. I understand that if I provide false information to Lenkeson Global Christian University, no employment will be offered. This is also cause for termination.</p>
                            <p className="form-info">I authorize Lenkeson Global Christian University to contact educational institutions that I attended and former/current employers to release information regarding enrollment, graduation and job performance. Furthermore, I authorize Lenkeson Global Christian University to contact references listed on the job application to release information about me.</p>
                            <h3 className="lrgTitle ctr" data-text="NON-DISCRIMINATION POLICY">NON-DISCRIMINATION POLICY</h3>
                            <p className="form-info">Lenkeson Global Christian University is a Christ-centered institution of higher learning and is committed to provide cutting-edge academic education to men and women without discriminating against any individual on the basis of gender, race, color, religion, national origin, and intellectually and physically challenged individuals. However, the university reserves the right to refuse admission to persons or hire faculty or staff who do not support its values. LGCU is an equal opportunity employer.</p>                                                                                
                        </div> 
                    }

                    {this.state.selectedSection == "submitted" && 
                        <div className="form-section-container submitted">
                            <h2>You Are Almost Finished</h2>
                            <p>Your Lenkeson Global Christian University student application has been submitted, to complete your application you must send in your $50.00 application fee payment.</p>
                            <p>Please click the following link to submit your application fee right now: <span className="idLink" onClick={e => this.props.appFeeForm(this.state.applicationId)}>Application Fee</span></p>
                            <p>If you are not prepared to submit you application fee right now please use the following steps:</p>
                            <ul>
                                <li>Navigate to the lenkesongcu.org apply page</li>
                                <li>Click the link for "Application Fee Submissions"</li>
                                <li>Complete the payment using your application id: <span className="appId">{this.state.applicationId}</span> This number will also be emailed to you with your application confirmation.</li>
                            </ul>

                            <a href="/apply" className="lBtn c1"><span>Finish Later</span><i className="btn-icon fas fa-clipboard-check"></i></a>
                        </div> 
                    }
                </div>

                <div className="form-btn-container">
                    {this.state.selectedSection !== "submitted" && (this.isLastSection()
                    ? <div className="lBtn c2" onClick={this.nextSection}><span>Next Section</span><i className="btn-icon far fa-arrow-alt-circle-right"></i></div>
                    : <div className="lBtn c1" onClick={this.submitForm}><span>Submit Form</span><i className="btn-icon fas fa-paper-plane"></i></div>
                    )}
                </div>                
            </div>
        );
    }

    majorSelectChange(name, item) {
        try {           
            var degreeTitle =  item.degree +(item.degreeTitle ? item.degreeTitle:"") +": "+(item.subtitle ? item.subtitle +" - ":"") + item.title;
            this.onElementChange({ target:{name:name, type:"input", value: degreeTitle}});
        }
        catch(ex){
            console.log("Error with Major select change: ",ex);
        }
    }

    isLastSection(){
        var ret = false;
        var self = this;
        try {            
            var tmpSections = Object.keys(this.state.sectionsTypes);
            var curLoc = tmpSections.indexOf(this.state.selectedSection);

            ret = curLoc < tmpSections.length - 1;
        }
        catch(ex){
            console.log("Error checking if last section is active: ",ex);
        }
        return ret;
    }
    onElementChange(event){
        var self = this;
        try {
            var tmpData = this.state.form;
            var name = event.target.name;

            if(name in tmpData) {
                tmpData[name].value = (event.target.type === 'checkbox' ? event.target.checked : event.target.value);
                self.setState({ form:tmpData });
            }
        }
        catch(ex){
            console.log("Error changing element: ",ex);
        }
    }
    submitForm() {
        var self = this;

        try {
            this.validateSection("all",function(ret){
                if(ret){
                    // Send Email
                    var postData = { 
                        email: self.state.sendAddress, 
                        subject:"Student Application Form", 
                        title: "Student Application", 
                        formData: self.state.form
                    
                    };

                    axios.post(rootPath + "/api/sendAppEmail", postData, {'Content-Type': 'application/json'})
                    .then(function(response) {
                        if(response.errorMessage == null && response.data.results.status === "Email Sent"){
                            self.setState({ selectedSection:"submitted", applicationId: response.data.results.appId}, ()=> {
                                self.props.appFeeForm(response.data.results.appId);
                            });                         
                        }
                        else {
                            alert("Error Submitting Form");
                            console.log("[Error] Submitting Form: ", response.data.errorMessage);
                        }
                    });                               
                }
            }); 
        }
        catch(ex){
            console.log("Error submitting form: ", ex);
        }
    }

    clearForm(){
        var self = this;
        try {
            var tmpForm = self.state.form;
            var formLbls = Object.keys(self.state.form);
            // Clear Fields
            formLbls.forEach(function(item){
                formLbls[item].value = (formLbls[item].toggle ?  false : "");
            });
            // Reset Pages 
            var tmpSectionTypes = self.state.sectionsTypes;
            var tmpTypes = Object.keys(self.state.sectionsTypes);

            tmpTypes.forEach(function(item){
                tmpSectionTypes[item].status = false;
            });
            // Set Start Location
            this.setState({form: tmpForm, sectionsTypes:tmpSectionTypes, selectedSection:"ApplicationInfo"});
        }
        catch(ex){
            console.log("Error clearing form: ", ex);
        }
    }

    nextSection(){
        var self = this;
        try {
            var allSections = Object.keys(this.state.sectionsTypes);
            var curSection = this.state.selectedSection;
            var curLoc = allSections.indexOf(curSection);
            if(curLoc < (allSections.length -1)){
                // Perform Validations Checks
                this.validateSection(curSection,function(ret){
                    if(ret){
                        self.changeSelectedSection(allSections[curLoc+1], true);
                    }
                });                
            }
        }
        catch(ex){
            console.log("Error getting next section: ",ex);
        }
    }

    validateSection(section, callback){
        var self = this;
        var ret = false;
        var reqErrors = [];
        var valErrors = [];
        try {
            
            var sectionFields = (section == "all" ? Object.keys(self.state.form) : this.state.sectionsTypes[section].fields);

            sectionFields.forEach(function(field){
                // check required
                if(self.state.form[field].required && !self.state.form[field].toggle && self.state.form[field].value == ""){
                    reqErrors.push(self.state.form[field].title);
                }

                // check special validations
                if(self.state.form[field].validation){
                    var strVal = self.state.form[field].value;
                    var valid = false;
                    switch(self.state.form[field].validation){
                        case "email":
                            var srtTst = strVal.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i);
                            if(!srtTst || srtTst.length == 0){
                                valErrors.push(self.state.form[field].title);
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
            
            if(reqErrors.length > 0){
                alert("Please fill in the following required fields: "+ reqErrors.join(', '));
            }
            else if(valErrors.length > 0){
                alert("Please update the followign fields with valid information: "+ valErrors.join(', '));
            }
            else {                
                ret = true;
            }            
        }
        catch(ex){
            console.log("Error validating section: ",ex);
        }

        // Check Section Status
        var tmpSectionType = this.state.sectionsTypes;
        if(section !== "all"){ tmpSectionType[section].status = ret; }

        self.setState({ sectionsTypes: tmpSectionType }, () => {
            callback(ret);
        });
    }

    changeSelectedSection(newSection, overwrite){
        if(this.state.sectionsTypes[newSection].status || overwrite){
            this.setState({selectedSection: newSection });
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
                                    retList.push({title:major.title, subtitle:concentration.title, theme:area.colorTheme, degreeTitle:major.degreeTitle, degree: degree.title, area: area.title, url: url});
                                });
                            }

                            if(major.specialization && major.specialization.length > 0){
                                major.specialization.forEach(function(specialization) {
                                    retList.push({title:major.title, subtitle:specialization.title, theme:area.colorTheme, degreeTitle:major.degreeTitle, degree: degree.title, area: area.title, url: url});
                                });
                            }                            
                            retList.push({title:major.title, degreeTitle: major.degreeTitle, theme:area.colorTheme, degree: degree.title, area: area.title, url: url});                                                      
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

export default StudentApp;
import React, { Component } from 'react';

class FindDegree extends Component{
    constructor(props) {
        super(props);
        this.state = {
            degreeList:[],
            areaList:[],
            majorResults:[],
            searchQuery:""
        }
        this.buildFilterList = this.buildFilterList.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.degreeSearch = this.degreeSearch.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidMount(){ 
        this.buildFilterList();
    }

    render(){ 
        var self = this; 
        const filteredResults = this.state.majorResults.filter(
            function(x) { 
                return (
                    self.state.searchQuery == "" 
                    || x.title.toLowerCase().indexOf(self.state.searchQuery.toLowerCase()) >= 0
                    || x.subtitle && x.subtitle.toLowerCase().indexOf(self.state.searchQuery.toLowerCase()) >= 0
                    ); 
            });

        return(
            <div className="degree-container">
               <div className="full-list-container">
                   <h2 className="list-title">Areas Of Study</h2>
                   <div className="list-container">
                        {this.state.areaList.map((item,i) => (
                            <div key={i} className={"filterBtn areaItem " + item.colorTheme + (item.status ? " active":"")} onClick={()=> this.toggleFilter("areaList",i)}>
                                <i className={"far "+ (item.status ? "fa-check-circle": "fa-circle")}></i>
                                <span>{item.title}</span>
                            </div>
                        ))}
                   </div>
               </div>

               <div className="full-list-container">
                   <h2 className="list-title">Degrees</h2>
                   <div className="list-container">
                        {this.state.degreeList.map((item,i) => (
                            <div key={i} className={"filterBtn degreeItem " + (item.status ? " active":"")} onClick={()=> this.toggleFilter("degreeList",i)}>
                                <i className={"far "+ (item.status ? "fa-check-circle": "fa-circle")}></i>
                                <span>{item.title}</span>                                
                            </div>
                        ))}
                   </div>
               </div>
               
               {this.state.majorResults.length > 0 &&
                    <div className="result-search-container">
                        <div className="results-search">
                            <i className="fas fa-search"></i>
                            <input type="text" name="searchQuery" placeholder="Search For Any Specific Major" value={this.state.searchQuery} onChange={(e) => this.handleSearchChange(e)} />
                        </div>
                        <div className="results-list">                          
                            <div className="results-container">
                                {filteredResults.map((item,i) =>(
                                    <div className={"result-item " + item.theme } key={i}>
                                        <div className={"result-icon " + item.theme} />
                                        <div className="item-info-container">
                                            <div className="degree-title"><span>{item.degree}</span> <span>{(item.degreeTitle ? "of "+ item.degreeTitle : "")}</span></div>
                                            <div className="major-title">
                                                {item.subtitle && <span className="sub-title">{item.subtitle} - </span>}
                                                <span className="major-title">{item.title}</span>
                                            </div>
                                        </div>                                
                                    </div>
                                ))}

                                {filteredResults.length == 0 && <div className="result-message">Sorry we did not return any results for that search.</div>}
                            </div>
                        </div>
                    </div>
               }
            </div>
        );
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
    
    handleSearchChange(event){
        var self = this;
        try {
            var name = event.target.name;           

            if(name in self.state){
                this.setState({ [name]:event.target.value });
            }            
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    buildFilterList(){
        try {
            var self = this;
            if(self.props.academicData) {
                var areaInit = Object.keys(self.props.academicData);
                var degreeKey = {};
                var tmpDegree = [];
                var tmpArea = [];

                areaInit.forEach(function(item){
                    tmpArea.push({ idLink:item, title:self.props.academicData[item].title, colorTheme: self.props.academicData[item].colorTheme, status: false });
                    var degreeInit = Object.keys(self.props.academicData[item].degrees);
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
            var activeAreaFilter = this.state.areaList.filter(function(x) { return x.status == true; });
            var activeDegreeFilter = this.state.degreeList.filter(function(x) { return x.status == true; });

            activeAreaFilter = ((!activeAreaFilter || activeAreaFilter.length <= 0) && activeDegreeFilter.length > 0 ? this.state.areaList : activeAreaFilter);
            activeDegreeFilter = ((!activeDegreeFilter || activeDegreeFilter.length <= 0) && activeAreaFilter.length > 0 ? this.state.degreeList : activeDegreeFilter);

            activeAreaFilter.forEach(function(area){
                var tmpArea = self.props.academicData[area.idLink];
                activeDegreeFilter.forEach(function(degree){
                    var tmpDegree = tmpArea.degrees[degree.title];
                    if(tmpDegree){
                        tmpDegree.forEach(function(major){
                            if(major.concentrations && major.concentrations.length > 0){
                                major.concentrations.forEach(function(concentration) {
                                    retList.push({title:major.title, subtitle:concentration, theme:area.colorTheme, degree: degree.title, area: area.title});
                                });
                            }

                            if(major.specialization && major.specialization.length > 0){
                                major.specialization.forEach(function(specialization) {
                                    retList.push({title:major.title, subtitle:specialization, theme:area.colorTheme, degree: degree.title, area: area.title});
                                });
                            }                            
                            retList.push({title:major.title, degreeTitle: major.degreeTitle, theme:area.colorTheme, degree: degree.title, area: area.title});                                                      
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

export default FindDegree;
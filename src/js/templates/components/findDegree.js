import React, { Component } from 'react';

class FindDegree extends Component{
    constructor(props) {
        super(props);
        this.state = {
            degreeList:[],
            areaList:[]
        }
        this.buildFilterList = this.buildFilterList.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
    }

    componentDidMount(){ 
        this.buildFilterList();
    }

    render(){        
        return(
            <div className="degree-container">
               <div className="full-list-container">
                   <h2 className="list-title">Areas Of Study</h2>
                   <div className="list-container">
                        {this.state.areaList.map((item,i) => (
                            <div key={i} className={"filterBtn areaItem " + item.colorTheme + (item.status ? " active":"")} onClick={()=> this.toggleFilter("areaList",i)}>{item.title}</div>
                        ))}
                   </div>
               </div>

               <div className="full-list-container">
                   <h2 className="list-title">Degrees</h2>
                   <div className="list-container">
                        {this.state.degreeList.map((item,i) => (
                            <div key={i} className={"filterBtn degreeItem " + (item.status ? " active":"")} onClick={()=> this.toggleFilter("degreeList",i)}>{item.title}</div>
                        ))}
                   </div>
               </div>
            </div>
        );
    }

    toggleFilter(type,id){
        try {
            var tmpList = this.state[type];
            tmpList[id].status = !tmpList[id].status;

            this.setState({ [type]:tmpList });
        }
        catch(ex){
            console.log("Error toggling filter: ",ex);
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
                    tmpArea.push({title:item, colorTheme: self.props.academicData[item].colorTheme, status: false });
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
}

export default FindDegree;
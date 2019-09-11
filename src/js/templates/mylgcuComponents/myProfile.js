import React, { Component } from 'react';

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
            id:"70000010",
            name:"Joe Smith",
            email: "joe.smith@gmail.com",
            address: "1357 Wilson St., New Castle, DE. 19711, USA",
            degree:"Business Administration",
            degreelvl:"Doctorate",
            totalCredits:15,
            overviewData: [
                { courseCode: {name:"TST",id:"100"}, title:"Educational Technology", statusCode:3 },
                { courseCode: {name:"TST",id:"105"}, title:"Classroom Management", statusCode:3 },
                { courseCode: {name:"TST",id:"106"}, title:"Assessment and Evaluation", statusCode:3 },
                { courseCode: {name:"TST",id:"200"}, title:"Processes of Learning", statusCode:3 },
                { courseCode: {name:"TST",id:"243"}, title:"Educational Research", statusCode:2 },
                { courseCode: {name:"TST",id:"245"}, title:"Intro to Literature", statusCode:2 },
                { courseCode: {name:"TST",id:"246"}, title:"Principles of Virtual Education and Management", statusCode:2 },
                { courseCode: {name:"TST",id:"270"}, title:"Issues and Trends in Entrepreneurship", statusCode:2 },
                { courseCode: {name:"TST",id:"271"}, title:"Investment Analysis 1", statusCode:2 },
                { courseCode: {name:"TST",id:"272"}, title:"Investment Analysis 2", statusCode:1 },
                { courseCode: {name:"TST",id:"277"}, title:"Advanced Marketing Research", statusCode:1 },
                { courseCode: {name:"TST",id:"278"}, title:"Financial Institutions and Banking", statusCode:1 },
                { courseCode: {name:"TST",id:"279"}, title:"Multicultural Perspectives in Education", statusCode:0 },
                { courseCode: {name:"TST",id:"302"}, title:"Special Learner Educational Intervention", statusCode:0 }
            ]
        }

        this.getCourseStatus = this.getCourseStatus.bind(this);
    }

    componentDidMount(){ }

    render(){        
        return(
            <div className="mylgcu-profile">
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

                   <div className="content-block sz3">
                       <div className="block-container">
                            <div className="content-title">Student Id:</div>
                            <div className="content-info">{this.state.id}</div>
                       </div>
                   </div>

                   <div className="content-block sz5">
                        <div className="block-container">
                            <div className="content-title">Degree:</div>
                            <div className="content-info">{this.state.degreelvl} in {this.state.degree}</div>
                       </div>
                   </div>

                   <div className="content-block sz2">
                       <div className="block-container">
                            <div className="content-title">Credits Count:</div>
                            <div className="content-info">{this.state.totalCredits}</div>
                       </div>
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
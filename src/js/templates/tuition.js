import {useSpring, animated} from 'react-spring'
//import {Spring, interpolate} from 'react-spring/renderprops'
import ReactGA from 'react-ga';

import React, { Component, useEffect } from 'react';

/* Images */
import back1 from '../../assets/site/mini/img10.jpg';
import img1 from '../../assets/site/mini/img9.jpg';

/* Header */
class TuitionHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){}

    render(){        
        return(
            <div className="headerCard tuitionHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="Tuition back img" src={back1} /></div>
                    <h1>Tuition</h1>                    
                    <div className="solid-back">
                        <span>Lenkeson Global Christian University is a non-profit institution of higher learning established</span>                        
                        <span>To provide affordable education to individuals who otherwise could not afford it.</span>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
function Tuition(props){

    const [imgprops, setIProps] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))

    const degreeRates= [
        { "level":"Associate", "full":295, "part":315 },
        { "level":"Bachelors", "full":295, "part":315 },
        { "level":"M.A., M.B.A., M.S.", "full":495, "part":515 },
        { "level":"Masters in Education", "full":390, "part":415 },
        { "level":"School of Theology Masters", "full":375, "part":395 }                
    ];
    const programRates = [
        { "level":"Doctorate Programs", "full":550, "part":575 },
        { "level":"Military Undergraduate", "full":225, "part":225 },
        { "level":"Military Masters in Organizational Leadership", "full":255, "part":255 },
        { "level":"Military Masters in School of Theology", "full":255, "part":255 },
        { "level":"Military Graduate/Doctorate", "full":265, "part":265 }
    ];

    useEffect(() => window.scrollTo(0, 0), []);
    useEffect(() => initialReactGA(), []);
    
    function initialReactGA(){
        ReactGA.initialize('UA-147138083-1');
        ReactGA.pageview('/tuition');
    }

    function calc(x,y){
        var container = document.getElementById("imgSplit");
        return [-(y - container.offsetHeight / 2) / 20, (x - container.offsetWidth / 2) / 20, 0.9];
    }
    const trans = (x, y, s) => `perspective(900px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

    return(
        <div className="inner-page-body tuitionPage">
            <section className="tuition-section">
                <h2 className="lrgTitle ctr" data-text="Tuition & Financing">Tuition & Financing</h2>
                <div className="section-container">
                    <p>Lenkeson Global Christian University is a non-profit institution of higher learning established to provide affordable education to individuals who otherwise could not afford it.  LGCU's tuition is among some of the lowest online universities in the United States. Payment plans at Lenkeson Global Christian University make earning a degree convenient and affordable. For more information, please contact the Business Office at 407-564-2992 or email us at <a href="mailto:admin@lenkesongcu.org">admin@lenkesongcu.org</a>.</p>

                    <h3>Tuition Rates for the Academic Year 2019-2020</h3>
                    <h4>Fall 2019, Spring 2020, Summer 2020</h4>

                    <table className="tuition-table">
                        <tr className="header">
                            <th>Degree Level</th>
                            <th>Full-time per credit hour</th>
                            <th>Part-time per credit hour</th>
                        </tr>
                        {degreeRates.map((item,i) =>(
                            <tr key={i}>
                                <td>{item.level}</td>
                                <td>${item.full}</td>
                                <td>${item.part}</td>
                            </tr>
                        ))}

                        <tr className="full-row"><td colspan="3">Programs</td></tr>

                        {programRates.map((item,i) =>(
                            <tr key={i}>
                                <td>{item.level}</td>
                                <td>${item.full}</td>
                                <td>${item.part}</td>
                            </tr>
                        ))}
                    </table>
                    <p className="special-note">* At Lenkeson Global Christian University a full-time load is considered between 9-12 credits. Part-time is 8 credit hour or less.</p>                            

                    <p>Technology Fees $125 Due at Enrollment for One Year</p>
                </div>
            </section>

            <section className="tuition-section alternate">
                <h2 className="lrgTitle ctr c1" data-text="Payment">Payment</h2>
                <div className="section-container" id="imgSplit"> 
                    <animated.div className="img" onMouseMove={({ clientX: x, clientY: y }) => setIProps({ xys: calc(x, y) })} onMouseLeave={() => setIProps({ xys: [0, 0, 1] })} style={{ transform: imgprops.xys.interpolate(trans) }}>                       
                       <img alt="tuition info img" src={img1} />
                    </animated.div>
                    <p>Lenkeson Global Christian University is a private, non-profit Christian institution of higher learning. The tuition and fees paid by students do not fully cover the total cost of operating LGCU. We rely heavily on grants and other financial contributions from like-minded individuals who support our vision, mission and core values.</p>
                        
                    <h3>Deferred Payment Plan Policy</h3>
                    <p>LGCU encourages students to pay in full at registration. If students are not able to pay their full tuition for the semester at the beginning of the academic year, they are required to enter into a deferred payment plan agreement, which allows them to pay their tuition in installments throughout the semester. Students will be charged a fee of $45 to use the deferred payment plan. A $15 late payment fee will be added each month a student fails to schedule a payment.</p>

                    <table className="tuition-table">
                        <tr className="header">
                            <th>Semester Plan</th>
                            <th>Down Payment</th>
                            <th>First Payment</th>
                            <th>Second Payment</th>
                            <th>Third Payment</th>
                            <th>Fourth Payment</th>
                            <th>Fith Payment</th>
                            <th>Sixth Payment</th>
                        </tr>
                        <tr className="full-row"><td colspan="8">Fall</td></tr>
                        <tr>
                            <td>7 payments in Fall</td>
                            <td>June 30th</td>
                            <td>July 30th</td>
                            <td>Aug. 30th</td>
                            <td>Sep. 30th</td>
                            <td>Oct. 30th</td>
                            <td>Nov. 30th</td>
                            <td>Dec. 30th</td>
                        </tr>
                        <tr>
                            <td>6 payments in Fall</td>
                            <td>July 30th</td>
                            <td>Aug. 30th</td>
                            <td>Sep. 30th</td>
                            <td>Oct. 30th</td>
                            <td>Nov. 30th</td>
                            <td>Dec. 30th</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>4 payments in Fall</td>
                            <td>Registration Day</td>                               
                            <td>Sep. 30th</td>
                            <td>Oct. 30th</td>
                            <td>Nov. 30th</td>
                            <td>Dec. 30th</td>
                            <td colspan="2"></td>
                        </tr>

                        <tr className="full-row"><td colspan="8">Spring</td></tr>
                        <tr>
                            <td>6 payments in Spring</td>
                            <td>Dec 30th</td>
                            <td>Jan. 30th</td>
                            <td>Feb. 30th</td>
                            <td>Mar. 30th</td>
                            <td>Apr. 30th</td>
                            <td>May 30th</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>5 payments in Spring</td>                                
                            <td>Registration Day</td>
                            <td>Feb. 30th</td>
                            <td>Mar. 30th</td>
                            <td>Apr. 30th</td>
                            <td>May 30th</td>
                            <td colspan="2"></td>
                        </tr>
                        <tr className="full-row"><td colspan="8">Summer</td></tr>
                        <tr>
                            <td>5 payments in Spring</td>                                
                            <td>Registration Day</td>
                            <td>June 15th</td>
                            <td>July 15th</td>
                            <td colspan="4"></td>
                        </tr>
                    </table>

                    <p>Students who are enrolled and registered in an LGCU graduate program must pay a 1/3 of down payment of the total semester charges.  The remaining charges for the semester will be divided equally to cover the tuition for the remaining installments.</p>
                    <p>Student accounts are classified as follows:</p>
                    <ul>
                        <li>Current Payment: Any student who is currently making payment towards their semester tuition.</li>
                        <li>Past Due Payment: Students who are currently enrolled but fail to make payments towards their tuition.</li>
                        <li>Delinquent Payment: Students who are no longer enrolled at LGCU and failed to contact the Business Office to make satisfactory payment arrangements.</li>
                    </ul>

                    <h3>Delinquent Account Policy</h3>
                    <p>Any student who has not met his or her financial obligations at LGCU will not be allowed to complete financial registration if failing to pay the outstanding balance owed in full. However, students will be allowed to select courses for future semesters. Students will not be able to request official transcripts and diplomas if their balance is not paid in full. Students are encouraged to make financial arrangements with the Business Office to avoid account being referred to a third party agency for collection purposes. Students will be responsible for any collection fees and interest occurred that are associated with their delinquent account.</p>                        
                </div>
            </section>

            <section className="tuition-section">
                <h2 className="lrgTitle ctr" data-text="Refund Policies">Refund Policies</h2>
                <div className="section-container">
                    <h3>Overpayment</h3>
                    <p>Student accounts that are overpaid will be refunded after 14 days. Once an overpayment has issued, students have 180 days to cash the check. If 180 days pass and the check has not been cashed. LGCU will return the funds to the appropriate personnel.</p>

                    <h3>Withdrawal and Terminations</h3>
                    <p>Once a student withdraws or is terminated, all funds due to LGCU are payable in full. No fees will be refunded.</p>

                    <h3>Fall and Spring Sessions Refund Policy</h3>
                    <p>Students who withdraw, terminate or drop a class during the fall or spring semester will be refunded according to the following policy:</p>
                    <ul>
                        <li>First week of classes 100%</li>
                        <li>Second week of classes 75%</li>
                        <li>Third week of classes 50%</li>
                        <li>Fourth week of classes 25%</li>
                    </ul>

                    <h3>LGCU Special Exceptions to Refund Policy</h3>
                    <p>Students who have been affected by a difficult situation such as an injury, prolonged illness or death in the family, or other circumstances that the administration deems appropriate, and given that such issues prohibit a student to complete his or her course of study, the student may submit in writing the appropriate form to appeal the refund.</p>
                </div>
            </section>
        </div>
    );
}

export {Tuition, TuitionHeader};
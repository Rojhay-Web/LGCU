import {useSpring, animated} from 'react-spring'
import ReactGA from 'react-ga';

import React, { Component, useState, useEffect } from 'react';
import TableBuilder from './components/tableBuilder';

import StoryblokService from '../utils/storyblok.service';


/* Images */
import back1 from '../../assets/site/mini/img10.jpg';
import img1 from '../../assets/site/mini/img9.jpg';

const stb = new StoryblokService();

/* Header */
class TuitionHeader extends Component{
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

    const tuitionNote = {
        "us":{ "title":"Note to International Students:", "text":["One course at LGCU consists of 3 credit hours. Therefore, if the cost of one course is $300 per credit hour, the total cost for the course is $900.","If the degree which you have chosen has 10 courses, the total cost for that degree will be the total cost of 1 course multiplied by the total number of courses to complete the degree; for example: ($900x 10)."] },
        "fr":{ "title":"Note aux étudiants internationaux:", "text":["Un cours à LGCU comprend 3 heures de crédit. Par exemple, si le coût d'un cours est de 300 $ par heure de crédit, le coût total du cours est de 900 $.","Si le diplôme que vous avez choisi contient 10 cours, le coût total de ce diplôme sera le coût total d'un cours multiplié par le nombre total des cours pour compléter le diplôme; par exemple: (($900 x10)."] },
        "es":{ "title":"Nota para estudiantes internacionales:", "text":["un curso en LGCU consta de 3 horas de crédito. Por lo tanto, si el costo de un curso es de $ 300 por hora de crédito, el costo total del curso es de $ 900.", "Si el título que ha elegido tiene 10 cursos, el costo total de ese título será el costo total de 1 curso multiplicado por el número total de cursos para completar el título; por ejemplo: ($ 900 x10)."] }
    };

    const [tutionTable, setTutionTable] = useState({});
    const [paymentTable, setPaymentTable] = useState({});
    const [imgprops, setIProps] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }))

    useEffect(() => window.scrollTo(0, 0), []);
    useEffect(() => loadPageData(), []);
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

    function loadPageData(){
        try {
            stb.initEditor(this);
            stb.getInitialProps({"query":"tuition"}, 'cdn/stories/tuition', function(page){
                if(page){
                    var body = page.data.story.content.body;
                    
                    if(body && body.length > 0){
                        if(body[0].component.toLowerCase() === "tuitiontable") {
                            setTutionTable(body[0]);      
                        } 
                        
                        if(body.length > 1 && body[1].component.toLowerCase() === "tuitiontable") {
                            setPaymentTable(body[1]);
                        }
                    }                    
                }
            });
        }
        catch(ex){
            console.log("Error Loading Page Data: ",ex);
        }
    }

    return(
        <div className="inner-page-body tuitionPage">
            <section className="tuition-section">
                <h2 className="lrgTitle ctr" data-text="Tuition & Financing">Tuition & Financing</h2>
                <div className="section-container">
                    <p>Lenkeson Global Christian University is a non-profit institution of higher learning established to provide affordable education to individuals who otherwise could not afford it.  LGCU's tuition is among some of the lowest online universities in the United States. Payment plans at Lenkeson Global Christian University make earning a degree convenient and affordable. For more information, please contact the Business Office at 407-564-2992 or email us at <a href="mailto:admin@lenkesongcu.org">admin@lenkesongcu.org</a>.</p>

                    <h3>{tutionTable.title}</h3>
                    <h4>{tutionTable.subtitle}</h4>
                    <TableBuilder tableclass="tuition-table" table={tutionTable}/>
                    <p className="special-note">* {tutionTable.footnote}</p>                            

                    <p>Technology Fees $125 Due at Enrollment for One Year</p>
                    
                    <div className="international-note">
                        {Object.keys(tuitionNote).map((item,i) =>( 
                            <div className="mini-note" key={i}>
                                <h2><span className={"lng lng-"+item} /> <span>{tuitionNote[item].title}</span></h2>
                                {tuitionNote[item].text.map((para,k)=>(
                                    <p key={k}>{para}</p>
                                ))}
                            </div>
                        ))}
                    </div>
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

                    <TableBuilder tableclass="tuition-table" table={paymentTable} />

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
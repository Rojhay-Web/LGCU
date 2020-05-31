import React, { Component } from 'react';
import ReactGA from 'react-ga';

/* Images */
import back1 from '../../assets/site/mini/back10.jpg';
import defaultProfile from '../../assets/no-user.jpg';
import sLawrenceImg from '../../assets/SJLawrence.png';
import KStevensonImg from '../../assets/KStevenson.jpg';
import DDurenImg from '../../assets/DDuren.jpg';
import BernalImg from '../../assets/Bernal.jpg';
import TWilsonImg from '../../assets/TWilson.jpg';
import ASmokeImg from '../../assets/ASmoke.jpg';
import AStevensonImg from '../../assets/AStevenson.jpg';
import DPettusImg from '../../assets/DPettus.PNG';

/* Header */
class FacultyHeader extends Component{
   
    render(){        
        return(
            <div className="headerCard facultyHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="Faculty Header img" src={back1} /></div>
                    <h1>Faculty & Staff</h1>                    
                    <div className="solid-back">
                        <span>Meet our world class faculty working for Lenkeson Global Christian University</span>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class Faculty extends Component{
    constructor(props) {
        super(props);

        this.slide1 = React.createRef();
        this.slide2 = React.createRef();

        this.controlSlider = this.controlSlider.bind(this);
        this.checkScrollLoc = this.checkScrollLoc.bind(this);
        this.initialReactGA = this.initialReactGA.bind(this);
        this.checkBio = this.checkBio.bind(this);
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.initialReactGA();
    }

    initialReactGA(){
        ReactGA.initialize('UA-147138083-1');
        ReactGA.pageview('/faculty');
    }

    render(){        
        return(
            <div className="inner-page-body facultyPage">
                <section className="faculty-section">
                    <h2 className="lrgTitle ctr" data-text="Administration">Administration</h2>
                    <div className="section-container">
                        <div className="indProfile">
                            <img alt="President img" src={KStevensonImg} />
                            <div className="info title">President/CEO</div>
                            <div className="info name">Kenel Stevenson, B.S., M.A., M.Ed., M.S., Ph.D.</div>
                            <div className="info">Dr. Stevenson has served as a World Languages and Linguistics instructor; Department Chair; Adult ESL instructor; ESL coordinator and teacher; Multicultural Education Adjunct Professor at graduate level; School Administrator; Founding President of not-for-profit organizations and post-secondary institutions of higher learning;</div>
                            <div className="info">He earned a Bachelor’s of Science in Church Ministries and Christian Education from Southwestern Assemblies of God University, Waxahachie, Texas; a Masters of Education in Educational Leadership/Administration from Regent University, Virginia Beach, Virginia; a Master’s of Science in Professional Education with an emphasis in Secondary Education from Saint Joseph’s University, Philadelphia, Pennsylvania; a Masters of Arts in Public Policy and Public Administration from Liberty University, Lynchburg, VA; a Certificate of Advanced Graduate Studies (CAGS) in Higher Education Leadership; a Doctor of Philosophy (PhD) in Education with a specialization in Higher Education Leadership/Administration from Capella University, Minneapolis, Minnesota.</div> 
                            <div className="info">Additionally, he earned two diplomas in Clinical Pastoral Education (CPE), and completed postgraduate studies in the following disciplines: English as a Second Language (ESL), French and Theology from LaSalle University, Regent University School of Divinity, University of Pennsylvania Health Systems and West Chester University. Furthermore, he conducted extensive research regarding challenges faced by Latinos to complete secondary and higher education in the United States. He is a polyglot.</div>
                            <div className="info">His doctoral dissertation titled: “Academic, Social and Economic Challenges Faced by Latinos to Attain Postsecondary Education” is published globally via ProQuest.</div>
                        </div>
                    </div>
                </section>

                <section className="faculty-section alternate">
                    <div className="info-slider">
                            <div className="info-slider-container" ref={this.slide1}>
                                <div className="slider-vertical flip">
                                    <div className="slider-card title base bio-card" id="bioOneCard">
                                        <h1 className="name">Dr. David Duren</h1>
                                        <div className="title">
                                            <p>Vice-President of Business, Finance & Staff Recruitment</p>
                                            <p>Dean of the School of Business Administration</p>
                                        </div>

                                        <div className="faculty-bio" id="bioAccordionDuren">
                                            <a className="bio-btn" data-toggle="collapse" href="#bioOne" aria-expanded="false" aria-controls="bioOne" onClick={() => this.checkBio("bioOneCard")}>Read Bio</a>
                                            <div id="bioOne" className="bio-txt collapse" data-parent="#bioAccordionDuren">
                                                <p>Dr. Duren's academic preparation includes a BS in Business Administration from S. C. State
                                                University, MBA from Pfeiffer University, Doctorate in Business Administration (DBA)
                                                from the University of Phoenix and completing a Doctoral Certification of Advanced
                                                Graduates Studies in Advanced Accounting at Northcentral University.</p>
                                                <p>With over 35 years, including
                                                hospitality, banking, distribution, manufacturing, professional accounting, nonprofits, and
                                                communications. The positions he has held include Controller, Director of Accounting,
                                                Asst. Controller, and Staff.  My experience includes employment in banks, utility
                                                companies, public accounting, non-profit organizations, manufacturing companies and
                                                other areas of Corporate America.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slider-card img">
                                        <img alt="David Duren img" src={DDurenImg} />
                                    </div>
                                </div>

                                <div className="slider-vertical">
                                    <div className="slider-card title c2 bio-card" id="bioBernalCard">
                                        <h1 className="name">Dr. Leonel Bernal</h1>
                                        <div className="title">
                                            <p>Vice-President School of Theology and Biblical Studies, Institutional Advancement & Student Enrollment, International Recruitment</p>
                                            <p>Dean of the School of Theology and Biblical Studies</p>
                                        </div>
                                        <a href="tel:4074340002" className="phone"><i className="fas fa-phone"></i> <span>407.434.0002</span></a>

                                        <div className="faculty-bio" id="bioAccordionBernal">
                                            <a className="bio-btn w1" data-toggle="collapse" href="#bioBernal" aria-expanded="false" aria-controls="bioBernal" onClick={() => this.checkBio("bioBernalCard")}>Read Bio</a>
                                            <div id="bioBernal" className="bio-txt collapse" data-parent="#bioAccordionBernal">
                                                <p>Pastor with 37 years of experience of increasing responsibility in congregational leadership.
                                                    Committed to shepherding individuals to Christ, engaging the community in missionary work
                                                    and community outreach. Expertise in spiritual counseling, education, and mentorship.
                                                    Proven success in advancing church goals and increasing community engagement in
                                                    congregation.</p>
                                                <p>Professor adept in creative teaching strategies that fully engage students in the learning
                                                    process. Deeply invested in achieving tenure through administrative service committee
                                                    contributions and an accomplishment-oriented approach to teaching.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slider-card img c2">
                                        <img alt="Bernal img" src={BernalImg} />
                                    </div>
                                </div>

                                <div className="slider-vertical flip">
                                    <div className="slider-card title light bio-card" id="bioAStevensonCard">
                                        <h1 className="name">Dr. Anita Stevenson</h1>
                                        <div className="title">
                                            <p>Dean of the School of Education</p>
                                            <p>Dean of Academic Affairs, Student Services and Doctoral Residency</p>
                                        </div>

                                        <div className="faculty-bio" id="bioAccordionAStevenson">
                                            <a className="bio-btn w1" data-toggle="collapse" href="#bioAStevenson" aria-expanded="false" aria-controls="bioAStevenson" onClick={() => this.checkBio("bioAStevensonCard")}>Read Bio</a>
                                            <div id="bioAStevenson" className="bio-txt collapse" data-parent="#bioAccordionAStevenson">
                                                <p>Dr. Anita Stevenson's experience in education includes more than twenty-five years of teaching in special education, regular education as well as serving as department chair / mentor. During this time in public education, Dr. Stevenson has been devoted to serving as an educational consultant. Her doctoral work involved an online learning program and her current position encompasses instructing online at the graduate level in the College of Education at Lenkeson Global Christian University.</p>
                                                <p>Currently, Dr. Stevenson serves as the Academic Dean in the College of Education. Prior to serving in the Dean’s position, Dr. Stevenson wrote a portion of the elementary math curriculum and a Flipped Classroom Application Program for students with significant learning disabilities. In addition, she served as the Department Chair for a Community Referenced Instruction Program within a Public School system. Dr. Stevenson’s undergraduate degrees include a Bachelor of Science in Psychology and Early Childhood Education, a Master of Arts in Special Education and a Doctor of Philosophy in Educational Leadership with a focus on Special Education Administration and Supervision. Dr. Stevenson is actively involved in developing new teacher leaders and coaching professionals as educational consultants. </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slider-card img light">
                                        <img alt="Default img" src={AStevensonImg} />
                                    </div>
                                </div>

                                <div className="slider-vertical">
                                    <div className="slider-card title c3">
                                        <div className="title">Administrative Secretary</div>
                                        <a href="tel:4075642992" className="phone"><i className="fas fa-phone"></i> <span>407.564.2992</span></a>
                                    </div>
                                    <div className="slider-card img c3">
                                        <img alt="Default img" src={defaultProfile} />
                                    </div>
                                </div>
                                
                                <div className="slider-close"/>
                            </div>

                            <div className={"slider-ctrl prev" + (this.checkScrollLoc(this.slide1, "prev") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide1, "prev")}><i className="fas fa-caret-left"></i></div>
                            <div className={"slider-ctrl next" + (this.checkScrollLoc(this.slide1, "next") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide1, "next")}><i className="fas fa-caret-right"></i></div>
                        </div>
                </section>

                <section className="faculty-section">
                    <h2 className="lrgTitle ctr" data-text="Board of Directors">Board of Directors</h2>
                    <div className="section-container">
                        <div className="indProfile">
                            <img alt="S Lawrence img" src={sLawrenceImg} />
                            <div className="info title">Vice Chair of the Board of Directors</div>
                            <div className="info name">MSGT Stuart J. Lawrence</div>
                            <div className="info">MSgt (Ret.) Stuart J. Lawrence is currently a contractor working as a Regional Dynamics Senior Analyst at USAFCENT, Shaw Air Force, Sumter, SC</div>
                            <div className="info">His last active duty assignment was a Political-Military Analyst and Senior Non Commissioned Officer on the Europe Eurasia Regional Center’s 1-A Branch, for Europe, Eurasia regional Center, Intelligence Directorate, DIA HQ, Washington DC.</div>
                            <div className="info">MSgt Sergeant Lawrence emigrated from Jamaica in April of 1996, joined the US Air Force in August and graduated Basic Training with honors in October of that same year.</div>
                            <div className="info">MSgt Lawrence began his career in the air force as an aircraft Electro/Environmental Systems Engineer on the now retired C-141 Starlifter at McGuire Air Force Base (AFB) New Jersey. After 3 years of working on the C-141 he opted for a change in pace and applied to retrain into the Flight Engineer career field. He graduated from Flight Engineer school in April of 2001 with honors and was assigned to Dover AFB, Delaware as a crewmember on one of the world’s largest cargo aircraft, the C-5 Galaxy.</div>
                            <div className="info">In October of 2002 Stuart attended the Air Force’s Airman Leadership School where he graduated with honors. In February and May of 2005, after attending Wesley College and Wilmington University in Dover, DE, MSgt Lawrence was awarded Associate Degrees in Electrical Engineering and Professional Aeronautics respectively from the Community College of the Air Force.</div>                            
                            <div className="info">During his time as a Flight Engineer at Dover AFB, he was selected to fly several high profile Presidential and Humanitarian missions. Of note, Stuart flew two Presidential missions in direct support of the Middle East Peace process to Egypt and Jordan. Stuart also flew missions in support of NASA and in support of transferring President Reagan’s remains across the country. He also received a Humanitarian Service Medal for missions flown in support of an Indonesian Tsunami, a major Pakistani earthquake and Hurricane Katrina.</div>
                        </div>
                    </div>
                </section>

                <section className="faculty-section alternate">
                    <div className="info-slider">
                        <div className="info-slider-container" ref={this.slide2}>
                            <div className="slider-vertical">
                                <div className="slider-card title light bio-card" id="bioWilsonCard">
                                    <h1 className="name">Attorney Tiffany Wilson, Esq.</h1>
                                    <div className="title">Board Member</div>

                                    <div className="faculty-bio" id="bioAccordionWilson">
                                        <a className="bio-btn w1" data-toggle="collapse" href="#bioWilson" aria-expanded="false" aria-controls="bioWilson" onClick={() => this.checkBio("bioWilsonCard")}>Read Bio</a>
                                        <div id="bioWilson" className="bio-txt collapse" data-parent="#bioAccordionWilson">
                                            <p>Tiffany N. Wilson, Esq. is the owner and sole proprietors of Wilson Law Firm in Monroe NC. Wilson Law
                                                Firm is a General Practice law office where Ms. Wilson focuses on Criminal, Juvenile, and Family Law.</p>
                                            <p>Tiffany received her Juris Doctorate from North Carolina Central School of Law, Durham, NC, while at
                                                NCCU school of law she was a member of their Trial Team. She graduated Cum Laude from Howard
                                                University, Washington DC with a BA in Political Science/Criminal Justice. Ms. Wilson finished her
                                                secondary education at Monroe High School, Monroe NC.</p>
                                            <p>Tiffany Wilson is a member of the North Carolina State Bar, the Union County District Bar, and ABA
                                                member. She currently serves as the Chair for the Indigent Committee in Union County. She’s currently a
                                                member of the Union County Chamber of Commerce as well as member of the Women’s Business
                                                subgroup. Ms. Wilson holds memberships in the following organizations: Delta Sigma Theta Sorority
                                                Inc., Pi Sigma Alpha, National Council of Negro Women, and the NAACP.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="slider-card img light">
                                    <img alt="default img" src={TWilsonImg} />
                                </div>  
                            </div> 

                            <div className="slider-vertical flip">
                                <div className="slider-card title c3 bio-card" id="bioSmokeCard">
                                    <h1 className="name">Dr. Andrew B. Smoke</h1>
                                    <div className="title">Board Member</div>

                                    <div className="faculty-bio" id="bioAccordionSmoke">
                                        <a className="bio-btn w1" data-toggle="collapse" href="#bioSmoke" aria-expanded="false" aria-controls="bioSmoke" onClick={() => this.checkBio("bioSmokeCard")}>Read Bio</a>
                                        <div id="bioSmoke" className="bio-txt collapse" data-parent="#bioAccordionSmoke">
                                            <p>Pastor in the A.M.E. Zion Church for fifty years (William Chapel, Mt.
                                                Hebron, Vincent Chapel, Mt. Shady, Mt. Mariah, Crockett Memorial, Little
                                                Zion of the West Alabama Annual Conference; ec.). Nineteen years as a Presiding
                                                Elder (Wadesboro-Monroe District, Greensboro District, Concord District
                                                and Hendersonville District).</p>
                                            <p>Organizations and affiliations:</p>
                                            <p>Masonic Order of Masonry (Prince Hall); Alpha Phi Alpha Fraternity;
                                                Ministerial relief Board of the A.M.E. Zion Church; NAACP; Urban League;
                                                Livingstone College Alumni; Hood Theological Seminary Alumni; Doctoral Mentor
                                                at Hood Theological Seminary;</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="slider-card img c3">
                                    <img alt="Default img" src={ASmokeImg} />
                                </div>
                            </div>  

                            <div className="slider-vertical">
                                <div className="slider-card title base bio-card" id="bioPettusCard">
                                    <h1 className="name">Mrs. Pettus</h1>
                                    <div className="title">Board Member</div>

                                    <div className="faculty-bio" id="bioAccordionPettus">
                                        <a className="bio-btn" data-toggle="collapse" href="#bioPettus" aria-expanded="false" aria-controls="bioPettus" onClick={() => this.checkBio("bioPettusCard")}>Read Bio</a>
                                        <div id="bioPettus" className="bio-txt collapse" data-parent="#bioAccordionPettus">
                                            <p>Mrs. Pettus served the United States Federal Government for thirty-six (36) years. She started her tenure with the Food and Drug Administration and moved within several agencies such as the National Institutes of Health, ending her career as a paralegal for the United States Department of Justice’s Environmental Enforcement Section. </p>
                                            <p>Mrs. Pettus was born and received her early education in Salisbury, North Carolina and graduated from South Rowan High School. She relocated from the little small town to the big city of Washington, DC at the age of twenty. She continued her post-secondary education and earned her Associates of Arts and Bachelor of Science Degrees in Paralegal studies. Because she believes in lifelong learning, she continued earning her Juris Doctorate Degree and a Certificate in Real Estate Law and a Diploma in Estates, Wills and Trusts. She is also a Notary Public, where in 1996 she started her business “Have Notary Will Travel.”</p>
                                            <p>Mrs. Pettus retired to care for her special needs’ infant grandson. In 2012, Mrs. Pettus began to volunteer several days during the school year at her grandson’s elementary school. As natural servant, she supported administrators, teachers and other stuff where she was needed. She felt a call to support other special needs classrooms where she felt the need. During her time at the school, she established a lunch account to be used when children were unable to pay for their breakfast or lunch, as she felt no child should not be afforded the opportunity for a decent and nutritious meal. She volunteered at the school until 2018, when her grandson was promoted to middle school. </p>
                                            <p>Mrs. Pettus is very active in her church. Mrs. Pettus is the wife of the love of her life, James Edward Pettus. Many who come into her presence also affectionately known her as Grandma and Ma Pettus. Her favorite Bible scriptures are Psalms 121 and Ecclesiastes 3:1-8. </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="slider-card img base">
                                    <img alt="Default img" src={DPettusImg} />
                                </div>
                            </div>

                            <div className="slider-close"/>                   
                        </div>
                        <div className={"slider-ctrl prev" + (this.checkScrollLoc(this.slide2, "prev") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide2, "prev")}><i className="fas fa-caret-left"></i></div>
                        <div className={"slider-ctrl next" + (this.checkScrollLoc(this.slide2, "next") ? "" : " noshow")} onClick={()=> this.controlSlider(this.slide2, "next")}><i className="fas fa-caret-right"></i></div>
                    </div>
                </section>
            </div>
        );
    }

    checkBio(id){
        var ret = false;
        try {
            var cardElement = document.getElementById(id);

            if(!cardElement.classList.contains("txtOpen")){
                cardElement.classList.add("txtOpen");
            }
            else {
                cardElement.classList.remove("txtOpen");
            }
        }
        catch(ex){
            console.log("Error checking bio: ",ex);
        }

        return ret;
    }

    controlSlider(ref, dir){
        try {
            var scrollSz = 450;

            if(dir === "prev"){
                ref.current.scrollLeft = ref.current.scrollLeft - scrollSz;
            }
            else if(dir === "next"){
                ref.current.scrollLeft = ref.current.scrollLeft + scrollSz;
            }
        }
        catch(ex){
            console.log("Error with slider control: ", ex);
        }
    }

    checkScrollLoc(ref, dir){
        var ret = true;
        try {
            
            /*if(dir === "prev"){
                if(ref.current.scrollLeft <= 0) {
                    ret = false;
                }
            }
            else if(dir === "next"){
                if((ref.current.scrollLeft + ref.current.offsetWidth) >= ref.current.scrollWidth) {
                    ret = false;
                }
            }*/
        }
        catch(ex){
            console.log("Error with check scroll: ", ex);
        }
        return ret;
    }
}

export {Faculty, FacultyHeader};
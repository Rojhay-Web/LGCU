import React, { Component } from 'react';
import ReactGA from "react-ga4";

import back1 from '../../assets/site/mini/back11.jpg';
import back3 from '../../assets/site/mini/back3.jpg';

/* Header */
class AboutHeader extends Component{
    render(){        
        return(
            <div className="headerCard aboutHeader sub-page">
                <div className="header-title header-section">
                    <div className="backImg"><img alt="About header img" src={back1} /></div>
                    <h1>About LGCU</h1>                    
                    <div className="solid-back">
                        <span>Developing and empowering adult learners through twenty-first century virtual academic</span>
                        <span>Education to successfully transform and lead organizations with integrity in a diverse society.</span>
                    </div>
                </div>                
            </div>
        );
    }
}

/* Body */
class About extends Component{
    constructor(props) {
        super(props);
        this.state = {
            presLetter: {
                "en": {"title":"From The President", "ending":["Your Servant-Leader,","Dr. Kenel Stevenson (Ph.D.), President/CEO"], "info":[
                    "Twenty-five years ago I envisioned the formation of a global organization aiming to build educational and leadership centers in developing countries where children, youth and adults can have access to excellent academic, professional, teaching and leadership training that they may be fully equipped and empowered to make a positive impact in their communities and the world.",
                    "Currently, this vision is being fulfilled through Lenkeson Global Christian University, Inc., aiming to deliver asynchronously the finest academic education to global citizens who desire to excel academically, socioeconomically and spiritually in the job market or full-time ministry.",
                    "We want Lenkeson Global Christian University (LGCU) to be your connection to unlimited opportunities to fulfill your dreams through global access through affordable higher education. The entire team at LGCU is committed to your enrollment, learning, and attainment for economic empowerment.",
                    "Thank you for considering Lenkeson Global Christian University for your academic pursuit to attain your professional goals. We will see you at the Commencement line."
                ]},
                "fr": {"title":"Bureau du Président", "ending":["Votre serviteur,","Dr. Kenel Stevenson (Ph.D.), President/CEO"], "info":[
                    "Il y a vingt-cinq ans de cela, j'avais envisagé la création d'une organisation mondiale visant à créer des centres d'éducation et de leadership dans les pays sur les voies de développement, où les enfants, les jeunes et les adultes pourraient avoir accès à une excellente formation académique, professionnelle, pédagogique et de leadership d’entreprises ; leur permettant d'être pleinement équipés et abiles pour avoir un impact positif dans leurs communautés et à travers le monde.",
                    "Actuellement, cette vision est concrétisée par Lenkeson Global Christian University, Inc., qui vise à offrir de manière asynchronique la meilleure éducation académique aux citoyens du monde qui veulent avancer sur les plans académique, socioéconomique et spirituel pour obtenir un emploie séculaire ou travailler dans le ministère.",
                    "Nous souhaitons que Lenkeson Global Christian University (LGCU) devienne votre choix pour réaliser vos rêves académiques et professionnelles grâce à un accès mondial à travers un enseignement supérieur abordable. Toute l'équipe de LGCU s'engage à vous soutenir dans vos études pour atteindre vos objectifs en vue de l'autonomisation économique.",
                    "Nous vous remercions de considérer Lenkeson Global Christian University (LGCU) pour atteindre vos objectifs professionnels. Nous vous attendons impatiemment."
                ]},
                "es": {"title":"Del Presidente", "ending":["Tu Siervo Lider,","Dr. Kenel Stevenson (Ph.D.), President/CEO"], "info":[
                    "Hace veinticinco años imaginé la formación de una organización global con el objetivo de construir centros educativos y de liderazgo en países en desarrollo donde los niños, jóvenes y adultos puedan tener acceso a una excelente capacitación académica, profesional, de enseñanza y liderazgo para que puedan estar completamente equipados y capacitados. Hacer un impacto positivo en sus comunidades y en el mundo.",
                    "Actualmente, esta visión se está cumpliendo a través de Lenkeson Global Christian University, Inc., con el objetivo de ofrecer de manera asincrónica la mejor educación académica a los ciudadanos globales que desean sobresalir académicamente, socioeconómicamente y espiritualmente en el mercado laboral o en el ministerio a tiempo completo.",
                    "Queremos que Lenkeson Global Christian University (LGCU) sea su conexión con oportunidades ilimitadas para cumplir sus sueños a través del acceso global a través de una educación superior asequible. Todo el equipo de LGCU está comprometido con su inscripción, aprendizaje y logro para el empoderamiento económico.",
                    "Gracias por considerar a Lenkeson Global Christian University por su búsqueda académica para alcanzar sus metas profesionales. Te veremos en la línea de inicio."
                ]}
            },
            selectedLang:"en",
            selectedLetter:{"info":[], "ending":[]}
        }

        this.chooseLetter = this.chooseLetter.bind(this);
        this.initialReactGA = this.initialReactGA.bind(this);
    }

    initialReactGA(){
        ReactGA.initialize('G-K5C0Q6ZKKD');
        ReactGA.send({ hitType: "pageview", page: "/about", title: "About" });
        //ReactGA.pageview('/about');
    }

    componentDidMount(){ 
        window.scrollTo(0, 0);
        this.chooseLetter("en");
        this.initialReactGA();
    }

    render(){        
        return(
            <div className="inner-page-body aboutPage">
                <section className="about-section">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr" data-text="The LGCU Mission">The LGCU Mission</h2>
                        <div className="indProfile">
                            <div className="img"><img alt="About Mission img" src={back3} /></div>
                            <p className="info">Lenkeson Global Christian University is a leading online higher learning institution, established to meet the academic and professional needs of college traditional age and working adults, to award associate, baccalaureate, masters, and doctorate degrees.</p>
                            <p className="info">LGCU exists to provide the diverse adult learning community twenty-first century educational programs in various fields. At LGCU, learners and faculty are engaged in academic and professional learning that is centered on developing and empowering working professionals to succeed in church ministries and other professional fields.</p>
                        </div>
                    </div>                    
                </section>

                <section className="about-section alternate2 patterned">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr" data-text="Lenkeson Meaning">Lenkeson Meaning</h2>
                        <div className="acry-container">
                            <div className="acryTitle"><div className="initLetter">L</div>eadership</div>
                            <div className="acryTitle"><div className="initLetter">E</div>mpowerment</div>
                            <div className="acryTitle"><div className="initLetter">N</div>urturing </div>
                            <div className="acryTitle"><div className="initLetter">K</div>nowledge </div>
                            <div className="acryTitle"><div className="initLetter">E</div>xcellence</div>
                            <div className="acryTitle"><div className="initLetter">S</div>ervices</div>
                            <div className="acryTitle"><div className="initLetter">O</div>pportunities</div>
                            <div className="acryTitle"><div className="initLetter">N</div>etworking</div>
                        </div>
                    </div>
                </section>

                <section className="about-section alternate">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr c1" data-text="Our Core Values">Our Core Values</h2>
                        <ul>
                            <li>Reflect Christ-centeredness in academic learning with integrity and professional ethics.</li>
                            <li>Engage learners in effective online learning that is relevant to daily work experience.</li>
                            <li>Equip college traditional age and adult learners to become problem-solvers in the marketplace.</li>
                            <li>Connect learners globally through the use of technology, action research, internship, multi-professionalism, and employment.</li>
                            <li>Maintain organizational infrastructure by continuing to provide relevant professional support and service to faculty, and learners including all stakeholders.</li>
                            <li>Strive to provide excellent teaching and learning through affordable tuition for all learners.</li>
                            <li>Provide on-going professional development for faculty and staff to ensure effective operations of the university.</li>
                        </ul>
                    </div>
                </section>

                <section className="about-section">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr" data-text="Letter From Our President">Letter From Our President</h2>
                        <div className="letter-container">
                            <div className="lang-ctrl">
                                <div className={"lang-btn" + (this.state.selectedLang === "en" ? " selected" : "")} onClick={() => this.chooseLetter("en")}><span className="lng lng-us"/></div>
                                <div className={"lang-btn" + (this.state.selectedLang === "fr" ? " selected" : "")} onClick={() => this.chooseLetter("fr")}><span className="lng lng-fr"/></div>
                                <div className={"lang-btn" + (this.state.selectedLang === "es" ? " selected" : "")} onClick={() => this.chooseLetter("es")}><span className="lng lng-es"/></div>
                            </div>
                            <p className="letter-title">{this.state.selectedLetter.title}</p>
                            {this.state.selectedLetter.info.map((item, i) =>
                                <p key={i} className={"ltxt letter-line"+i}>{item}</p>
                            )}

                            {this.state.selectedLetter.ending.map((item, i) =>
                                <div key={i} className={"letter-end line-"+i}>{item}</div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="about-section alternate">
                    <div className="section-container">
                        <h2 className="lrgTitle ctr c1" data-text="Statement of Faith">Statement of Faith</h2>
                        <p>Lenkeson Global Christian University is a Christ-centered institution of higher learning. The board of trustees, faculty and staff of the university understand the importance of representing and reflecting Christ in all aspects of their lives; hereby accept the Scriptures of the revealed Will of God, the all sufficient rule of faith and practice, and for the purpose of maintaining general unity, adopt these fundamentals Tenets of Faith and Doctrine written below:</p>
                        <ul>
                            <li>The Bible is the inspired Word of God, a revelation from God to man, the living, infallible, and everlasting rule of faith and conduct, and is superior to conscience and reason.</li>
                            <li>The triune Godhead is comprised of three separate and distinct personalities, the Father, the Son, and the Holy Spirit, who are eternally self-existent, self-revealed, and function as one entity. Jesus Christ, who is God manifested in the flesh, is the second member of the Godhead, co-equal and co-eternal with the Father and the Holy Spirit.</li>
                            <li>Man was created good and upright. But, by voluntary transgression, man fell, and his only hope of redemption is in Jesus Christ the Son of God.</li>
                            <li>The church is the Body of Christ, the habitation of God through the Spirit, with divine appointments for the fulfillment of her great commission. Each believer, born of the Spirit, is an integral part of the general assembly and the universal church whose names are written in heaven.</li>
                            <li>Jesus is coming again to gather all His Saints to be eternally with Him.</li>
                        </ul>
                    </div>
                </section>
            </div>
        );
    }

    chooseLetter(lang) {
        switch(lang){
            case "es":
                this.setState({selectedLang:"es", selectedLetter: this.state.presLetter.es });
                break;
            case "fr":
                this.setState({selectedLang:"fr", selectedLetter: this.state.presLetter.fr });
                break;
            case "en":
                this.setState({selectedLang:"en", selectedLetter: this.state.presLetter.en });
                break;
            default:
                this.setState({selectedLang:"en", selectedLetter: this.state.presLetter.en });
                break;
        }
    }
}

export {About, AboutHeader};
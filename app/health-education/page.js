import "./education.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import HealthIllustration from "../../components/HealthIllustration";
import { getHealthTopics } from "../../components/healthEducationData";

export default function Education(){
  const healthTopics=getHealthTopics();
  return <><Navbar/><main>
    <section className="education-hero"><div className="container"><p className="eyebrow">HEALTH EDUCATION</p><h1>Health Education</h1><p>Learn. Understand. Take Care of Your Health.</p></div></section>
    <section className="education-section container" aria-label="Health education topics"><div className="topic-grid">{healthTopics.map(topic=><article className="topic-card" key={topic.id}><HealthIllustration type={topic.illustration} alt={`${topic.title} illustration`}/><div className="topic-card-content"><span className="topic-icon" aria-hidden="true">{topic.icon}</span><h2>{topic.title}</h2><p>{topic.description}</p><Link href={topic.route} className="topic-explore">Explore {topic.title.replace(" & Diet", "")} <span>→</span></Link></div></article>)}</div></section>
    <section className="education-note"><div className="container"><span>✦</span><p>These guides provide general education. For symptoms, diagnosis, or treatment, please speak with a qualified healthcare professional.</p></div></section>
  </main><Footer/></>;
}

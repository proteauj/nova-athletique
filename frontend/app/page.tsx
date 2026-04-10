import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import HomeLoginPrompt from '@/components/auth/HomeLoginPrompt';

const team = [
  {
    name: 'Dominique Rondeau',
    role: 'Co-propriétaire et entraîneur',
    image: 'https://static.wixstatic.com/media/0a1e94_98f348b7b329448ca664d00a9f007666~mv2.jpg/v1/crop/x_0,y_0,w_3648,h_3643/fill/w_225,h_227,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/PR6_9504.jpg'
  },
  {
    name: 'Jennifer Guimond',
    role: 'Co-propriétaire et kinésiologue',
    image: 'https://static.wixstatic.com/media/0a1e94_69f33d74120d4858a21a54bac753920f~mv2.jpg/v1/crop/x_155,y_0,w_3493,h_3529/fill/w_225,h_227,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/PR6_9500.jpg'
  },
  {
    name: 'Tom Niro',
    role: 'Kinésiologue',
    image: 'https://static.wixstatic.com/media/0a1e94_9f3c078ecaab43578f636a532eb57874~mv2.jpg/v1/crop/x_922,y_0,w_2631,h_2654/fill/w_225,h_227,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/PR6_9496.jpg'
  }
];

const gallery = [
  'https://static.wixstatic.com/media/0a1e94_513edcca5ad04eaa9a3f2cbc698aefa5~mv2.jpg/v1/fill/w_539,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a1e94_513edcca5ad04eaa9a3f2cbc698aefa5~mv2.jpg',
  'https://static.wixstatic.com/media/0a1e94_6212fc91217047278266bd1fb501edf5~mv2.jpg/v1/fill/w_412,h_275,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a1e94_6212fc91217047278266bd1fb501edf5~mv2.jpg',
  'https://static.wixstatic.com/media/0a1e94_b1b9958c56e846ae90fa362997ef9ce8~mv2.jpg/v1/fill/w_402,h_268,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a1e94_b1b9958c56e846ae90fa362997ef9ce8~mv2.jpg'
];

export default function Home() {
  return (
    <>
      <section className="hero hero-with-video">
        <div className="container hero-video-shell">
          <HeroVideo />

          <div className="hero-overlay-content">
            <div className="hero-copy-block">
              <span className="hero-kicker">Nova Athlétique</span>
              <h1>Centre de remise en forme</h1>
              <p>
                Nova Athlétique s’engage à offrir un service d’entraînement encadré et personnalisé
                afin d’atteindre vos objectifs, quelle que soit votre condition physique actuelle.
              </p>
              <div className="button-row">
                <Link href="/reservation/calendrier?mode=essai" className="button">Essai gratuit</Link>
                <Link href="/tarifs/mensuel-2x" className="button-outline">Voir les tarifs</Link>
              </div>
            </div>

            <div className="stats stats-on-video">
              <div className="stat"><strong>Abonnez-vous</strong><span>Découvrez notre grande variété d’abonnements.</span></div>
              <div className="stat"><strong>Services</strong><span>Groupe, spinning, libre, drop in et plus encore.</span></div>
              <div className="stat"><strong>Saint-Jean</strong><span>48, rue Moreau</span></div>
            </div>
          </div>
        </div>
      </section>

      <HomeLoginPrompt />

      <section className="section">
        <div className="container">
          <h2 className="section-title">Bienvenue chez Nova Athlétique</h2>
          <p className="section-copy">
            Notre centre d’entraînement propose différents services répondant à vos besoins : cross training,
            réhabilitation, suivis alimentaires, musculation et plus encore. Que vous soyez plutôt débutant
            ou un athlète de haut niveau, nous avons les ressources et l’expertise pour vous épauler
            et vous permettre de vous dépasser.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Galerie</h2>
          <div className="grid-3" style={{ marginTop: '1.25rem' }}>
            {gallery.map((src, index) => (
              <article key={src} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={src} alt={`Nova Athlétique galerie ${index + 1}`} style={{ width: '100%', height: 260, objectFit: 'cover' }} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">L’équipe</h2>
          <p className="section-copy">Nova Athlétique compte sur une équipe passionnée prête à tout pour vous aider à atteindre vos objectifs.</p>
          <div className="grid-3" style={{ marginTop: '1.25rem' }}>
            {team.map((member) => (
              <article className="team-card" key={member.name}>
                <img className="team-photo" src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <div className="team-role">{member.role}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

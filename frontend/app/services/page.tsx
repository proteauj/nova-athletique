export default function ServicesPage() {
  const services = [
    { title: 'Entraînement en entreprise', text: 'Parfait pour bâtir une chimie entre collègues et permettre à vos employés de garder la forme.' },
    { title: 'Cours de groupe à la carte', text: 'Un forfait de 10 sessions de groupe à utiliser en un an.' },
    { title: 'Programmation spécifique', text: "Faites confiance à nos experts pour vous préparer une routine d'entraînement totalement personnalisée." },
    { title: 'Entraînement privé', text: "Profitez d'un entraîneur qui vous suit personnellement durant toute la session." },
    { title: 'Entraînement libre', text: "Notre service conventionnel ; le client s'entraîne librement et selon son propre horaire." },
    { title: 'Test et analyse corporelle', text: "Plusieurs tests physiques sont offerts pour permettre de bien déterminer votre future routine d'entraînement." },
    { title: 'Entraînement semi-privé', text: 'Un cours en petit groupe. Moins cher et tout aussi efficace.' },
    { title: 'Suivi alimentaire', text: 'Nos spécialistes sont formés pour vous aider à mieux vous alimenter.' },
    { title: 'Prise de plis adipeux', text: 'Nous offrons la mesure de la masse grasse par la méthode des plis cutanés.' }
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Services</h1>
          <p className="section-copy">
            En plus de nos cours et de nos installations, Nova Athlétique offre différents services pour améliorer votre santé physique et mentale.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container hero-grid">
          <div className="card">
            <h3>Nova Corpo</h3>
            <p className="muted">
              Vous souhaitez créer un milieu de travail où l’énergie, l’efficacité et la motivation règnent?
              Intégrez l’entraînement au travail. Maximisez le temps de vos employés tout en créant une dynamique
              d’équipe et un style de vie amélioré qui permet la réduction du stress et l’augmentation de la productivité.
            </p>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img
              src="https://static.wixstatic.com/media/0a1e94_ac2f643f56fe49bea0a23aacf7392925~mv2.jpg/v1/crop/x_1174,y_0,w_2837,h_3456/fill/w_476,h_581,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/pexels-victor-freitas-703016.jpg"
              alt="Nova Corpo"
              style={{ width: '100%', height: '100%', minHeight: 420, objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '1.5rem' }}>
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p className="muted">{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Vidéo</h2>
          <p className="section-copy">
            Vidéo YouTube liée à la mesure de la masse grasse par la méthode des plis cutanés.
          </p>
          <div className="card" style={{ marginTop: '1.25rem', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/6d-rDtTpuvw"
                title="Mesure de la masse grasse"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

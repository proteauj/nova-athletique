export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Contactez nous!</h1>
          <p className="section-copy">
            Notre équipe demeure à votre disposition pour vous assister! N'hésitez pas à remplir le formulaire ci-dessous
            pour nous envoyer un message ou à nous contacter directement par téléphone ou par courriel.
            Nous ferons de notre mieux pour répondre à toutes vos demandes dans les plus brefs délais.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container hero-grid">
          <div className="card">
            <h3>Des questions?</h3>
            <p className="muted">Section prête pour un vrai formulaire de contact.</p>
            <div className="grid-2" style={{ marginTop: '1rem' }}>
              <div className="info-card"><h3>Téléphone</h3><p className="muted">514 796-3308<br />514-978-3661</p></div>
              <div className="info-card"><h3>Adresse</h3><p className="muted">48, rue Moreau<br />Saint-Jean-sur-Richelieu (Québec) J2W 1H9</p></div>
            </div>
          </div>
          <div className="card" style={{ display: 'grid', placeItems: 'center', minHeight: 340 }}>
            <img
              src="https://static.wixstatic.com/media/0a1e94_c43f02b4f1c04168877440eed39b5b2c~mv2.png/v1/fill/w_265,h_265,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a1e94_c43f02b4f1c04168877440eed39b5b2c~mv2.png"
              alt="Symbole Nova Athlétique"
              style={{ width: 180, height: 180, objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

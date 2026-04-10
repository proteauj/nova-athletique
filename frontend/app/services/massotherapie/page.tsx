export default function MassotherapiePage() {
  const googleCalendarEmbed =
    "https://calendar.google.com/calendar/embed?src=nathaliebessettelb@gmail.com&ctz=America%2FToronto";

  const goRendezVousUrl =
    "https://www.gorendezvous.com/LBmassothrapie?source=GOMarketplace";

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Massothérapie</h1>
          <p className="section-copy">
            Consultez les disponibilités puis réservez votre rendez-vous avec Nathalie Bessette.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div style={{ position: "relative", width: "100%", paddingTop: "75%" }}>
              <iframe
                src={googleCalendarEmbed}
                title="Disponibilités massothérapie"
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                    borderRadius: '16px'
                }}
                frameBorder="0"
                scrolling="no"
                />
            </div>
          </div>

          <a
            href={goRendezVousUrl}
            target="_blank"
            rel="noreferrer"
            className="button"
          >
            Réserver
          </a>
        </div>
      </section>
    </>
  );
}
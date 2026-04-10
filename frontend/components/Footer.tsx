import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>Nova Athlétique</h3>
          <p>
            Centre d’entraînement à Saint-Jean-sur-Richelieu avec entraînements de groupe,
            spinning, accompagnement personnalisé et essai gratuit.
          </p>
        </div>

        <div>
          <h3>Heures d’ouverture</h3>
          <p>Lundi 6:00 – 20:00</p>
          <p>Mardi 6:00 – 19:00</p>
          <p>Mercredi 6:00 – 21:00</p>
          <p>Jeudi 6:00 – 19:00</p>
          <p>Vendredi 6:00 – 18:30</p>
          <p>Samedi 8:00 – 11:30</p>
          <p>Dimanche 8:00 – 11:30</p>
        </div>

        <div>
          <h3>Coordonnées</h3>
          <p>48, rue Moreau</p>
          <p>Saint-Jean-sur-Richelieu (Québec) J2W 1H9</p>
          <p>514 796-3308</p>
          <p>514-978-3661</p>
          <p style={{ marginTop: 12 }}>
            <Link href="/contact" style={{ color: 'var(--accent)' }}>Nous contacter</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

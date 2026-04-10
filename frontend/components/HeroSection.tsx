'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero hero-with-video">
      <div className="container">
        <div className="hero-video-shell hero-card">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>

          <div className="hero-video-overlay" />

          <div className="hero-overlay-content">
            <div className="hero-copy-block">
              <span className="hero-kicker">Nova Athlétique</span>

              <h1>
                Entraîne-toi avec intensité.
              </h1>

              <p>
                Cours de groupe, entraînement privé, spinning et accompagnement
                humain dans un environnement motivant, moderne et accessible.
              </p>

              <div className="button-row">
                <Link
                  href="/reservation/calendrier?mode=essai"
                  className="button"
                >
                  Essai gratuit
                </Link>

                <Link
                  href="/reservation/calendrier"
                  className="button-outline"
                >
                  Voir l’horaire
                </Link>
              </div>
            </div>

            <div className="stats stats-on-video">
              <div className="stat">
                <strong>12</strong>
                <span>Places max par cours</span>
              </div>

              <div className="stat">
                <strong>7 j / 7</strong>
                <span>Horaire accessible</span>
              </div>

              <div className="stat">
                <strong>Nova</strong>
                <span>Expérience motivante</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
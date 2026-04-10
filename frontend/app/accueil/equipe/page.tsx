import PageShell from '@/components/PageShell';

const team = [
  ['Dominique Rondeau', 'Co-propriétaire et entraîneur'],
  ['Jennifer Guimond', 'Co-propriétaire et kinésiologue'],
  ['Tom Niro', 'Kinésiologue']
];

export default function Page() {
  return (
    <PageShell title="L’équipe" intro="Une équipe passionnée prête à aider les membres à atteindre leurs objectifs.">
      <div className="grid-3">
        {team.map(([name, role]) => (
          <article className="team-card" key={name}>
            <h3>{name}</h3>
            <div className="team-role">{role}</div>
            <p className="muted">Profil d’équipe prêt à être enrichi avec une photo, une bio et les spécialités.</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

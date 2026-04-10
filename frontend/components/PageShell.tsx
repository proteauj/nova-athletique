export default function PageShell({
  title,
  intro,
  children
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{title}</h1>
          <p className="section-copy">{intro}</p>
        </div>
      </section>
      <section className="page-content">
        <div className="container">
          {children}
        </div>
      </section>
    </>
  );
}

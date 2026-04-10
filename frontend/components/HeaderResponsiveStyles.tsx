export default function HeaderResponsiveStyles() {
  return (
    <style>{`
      @media (max-width: 1080px) {
        header nav { display: none !important; }
        header button[aria-label="Ouvrir le menu"] { display: block !important; }
      }

      @media (min-width: 1081px) {
        header button[aria-label="Ouvrir le menu"] { display: none !important; }
      }
    `}</style>
  );
}
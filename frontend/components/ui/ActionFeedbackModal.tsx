'use client';

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export default function ActionFeedbackModal({
  open,
  title,
  message,
  onClose
}: Props) {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div className="card" style={contentStyle}>
        <h3 style={{ marginBottom: 12 }}>{title}</h3>
        <p className="section-copy" style={{ marginBottom: 18 }}>
          {message}
        </p>

        <button type="button" className="button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.68)',
  display: 'grid',
  placeItems: 'center',
  padding: 16,
  zIndex: 200
};

const contentStyle: React.CSSProperties = {
  width: 'min(100%, 520px)',
  textAlign: 'center'
};
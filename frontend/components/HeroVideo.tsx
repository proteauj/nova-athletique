export default function HeroVideo() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 'var(--radius)'
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://static.wixstatic.com/media/0a1e94_513edcca5ad04eaa9a3f2cbc698aefa5~mv2.jpg/v1/fill/w_539,h_434,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0a1e94_513edcca5ad04eaa9a3f2cbc698aefa5~mv2.jpg"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.45) saturate(0.9)'
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(5,7,8,0.82) 0%, rgba(5,7,8,0.48) 45%, rgba(159,223,224,0.14) 100%)'
        }}
      />
    </div>
  );
}

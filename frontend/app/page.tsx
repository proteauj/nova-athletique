'use client';

import { useEffect, useState } from 'react';
import Menu from '../components/Menu';

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    fetch(apiUrl + '/api/schedules')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData([]));
  }, []);

  return (
    <div>
      <Menu />
      <h1>Accueil</h1>
      <p>Bienvenue chez Nova Athlétique.</p>

      <section>
        <h2>Horaire</h2>
        {data.map((s: any) => (
          <div key={s.id}>
            <h3>{s.class?.title}</h3>
            <p>{new Date(s.startTime).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

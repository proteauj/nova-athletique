'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/schedules')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>Horaire</h1>
      {data.map((s: any) => (
        <div key={s.id}>
          <h3>{s.class.title}</h3>
          <p>{new Date(s.startTime).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

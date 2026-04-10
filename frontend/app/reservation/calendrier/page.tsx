import { Suspense } from 'react';
import CalendrierClient from './CalendrierClient';

export default function CalendrierPage() {
  return (
    <Suspense fallback={<div className="container section">Chargement...</div>}>
      <CalendrierClient />
    </Suspense>
  );
}
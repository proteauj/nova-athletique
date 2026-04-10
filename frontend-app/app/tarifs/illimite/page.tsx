'use client';

import PaymentForm from '../../../components/PaymentForm';

export default function Mensuelillimit() {
  const handlePaymentSuccess = () => {
    alert('Paiement réussi! Votre abonnement est maintenant actif.');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Abonnement Mensuel Illimité</h1>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-lg mb-2">Prix de base: <span className="font-semibold">50,00 $ CAD / mois</span></p>
        <p className="text-sm text-gray-600">Taxes TPS (5%) et TVQ (9,975%) en sus</p>
      </div>
      <PaymentForm amount={50} onSuccess={handlePaymentSuccess} />
    </div>
  );
}

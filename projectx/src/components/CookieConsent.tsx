import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkCookieConsent = async () => {
      if (session?.user?.email) {
        const response = await fetch('/api/cookies');
        const userData = await response.json();
        setShowConsent(!userData.cookieConsent);
      }
    };

    checkCookieConsent();
  }, [session]);

  const handleAccept = async () => {
    try {
      const response = await fetch('/api/cookies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cookieConsent: true,
          cookieConsentAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar consentimento');
      }

      const data = await response.json();
      setShowConsent(false);
    } catch (error) {
      console.error('Erro ao salvar consentimento:', error);
    }
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <p className="text-sm mb-4 text-black">
        Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.
      </p>
      <button
        onClick={handleAccept}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Aceitar
      </button>
    </div>
  );
}
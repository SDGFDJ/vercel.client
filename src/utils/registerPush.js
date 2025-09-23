import Axios from './Axios';

export const registerPush = async (PUBLIC_VAPID_KEY) => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const sw = await navigator.serviceWorker.register('/service-worker.js');
    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });
    
    await Axios.post('/api/save-subscription', subscription);
  }
};

// Helper
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

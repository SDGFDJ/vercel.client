export async function subscribeUser() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;

      // Backend से VAPID Public Key लाना
      const response = await fetch("http://localhost:8080/api/notification/vapidPublicKey");
      const data = await response.json();
      const publicKey = data.publicKey;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      console.log("Push Subscription:", subscription);

      // अब इस subscription को backend पर save करो (DB में)
      await fetch("http://localhost:8080/api/notification/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });

    } catch (err) {
      console.error("Push Subscription Failed:", err);
    }
  }
}

// Helper: Convert Base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

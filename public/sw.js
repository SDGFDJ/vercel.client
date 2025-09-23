/* eslint-disable no-restricted-globals */

// install event
self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  self.skipWaiting();
});

// activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
});

// push event (जब backend से notification आता है)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.message,
        icon: "/logo192.png", // अपनी app का logo
      })
    );
  }
});

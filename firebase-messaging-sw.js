// ═══════════════════════════════════════════
// PEGELCLUB RIVERPERLEN – FCM Service Worker
// Datei: firebase-messaging-sw.js
// Muss im GitHub Repo neben index.html liegen!
// ═══════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBr0rO8xKa5HlfKiAoOzuvtAg4j1PZAzaU',
  projectId: 'riverperlen-440c1',
  messagingSenderId: '169916112882',
  appId: "1:169916112882:web:ba4e8ede2ce4af0d43956b"
});

const messaging = firebase.messaging();

// Background-Push empfangen (App ist geschlossen oder im Hintergrund)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background Push empfangen:', payload);

  var title  = (payload.notification && payload.notification.title)  || 'Pegelclub Riverperlen';
  var body   = (payload.notification && payload.notification.body)   || '';
  var icon   = (payload.notification && payload.notification.icon)   || '';
  var tag    = (payload.data         && payload.data.tag)            || 'rp-push';
  var url    = (payload.data         && payload.data.url)            || '/';

  var opts = {
    body:      body,
    icon:      icon || 'https://raw.githack.com/marcusNOH/Riverperlen/main/icon-192.png',
    badge:     'https://raw.githack.com/marcusNOH/Riverperlen/main/icon-192.png',
    tag:       tag,
    renotify:  true,
    data:      { url: url }
  };

  return self.registration.showNotification(title, opts);
});

// Klick auf Notification → App öffnen
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : 'https://raw.githack.com/marcusNOH/Riverperlen/main/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Bereits offenes Fenster fokussieren
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url.indexOf('Riverperlen') !== -1 && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      // Neues Fenster öffnen
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Install + Activate – sofort übernehmen
self.addEventListener('install',   function(e) { self.skipWaiting(); });
self.addEventListener('activate',  function(e) { e.waitUntil(self.clients.claim()); });

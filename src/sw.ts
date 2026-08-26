/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const data = event.data as { type?: string } | undefined
  if (data?.type === 'SKIP_WAITING') {
    void self.skipWaiting()
  }
})

precacheAndRoute(self.__WB_MANIFEST)

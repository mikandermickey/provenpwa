const cacheName = "shell-contents2-2021.01.26v2";
const filesToCache = [
    "/style.css",
    "/script.js",
    "/index.html",
    "/offline.html"
];

//install serviceworker
self.addEventListener("install", evt => {
    console.log("serviceworker has been installed")
    evt.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.log("Caching app shell")
            return cache.addAll(filesToCache)
        })
    )
})

//activate serviceworker
self.addEventListener("activate", evt => {
    console.log("serviceworker has been activated")
    //tjek efter andre caches
    evt.waitiUntil(
        caches.keys()
        .then(cacheNames => {
            console.log(cacheNames)
            //returner et promise når alt andet er kørt
            return Promise.all(
                cacheNames.filter(oldCache => cacheName !== oldCache)
                .map(cacheName => caches.delete(cacheName))
            )
        })
    )
})

//cache first
self.addEventListener("fetch", evt => {
    evt.respondWith(caches.match(evt.request)
        .then(response => {
            return response || fetch(evt.request)
        })
        .catch(err => caches.match("offline.html"))
    )
})
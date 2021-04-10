// var CACHE_NAME = 'dependencies-cache3';
self.addEventListener('install', function (event) {
    console.log('[install] Kicking off service worker registration!');

    // fetch('https://raw.githubusercontent.com/oeeckhoutte/leandeep.com/master/algolia.json').then(function (response) {
    //     return response.json();
    // }).then(function (files) {
    //     console.log('[install] Adding files from JSON file: ', files);
    //     // cache.put('https://raw.githubusercontent.com/oeeckhoutte/leandeep.com/master/algolia.json', files);
    //     // Get the client.

    //     return files;
    //     // return cache.addAll(files);


    // });
    // event.waitUntil(
    //     caches.open(CACHE_NAME)
    //         .then(function (cache) {
    //             return fetch('https://raw.githubusercontent.com/oeeckhoutte/leandeep.com/master/algolia.json').then(function (response) {
    //                 return response.json();
    //             }).then(function (files) {
    //                 console.log('[install] Adding files from JSON file: ', files);
    //                 // cache.put('https://raw.githubusercontent.com/oeeckhoutte/leandeep.com/master/algolia.json', files);

    //                 return
    //                 // return cache.addAll(files);
    //             });
    //         })
    //         .then(function () {
    //             console.log(
    //                 '[install] All required resources have been cached;',
    //                 'the Service Worker was successfully installed!'
    //             );
    //             return self.skipWaiting();
    //         })
    // );
});

ALREADY_LOADED = false;
addEventListener('fetch', event => {
    if (ALREADY_LOADED === false) {
        ALREADY_LOADED = true;
        event.waitUntil(async function () {


            // Exit early if we don't have access to the client.
            // Eg, if it's cross-origin.
            if (!event.clientId) {
                console.log("No client")
                return;
            }
            // console.log("event.")
            // console.log(event)
            // Get the client.
            const client = await clients.get(event.clientId);
            // Exit early if we don't get the client.
            // Eg, if it closed.
            if (!client) return;


            fetch('https://raw.githubusercontent.com/oeeckhoutte/leandeep.com/master/algolia.json').then(function (response) {
                return response.json();
            }).then(function (files) {

                console.log('[install] Adding files from JSON file: ', files);
                // cache.put('https://raw.githubusercontent.com/oeeckhoutte/leandeep.com/master/algolia.json', files);
                // Get the client.
                client.postMessage({
                    msg: "Hey I just got a fetch from you!",
                    url: event.request.url,
                    files: files
                });
                return files;
                // return cache.addAll(files);


            });


            // Send a message to the client.


        }());
    }
});


self.addEventListener('activate', function (event) {
    console.log('[activate] Activating service worker!');
    console.log('[activate] Claiming this service worker!');
    event.waitUntil(self.clients.claim());
});


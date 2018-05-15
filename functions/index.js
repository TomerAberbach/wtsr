const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

admin.initializeApp({credential: admin.credential.applicationDefault()});
const db = admin.firestore();

exports.song = functions.https.onRequest((req, res) => {
    console.log(req.body);
    if (req.method === 'POST') {
        return cors(req, res, () => {
            console.log()
            if (req.body['stream_id'] === '16194' && req.body['stream_url'] === 'http://icy3.abacast.com/wtsr-wtsrfm-64') {
                const song = JSON.parse(req.body['data'])['metadata']['music'][0];

                db.collection('songs').doc('song').set({
                    id: song['acrid'],
                    title: song['title'],
                    artists: song['artists'].map(function (artist) {
                        return artist['name'];
                    }),
                    album: song['album']['name'],
                    genres: song['genres'] ? song['genres'].map(function (json) {
                        return json['name'];
                    }) : null,
                    label: song['label'] ? song['label'] : null,
                    external: {
                        spotify: song['external_metadata']['spotify'] ? song['external_metadata']['spotify'] : null,
                        youtube: song['external_metadata']['youtube'] ? song['external_metadata']['youtube']['vid'] : null,
                        deezer: song['external_metadata']['deezer'] ? song['external_metadata']['deezer'] : null
                    }
                });
            }
        });
    }

    return null;
});
'use strict';

function toggleAudio() {
    const audio = document.getElementById('audio');
    const button = document.getElementById('toggle-img');

    if (audio.paused) {
        audio.load();
        audio.play();
        button.src = 'img/audio/stop.svg';
    } else {
        audio.pause();
        button.src = 'img/audio/play.svg';
    }
}

function toggleVolume() {
    const input = document.getElementById('volume-input');
    input.value = input.value <= 0.001 ? 50.0 : 0.0;
    volumeChange();
}

function volumeChange() {
    const input = document.getElementById('volume-input');

    document.getElementById('audio').volume = input.value / 100.0;
    document.getElementById('volume-img').src = 'img/audio/' + (input.value <= 0.001 ? 'mute' : 'volume') + '.svg';
}

document.addEventListener('DOMContentLoaded', () => {
    let app = firebase.app();
    let db = firebase.firestore(app);

    db.collection("songs").doc("song").onSnapshot(doc => {
        let json = doc.data();

        document.getElementById('title-span').innerHTML = json['title'];
        document.getElementById('artist-span').innerHTML = json['artists'].join(', ');
        document.getElementById('album-span').innerHTML = json['album'];

        document.getElementById('genre-div').style.display = json['genres'] ? 'flex' : 'none';
        document.getElementById('genre-span').innerHTML = json['genres'] ? json['genres'].join(', ') : '';

        const spotify = document.getElementById('spotify-a');
        spotify.style.display = json['external']['spotify'] ? '' : 'none';
        spotify.href = json['external']['spotify'] ? 'https://open.spotify.com/track/' + json['external']['spotify']['track']['id'] : '';

        const youtube = document.getElementById('youtube-a');
        youtube.style.display = json['external']['youtube'] ? '' : 'none';
        youtube.href = json['external']['youtube'] ? 'https://www.youtube.com/watch?v=' + json['external']['youtube'] : '';

        const deezer = document.getElementById('deezer-a');
        deezer.style.display = json['external']['deezer'] ? '' : 'none';
        deezer.href = json['external']['deezer'] ? 'https://www.deezer.com/track/' + json['external']['deezer']['track']['id'] : '';
    });
});

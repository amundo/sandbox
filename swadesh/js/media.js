app.record = document.querySelector('#record');
app.stop   = document.querySelector('#stop');
app.status   = document.querySelector('#status');

navigator.mozGetUserMedia(
  { audio: true },
  function(stream) {
    app.mediaRecorder = new MediaRecorder(stream);

    app.record.onclick = function() {
      app.mediaRecorder.start();
      app.status.textContent = 'recording…';
      app.origin = performance.now();
    }

    app.stop.onclick = function() {
      app.mediaRecorder.stop();
      app.status.textContent = 'finished.';
    }

    app.mediaRecorder.ondataavailable = function(e) {
      var recording    = document.querySelector('#recording'),
          p = document.createElement('p');
          audio = document.createElement('audio');

      audio.setAttribute('controls', '');
      audio.setAttribute('download', 'swadesh.ogg');
      var audioURL = window.URL.createObjectURL(e.data);

      audio.src = audioURL;
      p.appendChild(audio);
      recording.appendChild(p);
    }
  },
  function(err){
    console.log(err);
  }
);

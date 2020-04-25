odoo.define("survey_asl_question.survey", function (require) {
  "use strict";

  require("web.dom_ready");
  var ajax = require("web.ajax");
  var core = require("web.core");

  var _t = core._t;

  var readGPSButton;
  var recorder;
  var recordAudioButton;
  var recordAudioInput;

  $(document).ready(function () {
    readGPSButton = document.getElementById("read_gps_button");
    if (readGPSButton) {
      readGPSButton.addEventListener("click", readGPS);
    }

    recordAudioButton = document.getElementById("read_audio_button");
    recordAudioInput = document.getElementById("read_audio_input");
    if (recordAudioButton && recordAudioInput) {
      recordAudioButton.addEventListener("click", recordAudio);
    }
  });

  function readGPS() {
    navigator.geolocation.getCurrentPosition(function (location) {
      var input = document.getElementById("response_gps_button");

      input.value = `${location.coords.latitude},${location.coords.longitude},${location.coords.accuracy}`;
    });
  }

  function saveAudio(blob) {
    var url = URL.createObjectURL(blob);
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64Audio = reader.result;
      recordAudioInput.value = base64Audio.split(",")[1];
    };
  }

  function stopRecordAudio(stream) {
    recordAudioButton.disabled = false;
    recorder.stop();
    stream.getAudioTracks()[0].stop();
    recorder.exportWAV(saveAudio);
  }

  function recordAudio() {
    recordAudioButton.disabled = true;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        var audioContext = new AudioContext();
        var input = audioContext.createMediaStreamSource(stream);
        recorder = new Recorder(input, { numChannels: 1 });
        recorder.record();

        setTimeout(stopRecordAudio.bind(null, stream), 3000);
      })
      .catch(function (err) {
        recordAudioButton.disabled = false;
      });
  }
});

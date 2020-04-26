odoo.define("survey_asl_question.survey", function (require) {
  "use strict";

  require("web.dom_ready");
  var ajax = require("web.ajax");
  var core = require("web.core");

  var _t = core._t;

  $.fn.exists = function (callback) {
    if (this.length) {
      var args = [].slice.call(arguments, 1);
      callback.call(this, args);
    }
    return this;
  };

  var recorder;
  var recordAudioButton;
  var recordAudioInput;
  var recordDuration;

  recordAudioButton = document.getElementById("read_audio_button");
  recordAudioInput = document.getElementById("read_audio_input");
  if (recordAudioButton && recordAudioInput) {
    recordAudioButton.addEventListener("click", recordAudio);
  }

  $("#read_gps_button").exists(function () {
    if (!navigator.geolocation) {
      $(".js_errzone")
        .text(
          "Su navegador no soporta Geolocalización en este dispositivo. Inténtelo con otro"
        )
        .show();

      return;
    }

    const success = function (location) {
      $("#response_gps_button").val(
        `${location.coords.latitude},${location.coords.longitude},${location.coords.accuracy}`
      );

      $(".js_infozone").text("Posicionado").show();
    };

    const error = function () {
      $(".js_errzone").text("No ha sido posible ubicar el dispositivo").show();
    };

    this.click(function () {
      $(".js_infozone").text("Posicionando...").show();

      navigator.geolocation.getCurrentPosition(success, error);
    });
  });

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

  function recordCountdown(time) {
    if (time <= 0) {
      $(".js_infozone").hide();

      return;
    }

    $(".js_infozone").show();
    $(".js_infozone").text(`Quedan ${time / 1000} segundos`);

    setTimeout(recordCountdown.bind(null, time - 1000), 1000);
  }

  function recordAudio() {
    recordAudioButton.disabled = true;
    recordDuration = $("#read_audio_input").data("audio_duration");

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        var audioContext = new AudioContext();
        var input = audioContext.createMediaStreamSource(stream);
        recorder = new Recorder(input, { numChannels: 1 });
        recorder.record();

        setTimeout(stopRecordAudio.bind(null, stream), recordDuration);
        setTimeout(recordCountdown.bind(null, recordDuration), 0);
      })
      .catch(function (err) {
        recordAudioButton.disabled = false;
      });
  }
});

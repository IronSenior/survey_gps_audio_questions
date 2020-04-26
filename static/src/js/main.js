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

  $.fn.message = function (callback) {
    if (this.length) {
      const [message, isError] = arguments;

      if (isError) {
        this.removeClass("alert-success").addClass("alert-danger");
      } else {
        this.removeClass("alert-danger").addClass("alert-success");
      }

      this.text(message);
      this.show();
    }

    return this;
  };

  $("#aulasl_audio_button").exists(function () {
    const audioButton = $("#aulasl_audio_button");
    const audioDuration = audioButton.data("audio_duration");
    let audioRecorder;

    audioButton.on("click", function () {
      console.debug("button audio");
      audioButton.prop("disabled", true);

      const refreshProgress = function (current) {
        const progress = $("#aulasl_audio_progress");

        if (current >= audioDuration) {
          progress.css("width", "100%");

          return;
        }

        const width = (current / audioDuration) * 100;
        progress.css("width", `${width}%`);

        setTimeout(refreshProgress.bind(null, current + 1000), 1000);
      };

      const save = function (blob) {
        const reader = new FileReader();

        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const base64Audio = reader.result.split(",")[1];
          $("#aulasl_audio_input").val(base64Audio);
          $("#aulasl_audio_alert").message("Grabación terminada");
        };
      };

      const stop = function (stream) {
        audioButton.prop("disabled", false);
        audioRecorder.stop();
        stream.getAudioTracks()[0].stop();
        audioRecorder.exportWAV(save);
      };

      const success = function (stream) {
        const audioContext = new AudioContext();
        const input = audioContext.createMediaStreamSource(stream);

        audioRecorder = new Recorder(input, { numChannels: 1 });
        audioRecorder.record();

        setTimeout(stop.bind(null, stream), audioDuration);
        setTimeout(refreshProgress.bind(null, 0), 0);
      };

      const error = function (error) {
        audioButton.prop("disabled", false);

        if (
          error.name === "PermissionDeniedError" ||
          error.name === "NotAllowedError"
        ) {
          $("#aulasl_audio_alert").message(
            "Error al acceder al micrófono. Deberá otorgar permisos para continuar",
            true
          );

          return;
        }

        $("#aulasl_audio_alert").message(
          "Error desconocido al acceder al micrófono: " + error.name,
          true
        );
      };

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(success)
        .catch(error);
    });
  });

  $("#aulasl_gps_button").exists(function () {
    if (!navigator.geolocation) {
      $("#aulasl_gps_alert").message(
        "Su navegador no soporta Geolocalización en este dispositivo. Inténtelo con otro",
        true
      );

      return;
    }

    const success = function (location) {
      $("#aulasl_gps_input").val(
        `${location.coords.latitude},${location.coords.longitude},${location.coords.accuracy}`
      );

      $("#aulasl_gps_alert").message("Posicionado");

      const mapImage = $("#aulasl_gps_map");
      const apiKey = mapImage.data("google_api_key");

      if (!apiKey) {
        return;
      }

      const mapSource =
        "https://maps.googleapis.com/maps/api/staticmap?" +
        `center=${location.coords.latitude},${location.coords.longitude}` +
        `&markers=${location.coords.latitude},${location.coords.longitude}` +
        "&zoom=16&size=800x400&sensor=false" +
        `&key=${apiKey}`;

      mapImage.attr("src", mapSource);
    };

    const error = function () {
      $("#aulasl_gps_alert").message(
        "No ha sido posible ubicar el dispositivo",
        true
      );
    };

    this.click(function () {
      $("#aulasl_gps_alert").message("Posicionando...");

      navigator.geolocation.getCurrentPosition(success, error);
    });
  });
});

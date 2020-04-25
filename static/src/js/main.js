odoo.define("survey_asl_question.survey", function (require) {
  "use strict";

  require("web.dom_ready");
  var ajax = require("web.ajax");
  var core = require("web.core");

  var _t = core._t;

  $(document).ready(function () {
    var readGPSButton = document.getElementById("read_gps_button");
    if (readGPSButton) {
      readGPSButton.addEventListener("click", readGPS);
    }
  });

  function readGPS() {
    navigator.geolocation.getCurrentPosition(function (location) {
      var input = document.getElementById("response_gps_button");

      input.value = `${location.coords.latitude},${location.coords.longitude},${location.coords.accuracy}`;
    });
  }
});

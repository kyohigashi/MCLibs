define(function(require) {
    var $ = require('jquery');

    function mainBase() {}
    mainBase.prototype = {
        isFinishLoading: false,
        loadingDiv: "",
        init: function() {
            $("#loadmodelButtonSkyDrive").click(function() {
                World.loadModelsAndTrackers(appTargets);
                World.controller.isFinishLoading = true;
            });
        },
        modelDidLoad: function() {
            World.controller.isFinishLoading = false;
        }
    };
    var World = require('app/wikitudeWorld');
    World.controller = new mainBase();
    return World.controller;
});
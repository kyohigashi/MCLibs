define(function(require) {
    var $ = require('jquery');
    $(function() {
        //Display backbone and underscore versions
        $("#loadBuildingWithText").click(function() {
            require('vex').dialog.open({
                message: 'Select a the building.',
                input: ['<style>',
                    '.vex-custom-field-wrapper {',
                    'margin: 1em 0;',
                    '}',
                    '.vex-custom-field-wrapper > label {',
                    'display: inline-block;',
                    'margin-bottom: .2em;',
                    '}',
                    '</style>',
                    '<div class="vex-custom-field-wrapper">',
                    'I love HK: <input id="input1" type="checkbox" name="FirstName" value="ICC_ilovehk_0901.wt3">',
                    '</div>',
                    '<div class="vex-custom-field-wrapper">',
                    'ICC happy birthday: <input type="checkbox" name="FirstName" value="ICC_happybirthday_0901.wt3">',
                    '</div>'
                ].join(''),
                callback: function(data) {
                    if (!data) {
                        return console.log('Cancelled')
                    } else {
                        World.loadModeAndTracker("assets/ICC_happybirthday_0901.wt3", ["Night_set_animation", "cloud_grp_animaton", "happy_birthday5_animation"]);
                        // World.loadModeAndTracker("ICC_ilovehk_0901",["I_love_HK4_anima"]);
                    }
                }
            })
        });
        $("#loadmodelButtonSkyDrive").click(function() {
            World.loadDayModeAndTracker();
        });
        $("#loadmodelButtonSmallBuild").click(function() {
            World.loadModeAndTracker("assets/ICC_happybirthday_0901.wt3", ["Night_set_animation", "cloud_grp_animaton", "happy_birthday5_animation"]);
        });
        $("#input1").on('change', function() {
            alert('input1');
        });
        $("#input2").on('change', function() {
            alert('input2');
        });
    });

    function mainBase() {}
    mainBase.prototype = {};
    return mainBase;
});
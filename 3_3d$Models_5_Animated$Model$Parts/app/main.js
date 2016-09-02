define(function(require) {
    var $ = require('jquery');
    $(function() {
        //Display backbone and underscore versions
        $("#selectBuidling").click(function() {
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
                        if (World.modelName == "ICC_ilovehk_0901.wt3") {
                            World.loadModeAndTracker("assets/ICC_happybirthday_0901.wt3", ["Night_set_ani b bmation", "cloud_grp_animaton", "happy_birthday5_animation"]);
                        }else{
                            World.loadModeAndTracker("assets/ICC_ilovehk_0901.wt3",["I_love_HK4_anima"]);
                        }
                    }
                }
            });

            $('input[value="' + World.modelName +'"]').prop('checked', true);
            $('input[type="checkbox"]').on('change', function() {
                $('input[type="checkbox"]').not(this).prop('checked', false);
                World.modelName = this.getAttribute("value");
            });

        });
        $("#loadmodelButtonSkyDrive").click(function() {
            World.loadDayModeAndTracker();
        });
        $("#loadmodelButtonSmallBuild").click(function() {
            World.loadModeAndTracker("assets/ICC_happybirthday_0901.wt3", ["Night_set_animation", "cloud_grp_animaton", "happy_birthday5_animation"]);
        });

    });

    function mainBase() {}
    mainBase.prototype = {};
    return mainBase;
});
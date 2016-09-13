define(function(require) {
    var $ = require('jquery');

    function mainBase() {}
    mainBase.prototype = {
        loadingDiv: "<div id='loadingbox' class='loader'></div>",
        init: function() {
            var selector = "";
            $(function() {
                $("#selectBuidling").click(function() {

                    var i = ['<style>',
                        '.vex-custom-field-wrapper {',
                        'margin: 1em 0;',
                        '}',
                        '.vex-custom-field-wrapper > label {',
                        'display: inline-block;',
                        'margin-bottom: .2em;',
                        '}',
                        '</style>',
                        '<div class="vex-custom-field-wrapper">',
                        'I love HK: <input id="input1" type="checkbox" name="FirstName" value="assets/ICC_ilovehk_0901.wt3">',
                        '</div>',
                        '<div class="vex-custom-field-wrapper">',
                        'ICC happy birthday: <input type="checkbox" name="FirstName" value="assets/ICC_happybirthday_0902_V3_NIGHT.wt3">',
                        '</div>'
                    ].join('');

                    require('vex').dialog.open({
                        message: 'Select a the building.',
                        input: i,
                        callback: function(data) {
                            if (!data) {
                                return console.log('Cancelled')
                            } else {
                                try {
                                    if (selector == "assets/ICC_happybirthday_0902_V3_NIGHT.wt3") {
                                        World.loadModeAndTracker("assets/ICC_happybirthday_0902_V3_NIGHT.wt3", ["Night_set_animation", "cloud_grp_animaton", "happy_birthday5_animation"]);
                                    } else {
                                        World.loadModeAndTracker("assets/ICC_ilovehk_0901.wt3", ["I_love_HK4_animation"]);
                                    }
                                } catch (err) {
                                    console.log(err);
                                }

                            }
                        }
                    });

                    $('input[value="' + World.modelName + '"]').prop('checked', true);
                    $('input[type="checkbox"]').on('change', function() {
                        $('input[type="checkbox"]').not(this).prop('checked', false);
                        selector = this.getAttribute("value");
                    });

                });
                $("#loadmodelButtonSkyDrive").click(function() {
                    World.loadDayModeAndTracker();
                });
                $("#loadmodelButtonSmallBuild").click(function() {
                    World.loadModeAndTracker("assets/ICC_happybirthday_0912_DAY.wt3", ["Day_set_animation", "happy_birthday5_animation"], "Small-ICC-chop");
                    setTimeout(function() {
                        World.loadModeAndTracker("assets/ICC_happybirthday_0912_DAY.wt3", ["Night_set_animation", "happy_birthday5_animation"], "Small-ICC-firework-version-chop");
                    },3000);

                });

            });
        },
        modelDidLoad: function() {
            $( ".loader" ).remove();
            var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
            var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
            var e = "";

            if (World.modelName != "" && false) {
                e = "<div" + cssDivLeft + ">Scan Sky100 Tracker Image:</div>" +
                    "<div" + cssDivRight + "><img src='assets/small-icc2.jpg'></img></div>";
                $('#selectBuidling').empty().append("<button id='loadBuildingWithText' class='hs-brand-button'>SelectBuilding</button>");
            } else {
                e = "<div" + cssDivLeft + ">Scan Sky100 Tracker Image:</div>" +
                    "<div" + cssDivRight + "><img src='assets/skyline.jpg'></img></div>";
            }
            $('#modelbutton').empty();
            $('#modelbutton2').empty();
            $('#loadingMessage').empty().append(e);

            // Remove Scan target message after 10 sec.
            // setTimeout(function() {
            //     var jquery = require('jquery');
            //     jquery('#loadingMessage').empty();
            // }, 10000);
        },
        modelOnLoading: function() {
            $("body").append(this.loadingDiv);
        }
    };
    var World = require('app/wikitudeWorld');
    World.controller = new mainBase();
    return World.controller;
});
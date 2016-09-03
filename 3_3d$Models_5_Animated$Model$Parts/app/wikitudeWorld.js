define(function(require) {
	var $ = require('jquery');
	var World = {
		modelName: "",
		loaded: false,
		trackableVisible: false,
		targetModels: [],
		animations: [],

		init: function() {
			this.createOverlays();
		},
		clearModel: function() {
			var i;
			for (i in this.animations) {
				this.animations[i].destroy();
			}
			var j;
			for (j in this.targetModels) {
				this.targetModels[j].destroy();
			}
			this.tracker = {};
			this.targetModels = [];
			this.animations = [];
		},
		loadDayModeAndTracker: function() {
			this.loadDayModel();
			this.tracker = new AR.Tracker("assets/tracker.wtc", {
				onLoaded: this.loadingStep
			});

			var trackable = new AR.Trackable2DObject(this.tracker, "*", {
				drawables: {
					cam: World.targetModels
				},
				onEnterFieldOfVision: this.appear,
				onExitFieldOfVision: this.disappear
			});

		},
		loadModeAndTracker: function(name, animationNames) {
			this.clearModel();
			this.tracker = new AR.Tracker("assets/tracker.wtc", {
				onLoaded: this.loadingStep
			});

			var trackable = new AR.Trackable2DObject(this.tracker, "Small-ICC-firework-version-chop", {
				drawables: {
					cam: [this.loadModel(name, animationNames)]
				},
				onEnterFieldOfVision: this.appear,
				onExitFieldOfVision: this.disappear
			});
			this.modelName = name;
		},
		loadDayModel: function() {
			var targetModelDay = new AR.Model("assets/skydive_0831.wt3", {
				onLoaded: this.loadingStep,
				/*
					The drawables are made clickable by setting their onClick triggers. Click triggers can be set in the options of the drawable when the drawable is created. Thus, when the 3D model onClick: this.toggleAnimateModel is set in the options it is then passed to the AR.Model constructor. Similar the button's onClick: this.toggleAnimateModel trigger is set in the options passed to the AR.ImageDrawable constructor. toggleAnimateModel() is therefore called when the 3D model or the button is clicked.
					Inside the toggleAnimateModel() function, it is checked if the animation is running and decided if it should be started, resumed or paused.
				*/
				scale: {
					x: 0.005,
					y: 0.005,
					z: 0.005
				},
				translate: {
					x: 0.0,
					y: -0.75,
					z: 0.0
				},
				rotate: {
					roll: 90,
					heading: 90
				}
			});
			this.animations.push(new AR.ModelAnimation(targetModelDay, "group3_animation"));
			if (this.targetModels.length > 0) {
				this.targetModels.pop();
			}
			this.targetModels.push(targetModelDay);
		},
		loadModel: function(file, animationNames) {
			var targetModelNight = new AR.Model(file, {
				onLoaded: this.loadingStep,
				/*
					The drawables are made clickable by setting their onClick triggers. Click triggers can be set in the options of the drawable when the drawable is created. Thus, when the 3D model onClick: this.toggleAnimateModel is set in the options it is then passed to the AR.Model constructor. Similar the button's onClick: this.toggleAnimateModel trigger is set in the options passed to the AR.ImageDrawable constructor. toggleAnimateModel() is therefore called when the 3D model or the button is clicked.
					Inside the toggleAnimateModel() function, it is checked if the animation is running and decided if it should be started, resumed or paused.
				*/
				scale: {
					x: 0.003,
					y: 0.003,
					z: 0.003
				},
				translate: {
					x: 0.0,
					y: 0.05,
					z: 0.0
				},
				rotate: {
					roll: 0
				}
			});
			if (typeof animationNames != "undefined") {
				var i;
				for (i in animationNames) {
					this.animations.push(new AR.ModelAnimation(targetModelNight, animationNames[i]));
				}
			}
			this.targetModels.push(targetModelNight);
			return targetModelNight;
		},
		createOverlays: function() {
			this.imageResource = new AR.ImageResource("assets/car.png");
			this.markerDrawable_idle = new AR.ImageDrawable(this.imageResource, 2.5, {
				zOrder: 0,
				opacity: 1.0
			});
		},

		loadingStep: function() {
			if (World.targetModels.length > 0 && World.targetModels[0].isLoaded() && World.tracker.isLoaded()) {
				World.loaded = true;

				var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
				var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
				var e =
					"<div" + cssDivLeft + ">Scan Sky100 Tracker Image:</div>" +
					"<div" + cssDivRight + "><img src='assets/small-icc.jpg'></img></div>"
				"<div" + cssDivRight + "><img src='assets/small-icc2.jpg'></img></div>";

				$('#loadingMessage').empty().append(e);
				$('#selectBuidling').empty().append("<button id='loadBuildingWithText' class='hs-brand-button'>SelectBuilding</button>");
				$('#modelbutton').empty();
				$('#modelbutton2').empty();
				// Remove Scan target message after 10 sec.
				setTimeout(function() {
					var e = document.getElementById('loadingMessage');
					e.parentElement.removeChild(e);

				}, 10000);

				if (World.trackableVisible) {
					var appearingAnimation = this.createAppearingAnimation(World.targetModels[0], 0.045);
					appearingAnimation.appearingAnimation.start();
				}

			}
		},
		createAppearingAnimation: function(model, scale) {
			/*
				The animation scales up the 3D model once the target is inside the field of vision. Creating an animation on a single property of an object is done using an AR.PropertyAnimation. Since the car model needs to be scaled up on all three axis, three animations are needed. These animations are grouped together utilizing an AR.AnimationGroup that allows them to play them in parallel.

				Each AR.PropertyAnimation targets one of the three axis and scales the model from 0 to the value passed in the scale variable. An easing curve is used to create a more dynamic effect of the animation.
			*/
			var sx = new AR.PropertyAnimation(model, "scale.x", 0, scale, 1500, {
				type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
			});
			var sy = new AR.PropertyAnimation(model, "scale.y", 0, scale, 1500, {
				type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
			});
			var sz = new AR.PropertyAnimation(model, "scale.z", 0, scale, 1500, {
				type: AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC
			});

			return new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [sx, sy, sz]);
		},
		appear: function() {
			World.trackableVisible = true;
			World.startModelAnimation();
		},
		startModelAnimation: function() {
			// Resets the properties to the initial values.
			if (World.loaded && typeof World.targetModels != "undefined") {
				var i;
				for (i in World.animations) {
					try {
						World.animations[i].start(200);
					} catch (err) {}
				}
			}
		},
		disappear: function() {
			World.trackableVisible = false;
		},
		resetModel: function() {
			if (typeof World.targetModels[0] != "undefined") {
				World.targetModels[0].rotate.roll = -25;
			}
			if (typeof World.targetModels[0] != "undefined") {
				World.targetModels[0].rotate.roll = -25;
			}
		}

	};

	World.init();
	return World;
});
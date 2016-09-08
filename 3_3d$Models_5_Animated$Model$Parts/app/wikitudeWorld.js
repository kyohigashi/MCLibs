define(function(require) {
	var $ = require('jquery');
	var World = {
		controller: {},
		modelName: "",
		loaded: false,
		trackableVisible: false,
		targetModels: [],
		animations: [],
		targets: [],
	    oldTarget: {},

		init: function() {
			this.createOverlays();
		},
		clearModel: function(target) {
			var i;
			for (i in target.animations) {
				target.animations[i].stop();
				target.animations[i].destroy();
			}
			target.model.destroy();
			target.tracker.destroy();
			target.trackable.destroy();
		},
		loadDayModeAndTracker: function() {
			var _modelAndAnimations = this.loadSkyLineModel();
			var t = new AR.ClientTracker("assets/tracker.wtc", {
				onLoaded: this.loadingStep
			});

			var _trackable = new AR.Trackable2DObject(t, "*", {
				drawables: {
					cam: World.targetModels
				},
				onEnterFieldOfVision: this.appear,
				onExitFieldOfVision: this.disappear
			});

			this.targets.push({
				tracker: t,
				trackable: _trackable,
				model: _modelAndAnimations.model,
				animations: modelAndAnimations.animations
			});

		},
		loadModeAndTracker: function(name, animationNames) {
			var modelAndAnimations = this.loadModel(name, animationNames);
			var _tracker = new AR.ClientTracker("assets/tracker.wtc", {
				onLoaded: this.loadingStep// World.clearModel(modelAndAnimations);
			});
			var _trackable = new AR.Trackable2DObject(_tracker, "Small-ICC-firework-version-chop", {
				drawables: {
					cam: [modelAndAnimations.model]
				},
				onEnterFieldOfVision: this.appear,
				onExitFieldOfVision: this.disappear
			});
			this.targets.push({
				tracker: _tracker,
				trackable: _trackable,
				model: modelAndAnimations.model,
				animations: modelAndAnimations.animations
			});

			this.modelName = name;
			this.oldTarget = this.targets[0];
			// if (this.targets.length > 1) {
			// 	this.oldTarget.tracker.enabled = false;
			// 	this.oldTarget.trackable.enabled = false;
			// 	this.oldTarget.trackable.drawables.cam  = [];
			// }
		},
		loadSkyLineModel: function() {
			var targetModelDay = new AR.Model("assets/skydive_0906_1K.wt3", {
				onLoaded: this.loadingStep,
				/*
					The drawables are made clickable by setting their onClick triggers. Click triggers can be set in the options of the drawable when the drawable is created. Thus, when the 3D model onClick: this.toggleAnimateModel is set in the options it is then passed to the AR.Model constructor. Similar the button's onClick: this.toggleAnimateModel trigger is set in the options passed to the AR.ImageDrawable constructor. toggleAnimateModel() is therefore called when the 3D model or the button is clicked.
					Inside the toggleAnimateModel() function, it is checked if the animation is running and decided if it should be started, resumed or paused.
				*/
				scale: {
					x: 0.011,
					y: 0.011,
					z: 0.011
				},
				translate: {
					x: 0.0,
					y: -0.2,
					z: 0.0
				},
				rotate: {
					tilt: -90
				}
			});
			if (typeof animationNames != "undefined") {
				this.animations = [];
				var i;
				for (i in animationNames) {
					this.animations.push(new AR.ModelAnimation(targetModelDay, "group_animation"));
				}
			}
			this.targetModels.push(targetModelDay);
			return {
				model: targetModelDay,
				animations: this.animations
			};
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
				this.animations = [];
				var i;
				for (i in animationNames) {
					this.animations.push(new AR.ModelAnimation(targetModelNight, animationNames[i]));
				}
			}
			this.targetModels.push(targetModelNight);
			return {
				model: targetModelNight,
				animations: this.animations
			};
		},
		createOverlays: function() {
			this.imageResource = new AR.ImageResource("assets/car.png");
			this.markerDrawable_idle = new AR.ImageDrawable(this.imageResource, 2.5, {
				zOrder: 0,
				opacity: 1.0
			});
		},

		loadingStep: function() {
			if (World.targets.length > 0 && World.targets[0].model.isLoaded() && World.targets[0].tracker.isLoaded()) {
				// if (!World._tracker) {
				// 	World._tracker.destroy();
				// 	alert("tracker.destroy");
				// }
				World.loaded = true;

				if (World.trackableVisible) {
					var appearingAnimation = World.createAppearingAnimation(World.targets[0].model, 0.045);
					appearingAnimation.start();
				}
				World.controller.modelDidLoad();
				World.clearModel(World.oldTarget);
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
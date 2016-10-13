define(function(require) {
	var $ = require('jquery');
	var World = {
		controller: {},
		isLoadingModel: false,
		modelName: "",
		loaded: false,
		trackableVisible: false,
		targetModels: [],
		animations: [],
		targets: [],
		removeTargets: [],

		init: function() {
			this.createOverlays();
		},
		loadDayModeAndTracker: function() {
			if (World.isLoadingModel) {
				return;
			}
			this.isLoadingModel = true;
			World.controller.modelOnLoading();
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
				animations: _modelAndAnimations.animations
			});
			World.isLoadingModel = false;
		},
		loadModelsAndTrackers: function(targets) {
			if (World.isLoadingModel) {
				return;
			}
			this.isLoadingModel = true;
			World.destroyAllTarget();
			World.controller.modelOnLoading();
			var _tracker = new AR.ClientTracker("assets/tracker.wtc", {
				onLoaded: World.loadingStep // World.clearModel(modelAndAnimations);
			});
			var _trackable = new AR.Trackable2DObject(_tracker, "*", {
				drawables: {
					cam: []
				},
				onEnterFieldOfVision: function(targetName) {
					try {
						World.trackableVisible = true;
						for (i in World.targets) {
							if (World.targets[i].targetName === targetName) {
								var target = World.targets[i];
								target.trackable.drawables.addCamDrawable(target.model, 0);
								setTimeout(function() {
									World.loadAnimationWithTarget(target);
									World.startModelAnimationWithTarget(target);
								}, 200);
							}
						}
					} catch (err) {
						console.log(err);
					}
				},
				onExitFieldOfVision: function() {
					try {
						World.trackableVisible = false;
						World.targets[0].trackable.drawables.removeCamDrawable(0);
					} catch (err) {
						console.log(err);
					}
				}
			});
			var i;
			var target;
			for (i in targets) {
				target = targets[i];
				var modelAndAnimations = World.loadModel(target.modelName, target.animationNames, false);
				World.targets.push({
					tracker: _tracker,
					trackable: _trackable,
					model: modelAndAnimations.model,
					animations: modelAndAnimations.animations,
					animationNames: target.animationNames,
					targetName: target.targetName
				});
			}
			World.modelName = "*";
			World.isLoadingModel = false;
		},
		loadModeAndTracker: function(name, animationNames, targetName) {
			if (World.isLoadingModel) {
				return;
			}
			this.isLoadingModel = true;
			var oldTarget = null;
			if (this.targets.length > 0) {
				try {
					oldTarget = this.targets.shift();
					oldTarget.trackable.drawables.removeCamDrawable(0);
					oldTarget.tracker.enabled = false;
					oldTarget.model.destroy();
					var i;
					for (i in oldTarget.animations) {
						oldTarget.animations[i].stop();
						oldTarget.animations[i].destroy();
					}
					oldTarget.tracker.destroy();
					// oldTarget.trackable.destroy();
					this.removeTargets.push(oldTarget);
				} catch (err) {
					console.log(err);
				}

			}
			World.controller.modelOnLoading();
			setTimeout(function() {
				try {
					if (oldTarget !== null) {
						oldTarget.trackable.destroy();
					}
				} catch (err) {
					console.log(err);
				}

				var modelAndAnimations = World.loadModel(name, animationNames, true);
				var _tracker = new AR.ClientTracker("assets/tracker.wtc", {
					onLoaded: World.loadingStep // World.clearModel(modelAndAnimations);
				});
				var _trackable = new AR.Trackable2DObject(_tracker, targetName, {
					drawables: {
						cam: [modelAndAnimations.model]
					},
					onEnterFieldOfVision: function(targetName) {
						World.trackableVisible = true;
						World.startModelAnimation();
					},
					onExitFieldOfVision: function() {
						World.trackableVisible = false;

					}
				});
				World.targets.push({
					tracker: _tracker,
					trackable: _trackable,
					model: modelAndAnimations.model,
					animations: modelAndAnimations.animations
				});

				World.modelName = name;
				World.isLoadingModel = false;
			}, 2000);
		},
		loadSkyLineModel: function() {
			var targetModelDay = new AR.Model("assets/skydive_0914.wt3", {
				onLoaded: this.loadingStep,
				/*
					The drawables are made clickable by setting their onClick triggers. Click triggers can be set in the options of the drawable when the drawable is created. Thus, when the 3D model onClick: this.toggleAnimateModel is set in the options it is then passed to the AR.Model constructor. Similar the button's onClick: this.toggleAnimateModel trigger is set in the options passed to the AR.ImageDrawable constructor. toggleAnimateModel() is therefore called when the 3D model or the button is clicked.
					Inside the toggleAnimateModel() function, it is checked if the animation is running and decided if it should be started, resumed or paused.
				*/
				scale: {
					x: 0.021,
					y: 0.021,
					z: 0.021
				},
				translate: {
					x: 0.0,
					y: 0.0,
					z: 0.0
				},
				rotate: {
					tilt: -90
				}
			});
			this.animations = [];
			this.animations.push(new AR.ModelAnimation(targetModelDay, "group_animation"));
			this.targetModels.push(targetModelDay);
			return {
				model: targetModelDay,
				animations: this.animations
			};
		},
		loadModel: function(file, _animationNames, isloadAnimations) {
			var targetModelNight = new AR.Model(file, {
				onLoaded: this.loadingStep,
				/*
					The drawables are made clickable by setting their onClick triggers. Click triggers can be set in the options of the drawable when the drawable is created. Thus, when the 3D model onClick: this.toggleAnimateModel is set in the options it is then passed to the AR.Model constructor. Similar the button's onClick: this.toggleAnimateModel trigger is set in the options passed to the AR.ImageDrawable constructor. toggleAnimateModel() is therefore called when the 3D model or the button is clicked.
					Inside the toggleAnimateModel() function, it is checked if the animation is running and decided if it should be started, resumed or paused.
				*/
				scale: {
					x: 0.014,
					y: 0.014,
					z: 0.014
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
			var _animations = [];
			if (typeof animationNames != "undefined" && isloadAnimations) {
				var i;
				for (i in animationNames) {
					alert(animationNames[i]);
					_animations.push(new AR.ModelAnimation(targetModelNight, animationNames[i]));
				}
			}
			return {
				model: targetModelNight,
				animations: _animations,
				animationNames: _animationNames
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
				World.loaded = true;
				World.controller.modelDidLoad();
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
					} catch (err) {
						console.log(err);
					}
				}
			}
		},
		startModelAnimationWithTarget: function(target) {
			// Resets the properties to the initial values.
			if (World.loaded && typeof target.model != "undefined") {
				var i;
				for (i in target.animations) {
					try {
						if (target.animations[i] === null) {
							break;
						}
						if (target.animations[i].isRunning()) {
							target.animations[i].resume();
						} else {
							console.log(target.animations[i]);
							target.animations[i].start(-1);
						}
					} catch (err) {
						console.log(err);
					}
				}
			}
		},
		loadAnimationWithTarget: function(target) {
			try {
				var j;
				for (j in target.animations) {
						if (target.animations[i] === null) {
							break;
						}
					target.animations[j].stop();
					target.animations[j].destroy();
				}
				target.animations = [];
				var i;
				for (i in target.animationNames) {
					target.animations.push(new AR.ModelAnimation(target.model, target.animationNames[i]));
				}
			} catch (err) {
				console.log(err);
			}
		},
		destroyAllTarget: function() {
			try {
				var i;
				for (i in World.targets) {
					var target = World.targets[i];
					target.trackable.drawables.removeCamDrawable(0);
					target.tracker.enabled = false;
					var j;
					for (j in target.animations) {
						target.animations[j].stop();
						target.animations[j].destroy();
					}
					target.model.destroy();
				}
				World.targets = [];
			} catch (err) {
				console.log(err);
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
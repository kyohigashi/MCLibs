define(function(require) {
	var $ = require('jquery');
	var World = {
		controller: {},
		isLoadingModel: false,
		modelName: "",
		loaded: false,
		trackableVisible: false,
		targets: [],

		init: function() {
			this.loadModelsAndTrackers(appTargets);
		},
		loadModelsAndTrackers: function(targets) {
			if (World.isLoadingModel) {
				return;
			}
			this.isLoadingModel = true;
			var _tracker = new AR.ClientTracker("assets/tracker.wtc", {
				onLoaded: World.loadingStep
			});

			var i;
			var target;
			for (i in targets) {
				target = targets[i];
				var modelAndAnimations = World.loadModel(target.modelName, target.animationNames, true);
				this.targets.push({
					targetName: target.targetName,
					modelAndAnimations: modelAndAnimations
				});
				if (modelAndAnimations === null)
					break;

				var _trackable = new AR.Trackable2DObject(_tracker, target.targetName, {
					drawables: {
						cam: [modelAndAnimations.model]
					},
					onEnterFieldOfVision: function() {
						try {
							World.startModelAnimationWithTarget(this.targetName);
						} catch (err) {
							console.log(err);
						}
					},
					onExitFieldOfVision: function() {

					}
				});
			}
			World.modelName = "*";
			World.isLoadingModel = false;
		},
		loadModel: function(file, _animationNames, isloadAnimations) {
			try {
				var _model = new AR.Model(file, {
					onLoaded: this.loadingStep,
					/*
						The drawables are made clickable by setting their onClick triggers. Click triggers can be set in the options of the drawable when the drawable is created. Thus, when the 3D model onClick: this.toggleAnimateModel is set in the options it is then passed to the AR.Model constructor. Similar the button's onClick: this.toggleAnimateModel trigger is set in the options passed to the AR.ImageDrawable constructor. toggleAnimateModel() is therefore called when the 3D model or the button is clicked.
						Inside the toggleAnimateModel() function, it is checked if the animation is running and decided if it should be started, resumed or paused.
					*/
					scale: modelScaling,
					translate: {
						x: 0.0,
						y: 0.0,
						z: 0.0
					},
					rotate: {
						roll: 0
					}
				});
				var _animations = [];
				if (typeof _animationNames != "undefined" && isloadAnimations) {
					var i;
					for (i in _animationNames) {
						_animations.push(new AR.ModelAnimation(_model, _animationNames[i]));
					}
				}
				return {
					model: _model,
					animations: _animations,
					animationNames: _animationNames
				};
			} catch (err) {
				console.log(err);
			}
			return null;
		},
		loadingStep: function() {
			console.log("loadingStep");
			World.controller.modelDidLoad();
		},
		appear: function() {
			World.trackableVisible = true;
		},
		startModelAnimationWithTarget: function(targetName) {
			// Resets the properties to the initial values.
			var k;
			var target;
			for (k in this.targets) {
				if (this.targets[k].targetName === targetName) {
					target = this.targets[k].modelAndAnimations;
					break;
				}
			}
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
		}
	};

	World.init();
	return World;
});
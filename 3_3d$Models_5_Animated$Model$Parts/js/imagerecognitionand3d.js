var World = {
	loaded: false,
	trackableVisible: false,
	targetModels: [],
	animations: [],

	init: function() {
		this.createOverlays();
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
	loadNightModeAndTracker: function() {
		
		this.tracker = new AR.Tracker("assets/tracker.wtc", {
			onLoaded: this.loadingStep
		});

		var trackable = new AR.Trackable2DObject(this.tracker, "Small-ICC-firework-version-chop", {
			drawables: {
				cam: [this.loadNightModel("assets/night_set.wt3", [])]
			},
			onEnterFieldOfVision: this.appear,
			onExitFieldOfVision: this.disappear
		});

		var trackable2 = new AR.Trackable2DObject(this.tracker, "Small-ICC-chop", {
			drawables: {
				cam: [this.loadNightModel("assets/night_set.wt3", [])]
			},
			onEnterFieldOfVision: this.appear,
			onExitFieldOfVision: this.disappear
		});
	},
	loadDayModel: function() {
		var targetModelDay = new AR.Model("assets/Day_set_0829_modify.wt3", {
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
		this.animations.push(new AR.ModelAnimation(targetModelDay, "I_love_HK4_animation"));
		if (this.targetModels.length > 0) {
			this.targetModels.pop();
		}
		this.targetModels.push(targetModelDay);
	},
	loadNightModel: function(file,animationNames) {
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

		this.animations.push(new AR.ModelAnimation(targetModelNight, "Night_set_animation"));
		this.animations.push(new AR.ModelAnimation(targetModelNight, "happy_birthday5_animation"));

		// if (this.targetModels.length > 0) {
		// 	this.targetModels.pop();
		// }
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
		alert("loadingStep");
		if (World.targetModels.length > 0 && World.targetModels[0].isLoaded() && World.tracker.isLoaded()) {
			World.loaded = true;
			alert("World.loaded");

			var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
			var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
			document.getElementById('loadingMessage').innerHTML =
				"<div" + cssDivLeft + ">Scan CarAd Tracker Image:</div>" +
				"<div" + cssDivRight + "><img src='assets/car.png'></img></div>";
			// Remove Scan target message after 10 sec.
			setTimeout(function() {
				var e = document.getElementById('loadingMessage');
				e.parentElement.removeChild(e);

			}, 10000);

			var b1 = document.getElementById('modelbutton');
			var b2 = document.getElementById('modelbutton2');
			b1.parentElement.removeChild(b1);
			b2.parentElement.removeChild(b2);
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
		alert("startModelAnimation");
		if (World.loaded && typeof World.targetModels != "undefined") {
			var i;
			for (i in World.animations) {
				World.animations[i].start(200);
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
var World = {
loaded: false,
rotating: false,
    
dayAnimation1: null,
nightAnimation1: null,
    
init: function initFn() {
    this.createOverlays();
},
    
createOverlays: function createOverlaysFn() {
    /*
     First an AR.ClientTracker needs to be created in order to start the recognition engine. It is initialized with a URL specific to the target collection. Optional parameters are passed as object in the last argument. In this case a callback function for the onLoaded trigger is set. Once the tracker is fully loaded the function loadingStep() is called.
     
     Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
     Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.
     */
    this.tracker = new AR.ClientTracker("assets/tracker.wtc", {
                                        
                                        });
    
    /*
     3D content within Wikitude can only be loaded from Wikitude 3D Format files (.wt3). This is a compressed binary format for describing 3D content which is optimized for fast loading and handling of 3D content on a mobile device. You still can use 3D models from your favorite 3D modeling tools (Autodesk® Maya® or Blender) but you'll need to convert them into the wt3 file format. The Wikitude 3D Encoder desktop application (Windows and Mac) encodes your 3D source file. You can download it from our website. The Encoder can handle Autodesk® FBX® files (.fbx) and the open standard Collada (.dae) file formats for encoding to .wt3.
     
     Create an AR.Model and pass the URL to the actual .wt3 file of the model. Additional options allow for scaling, rotating and positioning the model in the scene.
     g
     A function is attached to the onLoaded trigger to receive a notification once the 3D model is fully loaded. Depending on the size of the model and where it is stored (locally or remotely) it might take some time to completely load and it is recommended to inform the user about the loading time.
     */
    var dayModel = new AR.Model("assets/skydive_1019.wt3", {
                                scale: {
                                x: 2.0,
                                y: 2.0,
                                z: 2.0
                                },
                                translate: {
                                x: 0.0,
                                y: 0.0,
                                z: 0.0
                                },
                                rotate: {
                                roll: 0
                                }
                                });
    var dayAnimation1 = new AR.ModelAnimation(dayModel, "group11_animatior");
    
    //
    //        var nightModel = new AR.Model("assets/ICC_happybirthday_NIGHT.wt3", {
    //                                    scale: {
    //                                    x: 0.0045,
    //                                    y: 0.0045,
    //                                    z: 0.0045
    //                                    },
    //                                    translate: {
    //                                    x: 0.0,
    //                                    y: 0.05,
    //                                    z: 0.0
    //                                    },
    //                                    rotate: {
    //                                    roll: -25
    //                                    }
    //                                    });
    //        var nightAnimation1 = new AR.ModelAnimation(nightModel, "happy_birthday5_animation");
    /*
     Similar to 2D content the 3D model is added to the drawables.cam property of an AR.Trackable2DObject.
     */
    var trackable = new AR.Trackable2DObject(this.tracker, "skyline-tracker_edit", {
                                             drawables: {
                                             cam: [dayModel]
                                             },
                                             onEnterFieldOfVision : function() {
                                             if (dayAnimation1.isRunning())
                                             {
                                             dayAnimation1.resume();
                                             }
                                             else
                                             {
                                             window.setTimeout(function(){
                                                               dayAnimation1.start(-1);
                                                               }, 500);
                                             
                                             }
                                             }
                                             });
    
}
};

World.init();

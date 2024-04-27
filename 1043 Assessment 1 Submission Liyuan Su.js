(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"1043 Assessment 1 Submission Liyuan Su_atlas_1", frames: [[1608,0,388,248],[534,302,118,176],[786,302,107,176],[0,0,400,300],[1490,590,182,42],[1608,250,290,248],[1390,572,98,82],[654,302,130,151],[402,0,400,300],[1998,53,45,21],[1998,0,40,51],[1998,76,34,23],[146,302,180,151],[1900,250,144,209],[328,302,204,108],[0,302,144,209],[804,0,400,300],[895,302,204,69],[1201,302,97,88],[1300,302,97,88],[1399,302,97,88],[1498,302,97,88],[1101,302,98,89],[895,373,97,88],[994,373,97,88],[1201,392,97,88],[1300,392,97,88],[1399,392,97,88],[1498,392,97,88],[1093,393,97,88],[328,412,97,88],[427,412,97,88],[146,455,97,88],[654,455,97,88],[1900,461,97,88],[895,463,97,88],[994,463,97,88],[526,480,97,88],[753,480,97,88],[1192,482,97,88],[1291,482,97,88],[1390,482,97,88],[1489,482,97,88],[1093,483,97,88],[1588,500,97,88],[1687,500,97,88],[1786,500,97,88],[245,502,97,88],[344,502,97,88],[0,513,97,88],[99,545,97,88],[625,545,97,88],[1885,551,97,88],[852,553,97,88],[951,553,97,88],[443,570,97,88],[724,570,97,88],[1192,572,97,88],[1291,572,97,88],[1206,0,400,300]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.圖層1 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.圖層1_1 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.圖層1_2 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.圖層1_3 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.圖層11 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.圖層12 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.圖層19 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.圖層1_1_1 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.圖層2 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.圖層23 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.圖層24 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.圖層25 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.圖層25_1 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.圖層3 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.圖層3_1 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.圖層4 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.圖層4_1 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.圖層9 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.BMP_0d90963e_0a35_4dd9_b37c_44964bc97b8c = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.BMP_115b1069_9621_481c_b8ad_25e53d862372 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.BMP_1abb20a9_3065_4c2c_a975_32d1d0e1c5f4 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.BMP_382d1949_9793_46ad_b673_0a04af5ee437 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.BMP_441e4da5_4886_4cf8_a64c_b71fc44cb7f4 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.BMP_52467030_45e2_473b_8eea_bfca7f63b419 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.BMP_568ab22f_728a_4d22_88f1_5f76e72c0de3 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.BMP_594768d4_4c2f_4177_a0f8_b1bda8a423df = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.BMP_5ae07b8d_3553_4e72_ae48_4e3246e8feb6 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.BMP_6777effd_ec97_48f7_ac95_24be609e556c = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.BMP_6bf7392b_f0ec_45c1_8766_78a4da264a2c = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.BMP_6f3aa4f0_5224_47be_9e66_3f9ff5a1a6f5 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.BMP_7c213bac_99b4_49ed_bd43_f6c235b027bd = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.BMP_81f5e432_4966_4adb_8e98_86cbd8b82d2b = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.BMP_838ca98e_ddc9_4c5b_ae4e_1fda678d86f4 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.BMP_8a02db0a_4045_4666_b070_dd2b3125f8d5 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.BMP_8ad94ca0_d861_469b_b915_63e9a2001fb2 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.BMP_9135fd83_6c8b_4f9b_8bc9_24bb105077b3 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.BMP_92007baa_8dc1_49e5_b697_f9a8742063de = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.BMP_93d810b0_1dfb_431a_80cf_4776faa43925 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.BMP_9865ccff_4c5f_46c5_9ea4_3a0dc57915ff = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.BMP_988a64e1_2e82_4566_adf1_1fb300419936 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.BMP_9aa5a57d_823c_4fc3_bf9e_020969f3de6f = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.BMP_a0ca941e_c20e_42d5_9782_f9d18987682a = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.BMP_a0ff88e7_795c_4ac3_884c_fe0ea94520e8 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.BMP_a6c2964a_e35c_4e77_8901_c14daa7e4a7d = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.BMP_acb4000a_6b73_4687_8370_bbe12c6e6947 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.BMP_adccd046_1510_466d_9ab2_da833ee7cd4d = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.BMP_b0897ba2_c82a_4a25_8d81_6df5fd17abc8 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.BMP_b1e01bfe_62df_4b7d_98c8_77ea68e8bdc4 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.BMP_b9cd6184_f7a5_4d1c_a3bf_4aa358292b42 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(48);
}).prototype = p = new cjs.Sprite();



(lib.BMP_be6628ed_2992_4927_be61_2e8ee3465fb2 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(49);
}).prototype = p = new cjs.Sprite();



(lib.BMP_c27a2053_2545_4792_b993_3b6654d88cac = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(50);
}).prototype = p = new cjs.Sprite();



(lib.BMP_c3de5b83_76ca_4949_b42b_ce186f57420b = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(51);
}).prototype = p = new cjs.Sprite();



(lib.BMP_d9222845_0f9f_425f_94f7_b7ae2d13eb50 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(52);
}).prototype = p = new cjs.Sprite();



(lib.BMP_dde6a846_35ba_476c_906a_f5abfc182662 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(53);
}).prototype = p = new cjs.Sprite();



(lib.BMP_e98ed58e_b3ea_4fdc_b3be_1a26e6adebb5 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(54);
}).prototype = p = new cjs.Sprite();



(lib.BMP_efadd346_e949_4248_9061_ccbcc9bc3988 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(55);
}).prototype = p = new cjs.Sprite();



(lib.BMP_f4914b9d_9249_492a_976f_e28a953c6d07 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(56);
}).prototype = p = new cjs.Sprite();



(lib.BMP_f86ac222_a42b_4e73_a268_256c962bc4e9 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(57);
}).prototype = p = new cjs.Sprite();



(lib.BMP_fde74852_f038_485f_a9c2_c97a7f657701 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(58);
}).prototype = p = new cjs.Sprite();



(lib.背景 = function() {
	this.initialize(ss["1043 Assessment 1 Submission Liyuan Su_atlas_1"]);
	this.gotoAndStop(59);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.左手 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層23();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.左手, new cjs.Rectangle(0,0,45,21), null);


(lib.右腿 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層24();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.右腿, new cjs.Rectangle(0,0,40,51), null);


(lib.右手 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層25();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.右手, new cjs.Rectangle(0,0,34,23), null);


(lib.WarpedAsset_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.BMP_441e4da5_4886_4cf8_a64c_b71fc44cb7f4();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,98,89);


(lib.tulip = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層3_1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.tulip, new cjs.Rectangle(0,0,204,108), null);


(lib.thanksface = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層1_3();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.thanksface, new cjs.Rectangle(0,0,400,300), null);


(lib.thanks = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層4_1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.thanks, new cjs.Rectangle(0,0,400,300), null);


(lib.sheiscrying = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層12();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sheiscrying, new cjs.Rectangle(0,0,290,248), null);


(lib.rose = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層9();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.rose, new cjs.Rectangle(0,0,204,69), null);


(lib.ringbottn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("ADQA1QAABSg6A5Qg5A5hRAAQhQAAg5g5Qg5g5AAhSQAAhQA5g5QA5g5BQAAQBRAAA5A5QA6A5AABQgAAJjVQBlAEBIBIQBLBLAABpQAABrhLBLQhMBLhqAAQhpAAhMhLQhLhLAAhrQAAhpBLhLQAdgdAhgSQA2gdBBAAQAEAAAFAAgAh3i4QgPgSAAgZQAAgeAWgVQAUgVAeAAQAeAAAWAVQAUAVAAAeQAAAIgBAG");
	this.shape.setTransform(25.65,29.95);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#9FC5FF").s().p("AhHAOQAAgcAVgWQAVgUAdgBQAeABAVAUQAVAWAAAcIgBAPIgJAAQhBAAg2AdQgOgTAAgZg");
	this.shape_1.setTransform(19.4,5.75);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FF9933").s().p("Ai1C1QhKhLgBhqQABhqBKhKQAdgdAggRQA2gdBCAAIAIAAQBlADBJBIQBKBKAABqQAABqhKBLQhMBMhqAAQhpAAhMhMgAh+h/Qg5A6AABPQAABRA5A6QA6A5BQAAQBRAAA5g5QA6g6AAhRQAAhPg6g6Qg5g5hRAAQhQAAg6A5g");
	this.shape_2.setTransform(25.65,34.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,53.3,61.9);


(lib.righthand = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.righthand, new cjs.Rectangle(0,0,388,248), null);


(lib.pink = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E5A9AE").s().p("AkoCxQh7hKAAhnQAAhmB7hKQB7hJCtAAQCuAAB7BJQB7BKAABmQAABnh7BKQh7BJiuAAQitAAh7hJg");
	this.shape.setTransform(42,25);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,84,50);


(lib.lefthand = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層1_1_1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lefthand, new cjs.Rectangle(0,0,130,151), null);


(lib.heart = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層4();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.heart, new cjs.Rectangle(0,0,144,209), null);


(lib.happy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層1_2();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.happy, new cjs.Rectangle(0,0,107,176), null);


(lib.green = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層2();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,400,300);


(lib.giveher = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層11();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.giveher, new cjs.Rectangle(0,0,182,42), null);


(lib.补间1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層25_1();
	this.instance.setTransform(-89,-73);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-89,-73,180,151);


(lib.cryingface = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層1_1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.cryingface, new cjs.Rectangle(0,0,118,176), null);


(lib.candybutton = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#7C65D4").ss(1,1,1).p("AAFATIgNg4IAHA5AAHAdIACAJ");
	this.shape.setTransform(19.425,21.125);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(1,1,1).p("AicgxIABgBQALgkAdgdQAwgwBDAAQABAAACAAQA6ABArAlQAFAFAGAFQARASALAUACWhAQANAdAAAjQAAAegKAcQgMAggaAZQgwAxhDAAQhDAAgwgxQgJgJgOgUIgEgHAidgyQAAgBAAgBAihgoQgCAPAHAiQgBgaAAgVAiUBGIgBgC");
	this.shape_1.setTransform(34.2359,16.35);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#9900FF").s().p("AgpCXQgDgEgCgIQgCgKgCgDQgDgFgHgEIgMgJQgJgKABgQQAAgWAOgdQALgXAJgKQAFgIABgDQABgEgDgHQgFgJgRgYQgPgUgEgOQgFgSAJgVQAGgQALgEQAGgDAHADQAIADABAHQABAFgFAIIgJANQgEAKAGAPQADAGANAPQAQASAGAQQAIAVgIASIgLAQQgPAVgIAXQgFAOAFAHQADAGAOAHQAGAGADAKQAHARgEAKQgDAHgHADIgFABQgEAAgEgCgAA+CLQgFgBgEgFIgHgLIgLgOQgIgOADgSQABgMAJgSIAIgOQAEgHACgHQAGgWgXgjIgQgbQgIgQgBgNIACgYIAAgKIACgKQADgNALAAQAKAAAEAPQACAIgCAPQgBAPABAHQACALAIAMIANAUQASAeAAAVQACAdgVAiQgHANABAFQAAAGAFAGIAIALQAJALgDAKQgCAGgFAEQgEACgDAAIgDAAg");
	this.shape_2.setTransform(34.9625,16.785);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#7C65D4").s().p("AhoBzQgJgJgNgUIgCgJIACAJIgEgHIABgCIABAAQACgFgBgCQAAgBAAgBQAAAAgBgBQgBAAAAAAQgBAAgBAAIgOg6IAHA7IgFAKIgQAWQgJANgCALIgDAMQgEAIgMADQgHACgMgBQgggCgegHQgDgHAGgLQAGgOABgEQAAgEgBgFIgCgGIgBgEQgCgFgEgDQgDgCgHAAIgOgBIgJgBIgIgEQgHgHABgTIACgrIACgOQACgDALgLQAFgFAAgEIgBgCIAAgEIgDgHIgBgBQgKgSAHgTIADgHIADgFQACgHAAgFIA5AFIAGACQAEACADgBQAAAEAFABIAGAAQADACAFAGIAOANQAJAHAEAGIAFAFIADADIABAEQAAAAABAAQAAABAAAAQABABAAAAQABABAAAAIAPAKIACACQgBAPAGAhIAAgvIAAAAQAGABAAgFQABgDgGgDIgBgBIABgBQAMgkAcgdQAwgvBDgBIADAAQA6ABAsAlIAKAKQASASALAUQgBACAAAEIAAAGQABAAAAABQABAAAAABQABAAAAAAQABAAAAAAIADgBIACgDQAEgIAJgHIATgMIAvgdIASgKIAJgDIAIgFIANgEIAEgFIAFgBIABAAIABABQAHAGAGAIIAEAHQAEAHgCAFQgBAFgFAEIgCABIgHAFQgOAHgFANQgGAQAHAMQADAEAOAMQAPANAEAOQAEAUgUAaQgKALgDAFQgGAKAEAKQACAFAFADQAFACAFgCQALAQAAATQAAAKgEAEQgFAIgQAFQgNAEgSABIgCAAIgEgDQgFgFgFgKIgJgOIgUgUQgJgOgGgGQgHgIgSgMQgFgDgDACQgBAAAAAAQgBAAAAABQAAAAAAABQgBABAAAAIABAEIgEgCQAJgbAAgfQAAgigNgeQANAeAAAiQAAAfgJAbQgNAfgaAaQgwAxhDgBQhDABgwgxgAgriSQgLAEgGAQQgJAVAFASQAEAOAPAUQARAYAFAKQADAGgBAEQgBAEgFAGQgJALgLAXQgOAdAAAWQgBAQAJALIAMAIQAHAEADAGQACACACAKQACAJADADQAGAEAHgCQAHgEACgHQAEgJgGgSQgDgKgGgFQgOgHgDgHQgFgGAFgOQAIgYAPgVIAKgQQAIgSgIgUQgFgQgQgTQgNgPgDgFQgGgPAEgKIAJgOQAFgHgBgGQgBgGgIgDQgEgCgDAAIgGABgAAjiHIgCAKIAAAKIgCAYQABANAIAQIAQAbQAXAjgGAXQgCAGgEAHIgIAOQgJASgBAMQgDASAIAOIALAOIAHALQAEAFAFABQAFACAFgEQAFgEACgFQADgLgJgLIgIgLQgFgGAAgFQgBgFAHgOQAVghgCgdQAAgWgSgeIgNgTQgIgNgCgLQgBgHABgPQACgPgCgIQgEgPgKAAQgLAAgDANgAirAiQgJADgKAJIgFAFQgHAGgEAHQgEAGACADQAEAEAFgFIAGgIQAEgGANgJQAFgEADgBIAHAAQAFgBAAgDQABgFgIgBIgIAAgADkATIAXAHIAJADQAHgBgBgEQgBgDgFgCIgcgJQgSgFgJgBIgMAAIgGABQgEABABADQAAADAEACQACABADgBIACgBQAKAAAXAGgAjTgJQgDACAAADQABADAHAAIAfABIAKABQAAAAABAAQABAAAAAAQABAAAAgBQABAAAAAAQABAAAAgBQABAAAAgBQAAAAAAgBQAAAAAAgBQABgDgEgCIgrgBIgGABgADnhJQgKAEgHAEIgNAHQgHAEgGABIgJACQgDAEgCACQgBAEABADQADADAEgCIAGgCIATgJIAPgKIARgGQAEgDAAgEQgBgDgEAAIgGABgAj1CbIgKgCIAbADIgRgBgAkaCKQgHgMANgQIADgDIgCAGQgFAJgBAMIAAAGIgBgCgAiiCDIACgEIgBACIgCAFIABgDgAC0BEQAIAFAFAFIAJAKIgWgUgAiKBEIgHg7IAOA6IgCABIgDACgAEuBFQgCgJAHgKIANgPQAHgIAEgKQgBASgNANQgMAMABAGIABADIgFAAgAiKBEgAlJAkIgBgYIABgPQABgKAEgGIACgBIgCAEQgCAEABAMQABAIgCAPIgCAUIgBgHgAiRgxIgBgBIAAgCIAAACIgNgKIgGgHIgKgKIACABQAHADAEADIAFAJIAIAHIADACIABABIABABIgBABIAAAAgAkah6IANABIACAAIgPgBgAELiXQALgGAFAAIAEAAIgHADIgUAJIgHADIAOgJg");
	this.shape_3.setTransform(33.075,16.35);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AjRCgIgVgDIgbgDIgLgBQgIgBgEgDQgDgDAAgFIgBgFQABgNAFgJIADgFIABgGQABgDgCgFIgCgJIgVgBQgMAAgHgEQgOgKABgYIAAgDIABgUQACgPAAgIQgBgLABgFIACgEIAFgGIAMgOIgBgDQgGgMgCgGIgBgPQAAgMADgHIAEgHIADgGIAAgHIABgCQAAgDADgBIAHgBIAMAAIAQABIAUABIAJACIAcAKIAiAeIABABIAJAKIAGAIIAOAJIABABIABABQAFADAAADQAAAFgGgBIgBAAIgEgBIgCgCIgPgKQgBAAAAAAQgBgBAAAAQgBgBAAAAQAAgBAAAAIgBgEIgEgDIgEgFQgEgFgJgIIgOgNQgFgGgEgBIgGgBQgEgBAAgDQgDAAgEgBIgHgDIg5gFQABAFgDAHIgCAFIgEAIQgHASALASIAAABIAEAHIAAAEIAAACQAAAEgFAFQgKALgCAEIgDANIgCArQgBATAIAHIACACIAFACIAKABIANABQAHAAADACQAEADACAFIABAEIACAGQACAFgBAEQAAAFgHANQgFALACAHQAfAHAfACQAMABAIgCQALgCAEgJIADgLQADgLAJgOIAPgWIAEgFIADgDIADgCIADgBQABAAAAAAQABABABAAQAAAAAAABQABAAAAABQABADgDAEIAAAAIgCACQgWAegIASIAAABIgBADIgBADQgEAMgCACQgIALgXAAIgHAAgAEDCeQgFgBgBgCIgBgCIgCgBQgHgFgGgKIgLgRIgLgMIgMgMIgEgGIgJgLQgFgFgIgFIgBgBQgHgDgCgDIAAgBIgBgDQAAgBAAAAQAAgBABgBQAAAAAAAAQABgBAAAAQADgCAGAEQASAMAGAHQAGAGAKAOIATAUIAJAPQAGAJAFAFIADAEIADgBQASgBANgEQAQgFAFgHQADgFAAgKQAAgTgLgQQgFACgFgCQgEgDgDgFQgDgJAGgLQACgEAKgMQAVgagFgUQgDgOgQgNQgOgMgCgEQgIgMAGgPQAGgNAOgIIAHgFIACgBQAEgEACgEQABgGgEgHIgEgHQgFgIgIgGIgBgBIAAAAIgFACIgFAEIgNAFIgIAEIgJAEIgSAJIgvAdIgSAMQgKAIgDAHIgCADIgDACQgBAAAAAAQgBAAAAgBQgBAAAAgBQgBAAAAgBIgBgFQAAgFABgCIAFgEIAGgHQAFgFAFgCIAOgIIAHgGIAHgCQAEgCAJgHIAFgDIAVgMIAFgEIAFgCIAIgDIAUgKIAHgDIAFgDQAEgBADABIABABIAFAAQAJAEAIANQAOAVgIANQgCAEgGAEIgLAHQgGAFgGAIQgHALAEAIQACAEAKAGQAWAPAEAaQADAOgFANQgDAKgIAJIgNAOQgGALACAIIAFAAQADAAAEACQAFAEAEAHQAGAMAAAYQAAAOgFAGQgDAEgJAEQgZALgVAAIgFAAgAjSBLQgDgEAEgGQAFgGAHgHIAFgFQAKgJAJgCIAIgBQAHABAAAFQgBADgEABIgHABQgEAAgFAEQgNAJgEAHIgFAIQgDACgDAAIgDgBgAD5AcIgXgHQgZgHgKABQgDABgDgBQgEgBAAgDQgBgEAEgBIAGgBIANAAQAJABASAFIAcAJQAFACAAADQABAFgGABIgJgDgAioACIgJgBIgggBQgHAAAAgDQgBgDADgCIAHgBIArABQAEACgBADQAAABAAABQAAAAgBABQAAAAAAAAQgBAAAAABQgBAAAAABQAAAAgBAAQAAAAgBAAQAAABgBAAIgBgBgACsglQgCgDACgDQABgDAEgDIAJgCQAFgBAIgFIAMgHQAHgEALgEIAGgBQAEABAAACQABAEgEADIgRAGIgQAKIgTAJIgGADIgCAAQAAAAgBAAQgBAAAAAAQgBAAAAgBQgBAAAAgBg");
	this.shape_4.setTransform(33.3164,16.2013);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-1,66.5,34.7);


(lib.元件5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CD4E38").s().p("AmWC0QiohKAAhqQAAhoCohLQCphLDtAAQDuAACpBLQCoBLAABoQAABqioBKQipBLjuAAQjtAAiphLg");
	this.shape.setTransform(57.5,25.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,115,51);


(lib.body = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層19();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.body, new cjs.Rectangle(0,0,98,82), null);


(lib.background = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.背景();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,400,300);


(lib.Symbol = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.圖層3();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol, new cjs.Rectangle(0,0,144,209), null);


(lib.左腿 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.补间1("synched",0);
	this.instance.setTransform(90,75.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(30));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1,2.5,180,151);


(lib.PuppetShape_5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_115b1069_9621_481c_b8ad_25e53d862372();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,98,89);


(lib.PuppetShape_4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_a0ff88e7_795c_4ac3_884c_fe0ea94520e8();

	this.instance_2 = new lib.BMP_c27a2053_2545_4792_b993_3b6654d88cac();

	this.instance_3 = new lib.BMP_adccd046_1510_466d_9ab2_da833ee7cd4d();

	this.instance_4 = new lib.BMP_1abb20a9_3065_4c2c_a975_32d1d0e1c5f4();

	this.instance_5 = new lib.BMP_6bf7392b_f0ec_45c1_8766_78a4da264a2c();

	this.instance_6 = new lib.BMP_be6628ed_2992_4927_be61_2e8ee3465fb2();

	this.instance_7 = new lib.BMP_9aa5a57d_823c_4fc3_bf9e_020969f3de6f();

	this.instance_8 = new lib.BMP_dde6a846_35ba_476c_906a_f5abfc182662();

	this.instance_9 = new lib.BMP_8ad94ca0_d861_469b_b915_63e9a2001fb2();

	this.instance_10 = new lib.BMP_93d810b0_1dfb_431a_80cf_4776faa43925();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,98,89);


(lib.PuppetShape_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_a6c2964a_e35c_4e77_8901_c14daa7e4a7d();

	this.instance_2 = new lib.BMP_988a64e1_2e82_4566_adf1_1fb300419936();

	this.instance_3 = new lib.BMP_594768d4_4c2f_4177_a0f8_b1bda8a423df();

	this.instance_4 = new lib.BMP_52467030_45e2_473b_8eea_bfca7f63b419();

	this.instance_5 = new lib.BMP_a0ca941e_c20e_42d5_9782_f9d18987682a();

	this.instance_6 = new lib.BMP_6777effd_ec97_48f7_ac95_24be609e556c();

	this.instance_7 = new lib.BMP_e98ed58e_b3ea_4fdc_b3be_1a26e6adebb5();

	this.instance_8 = new lib.BMP_c3de5b83_76ca_4949_b42b_ce186f57420b();

	this.instance_9 = new lib.BMP_9135fd83_6c8b_4f9b_8bc9_24bb105077b3();

	this.instance_10 = new lib.BMP_568ab22f_728a_4d22_88f1_5f76e72c0de3();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,98,89);


(lib.PuppetShape_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_5ae07b8d_3553_4e72_ae48_4e3246e8feb6();

	this.instance_2 = new lib.BMP_92007baa_8dc1_49e5_b697_f9a8742063de();

	this.instance_3 = new lib.BMP_d9222845_0f9f_425f_94f7_b7ae2d13eb50();

	this.instance_4 = new lib.BMP_81f5e432_4966_4adb_8e98_86cbd8b82d2b();

	this.instance_5 = new lib.BMP_f86ac222_a42b_4e73_a268_256c962bc4e9();

	this.instance_6 = new lib.BMP_6f3aa4f0_5224_47be_9e66_3f9ff5a1a6f5();

	this.instance_7 = new lib.BMP_b9cd6184_f7a5_4d1c_a3bf_4aa358292b42();

	this.instance_8 = new lib.BMP_0d90963e_0a35_4dd9_b37c_44964bc97b8c();

	this.instance_9 = new lib.BMP_b0897ba2_c82a_4a25_8d81_6df5fd17abc8();

	this.instance_10 = new lib.BMP_b1e01bfe_62df_4b7d_98c8_77ea68e8bdc4();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,98,89);


(lib.PuppetShape_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.instance = new lib.WarpedAsset_1("synched",0);

	this.instance_1 = new lib.BMP_838ca98e_ddc9_4c5b_ae4e_1fda678d86f4();

	this.instance_2 = new lib.BMP_8a02db0a_4045_4666_b070_dd2b3125f8d5();

	this.instance_3 = new lib.BMP_fde74852_f038_485f_a9c2_c97a7f657701();

	this.instance_4 = new lib.BMP_9865ccff_4c5f_46c5_9ea4_3a0dc57915ff();

	this.instance_5 = new lib.BMP_acb4000a_6b73_4687_8370_bbe12c6e6947();

	this.instance_6 = new lib.BMP_efadd346_e949_4248_9061_ccbcc9bc3988();

	this.instance_7 = new lib.BMP_7c213bac_99b4_49ed_bd43_f6c235b027bd();

	this.instance_8 = new lib.BMP_382d1949_9793_46ad_b673_0a04af5ee437();

	this.instance_9 = new lib.BMP_f4914b9d_9249_492a_976f_e28a953c6d07();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,98,89);


(lib.元件4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 图层_1
	this.movieClip_4 = new lib.tulip();
	this.movieClip_4.name = "movieClip_4";
	this.movieClip_4.setTransform(-107.5,24.95,1,1,0,0,0,102,54);

	this.instance = new lib.happy();
	this.instance.setTransform(2,-36,1,1,0,0,0,53.5,88);

	this.instance_1 = new lib.righthand();
	this.instance_1.setTransform(15.5,0,1,1,0,0,0,194,124);

	this.instance_2 = new lib.lefthand();
	this.instance_2.setTransform(-102.5,46.45,1,1,0,0,0,65,75.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.movieClip_4}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.元件4, new cjs.Rectangle(-209.5,-124,419,248), null);


(lib.笑 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 笑脸
	this.instance = new lib.PuppetShape_1("synched",1,false);
	this.instance.setTransform(212.8,80.3,1,1,14.9983,0,0,49,70);

	this.instance_1 = new lib.PuppetShape_2("synched",1,false);
	this.instance_1.setTransform(212.8,80.3,1,1,14.9983,0,0,49,70);
	this.instance_1._off = true;

	this.instance_2 = new lib.PuppetShape_3("synched",1,false);
	this.instance_2.setTransform(205.4,80.3,1,1,0,0,0,49.1,70);
	this.instance_2._off = true;

	this.instance_3 = new lib.PuppetShape_4("synched",1,false);
	this.instance_3.setTransform(205.4,80.3,1,1,0,0,0,49.1,70);
	this.instance_3._off = true;

	this.instance_4 = new lib.PuppetShape_5("synched",1,false);
	this.instance_4.setTransform(205.4,80.3,1,1,0,0,0,49.1,70);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},9).to({state:[{t:this.instance_2}]},10).to({state:[{t:this.instance_3}]},10).to({state:[{t:this.instance_4}]},10).wait(11));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},9).wait(41));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:false},9).to({_off:true,regX:49.1,rotation:0,x:205.4},10).wait(31));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(9).to({_off:false},10).to({_off:true},10).wait(21));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(19).to({_off:false},10).to({_off:true},10).wait(11));

	// 身体
	this.instance_5 = new lib.body();
	this.instance_5.setTransform(195.9,124.45,1,1,14.9983,0,0,49.1,51.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(9).to({rotation:8.1928,x:195.8,y:124.5},10).wait(31));

	// 右手
	this.instance_6 = new lib.右手();
	this.instance_6.setTransform(190.8,87.3,1,1,14.9983,0,0,29.6,4);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(9).to({x:183.65,y:94.95},10).to({rotation:44.9994,x:183.7,y:95.05},10).to({rotation:14.9983,x:183.65,y:94.95},10).wait(11));

	// 左手
	this.instance_7 = new lib.左手();
	this.instance_7.setTransform(222.05,96.25,1,1,14.9983,0,0,8.6,4.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(9).to({rotation:0,x:212.75,y:95},10).to({rotation:14.9985,y:95.05},10).to({rotation:0,y:95},10).wait(11));

	// 右腿
	this.instance_8 = new lib.右腿();
	this.instance_8.setTransform(176.05,134.15,1,1,14.9983,0,0,27.5,8.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).to({rotation:-14.9985,x:176.1,y:122.85},9).to({regX:27.6,scaleX:0.9999,scaleY:0.9999,rotation:-44.9988,x:214.55,y:136.5},10).wait(10).to({regY:8.7,scaleX:1,scaleY:1,rotation:-14.999,y:141},10).wait(11));

	// 左腿
	this.instance_9 = new lib.左腿();
	this.instance_9.setTransform(212,145.3,1,1,14.9983,0,0,47.1,50);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(9).to({x:192.15,y:147.5},10).to({rotation:59.9992,x:180.6,y:138.6},10).wait(21));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(67.9,0,285.70000000000005,309.6);


// stage content:
(lib._1043Assessment1SubmissionLiyuanSu = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,389,538,539,659];
	this.streamSoundSymbolsList[0] = [{id:"xm2416",startFrame:0,endFrame:389,loop:0,offset:0}];
	this.streamSoundSymbolsList[389] = [{id:"_14485",startFrame:389,endFrame:539,loop:0,offset:0}];
	this.streamSoundSymbolsList[539] = [{id:"_14485",startFrame:539,endFrame:661,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("xm2416",-1);
		this.InsertIntoSoundStreamData(soundInstance,0,389,0);
	}
	this.frame_389 = function() {
		var soundInstance = playSound("_14485",-1);
		this.InsertIntoSoundStreamData(soundInstance,389,539,0);
		/* 在此帧处停止
		时间轴将在插入此代码的帧处停止/暂停。
		也可用于停止/暂停影片剪辑的时间轴。
		*/
		
		this.stop();
		
		
		/* 单击以转到帧并播放
		单击指定的元件实例会将播放头移动到时间轴中的指定帧并继续从该帧回放。
		可在主时间轴或影片剪辑时间轴上使用。
		
		说明:
		1. 单击元件实例时，用希望播放头移动到的帧编号替换以下代码中的数字 5。
		2. EaselJS 中的帧编号从 0 开始而不是从 1 开始
		*/
		
		this.button_11.addEventListener("click", fl_ClickToGoToAndPlayFromFrame_19.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame_19()
		{
			this.gotoAndPlay(541);
		}
		
		
		/* 单击以转到帧并播放
		单击指定的元件实例会将播放头移动到时间轴中的指定帧并继续从该帧回放。
		可在主时间轴或影片剪辑时间轴上使用。
		
		说明:
		1. 单击元件实例时，用希望播放头移动到的帧编号替换以下代码中的数字 5。
		2. EaselJS 中的帧编号从 0 开始而不是从 1 开始
		*/
		
		this.button_12.addEventListener("click", fl_ClickToGoToAndPlayFromFrame_20.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame_20()
		{
			this.gotoAndPlay(391);
		}
	}
	this.frame_538 = function() {
		/* 在此帧处停止
		时间轴将在插入此代码的帧处停止/暂停。
		也可用于停止/暂停影片剪辑的时间轴。
		*/
		
		this.stop();
		
		/* 单击以转到帧并播放
		单击指定的元件实例会将播放头移动到时间轴中的指定帧并继续从该帧回放。
		可在主时间轴或影片剪辑时间轴上使用。
		
		说明:
		1. 单击元件实例时，用希望播放头移动到的帧编号替换以下代码中的数字 5。
		2. EaselJS 中的帧编号从 0 开始而不是从 1 开始
		*/
		
		this.button_10.addEventListener("click", fl_ClickToGoToAndPlayFromFrame_18.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame_18()
		{
			this.gotoAndPlay(661);
		}
	}
	this.frame_539 = function() {
		var soundInstance = playSound("_14485",0);
		this.InsertIntoSoundStreamData(soundInstance,539,661,1);
	}
	this.frame_659 = function() {
		/* 在此帧处停止
		时间轴将在插入此代码的帧处停止/暂停。
		也可用于停止/暂停影片剪辑的时间轴。
		*/
		
		this.stop();
		
		
		/* 单击以转到帧并播放
		单击指定的元件实例会将播放头移动到时间轴中的指定帧并继续从该帧回放。
		可在主时间轴或影片剪辑时间轴上使用。
		
		说明:
		1. 单击元件实例时，用希望播放头移动到的帧编号替换以下代码中的数字 5。
		2. EaselJS 中的帧编号从 0 开始而不是从 1 开始
		*/
		
		this.button_13.addEventListener("click", fl_ClickToGoToAndPlayFromFrame_21.bind(this));
		
		function fl_ClickToGoToAndPlayFromFrame_21()
		{
			this.gotoAndPlay(661);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(389).call(this.frame_389).wait(149).call(this.frame_538).wait(1).call(this.frame_539).wait(120).call(this.frame_659).wait(61));

	// button
	this.instance = new lib.ringbottn();
	this.instance.setTransform(298.35,195.1);
	new cjs.ButtonHelper(this.instance, 0, 1, 1);

	this.instance_1 = new lib.candybutton();
	this.instance_1.setTransform(47.8,212.15);
	new cjs.ButtonHelper(this.instance_1, 0, 1, 1);

	this.button_11 = new lib.ringbottn();
	this.button_11.name = "button_11";
	this.button_11.setTransform(324.05,225.95,1,1,0,0,0,25.7,29.9);
	new cjs.ButtonHelper(this.button_11, 0, 1, 1);

	this.button_12 = new lib.candybutton();
	this.button_12.name = "button_12";
	this.button_12.setTransform(47.8,208.15);
	new cjs.ButtonHelper(this.button_12, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_1},{t:this.instance}]},359).to({state:[{t:this.button_12},{t:this.button_11}]},30).to({state:[]},1).wait(330));

	// move
	this.instance_2 = new lib.笑();
	this.instance_2.setTransform(522,192.1,1,1,0,0,0,246.1,140);

	this.instance_3 = new lib.cryingface();
	this.instance_3.setTransform(163.5,143.05,1,1,0,0,0,59,88);
	this.instance_3._off = true;

	this.instance_4 = new lib.sheiscrying();
	this.instance_4.setTransform(232,152.05,1,1,0,0,0,145,124);

	this.instance_5 = new lib.righthand();
	this.instance_5.setTransform(199,179.05,1,1,0,0,0,194,124);

	this.instance_6 = new lib.lefthand();
	this.instance_6.setTransform(81,224.5,1,1,0,0,0,65,75.5);

	this.instance_7 = new lib.giveher();
	this.instance_7.setTransform(298,122.05,1,1,0,0,0,91,21);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_2}]},298).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4},{t:this.instance_3}]},1).to({state:[{t:this.instance_3}]},29).to({state:[{t:this.instance_3},{t:this.instance_6},{t:this.instance_5}]},29).to({state:[{t:this.instance_3},{t:this.instance_6},{t:this.instance_5},{t:this.instance_7}]},30).to({state:[]},1).wait(330));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({x:212.05,y:180.1},298).wait(1).to({_off:true,regX:59,regY:88,x:163.5,y:143.05},1).wait(420));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(299).to({_off:false},1).wait(89).to({_off:true},1).wait(330));

	// ring
	this.instance_8 = new lib.candybutton();
	this.instance_8.setTransform(47.8,208.15);
	new cjs.ButtonHelper(this.instance_8, 0, 1, 1);

	this.instance_9 = new lib.happy();
	this.instance_9.setTransform(185.5,142.05,1,1,0,0,0,53.5,88);

	this.instance_10 = new lib.righthand();
	this.instance_10.setTransform(199,178.05,1,1,0,0,0,194,124);

	this.instance_11 = new lib.lefthand();
	this.instance_11.setTransform(81,224.5,1,1,0,0,0,65,75.5);

	this.instance_12 = new lib.heart();
	this.instance_12.setTransform(219,134.05,1,1,0,0,0,72,104.5);

	this.instance_13 = new lib.rose();
	this.instance_13.setTransform(298,224.05,1,1,0,0,0,102,34.5);

	this.button_13 = new lib.元件5();
	this.button_13.name = "button_13";
	this.button_13.setTransform(324.5,225.05,1,1,0,0,0,57.5,25.5);
	this.button_13.alpha = 0.4297;
	new cjs.ButtonHelper(this.button_13, 0, 1, 1);

	this.movieClip_5 = new lib.rose();
	this.movieClip_5.name = "movieClip_5";
	this.movieClip_5.setTransform(298,224.05,1,1,0,0,0,102,34.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8,p:{x:47.8,y:208.15}}]},539).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_12},{t:this.instance_8,p:{x:46.8,y:210.85}}]},29).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_12},{t:this.instance_13},{t:this.instance_8,p:{x:47.8,y:211.85}}]},60).to({state:[{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_12},{t:this.movieClip_5},{t:this.button_13},{t:this.instance_8,p:{x:47.8,y:205.85}}]},31).to({state:[]},1).wait(60));

	// candy
	this.instance_14 = new lib.ringbottn();
	this.instance_14.setTransform(299.35,198.1);
	new cjs.ButtonHelper(this.instance_14, 0, 1, 1);

	this.instance_15 = new lib.happy();
	this.instance_15.setTransform(185.5,142.05,1,1,0,0,0,53.5,88);

	this.instance_16 = new lib.righthand();
	this.instance_16.setTransform(199,178.05,1,1,0,0,0,194,124);

	this.instance_17 = new lib.lefthand();
	this.instance_17.setTransform(81,224.5,1,1,0,0,0,65,75.5);

	this.instance_18 = new lib.Symbol();
	this.instance_18.setTransform(211,134.05,1,1,0,0,0,72,104.5);

	this.instance_19 = new lib.tulip();
	this.instance_19.setTransform(76,203,1,1,0,0,0,102,54);

	this.button_10 = new lib.pink();
	this.button_10.name = "button_10";
	this.button_10.setTransform(85,219.05,1,1,0,0,0,42,25);
	this.button_10.alpha = 0.3984;
	new cjs.ButtonHelper(this.button_10, 0, 1, 1);

	this.movieClip_9 = new lib.元件4();
	this.movieClip_9.name = "movieClip_9";
	this.movieClip_9.setTransform(183.5,178.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14,p:{x:299.35,y:198.1}}]},390).to({state:[{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_18},{t:this.instance_14,p:{x:300.35,y:196.1}}]},29).to({state:[{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_19},{t:this.instance_14,p:{x:297.35,y:197.1}}]},60).to({state:[{t:this.movieClip_9},{t:this.button_10},{t:this.instance_14,p:{x:300.35,y:198.1}}]},59).to({state:[]},1).wait(181));

	// thanks
	this.instance_20 = new lib.thanksface();
	this.instance_20.setTransform(200,150,1,1,0,0,0,200,150);

	this.instance_21 = new lib.thanks();
	this.instance_21.setTransform(200,150,1,1,0,0,0,200,150);

	this.instance_22 = new lib.green("synched",0);
	this.instance_22.setTransform(200,150,1,1,0,0,0,200,150);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_22},{t:this.instance_21},{t:this.instance_20}]},660).to({state:[{t:this.instance_22},{t:this.instance_21},{t:this.instance_20}]},59).wait(1));

	// background
	this.instance_23 = new lib.background("synched",0);
	this.instance_23.setTransform(200,150,1,1,0,0,0,200,150);

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(659).to({startPosition:0},0).to({_off:true},1).wait(60));

	// walking
	this.instance_24 = new lib.笑();
	this.instance_24.setTransform(84.2,86.5,1,1,0,0,0,49,44.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_24).to({_off:true},1).wait(719));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(174,150,455.5,182);
// library properties:
lib.properties = {
	id: '6BED7548D385DB4A942DBED313A618A8',
	width: 400,
	height: 300,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/1043 Assessment 1 Submission Liyuan Su_atlas_1.png", id:"1043 Assessment 1 Submission Liyuan Su_atlas_1"},
		{src:"sounds/_14485.mp3", id:"_14485"},
		{src:"sounds/xm2416.mp3", id:"xm2416"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['6BED7548D385DB4A942DBED313A618A8'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;
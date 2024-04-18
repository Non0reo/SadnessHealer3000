let capture; // our webcam
let captureEvent; // callback when webcam is ready

let markers = [];
let videos = [];
let selectedVideo = 0;

let happiness = 0;

const armSize = 1;
const upperArmSize = 1;
const lerpSpeed = 0.2;

const CAMERA_VIEW = false;

let difference = 0;
let CHANGE_HAPPINESS = true;


let skeleton = defaultSkeleton();
let previousSkeleton = defaultSkeleton();

function setup() {

  createCanvas(windowWidth, windowHeight);
  captureWebcam(); // launch webcam

  // styling
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  fill('white');

  // load videos
  for (let i = 0; i < 1; i++) {
    videos[i] = createVideo(['videos/' + i + '.mp4']);
    videos[i].hide();
  }

  setInterval(startComparaison, 100);

}

function draw() {

  //background(0);
  //background(0, 0, 20)

  //background(lerpColor(color(0, 0, 20), color(222, 118, 38), happiness));
  background(0, 0, 0)
  noStroke();
  textAlign(CENTER);


  if(CAMERA_VIEW) {
    push();
    centerOurStuff(); // center the webcam
    scale(-1, 1); // mirror webcam
    image(capture, -capture.scaledWidth, 0, capture.scaledWidth, capture.scaledHeight); // draw webcam
    scale(-1, 1); // unset mirror
    pop();
  }


  /* TRACKING */
  if (mediaPipe.landmarks.length > 0) {

    push();
    centerOurStuff();
    
    for (let j = 0; j < mediaPipe.landmarks[0].length; j++) {
      let x = map(mediaPipe.landmarks[0][j].x, 1, 0, 0, capture.scaledWidth);
      let y = map(mediaPipe.landmarks[0][j].y, 0, 1, 0, capture.scaledHeight);
      markers[j] = {x, y};
    }
    
    /* for (let j = 0; j < markers.length; j++) {
      fill('red');
      ellipse(markers[j].x, markers[j].y, 20, 20);
      //console.log(markers[j].x)
    }    */ 

    
    let middleShoulders = {x: markers[11].x + ((markers[12].x - markers[11].x) / 2), y: markers[11].y + ((markers[12].y - markers[11].y) / 2)};
    let middlePelvis = {x: markers[23].x + ((markers[24].x - markers[23].x) / 2), y: markers[23].y + ((markers[24].y - markers[23].y) / 2)};


    skeleton = {
      armLeft: {
        p1: {x: lerp(skeleton.armLeft.p1.x, markers[13].x, lerpSpeed), y: lerp(skeleton.armLeft.p1.y, markers[13].y, lerpSpeed)},
        p2: {x: lerp(skeleton.armLeft.p2.x, markers[13].x + ((markers[19].x - markers[13].x) * armSize), lerpSpeed), y: lerp(skeleton.armLeft.p2.y, markers[13].y + ((markers[19].y - markers[13].y) * armSize), lerpSpeed)}
      },
      armRight: {
        p1: {x: lerp(skeleton.armRight.p1.x, markers[14].x, lerpSpeed), y: lerp(skeleton.armRight.p1.y, markers[14].y, lerpSpeed)},
        p2: {x: lerp(skeleton.armRight.p2.x, markers[14].x + ((markers[20].x - markers[14].x) * armSize), lerpSpeed), y: lerp(skeleton.armRight.p2.y, markers[14].y + ((markers[20].y - markers[14].y) * armSize), lerpSpeed)}
      },
      upperArmLeft: {
        p1: {x: lerp(skeleton.upperArmLeft.p1.x, markers[11].x, lerpSpeed), y: lerp(skeleton.upperArmLeft.p1.y, markers[11].y, lerpSpeed)},
        p2: {x: lerp(skeleton.upperArmLeft.p2.x, markers[11].x + ((markers[13].x - markers[11].x) * upperArmSize), lerpSpeed), y: lerp(skeleton.upperArmLeft.p2.y, markers[11].y + ((markers[13].y - markers[11].y) * upperArmSize), lerpSpeed)}
      },
      upperArmRight: {
        p1: {x: lerp(skeleton.upperArmRight.p1.x, markers[12].x, lerpSpeed), y: lerp(skeleton.upperArmRight.p1.y, markers[12].y, lerpSpeed)},
        p2: {x: lerp(skeleton.upperArmRight.p2.x, markers[12].x + ((markers[14].x - markers[12].x) * upperArmSize), lerpSpeed), y: lerp(skeleton.upperArmRight.p2.y, markers[12].y + ((markers[14].y - markers[12].y) * upperArmSize), lerpSpeed)}
      },
      legLeft: {
        p1: {x: lerp(skeleton.legLeft.p1.x, markers[25].x, lerpSpeed), y: lerp(skeleton.legLeft.p1.y, markers[25].y, lerpSpeed)},
        p2: {x: lerp(skeleton.legLeft.p2.x, markers[25].x + ((markers[27].x - markers[25].x)), lerpSpeed), y: lerp(skeleton.legLeft.p2.y, markers[25].y + ((markers[27].y - markers[25].y)), lerpSpeed)}
      },
      legRight: {
        p1: {x: lerp(skeleton.legRight.p1.x, markers[26].x, lerpSpeed), y: lerp(skeleton.legRight.p1.y, markers[26].y, lerpSpeed)},
        p2: {x: lerp(skeleton.legRight.p2.x, markers[26].x + ((markers[28].x - markers[26].x)), lerpSpeed), y: lerp(skeleton.legRight.p2.y, markers[26].y + ((markers[28].y - markers[26].y)), lerpSpeed)}
      },
      upperLegLeft: {
        p1: {x: lerp(skeleton.upperLegLeft.p1.x, markers[23].x, lerpSpeed), y: lerp(skeleton.upperLegLeft.p1.y, markers[23].y, lerpSpeed)},
        p2: {x: lerp(skeleton.upperLegLeft.p2.x, markers[23].x + ((markers[25].x - markers[23].x)), lerpSpeed), y: lerp(skeleton.upperLegLeft.p2.y, markers[23].y + ((markers[25].y - markers[23].y)), lerpSpeed)}
      },
      upperLegRight: {
        p1: {x: lerp(skeleton.upperLegRight.p1.x, markers[24].x, lerpSpeed), y: lerp(skeleton.upperLegRight.p1.y, markers[24].y, lerpSpeed)},
        p2: {x: lerp(skeleton.upperLegRight.p2.x, markers[24].x + ((markers[26].x - markers[24].x)), lerpSpeed), y: lerp(skeleton.upperLegRight.p2.y, markers[24].y + ((markers[26].y - markers[24].y)), lerpSpeed)}
      },
      shoulders: {
        p1: {x: lerp(skeleton.shoulders.p1.x, markers[11].x, lerpSpeed), y: lerp(skeleton.shoulders.p1.y, markers[11].y, lerpSpeed)},
        p2: {x: lerp(skeleton.shoulders.p2.x, markers[11].x + (markers[12].x - markers[11].x), lerpSpeed), y: lerp(skeleton.shoulders.p2.y, markers[11].y + (markers[12].y - markers[11].y), lerpSpeed)},
        middle: middleShoulders
      },
      head: {
        pos: {
          x: lerp(skeleton.head.pos.x, markers[0].x, lerpSpeed),
          y: lerp(skeleton.head.pos.y, markers[0].y, lerpSpeed)
        },
        size: lerp(skeleton.head.size, dist(markers[0].x, markers[0].y, middlePelvis.x, middlePelvis.y) * 0.4, lerpSpeed)
      },
      pelvis: {
        p1: {x: lerp(skeleton.pelvis.p1.x, markers[23].x, lerpSpeed), y: lerp(skeleton.pelvis.p1.y, markers[23].y, lerpSpeed)},
        p2: {x: lerp(skeleton.pelvis.p2.x, markers[24].x, lerpSpeed), y: lerp(skeleton.pelvis.p2.y, markers[24].y, lerpSpeed)},
        middle: middlePelvis
      },
      bodyLeft: {
        p1: {x: lerp(skeleton.bodyLeft.p1.x, markers[11].x, lerpSpeed), y: lerp(skeleton.bodyLeft.p1.y, markers[11].y, lerpSpeed)},
        p2: {x: lerp(skeleton.bodyLeft.p2.x, markers[23].x, lerpSpeed), y: lerp(skeleton.bodyLeft.p2.y, markers[23].y, lerpSpeed)},
      },
      bodyRight: {
        p1: {x: lerp(skeleton.bodyRight.p1.x, markers[12].x, lerpSpeed), y: lerp(skeleton.bodyRight.p1.y, markers[12].y, lerpSpeed)},
        p2: {x: lerp(skeleton.bodyRight.p2.x, markers[24].x, lerpSpeed), y: lerp(skeleton.bodyRight.p2.y, markers[24].y, lerpSpeed)},
      },
      data: {
        default: false,
      }
    }

    if(!CAMERA_VIEW) {
      fill(0, 0, 20);
      noFill();
      stroke('white');
      strokeWeight(12);
      circle(skeleton.head.pos.x, skeleton.head.pos.y, skeleton.head.size);
      drawAllSkeletonLines();

      textSize(skeleton.head.size / 4);
      fill('white');
      noStroke();
      
      //if(skeleton.data.timeSinceLastHit < 30) text('0ᴗ0', skeleton.head.pos.x, skeleton.head.pos.y);
      //else text('0⌓0'/* '^o^' */, skeleton.head.pos.x, skeleton.head.pos.y);
      // else {
      //   textSize(skeleton.head.size * 1.1);
      //   text('☹'/* 'ￗ﹏ￗ' *//* '^o^' */, skeleton.head.pos.x, skeleton.head.pos.y + (skeleton.head.size / 10));
      // }


      text('^o^', skeleton.head.pos.x, skeleton.head.pos.y);
    }

    pop();
  
  } //else skeleton = defaultSkeleton();

  
  if(selectedVideo !== -1) {
    const VIDEO_SCALE = 0.4;
    let video = videos[selectedVideo];
    const videoY = (height - (video.height * VIDEO_SCALE)) / 2;
    image(video, 0, videoY, video.width * VIDEO_SCALE, video.height * VIDEO_SCALE, 0, 0, video.width, video.height);
  }
}

function drawAllSkeletonLines() {
  for (const [key] of Object.entries(skeleton)) {
    if(key == 'head' || key == 'data') continue;
    drawSkeletonLine(key);
  }
}

function drawSkeletonLine(bodyPart) {
  line(skeleton[bodyPart].p1.x, skeleton[bodyPart].p1.y, skeleton[bodyPart].p2.x, skeleton[bodyPart].p2.y);
}


//if "q" is pressed, play first video
function keyPressed() {
  difference = 0;
  happiness = 0;
  
  if (key == 'q') {
    //stop every video
    for (let i = 0; i < videos.length; i++) {
      videos[i].stop();
    }
    selectedVideo = -1;
  }
  if (key == '0') {
    videos[0].play();
    selectedVideo = 0;
    CHANGE_HAPPINESS = true;
    startCountdown(77000);
  }
  if (key == '1') {
    videos[1].play();
    selectedVideo = 1;
    CHANGE_HAPPINESS = true;

  }
  if (key == '2') {
    videos[2].play();
    selectedVideo = 2;
    CHANGE_HAPPINESS = true;

  }

  if (key == 'w') {
    console.log(videos[selectedVideo].time());
  }
}

function startComparaison() {
  if(skeleton.data.default || !CHANGE_HAPPINESS) return;
  difference = compareTwoSkeletons(skeleton, previousSkeleton);//lerp(difference, compareTwoSkeletons(skeleton, previousSkeleton), 0.9);
  //happiness = lerp(happiness, map(difference, 100, 400, 0, 1), 0.05);
  happiness = lerp(happiness, map(difference, 50, 400, 0, 1), 0.05);
  //console.log("Diff between A and B: ", difference);
  previousSkeleton = skeleton;
}

let timeout;
function startCountdown(length) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    CHANGE_HAPPINESS = false;
    console.log(length + "s ; CHANGE_HAPPINESS: ", CHANGE_HAPPINESS);
  }, length);
}
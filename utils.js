// function: launch webcam
function captureWebcam() {
    capture = createCapture(
      {
        audio: false,
        video: {
          facingMode: "user",
        },
      },
      function (e) {
        captureEvent = e;
        console.log(captureEvent.getTracks()[0].getSettings());
        // do things when video ready
        // until then, the video element will have no dimensions, or default 640x480
        capture.srcObject = e;
  
        setCameraDimensions(capture);
        mediaPipe.predictWebcam(capture);
        //mediaPipe.predictWebcam(parentDiv);
      }
    );
    capture.elt.setAttribute("playsinline", "");
    capture.hide();
  }
  
  // function: resize webcam depending on orientation
  function setCameraDimensions(video) {
  
    const vidAspectRatio = video.width / video.height; // aspect ratio of the video
    const canvasAspectRatio = width / height; // aspect ratio of the canvas
  
    if (vidAspectRatio > canvasAspectRatio) {
      // Image is wider than canvas aspect ratio
      video.scaledHeight = height;
      video.scaledWidth = video.scaledHeight * vidAspectRatio;
    } else {
      // Image is taller than canvas aspect ratio
      video.scaledWidth = width;
      video.scaledHeight = video.scaledWidth / vidAspectRatio;
    }
  }
  
  
  // function: center our stuff
  function centerOurStuff() {
    translate(width / 2 - capture.scaledWidth / 2, height / 2 - capture.scaledHeight / 2); // center the webcam
  }
  
  // function: window resize
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setCameraDimensions(capture);
  }



  function defaultSkeleton() {
    return {
      armLeft: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      armRight: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      upperArmLeft: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      upperArmRight: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      shoulders: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      legLeft: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      legRight: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      upperLegLeft: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      upperLegRight: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      bodyLeft: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0},
      },
      bodyRight: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0},
      },
      pelvis: {
        p1: {x: 0, y: 0},
        p2: {x: 0, y: 0}
      },
      head: {
        pos: {
          x: 0,
          y: 0,
        },
        size: 0
      },
      data: {
        default: true,
      }
    }
  }
  
  

//the more the same the two skeletons are, the higher the score is
function compareTwoSkeletons(skeletonA, skeletonB) {
/*     let score = 0;
    let total = 0;
    let keys = Object.keys(skeletonA);
  
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if(key === "head") continue;

      let distance = dist(skeletonA[key].p1.x, skeletonA[key].p1.y, skeletonB[key].p2.x, skeletonB[key].p2.y);
      total += distance;
    }
  
    score = total / keys.length * 2;
    return score; */

  let diff = 0;
  for (let key in skeletonA) {
    if (key !== "head" && key !== "data") diff += dist(skeletonA[key].p1.x, skeletonA[key].p1.y, skeletonB[key].p1.x, skeletonB[key].p1.y) + dist(skeletonA[key].p2.x, skeletonA[key].p2.y, skeletonB[key].p2.x, skeletonB[key].p2.y);
  }
  return diff;
}
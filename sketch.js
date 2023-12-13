let obj;
let textureImg;
let spinLogo = false;

let obj2;
let spinLogo2 = false;
let logoScale = 3; // Adjust this scale factor based on your needs
let val=0;


function preload() {
  // Load the 3D model during the preload phase
  obj = loadModel('Rock.obj', true);
  //textureImg = loadImage('texture5.jpg');
  obj2 = loadModel('Water.obj', true);
  img2 = loadImage('Water.gif');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  noStroke();
  cam = createCamera();
  perspective();
}

function draw() {
  // Draw the 3D model and lights
  background("rgba(0, 0, 0, 0)");
  //orbitControl();
  vinhControl();
  rotateX(PI);
  rotateY(PI);
  //rotateZ(PI * -0.02);
  
  // Reduce the intensity of directional light
  directionalLight(150, 150, 150, 0, 0, 1);

  // Reduce the intensity of ambient light
  ambientLight(50);

  // Set the color of the 3D model to 5C5137
  normalMaterial(255,255,255,255);
  specularMaterial(92, 81, 55);
  shininess(1);  // Adjust shininess value


// Reduce the intensity of point light
  pointLight(150, 150, 150, 0 ,0, 700);
  
  translate(0, height / -8);
  scale(-3.9, 5.5, 3.9);
  //tint(0, 255, 0, 150);  // Adjust the green tint intensity
  //texture(textureImg);
  model(obj);


  //Display the 3D model
  
  // if (spinLogo) {
  //   rotateY(frameCount * 0.01); // Rotate the model for animation
  // }
  //directionalLight(105, 105, 105, 0, 0, 1);

  ambientLight(10);

  // Set the color of the 3D model to 8C7853
  ambientMaterial(200, 200, 200);
  specularMaterial(0, 0, 0); // Orange color
  //shininess(4); // Adjust the shininess for a metallic look
  pointLight(100, 255, 105, 0, 0, 100);

  // Scale the model based on the predefined scale factor
  translate(0, height / 5.8 - 160);
  scale(logoScale);
  scale(logoScale, 0.2, logoScale); // Adjust scaling factors
  texture(img2);
  model(obj2);

}

p5.prototype.vinhControl = function(sensitivityX, sensitivityY, sensitivityZ) {
  //init 3d 
  this._assert3d('vinhControl');


  // If the mouse is not in bounds of the canvas, disable all behaviors:
  const mouseInCanvas =
    this.mouseX < this.width &&
    this.mouseX > 0 &&
    this.mouseY < this.height &&
    this.mouseY > 0;
  if (!mouseInCanvas) return;

  const cam = this._renderer._curCamera;
  //default zooms

  if (typeof sensitivityX === 'undefined') {
    sensitivityX = 1;
  }
  if (typeof sensitivityY === 'undefined') {
    sensitivityY = sensitivityX;
  }
  if (typeof sensitivityZ === 'undefined') {
    sensitivityZ = 0.5;
  }
//zoom
  const scaleFactor = this.height < this.width ? this.height : this.width;
  this._renderer._curCamera._orbit(0, 0, val * scaleFactor);

  if (this.mouseIsPressed) {
    // ORBIT BEHAVIOR
    if (this.mouseButton === this.LEFT) {
      const deltaTheta =
        -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
      const deltaPhi =
        sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;
      this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    } else if (this.mouseButton === this.RIGHT) {
      // PANNING BEHAVIOR along X/Z camera axes and restricted to X/Z plane
      // in world space
      const local = cam._getLocalAxes();

      // normalize portions along X/Z axes
      const xmag = Math.sqrt(local.x[0] * local.x[0] + local.x[2] * local.x[2]);
      if (xmag !== 0) {
        local.x[0] /= xmag;
        local.x[2] /= xmag;
      }

      // normalize portions along X/Z axes
      const ymag = Math.sqrt(local.y[0] * local.y[0] + local.y[2] * local.y[2]);
      if (ymag !== 0) {
        local.y[0] /= ymag;
        local.y[2] /= ymag;
      }

      // move along those vectors by amount controlled by mouseX, pmouseY
      const dx = -1 * sensitivityX * (this.mouseX - this.pmouseX);
      const dz = -1 * sensitivityY * (this.mouseY - this.pmouseY);

      // restrict movement to XZ plane in world space
      cam.setPosition(
        cam.eyeX + dx * local.x[0] + dz * local.z[0],
        cam.eyeY,
        cam.eyeZ + dx * local.x[2] + dz * local.z[2]
      );
    }
  }
  return this;
};



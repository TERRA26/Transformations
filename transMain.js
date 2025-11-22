  'use strict';

  // Global variables that are set and used
  // across the application
  let gl, program;
  
  // Global declarations of objects that you will be drawing
  var myTeapot = null;

  // Pedestal components
  var pedestalBase = null;    // Bottom cube base
  var pedestalColumn = null;  // Cylinder column
  var pedestalTop = null;     // Top cube platform

  // Objects to place on pedestals
  var mySphere = null;
  var myCone = null;


//
// A function that creates shapes to be drawn and creates a VAO for each
//
// We start you out with an example for the teapot.
//
function createShapes() {

    myTeapot = new Teapot();
    myTeapot.VAO = bindVAO (myTeapot);

    // Create pedestal components
    pedestalBase = new Cube(1);
    pedestalBase.VAO = bindVAO(pedestalBase);

    pedestalColumn = new Cylinder(20, 10);
    pedestalColumn.VAO = bindVAO(pedestalColumn);

    pedestalTop = new Cube(1);
    pedestalTop.VAO = bindVAO(pedestalTop);

    // Create objects to place on pedestals
    mySphere = new Sphere(20, 20);
    mySphere.VAO = bindVAO(mySphere);

    myCone = new Cone(20, 10);
    myCone.VAO = bindVAO(myCone);
}


//
// Set up your camera and your projection matrices
//
function setUpCamera() {

    // set up perspective projection with wider field of view
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(projMatrix, radians(60), 1.0, 0.1, 100.0);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);


    // set up view - camera positioned to frame all 3 pedestals
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0, 1.5, 9], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
}


//
// Use this function to draw all of your shapes.
// Recall that VAOs should have been set up the call to createShapes()
// You'll have to provide a Model Matrix for each shape to be drawn that
// places the object in the world.
//
// An example is shown for placing the teapot
//
function drawShapes() {

    // Helper function to draw a complete pedestal at a given position
    function drawPedestal(xPos) {
        let modelMatrix = glMatrix.mat4.create();

        // Draw base (wide, thicker cube)
        // Base height = 0.4, so it extends from y=-2.0 to y=-1.6
        glMatrix.mat4.translate(modelMatrix, modelMatrix, [xPos, -1.8, 0]);
        glMatrix.mat4.scale(modelMatrix, modelMatrix, [1.5, 0.4, 1.5]);
        gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
        gl.bindVertexArray(pedestalBase.VAO);
        gl.drawElements(gl.TRIANGLES, pedestalBase.indices.length, gl.UNSIGNED_SHORT, 0);

        // Draw column (shorter, wider cylinder)
        // Column height = 1.3, positioned so bottom connects to base top at y=-1.6
        // Center at -1.6 + 0.65 = -0.95
        modelMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(modelMatrix, modelMatrix, [xPos, -0.95, 0]);
        glMatrix.mat4.scale(modelMatrix, modelMatrix, [0.6, 1.3, 0.6]);
        gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
        gl.bindVertexArray(pedestalColumn.VAO);
        gl.drawElements(gl.TRIANGLES, pedestalColumn.indices.length, gl.UNSIGNED_SHORT, 0);

        // Draw top platform (wider flat cube)
        // Top platform height = 0.3, positioned so bottom connects to column top at y=-0.3
        // Center at -0.3 + 0.15 = -0.15
        modelMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(modelMatrix, modelMatrix, [xPos, -0.15, 0]);
        glMatrix.mat4.scale(modelMatrix, modelMatrix, [1.3, 0.3, 1.3]);
        gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
        gl.bindVertexArray(pedestalTop.VAO);
        gl.drawElements(gl.TRIANGLES, pedestalTop.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    // Draw left pedestal with sphere on top
    // Platform top is at y=0, place sphere on top
    drawPedestal(-4.0);
    let modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [-4.0, 0.5, 0]);
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [1.0, 1.0, 1.0]);
    gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
    gl.bindVertexArray(mySphere.VAO);
    gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);

    // Draw center pedestal with teapot on top
    drawPedestal(0);
    modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [0, 0.05, 0]);
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(180.0));
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [0.7, 0.7, 0.7]);
    gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
    gl.bindVertexArray(myTeapot.VAO);
    gl.drawElements(gl.TRIANGLES, myTeapot.indices.length, gl.UNSIGNED_SHORT, 0);

    // Draw right pedestal with cone on top
    drawPedestal(4.0);
    modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [4.0, 0.5, 0]);
    glMatrix.mat4.scale(modelMatrix, modelMatrix, [0.9, 0.9, 0.9]);
    gl.uniformMatrix4fv(program.uModelT, false, modelMatrix);
    gl.bindVertexArray(myCone.VAO);
    gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);

}

///////////////////////////////////////////////////////////////////
//
//   You shouldn't have to edit below this line
//
///////////////////////////////////////////////////////////////////

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  // Create a program with the appropriate vertex and fragment shaders
  function initProgram() {
    const vertexShader = getShader('vertex-shader');
    const fragmentShader = getShader('fragment-shader');

    // Create a program
    program = gl.createProgram();
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aBary = gl.getAttribLocation(program, 'bary');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
  }

  // creates a VAO and returns its ID
  function bindVAO (shape) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      let myBaryBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aBary);
      gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
    
  }

  
  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }


    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initProgram();
    
    // create and bind your current object
    createShapes();
    
    // set up your camera
    setUpCamera();
    
    // do a draw
    draw();
  }

var canvas;
var gl;
var infoText;                           // Staðsetning á textahlutanum
var program1;                           // program1 er fyrir hlutina

var numVerticesCube = 36;               // Fjöldi hnúta fyrir einn tening

var xDist = 0.0;                        // Staðsetning áhorfanda á x-ás
var yDist = 7.0;                        // Staðsetning áhorfanda á y-ás
var zDist = -15.0;                      // Staðsetning áhorfanda á z-ás

var spadeDir = 0.0;                     // Hreyfing spaða
var xBallPos = 0.0;                     // Staðsetning bolta á x-ás
var yBallPos = -3.5;                    // Staðsetning bolta á y-ás
var xBallDir = 0.05;                    // Stefna á bolta í x-átt
var yBallDir = 0.05;                    // Stefna á bolta í y-átt 

var BLACK = vec4(0.0, 0.0, 0.0, 1.0);   // Litur spaða
var GREEN = vec4(0.0, 1.0, 0.0, 1.0);   // Litur kúlu
var RED = vec4(1.0, 0.0, 0.0, 1.0);     // Litur efstu raðar
var BLUE = vec4(0.0, 0.0, 1.0, 1.0);    // Litur næst efstu raðar
var ORANGE = vec4(1.0, 0.5, 0.0, 1.0)   // Litur næst neðstu raðar
var YELLOW = vec4(1.0, 1.0, 0.0, 1.0);  // Litur neðstu raðar
var PURPLE = vec4(0.5, 0.0, 0.5, 1.0);  // Litur lífa

var numberOfBoxes;                      // Fjöldi kassa í leik
var numberOfLives = 3;                  // Fjöldi lífa í byrjun leiks
var wentOutOfBounds = false;            // Segir til um hvort farið var niður í hyldýpi

var proLoc1;                            // Staðsetning uniform breytu projection í hnútalitara 1
var mvLoc1;                             // Staðsetning uniform breytu modelview í hnútalitara 1
var colorLoc1;                          // Staðsetning uniform breytu fColor í bútalitara 1

var cubeBuffer;                         // Buffer fyrir tening
var vPosition1;                         // Staðsetning attribute breytu vPosition í hnútalitara 1

// 36 hnútar tenings
var cubeVertices = [
  // Framhlið:
  vec4( -0.5,  0.5,  1.0, 1.0 ), vec4( -0.5, -0.5,  1.0, 1.0 ), vec4(  0.5, -0.5,  1.0, 1.0 ),
  vec4(  0.5, -0.5,  1.0, 1.0 ), vec4(  0.5,  0.5,  1.0, 1.0 ), vec4( -0.5,  0.5,  1.0, 1.0 ),
  // Hægri hlið:
  vec4(  0.5,  0.5,  1.0, 1.0 ), vec4(  0.5, -0.5,  1.0, 1.0 ), vec4(  0.5, -0.5,  0.0, 1.0 ),
  vec4(  0.5, -0.5,  0.0, 1.0 ), vec4(  0.5,  0.5,  0.0, 1.0 ), vec4(  0.5,  0.5,  1.0, 1.0 ),
  // Botn:
  vec4(  0.5, -0.5,  1.0, 1.0 ), vec4( -0.5, -0.5,  1.0, 1.0 ), vec4( -0.5, -0.5,  0.0, 1.0 ),
  vec4( -0.5, -0.5,  0.0, 1.0 ), vec4(  0.5, -0.5,  0.0, 1.0 ), vec4(  0.5, -0.5,  1.0, 1.0 ),
  // Toppur:
  vec4(  0.5,  0.5,  0.0, 1.0 ), vec4( -0.5,  0.5,  0.0, 1.0 ), vec4( -0.5,  0.5,  1.0, 1.0 ),
  vec4( -0.5,  0.5,  1.0, 1.0 ), vec4(  0.5,  0.5,  1.0, 1.0 ), vec4(  0.5,  0.5,  0.0, 1.0 ),
  // Bakhlið:
  vec4( -0.5, -0.5,  0.0, 1.0 ), vec4( -0.5,  0.5,  0.0, 1.0 ), vec4(  0.5,  0.5,  0.0, 1.0 ),
  vec4(  0.5,  0.5,  0.0, 1.0 ), vec4(  0.5, -0.5,  0.0, 1.0 ), vec4( -0.5, -0.5,  0.0, 1.0 ),
  // Vinstri hlið:
  vec4( -0.5,  0.5,  0.0, 1.0 ), vec4( -0.5, -0.5,  0.0, 1.0 ), vec4( -0.5, -0.5,  1.0, 1.0 ),
  vec4( -0.5, -0.5,  1.0, 1.0 ), vec4( -0.5,  0.5,  1.0, 1.0 ), vec4( -0.5,  0.5,  0.0, 1.0 ),
];

// Grindin fyrir kassastaðsetningar (4 raðir og 8 dálkar)
// Hvert stak geymir hliðrunina fyrir teninginn sem er skilgreindur í cubeVertices
var grid = [
  // Efsta röð
  [vec2(3.5, 3.5), vec2(2.5, 3.5), vec2(1.5, 3.5), vec2(0.5, 3.5),
   vec2(-0.5, 3.5), vec2(-1.5, 3.5), vec2(-2.5, 3.5), vec2(-3.5, 3.5),
  ],
  // Næstefsta röð
  [vec2(3.5, 3.0), vec2(2.5, 3.0), vec2(1.5, 3.0), vec2(0.5, 3.0),
   vec2(-0.5, 3.0), vec2(-1.5, 3.0), vec2(-2.5, 3.0), vec2(-3.5, 3.0),
  ],
  // Næstneðsta röð
  [vec2(3.5, 2.5), vec2(2.5, 2.5), vec2(1.5, 2.5), vec2(0.5, 2.5),
   vec2(-0.5, 2.5), vec2(-1.5, 2.5), vec2(-2.5, 2.5), vec2(-3.5, 2.5),
  ],
  // Neðsta röð
  [vec2(3.5, 2.0), vec2(2.5, 2.0), vec2(1.5, 2.0), vec2(0.5, 2.0),
   vec2(-0.5, 2.0), vec2(-1.5, 2.0), vec2(-2.5, 2.0), vec2(-3.5, 2.0),
  ],
];

// Segir til um hvort það eigi að vera kassi á þessum stað í grind.
// Upphafsstillum allt sem false.
var gridBoolean = [[], [], [], []];
for (i = 0; i < 4; i++) {
  for (j = 0; j < 8; j++) {
    gridBoolean[i][j] = false;
  }
}

// Staðsetningar teninga sem sýna fjölda lífa sem eru eftir
var livesPositions = [
  vec2(-3.0, 7.0), vec2(-3.5, 7.0), vec2(-4.0, 7.0),
];

// Program2
var program2;           // program2 er fyrir mynstrin

var numVerticesTex = 6; // Fjöldi hnúta fyrir eitt mynstur

var vPosition2;         // Staðsetning attribute breytu vPosition í hnútalitara 2
var vTexCoord;          // Staðsetning attribute breytu vTexCoord í hnútalitara 2

var proLoc2;            // Staðsetning uniform breytu projection í hnútalitara 2
var mvLoc2;             // Staðsetning uniform breytu modelview í hnútalitara 2

var texBuffer;          // Buffer fyrir mynsturstaðsetningu
var texCoordBuffer;     // Buffer fyrir mynsturhnit

var texture;            // Staðsetning uniform breytu texture í bútalitara 2

var texWall;            // Mynstur fyrir veggina
var texFloor;           // Mynstur fyrir gólfið

// Hnútastaðsetning mynsturs
var texVertices = [
  vec4( -5.0, -5.0,  0.0, 1.0 ),
  vec4(  5.0, -5.0,  0.0, 1.0 ),
  vec4(  5.0,  5.0,  0.0, 1.0 ),
  vec4(  5.0,  5.0,  0.0, 1.0 ),
  vec4( -5.0,  5.0,  0.0, 1.0 ),
  vec4( -5.0, -5.0,  0.0, 1.0 ),
];

// Mynsturhnitin (engin endurtekning)
var texCoords = [
  vec2( 0.0, 0.0 ),
  vec2( 1.0, 0.0 ),
  vec2( 1.0, 1.0 ),
  vec2( 1.0, 1.0 ),
  vec2( 0.0, 1.0 ),
  vec2( 0.0, 0.0 ),
];


/**
 * Ákveður á slembinn hátt hvar kassarnir 
 * skuli vera staðsettir á grindinni.
 * 
 */
function boxes() {
  // Finnum slembnar kassastaðsetningar.
  for (i = 0; i < numberOfBoxes; i++) {
    var x = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
    var y = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
    // Ef nú þegar kassi á þessum stað þá finnum við nýja staðsetningu.
    while (gridBoolean[x][y] === true) {
      var x = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
      var y = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
    }
    gridBoolean[x][y] = true;
  }
}

window.onload = function init() {
  
  canvas = document.getElementById('gl-canvas');
  infoText = document.getElementById('information');

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { 
    alert("WebGL isn't available"); 
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Fjöldi kassa er slembin og getur verið frá 10-20 kassar.
  numberOfBoxes = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
  // Ákveða staðsetningar kassana
  boxes();

  // Setja ofanvarpsfylkið
  var proj = perspective(50.0, 1.0, 0.2, 100.0);

  // Lesa inn og skilgreina mynstrin
  // Veggir
  var wallImage = document.getElementById("WallImage");
  texWall = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texWall);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wallImage);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Gólf
  var floorImage = document.getElementById("FloorImage");
  texFloor = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texFloor);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, floorImage);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  //
  //  Load shaders and initialize attribute buffers for program1
  //  program1 hefur litara fyrir hlutina sem eru teiknaðir
  program1 = initShaders(gl, "vertex-shader1", "fragment-shader1");
  gl.useProgram(program1);

  // Buffer fyrir tening
  cubeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW);

  // Ná í staðsetningu attribute breytunnar vPosition í hnútalitara 1
  vPosition1 = gl.getAttribLocation( program1, "vPosition1" );
  gl.vertexAttribPointer(vPosition1, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition1);

  // Ná í staðsetningar þessara uniform breyta í liturum 1
  proLoc1 = gl.getUniformLocation(program1, "projection1");
  mvLoc1 = gl.getUniformLocation(program1, "modelview1");
  colorLoc1 = gl.getUniformLocation(program1, "fColor");

  // Setja ofanvarpsfylkið í hnútalitara 1 
  gl.uniformMatrix4fv(proLoc1, false, flatten(proj));

  //
  //  Load shaders and initialize attribute buffers for program2
  //  program2 hefur litara fyrir mynstrin sem eru teiknuð
  program2 = initShaders(gl, "vertex-shader2", "fragment-shader2");
  gl.useProgram(program2);

  // Buffer fyrir mynstur
  texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texVertices), gl.STATIC_DRAW);

  // Ná í staðsetningu attribute breytunnar vPosition í hnútalitara 2
  vPosition2 = gl.getAttribLocation(program2, "vPosition2");
  gl.vertexAttribPointer(vPosition2, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition2);

  // Buffer fyrir mynsturhnit
  texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  // Ná í staðsetningu attribute breytunnar vTexCoord í hnútalitara 2
  vTexCoord = gl.getAttribLocation(program2, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  gl.uniform1i(gl.getUniformLocation(program2, "texture"), 0);

  // Ná í staðsetningar þessara uniform breyta í hnútalitara 2
  proLoc2 = gl.getUniformLocation(program2, "projection2");
  mvLoc2 = gl.getUniformLocation(program2, "modelview2");

  // Setja ofanvarpsfylkið í hnútalitara 2
  gl.uniformMatrix4fv(proLoc2, false, flatten(proj));

  // Atburðahandler fyrir örvatakkana.
  // Færir spaðann til hliðanna á hægri og vinstri örvatökkum.
  // Færir áhorfanda nær og fjær með upp- og niður örvatökkum.
  // Færir áhorfanda til hliðanna með 'a' og 'd'.
  // Færir áhorfanda upp og niður með 'w' og 's'.
  window.addEventListener("keydown", function(e) {
    switch (e.keyCode) {
      // Vinstri ör
      case 37:
        if (spadeDir < 5.0 - 0.75) {
          spadeDir += 0.35;
        }
        break;
      // Hægri ör
      case 39:
        if (spadeDir > -5.0 + 0.75) {
          spadeDir -= 0.35;
        }
        break;
      // Upp ör
      case 38:
        zDist += 0.25;
        break;
      // Niður ör
      case 40:
        zDist -= 0.25;
        break;
      // 'a'
      case 65:
        xDist -= 0.25;
        break;
      // 'd'
      case 68:
        xDist += 0.25;
        break;
      // 'w'
      case 87:
        yDist += 0.25;
        break;
      // 's'
      case 83:
        yDist -= 0.25;
        break;
    }
  });

  render();

}

/**
 * Teiknar spaðann.
 * 
 * @param {matrix} mv - Fylki með staðsetningu áhorfanda
 */
function drawSpade(mv) {
  // Binda buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.vertexAttribPointer(vPosition1, 4, gl.FLOAT, false, 0, 0);
  // Spaðinn er svartur
  gl.uniform4fv(colorLoc1, BLACK);

  // Staðsetja spaðann og teygja á honum
  mv = mult(mv, translate(spadeDir, -4.0, 4.0));
  mv = mult(mv, scalem(1.5, 0.2, 1.0));

  // Teikna spaðann
  gl.uniformMatrix4fv(mvLoc1, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesCube);
}

/**
 * Teiknar einn kassa
 * @param {matrix} mv - Fylki með staðsetningu áhorfanda
 * @param {number} i - Röð í grid
 * @param {number} j - Dálkur í grid
 */
 function drawBox(mv, i, j) {
  // Binda buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.vertexAttribPointer(vPosition1, 4, gl.FLOAT, false, 0, 0);
  // Setja lit kassans eftir því í hvaða röð hann er
  switch (i) {
    // Efsta röð er rauð
    case 0:
      gl.uniform4fv(colorLoc1, RED);
      break;
    // Næstefsta röð er græn
    case 1:
      gl.uniform4fv(colorLoc1, GREEN);
      break;
    // Næstneðsta röð er appelsínugul
    case 2:
      gl.uniform4fv(colorLoc1, ORANGE);
      break;
    // Neðsta röð er gul
    case 3:
      gl.uniform4fv(colorLoc1, YELLOW);
      break;
  }

  // Staðsetjum kassann og skölum hann
  mv = mult(mv, translate(grid[i][j][0], grid[i][j][1], 4.0));
  mv = mult(mv, scalem(0.8, 0.3, 1.0));

  // Teikna kassann
  gl.uniformMatrix4fv(mvLoc1, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesCube);
}

/**
 * Fer í gegnum grid og kallar á fall til að teikna kassa
 * þegar grid[i][j] = true.
 * 
 * @param {matrix} mv - Fylki með staðsetningu áhorfanda
 */
function drawBoxes(mv) {
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 8; j++) {
      if (gridBoolean[i][j] === true) {
        drawBox(mv, i, j);
      }
    }
  }
}

/**
 * Teiknar eitt líf.
 * 
 * @param {matrix} mv - Fylki með staðsetningu áhorfanda
 * @param {number} i - Númer lífs sem á að teikna
 */
function drawLive(mv, i) {
  // Binda buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.vertexAttribPointer(vPosition1, 4, gl.FLOAT, false, 0, 0);
  // Litur lífanna er fjólublár
  gl.uniform4fv(colorLoc1, PURPLE);
  // Staðsetjum kassann og skölum
  mv = mult(mv, translate(livesPositions[i][0], livesPositions[i][1], 8.0));
  mv = mult(mv, scalem(0.2, 1.5, 1.0));

  // Teikna kassann
  gl.uniformMatrix4fv(mvLoc1, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesCube);
}

/**
 * Kallar á drawLive jafn oft og það eru mörg líf eftir.
 * 
 * @param {matrix} mv - Fylki með staðsetningu áhorfanda
 */
function drawLives(mv) {
  for (i = 0; i < numberOfLives; i++) {
    drawLive(mv, i);
  }
}

/**
 * Teiknar boltann.
 * 
 * @param {matrix} mv - Fylki með staðsetningu áhorfanda
 */
function drawBall(mv) {
  // Binda buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.vertexAttribPointer(vPosition1, 4, gl.FLOAT, false, 0, 0);
  // Boltinn er blár
  gl.uniform4fv(colorLoc1, BLUE);

  // Hreyfum boltann og skölum hann
  mv = mult(mv, translate(xBallPos, yBallPos, 4.5));
  mv = mult(mv, scalem(0.2, 0.2, 0.2));

  // Teikna boltann
  gl.uniformMatrix4fv(mvLoc1, false, flatten(mv));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesCube);
}

/**
 * Hreyfir boltann í rétta stefnu.
 * 
 */
function moveBall() {
  xBallPos += xBallDir;
  yBallPos += yBallDir;
}

/**
 * Athugar hvort bolti sé farinn niður í hyldýpi.
 * Endurstillir þá leikinn og fjarlægir líf.
 * 
 */
function checkOutOfBounds(mv) {
  if (yBallPos < -5.5 + 0.1) {
    wentOutOfBounds = true;
    numberOfLives--;
    drawLives(mv);
  }
}

/**
 * Athugar hvort boltinn sé að skoppa af veggjunum.
 * Breytir þá stefnu boltans í samræmi.
 * 
 */
function checkWallCollission() {
  // Ef bolti skoppar af hliðarveggjum þá breytist stefna hans í x-ás 
  if (xBallPos > 5.0 - 0.1 || xBallPos < -5.0 + 0.1) {
    xBallDir *= -1.0;
  }
  // Ef bolti skoppar af lofti þá breytist stefna hans í y-ás
  if (yBallPos > 5.0 - 0.1) {
    yBallDir *= -1.0;
  }
}

/**
 * Athugar hvort boltinn sé að skoppa af spaðanum.
 * Breytir þá stefnu boltans í samræmi.
 * 
 */
function checkSpadeCollission() {
  // Ef bolti er fyrir innan spaða á x-ás og y-ás þá lendir hann á spaða
  if (yBallPos <= -4.0 + 0.1 && yBallPos >= -4.2 - 0.1 && xBallPos <= spadeDir + 0.75 + 0.1 && xBallPos >= spadeDir - 0.75 - 0.1) {
   yBallDir *= -1.0;
  }
}

/**
 * Athugar hvort bolti snerti eitthvern kassa, ef svo er þá
 * fjarlægjum við kassann og breytum stefnu boltans í samræmi.
 * 
 */
function checkBoxCollission(mv) {
  // Förum í gegnum grid og athugum hvort bolti snerti kassa
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 8; j++) {
      // Ef ekki kassi þarna þá höldum við áfram í næsta
      if (!gridBoolean[i][j]) {
        continue;
      }
      // Annars er kassi þarna og við athugum hvort bolti snerti hann
      if (yBallPos + 0.1 >= grid[i][j][1] - 0.15 && yBallPos - 0.1 <= grid[i][j][1] + 0.15
        && xBallPos >= grid[i][j][0] - 0.4 && xBallPos <= grid[i][j][0] + 0.4) {
          // Bolti snerti kassann svo við fjarlægjum hann
          gridBoolean[i][j] = false;
          // Fjöldi kassa lækkar um einn
          numberOfBoxes--;
          // Teiknum alla kassa aftur
          drawBoxes(mv);
          // Snúum stefnu boltans
          yBallDir *= -1.0;
        }
    }
  }
}

/**
 * Athugar hvort leikmaður hefur unnið eða tapað leik 
 * og birtir viðeigandi skilaboð ef svo er.
 * 
 */
function checkGameEnds() {
  // Athuga hvort búið sé að vinna leikinn
  if (numberOfBoxes === 0) {
    infoText.innerHTML = "Til hamingju! Þú hefur unnið leikinn! Þú getur spilað aftur með því að endurhlaða síðuna.";
    throw new Error('Leikur búinn');
  }
  // Athuga hvort búið sé að tapa leiknum
  if (numberOfLives === 0) {
    infoText.innerHTML = "Þú hefur tapað leiknum :( Kemur betur næst! Þú getur spilað aftur með því að endurhlaða síðuna.";
    throw new Error('Leikur búinn');
  }
}

function drawTextures(mv) {
  // Binda buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
  gl.vertexAttribPointer(vPosition2, 4, gl.FLOAT, false, 0, 0 );

  // Teikna veggina
  // Bakveggur
  gl.bindTexture(gl.TEXTURE_2D, texWall);
  var mv1 = mult(mv, translate(0.0, 0.0, 10.0));
  gl.uniformMatrix4fv(mvLoc2, false, flatten(mv1));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesTex);

  // Hliðarveggir
  // Vinstri
  var mv2 = mult(mv, translate(5.0, 0.0, 5.0));
  mv2 = mult(mv2, rotateY(-90));
  gl.uniformMatrix4fv(mvLoc2, false, flatten(mv2));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesTex);
  // Hægri
  mv2 = mult(mv2, rotateY(180));
  mv2 = mult(mv2, translate(0.0, 0.0, -10.0));
  gl.uniformMatrix4fv(mvLoc2, false, flatten(mv2));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesTex);
  
  // Loft
  var mv3 = mult(mv, translate(0.0, 5.0, 5.0));
  mv3 = mult(mv3, rotateX(-90));
  gl.uniformMatrix4fv(mvLoc2, false, flatten(mv3));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesTex);

  // Teikna gólf
  gl.bindTexture(gl.TEXTURE_2D, texFloor);
  mv3 = mult(mv3, translate(0.0, 0.0, -10.0));
  gl.uniformMatrix4fv(mvLoc2, false, flatten(mv3));
  gl.drawArrays(gl.TRIANGLES, 0, numVerticesTex);
}

var render = function() {
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Staðsetja áhorfanda
  var mv = lookAt(vec3(xDist, yDist, zDist), vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0));
  var mv2 = mv;

  // program1 er fyrir alla hlutina sem eru teiknaðir
  gl.useProgram(program1);

  // Setja modelview í hnútalitara 1
  gl.uniformMatrix4fv(mvLoc1, false, flatten(mv));

  // Teikna spaðann
  drawSpade(mv);

  // Teikna kassana
  drawBoxes(mv);

  // Teikna lífin
  drawLives(mv);

  // Teikna boltann
  drawBall(mv);
  // Hreyfa boltann
  moveBall();

  // Athuga hvort bolti skoppi af vegg
  checkWallCollission();

  // Athugar hvort bolti sé kominn niður í hyldýpi
  checkOutOfBounds(mv);
  // Ef bolti fór niður upphafsstillum við boltann
  if (wentOutOfBounds === true) {
    xBallPos = 0.0;   // Staðsetning bolta á x-ás
    yBallPos = -3.5;  // Staðsetning bolta á y-ás
    xBallDir = 0.05;  // Stefna á bolta í x-átt
    yBallDir = 0.05;  // Stefna á bolta í y-átt
    setTimeout(function(e) {
      wentOutOfBounds = false;
    }, 2000);
  }

  // Athuga hvort bolti skoppi af spaða
  checkSpadeCollission();

  // Athuga hvort bolti snerti eitthvern kassa
  checkBoxCollission(mv);

  // program2 er fyrir mynstrin sem eru teiknuð
  gl.useProgram(program2);

  // Setja modelview í hnútalitara 2
  gl.uniformMatrix4fv(mvLoc2, false, flatten(mv2));

  // Teikna mynstrin
  drawTextures(mv2);

  // Athuga hvort leikur sé búinn (sigur eða tap)
  checkGameEnds();

  // Teikna allt upp á nýtt
  requestAnimFrame(render);
}
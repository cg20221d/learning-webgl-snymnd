const main = () =>{
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#kanvas');
    const gl = canvas.getContext('webgl');


    const vertices = [
        0.5, 0.0, 0.0, 1.0, 1.0,
        0.0, -0.5, 1.0, 0.0, 1.0,
        -0.5, 0.0, 1.0, 1.0, 0.0,
        0.0, 0.5, 1.0, 1.0, 1.0
    ];
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    // vertex shader
    var vertexShaderCode =  `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        uniform mat4 uModel;
        varying vec3 vColor;
        void main() {
            vec2 position = aPosition;
            gl_Position = uModel * vec4(position, 0.0, 1.0);
            vColor = aColor;
        }
    `;
    const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); //sampai sini sudah menjadi .o

    // fragmen shader
    const fragmenShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main(){
        gl_FragColor = vec4(vColor, 1.0);
    }`
    const fragmenShaaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmenShaaderObject, fragmenShaderCode);
    gl.compileShader(fragmenShaaderObject); //sampai sini sudah menjadi .o

    // shader program
    const shaderProgram = gl.createProgram(); //(.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmenShaaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);


    // varoaible lokal
    var theta = 0.0;
    var freeze = false;
    var horizontalSpeed = 0.0;
    var verticalSpeed = 0.0;
    var horizontalDelta = 0.0;
    var verticalDelta = 0.0;

    // variable pointer ke GLSL
    var uModel = gl.getUniformLocation(shaderProgram, "uModel");

    // bind attribute : told gpu how to collect position value from buffer to  every vertex that processing 
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(aPosition);

    const aColor = gl.getAttribLocation(shaderProgram, 'aColor');
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
        5 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT 
    );
    gl.enableVertexAttribArray(aColor);

    // Grafika interaktif
    // Tetikus
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick);
    // Papan ketuk
    function onKeydown(event) {
        if (event.keyCode == 32) freeze = !freeze;  // spasi
        // Gerakan horizontal: a ke kiri, d ke kanan
        if (event.keyCode == 65) {  // a
            horizontalSpeed = -0.01;
        } else if (event.keyCode == 68) {   // d
            horizontalSpeed = 0.01;
        }
        // Gerakan vertikal: w ke atas, s ke bawah
        if (event.keyCode == 87) {  // w
            verticalSpeed = -0.01;
        } else if (event.keyCode == 83) {   // s
            verticalSpeed = 0.01;
        }
    }
    function onKeyup(event) {
        if (event.keyCode == 32) freeze = !freeze;
        if (event.keyCode == 65 || event.keyCode == 68) horizontalSpeed = 0.0;
        if (event.keyCode == 87 || event.keyCode == 83) verticalSpeed = 0.0;
    }

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);


    // main loop
    const render = () => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // if(!freeze){
        //     theta += -0.01;
        //     gl.uniform1f(uTheta, theta);
        //     gl.uniform2fv(uTranslate, translate);
        // }

        // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        if (!freeze) {
            theta += 0.1;
        }
        horizontalDelta += horizontalSpeed;
        verticalDelta -= verticalSpeed;
        var model = glMatrix.mat4.create();
        glMatrix.mat4.rotateZ(
            model,
            model,
            theta * Math.PI / 10
        ) 
        glMatrix.mat4.translate(model, model, [horizontalDelta, verticalDelta, 0.0]);
        gl.uniformMatrix4fv(uModel,false, model);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);


    // drawing
    // gl.clearColor(0.0, 1.0, 1.0, 1.0); //(R G B A)
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
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
    const vertexShaderCode = 
    `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    uniform float uTheta;
    uniform vec2 uTranslate;
    varying vec3 vColor;
    void main() {
        //float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y;
        //float y = cos(uTheta) * aPosition.x + sin(uTheta) * aPosition.y;
        //gl_Position = vec4(x + uTranslate.x, y + uTranslate.y, 0.0, 1.0);

        vec2 position = aPosition;
        mat4 rotation = mat4(
            cos(uTheta), -sin(uTheta), 0.0, 0.0,
            sin(uTheta), cos(uTheta), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        mat4 translation = mat4(1.0, 0.0, 0.0, 0.0,
                                0.0, 1.0, 0.0, 0.0,
                                0.0, 0.0, 1.0, 0.0,
                                uTranslate.x, uTranslate.y, 0.0, 1.0);
        gl_Position = translation * rotation * vec4(position, 0.0, 1.0);
        vColor = aColor;
    }`
    ;
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
    var translate = [0.0, 0.0];

    // variable pointer ke GLSL
    var uTheta = gl.getUniformLocation(shaderProgram, 'uTheta');
    var uTranslate = gl.getUniformLocation(shaderProgram, 'uTranslate');

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

    // computer graphics 
    const onMouseClick = (event) => {
        freeze = !freeze;
    }
    document.addEventListener('click', onMouseClick);


    const onKeyUp = (event) => {
        if(event.code === 'Space'){
            // freeze = !freeze;
        } 
    }
    const onKeyDown = (event) => {
        if(event.code === 'Space'){
            // freeze = !freeze;
        }
        else if (event.code === 'KeyA'){
            // move left the vertex
            translate[0] -= 0.1;
        }
        else if (event.code === 'KeyD'){
            // move left the vertex
            translate[0] += 0.1;
        }
        else if (event.code === 'KeyW'){
            // move left the vertex
            translate[1] += 0.1;
        }
        else if (event.code === 'KeyW'){
            // move left the vertex
            translate[1] += 0.1;
        }
        else if (event.code === 'KeyS'){
            // move left the vertex
            translate[1] -= 0.1;
        }
    }


    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);


    // main loop
    const render = () => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // if(!freeze){
            theta += -0.01;
            gl.uniform1f(uTheta, theta);
            gl.uniform2fv(uTranslate, translate);
        // }

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);


    // drawing
    // gl.clearColor(0.0, 1.0, 1.0, 1.0); //(R G B A)
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
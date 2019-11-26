Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

function zombie(geometria, material, vida, velocidade){
    this.geometria = geometria;
    this.material = material;
    this.vida = vida;
    this.velocidade = velocidade;
}
var zombie1 = new zombie(new THREE.CubeGeometry(60,100,60), Physijs.createMaterial(new THREE.MeshNormalMaterial()), 100, 50) 

var zombieM = new Physijs.BoxMesh(zombie1.geometria,zombie1.material);
zombieM.name = 'zombie1'
zombieM.position.set(0,40,0)

var rays = [
    new THREE.Vector3(0,0,1),
    new THREE.Vector3(1,0,1),
    new THREE.Vector3(1,0,0),
    new THREE.Vector3(1,0,-1),
    new THREE.Vector3(0,0,-1),
    new THREE.Vector3(-1,0,-1),
    new THREE.Vector3(-1,0,0),
    new THREE.Vector3(-1,0,1),
]
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var clock = new THREE.Clock({autoStart: true});
var balas = []
var velocityJ = new THREE.Vector3(0,0,0)

var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3(0,-100,0))
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);
camera.position.set(0,100,400)

var controls = new THREE.PointerLockControls(camera, renderer.domElement)
controls.isLocked = true;
controls.connect();

const light = new THREE.AmbientLight(0xFFFFFF, 5);

var backG = [
    'textures/posx.jpg',    'textures/negx.jpg',
    'textures/posy.jpg',    'textures/negy.jpg',
    'textures/posz.jpg',    'textures/negz.jpg'
    
]
let bLoader = new THREE.CubeTextureLoader();
scene.background = bLoader.load(backG);

const floorM = Physijs.createMaterial(new THREE.MeshLambertMaterial({color: 0x0F0F0F, side: THREE.DoubleSide, map: new THREE.TextureLoader().load('textures/pedra.jpg')}), .8,.9)
const floorG = new THREE.PlaneGeometry(5100,5100,5,5);
var floor = new Physijs.BoxMesh(floorG, floorM);
floor.rotation.x = Math.PI/2
floor.setCcdMotionThreshold(1);
floor.setCcdSweptSphereRadius(0.2);


var wallM = Physijs.createMaterial(new THREE.MeshLambertMaterial({color: 0x0F0F0F, side: THREE.DoubleSide, map: new THREE.TextureLoader().load('textures/pedra.jpg')}), .8,.9)
const wallG = new THREE.PlaneGeometry(5100,1000);
var walls = []
for(let j = 0; j<4; j +=1){  
    var wall = new Physijs.BoxMesh(wallG, wallM);  
    walls.push(wall)
}
/*for(let j = 0; j<4; j +=1){  
walls[j].addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
});
}*/
walls[0].position.set(2550,500, 0)
walls[0].rotation.y += Math.PI/2

walls[1].position.set(-2550,500, 0)
walls[1].rotation.y += Math.PI/2

walls[2].position.set(0,500, 2550)

walls[3].position.set(0,500, -2550)



const cubeM = Physijs.createMaterial(new THREE.MeshLambertMaterial({color: 0x1F0F0F}), 1,.9)
const cubeG = new THREE.CubeGeometry(50,50,50)
const cube = new Physijs.BoxMesh(cubeG,cubeM)
cube.position.setY(400)



var moveFrente = false, moveTras = false, moveDir = false, moveEsq = false, podeSaltar= true;
function init(){ 
    scene.add(camera)
    scene.add(light)  
    scene.add(cube)
    scene.add(floor)
    scene.add(zombieM)
    for(i=0; i<walls.length; i+= 1){
        scene.add(walls[i])
    }
    scene.add( controls.getObject() );
    renderer.render(scene,camera)
}


let i = 0;


var onKeyDown = function (e){
    switch (e.keyCode){
        case 81:
            controls.lock()
            break;
        case 69:
            controls.unlock()
            break;
        case 38:case 87:
                moveFrente = true
        break;
        case 37: case 65:
                moveEsq = true
            break;
        case 40: case 83: 
        moveTras = true
            break;
        case 39: case 68:
                moveDir = true
            break;
        case 32:
            if (podeSaltar === true) 
            podeSaltar = false;
            break;
    }
}
var onKeyUp = function (e){
    switch (e.keyCode){
        case 38:case 87:
                moveFrente = false
        break;
        case 37: case 65:
                moveEsq = false
            break;
        case 40: case 83: 
        moveTras = false
            break;
        case 39: case 68:
                moveDir = false
            break;
     
    }
}

let domEvents = new THREEx.DomEvents(camera, renderer.domElement)
document.addEventListener( 'keydown', onKeyDown, false );
document.addEventListener( 'keyup', onKeyUp, false );
document.addEventListener('click', function(){
 
    bala = new Physijs.BoxMesh(new THREE.CubeGeometry(2,2,2), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0xFFFFFF
    })))
    
    bala.addEventListener('collision', function(objCollidedWith, linearVelOfCollision, angularVelOfCollision){
        console.log('TIRO', objCollidedWith);
        objCollidedWith.vida -=20;
        console.log(objCollidedWith.vida)
    })
    balas.push(bala)
    var velocityB = controls.getDirection(new THREE.Vector3(0,0,0))
    balas[balas.length - 1].position.set(camera.position.x,camera.position.y,camera.position.z)
    balas[balas.length - 1].addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        if (objCollidedWith.name === 'jogador'){
            console.log(objCollidedWith)

        }
    });
    
    scene.add(balas[balas.length  -1])
    if (balas.length > 15){
        scene.remove(balas[i])
        i++;
    }
    balas[balas.length  -1].setLinearVelocity(new THREE.Vector3(velocityB.x * 10000 ,velocityB.y * 10000, velocityB.z * 10000 ))
    
})

function animate(){
    requestAnimationFrame(animate);
    //controls.update();
    //camera.lookAt(cube)
    if ( controls.isLocked === true ) {
        var delta = clock.getDelta()
        //console.log(delta)
        velocityJ.x -= velocityJ.x * 10.0 * delta;
        velocityJ.z -= velocityJ.z * 10.0 * delta;
        velocityJ.y -= 9.8 * delta; 
        if (camera.position.x < 2500 && camera.position.x > -2500 && camera.position.z < 2500 && camera.position.z > -2500){
            if ( moveFrente ) velocityJ.z -=  19000 * delta;
            if ( moveTras ) velocityJ.z +=  19000 * delta;
            if ( moveDir ) velocityJ.x -= 19000 * delta;
            if ( moveEsq ) velocityJ.x += 19000 * delta;
    
        }
        else if (camera.position.x >= 2500){
            camera.position.x = 2499
        }
        else if (camera.position.x <= -2500){
            camera.position.x = -2499
        }
        else if (camera.position.z >= 2500){
            camera.position.z = 2499
        }
        else if (camera.position.z <= -2500){
            camera.position.z = -2499
        }
        floor.setCcdMotionThreshold(1);
        floor.setCcdSweptSphereRadius(0.2);
        controls.moveRight( - velocityJ.x * delta );
        controls.moveForward( - velocityJ.z * delta );
        if (balas.length > 0){
        balas[balas.length - 1].setCcdMotionThreshold(1);
        balas[balas.length - 1].setCcdSweptSphereRadius(0.2);
        }
        zombieM.setCcdMotionThreshold(1);
        zombieM.setCcdSweptSphereRadius(0.2);
        if ( controls.getObject().position.y < 10 ) {
            velocity.y = 0;
            controls.getObject().position.y = 50;
            podeSaltar = true;
        }
    }    
    
    
    scene.simulate();
    ajustarJanela();
    renderer.render(scene, camera)
}




init()
animate()

function ajustarJanela(){
    window.addEventListener('resize', function(){
        renderer.setSize(window.innerWidth,window.innerHeight);
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
    })
}

Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls,sphereBody;
var clock = new THREE.Clock({
    autoStart: true
});
var balasJ = []
var velocityJ = new THREE.Vector3(0, 0, 0)

var scene = new THREE.Scene();
//scene.setGravity(new THREE.Vector3(0, -200, 0))
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 20000);
camera.position.set(000, 50, 2000)
var listener = new THREE.AudioListener();
camera.add(listener)
var sound = new THREE.Audio(listener)
var audioLoader = new THREE.AudioLoader();
audioLoader.load('textures/rapArmas.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.1);
    //sound.play();
})


const light = new THREE.AmbientLight(0xFFFFFF, 5);

var backG = [
    'textures/bluecloud_ft.jpg', 'textures/bluecloud_bk.jpg',
    'textures/bluecloud_up.jpg', 'textures/bluecloud_dn.jpg',
    'textures/bluecloud_rt.jpg', 'textures/bluecloud_lf.jpg'

]
let bLoader = new THREE.CubeTextureLoader();
scene.background = bLoader.load(backG);

var floorM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
    color: 0x180000,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('textures/atrofio.jpg')
}))
var floorG = new THREE.PlaneGeometry(8000, 8000);
var floor = new Physijs.BoxMesh(floorG, floorM);
floor.rotation.x = Math.PI / 2
floor.name = 'chao'


var wallM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
    color: 0x0F0F0F,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('textures/colorMasked.jpg')
}))
var wallG = new THREE.PlaneGeometry(8000, 1000);
var walls = []
for (let j = 0; j < 4; j += 1) {
    var wall = new Physijs.BoxMesh(wallG, wallM);
    walls.push(wall)
}
/*for(let j = 0; j<4; j +=1){  
walls[j].addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
});
}*/
walls[0].position.set(4000, 500, 0)
walls[0].rotation.y += Math.PI / 2

walls[1].position.set(-4000, 500, 0)
walls[1].rotation.y += Math.PI / 2

walls[2].position.set(0, 500, 4000)

walls[3].position.set(0, 500, -4000)

// RGB
var red = 0xFF0000
var green = 0x00FF00
var blue = 0x0000FF

function ajustarJanela() {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}


function jogador() {
    this.geometria = new THREE.SphereGeometry(20, 32, 32);
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial())
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999)
    this.mesh.vida = 100
}
let jogador1 = new jogador();
//jogador1.mesh.position.set(camera.position.x, 100, camera.position.z)
jogador1.mesh.addEventListener('collision', function (obj, linearV, angularV) {
    console.log(obj)
})

var controls = new THREE.PointerLockControls(camera, renderer.domElement);
controls.connect();
function zombie(vida, velocidade) {
    this.geometria = new THREE.CubeGeometry(60, 100, 60);;
    this.material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        color: 0xF0F0F0,
        map: new THREE.TextureLoader().load('textures/neon.jpg')
    }));
    this.vida = vida;
    this.velocidade = velocidade;
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material,0)
    
    this.mesh.vida = 100;
    this.mesh.name = 'zombie'
    this.mesh.alive = true;
}
let zombies = [];
for (let m = 0; m < 10; m += 1) {
    zombies[m] = new zombie(100, 30);
    zombies[m].mesh.position.set(-Math.random() * 2000 - 100, 70, -Math.random() * 2000 - 100)
}


function tirarVidaBalaJogador(objeto) {
    objeto.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        if (objCollidedWith.name === 'zombie') {
            if (objCollidedWith.alive === true) {
                if (objCollidedWith.vida > 0) {
                    objCollidedWith.vida -= 20
                    if (objCollidedWith.vida === 0) {
                        objCollidedWith.alive = false
                        scene.remove(objCollidedWith)
                    }
                }
                if (objCollidedWith.vida === 20) {
                    objCollidedWith.material.color.set(green)
                }
            }
        }
    }) //****/

}

function movimentoBalaJogador(objeto) {
    direcao = controls.getDirection(new THREE.Vector3(0, 0, 0))
    objeto.setLinearFactor(new THREE.Vector3(0, 0, 0))
    objeto.setLinearVelocity(new THREE.Vector3(direcao.x * 18000, direcao.y * 18000, direcao.z * 18000))

}

function fixarMovimento(obj) { // aka 'MOTION CLAMPING'
    obj.setCcdMotionThreshold(1);
    obj.setCcdSweptSphereRadius(0.2);
}

//************************************************************************************** */


var moveFrente = false,
    moveTras = false,
    moveDir = false,
    moveEsq = false,
    moveCima = false,
    moveBaixo = false,
    podeSaltar = true;

    let tl = new TimelineMax()
   
function init() {
    scene.add(camera)
    scene.add(light)
    scene.add(jogador1.mesh)
    scene.add(floor)
    
    scene.add(controls.getObject());
    for (let n = 0; n < 10; n += 1) {
        scene.add(zombies[n].mesh)
    }
    for (i = 0; i < walls.length; i += 1) {
        scene.add(walls[i])
    }
    //scene.add(controls.getObject());
    renderer.render(scene, camera)
}


let i = 0;
onKeyDown = function (e) {
    switch (e.keyCode) {
        case 81:
            controls.lock()
            break;
        case 69:
            controls.unlock()
            break;
        case 38:
        case 87:
            moveFrente = true
            break;
        case 37:
        case 65:
            moveEsq = true
            break;
        case 40:
        case 83:
            moveTras = true
            break;
        case 39:
        case 68:
            moveDir = true
            break;
        case 32:
            moveCima = true
            break;
        case 16:
            moveBaixo = true
            break;
    }
}
var onKeyUp = function (e) {
    switch (e.keyCode) {
        case 38:
        case 87:
            moveFrente = false
            break;
        case 37:
        case 65:
            moveEsq = false
            break;
        case 40:
        case 83:
            moveTras = false
            break;
        case 39:
        case 68:
            moveDir = false
            break;
        case 32:
            moveCima = false
            break;
        case 16:
            moveBaixo = false
            break;
            
        
    }
    }


let domEvents = new THREEx.DomEvents(camera, renderer.domElement)
let r = 0,
    loop = false

   
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

//disparo jogador
document.addEventListener('click', function () {
    bala = new Physijs.BoxMesh(new THREE.SphereGeometry(1, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0xffffff
    })))
    bala.position.set(camera.position.x, camera.position.y, camera.position.z)

    if (balasJ.length < 10 && r !== 10) {
        balasJ[r] = bala;
        scene.add(balasJ[r])
        movimentoBalaJogador(balasJ[r])
        fixarMovimento(balasJ[r])
        tirarVidaBalaJogador(balasJ[r])
        r += 1
    } else {
        if (r < 9) {
            scene.remove(balasJ[r + 1])
        }
        balasJ[r] = bala;
        scene.add(balasJ[r])
        movimentoBalaJogador(balasJ[r])
        tirarVidaBalaJogador(balasJ[r])
        fixarMovimento(balasJ[r])
        r += 1
    }
    if (r === 10) {
        r = 0
        scene.remove(balasJ[0])
    }
    // console.log(balasJ.length)
    // console.log('R ', r)
})


function obterDirecao(fonte, destino) {
    direcao = new THREE.Vector3(destino.position.x - fonte.position.x, destino.position.y - fonte.position.y, destino.position.z - fonte.position.z);
    return direcao;
}

function balaZ() {
    this.mesh = new Physijs.BoxMesh(new THREE.SphereGeometry(5, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load('textures/fire1.jpg')
    })))
    this.mesh.name = 'balaZombie'
}

let c = 0,
    z = 0,
    actual = 0,
    frame = 0,
    balasZ = [],
    distance = 20,
    collisions, direcoesB = [],direcoesZ = [], direcao = new THREE.Vector3();



function animate() {
    jogador1.mesh.position.set(camera.position.x,100, camera.position.z)
    frame += 1;
    //controls.update();
    //camera.lookAt(cube)
    

    if (controls.isLocked === true) {
        var delta = clock.getDelta()
        //console.log(delta)
        velocityJ.x -= velocityJ.x * 10.0 * delta;
        velocityJ.z -= velocityJ.z * 10.0 * delta;

        // Movimento Jogador
        if (camera.position.x < 3950 && camera.position.x > -3950 && camera.position.z < 3950 && camera.position.z > -3950) {
            if (moveFrente) velocityJ.z += 9000 * delta;
            if (moveTras) velocityJ.z -= 9000 * delta;
            if (moveDir) velocityJ.x += 9000 * delta;
            if (moveEsq) velocityJ.x -= 9000 * delta;
            if (moveCima) controls.getObject().position.y += 900 * delta;
            if (moveBaixo) controls.getObject().position.y -= 900 * delta;

        } else if (controls.getObject().position.x >= 3950) {
            controls.getObject().position.x = 3949
        } else if (controls.getObject().position.x <= -3950) {
            controls.getObject().position.x = -3949
        } else if (controls.getObject().position.z >= 3950) {
            controls.getObject().position.z = 3949
        } else if (controls.getObject().position.z <= -3950) {
            controls.getObject().position.z = -3949
        }

        controls.moveRight(velocityJ.x * delta);
        controls.moveForward(velocityJ.z * delta);
        
        // console.log(balasJ.length)
        //console.log('balas Zombie' , balasZ.length)
        for(n=0; n<zombies.length; n+=1){
            if(zombies[n].mesh.alive){
                distance = new THREE.Vector3(controls.getObject().position.x - zombies[n].mesh.position.x,controls.getObject().position.y - zombies[n].mesh.position.y,controls.getObject().position.z - zombies[n].mesh.position.z)
                direcao = obterDirecao(zombies[n].mesh, controls.getObject())
                if(distance.x < 500 && distance.z< 500){
                    zombies[n].mesh.position.x += direcao.x * delta 
                    zombies[n].mesh.position.z += direcao.z * delta    
                }
               }
            }

        // Disparo Inimigos
        if (frame % 180 === 0) {   
            console.log(zombies[0].mesh.position) 
            if (balasZ.length === 10) {
                for (c = 0; c < zombies.length; c += 1){
                    if(zombies[c].mesh.alive){
                        scene.remove(balasZ[c].mesh)
                    }
                }
            }
            for (i = 0; i < zombies.length; i += 1) {
                balasZ[i] = new balaZ();
            }
            for (i = 0; i < balasZ.length; i += 1) {
                if (zombies[i].mesh.alive === true) {
                    balasZ[i].mesh.addEventListener('collision', function (obj, lV, aV) {
                        console.log(obj.name)
                    })
                    balasZ[i].mesh.position.set(zombies[i].mesh.position.x, zombies[i].mesh.position.y, zombies[i].mesh.position.z)
                    direcoesB= obterDirecao(zombies[i].mesh, controls.getObject())
                    scene.add(balasZ[i].mesh)
                    balasZ[i].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
                    balasZ[i].mesh.setLinearVelocity(new THREE.Vector3(direcoesB.x, direcoesB.y, direcoesB.z))
                }
            }
            console.log(balasZ.length)
        }
    }
    //scene.simulate();
    ajustarJanela();
    renderer.render(scene, camera)
    requestAnimationFrame(animate);

}



init()

animate()
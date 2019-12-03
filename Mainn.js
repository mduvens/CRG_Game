Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

//************************************************************* */
// RGB
var red = 0xFF0000
var green = 0x00FF00
var blue = 0x0000FF
let c = 0,
    z = 0,
    s = 0,
    actual = 0,
    frame = 0,
    balasZ = [],
    distance,
    collisions, direcoesB = [],
    direcoesZ = [],
    direcao = new THREE.Vector3();
pontos = 0;
var controls, zombiemeshes = [],
    deadZombies = 0;
var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var scene = new Physijs.Scene();
//scene.setGravity(new THREE.Vector3(0, -200, 0))
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 20000);




var clock = new THREE.Clock({
    autoStart: true
});
var balasJ = []
var velocityJ = new THREE.Vector3(0, 0, 0)

var listener = new THREE.AudioListener();
camera.add(listener)
var sound = new THREE.PositionalAudio(listener);
var sound1 = new THREE.Audio(listener)
var audioLoader = new THREE.AudioLoader();
var audioLoader1 = new THREE.AudioLoader();


const light = new THREE.AmbientLight(0xFFFFFF, 1);

var backG = [
    'textures/graycloud_ft.jpg', 'textures/graycloud_bk.jpg',
    'textures/graycloud_up.jpg', 'textures/graycloud_dn.jpg',
    'textures/graycloud_rt.jpg', 'textures/graycloud_lf.jpg'

]
let bLoader = new THREE.CubeTextureLoader();
scene.background = bLoader.load(backG);

var floorM = Physijs.createMaterial(new THREE.MeshLambertMaterial({
    color: 0x505050,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('textures/floorT.png')
}))
var floorG = new THREE.PlaneGeometry(8000, 8000);
var floor = new Physijs.BoxMesh(floorG, floorM);
floor.rotation.x = Math.PI / 2
floor.name = 'chao'

var materialLimite = Physijs.createMaterial(new THREE.MeshLambertMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load('textures/woodS.jpg')
}))
var geometriaLimite = new THREE.PlaneGeometry(8000, 1000);
var paredesLimite = []
for (let j = 0; j < 4; j += 1) {
    var paredeL = new Physijs.BoxMesh(geometriaLimite, materialLimite);
    paredesLimite.push(paredeL)
}
paredesLimite[0].position.set(4000, 500, 0)
paredesLimite[0].rotation.y += Math.PI / 2
paredesLimite[1].position.set(-4000, 500, 0)
paredesLimite[1].rotation.y += Math.PI / 2
paredesLimite[2].position.set(0, 500, 4000)
paredesLimite[3].position.set(0, 500, -4000)

materialInterior = Physijs.createMaterial(new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide
}))
geometriaInterior = new THREE.PlaneGeometry(7000, 1000)
var paredesInterior = []
for (let i = 0; i < 3; i += 1) {
    var paredeI = new Physijs.BoxMesh(geometriaInterior, materialInterior)
    paredesInterior.push(paredeI)
}
paredesInterior[0].position.set(500, 500, 2000)
// paredesInterior[0].rotation.y += Math.PI / 2
paredesInterior[2].position.set(-500, 500, 0)
paredesInterior[1].position.set(500, 500, -2000)
// paredesInterior[1].rotation.y += Math.PI / 2


function ajustarJanela() {
    window.addEventListener('resize', function () {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
}
// funcao comida
comida = function () {
    this.geometria = new THREE.OctahedronGeometry(30)
    this.material = new THREE.MeshLambertMaterial({
        color: 0xD0D0D0,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('textures/gold.jpg')
    })
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 0);
    this.mesh.alive = true
    this.mesh.name = "comida"
}
// funcao jogador
function jogador() {
    this.geometria = new THREE.SphereGeometry(100, 32, 32);
    this.material = Physijs.createMaterial(new THREE.MeshBasicMaterial())
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 999)
    this.mesh.vida = 100
    this.mesh.alive = true
}
let junto = false;
let jogador1 = new jogador();

// colisão jogador
jogador1.mesh.addEventListener('collision', function (obj, linearV, angularV) {
    if (obj.name === 'balaZombie') {
        if (jogador1.mesh.vida > 0) {
            //jogador1.mesh.vida -= 20;
            //console.log(obj)
        }
    }
    if (obj.name === 'comida') {
        audioLoader1.load('sounds/coin.wav', function (buffer) {
            sound1.setBuffer(buffer);
            //sound.setLoop(true);
            sound1.setVolume(0.9);
            sound1.play();
        })
        obj.alive = false;
        scene.remove(obj)
        pontos++;

    }
    //console.log(jogador1.mesh.vida)
})

var controls = new THREE.PointerLockControls(camera, renderer.domElement);
let car
// LOADERS
// var loader = new THREE.GLTFLoader();
// loader.load(
// 	// resource URL
// 	'untitled.glb',
// 	// called when the resource is loaded
// 	function ( gltf ) {
// 		scene.add( gltf.scene);
//         gltf.scene.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
//             console.log(obj)
//         })
// 		// gltf.animations; // Array<THREE.AnimationClip>
// 		// gltf.scene; // THREE.Scene
// 		// gltf.scenes; // Array<THREE.Scene>
// 		// gltf.cameras; // Array<THREE.Camera>
//         // gltf.asset; // Object
//       gltf.scene.position.set(0,300,0)
//         gltf.scene.scale.set(50,50,50)
//        console.log(gltf.scene.position)
//     },

// called while loading is progressing
// function ( xhr ) {

// 	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// },
// // called when loading has errors
// function ( error ) {

// 	console.log( 'An error happened' );

// }
// );

// funcao zombie
zombieASeguir = false

function zombie(vida, velocidade) {
    this.geometria = new THREE.CubeGeometry(60, 100, 60);;
    this.material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
        //color: 0x000000,
        map: new THREE.TextureLoader().load('textures/clownT.jpg')
    }), .6, .6);
    this.vida = vida;
    this.velocidade = velocidade;
    this.mesh = new Physijs.BoxMesh(this.geometria, this.material, 0)

    this.mesh.vida = 100;
    this.mesh.name = 'zombie'
    this.mesh.alive = true;
    this.mesh.rage = false
    this.aSeguir = function (bool) {
        if (bool === true) {
            this.material.color.set(red)
            this.mesh.rage = true
        } else {
            this.material.color.set(0xF0F0F0)
            this.mesh.rage = false
        }
    }

    this.mesh.add(sound);
}
var numeroZombies = 5;
zombies = [];

// funcao adicionar zombies
function addZombies() {

    for (let m = 0; m < numeroZombies; m += 1) {
        zombies[m] = new zombie(100, 30);
        //zombiemeshes[m] = zombies[m].mesh;
        zombies[m].mesh.position.set((Math.random() - 0.5) * 3800 - 1000, 70, (Math.random() - 0.5) * 3800 - 1000)
        scene.add(zombies[m].mesh)

    }
    /*for (let n = 0; n < zombies.length; n += 1) {
        
    }  */
}
var numeroComida = 3,
    comidas = [];

// funcao adicionar comida
function addComida() {

    for (let m = 0; m < numeroComida; m += 1) {
        comidas[m] = new comida();
        comidas[m].mesh.position.set((Math.random() - 0.5) * 3800 - 1000, 70, (Math.random() - 0.5) * 3800 - 1000)


        scene.add(comidas[m].mesh)
    }
    /*for (let n = 0; n < zombies.length; n += 1) {
        
    }  */
}


// funcao disparo jogador
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

function tirarVidaBalaJogador(objeto) {
    objeto.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        if (objCollidedWith.name === 'zombie') {
            if (objCollidedWith.alive === true) {
                if (objCollidedWith.vida > 0) {
                    objCollidedWith.vida -= 20
                    if (objCollidedWith.vida === 0) {
                        objCollidedWith.alive = false
                        deadZombies++;
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


let r = 0,
    loop = false


document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);



function obterDirecao(fonte, destino) {
    direcao = new THREE.Vector3(destino.position.x - fonte.position.x, destino.position.y - fonte.position.y, destino.position.z - fonte.position.z);
    return direcao;
}

function balaZ() {
    this.mesh = new Physijs.BoxMesh(new THREE.SphereGeometry(10, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: red,
        map: new THREE.TextureLoader().load('textures/fire1.jpg')
    })))
    this.mesh.name = 'balaZombie'
    this.mesh.alive = true;
}




let k = 0,
    cont = 0,
    naParede = false;
limitarMovJogador = function () {
    if (camera.position.x > -3000 && camera.position.z === 2010) {
        controls.getObject().position.z = 2011

    }
    if (camera.position.x < 3950 && camera.position.x > -3950 && camera.position.z < 3950 && camera.position.z > -3950 && camera.position.y > 50) {
        if (moveFrente) velocityJ.z += 19000 * delta;
        if (moveTras) velocityJ.z -= 19000 * delta;
        if (moveDir) velocityJ.x += 19000 * delta;
        if (moveEsq) velocityJ.x -= 19000 * delta;
        if (moveCima) controls.getObject().position.y += 900 * delta;
        if (moveBaixo) controls.getObject().position.y -= 900 * delta;

    }
    if (camera.position.x >= 3950) {
        camera.position.x = 3949
    }
    if (camera.position.x <= -3950) {
        camera.position.x = -3949
    }
    if (camera.position.z >= 3950) {
        camera.position.z = 3949
    }
    if (camera.position.z <= -3950) {
        camera.position.z = -3949
    }
    if (camera.position.y <= 50) {
        camera.position.y = 50.00001
    }


}

novaRonda = function () {
    numeroZombies += 5
    numeroComida += 1
    addComida()
    addZombies()
    pontos = 0;
    deadZombies = 0;
}

function init() {
    camera.position.set(0, 1500, 1500)
    scene.add(camera)
    scene.add(light)
    scene.add(jogador1.mesh)
    scene.add(floor)
    addZombies()
    addComida()
    scene.add(controls.getObject());
    for (i = 0; i < paredesLimite.length; i += 1) {
        scene.add(paredesLimite[i])
    }
    for (i = 0; i < paredesInterior.length; i += 1) {
        scene.add(paredesInterior[i])
    }
    //scene.add(controls.getObject());
    renderer.render(scene, camera)

}
let offset = 0.01


function animate() {

    //controls.update();
    //camera.lookAt(cube)
    if (controls.isLocked === true) {
        for (let m = 0; m < numeroComida; m += 1) {
            comidas[m].mesh.__dirtyRotation = true;
            comidas[m].mesh.rotation.z += offset
            comidas[m].mesh.rotation.x += offset
        }
        jogador1.mesh.position.set(camera.position.x, camera.position.y, camera.position.z)
        jogador1.mesh.__dirtyPosition = true
        frame += 1;
        for (let m = 0; m < numeroComida; m += 1) {
            if (comidas[m].mesh.alive) {
                comidas[m].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
            }
        }

        delta = clock.getDelta()
        //console.log(delta)
        limitarMovJogador();
        velocityJ.x -= velocityJ.x * 10.0 * delta;
        velocityJ.z -= velocityJ.z * 10.0 * delta;

        // Movimento Jogador

        controls.moveRight(velocityJ.x * delta);
        controls.moveForward(velocityJ.z * delta);

        // console.log(balasJ.length)
        //console.log('balas Zombie' , balasZ.length)
        // zombies a seguir
        for (n = 0; n < zombies.length; n += 1) {
            if (zombies[n].mesh.alive) {
                zombies[n].mesh.__dirtyPosition = true;
                distance = new THREE.Vector3(controls.getObject().position.x - zombies[n].mesh.position.x, controls.getObject().position.y - zombies[n].mesh.position.y, controls.getObject().position.z - zombies[n].mesh.position.z)
                direcao = obterDirecao(zombies[n].mesh, camera)
                if (distance.x < 1000 && distance.z < 1000) {
                    zombies[n].aSeguir(true);
                    zombies[n].mesh.position.x += direcao.x * delta
                    zombies[n].mesh.position.z += direcao.z * delta
                    if (frame % 120 === 0) {
                        audioLoader.load('sounds/zombie1s.wav', function (buffer) {
                            sound.setBuffer(buffer);
                            sound.setRefDistance(50);
                            sound.play();
                        });
                    }

                } else {
                    zombies[n].aSeguir(false);
                }
            }
        }
        // if (cont === 0 || pontos === numeroComida) {
        //     controls.unlock()
        // }


        // Disparo zombie
        if (frame % 180 === 0) {
            console.log(camera.position)
            //console.log(camera.position)
            if (balasZ.length === zombies.length) {
                for (c = 0; c < zombies.length; c += 1) {
                    if (zombies[c].mesh.alive && zombies[c].mesh.rage)
                        scene.remove(balasZ[c].mesh)
                }
            }
            for (c = 0; c < balasZ.length; c += 1) {
                scene.remove(balasZ[c])
            }
            for (c = 0; c < zombies.length; c += 1) {
                if (zombies[c].mesh.alive) {
                    balasZ[c] = new balaZ();
                }
            }
            for (i = 0; i < balasZ.length; i += 1) {
                if (zombies[i].mesh.alive === true) {

                    distance = new THREE.Vector3(controls.getObject().position.x - zombies[i].mesh.position.x, controls.getObject().position.y - zombies[i].mesh.position.y, controls.getObject().position.z - zombies[i].mesh.position.z)
                    if (distance.x < 1000 && distance.z < 1000) {
                        /*balasZ[i].mesh.addEventListener('collision', function (obj, lV, aV) {
                            console.log(obj.name)
                        })*/
                        balasZ[i].mesh.position.set(zombies[i].mesh.position.x, zombies[i].mesh.position.y, zombies[i].mesh.position.z)
                        direcoesB = obterDirecao(zombies[i].mesh, controls.getObject())
                        scene.add(balasZ[i].mesh)
                        balasZ[i].mesh.__dirtyPosition = true
                        balasZ[i].mesh.setLinearFactor(new THREE.Vector3(0, 0, 0))
                        balasZ[i].mesh.setLinearVelocity(new THREE.Vector3(direcoesB.x * 2, direcoesB.y * 2, direcoesB.z * 2))
                    }
                }
            }
            //console.log(zombies.length)
            //console.log(balasZ.length)

        }
        if (jogador1.mesh.vida === 0) {
            alert("MORRESTE VEADO")
            camera.position.set(0, 50, 0)
            jogador1.mesh.vida = 100;
        }
        if (frame % 60 === 0) {
            if (deadZombies === numeroZombies || pontos === numeroComida) {
                // .......limpar (em falta)
                for (n = 0; n < zombies.length; n += 1) {
                    if (zombies[n].mesh.alive) {
                        zombies[n].aSeguir(false)
                        scene.remove(zombies[n].mesh)

                    }
                }
                for (n = 0; n < comidas.length; n += 1) {
                    if (comidas[n].mesh.alive) {
                        scene.remove(comidas[n].mesh)
                    }
                }

                alert("RONDA " + (numeroZombies / 5) + " COMPLETA");
                alert("PREPARA-TE. RONDA " + (numeroZombies / 5 + 1));

                novaRonda()
                camera.position.set(0, 50, 0)

            }

        }


    }
    scene.simulate();
    ajustarJanela();
    renderer.render(scene, camera)
    requestAnimationFrame(animate);

}
init()
animate()
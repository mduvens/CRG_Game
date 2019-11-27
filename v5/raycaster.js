var isOnObject = false;
var canJump = false;
var velocity = new THREE.Vector3();

isOnObject = function (boolean) {

    isOnObject = boolean;
    canJump = boolean;

};
if (isOnObject === true) {

    velocity.y = Math.max(0, velocity.y);
    velocity.x = 0;
    velocity.z = 0;

}
var collisionDetection = function(controls, cubes) {

    function bounceBack(position, ray) {
        position.x -= ray.bounceDistance.x;
        position.y -= ray.bounceDistance.y;
        position.z -= ray.bounceDistance.z;
    }

    var rays = [
        //   Time    Degrees      words
        new THREE.Vector3(0, 0, 1),  // 0 12:00,   0 degrees,  deep
        new THREE.Vector3(1, 0, 1),  // 1  1:30,  45 degrees,  right deep
        new THREE.Vector3(1, 0, 0),  // 2  3:00,  90 degress,  right
        new THREE.Vector3(1, 0, -1), // 3  4:30, 135 degrees,  right near
        new THREE.Vector3(0, 0, -1), // 4  6:00  180 degress,  near
        new THREE.Vector3(-1, 0, -1),// 5  7:30  225 degrees,  left near
        new THREE.Vector3(-1, 0, 0), // 6  9:00  270 degrees,  left
        new THREE.Vector3(-1, 0, 1)  // 7 11:30  315 degrees,  left deep
    ];

    var position = controls.getObject().position;
    var rayHits = [];
    for (var index = 0; index < rays.length; index += 1) {

        // Set bounce distance for each vector
        var bounceSize = 0.01;
        rays[index].bounceDistance = {
            x: rays[index].x * bounceSize,
            y: rays[index].y * bounceSize,
            z: rays[index].z * bounceSize
        };

        raycaster.set(position, rays[index]);

        var intersections = raycaster.intersectObjects(cubes);

        if (intersections.length > 0 && intersections[0].distance <= 3) {
            controls.isOnObject(true);
            bounceBack(position, rays[index]);
        }
    }

    return false;
};
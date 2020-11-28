import {
  Group,
  Mesh,
  OctahedronBufferGeometry,
  MeshBasicMaterial,
  DoubleSide,
} from "../../three.module.js";
import { getRandomInt } from "../buildWorld.js";

// Creating clouds as groupings of Octahedron meshes,
// Inspired by the cloud generating algorithm found on a three.js tutorial by Karim Maaloul
// at https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
function createCloud() {
  const xRange = { min: -45, max: 10 };
  const yRange = { min: 70, max: 72 };
  const zRange = { min: -20, max: 30 };

  // Create the grouping that will hold the meshes that make up a single cloud
  let cloud = new Group();

  // Octahedron will be used and grouped together to make the appearance of soft, full clouds
  let cloudGeometry = new OctahedronBufferGeometry(7, 1);

  // Let's create a off-white, transparent material
  let cloudMaterial = new MeshBasicMaterial({
    color: 0x989898,
    transparent: true,
    opacity: 0.2,
    side: DoubleSide,
  });

  // duplicate the geometry a random number of times
  // The number of octahedrons per cloud unit will be minimum 5 plus some random amount no more than 3.
  let cloudBlocks = 3 + Math.floor(Math.random() * 2);
  for (var i = 0; i < cloudBlocks; i++) {
    // Create the mesh component of this particular cloud unit
    let cloudMesh = new Mesh(cloudGeometry, cloudMaterial);

    // Create a random position for the cloud piece in 3d space within this unit
    cloudMesh.position.x = Math.random() * 30;
    cloudMesh.position.y = Math.random() * 3;
    cloudMesh.position.z = Math.random() * 2;

    // Rotate the octahedron around its z and y axes to give it some variation
    cloudMesh.rotation.z = Math.random() * Math.PI * 2;
    cloudMesh.rotation.y = Math.random() * Math.PI * 2;

    // Randomly generate a scale for each piece of this overall cloud unit
    let randomScale = 0.1 + Math.random() * 0.9;
    cloudMesh.scale.set(randomScale, randomScale, randomScale);

    // Add this cloud piece to the overall cloud unit
    cloud.add(cloudMesh);
  }

  // Set the cloud made up of cloud units into a random x, y, z coordinate in 3d space based on our desired limitations along the axes
  cloud.position.set(
    getRandomInt(xRange.min, xRange.max),
    getRandomInt(yRange.min, yRange.max),
    getRandomInt(zRange.min, zRange.max)
  );

  // Return the overarching cloud unit
  return cloud;
}

// Create an entire grouping of the above clouds as a "sky" allowing us to manipulate all clouds at once
// Each sky contains cloudCount number of cloud units within it.
function createSky(cloudCount) {
  // This group/container will hold all clouds as a single mesh grouping
  let sky = new Group();
  // Add to this mesh the desired number of clouds
  for (let i = 0; i < cloudCount; i++) {
    sky.add(createCloud());
  }

  // Set the update function for the sky to be a rotation around its own y axis at the given speed.
  sky.update = () => {
    sky.rotation.y += 0.0004;
  };

  // Return the sky mesh as a whole that can be manipulated
  return sky;
}

export { createSky };
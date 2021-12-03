import {
  Object3D,
  MeshPhongMaterial,
  Mesh,
  NoBlending,
  BoxGeometry,
} from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

// returns a Object3D that has a mesh and a css3D object
export const createElemObject = (
  domRef,
  width,
  height,
  planeColor,
  opacity,
  clipPlane = false
) => {
  // console.log('Creating meshcss with dom ref', domRef, width, height);

  // styling the dom element
  domRef.style.width = width + "px";
  domRef.style.height = height + "px";
  domRef.style.opacity = 0.999;
  domRef.style.boxSizing = "border-box";

  // we use a "container" to chain together the mesh and css3dobj
  var obj = new Object3D();
  obj.scale.set(0.1, 0.1, 0.1);
  var css3dObject = new CSS3DObject(domRef);
  obj.css3dObject = css3dObject;
  obj.add(css3dObject);
  console.log(css3dObject);

  if (clipPlane) {
    // clip a WebGL geometry with it.
    var material = new MeshPhongMaterial({
      opacity: opacity,
      color: planeColor,
      blending: NoBlending,
    });
    var geometry = new BoxGeometry(width / 10, height / 10, 1);
    var mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    obj.lightShadowMesh = mesh;
    obj.add(mesh);
  }

  // console.log('Returned object: ', obj);
  return obj;
};

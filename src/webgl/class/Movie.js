import {
  BoxGeometry,
  Color,
  Mesh,
  MeshPhongMaterial,
  NoBlending,
  Object3D,
  Sprite,
  SpriteMaterial,
} from "three";

const w = 4.5;
const h = w * 1.5;
const xOffset = -15;
const padding = w;
const yOffset_bot = -5.5;
const yOffset_top = 6;

/**
 * Class for the entire movie object
 */
export default class Movie {
  constructor(movieObjs) {
    this.movieObjs = movieObjs;
  }

  init(loader) {
    return this.initPosters(loader);
  }

  initPosters(loader) {
    let posterObjs = new Object3D();
    this.movieObjs.forEach((movie, index) => {
      let imgLink = movie.imgLink;
      let imageObj = new Object3D();

      const map = loader.load(imgLink);
      const material = new SpriteMaterial({ map: map });
      const sprite = new Sprite(material);
      sprite.scale.set(w, h, 1);
      imageObj.sprite = sprite;
      imageObj.add(sprite);

      // clip a WebGL geometry with it.
      let planeColor = new Color(0xff0055);
      const boxMaterial = new MeshPhongMaterial({
        opacity: 1,
        color: planeColor,
        blending: NoBlending,
      });
      var geometry = new BoxGeometry(w, h, -1);
      var mesh = new Mesh(geometry, boxMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      imageObj.lightShadowMesh = mesh;
      imageObj.add(mesh);

      // place it
      imageObj.lightShadowMesh.rotation.set(0, 0, 0.1);
      let yOffset = index % 2 === 0 ? yOffset_bot : yOffset_top;
      let randX = Math.random() * 3;
      let randY = Math.random() * 2;
      imageObj.position.set(
        xOffset + index * padding + randX,
        yOffset - randY,
        -1
      );

      posterObjs.add(imageObj);
    });

    return posterObjs;
  }
}

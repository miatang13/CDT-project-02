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
import { rated_colors } from "../constants/colors";

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
  constructor(movieObjs, loaders, genreObjs) {
    this.movieObjs = movieObjs;
    this.loaders = loaders;
    this.genreObjs = genreObjs;
  }

  init() {
    let container = new Object3D();
    let posters = this.initPosters();
    container.add(posters);

    return container;
  }

  /**
   * Private init functions
   */

  initPosters() {
    let posterObjs = new Object3D();
    this.movieObjs.forEach((movie, index) => {
      let yOffset = index % 2 === 0 ? yOffset_bot : yOffset_top;
      let randX = Math.random() * 3;
      let randY = Math.random() * 2;

      let x = xOffset + index * padding + randX;
      let y = yOffset - randY;

      let imageObj = this.initPosterImageAndPlane(movie);
      imageObj.position.set(x, y, -1);
      posterObjs.add(imageObj);

      let genreObj = this.genreObjs["comedy"].clone(); // TO CHANGE
      genreObj.position.set(x, y, 1);
      posterObjs.add(genreObj);
    });

    return posterObjs;
  }

  initPosterImageAndPlane(movie) {
    let imgLink = movie.imgLink;
    let imageObj = new Object3D();

    const map = this.loaders.textureLoader.load(imgLink);
    const material = new SpriteMaterial({ map: map });
    const sprite = new Sprite(material);
    sprite.scale.set(w, h, 0);
    imageObj.sprite = sprite;
    imageObj.add(sprite);

    // clip a WebGL geometry with it.
    let planeColor = rated_colors[movie.rated];
    const boxMaterial = new MeshPhongMaterial({
      opacity: 1,
      color: planeColor,
      blending: NoBlending,
    });
    var geometry = new BoxGeometry(w * 1.2, h * 1.2, 1);
    var mesh = new Mesh(geometry, boxMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(0, 0, -1);
    imageObj.lightShadowMesh = mesh;
    imageObj.add(mesh);

    // place it
    imageObj.lightShadowMesh.rotation.set(0, 0, 0.1);
    return imageObj;
  }
}

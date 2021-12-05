import {
  BoxGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  NoBlending,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
} from "three";
import { rated_colors } from "../constants/colors";
import { rand } from "../helper/rand";
import vertex_shader from "../glsl/vertex.glsl.js";
import fragment_shader from "../glsl/fragment.glsl.js";
import { vshader, fshader } from "../glsl/bg.glsl";

const w = 5.5;
const h = w * 1.5;
const xOffset = -w * 4.5;
const padding = w * 1.5;
const yOffset_bot = -6.5;
const yOffset_top = 6.5;

const displaceRand = [-1, 1];

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

    return posters;
  }

  /**
   * Private init functions
   */

  initPosters() {
    this.posterObjs = new Object3D();
    this.posterObjs.posters = [];
    this.movieObjs.forEach((movie, index) => {
      let yOffset = index % 2 === 0 ? yOffset_bot : yOffset_top;
      let randX = Math.random() * 3;
      let randY = Math.random() * 2;

      let x = xOffset + index * padding + randX;
      let y = yOffset - randY;

      let posterMesh = this.initPoster(movie, x, y);
      this.posterObjs.add(posterMesh);
      this.posterObjs.posters.push(posterMesh);
      posterMesh.position.set(x, y, 0);

      let plane = this.initPlane(movie);
      plane.position.set(x, y, -1);
      // this.posterObjs.add(plane);

      let genreObj = this.genreObjs["comedy"].clone(); // TO CHANGE
      let displaceX = rand(displaceRand);
      let displaceY = rand(displaceRand);
      genreObj.position.set(
        x - (w / 2) * displaceX,
        y - (h / 2) * displaceY,
        0.5
      );
      this.posterObjs.add(genreObj);
    });

    return this.posterObjs;
  }

  initPoster(movie) {
    console.log("Init shader poster");
    return this.initShaderPoster(movie);
  }

  initShaderPoster(movie) {
    let imgLink = movie.imgLink;
    let geometry = new PlaneGeometry(w, h);
    let texture = this.loaders.textureLoader.load(imgLink);
    // let material = new MeshBasicMaterial({ map: texture });

    let material = new ShaderMaterial({
      vertexShader: vshader,
      fragmentShader: fshader,
      uniforms: {
        uTime: { value: 0.1 },
        uTexture: { value: texture },
      },
      side: DoubleSide,
    });

    let mesh = new Mesh(geometry, material);
    return mesh;
  }

  initSpritePoster(movie) {
    let obj = new Object3D();
    let imgLink = movie.imgLink;
    const map = this.loaders.textureLoader.load(imgLink);
    const material = new SpriteMaterial({ map: map, color: 0xffffff });
    const sprite = new Sprite(material);
    sprite.scale.set(w, h, 1);
    obj.add(sprite);
    return obj;
  }

  /**
   * Init the background plane
   */
  initPlane(movie) {
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
    mesh.rotation.set(0, 0, 0.1);

    return mesh;
  }
}

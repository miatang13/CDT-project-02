import {
  BoxGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  NoBlending,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  TextGeometry,
} from "three";
import { rated_colors } from "../constants/colors";
import { rand } from "../helper/rand";
import { vshader, fshader } from "../glsl/bg.glsl";
import { box_fshader, box_vshader } from "../glsl/box.glsl";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

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
  constructor(movieObjs, loaders, genreObjs, font, scene) {
    this.movieObjs = movieObjs;
    this.loaders = loaders;
    this.genreObjs = genreObjs;
    this.font = font;
    this.scene = scene;
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
    this.posterObjs.planes = [];

    // sort movies by box office & release (ascending order)
    let sortByBoxOffice = [...this.movieObjs].sort(function (a, b) {
      return a.boxOfficeInt - b.boxOfficeInt;
    });
    let sortByTime = [...this.movieObjs].sort(function (a, b) {
      return parseInt(a.year) - parseInt(b.year);
    });

    // different positions for different numbers of posters
    const pos_6 = {
      xPositions: [-18, -12, -5, 0.5, 9, 18],
      yPositions: [-7, -5, -3, 0, 2, 5],
    };

    const pos_5 = {
      xPositions: [-15, -7, -3, 5, 14],
      yPositions: [-7, -3, 0, 2, 5],
    };

    const pos_4 = {
      xPositions: [-15, -5, 3, 14],
      yPositions: [-7, -3, 2, 5],
    };

    const pos_3 = {
      xPositions: [-15, 0, 14],
      yPositions: [-7, 0, 5],
    };

    const pos_2 = {
      xPositions: [-10, 14],
      yPositions: [-7, 5],
    };

    const positions = [{}, {}, pos_2, pos_3, pos_4, pos_5, pos_6];

    const curPos = positions[this.movieObjs.length];
    const xPositions = curPos.xPositions;
    const yPositions = curPos.yPositions;

    this.movieObjs.forEach((movie, index) => {
      // let yOffset = index % 2 === 0 ? yOffset_bot : yOffset_top;
      let randX = Math.random() * 2;
      let randY = Math.random() * 2;

      // let x = xOffset + index * padding + randX;
      // let y = yOffset - randY;
      let xIndex = sortByBoxOffice.findIndex((el) => el.name === movie.name);
      let yIndex = sortByTime.findIndex((el) => el.name === movie.name);

      let x = xPositions[xIndex]; // + randX;
      let y = yPositions[yIndex] + randY;

      let posterMesh = this.initPoster(movie, x, y);
      this.posterObjs.add(posterMesh);
      this.posterObjs.posters.push(posterMesh);
      posterMesh.position.set(x, y, 0);

      let plane = this.initPlane(movie);
      plane.position.set(x, y, -1);
      this.posterObjs.add(plane);
      this.posterObjs.planes.push(plane);

      let genreObj = this.genreObjs["comedy"].clone(); // TO CHANGE
      let displaceX = rand(displaceRand);
      let displaceY = rand(displaceRand);
      genreObj.position.set(
        x - (w / 2) * displaceX,
        y - (h / 2) * displaceY,
        0.5
      );
      this.posterObjs.add(genreObj);

      // let coordinateText = this.createCoordText(movie);
      // coordinateText.position.set(
      //   x - (w / 2) * displaceX,
      //   y - (h / 2) * displaceY,
      //   1.5
      // );
      // coordinateText.scale.set(5, 5, 5);
      // this.posterObjs.add(coordinateText);
    });

    return this.posterObjs;
  }

  createCoordText(movie) {
    let that = this;

    const loader = new FontLoader();
    this.font = loader.load(
      "assets/fonts/PPGoshaSans.json",
      // onLoad callback
      function (font) {
        // do something with the font
        console.log(font);
        const geometry = new TextGeometry("Hello three.js!", {
          font: font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5,
        });
        const material = new MeshNormalMaterial({ color: new Color("red") });
        const mesh = new Mesh(geometry, material);
        that.scene.add(mesh);
      },

      // onProgress callback
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },

      // onError callback
      function (err) {
        console.log("An error happened");
      }
    );
    // return mesh;
  }

  initPoster(movie) {
    return this.initShaderPoster(movie);
  }

  initShaderPoster(movie) {
    let imgLink = movie.imgLink;
    let geometry = new PlaneGeometry(w, h);
    let texture = this.loaders.textureLoader.load(imgLink);

    let material = new ShaderMaterial({
      vertexShader: vshader,
      fragmentShader: fshader,
      uniforms: {
        u_time: { value: 0.1 },
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
    if (!planeColor) {
      planeColor = new Color(0xffffff);
    }
    let material = new ShaderMaterial({
      vertexShader: box_vshader,
      fragmentShader: box_fshader,
      uniforms: {
        u_time: { value: 0.1 },
        u_color_r: { value: planeColor.r },
        u_color_g: { value: planeColor.g },
        u_color_b: { value: planeColor.b },
      },
    });
    var geometry = new PlaneGeometry(w * 1.2, h * 1.2);
    var mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(0, 0, -1);
    let rotationDir = rand([-1, 1]);
    mesh.rotation.set(0, 0, 0.1 * rotationDir);

    return mesh;
  }
}

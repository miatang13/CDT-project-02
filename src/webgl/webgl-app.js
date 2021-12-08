import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  AmbientLight,
  PointLight,
  TextureLoader,
  Clock,
  MeshNormalMaterial,
  TextGeometry,
  Group,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import Movie from "./class/Movie";
import gsap from "gsap/all";
import movie_genres_data from "../data/movie-genres.json";

const models = movie_genres_data.finalGenres;

export default class WebGLApp {
  constructor(container, cssContainer, nameSpan, callback) {
    this.htmlElem = container;
    this.cssElem = cssContainer;
    this.nameSpan = nameSpan;
    this.rafId = 0;
    this.isRendering = false;
    this.onloadCallback = callback;
    /**
     * Dynamically changed elements
     */
    this.posters = [];
    this.movieGenreObjs = {};
    this.hasSetup = false;
  }

  setup = (movieObjs) => {
    const darkBlue = 0x000514;
    const lightOrange = 0xffc48a;
    const violet = 0xb18cff;
    this.movieObjs = movieObjs;
    console.log("set up", this.movieObjs);
    this.scene = new Scene();
    this.scene.background = new Color(violet);
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 20);
    this.camera.lookAt(this.scene.position);
    // this.camera = new PerspectiveCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );
    // this.camera.position.z = 5;
    this.tanFOV = Math.tan(((Math.PI / 180) * this.camera.fov) / 2);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    this.renderer.shadowMap.enabled = true;
    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.domElement.style.position = "absolute";
    this.cssRenderer.domElement.style.top = 0;
    this.cssElem.appendChild(this.cssRenderer.domElement);
    this.htmlElem.appendChild(this.renderer.domElement);
    this.loader = new GLTFLoader();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.textureLoader = new TextureLoader();
    this.clock = new Clock();
    this.createCube();
    this.createLights();
    this.loadMovieGenreObjs();
    this.initPostprocessing();
    //this.test();
    console.log("Finished set up");
  };

  updateState = (objs, animateDir) => {
    this.movieObjs = objs;
    this.clearState(animateDir);
  };

  /***
   * PRIVATE
   */

  createNewState = (animateDir) => {
    let loaders = {
      textureLoader: this.textureLoader,
    };
    let movieObj = new Movie(
      this.movieObjs,
      loaders,
      this.movieGenreObjs,
      this.font,
      this.scene
    );
    let obj = movieObj.init();
    this.movieObj = obj;
    let animateY = animateDir === "up" ? -25 : 25;
    this.movieObj.position.y = animateY;
    this.scene.add(obj);
    gsap.to(this.movieObj.position, {
      y: 0,
      ease: animateDir === "up" ? "Power4.easeOut" : "Bounce.easeOut",
      duration: 0.8,
    });
    console.log("Finished creating new state");
  };

  clearState = (animateDir) => {
    console.log("Clearing state");
    if (this.movieObj) {
      let that = this;
      const callBack = () => {
        console.log("Complete clear state animation");
        that.scene.remove(that.movieObj);
        that.createNewState(animateDir);
      };

      let tl = gsap.timeline({
        onComplete: callBack,
      });
      this.movieObj.children.forEach((el, index) => {
        let goal = animateDir === "up" ? 50 : -50;
        let target = goal - el.position.y;
        tl.to(
          el.position,
          {
            y: target,
            duration: 0.5,
            ease: "Power4.easeInOut",
          },
          index * 0.05
        );
      });
    } else {
      this.createNewState(animateDir);
    }
  };

  createText = (font) => {
    console.log("In createText");
    const textGeometry = new TextGeometry("Hello world!", {
      font,
      size: 0.8,
      height: 0.3,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelOffset: -0.05,
      bevelSegments: 5,
    });
    const material = new MeshNormalMaterial();
    const text = new Mesh(textGeometry, material);
    textGeometry.computeBoundingBox();
    textGeometry.center();
    this.textGroup.add(text);
  };

  /**
   * Debug
   */
  test = () => {
    this.textGroup = new Group();
    this.scene.add(this.textGroup);
    this.fontLoader.load(
      "https://assets.codepen.io/85648/Luckiest+Guy_Regular.json",
      this.createText
    );
  };

  /**
   * Init scene
   */
  loadFont = () => {
    this.fontLoader = new FontLoader();
    this.font = this.fontLoader.load(
      "assets/fonts/PPGoshaSans.json",
      // onLoad callback
      function (font) {
        // do something with the font
        //console.log(font);
      },

      // onProgress callback
      function (xhr) {
        //console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },

      // onError callback
      function (err) {
        //console.log("An error happened");
      }
    );
  };

  loadMovieGenreObjs = () => {
    models.forEach((mod) => this.loadModel(mod));
  };

  initPostprocessing = () => {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    const luminosityPass = new ShaderPass(LuminosityShader);
    this.composer.addPass(luminosityPass);
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    effectFXAA.renderToScreen = true;
    this.composer.addPass(effectFXAA);
  };

  loadModel = (fileName) => {
    const scl = 15;
    let that = this;
    this.loader.load(
      "assets/" + fileName + ".gltf",
      function (loaded) {
        let model = loaded.scenes[0];
        model.scale.set(scl, scl, scl);
        that.movieGenreObjs[fileName] = model;
        if (Object.keys(that.movieGenreObjs).length === models.length) {
          // init state as we finished loading models
          that.updateState(that.movieObjs, "up");
          that.hasSetup = true;
          that.onloadCallback(false);
        }
      },
      (load) => {},
      (error) => {
        console.log("error with loading file: ", fileName, error);
      }
    );
  };

  createCube = () => {
    const boxSize = 50;
    let geometry = new BoxGeometry(boxSize, boxSize, boxSize);
    let material = new MeshPhongMaterial({
      color: new Color(0x7c71fe),
      wireframe: true,
    });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
  };

  createLights = () => {
    this.ambientLight = new AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);
    this.pointLight = new PointLight(0xffffff);
    this.scene.add(this.pointLight);
  };

  renderScene = () => {
    // this.composer.render();
    this.renderer.render(this.scene, this.camera);
    this.cssRenderer.render(this.scene, this.camera);
  };

  handleResize = () => {
    this.renderer.width = this.htmlElem.clientWidth;
    this.renderer.height = this.htmlElem.clientHeight;
    this.renderer.setSize(this.renderer.width, this.renderer.height);
    this.camera.aspect = this.renderer.width / this.renderer.height;
    this.camera.updateProjectionMatrix();
  };

  update = () => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.0125;
    this.cube.rotation.z += 0.012;
    this.controls.update();

    if (this.movieObj) {
      this.movieObj.posters.forEach((poster, index) => {
        if (poster.material.uniforms) {
          poster.material.uniforms.u_time.value = this.clock.getElapsedTime();
        }
        if (this.movieObj.planes[index].material.uniforms) {
          this.movieObj.planes[index].material.uniforms.u_time.value =
            this.clock.getElapsedTime();
        }
      });
      //this.movieObj.planes.forEach((plane) => wiggleMesh(plane));
    }

    //this.controls.update();
    this.rafId = requestAnimationFrame(this.update);
    this.renderScene();
  };

  render = (render) => {
    if (this.isRendering === render) return;
    this.isRendering = render;
    if (render) {
      this.update();
    } else {
      cancelAnimationFrame(this.rafId);
    }
  };
}

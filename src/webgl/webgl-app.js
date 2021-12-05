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
  Vector2,
  TextureLoader,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import anime from "animejs";
import { createElemObject } from "./helper/css3d";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import Poster from "./class/Movie";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import Movie from "./class/Movie";

export default class WebGLApp {
  constructor(container, cssContainer, postersDiv, posterImgRefs, nameSpan) {
    this.htmlElem = container;
    this.cssElem = cssContainer;
    this.postersDiv = postersDiv;
    this.posterImages = posterImgRefs.map((ref) => ref.current);
    this.nameSpan = nameSpan;
    this.rafId = 0;
    this.isRendering = false;
    /**
     * Dynamically changed elements
     */
    this.posters = [];
    this.numPosters = 0;
    this.prevNumPosters = 0;
  }

  setup = () => {
    console.log("set up with DOM elem ", this.htmlElem);
    this.scene = new Scene();
    // this.scene.background = new Color(0xb6eafa);
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(0, 0, 15);
    this.camera.lookAt(this.scene.position);
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
    this.createCube();
    this.createLights();
    this.loadModel("mountain");
    this.initPostprocessing();
    console.log("Finished set up");
  };

  updateState = (objs) => {
    this.clearState();
    console.log("Updating state");
    this.movieObjs = objs;
    this.createNewState();
  };

  /***
   * PRIVATE
   */

  createNewState = () => {
    let movieObj = new Movie(this.movieObjs);
    let obj = movieObj.init(this.textureLoader);
    this.scene.add(obj);
    this.movieObj = obj;
  };

  clearState = () => {
    if (this.movieObj) {
      this.scene.remove(this.movieObj);
    }
  };

  /**
   * Init scene
   */
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
    let that = this;
    this.loader.load(
      "assets/" + fileName + ".gltf",
      function (loaded) {
        that.testmodel = loaded.scenes[0];
        that.scene.add(that.testmodel);
        console.log("Added model", loaded);
      },
      (load) => {},
      (error) => {
        console.log("error! ", error);
      }
    );
  };

  createCube = () => {
    let geometry = new BoxGeometry(10, 10, 10);
    let material = new MeshPhongMaterial({
      color: new Color("Orange"),
      wireframe: true,
    });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
    console.log("created cube", this.cube);
  };

  createLights = () => {
    this.ambientLight = new AmbientLight(0x404040);
    this.scene.add(this.ambientLight);
    this.pointLight = new PointLight(0xffffff);
    this.scene.add(this.pointLight);
  };

  renderScene = () => {
    this.composer.render();
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

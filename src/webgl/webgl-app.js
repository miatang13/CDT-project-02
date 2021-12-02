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
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import anime from "animejs";
import { createElemObject } from "./helper/css3d";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class WebGLApp {
  constructor(container, postersDiv, nameSpan) {
    this.htmlElem = container;
    this.postersDiv = postersDiv;
    this.nameSpan = nameSpan;
    this.rafId = 0;
    this.isRendering = false;
    /**
     * Dynamically changed elements
     */
    this.posters = [];
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
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(this.scene.position);
    this.tanFOV = Math.tan(((Math.PI / 180) * this.camera.fov) / 2);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    this.renderer.shadowMap.enabled = true;
    this.htmlElem.appendChild(this.renderer.domElement);
    this.loader = new GLTFLoader();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.createCube();
    this.createLights();
    this.loadModel("mountain");
    console.log("Finished set up");
  };

  updateState = () => {
    this.clearState();
    console.log("Updating state");
    console.log("length", this.posters);
    this.createNewState();
    console.log("after length", this.posters);
  };

  /***
   * PRIVATE
   */

  createNewState = () => {
    console.log("New state");
    this.createCssElem();
  };

  clearState = () => {
    let that = this;
    this.posters.forEach((obj) => {
      that.scene.remove(obj);
    });
    this.posters = [];
  };

  createCssElem = () => {
    const w = 300;
    const h = w * 1.5;
    const xOffset = -10;
    const padding = 2;
    const yOffset = 0;
    [...this.postersDiv.children].forEach((img, index) => {
      let imageObj = createElemObject(img, w, h, new Color(0xff0000), 1, true);
      this.scene.add(imageObj);
      imageObj.position.set(xOffset + index * padding, yOffset, -1);
      this.posters.push(imageObj);
    });
  };

  loadModel = (fileName) => {
    let that = this;
    this.loader.load(
      "assets/" + fileName + ".gltf",
      function (loaded) {
        that.testmodel = loaded.scenes[0];
        that.scene.add(that.testmodel);
        that.testmodel.scale.set(15, 15, 15);
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
    this.renderer.render(this.scene, this.camera);
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

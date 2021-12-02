import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  GridHelper,
  MeshPhongMaterial,
  AmbientLight,
  SphereGeometry,
  TextureLoader,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { lerp, onWheel } from "./scroll";
import anime from "animejs";

export default class WebGLApp {
  constructor(htmlElem, cssElem) {
    this.htmlElem = htmlElem;
    this.rafId = 0;
    this.isRendering = false;
    this.currentDirector = "";
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
    this.camera.position.set(0, 10, 100);
    this.camera.lookAt(this.scene.position);
    this.tanFOV = Math.tan(((Math.PI / 180) * this.camera.fov) / 2);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    this.renderer.shadowMap.enabled = true;
    this.htmlElem.appendChild(this.renderer.domElement);
    this.createCube();
    this.loader = new GLTFLoader();
    this.loadModel("mountain");
    console.log("Finished set up");
  };

  loadModel = (fileName) => {
    let that = this;
    this.loader.load(
      "assets/" + fileName + ".gltf",
      function (loaded) {
        that.testmodel = loaded.scenes[0];
        that.scene.add(that.testmodel);
        that.testmodel.scale.set(150, 150, 150);
        console.log("Added model", loaded);
      },
      (load) => {},
      (error) => {
        console.log("error! ", error);
      }
    );
  };

  createGridHelper = () => {
    this.gridHelper = new GridHelper(10, 10);
    this.scene.add(this.gridHelper);
    console.log("created grid helper", this.gridHelper);
  };

  createCube = () => {
    let geometry = new BoxGeometry(50, 50, 50);
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
  };

  createSphere = () => {
    const loader = new TextureLoader();
    const texture = loader.load("assets/texture/ir1.jpg");
    const material = new MeshBasicMaterial({
      map: texture,
    });
    const geometry = new SphereGeometry(2, 32, 32);
    this.sphere = new Mesh(geometry, material);
    this.scene.add(this.sphere);
  };

  createObjs = () => {
    // this.createGridHelper();
    this.createLights();
    this.createSphere();
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

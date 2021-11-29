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
import { lerp, onWheel } from "./scroll";
import anime from "animejs";
import data from "../data/ranked-directors(>2).json";

export default class WebGLApp {
  constructor(htmlElem, cssElem, divContainer) {
    this.htmlElem = htmlElem;
    this.divContainer = divContainer; // for scroll
    this.rafId = 0;
    this.isRendering = false;
    this.startTime = Date.now();
    this.singleDirectorDuration = 2000;
    this.numDirectors = data.length;
    this.animationDuration = this.singleDirectorDuration * this.numDirectors;
    this.directorNameSpan = document.getElementById("directorSpan");
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
    this.renderer.setClearColor(0x161216);
    this.renderer.shadowMap.enabled = true;
    this.htmlElem.appendChild(this.renderer.domElement);
    this.createCube();
    this.setupScrolling();
    this.setupTimeline();
    console.log("Finished set up");
  };

  setupScrolling = () => {
    this.span = document.getElementById("scrollY");
    // for scrolling
    this._event = {
      y: 0,
      deltaY: 0,
    };
    this.percentage = 0;
    this.scrollY = 0;

    this.maxHeight =
      (this.divContainer.clientHeight || this.divContainer.offsetHeight) -
      window.innerHeight;

    var that = this;
    function onWheelHandler(e) {
      that.scrollY = onWheel(e, that._event, that.maxHeight);
    }

    this.divContainer.addEventListener("wheel", onWheelHandler, {
      passive: false,
    });
  };

  setupTimeline = () => {
    this.timeline = anime.timeline({
      autoplay: false,
      duration: this.animationDuration,
      easing: "easeOutSine",
    });

    var value = new Color(0xffffff);
    var initial = new Color(0x161216);
    var that = this;
    this.timeline.add(
      {
        targets: initial,
        r: [initial.r, value.r],
        g: [initial.g, value.g],
        b: [initial.b, value.b],
        duration: this.animationDuration,
        update: () => {
          that.renderer.setClearColor(initial);
        },
      },
      0
    );

    // update director content
    data.forEach((directorObj, index) => {
      console.log(index * that.singleDirectorDuration);
      that.timeline.add(
        {
          targets: that.directorNameSpan,
          textContent: directorObj.name,
          duration: that.singleDirectorDuration,
        },
        index * that.singleDirectorDuration
      );

      if (index % 2 === 0) {
        that.timeline.add(
          {
            targets: that.cube.position,
            x: 0,
            y: 0,
            z: 50,
            duration: that.singleDirectorDuration,
            update: that.camera.updateProjectionMatrix(),
          },
          index * that.singleDirectorDuration
        );
      } else {
        that.timeline.add(
          {
            targets: that.cube.position,
            x: 0,
            y: 0,
            z: 0,
            duration: that.singleDirectorDuration,
            update: that.camera.updateProjectionMatrix(),
          },
          index * that.singleDirectorDuration
        );
      }
    });
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
    var dtime = Date.now() - this.startTime;
    // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
    this.percentage = lerp(this.percentage, this.scrollY, 0.08);
    this.timeline.seek(
      this.percentage * (this.animationDuration / this.maxHeight)
    );

    this.span.innerHTML =
      "scroll Y : " + Math.round(this.percentage * 100) / 100;
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

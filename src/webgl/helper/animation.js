import gsap from "gsap/all";

export function wiggleMesh(mesh) {
  if (mesh)
    gsap.to(mesh.rotation, {
      duration: "random(14.0,16.0)", //param = min/max values
      z: "random(-130.0,130.0)",
      ease: "sine.inOut", //the ease you want dot in / out / inOut
      onComplete: wiggleMesh,
      onCompleteParams: [mesh],
    });
}

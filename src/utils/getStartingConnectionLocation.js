export default function(scene, clickPosition) {
    return {
      x: scene.x + scene.width,
      y: clickPosition.y,
    };
}

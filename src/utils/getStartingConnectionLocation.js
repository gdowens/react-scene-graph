export default function(scene, clickPosition) {
    return {
      x: scene.x + scene.width + 10,
      y: clickPosition.y,
    };
}

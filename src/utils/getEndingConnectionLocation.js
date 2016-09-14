export default function(scene, leftToRight, vertOffset) {
    return {
        x: leftToRight ? scene.x : scene.x + scene.width,
        y: scene.y + scene.height * vertOffset,
    };
}

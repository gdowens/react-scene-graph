export default function(scene, leftToRight) {
    return {
        x: leftToRight ? scene.x : scene.x + scene.width,
        y: scene.y + scene.height / 2,
    };
}

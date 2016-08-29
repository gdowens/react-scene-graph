export default function(scene) {
    return {
        x: scene.x,
        y: scene.y + scene.height / 2,
    };
}

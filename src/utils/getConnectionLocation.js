export default function(scene) {
    return {
        x: scene.x - 4,
        y: scene.y + scene.height / 2,
    };
    // return {
    //     x: scene.x + scene.width / 2,
    //     y: scene.y + scene.height / 2,
    // };
}

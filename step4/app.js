import {
    AmbientLight,
    AxesHelper,
    Color,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "three/examples/jsm/loaders/IFCLoader";

//Three.js シーンの作成
const scene = new Scene();
scene.background = new Color(0xaaaaaa);

//ビューポートのサイズを格納するオブジェクト
const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

//ユーザーの視点になるカメラの作成
const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;

//シーン内のライトの作成
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

//レンダラーを設定し、HTML のキャンバスを取得します
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//シーンにグリッドと座標表示を追加します
const grid = new GridHelper(50, 30);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

//シーンを操作するためのオービットコントロールの作成
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;

//アニメーションのループの作成
const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

//ビューポートのサイズをブラウザに合わせる
window.addEventListener("resize", () => {
    (size.width = window.innerWidth), (size.height = window.innerHeight);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});


//IFC 読み込みのセットアップ
const ifcLoader = new IFCLoader();
ifcLoader.setWasmPath("./wasm/");

const input = document.getElementById("file-input");
input.addEventListener(
    "change",
    (changed) => {
        var ifcURL = URL.createObjectURL(changed.target.files[0]);
        console.log(ifcURL);
        ifcLoader.load(ifcURL, (geometry) => scene.add(geometry));
    },
    false
);
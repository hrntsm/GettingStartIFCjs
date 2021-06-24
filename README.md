# GettingStartIFCjs

IFC.js を始めるためのハンズオン資料です。

必要なもの

- ブラウザ（Chrome など）
- node.js
- IDE (VSCode など)

## STEP1 HTML を書く

[完成品のサンプル](https://hiron.dev/GettingStartIFCjs/step1/index.html)

HTML を書いて、ブラウザに Hello, World! と表示させましょう。  
ファイル名 index.html を作成し内容を以下にします。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My first html</title>
  </head>
  <body>
    <p>Hello, World!</p>
  </body>
</html>
```

作成したファイルをダブルクリックするとブラウザが開き Hello, World! と表示されます。  
このような開き方をするとホットリロードがきかなくて手間があるので、ホットリロードができるようにすることをおススメします。

VSCode を使っている場合は [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) を使うと簡単にホットリロードが使えるようになります。

完成したら GitHubPages を使って公開してみましょう。

## STEP2 threejs を使ってみる

[完成品のサンプル](https://hiron.dev/GettingStartIFCjs/step2/index.html)

IFC.js は IFC をパースするライブラリであって、可視化をするものではありません。可視化は JS でよく使われている Three.js または Babylon.js を使うことが公式ドキュメントですすめられています。

ここでは Three.js を使います。ブラウザ上で box を回転させるものを作成するためには以下のように書きます。

毎回 CDN を使って Three.js をダウンロードしてきているのでリロードに時間がかかります。  
ドキュメントが見たい場合は [こちらです。](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/105/three.min.js"></script>
    <script>
      window.addEventListener("load", init);

      function init() {
        // サイズ指定
        const size = {
          width: 960,
          height: 540,
        };

        // レンダラーを作成
        const threeCanvas = document.getElementById("three-canvas");
        const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(size.width, size.height);

        // シーンを作成
        const scene = new THREE.Scene();

        // カメラを作成
        const camera = new THREE.PerspectiveCamera(
          45,
          size.width / size.height
        );
        camera.position.set(0, 1000, 1000);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // グリッドを作成
        const grid = new THREE.GridHelper(2000);
        scene.add(grid);

        // 座標軸の作成
        const axis = new THREE.AxesHelper(500);
        scene.add(axis);

        // 箱を作成
        const geometry = new THREE.BoxGeometry(400, 400, 400);
        const material = new THREE.MeshNormalMaterial();
        const box = new THREE.Mesh(geometry, material);
        scene.add(box);

        tick();

        function tick() {
          // ここでboxを回転させている
          box.rotation.y += 0.01;
          renderer.render(scene, camera);

          requestAnimationFrame(tick);
        }
      }
    </script>
  </head>
  <body>
    <canvas id="three-canvas"></canvas>
  </body>
</html>
```

## STEP3 npm を使ってパッケージ管理して書く

[完成品のサンプル](https://hiron.dev/GettingStartIFCjs/step3/index.html)

npm とは Node Package Manager の略で、 JavaScript 系のパッケージを管理するツールです。Node.js がインストールされた状態で、これからの作業するフォルダで `npm init` をすると初期化されます。  
three.js を使いたいので、初期化した後以下をしてインストールします。

```
npm install three
```

問題なくインストールされると、package.json の dependencies に three が追加され、node_modules に three が入っています。

必要なものをバンドルするためにバンドラーを使います。いろいろありますが、IFC.js のサンプルでは rollup.js を使っているので、ここでもそれを使います。以下でインストールできます。

```
npm install rollup @rollup/plugin-node-resolve --save-dev
```

バンドルするための設定ファイル rollup.config.js を作成します。

```js
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "app.js",
  output: [
    {
      format: "cjs",
      file: "bundle.js",
    },
  ],
  plugins: [resolve()],
};
```

バンドルされたファイルを読み込むように index.html を書き換えます。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <canvas id="three-canvas"></canvas>
    <script src="bundle.js"></script>
  </body>
</html>
```

app.js はもともと script タグの中にあったものの冒頭に import を追加してウインドウサイズに合わせたキャンバスのリサイズを追加にしたものです

```js
import * as THREE from "three/build/three.module";

window.addEventListener("load", init);

function init() {
  // window の大きさに変更している
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const threeCanvas = document.getElementById("three-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size.width, size.height);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, size.width / size.height);
  camera.position.set(0, 1000, 1000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const grid = new THREE.GridHelper(1000);
  scene.add(grid);

  const axis = new THREE.AxesHelper(500);
  scene.add(axis);

  const geometry = new THREE.BoxGeometry(400, 400, 400);
  const material = new THREE.MeshNormalMaterial();
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);

  tick();

  function tick() {
    box.rotation.y += 0.01;
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }

  // ウインドウのリサイズを追加
  window.addEventListener("resize", () => {
    (size.width = window.innerWidth), (size.height = window.innerHeight);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
  });
}
```

## STEP4 IFC の読み込みと可視化をする

[完成品のサンプル](https://hiron.dev/GettingStartIFCjs/step4/index.html)

ここは [公式ドキュメント](https://ifcjs.github.io/info/) を参照。公式ドキュメントは日本語化されています。

## まとめ

IFC.js はどうでしょうか。
皆さんのコントリビュートお待ちしています。

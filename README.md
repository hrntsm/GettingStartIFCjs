# GettingStartIFCjs

IFC.js を始めるためのハンズオン資料です。

必要なもの

- ブラウザ（Chrome など）
- node.js
- IDE (VSCode など)

## STEP1 HTML を書く

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

## STEP2 threejs を使ってみる

IFC.js は IFC をパースするライブラリであって、可視化をするものではありません。可視化は JS でよく使われている Three.js または Babylon.js を使うことが公式ドキュメントですすめられています。

ここでは Three.js を使います。ブラウザ上で box を回転させるものを作成するためには以下のように書きます。

毎回 CDN を使って Three.js をダウンロードしてきているのでリロードに時間がかかります。  
ドキュメントが見たい場合は [こちらです。](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/105/three.min.js"></script>
    <script>
      window.addEventListener('load', init);

      function init() {
        // サイズ指定
        const width = 960;
        const height = 540;

        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#myCanvas')
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        // シーンを作成
        const scene = new THREE.Scene();

        // カメラを作成
        const camera = new THREE.PerspectiveCamera(45, width / height);
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
    <canvas id="myCanvas"></canvas>
  </body>
</html>
```

## npm を使ってパッケージ管理して書く
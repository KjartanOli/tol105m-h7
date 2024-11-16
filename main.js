function init() {
	// Ná í striga
	const canvas = document.querySelector('#c');

	// Skilgreina sviðsnet
	const scene = new THREE.Scene();
	scene.background = new THREE.Color('black');

	// Skilgreina myndavél og staðsetja hana
	const camera = new THREE.PerspectiveCamera( 60, canvas.clientWidth/canvas.clientHeight, 0.1, 1000 );
	camera.position.set(0, 3, 5);

	// Bæta við músarstýringu
	const controls = new THREE.OrbitControls( camera, canvas );

	// Skilgreina birtingaraðferð með afbjögun (antialias)
	const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
	renderer.shadowMap.enabled = true;	 // kveikja á skuggakorti

	// Búa til tening með Phong áferð (Phong material) og bæta í sviðsnetið
	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } );
	const cube = new THREE.Mesh( geometry, material );
	// getur valdið skugga og fengið skugga
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.position.x += 1;
	scene.add( cube );

	// Búa til kúlu með Phong áferð og bæta í sviðsnetið
	const ballGeometry = new THREE.SphereGeometry( 0.5, 20, 20 );
	const ballMaterial = new THREE.MeshPhongMaterial( { color: 0xaa8844 } );
	const ball = new THREE.Mesh( ballGeometry, ballMaterial );
	// getur valdið skugga og fengið skugga
	ball.castShadow = true;
	ball.receiveShadow = true;
	ball.position.x += -1;
	scene.add( ball );

	// Búa til sléttu með Phong áferð
	const planeGeometry = new THREE.PlaneGeometry( 20, 20 );
	const planeMaterial = new THREE.MeshPhongMaterial( { color: 0xcccccc } );
	const plane = new THREE.Mesh( planeGeometry, planeMaterial );
	plane.receiveShadow = true;				// gólfið getur fengið á sig skugga
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.set(0, -0.5, 0);
	scene.add( plane );


	// Skilgreina ljósgjafa og bæta honum í sviðsnetið
	const light = new THREE.PointLight(0xFFFFFF, 1);
	light.castShadow = true;			// þessi ljósgjafi getur valdið skuggum
	light.position.set(0, 1, 0);
	scene.add(light);

	// Hlutur sem sýnir staðsetningu ljósgjafa
	const helper = new THREE.PointLightHelper(light, 0.1);
	scene.add(helper);

	const light2 = new THREE.PointLight(0xFFFFFF, 1);
	light2.castShadow = true;			// þessi ljósgjafi getur valdið skuggum
	light2.position.set(0, 1, 0);
	scene.add(light2);

	// Hlutur sem sýnir staðsetningu ljósgjafa
	const helper2 = new THREE.PointLightHelper(light2, 0.1);
	scene.add(helper2);


	function updateLight() {
		helper.update();
		helper2.update();
	}


	// Hlutur til að setja og fá gildi í valmynd
	class ColorGUIHelper {
		constructor(object, prop) {
			this.object = object;
			this.prop = prop;
		}
		get value() {
			return `#${this.object[this.prop].getHexString()}`;
		}
		set value(hexString) {
			this.object[this.prop].set(hexString);
		}
	}

	// Fall sem getur breytt x, y, z hnitum á staðsetningu ljóss
	function makeXYZGUI(gui, vector3, name, onChangeFn) {
		const folder = gui.addFolder(name);
		folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
		folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
		folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
		folder.open();
	}

	// Smíða valmynd (GUI) og setja inn einstaka möguleika og gildisbil
	const gui = new dat.GUI();
	gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
	gui.add(light, 'intensity', 0, 2, 0.01);
	gui.add(light, 'distance', 0, 40).onChange(updateLight);

	gui.addColor(new ColorGUIHelper(light2, 'color'), 'value').name('color');
	gui.add(light2, 'intensity', 0, 2, 0.01);
	gui.add(light2, 'distance', 0, 40).onChange(updateLight);


	makeXYZGUI(gui, light.position, 'position');
	makeXYZGUI(gui, light2.position, 'position2');


	const start = Date.now();
	// Hreyfifall
	const animate = function () {
		requestAnimationFrame( animate );

		const time = (Date.now() - start) / 1000;

		ball.position.y = 1 + Math.sin(time);
		cube.position.z = Math.cos(time)

		controls.update();
		renderer.render( scene, camera );
	};

	animate();

}

window.onload = init;

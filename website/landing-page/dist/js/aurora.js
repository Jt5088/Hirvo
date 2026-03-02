// aurora.js
// Renders an animated aurora borealis shader behind the hero section
// using Three.js (loaded via CDN). Respects prefers-reduced-motion.

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof THREE === 'undefined') return;

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var container = document.createElement('div');
  container.className = 'aurora-canvas';
  container.setAttribute('aria-hidden', 'true');
  hero.insertBefore(container, hero.firstChild);

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(hero.offsetWidth, hero.offsetHeight);
  container.appendChild(renderer.domElement);

  var material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight) }
    },
    vertexShader: 'void main(){gl_Position=vec4(position,1.0);}',
    fragmentShader: [
      'uniform float iTime;',
      'uniform vec2 iResolution;',
      '#define NUM_OCTAVES 3',
      'float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}',
      'float noise(vec2 p){',
      '  vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);',
      '  float res=mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y);',
      '  return res*res;',
      '}',
      'float fbm(vec2 x){',
      '  float v=0.0;float a=0.3;vec2 shift=vec2(100);',
      '  mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));',
      '  for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}',
      '  return v;',
      '}',
      'void main(){',
      '  vec2 shake=vec2(sin(iTime*1.2)*0.005,cos(iTime*2.1)*0.005);',
      '  vec2 p=((gl_FragCoord.xy+shake*iResolution.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.0,-4.0,4.0,6.0);',
      '  vec2 v;vec4 o=vec4(0.0);',
      '  float f=2.0+fbm(p+vec2(iTime*5.0,0.0))*0.5;',
      '  for(float i=0.0;i<35.0;i++){',
      '    v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13,11))*3.5+vec2(sin(iTime*3.0+i)*0.003,cos(iTime*3.5-i)*0.003);',
      '    float tailNoise=fbm(v+vec2(iTime*0.5,i))*0.3*(1.0-(i/35.0));',
      // Warm neutral palette — soft whites/ambers, no colored tint
      '    vec4 auroraColors=vec4(',
      '      0.30+0.12*sin(i*0.2+iTime*0.3),',
      '      0.28+0.10*cos(i*0.3+iTime*0.4),',
      '      0.24+0.08*sin(i*0.4+iTime*0.25),',
      '      1.0);',
      '    vec4 cc=auroraColors*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)));',
      '    float tf=smoothstep(0.0,1.0,i/35.0)*0.6;',
      '    o+=cc*(1.0+tailNoise*0.8)*tf;',
      '  }',
      '  o=tanh(pow(o/100.0,vec4(1.6)));',
      '  gl_FragColor=o*0.9;',  // slightly dimmer so text stays readable
      '}'
    ].join('\n')
  });

  var geometry = new THREE.PlaneGeometry(2, 2);
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var running = true;
  var frameId;

  function animate() {
    if (!running) return;
    material.uniforms.iTime.value += 0.012;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  }

  // Only animate when hero is visible
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        running = true;
        animate();
      } else {
        running = false;
        if (frameId) cancelAnimationFrame(frameId);
      }
    });
  }, { threshold: 0.1 });
  observer.observe(hero);

  window.addEventListener('resize', function () {
    var w = hero.offsetWidth;
    var h = hero.offsetHeight;
    renderer.setSize(w, h);
    material.uniforms.iResolution.value.set(w, h);
  });
})();

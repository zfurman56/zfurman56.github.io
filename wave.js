let wave = document.getElementById('wave');
let numberOfStrings = 3;

if (window.innerWidth <= 600) {
  wave.setAttribute('viewBox', '0 0 1000 250');
} else {
  wave.setAttribute('viewBox', '0 0 1000 100'); // Default viewBox height
}

// Listen for window resize
window.addEventListener('resize', function() {
  if (window.innerWidth <= 600) {
    wave.setAttribute('viewBox', '0 0 1000 250');
  } else {
    wave.setAttribute('viewBox', '0 0 1000 100'); // Default viewBox height
  }
});

let defaultX = 500;
let mouseX = defaultX;
let waveCenter= defaultX;

wave.addEventListener('mousemove', function(event) {
  let rect = wave.getBoundingClientRect();
  mouseX = ((event.clientX - rect.left) / rect.width) * 1000;
});

wave.addEventListener('mouseleave', function() {
  mouseX = defaultX;
});

// Create SVG paths first and reuse them
let pathElements = [];

for (let i = 0; i < numberOfStrings; i++) {
  let pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('stroke', '#555');
  pathElement.setAttribute('stroke-width', '0.5');
  pathElement.setAttribute('fill', 'none');
  pathElement.setAttribute('vector-effect', 'non-scaling-stroke');  // Stroke width constant across screen size
  wave.appendChild(pathElement);
  pathElements.push(pathElement);
}

function updateWave(amplitude, frequency, phase, speed, pathElement, waveCenter, boxHeight) {
  let pathData = `M0,${boxHeight/2} `;

  for (let x = 0; x <= 1000; x+=10) {
    let y = boxHeight/2;
    //let fadeFactor = Math.sin(Math.PI * x / 1000);
    //let fadeFactor = 1 - (((x/500)-1)**2);
    let fadeFactor = Math.exp(-5*(((x/500)-(waveCenter/500))**2));
    for (let i = 0; i < amplitude.length; i++) {
      y += fadeFactor * boxHeight * amplitude[i] * Math.sin(frequency[i] * x + phase[i]);
    }
    pathData += `L${x},${y} `;
  }

  pathElement.setAttribute('d', pathData);
}

let strings = [];
for (let i = 0; i < numberOfStrings; i++) {
  strings.push({
    amplitude: [0.05 + Math.random() * 0.1, 0.05 + Math.random() * 0.1, 0.05 + Math.random() * 0.1],
    frequency: [0.02 + Math.random() * 0.02, 0.02 + Math.random() * 0.02, 0.02 + Math.random() * 0.02],
    phase: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
    speed: [0.02 - Math.random() * 0.04, 0.02 - Math.random() * 0.04, 0.02 - Math.random() * 0.04]
  });
}

function animateWave() {
  let boxHeight = parseInt(wave.getAttribute('viewBox').split(' ')[3])
  waveCenter += 0.1*(mouseX - waveCenter);

  for (let i = 0; i < strings.length; i++) {
    let string = strings[i];
    let pathElement = pathElements[i];
    for (let j = 0; j < string.phase.length; j++) {
      string.phase[j] += string.speed[j];
    }
    updateWave(string.amplitude, string.frequency, string.phase, string.speed, pathElement, waveCenter, boxHeight);
  }

  requestAnimationFrame(animateWave);
}

animateWave();

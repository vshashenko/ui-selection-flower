// 
// Fully updates the flower layout in the given container element.
// 
export function updateLayout(elementId) {
  const containerElement = document.getElementById(elementId);

  const containerElementStyle = getComputedStyle(containerElement);
  const leafCutoffString = containerElementStyle.getPropertyValue('--leaf-cutoff');
  const leafGapString = containerElementStyle.getPropertyValue('--leaf-gap');
  const leafCutoff = Number(leafCutoffString);
  const leafGap = Number(leafGapString);

  // TODO handle missing & bad values

  const childElements = containerElement.querySelectorAll(':scope > :not(svg.leaf)');

  const distanceBetweenLeafsRad = 2 * Math.PI / 360 * leafGap;
  const leafCutoffRadius = leafCutoff;
  // assert leafCutoffRadius < 1

  // expects svg viewBox="0 0 100 100" with origin top-left
  const viewBoxSquareWidth = 100;
  const viewBoxCenterX = viewBoxSquareWidth / 2;
  const viewBoxCenterY = viewBoxSquareWidth / 2;
  const fullRadiusPx = viewBoxSquareWidth / 2;
  const angleStepRad = 2 * Math.PI / childElements.length;

  const outerPtLeaf = angleStepRad / 2 - distanceBetweenLeafsRad / 2;
  const cosHalfStep = Math.cos(outerPtLeaf);
  const sinHalfStep = Math.sin(outerPtLeaf);
  const scaledCos = (cosHalfStep - distanceBetweenLeafsRad) * leafCutoffRadius
  const scaledSin = (sinHalfStep) * leafCutoffRadius;

  const radiusToContent = distanceBetweenLeafsRad + scaledCos + (cosHalfStep-(distanceBetweenLeafsRad+scaledCos)) / 2;

  // Leaf points
  // TODO add Math.round
  const pathPoints0 = [(viewBoxCenterX+fullRadiusPx*(distanceBetweenLeafsRad+scaledCos)), (viewBoxCenterY-fullRadiusPx*scaledSin)];
  const pathPoints1 = [(viewBoxCenterX+fullRadiusPx*cosHalfStep), (viewBoxCenterY-fullRadiusPx*sinHalfStep)];
  const pathPoints2 = [(viewBoxCenterX+fullRadiusPx*cosHalfStep), (viewBoxCenterY+fullRadiusPx*sinHalfStep)];
  const pathPoints3 = [(viewBoxCenterX+fullRadiusPx*(distanceBetweenLeafsRad+scaledCos)), (viewBoxCenterY+fullRadiusPx*scaledSin)];

  // arc wip, doesn't look good without round corners on leafs
  let pathArc = '';
  // pathArc = `A ${(pathPoints3[1]-pathPoints0[1])/8} ${(pathPoints3[1]-pathPoints0[1])/2} 0 0 0 ${pathPoints0[0]} ${pathPoints0[1]}`;

  // Strangely, svg-use href with #id is supposed to refer to the id inside same svg,
  // but instead it searches the whole html document.
  // Worked around with uuid. Needs confirmation what's going on here.
  const svgSymbolUuid = crypto.randomUUID();

  const svgElement = containerElement.querySelector(':scope > svg');
  const pathElement = svgElement.querySelector(':scope > symbol > path');
  pathElement.setAttribute('d', `M ${pathPoints0[0]},${pathPoints0[1]} L ${pathPoints1[0]},${pathPoints1[1]} L ${pathPoints2[0]},${pathPoints2[1]} L ${pathPoints3[0]},${pathPoints3[1]} ${pathArc} Z`);
  pathElement.parentElement.setAttribute('id', svgSymbolUuid);
  // console.log('pathElement', pathElement);

  // TODO what if symbol not the first? rewrite using selector query
  // TODO optimize: use count and child count
  // TODO try replaceChildren api
  for (let i = svgElement.children.length - 1; i >= 0; i--) {
    if (svgElement.children[i].tagName !== 'symbol') {    
      svgElement.children[i].remove();
    }
  } 

  const startAngle = 0;
  for (let i = 0; i < childElements.length; i++) {
    const child = childElements[i];  

    const currentAngle = - i*angleStepRad + startAngle;
    const currentAngleDeg = currentAngle * 360 / (2 * Math.PI);

    const svgNs = "http://www.w3.org/2000/svg";
    const useElement = document.createElementNS(svgNs, "use");
    useElement.setAttribute("href", `#${svgSymbolUuid}`);
    useElement.setAttribute("transform", `rotate(${Math.round(currentAngleDeg)}, ${viewBoxCenterX}, ${viewBoxCenterY})`);
    svgElement.appendChild(useElement);
    
    const x = Math.cos(currentAngle)
    const y = Math.sin(currentAngle)

    child.style.left = `${50+x*50*radiusToContent}%`;
    child.style.top = `${50-y*50*radiusToContent}%`;
  }

}

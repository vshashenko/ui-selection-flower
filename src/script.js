// Code for the demo app

import { updateLayout } from './flower.js';

updateLayout('tab-flower');
updateLayout('status-flower');

// For access from inline event handlers
globalThis.showSelectionFlower1 = showSelectionFlower1;
globalThis.hideSelectionFlower1 = hideSelectionFlower1;
globalThis.showSelectionFlower2 = showSelectionFlower2;
globalThis.hideSelectionFlower2 = hideSelectionFlower2;
globalThis.flowerOnClick = flowerOnClick;
globalThis.flowerOnClick2 = flowerOnClick2;
globalThis.addLeaf = addLeaf;
globalThis.removeLeaf = removeLeaf;
globalThis.radiusChange = radiusChange;
globalThis.leafCutoffChange = leafCutoffChange;
globalThis.leafGapChange = leafGapChange;
globalThis.fakeHulyChange = fakeHulyChange;

showSelectionFlower1();

function showSelectionFlower1(event, element) {
  const containerElement = document.getElementById('tab-flower');
  containerElement.classList.toggle('shown');
}

function showSelectionFlower2(event, element) {
  const containerElement = document.getElementById('status-flower');
  containerElement.classList.toggle('shown');
}

function hideSelectionFlower1() {
  const containerElement = document.getElementById('tab-flower');
  containerElement.classList.toggle('shown');
}

function hideSelectionFlower2() {
  const containerElement = document.getElementById('status-flower');
  containerElement.classList.toggle('shown');
}

function flowerOnClick(event, element) {
  hideSelectionFlower1();
}

function flowerOnClick2(event, element) {
  hideSelectionFlower2();
}

function addLeaf() {
  const containerElement = document.getElementById('tab-flower');
  const newElement = containerElement.lastElementChild.cloneNode(true);
  const childCount = containerElement.childElementCount - 1; //skip leaf template
  const iconSourceElement = containerElement.children[1 + Math.floor(childCount / 2)];
  const href = iconSourceElement.firstElementChild.getAttribute('href');
  newElement.firstElementChild.setAttribute('href', href);
  containerElement.appendChild(newElement);
  updateLayout('tab-flower');
}

function removeLeaf() {
  const containerElement = document.getElementById('tab-flower');
  if (containerElement.childElementCount == 1+4) {
    return;
  }
  containerElement.removeChild(containerElement.lastElementChild);
  updateLayout('tab-flower');
}

function radiusChange() {
  const containerElement = document.getElementById('tab-flower');
  const radiusInputElement = document.getElementById('flowerRadius');
  const newRadius = radiusInputElement.value;

  containerElement.style.width = `${newRadius}px`;
  containerElement.style.height = `${newRadius}px`;
}

function leafCutoffChange() {
  const containerElement = document.getElementById('tab-flower');
  const leafCutoffInputElement = document.getElementById('leafCutoff');
  const newLeafCutoff = leafCutoffInputElement.value / 100;

  containerElement.style.setProperty('--leaf-cutoff', newLeafCutoff);
  updateLayout('tab-flower');
}

function leafGapChange() {
  const containerElement = document.getElementById('tab-flower');
  const leafGapInputElement = document.getElementById('leafGap');
  const newLeafGap = leafGapInputElement.value;

  containerElement.style.setProperty('--leaf-gap', newLeafGap);
  updateLayout('tab-flower');
}

function fakeHulyChange() {
  const imageElement = document.querySelector('div#fake-huly > img');
  imageElement.classList.toggle('shown');
}

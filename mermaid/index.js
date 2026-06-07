'use strict';

// Lokta Mermaid palettes for the Marp engine. Light is the cream stock; dark is
// the Ink stock. The engine picks one per slide based on the slide's class.
// Node classDef colours (hero / store / dec / danger / muted) are set inline in
// the diagram and read on both grounds.

const light = {
  theme: 'base',
  themeVariables: {
    fontFamily: '"Archivo", sans-serif',
    fontSize: '15px',
    background: '#F4F1DF',
    primaryColor: '#FAF8EA',
    primaryTextColor: '#1F1C13',
    primaryBorderColor: '#2A2620',
    lineColor: '#2A2620',
    secondaryColor: '#EAE6D2',
    tertiaryColor: '#EAE6D2',
    tertiaryBorderColor: '#2A2620',
    noteBkgColor: '#FBBC0E',
    noteTextColor: '#1F1C13',
    noteBorderColor: '#1F1C13',
    actorBkg: '#FAF8EA',
    actorBorder: '#2A2620',
    actorTextColor: '#1F1C13',
    actorLineColor: '#8E867A',
    signalColor: '#2A2620',
    signalTextColor: '#1F1C13',
    labelBoxBkgColor: '#FBBC0E',
    labelBoxBorderColor: '#1F1C13',
    labelTextColor: '#1F1C13',
    loopTextColor: '#1F1C13',
    clusterBkg: '#EAE6D2',
    clusterBorder: '#2A2620',
    edgeLabelBackground: '#F4F1DF',
  },
};

const dark = {
  theme: 'base',
  themeVariables: {
    fontFamily: '"Archivo", sans-serif',
    fontSize: '15px',
    background: '#1F1C13',
    primaryColor: '#2A2620',
    primaryTextColor: '#FAF8EA',
    primaryBorderColor: '#C2B89C',
    lineColor: '#C2B89C',
    secondaryColor: '#26221A',
    tertiaryColor: '#26221A',
    tertiaryBorderColor: '#C2B89C',
    noteBkgColor: '#FBBC0E',
    noteTextColor: '#1F1C13',
    noteBorderColor: '#1F1C13',
    actorBkg: '#2A2620',
    actorBorder: '#C2B89C',
    actorTextColor: '#FAF8EA',
    actorLineColor: '#8E867A',
    signalColor: '#C2B89C',
    signalTextColor: '#FAF8EA',
    labelBoxBkgColor: '#FBBC0E',
    labelBoxBorderColor: '#1F1C13',
    labelTextColor: '#1F1C13',
    loopTextColor: '#FAF8EA',
    clusterBkg: '#2A2620',
    clusterBorder: '#C2B89C',
    edgeLabelBackground: '#1F1C13',
  },
};

// Node classes for `classDef` in a flowchart.
const classDefs = {
  hero: 'fill:#FBBC0E,stroke:#1F1C13,stroke-width:1.5px,color:#1F1C13',
  store: 'fill:#6E8B6F,stroke:#1F1C13,stroke-width:1.5px,color:#FAF8EA',
  dec: 'fill:#2E3E5C,stroke:#1F1C13,stroke-width:1.5px,color:#FAF8EA',
  danger: 'fill:#C23A26,stroke:#1F1C13,stroke-width:1.5px,color:#FAF8EA',
  muted: 'fill:#EAE6D2,stroke:#2A2620,stroke-width:1.5px,color:#2A2620',
};

module.exports = { light, dark, classDefs };

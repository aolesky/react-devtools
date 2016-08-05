/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';


var {EventEmitter} = require('events');

var assign = require('object-assign');
import type {DOMNode, DOMRect} from '../types';

const ACCURACY_LEVEL = 5;

class MultiOverlay {
  win: Object;
  container: DOMNode;
  _currentNodes: ?Array<DOMNode>;

  constructor(window: Object) {
    this.win = window;
    var doc = window.document;
    this.container = doc.createElement('div');
    doc.body.appendChild(this.container);
    this._currentNodes = null;
  }

  highlightMany(nodes: Array<DOMNode>) {
    this._currentNodes = nodes;
    this.container.innerHTML = '';

    var locations: Map<DOMRect, number> = new Map();

    var virtualScreen = new Array(Math.floor(window.innerHeight/ACCURACY_LEVEL));
    for (var i = 0; i < window.innerHeight/ACCURACY_LEVEL; i++) {
      virtualScreen[i] = new Array(Math.floor(window.innerWidth/ACCURACY_LEVEL));
    }

    nodes.forEach(node => {
      var div = this.win.document.createElement('div');
      if (typeof node.getBoundingClientRect !== 'function') {
        return;
      }
      var box = node.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) {
        return;
      }

      assign(div.style, {
        top: box.top + 'px',
        left: box.left + 'px',
        width: box.width + 'px',
        height: box.height + 'px',
        border: '2px dotted rgba(200, 100, 100, .8)',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(200, 100, 100, .2)',
        position: 'fixed',
        zIndex: 10000000,
        pointerEvents: 'none',
      });
      this.container.appendChild(div);

      //calcs
      var startBox = [Math.floor(box.top/ACCURACY_LEVEL), Math.floor(box.left/ACCURACY_LEVEL)];
      var endBox = [Math.floor(box.bottom/ACCURACY_LEVEL), Math.floor(box.right/ACCURACY_LEVEL)];

      if (startBox[0] < 0) {
        startBox[0] = 0;
      }
      if (startBox[1] < 0) {
        startBox[1] = 0;
      }
      if (endBox[0] > virtualScreen.length) {
        endBox[0] = virtualScreen.length - 1;
      }
      if (endBox[1] > virtualScreen[0].length) {
        endBox[1] = virtualScreen[0].length - 1;
      }
      //update screen
      for (var i = startBox[0]; i < endBox[0]; i++) {
        for (var j = startBox[1]; j < endBox[1]; j++) {
          virtualScreen[i][j] = true;
        }
      }
    });

    var pixelCoverage = 0;
    for (var i = 0; i < virtualScreen.length; i++) {
      for (var j = 0; j < virtualScreen[0].length; j++) {
        if (virtualScreen[i][j] === true) {
          pixelCoverage += 1;
        }
      }
    }

    var totalPixels = virtualScreen.length * virtualScreen[0].length;
    var percentCoverage = Math.floor(pixelCoverage * 100 / totalPixels);

    console.log(percentCoverage + "% Visual Coverage");

    //send through agent

  }

  refresh() {
    if (this._currentNodes) {
      this.highlightMany(this._currentNodes);
    }
  }

  remove() {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this._currentNodes = null;
    }
  }
}

module.exports = MultiOverlay;

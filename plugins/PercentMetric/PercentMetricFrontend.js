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

var decorate = require('../../frontend/decorate');

const React = require('react');
const immutable = require('immutable');

type Props = {
  state: any,
};

type State = StateRecord;

type DefaultProps = {};

class SettingsCheckbox extends React.Component {
  props: Props;
  defaultProps: DefaultProps;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      percentState: this.props.percentState,
    }
  }

  render() {
    var state = this.props.state || this._defaultState;
    return (
      <div style={styles.container} onClick={this._toggle} tabIndex={0}>
        <span>{this.state.text}% Coverage</span>
      </div>
    );
  }
}

var styles = {
  container: {
    WebkitUserSelect: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily: 'arial',
    fontSize: '12px',
    outline: 'none',
    userSelect: 'none',
    margin: '0px 4px 0px 4px',
  },
};


module.exports = decorate({
  listeners: () => ['percentchange'],

  props(store) {
    return {
      state: store.percentState,
    };
  },
}, MyComp);

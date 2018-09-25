import React, { Component } from 'react';

import { connect } from 'react-redux';

import * as actions from '../../actions/dash.js';

import {api} from '../../actions/_request';

class Dash extends Component {

  constructor(props){
      super(props)

      this.state={

      }
    }


  render() {
    return (
      <div>
      	hola fer
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
    return {
        dash : state.dash,
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Dash)
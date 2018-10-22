import React, { Component } from 'react';
//import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../actions/dash.js';

//import {api} from '../../actions/_request';

class Salir extends Component {


  render() {
    

    
      return (
        <div className="container-fluid">
            Registro de Usuarios
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

export default connect(mapStateToProps, actions)(Salir)
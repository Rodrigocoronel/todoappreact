import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../actions/dash.js';

import {api} from '../../actions/_request';

class Almacenes extends Component {


render() {

      return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Registro De Almacenes</strong>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Folio:</label>
                                            <input className="form-control" type="text" id="folio" placeholder="########" name="folio" onChange = {this.handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Nombre:</label>
                                             <input className="form-control" type="text" id="codigoInsumo" placeholder="########" name="insumo" onChange = {this.handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div>
                                            <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} >Registrar</button>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div>
                                           <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} >Registrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



<div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Almacenes</strong>
                            </div>
  </div>  </div>  </div>


            </div>
        </div>
    );}
}

function mapStateToProps(state, ownProps) {
    return {
        dash : state.dash,
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Almacenes)
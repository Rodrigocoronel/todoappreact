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
                    <div className="col-sm-12 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Registro De Almacenes</strong>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Folio:</label>
                                            <input className="form-control" placeholder="autoasigned" type="text" readOnly name="folio" />
                                        </div>
                                        <div className="form-group">
                                            <label>Nombre:</label>
                                             <input className="form-control" type="text" name="insumo" onChange = {this.handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div>
                                            <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} >Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Almacenes</strong>
                            </div>
                            <div className="card-body">
                                <table class="table table-responsive-sm table-striped">
                                    <thead>
                                        <tr>
                                            <th width="25%"> Codigo </th>
                                            <th width="75%"> Nombre </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <td>1</td>
                                        <td>General</td>
                                    </tbody>
                                </table>  
                            </div>
                        </div>
                    </div>
                </div>
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
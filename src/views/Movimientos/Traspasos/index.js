import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../../actions/dash.js';

import {api} from '../../../actions/_request';

class Dash extends Component {

  constructor(props){
      super(props)

      this.state={
        movimiento : {
            folio : '',
            botella_id : '',
            movimiento_id : '',
            almacen_origen_id : '',
            almacen_destino_id : '',
            fecha : '',
            user : ''
        }
      }
      
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

handleInputChange(event) {
 
    const target = event.target;
    const value = target.value;
    const name = target.name;

    var {movimiento} = this.state;
      
    movimiento[name] = value;
      
    this.setState({
        movimiento: movimiento
    });
  }

    
  handleSubmit(evt){
    evt.preventDefault();
      var {movimiento} = this.state;
      
        console.log(movimiento);
      
   // Llamada a laravel
  }


  render() {
    
      let{movimiento} = this.state;
    
      return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Registro De Movimientos</strong>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Folio:</label>
                                            <input className="form-control" type="text" value = {movimiento.folio} name="folio" onChange = {this.handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Descripcion de insumo:</label>
                                            <input className="form-control" type="text" readOnly value = {movimiento.id} name="insumo" onChange = {this.handleInputChange} />
                                        </div>
                                        <div class="form-group">
                                            <label >Movimiento:</label>
                                            <select className="form-control" id="select1" name="select1">
                                                <option value="0">Selecciona un movimiento...</option>
                                                <option value="1">Entrada</option>
                                                <option value="2">Salida</option>
                                                <option value="3">Cancelación</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Almacen:</label>
                                            <input className="form-control" type="text" readOnly value = {movimiento.fecha} name="almacen_origen_id" onChange = {this.handleInputChange} />
                                        </div>
                                                                                <div className="form-group">
                                            <label>Fecha de movimiento:</label>
                                            <input className="form-control" type="date"  readOnly value = {movimiento.fecha} name="fecha_compra" onChange = {this.handleInputChange} />
                                        </div>
                                        <div>
                                            <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} > Registrar Movimiento </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
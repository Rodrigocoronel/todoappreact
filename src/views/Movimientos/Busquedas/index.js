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
                    <div className="col-sm-8">
                        <div className="card">
                            <div className="card-header">
                                <strong>Reporte De Movimientos</strong>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Fecha inicial:</label>
                                             <input className="form-control" type="date"  readOnly value = {movimiento.fecha} name="fecha_compra" onChange = {this.handleInputChange} />
                                        </div>

                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Fecha inicial:</label>
                                            <input className="form-control" type="date"  readOnly value = {movimiento.fecha} name="fecha_compra" onChange = {this.handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} > Buscar </button>
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
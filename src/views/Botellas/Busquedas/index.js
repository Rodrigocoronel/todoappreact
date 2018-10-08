import React, { Component } from 'react';
//import ReactTable from 'react-table';
import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../../actions/dash.js';

import {api} from '../../../actions/_request';



const VentanaDeError = () => 
(
    <div className="ventanaDeError card">
        <div className="card-header">
            <i className="fa fa-align-justify"></i> Error!!!
        </div>
        <div className="card-body">
            <table className="table table-responsive-sm table-striped">
                <tbody>
                {
                    <div class="alert alert-warning" role="alert">
                        El producto no se encuentra registrado
                    </div>
                }
                </tbody>
            </table>  
        </div>
    </div>
)

class Dash extends Component {

  constructor(props){
      super(props)

      this.state={
        botella : {
            folio : '',
            insumo : '',
            desc_nsumo : '',
            fecha_compra : '',
            almacen_actual : '',
            mov: [],
        },

      }
      this.limpiarState = this.limpiarState.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
 
    const target = event.target;
    const value = target.value;
    const name = target.name;

    var {botella} = this.state;
      
    botella[name] = value;
      
    this.setState({
        botella: botella
    });
  }
    
  handleSubmit(evt){
    evt.preventDefault();
    var {botella} = this.state;
    let temp = this;
      
    api().get(`/Botella/${botella.folio}`)
        .then(function(response)
        {
            if(response.status==200)
            {
                if(response.data[0]==null)
                {

                    console.log("No Registrado");
                    temp.limpiarState();
                }
                else
                { 
                    botella = response.data[0];
                    temp.setState({
                        botella: botella,
                    });
                }
            }
        });
    }
  
  limpiarState()
  {
     this.setState({
         botella : 
         {
            folio : '',
            insumo : '',
            desc_nsumo : '',
            fecha_compra : '',
            almacen_actual : '',
            mov: [],
         }
      })
  }

  prueba(x)
  {
      switch(x)
      {
          case 1: return (<div> Entrada </div>); break;
          case 2: return (<div> Salida </div>); break;
          case 3: return (<div> Cancelacion </div>); break;
      }     
  }

  render() {

    let{botella} = this.state;
    console.log(botella);

      return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-sm-12 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <strong>Busqueda De Botellas</strong>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label>Folio:</label>
                                            <input className="form-control" type="text" value = {botella.folio} name="folio" onChange = {this.handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Codigo de insumo:</label>
                                            <label className="form-control" type="text" name="insumo"> {botella.insumo} </label>
                                        </div>
                                        <div className="form-group">
                                            <label>Descripcion:</label>
                                            <label className="form-control" type="text" name="desc_insumo"> {botella.desc_insumo} </label>
                                        </div>
                                        <div className="form-group">
                                            <label>Fecha de compra:</label>
                                            <label className="form-control" type="date" name="fecha_compra"> {botella.fecha_compra} </label>
                                        </div>
                                        <div className="form-group">
                                            <label>Almacen actual:</label>
                                            <label className="form-control" type="text" name="almacen_actual"> {botella.almacen?botella.almacen.nombre:''} </label>
                                        </div>
                                        <div>
                                            <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} > Buscar </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ventanaDeMovimientos col-sm-12 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-align-justify"></i> Reporte de movimientos
                            </div>
                            <div className="card-body">
                                <table className="table table-responsive-sm table-striped">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Fecha</th>
                                            <th>Movimiento</th>
                                            <th>Almacen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        botella.mov.map((item, i) => 
                                            <tr key={i}>
                                                <td>{i+1}</td>
                                                <td>{item.fecha}</td>
                                                <td> {this.prueba(item.movimiento_id)} </td>
                                                <td>{item.almacen_id}</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>  
                            </div>
                        </div>
                        <div>
                        {<VentanaDeError />}
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
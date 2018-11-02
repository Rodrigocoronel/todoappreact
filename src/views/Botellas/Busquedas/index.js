import React, { Component } from 'react';
//import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';

const VentanaDeError = () => 
(
    <div className="card">
        <div className="card-header">
            <strong> Error!!! </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-warning" role="alert">
                <strong> El producto no se encuentra registrado </strong>
            </div>
        </div>
    </div>
)

const VentanaDeMovimientos = ({botella}) =>
(
    <div className="card">
        <div className="card-header">
            <i className="fa fa-align-justify"></i> <strong> Reporte de movimientos </strong>
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
                        <tr key = { i } >
                            <td> { i+1 } </td>
                            <td> { item.fecha } </td>
                            <td> { item.movimiento_id === 1 ? "Entrada" : item.movimiento_id === 2 ? "Salida" : item.movimiento_id === 3 ? "Cancenlación" : item.movimiento_id === 4 ? "Venta" : item.movimiento_id === 5 ? "Baja" : "Traspaso" } </td>
                            <td> { item.almacen_nombre } </td>
                        </tr>
                    )
                }
                </tbody>
            </table>  
        </div>
    </div>
)

class Buscar extends Component 
{
    constructor(props){
        super(props)

        this.state={
            botella : {
                folio : '',
                insumo : '',
                desc_insumo : '',
                fecha_compra : '',
                almacen_id : '',
                transito : '',
                mov : [],
                error : 0,
            },
        }
        this.limpiarState = this.limpiarState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleInputChange(event) 
    {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        var {botella} = this.state;
        botella[name] = value;
        this.setState({ botella: botella  });
    }
    
    handleKeyPress(event)
    {
        const target = event.target;
        var {botella} = this.state;
        var datos = [];
        let temp = this;

        if ( (event.key === 'Enter') && (botella.folio) )
        {
            botella.error = 1;
            datos = botella.folio.toString().split("^");
            if(datos.length===6) botella.folio = datos[0];

            api().get(`/Botella/${botella.folio}`)
            .then(function(response)
            {
                if(response.status === 200)
                {
                    if(response.data[0] == null)
                    {
                        botella.folio = datos[0];
                        temp.limpiarState(datos[0]);
                    }
                    else
                    { 
                        botella = response.data[0];
                        botella.error = 0;
                        temp.setState({
                           botella: botella,
                        });               
                    }
                    target.select();
                }
            });
        }
    }
            
    limpiarState(datos)
    {
        this.setState({
            botella : 
            {
                folio : datos,
                insumo : '',
                desc_insumo : '',
                fecha_compra : '',
                almacen_id : '',
                mov : [],
                error : 1,
            }
        })
    }

    render() 
    {
        let {botella} = this.state;

        return(
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <strong>Búsqueda De Botellas</strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label>Folio:</label>
                                                <input className="form-control" type="text" autoFocus placeholder="#" value = {botella.folio} name="folio" onKeyPress = {this.handleKeyPress} onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Código de insumo:</label>
                                                <label className="form-control" type="text" readOnly name="insumo"> {botella.insumo} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Descripción:</label>
                                                <label className="form-control" type="text" readOnly name="desc_insumo"> {botella.desc_insumo} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha de compra:</label>
                                                <label className="form-control" type="date" readOnly name="fecha_compra"> {botella.fecha_compra} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Ubicación actual:</label>
                                                <label className="form-control" type="text" readOnly name="almacen_actual"> {botella.almacen?botella.almacen.nombre:''} </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            { botella.error === 0 ? <VentanaDeMovimientos botella = {botella} /> : <VentanaDeError /> }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) 
{
    return{
        dash : state.dash,
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Buscar)
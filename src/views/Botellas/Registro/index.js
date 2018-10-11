import React, { Component } from 'react';   
//import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';

const VentanaCargaExitosa = () =>
(
    <div className="card">
        <div className="card-header">
            <strong> Confirmación </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-success" role="alert">
                <strong> El producto se registro correctamente</strong>
            </div>
        </div>
    </div>
)

const VentanaErrorDeCodigo = () =>
(
    <div className="card">
        <div className="card-header">
            <strong> Error!!! </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-warning" role="alert">
                <strong> Codigo Invalido </strong>
            </div>
        </div>
    </div>
)

const VentanaErrorDeServidor = () =>
(
    <div className="card">
        <div className="card-header">
            <strong> Error!!! </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-warning" role="alert">
                <strong> Codigo No Guardado </strong>
            </div>
        </div>
    </div>
)

class Dash extends Component
{
    constructor(props){
        super(props)

        this.state={
            botella : {
                folio : '',
                insumo : '',
                desc_insumo : '',
                fecha_compra : '',
                almacen_actual : '',
                error : 0,
                guardado : 0,
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

        this.setState({
            botella: botella
        });
    }

    handleKeyPress(event)
    {
        const target = event.target;
        var {botella} = this.state;
        let temp = this;
        var datos = new Array();

        if( (event.key === 'Enter') && (botella.folio) ) 
        { 
            datos = botella.folio.split("^")
            botella.error = 2;
            if(datos.length===6)
            {
                botella.folio = datos[0];
                botella.insumo = datos[3];
                botella.desc_insumo = datos[4];
                var fecha = datos[2].split("/");
                botella.fecha_compra = new Date(fecha[2],fecha[1]-1,fecha[0]).toISOString().slice(0,10);
                botella.almacen_actual = 1;

                botella.error=3;
                this.setState({
                    botella: botella
                });

                api().post('/BotellaNueva',botella)
                .then(function(response)
                {
                    if(response.status === 200)
                    {
                        temp.error = 1;
                        temp.setState({
                            botella: botella,
                        });    
                    }
                });
            }
            else
            {
                this.limpiarState();
            }
            target.select();
        }
    }

    limpiarState()
    {
        this.setState({
            botella : 
            {
                //folio : '',
                insumo : '',
                desc_insumo : '',
                fecha_compra : '',
                almacen_actual : '',
                error : 2,
            }
        });
    }

    render() {
    
        let{botella} = this.state;
    
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <strong>Registro De Botellas</strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label>Folio:</label>
                                                <input className="form-control" type="text" placeholder="#" value = {botella.folio} name="folio" onKeyPress = {this.handleKeyPress} onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Codigo de insumo:</label>
                                                <input className="form-control" type="text" readOnly placeholder="" value = {botella.insumo} name="insumo" />
                                            </div>
                                            <div className="form-group">
                                                <label>Descripcion:</label>
                                                <input className="form-control" type="text" readOnly placeholder="" value = {botella.desc_insumo} name="desc_insumo" />
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha de compra:</label>
                                                <input className="form-control" type="date" readOnly placeholder="" value = {botella.fecha_compra} name="fecha_compra" />
                                            </div>
                                            <div className="form-group">
                                                <label>Almacen actual:</label>
                                                <input className="form-control" type="text" readOnly placeholder="" value = {botella.almacen_actual} name="almacen_actual" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            { botella.error === 0 ? "" : botella.error === 1 ? <VentanaCargaExitosa /> : botella.error === 2 ? <VentanaErrorDeCodigo /> :  <VentanaErrorDeServidor /> }
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
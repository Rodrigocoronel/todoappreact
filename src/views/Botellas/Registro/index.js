import React, { Component } from 'react';   
//import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';

const VentanaCargaExitosa = () => // CODIGO 1
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

const VentanaErrorDeCodigo = () => // CODIGO 2
(
    <div className="card">
        <div className="card-header">
            <strong> Error!!! </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-warning" role="alert">
                <strong> Código Inválido </strong>
            </div>
        </div>
    </div>
)

const VentanaErrorDeServidor = () => // CODIGO 3
(
    <div className="card">
        <div className="card-header">
            <strong> Error!!! </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-warning" role="alert">
                <strong> La botella ya se encuentra registrada </strong>
            </div>
        </div>
    </div>
)

class Agregar extends Component
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
                error : 0,
                guardado : 0,
            },
            mensaje : {
                tipo : '',
                titulo : '',
                texto : '',
            }
        }
        this.limpiarState = this.limpiarState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleInputChange(event)
    {
        const value = event.target.value;
        const name = event.target.name;
        var {botella} = this.state;

        botella[name] = value;
        botella.error=0;
        this.setState({ botella: botella });
    }

    handleKeyPress(event)
    {
        const target = event.target;
        const tecla = event.key;
        var {botella} = this.state;
        let temp = this;
        var datos = [];
        var fecha = '';

        if( (tecla === 'Enter') && (botella.folio) ) 
        { 
            datos = botella.folio.toString().split("^")
            let newsd = botella.folio.toString().split("&")
            
            botella.error = 2;

            if(newsd.length === 7){
                datos = newsd;
            }

            if(datos.length===7)
            {
                botella.folio = datos[0];
                botella.insumo = datos[3];
                botella.desc_insumo = datos[4];
                if(newsd.length === 7){
                    fecha = datos[2].split("-");
                    botella.fecha_compra = new Date(fecha[2],fecha[1]-1,fecha[0]).toISOString().slice(0,10);
                }else{
                    fecha = datos[2].split("/");
                    botella.fecha_compra = new Date(fecha[2],fecha[1]-1,fecha[0]).toISOString().slice(0,10);
                }
                botella.almacen_id = 1;
                botella.transito = 0;

                api().post('/BotellaNueva',botella)
                .then(function(response)
                {
                    if(response.status === 200)
                    {
                        response.data ? botella.error = 1 : botella.error = 3;
                    }
                    temp.setState({ botella: botella });
                    target.select(); 
                })
                .catch(error =>
                {
                    botella.error=3;
                    temp.setState({ botella: botella });
                });
            }
            else
            {
                this.limpiarState();
                target.select();
            }   
        }
    }

    limpiarState()
    {
        this.setState({
            botella : 
            {
                folio : '',
                insumo : '',
                desc_insumo : '',
                fecha_compra : '',
                almacen_id : '',
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
                                                <input className="form-control" type="text" autoFocus placeholder="#" value = {botella.folio} name="folio" onKeyPress = {this.handleKeyPress} onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Codigo de insumo:</label>
                                                <input className="form-control" type="text" readOnly value = {botella.insumo} name="insumo" />
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
                                                <label className="form-control" type="text" name="almacen_actual"> {botella.almacen_id} </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            {
                                botella.error === 0 ? "" :
                                botella.error === 1 ? <VentanaCargaExitosa /> :
                                botella.error === 2 ? <VentanaErrorDeCodigo /> :
                                <VentanaErrorDeServidor />
                            }
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

export default connect(mapStateToProps, actions)(Agregar)
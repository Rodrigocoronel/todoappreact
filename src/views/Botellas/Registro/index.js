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
                <strong> Registro duplicado </strong>
            </div>
        </div>
    </div>
)

const VentanaDeCargaExitosa = () =>
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

    
    handleSubmit(evt)
    {
        evt.preventDefault();
        var {botella} = this.state;
        let temp = this;


        
 
/*
        api().post('/BotellaNueva',botella)
        .then(function(response)
        {
            if(response.status === 200)
            {
                botella.error = 1;
                temp.setState({
                    botella: botella,
                });    
            }
            else
            {
                temp.limpiarState();
            }
        });*/
    }

    limpiarState()
    {
        this.setState({
            botella : 
            {
                //folio : '',
                insumo : '',
                desc_nsumo : '',
                fecha_compra : '',
                almacen_actual : '',
                error : 2,
            }
        })
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
                                               <input className="form-control" type="text" placeholder="########" value = {botella.folio} name="folio" onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Codigo de insumo:</label>
                                                <input className="form-control" type="text" placeholder="########" value = {botella.insumo} name="insumo" onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Descripcion:</label>
                                                <input className="form-control" type="text" placeholder="" value = {botella.desc_insumo} name="desc_insumo" onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha de compra:</label>
                                                <input className="form-control" type="date" placeholder="dd/mm/aa" value = {botella.fecha_compra} name="fecha_compra" onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Almacen actual:</label>
                                                <input className="form-control" type="text" placeholder="#" value = {botella.almacen_actual} name="almacen_actual" onChange = {this.handleInputChange} />
                                            </div>
                                            <div>
                                                <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} >Registrar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            { botella.error === 0 ? "" : botella.error === 1 ? <VentanaDeCargaExitosa /> : <VentanaDeError /> }
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
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
                <strong> Codigo No Encontrado </strong>
            </div>
        </div>
    </div>
)

const VentanaDeGuardadoExitoso = () => 
(
    <div className="card">
        <div className="card-header">
            <strong> Confirmación </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-success" role="alert">
                <strong> El movimiento fue registrado </strong>
            </div>
        </div>
    </div>
)

const SelectAlmacenes = ({almacenes}) =>
(
    <div className="form-group">
        <label> Almacen: </label>
        <select className="form-control" id="select2" name="select2">
            <option value="0"> Selecciona un almacen... </option>
            {
                almacenes.map((item, i) => <option key={i} value={i} > {item.nombre} </option> )
            } 
        </select>
    </div>
)

const TituloDeEntrada = () => ( <div> <button className="btn btn-success" type="button" data-toggle="modal" data-target="#successModal"> <strong> Registro De Entrada </strong> </button> </div> )

const TituloDeSalida = () => ( <div> <button className="btn btn-warning" type="button" data-toggle="modal" data-target="#warningModal"> <strong> Registro De Salida </strong> </button> </div> )

const TituloDeCancelacion = () => ( <div> <button className="btn btn-danger" type="button" data-toggle="modal" data-target="#dangerModal"><strong>Cancelación de venta </strong></button> </div> )

class Dash extends Component {

    constructor(props){
        super(props)

        this.state={
            movimiento : {
                folio : '',
                botella_id : '',
                movimiento_id : '',
                almacen_id : '',
                fecha : '',
                user : ''
            },
            botella : 
            {
                folio : '',
                insumo : '',
                desc_insumo : '',
                fecha_compra : '',
                almacen_actual : '',
                mov : [],
            },
            almacenes : [],
            tipoDeMovimiento : '1',
            error : 0,     // 0-Vacio, 1-Ok, 2-No encontrado
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount()
    {
        var {almacenes} = this.state;
        let temp = this;

        api().get(`/Almacenes`)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data[0] != null)
                {
                    almacenes = response.data;
                    temp.setState({
                        almacenes : almacenes,
                    })
                }
            }
        });
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

    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const value = target.value;

        var {tipoDeMovimiento} = this.state;
        tipoDeMovimiento = value.toString();
 
        this.setState({
            tipoDeMovimiento: tipoDeMovimiento
        });   
    }

    handleKeyPress(event)
    {
        const target = event.target;
        var {botella} = this.state;
        var {error} = this.state;
        let temp = this;   
        var datos = [];

        error=2;
        if ( (event.key === 'Enter') && (botella.folio) )
        {
            datos = botella.folio.toString().split("^");
            if(datos.length===6 )
            {
                botella.folio = datos[0];
                api().get(`/Botella/${botella.folio}`)
                .then(function(response)
                {
                    error=2;
                    if(response.status === 200)
                    {
                        if(response.data[0] == null)
                        {
                            botella.desc_insumo = "";
                        }
                        else
                        { 
                            error = 1;
                            botella = response.data[0];
                        }
                        temp.setState({ botella : botella, error : error, });  
                    }
                    
                });
            }
            else
            {
               this.setState({ error : error, });  
            }
        }
        else
        {
            this.setState({ error : error, });
        }
        target.select();
    }

    render() {
    
        var {tipoDeMovimiento} = this.state;
        var {almacenes} = this.state;
        var {error} = this.state;
        var {movimiento} = this.state;
        var {botella} = this.state;
    
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-lg-6 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong> Registro De Movimientos </strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label> Movimiento: </label>
                                                <select className="form-control" id="select1" name="select1" onChange={this.handleChange} >
                                                    <option value="0">Selecciona un movimiento... </option>
                                                    <option value="1">Entrada </option>
                                                    <option value="2">Salida </option>
                                                    <option value="3">Cancelación </option>
                                                </select>
                                            </div>
                                        </div>
                                         <div className="col-lg-6">
                                            { <SelectAlmacenes almacenes = {almacenes}/> }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            { error === 1 ? <VentanaDeGuardadoExitoso /> : error === 2 ? <VentanaDeError /> : "" }
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    { tipoDeMovimiento === '1' ? <TituloDeEntrada /> : tipoDeMovimiento === '2' ? <TituloDeSalida /> : <TituloDeCancelacion /> }
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label> Folio: </label>
                                                <input className="form-control" type="text" autoFocus value = {botella.folio} name="folio" onKeyPress = {this.handleKeyPress} onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label> Descripcion de insumo: </label>
                                                <input className="form-control" type="text" readOnly value = {botella.desc_insumo} name="insumo" />
                                            </div>
                                            <div className="form-group">
                                                <label> Fecha de movimiento: </label>
                                                <input className="form-control" type="text" placeholder="autoasigned" readOnly value = {movimiento.fecha} name="fecha_compra" />
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
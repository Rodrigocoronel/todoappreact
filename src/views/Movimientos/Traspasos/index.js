import React, { Component } from 'react';
//import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';

const VentanaDeMensaje = (props) => 
(
    <div className="card">
        <div className="card-header">
            <strong> {props.tipo} </strong>
        </div>
        <div className="card-body">
            <div className={props.estilo} role="alert">
                <strong> {props.mens} </strong>
            </div>
        </div>
    </div>
)

const TituloDeEntrada = () => ( <div> <button className="btn btn-success" type="button" data-toggle="modal" data-target="#successModal"> <strong> Registro De Entrada </strong> </button> </div> )

const TituloDeSalida = () => ( <div> <button className="btn btn-warning" type="button" data-toggle="modal" data-target="#warningModal"> <strong> Registro De Salida </strong> </button> </div> )

const TituloDeCancelacion = () => ( <div> <button className="btn btn-danger" type="button" data-toggle="modal" data-target="#dangerModal"><strong>Cancelación de venta </strong></button> </div> )

class Traspasos extends Component {

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
            almacenes : [],
            almacen : '1',
            tipoDeMovimiento : '1', // 1-Entrada, 2-Salida, 3-Cancelacion
            insumo : '',
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

        var {movimiento} = this.state;  
        movimiento[name] = value;
      
        this.setState({
            movimiento: movimiento
        });
    }

    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]:value
        });   
    }

    handleKeyPress(event)
    {
        const target = event.target;
        var {movimiento} = this.state;
        var {error, tipoDeMovimiento, almacen, insumo} = this.state;
        let temp = this;   
        var datos = [];

        if(movimiento.folio) datos = movimiento.folio.toString().split("^");
        if ( (event.key === 'Enter') && ( datos.length===6 ) )
        {
            movimiento.folio = datos[0];
            insumo = datos[4];
            movimiento.movimiento_id = tipoDeMovimiento;
            movimiento.almacen_id = almacen;

            api().post('/MovimientoNuevo',movimiento)
            .then(function(response)
            {
                error=2;
                if(response.status === 200)
                {
                    if(response.data)
                    {
                        console.log(response.data); 
                        error = 1;
                    }
                    temp.setState({ movimiento : movimiento, error : error, insumo : insumo });  
                }
                target.select(); 
            });
        }
        else
        {
            error=2;
            this.setState({ error : error });
        }
        
        target.select();
    }

    render() {
    
        var {tipoDeMovimiento} = this.state;
        var {almacenes} = this.state;
        var {error} = this.state;
        var {movimiento} = this.state;
        var {insumo} = this.state;
    
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
                                                <select value={this.state.tipoDeMovimiento} className="form-control" id="tipoDeMovimiento" name="tipoDeMovimiento" onChange={this.handleChange} >
                                                    <option value="0">Selecciona un movimiento... </option>
                                                    <option value="1">Entrada </option>
                                                    <option value="2">Salida </option>
                                                    <option value="3">Cancelación </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label> Almacen: </label>
                                                <select value={this.state.almacen} className="form-control" id="almacen" name="almacen" onChange={this.handleChange}>
                                                    <option value="0"> Selecciona un almacen... </option>
                                                    {
                                                        almacenes.map((item, i) => <option key={i} value={item.id} > {item.nombre} </option> )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-12">
                            { error === 1 ? <VentanaDeMensaje tipo = {"Confirmación"} estilo={"alert alert-success"} mens={"El movimiento fue registrado"} /> : error === 2 ? <VentanaDeMensaje tipo = {"Error!!!"} estilo={"alert alert-warning"} mens={"Codigo No Encontrado"} /> : "" }
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
                                                <input className="form-control" type="text" autoFocus value = {movimiento.folio} name="folio" onKeyPress = {this.handleKeyPress} onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label> Descripcion de insumo: </label>
                                                <input className="form-control" type="text" readOnly value = {insumo} name="insumo" />
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

export default connect(mapStateToProps, actions)(Traspasos)
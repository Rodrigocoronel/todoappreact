import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

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

const Entrada =     () => ( <div> <button className="btn btn-success" type="button" data-toggle="modal" data-target="#successModal"> <strong> Registro De Entrada   </strong> </button> </div> )
const Salida =      () => ( <div> <button className="btn btn-warning" type="button" data-toggle="modal" data-target="#warningModal"> <strong> Registro De Salida    </strong> </button> </div> )
const Cancelacion = () => ( <div> <button className="btn btn-danger"  type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Cancelación De Venta  </strong> </button> </div> )
const Venta =       () => ( <div> <button className="btn btn-success" type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Venta De Botellas     </strong> </button> </div> )
const Baja =        () => ( <div> <button className="btn btn-danger"  type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Baja Por Merma        </strong> </button> </div> )
const Traspaso =    () => ( <div> <button className="btn btn-warning" type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Traspaso Entre Barras </strong> </button> </div> )

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
            clase : ['',
                    'btn btn-lg btn-primary active btn90',
                    'btn btn-lg btn-info active btn90',
                    'btn btn-lg btn-info active btn90',
                    'btn btn-lg btn-info active btn90',
                    'btn btn-lg btn-info active btn90',
                    'btn btn-lg btn-info active btn90'],
            almacenes : [],
            almacen : '1',
            tMov : 1,    // 1-Entrada, 2-Salida, 3-Cancelacion, 4-Venta, 5-Baja, 6-Traspaso
            insumo : '',
            error : 0,     // 0-Vacio, 1-Ok, 2-No encontrado
            fin : 0, // 1-Fin: El ultimo caracter leido fue el final de la cadena Qr
            tarjeta : ";1370010000003023=991?", // Registro de tarjeta (TEMPORAL)
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.seleccionarMovimiento = this.seleccionarMovimiento.bind(this);
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
                    temp.setState({ almacenes : almacenes })
                }
            }
        });
    }

    handleInputChange(event)
    {
        const value = event.target.value;
        const name = event.target.name;
        var {movimiento, fin, error} = this.state;

        if(fin===1) { fin=0; movimiento[name]=''; }
        error=0;
        movimiento[name] = movimiento[name] + value;
        this.setState({ movimiento : movimiento, fin : fin, error : error });
    }

    handleChange(event){
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]:value });
        this.folio.focus();
    }

    handleKeyPress(event)
    {
        const target = event.target;
        var {movimiento,fin} = this.state;
        var {error, tMov, almacen, insumo, tarjeta} = this.state;
        let temp = this;   
        var datos = [];

        if (event.key === 'Enter') fin=1;
        if (event.key === 'Enter' && movimiento.folio)
        {
            datos = movimiento.folio.toString().split("^");
            if (datos.length===6 )
            {
                movimiento.folio = datos[0];
                insumo = datos[4];
                movimiento.movimiento_id = tMov;
                movimiento.almacen_id = almacen;

                if( tMov===3 || tMov===5 )
                {
                    swal({
                        title: 'Clave De Autorización',
                        input: 'password',
                        inputPlaceholder: 'Enter your password',
                    }).then((result) =>
                    {
                        if(result.value===tarjeta)
                        {
                            api().post('/MovimientoNuevo',movimiento)
                            .then(function(response)
                            {
                                error=2;
                                if(response.status === 200)
                                {
                                    if(response.data)
                                    {
                                        error = 1;
                                        tMov===3 ? swal('Cancelacion autorizada','','success') : swal('Baja de botella autorizada','','success');
                                    }
                                    else
                                    {
                                        error = 0;
                                        tMov===3 ? swal('Cancelacion rechazada','','error') : swal('Baja de botella rechazada','','error');
                                    }
                                    fin=1;
                                    temp.setState({ movimiento : movimiento, error : error, insumo : insumo, fin : fin });  
                                }
                                target.select();
                            })
                            .catch(error =>
                            {
                                error=2;
                                target.select();
                            });
                        }
                        else
                        {
                            swal('Autorización inválida','','error');
                            temp.setState({ movimiento : movimiento, error : error, insumo : insumo, fin : fin });  
                        }
                        target.select(); 
                    });
                }
                else
                {
                    api().post('/MovimientoNuevo',movimiento)
                    .then(function(response)
                    {
                        error=2;
                        if(response.status === 200)
                        {
                            if(response.data) { error = 1; }
                            fin=1;
                            temp.setState({ movimiento : movimiento, error : error, insumo : insumo, fin : fin });  
                        }
                        target.select();
                    })
                    .catch(error =>
                    {
                        error=2;
                        this.setState({ error : error, fin : fin });
                    });
                }
            }
            else
            {
                error=2;
                this.setState({ error : error, fin : fin });
            }
        }
        target.select();
    }

    seleccionarMovimiento(event,btn)
    {
        var {clase, tMov} = this.state;
        var tipoTemp = 'btn btn-lg btn-primary active btn90';
        for(var i=1;i<=6;i++) { clase[i] = 'btn btn-lg btn-info active btn90'; }
        clase[btn] = tipoTemp;
        tMov = btn;
        this.setState({ clase : clase, tMov : tMov});
        this.folio.focus();
    }

    render() {
    
        var {tMov, almacenes, error, movimiento, insumo} = this.state;
    
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-xl-7 col-lg-9 col-md-10 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong> Registro De Movimientos </strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-12">
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
                                        <div className="col-lg-12 text-center">
                                            <div className="row ">
                                                <div className="col-lg-4 col-md-6"> <button className={this.state.clase[1]} onClick={(e)=>this.seleccionarMovimiento(e,1)} type="button"> <strong> ENTRADA </strong> </button> </div>
                                                <div className="col-lg-4 col-md-6"> <button className={this.state.clase[2]} onClick={(e)=>this.seleccionarMovimiento(e,2)} type="button"> <strong> SALIDA </strong> </button> </div>
                                                <div className="col-lg-4 col-md-6"> <button className={this.state.clase[3]} onClick={(e)=>this.seleccionarMovimiento(e,3)} type="button"> <strong> CANCELACIÓN </strong> </button> </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div className="col-4"> <button className={this.state.clase[4]} onClick={(e)=>this.seleccionarMovimiento(e,4)} type="button"> <strong> VENTA </strong> </button> </div>
                                                <div className="col-4"> <button className={this.state.clase[5]} onClick={(e)=>this.seleccionarMovimiento(e,5)} type="button"> <strong> BAJA </strong> </button> </div>
                                                <div className="col-4"> <button className={this.state.clase[6]} onClick={(e)=>this.seleccionarMovimiento(e,6)} type="button"> <strong> TRASPASO </strong> </button> </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-9 col-md-10 col-sm-12">
                            { error ===0 ? "" : error === 1 ? <VentanaDeMensaje tipo = {"Confirmación"} estilo={"alert alert-success"} mens={"El movimiento fue registrado"} /> : error === 2 ? <VentanaDeMensaje tipo = {"Error!!!"} estilo={"alert alert-warning"} mens={"Codigo De Botella No Encontrado"} /> : "" }
                        </div>
                        <div className="col-xl-7 col-lg-9 col-md-10 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    { tMov === 1 ? <Entrada /> : tMov === 2 ? <Salida /> : tMov === 3 ? <Cancelacion /> : tMov === 4 ? <Venta /> : tMov === 5 ? <Baja /> : <Traspaso /> }
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label> Folio: </label>
                                                <input className="form-control" type="text" ref={(input) => { this.folio = input; }} autoFocus value = {movimiento.folio} name="folio" onKeyPress = {this.handleKeyPress} onChange = {this.handleInputChange} />
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
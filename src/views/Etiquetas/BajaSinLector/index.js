import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

const TipoDeMovimiento = ({mov,motivo}) =>
(
    <div>
    {
        mov === 1 ? <div className="badge badge-success">   Entrada   </div> :
        mov === 2 ? <div className="badge badge-warning">   Salida    </div> :
        mov === 3 ? <div className="badge badge-danger"> Cancenlación </div> :
        mov === 4 ? <div className="badge badge-secondary"> Venta     </div> :
        mov === 5 ? <div className="">   <span className="badge badge-danger"> Baja </span><br/> <span>{motivo}</span>   </div> :
                    <div className="badge badge-warning">   Traspaso  </div>
     } 
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
                        <th width='10%'> <center> No. </center>  </th>
                        <th width='30%'> <center> Fecha </center> </th>
                        <th width='20%'> <center> Movimiento </center> </th>
                        <th width='40%'> <center> Almacen </center> </th>
                    </tr>
                </thead>
                <tbody>
                {
                    botella.mov.map((item, i) => 
                        <tr key = { i } >
                            <td width='10%'> <center> { i+1 } </center>  </td>
                            <td width='30%'> <center> { item.fecha } </center> </td>
                            <td width='20%'> <center> { <TipoDeMovimiento mov = {parseInt(item.movimiento_id,10)} motivo={botella.motivo} /> } </center> </td>
                            <td width='40%'> <center> { item.almacen_nombre } </center> </td>
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
                error : 1,
                fin : 0,
            },
        }
        this.limpiarState = this.limpiarState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.buscarFolio = this.buscarFolio.bind(this);
        this.eliminarEtiqueta = this.eliminarEtiqueta.bind(this);
    }

    handleInputChange(event) 
    {
        const value = event.target.value;
        const name = event.target.name;
        var {botella} = this.state;

        botella[name] = value;
        this.setState({ botella: botella});
    }
    
    buscarFolio()
    {
        var { botella } = this.state;
        let temp = this;

        if(botella.folio !== '')
        {
            api().get(`/Botella/${botella.folio}`)
            .then(function(response)
            { 
                if(response.status === 200)
                {
                    if(response.data === false)
                    {
                        swal.fire({
                            position: 'top-end',
                            type: 'error',
                            title: 'La botella no esta registrada',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        temp.limpiarState();
                    }
                    else
                    { 
                        botella = response.data;
                        botella.error = 0;
                        temp.setState({ botella: botella });               
                    }
                }
            })
            .catch(error =>
            {   

            });
        }
    }

    eliminarEtiqueta()
    {
        swal({ 
            title: 'Cual es el motivo?', 
            input: 'text', 
            inputValidator: (value) => { return !value && 'Debes escribir una motivo' }
        })
        .then((result) => 
        {
            // api().post('/MovimientoNuevo',movimiento)
            // .then(function(response)
            // {
            //     error=2;
            //     if(response.status === 200)
            //     {
            //         if(response.data.registrado)
            //         {
            //             error = 1;
                         swal('La etiqueta se dio de baja','','success');
            //         }
            //         else
            //         {
            //             error = 0;
            //             swal('Movimiento rechazado','','error');
            //         }
            //         fin=1;
            //         temp.setState({ movimiento : movimiento, error : error, fin : fin });  
            //     }
            // })
            // .catch( error =>
            // {
            //     error=2;
            //     this.limpiarState();
                
            // });
        });
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
                                    <strong>Búsqueda Manual De Botellas</strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label>Folio:</label>
                                                <div className="input-group mb-3">
                                                    <input className="form-control" type="text" autoFocus placeholder="#" value = {botella.folio} name="folio" onChange = {this.handleInputChange} />
                                                    <div className="input-group-append">
                                                        <button class="btn btn-primary" type="button" id="botonBuscar" onClick={this.buscarFolio}> Buscar Folio </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Código de insumo:</label>
                                                <label className="form-control" type="text" name="insumo"> {botella.insumo} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Descripción:</label>
                                                <label className="form-control" type="text" name="desc_insumo"> {botella.desc_insumo} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha de compra:</label>
                                                <label className="form-control" type="date" name="fecha_compra"> {botella.fecha_compra} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Ubicación actual:</label>
                                                <label className="form-control" type="text" name="almacen_actual">
                                                    {
                                                        parseInt(botella.transito,10) === 1? "< En tránsito > salio de " : ""
                                                    }
                                                    {
                                                        parseInt(botella.transito,10) === 4? "< Vendido > en " : ""
                                                    }
                                                    {
                                                        parseInt(botella.transito,10) === 5? "< Dado de baja > en " : ""
                                                    }
                                                    {
                                                        parseInt(botella.transito,10) === 6? "< Traspasado > salio de " : ""
                                                    }
                                                    {
                                                        !botella.almacen?
                                                            ''
                                                        :
                                                            "< " + botella.almacen.nombre + " >"
                                                    }
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                {
                                                    (botella.error === 0) ?
                                                        <button className="btn btn-block btn-danger" type="button" id="botonEliminar" onClick={this.eliminarEtiqueta} > La etiqueta se encuentra dañada. <strong> QUIERO DESTRUIRLA. </strong> </button>
                                                    : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            { botella.error === 0 ? <VentanaDeMovimientos botella = {botella} /> : "" }
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
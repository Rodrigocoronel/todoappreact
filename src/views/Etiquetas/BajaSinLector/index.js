import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api, request_file} from '../../../actions/_request';
import swal from 'sweetalert2';

import {Card, CardHeader, CardBody, Col, Row} from 'reactstrap'

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
                        {
                            botella.transito == 5 &&
                            <th width='40%'> <center> Usuario </center> </th>
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    botella.mov.map((item, i) => 
                        <tr key = { i } >
                            <td width='10%'> <center> { i+1 } </center>  </td>
                            <td width='20%'> <center> { item.fecha } </center> </td>
                            <td width='20%'> <center> { <TipoDeMovimiento mov = {parseInt(item.movimiento_id,10)} motivo={botella.motivo} /> } </center> </td>
                            <td width='30%'> <center> { item.almacen_nombre } </center> </td>
                            {
                                item.movimiento_id == 5 &&
                                <td width="10%">
                                    <center> {botella.user_delete} </center>
                                </td>
                            }
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
                id : '',
                insumo : '',
                desc_insumo : '',
                fecha_compra : '',
                almacen_id : '',
                transito : '',
                mov : [],
                error : 1,
                fin : 0,
            },
            datos : {
                botella : '',
                motivo : '',
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

        if(botella.id !== '')
        {
            api().get(`/Botella/${botella.id}`)
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
        var { botella } = this.state;
        let temp = this;
        
        swal.queue([{
          title: 'Al eliminar la etiqueta se generara una nueva!<br/>Motivo de reimpresión:',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Eliminar!',
          showLoaderOnConfirm: true,
          inputValidator: (value) => {
            return !value && 'You need to write something!'
          },
          preConfirm: (login) => {

                let elData = {
                    botella : botella.id,
                    motivo : login
                }

                return api().post('/Eliminar', elData)
                .then(function(response)
                {
                    botella = response.data.botella;
                    temp.setState({botella : botella})

                    if(response.data.registrado){
                        return request_file().post(`descargar_new`,elData).then(response => 
                        {
                            const file = new Blob([response.data], {type: 'application/pdf'});
                            const fileURL = URL.createObjectURL(file);
                            window.open(fileURL);

                        }).catch(err=>console.log(err))
                    }else{
                        swal.insertQueueStep({ 
                            type: 'error',
                            title: 'Etiqueta dada de baja previamente'
                        });
                    }
                            
                })

          },
          allowOutsideClick: () => !swal.isLoading()
        }])

        // swal({ 
        //     title: 'Al eliminar la etiqueta se generara una nueva!<br/>Motivo de reimpresión:', 
        //     input: 'text', 
        //     inputValidator: (value) => { return !value && 'Debes escribir un motivo!' }
        // })
        // .then((result) => 
        // {
        //     let elData = {
        //         botella : botella.id,
        //         motivo : result.value
        //     }
           
        //     api().post('/Eliminar', elData)
        //     .then(function(response)
        //     {
        //         botella = response.data.botella;
        //         temp.setState({botella : botella})
        //         if(response.data.registrado){
        //             return request_file().post(`descargar_new`,elData).then(response => 
        //             {
        //                 const file = new Blob([response.data], {type: 'application/pdf'});
        //                 const fileURL = URL.createObjectURL(file);
        //                 window.open(fileURL);

        //             }).catch(err=>console.log(err))
        //         }else{
        //             swal('Etiqueta dada de baja previamente!','','error');
        //         }
                        
        //     })
        // })
        // .catch( error =>
        // {
        //     swal('Error consulte a wenatives!','','error');
        // });
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
        console.log(botella)
        return(
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <Row>
                        <Col xs="12" sm="12" lg="6">
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
                                                    <input className="form-control" type="text" autoFocus placeholder="#" value = {botella.id} name="id" onChange = {this.handleInputChange} />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-primary" type="button" id="botonBuscar" onClick={this.buscarFolio}> Buscar Folio </button>
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
                        </Col>
                        <div className="col-sm-12 col-lg-6">
                            {  <VentanaDeMovimientos botella = {botella} />}
                        </div>
                    </Row>
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
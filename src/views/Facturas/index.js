import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/dash.js';
import {api} from '../../actions/_request';
import swal from 'sweetalert2';

class Almacenes extends Component {

    constructor(props)
    {
        super(props)

        this.state={
            factura : {
                id : '',
                folio_factura : '',
                fecha_compra : '',
                comprador : '',
            },
             botella : {
                folio : '',
                insumo : '',
                desc_insumo : '',
            },
            almacen : {
                id : '',
                nombre : '',
                activo : '',
                descripcion : '',
            },
            error : 0,
            botellas : [],
            almacenes : [],
        }
        this.activarDesactivar = this.activarDesactivar.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount()
    {

    }

    activarDesactivar(event,btn)
    {
        event.preventDefault();
        var {almacenes, almacen} = this.state;
        let temp = this;
        almacen = almacenes[btn];
        api().post('/CambiarEstado',almacen)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data)
                {
                    if( parseInt(almacenes[btn].activo,10) === 0 )
                    {
                        almacenes[btn].activo = 1;
                        swal('Almacen activado','','success')
                    }
                    else
                    {
                        almacenes[btn].activo = 0;
                        swal('Almacen desactivado','','error')
                    }
                    temp.setState({ almacenes : almacenes });
                } 
            }
        })
        .catch(error =>
        {

        });

        this.setState({ almacenes : almacenes });
    }

    handleSubmit(evt)
    {

    }

    handleInputChange(event) 
    {
        // const value = event.target.value;
        // const name = event.target.name;
        // var {almacen} = this.state;

        // almacen[name] = value;
        // this.setState({ almacen : almacen });
    }

    render() {

        var { error } = this.state;
        let factura = this.state;

        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong>Factura</strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div class="form-group">
                                                <label for="controlDeArchivos">Archivo XML:</label>
                                                <input type="file" class="form-control-file" id="controlDeArchivos" />
                                            </div>
                                            <div className="form-group">
                                                <label>Código:</label>
                                                <input className="form-control" type="text" readOnly value={factura.folio} name="folio" />
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha:</label>
                                                <input className="form-control" type="text" readOnly value={factura.fecha} name="fecha" />
                                            </div>
                                            <div className="form-group">
                                                <label>Comprador:</label>
                                                <input className="form-control" type="text" readOnly value={factura.comprador} name="comprador" />
                                            </div>
                                            <div className="form-group">
                                            {
                                                error === 0 ? "" :
                                                error === 1 ? <button className="btn btn-block btn-outline-danger" type="button" disabled> <strong> No se guardaron los datos </strong> </button> :
                                                <button className="btn btn-block btn-outline-success" type="button" disabled> <strong> La información fue guardada correctamente </strong> </button>
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong> Articulos </strong>
                                </div>
                                <div className="card-body">
                                    <table className="table table-responsive-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th className="text-center" width="15%"> Cantidad </th>
                                                <th className="text-center" width="15%"> Código </th>
                                                <th className="text-center" width="60%"> Descripción </th>
                                                <th className="text-center" width="10%"> Imprimir </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                        //     almacen.almacenes.map((item, i) => 
                                        //         <tr key = { i } >
                                        //             <td className="text-center"> { item.id } </td>
                                        //             <td className="text-center"> {
                                        //                                             parseInt(item.activo,10) === 1 ?
                                        //                                             <div className="badge badge-success"> Activo </div> : 
                                        //                                             <div className="badge badge-secondary"> Inactivo </div>
                                        //                                           }
                                        //             </td>
                                        //             <td className="text-center"> { item.nombre } </td>
                                        //             <td> { item.descripcion } </td>
                                        //             <td className="text-center">
                                        //             {
                                        //                 parseInt(item.id,10) > 2 ?
                                        //                     parseInt(item.activo,10) === 1 ? 
                                        //                         <button className="btn btn-block btn-outline-danger active" type="button" aria-pressed="true" onClick={(e)=>this.activarDesactivar(e,i)} > <strong> Desactivar </strong> </button> :
                                        //                         <button className="btn btn-block btn-outline-success active" type="button" aria-pressed="true" onClick={(e)=>this.activarDesactivar(e,i)} > <strong> Activar </strong> </button> : ""
                                        //             }
                                        //             </td>
                                        //         </tr>
                                        //     )
                                        }
                                        </tbody>
                                    </table>  
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

export default connect(mapStateToProps, actions)(Almacenes)
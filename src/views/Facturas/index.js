import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/dash.js';
import { api } from '../../actions/_request';

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
                cantidad : '',
            },
            error : 1,
            botellas : [],
            archivo : null,
            impreso : 0,
        }
        this.limpiarState = this.limpiarState.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.imprimir = this.imprimir.bind(this);
        this.menos = this.menos.bind(this);
        this.mas = this.mas.bind(this);
    }

    imprimir()
    {
        console.log("printing");
    }

    menos(event,i)
    {

    }

    mas(event,i)
    {

    }

    handleFileInputChange(event) 
    {
        event.preventDefault();
        const target = event.target;
        var { error, archivo, factura, botellas, impreso } = this.state;
        let temp = this;
        var formData = new FormData();

        archivo = target.files[0];        
        formData.append('archivo',archivo);
        
        api().post('/CargarXml',formData)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(parseInt(response.data.error,10) === 0)
                {
                    error = response.data.error;
                    factura = response.data.factura;
                    botellas = response.data.articulos;
                    temp.setState({ error : error, archivo : archivo, factura : factura, botellas : botellas, impreso : impreso });
                }
                else
                {
                    this.limpiarState();
                    error = response.data.error;
                    temp.setState({ error : error });
                }

            }
        })
        .catch(error =>
        {
            this.limpiarState();
            error='1';
            temp.setState({ error : error });
        });
    }

    limpiarState()
    {
        this.setState({
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
                cantidad : '',
            },
            botellas : [],
            archivo : null,
            impreso : '',
        })
    }

    render() {

        var { error, factura, impreso } = this.state;
        let datos = this.state;

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
                                            <form id='elForm'>
                                                <div className="form-group">
                                                    <input type="file" required className="form-control-file" id="archivo" name="archivo[]" accept="text/xml" onChange={this.handleFileInputChange} />
                                                </div>
                                            </form>
                                            <div className="form-group">
                                                <label>Código:</label>
                                                <label className="form-control" type="text" name="folio_factura"> {factura.folio_factura} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha:</label>
                                                <label className="form-control" type="text" name="fecha_compra"> {factura.fecha_compra} </label>
                                            </div>
                                            <div className="form-group">
                                                <label>Comprador:</label>
                                                <label className="form-control" type="text" name="comprador"> {factura.comprador} </label>
                                            </div>
                                            <div className="form-group">
                                            {
                                                error === 0 ? <button className="btn btn-block btn-primary" type="button" onClick={this.imprimir}> La factura es correcta, quiero imprimir las etiquetas </button> : ""
                                            }
                                            {
                                                error === 2 ? <button className="btn btn-block btn-outline-danger" type="button" disabled> <strong> Archivo Incorrecto </strong> </button> : ""
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
                                                <th className="text-center" width="50%"> Descripción </th>
                                                <th className="text-center" width="20%"> Imprimir </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            datos.botellas.map((item, i) => 
                                                <tr key = { i } >
                                                    <td className="text-center"> { item.cantidad } </td>
                                                    <td className="text-center"> { item.insumo } </td>
                                                    <td className="text-center"> { item.desc_insumo } </td>
                                                    <td className="text-center">
                                                    <div className="btn-group" role="group" aria-label="Botones Cantidad">
                                                        {
                                                            (impreso === 0) ?
                                                                <button className="btn btn-secondary active" type="button" disabled aria-pressed="true"> <strong>   </strong> </button>
                                                            :
                                                                <button className="btn btn-secondary active" type="button" aria-pressed="true" onClick={(e)=>this.menos(e,i)} > <strong> - </strong> </button>
                                                        }
                                                        {
                                                            (impreso === 0) ?
                                                                <button className="btn btn-secondary active" type="button" disabled aria-pressed="true"> <strong> { item.cantidad } </strong> </button>
                                                            :
                                                                <button className="btn btn-secondary active" type="button" aria-pressed="true"> <strong> { item.cantidad } </strong> </button>
                                                        }
                                                        {
                                                            (impreso === 0) ?
                                                                <button className="btn btn-secondary active" type="button" disabled aria-pressed="true"> <strong>   </strong> </button>
                                                            :
                                                                <button className="btn btn-secondary active" type="button" aria-pressed="true" onClick={(e)=>this.mas(e,i)} > <strong> + </strong> </button>
                                                        }
                                                    </div>
                                                    </td>
                                                </tr>
                                            )
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
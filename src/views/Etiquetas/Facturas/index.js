import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import { api, request_file } from '../../../actions/_request';
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
                referencia : '',
                cantidad : '',
                max : '',
                producto_id : 0,
            },
            error : 1,
            botellas : [],
            noArticulos : '',
            archivo : null,
            impreso : 0,
            datos : {},
            productos : [],
        }
        this.limpiarState = this.limpiarState.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.imprimir = this.imprimir.bind(this);
        this.menos = this.menos.bind(this);
        this.mas = this.mas.bind(this);
    }

    componentWillMount()
    {
        var { productos } = this.state;
        let temp = this;

        api().get(`/Productos`)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data[0] != null)
                {
                    productos = response.data;
                    temp.setState({ productos : productos })
                }
            }
        });
    }

    imprimir()
    {
        var { factura, botellas, datos, noArticulos } = this.state;
        var estanTodosLlenos = true;
        datos.factura = factura;
        datos.botellas = botellas;
        console.log(botellas)
        if(noArticulos === 0)
        {
            swal('Debes imprimir al menos una etiqueta','','error');
        }
        else
        {
            botellas.forEach((value) => { 
                if(value.insumo === '') estanTodosLlenos = false; 
            });

            if(estanTodosLlenos)
            {
                api().post('/GenerarEtiquetas',datos)
                .then(function(response)
                {
                    swal('Imprimiendo','','success');

                    // Hacer algo para desactivar boton
					return request_file()
					.post(`/DescargarEtiquetas/${response.data}`);
						
                }).then(response => 
                {
                    const file = new Blob([response.data], {type: 'application/pdf'});
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }).catch(error =>
                {
                    swal('Algo Esta mal','','error');
                });
            }
            else
            {
                swal('Debes ingresar todos los codigos de insumo','','error');
            }
        }
    }

    menos(event,i)
    {
        var { botellas, noArticulos } = this.state;
        if( botellas[i].cantidad > 0 ) 
        {
            botellas[i].cantidad--;
            noArticulos--;
        }
        this.setState({ botellas : botellas, noArticulos : noArticulos });
    }

    mas(event,i)
    {
        var { botellas, noArticulos } = this.state;
        if( botellas[i].cantidad < botellas[i].max )
        {
            botellas[i].cantidad++;
            noArticulos++;
        }
        this.setState({ botellas : botellas, noArticulos : noArticulos });
    }

    handleFileInputChange(event) 
    {
        event.preventDefault();
        const target = event.target;
        var { error, archivo, factura, noArticulos, botellas, impreso } = this.state;
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
                    noArticulos = response.data.noArticulos;
                    impreso = response.data.impreso;
                    temp.setState({ error : error,
                                    archivo : archivo,
                                    factura : factura,
                                    noArticulos : noArticulos,
                                    botellas : botellas,
                                    impreso : impreso 
                                });
                    if(parseInt(impreso,10) === 1) swal('Ya se habian impreso las etiquetas de esta factura','');
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
            swal('Archivo Invalido','','error');
        });
    }

    handleInputChange(event,i)
    {
        const value = event.target.value;
        const name = event.target.name;
        var { botellas } = this.state;

        botellas[i][name] = value;
        this.setState({ botellas: botellas });
    }
    
    handleSelectChange(event,i)
    {
        let {productos} = this.state;
        const value = event.target.value;
        const index = event.target.selectedIndex;
        const texto = event.target.options[index].text;
        var { botellas } = this.state;

        botellas[i]['insumo'] = value;
        botellas[i]['desc_insumo'] = texto;
        botellas[i]['producto_id'] = productos[i]['id'];
        this.setState({ botellas : botellas });
    }

    handleKeyPress(event,i)
    {
        var { botellas } = this.state;
        let temp = this;

        if (event.key === 'Enter' )
        {
            api().get(`/Producto/${botellas[i].insumo}`)
            .then(function(response)
            { 
                if(response.status === 200)
                {
                    if(response.data === false)
                    {
                        botellas[i].insumo = '';
                        botellas[i].desc_insumo = '';
                        temp.setState({ botellas : botellas }); 
                    }
                    else
                    { 
                        botellas[i].insumo = response.data.insumo;
                        botellas[i].desc_insumo = response.data.desc_insumo;
                        temp.setState({ botellas : botellas });               
                    }
                }
            })
            .catch(error =>
            {   

            });
        }

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
                referencia : '',
                cantidad : '',
            },
            botellas : [],
            noArticulos : '',
            archivo : null,
            impreso : '',
        })
    }

    render() {

        var { error, factura, noArticulos, impreso, productos } = this.state;
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
                                                <label>Folio de factura:</label>
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
                                                error === 0 ? 
                                                    impreso === 0 ?
                                                        <button className="btn btn-block btn-primary" type="button" onClick={this.imprimir}> La factura es correcta, quiero imprimir las <strong> &nbsp; { noArticulos } &nbsp; </strong> etiquetas </button>
                                                    :
                                                        <button className="btn btn-block btn-primary" type="button" onClick={this.imprimir}> La factura es correcta, quiero <strong> &nbsp; REIMPRIMIR &nbsp; { noArticulos } &nbsp; </strong> etiquetas </button>
                                                : ""
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
                                        {
                                            datos.botellas.map((item, i) => 
                                               
                                                <tbody>
                                                    <tr key = { i } >
                                                        <td className="text-center" width="15%"> { item.max } </td>
                                                        <td className="text-center" width="15%">
                                                            {
                                                                item.insumo === null ? item.insumo = "" : ""
                                                            }
                                                            <input className="form-control" type="text" placeholder="#" value = {item.insumo} name="insumo" onKeyPress = {(e)=>this.handleKeyPress(e,i)} onChange = {(e)=>this.handleInputChange(e,i)} />
                                                        </td>
                                                        <td className="text-center" width="50%">
                                                        {
                                                            <select 
                                                                value = {item.insumo} 
                                                                className="form-control" 
                                                                name="desc_insumo" 
                                                                onChange = {(e)=>this.handleSelectChange(e,i)} >
                                                                <option value="0">  </option>
                                                                {
                                                                    productos.map((item2, j) => <option key={j} value={item2.insumo}> {item2.desc_insumo} </option> )
                                                                }
                                                            </select>
                                                        }
                                                        </td>
                                                        <td className="text-center" width="20%">
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
                                                    {
                                                        (impreso === 0) ?
                                                            <tr>
                                                                <td className="text-center">  </td>
                                                                <td className="text-center"> <i> REFERENCIA: </i> </td>
                                                                <td> <label className="form-control" type="text" name="referencia"> { item.referencia } </label> </td>
                                                                <td> </td>
                                                            </tr>
                                                        : ""
                                                    } 
                                                </tbody>                            
                                            )
                                        }
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
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import { api, request_file } from '../../../actions/_request';
import swal from 'sweetalert2';
import Select from 'react-select';

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
                rfc_proveedor : '',
            },
            error : 1,
            botellas : [],
            noArticulos : '',
            archivo : null,
            impreso : 0,
            datos : {},
            productos : [],
            impr : false,
            loadXmlF : false,
            facturaGuardada : false,
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

            if(response.data[0] != null)
            {
                productos = response.data;
                temp.setState({ productos : productos })
            }
            
        }).catch(err=>console.error(err))
    }

    guardarFactura=()=>{

        var { factura, botellas, datos, noArticulos } = this.state;
        var estanTodosLlenos = true;
        datos.factura = factura;
        let _self = this;

        _self.setState({impr : true});

        botellas.forEach((value) => { 

            if(value.insumo == '')
                estanTodosLlenos = false;
        });

        if(estanTodosLlenos)
        {

            datos.botellas = botellas;

            api().post('/guardar_factura',datos)
            .then(function(response)
            {
                if(response.data.error != false){
                    swal('Factura guardada!','','success'); 
                    factura.id = response.data.id;
                    _self.setState({ facturaGuardada : true, factura : factura }) 
                }
            })
            .catch(error =>
            {
                swal('Algo salio mal','','error');
                _self.setState({impr : false});
            });
        }
        else
        {
            swal('Debes ingresar todos los codigos de insumo','','error');
            _self.setState({impr : false});
        }
        

    }

    imprimir(evt,item,index)
    {
        evt.preventDefault();

        let _self = this;

        let {botellas} = this.state;

        _self.setState({impr : true});

        let {factura} = this.state;

        swal.queue([{
            title: 'Estas segur@?',
            text: `Se imprimiran ${item.cantidad} etiquetas de ${item.desc_insumo}`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Imprimir!',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                    let datos = {
                        factura : factura.id,
                        producto_id  : item.producto_id
                    }
                    return api().post('/GenerarEtiquetas',datos)
                    .then(function(response)
                    {   
                        return request_file()
                        .post(`/DescargarEtiquetas/${factura.id}/${item.insumo}/${item.producto_id}`);
                            
                    }).then(response => 
                    {

                        swal.insertQueueStep({ 
                            type: 'success',
                            title: 'Etiquetas generadas correctamente'
                        });

                        const file = new Blob([response.data], {type: 'application/pdf'});
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);

                        botellas[index].impreso = 1;

                        _self.setState({botellas: botellas})

                    }).catch(error =>
                    {
                        swal('Error consulte a wenatives!','','error');
                        _self.setState({impr : false});
                    })
                    
                },
                allowOutsideClick: () => !swal.isLoading() 
        }])
         
    
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
        
        let facturaGuardada = '';       

        if( target.files.length > 0 ){

            let temp = this;
            var formData = new FormData();

            archivo = target.files[0];

            formData.append('archivo',archivo);

            this.setState({loadXmlF : true})
            
            api().post('/CargarXml',formData)
            .then(function(response)
            {

                if(parseInt(response.data.error,10) == 0)
                {
                    error = response.data.error;
                    factura = response.data.factura;
                    botellas = response.data.articulos;
                    noArticulos = response.data.noArticulos;
                    impreso = response.data.impreso;
                    facturaGuardada = response.data.facturaGuardada;
                    
                    temp.setState({ 
                        error : error,
                        archivo : archivo,
                        factura : factura,
                        noArticulos : noArticulos,
                        botellas : botellas,
                        impreso : impreso,
                        loadXmlF : false,
                        impr : false,
                        facturaGuardada : facturaGuardada,
                    });

                    if(parseInt(impreso,10) == 1) swal('Ya se habian impreso las etiquetas de esta factura','');

                }
                else
                {
                    this.limpiarState();
                    error = response.data.error;
                    temp.setState({ error : error , loadXmlF : false, impr : false,});
                }

            })
            .catch(error =>
            {
                this.limpiarState();
                error='1';
                temp.setState({ error : error , loadXmlF : false, impr : false,});
                swal('Archivo Invalido','','error');

            });
        }
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
        // const value = event.target.value;
        // const index = event.target.selectedIndex;
        // const texto = event.target.options[index].text;
        var { botellas } = this.state;

        botellas[i]['insumoSelect'] = event;

        if(event != null){
            botellas[i]['insumo'] = event.value;
            botellas[i]['desc_insumo'] = event.label;
            botellas[i]['producto_id'] = event.id;
        }
        else{
            botellas[i]['insumo'] = '';
            botellas[i]['desc_insumo'] = '';
            botellas[i]['producto_id'] = '';
        }
        
        this.setState({ botellas : botellas });
    }

    handleKeyPress(event,i)
    {
        var { botellas } = this.state;
        let temp = this;

        if (event.key == 'Enter' && botellas[i].insumo != '')
        {
            api().get(`/Producto/${botellas[i].insumo}`)
            .then(function(response)
            { 

                if(response.data == false)
                {
                    botellas[i].insumo = '';
                    botellas[i].desc_insumo = '';
                    botellas[i].insumoSelect = null;
                    botellas[i].producto_id = 0;
                    temp.setState({ botellas : botellas }); 
                    swal('Codigo no encontrado!','','error');
                }
                else
                { 
                    botellas[i].insumo = response.data.value;
                    botellas[i].desc_insumo = response.data.label;
                    botellas[i].insumoSelect = response.data;
                    botellas[i].producto_id = response.data.id;
                    temp.setState({ botellas : botellas });               
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
            facturaGuardada : false,
        })
    }

    render() {

        var { error, factura, noArticulos, impreso, productos, impr , facturaGuardada, botellas} = this.state;
        let datos = this.state;
        console.log(facturaGuardada)
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
                                                    <input 
                                                        type="file" 
                                                        required 
                                                        className="form-control-file" 
                                                        id="archivo" 
                                                        name="archivo[]" 
                                                        accept="text/xml" 
                                                        onChange={this.handleFileInputChange} 
                                                    />
                                                    {
                                                        this.state.loadXmlF &&
                                                        <label>Examinando archivo</label>
                                                    }
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong> Articulos</strong>
                                </div>
                                <div className="card-body">
                                    <table className="table table-responsive-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th className="text-center" width="15%"> # insumo </th>
                                                <th className="text-center" width="35%"> Desc Insumo </th>
                                                {
                                                    !facturaGuardada &&
                                                    <th className="text-center" width=""> Referencia </th>
                                                }
                                                <th className="text-center" width="100"> Cantidad </th>
                                                {
                                                    facturaGuardada &&
                                                       <th>Imprimir</th> 
                                                }
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            botellas.map((item, i) => 
                                               
                                                
                                                    <tr key = { i } >
                                                        <td className="" width="">
                                                            <input 
                                                                className="form-control" 
                                                                type="text" 
                                                                placeholder="#" 
                                                                value = {item.insumo} 
                                                                name="insumo" 
                                                                onKeyPress = {(e)=>this.handleKeyPress(e,i)} 
                                                                onChange = {(e)=>this.handleInputChange(e,i)} 
                                                                disabled ={!facturaGuardada ? false : true }
                                                            />
                                                        </td>
                                                        <td>
                                                        {
                                                            <Select 
                                                                value = {item.insumoSelect} 
                                                                className="" 
                                                                name="insumoSelect" 
                                                                onChange = {(e)=>this.handleSelectChange(e,i)}
                                                                options = {productos}
                                                                isClearable={true}
                                                                isDisabled ={!facturaGuardada ? false : true }
                                                            >

                                                            </Select>
                                                        }
                                                        </td>
                                                        {
                                                            (!facturaGuardada) &&
                                                                <td>
                                                                    <label 
                                                                        className="form-control" 
                                                                        style={{'height':'100%'}} 
                                                                        type="text" 
                                                                        name="referencia"
                                                                    > 
                                                                        { item.referencia } 
                                                                    </label>
                                                                </td> 
                                                        }
                                                        <td>
                                                            <label className="form-control">{item.cantidad}</label>
                                                        </td>
                                                        {
                                                            ( item.impreso == 0 && facturaGuardada ) &&
                                                                <td>
                                                                    <button 
                                                                        className="btn btn-primary" 
                                                                        onClick={(e)=>this.imprimir(e,item,i)}>
                                                                        <i className="fa fa-print fa-lg"></i>
                                                                    </button>
                                                                </td>
                                                        }
                                                        {
                                                            (item.impreso == 1 && facturaGuardada) &&
                                                            <td>
                                                                <label className="form-control">Impreso</label>
                                                            </td> 
                                                        }
                                                    </tr>
                                                    
                                                                           
                                            )
                                        }
                                        </tbody> 
                                    </table>
                                </div>
                            </div>
                        </div>
                        {
                            (!facturaGuardada) &&
                                <div className="col-12 text-right mb-5">
                                    <button className="btn btn-primary" onClick={this.guardarFactura}>Guardar Factura</button>
                                </div>
                        }
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
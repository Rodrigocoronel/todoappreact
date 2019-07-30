import React, { Component } from 'react';
import ReactTable from 'react-table';
import TableStyle from 'react-table/react-table.css';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

const camposTablaPorArea = [
    {
        Header: 'No.',
        accessor: 'id',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 50,
        maxWidth: 100,
    },
    {
        Header: 'Cantidad',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 80,
        maxWidth: 100,
        Cell: (row) =>
        {
            return(
                <div className="text-center">                                     
                     1
                </div>
            )
        }
    },
    {
        Header: 'Código Insumo',
        accessor: 'insumo',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 80,
        maxWidth: 100,
    },
    {
        Header: 'Descripción',
        accessor: 'desc_insumo',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
    },
];

const camposTablaGeneral = [
    {
        Header: 'No.',
        accessor: 'id',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 50,
        maxWidth: 100,
    },
    {
        Header: 'Cantidad',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 80,
        maxWidth: 100,
        Cell: (row) =>
        {
            return(
                <div className="text-center">                                     
                     1
                </div>
            )
        }
    },
    {
        Header: 'Código Insumo',
        accessor: 'insumo',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 80,
        maxWidth: 100,
    },
    {
        Header: 'Descripción',
        accessor: 'desc_insumo',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
    },
    {
        Header: 'Area',
        accessor: 'almacen_id',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 200,
        maxWidth: 250,
    },
];

const MostrarTabla = ({Registros,cols}) =>
(
    <div style = {{ 'textAlign': 'center'}}>
        <ReactTable  
            pageSize={20}
            data={Registros}
            columns={cols}
            showPagination={true}
        />
    </div>
)

class Inventario extends Component 
{
    constructor(props){
        super(props)

        this.state={
            busqueda : {
                almacen : "0",
            },
            registros : [],
            agrupados : [],
            desagrupados : [],
            almacenes : [],
            mostrar : '0',
            desglosar : true,
            cols : '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.mostrarRegistrosDesglosados = this.mostrarRegistrosDesglosados.bind(this);
    }

    componentDidMount()
    {
        var { almacenes, busqueda } = this.state;
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
        this.props.auth.user.area === -3 ? busqueda.almacen = '0' : busqueda.almacen = this.props.auth.user.area;
        this.setState({busqueda : busqueda});
    }

    handleInputChange(event) 
    {
        const value = event.target.value;
        const name = event.target.name;

        var {busqueda} = this.state;
        busqueda[name] = value;
        this.setState({ busqueda: busqueda });
    }

    handleSubmit(event)
    {
        event.preventDefault();
        var {busqueda, registros, agrupados, desagrupados, desglosar, cols, mostrar} = this.state;
        let temp = this;

        if(busqueda.almacen!=='0')
        {
            api().get(`/Inventario/${busqueda.almacen}`)
            .then(function(response)
            {
                if(response.status === 200)
                {
                    mostrar = busqueda.almacen;
                    registros = response.data;
                    if(busqueda.almacen === '9999')
                        cols=camposTablaGeneral;
                    else 
                        cols=camposTablaPorArea;
                    if(response.data[0] === null)
                    {
                        swal.fire({
                            position: 'top-end',
                            type: 'error',
                            title: 'No existen botellas en esa area',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        mostrar = '0';
                    }
                    else
                    {
                        desagrupados = registros;
                        // agrupados = registros;
                        
                        agrupados = registros.filter(registro => registro.insumo === '100111');
                        console.log(agrupados);

                        if (desglosar === true) 
                            registros = desagrupados;
                        else
                            registros = agrupados;
                    }
                    temp.setState({ registros : registros, agrupados : agrupados, desagrupados : desagrupados, cols : cols, mostrar : mostrar })
                }
            })
            .catch(error =>
            {
                
            });
        }
    }

    mostrarRegistrosDesglosados()
    {
        var { desglosar, registros, agrupados, desagrupados } = this.state;
        if(desglosar ===  true)     // Si ya estan desglosados los registros
        {
            desglosar = false;      // mostrarlos agrupados
            registros = agrupados;
        }
        else
        {
            desglosar = true;       // sino mostrarlos desglosados
            registros = desagrupados;
        }
        this.setState({ desglosar: desglosar, registros : registros });
    }
                
    render()
    {
        let { almacenes, busqueda, registros, mostrar, cols, desglosar } = this.state;
        return(
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <form>
                                        <div className="form-inline">
                                            <div className="form-group mt-2 mb-1 mr-3">
                                                <strong>Reporte De Inventario</strong>
                                            </div>
                                            <div className="form-group mt-2 mb-1 mr-3">
                                                {
                                                    <select value={busqueda.almacen} className="form-control" id="almacen" name="almacen" onChange={this.handleInputChange}>
                                                        <option value='0'> Selecciona un almacen... </option>
                                                        {
                                                            almacenes.map((item, i) =>
                                                                parseInt(item.activo,10) === 1 ?
                                                                    this.props.auth.user.area === -3 ? <option key={i} value={item.id} > {item.nombre} </option>  :
                                                                    this.props.auth.user.area === item.id ? <option key={i} value={item.id} > {item.nombre} </option>  : ""
                                                                : ""
                                                            )
                                                        }
                                                        <option value='9999'> Todas las areas </option>
                                                    </select>
                                                }
                                            </div>
                                            <div className="form-group mt-2 mb-1 mr-5">
                                                <button className="btn btn-block btn-primary pl-3 pr-3" type="button" onClick={this.handleSubmit} > Buscar </button>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="d-inline-flex mt-2">
                                    <label>  <i>Desglosar Inventario</i> </label>
                                        <label className="ml-2 switch switch-label switch-pill switch-primary">
                                        <input type="checkbox" className="switch-input" checked={desglosar} onChange={this.mostrarRegistrosDesglosados}/>
                                        <span className="switch-slider" data-checked="&#x2713;" data-unchecked="&#x2715;"></span>
                                    </label>
                                    </div>
                                </div>
                                <div className="card-body">
                                {
                                    mostrar === '0' ? "" : <MostrarTabla Registros = {registros} cols={cols} />
                                }
                                </div>
                            </div>
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

export default connect(mapStateToProps, actions)(Inventario)
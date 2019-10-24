import React, { Component } from 'react';
import ReactTable from 'react-table';
import TableStyle from 'react-table/react-table.css';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api,API_URL} from '../../../actions/_request';
import _ from "lodash";

const camposTablaNoDesglosado = [
    
    {
        Header: 'Cantidad',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 80,
        maxWidth: 100,
        accessor: 'cantidad',
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

const camposTablaDesglosado = [
    {
        Header: 'Folio',
        accessor: 'id',
        headerStyle: { whiteSpace: 'unset' },
        style: {whiteSpace: 'unset'},
        minWidth: 50,
        maxWidth: 100,
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


const requestData = (pageSize, page, sorted, filtered,almacen,desglosar) => {    
    return new Promise((resolve, reject) => {
        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData ;
        var take= pageSize;
        var skip=pageSize * page;
        var total=1;  
        console.log('entro a la busqueda')

        api().get(`/Inventario/${almacen}?take=${take}&skip=${skip}&desglosar=${desglosar}`)
        .then(function(response)
        {
           
              
             
                if(response.status === 200)
                {
                  filteredData= response.data.botellas;
                  total= response.data.total;  
                  console.log('data----->',response.data)
                  // You can also use the sorting in your request, but again, you are responsible for applying it.
                  const sortedData = _.orderBy(
                    filteredData,
                    sorted.map(sort => {
                      return row => {
                        if (row[sort.id] === null || row[sort.id] === undefined) {
                          return -Infinity;
                        }
                        return typeof row[sort.id] === "string"
                        ? row[sort.id].toLowerCase()
                        : row[sort.id];
                      };
                    }),
                    sorted.map(d => (d.desc ? "desc" : "asc"))
                  );
                  const res = {
                    rows: sortedData,
                    pages: Math.ceil(total / pageSize)
                  };
                  // Here we'll simulate a server response with 500ms of delay.
                  //setTimeout(() => resolve(res), 1000);
                  //console.log(res);
                  resolve(res)
                }
               
            
        });
    });
};


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
            cols : camposTablaNoDesglosado,
            data: [],
            pages: null,
            loading: true
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.mostrarRegistrosDesglosados = this.mostrarRegistrosDesglosados.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.pdf = this.pdf.bind(this);
    }
    pdf(event){
        var {busqueda, desglosar} = this.state;
        if(busqueda.almacen!=='0')
        {
            var x=desglosar===true?1:0;
           window.open(API_URL+"/PdfInventario/"+busqueda.almacen+'/'+x, '_blank');
            
        }
    }

    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        this.setState({ loading: true });
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        requestData(
          state.pageSize,
          state.page,
          state.sorted,
          state.filtered,
          this.state.busqueda.almacen,
          this.state.desglosar===true?1:0,
        ).then(res => {
          // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
          console.log('res-----',res)
          this.setState({
            registros: res.rows,
            pages: res.pages,
            loading: false
          });
        });
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
        this.setState({ busqueda: busqueda, mostrar:'0' });
    }

    handleSubmit(event)
    {
        event.preventDefault();
        var {busqueda, desglosar, cols, mostrar} = this.state;
        let temp = this;

        if(busqueda.almacen!=='0')
        {
            mostrar = busqueda.almacen;
            if(desglosar ===  true)
                cols=camposTablaDesglosado;
            else 
                cols=camposTablaNoDesglosado;

            temp.setState({  cols : cols, mostrar : mostrar });
        }
    }

    mostrarRegistrosDesglosados()
    {
        var { desglosar } = this.state;
        if(desglosar ===  true)     // Si ya estan desglosados los registros
        {
            desglosar = false;      // mostrarlos agrupados
        }
        else
        {
            desglosar = true;       // sino mostrarlos desglosados
        }
        this.setState({ desglosar: desglosar, mostrar : '0' });
    }
                
    render()
    {
        let { almacenes, busqueda, registros, mostrar, cols, desglosar,pages,loading } = this.state;
        console.log('state-->',this.state)
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
                                                        {
                                                            this.props.auth.user.area === -3 ? <option value='9999'> Todas las areas </option> : ""
                                                        }
                                                    </select>
                                                }
                                            </div>
                                            <div className="form-group mt-2 mb-1 mr-4">
                                                <button className="btn btn-block btn-primary pl-3 pr-3" type="button" onClick={this.handleSubmit} > Buscar </button>
                                            </div>
                                            <div className="form-group mt-2 mb-1">
                                                <button className="btn btn-block btn-primary pl-3 pr-3" type="button" onClick={this.pdf} > <i className="icons font-2xl d-block cui-print"></i> </button>
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
                                    mostrar === '0' ? "" :
                                    <div style = {{ 'textAlign': 'center'}}>
                                        <ReactTable  
                                            defaultPageSize={20} 
                                            
                                            data={registros}
                                            columns={cols}
                                            
                                            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                                            pages={pages} // Display the total number of pages
                                            loading={loading} // Display the loading overlay when we need it
                                            onFetchData={_.debounce(this.fetchData, 500)} // Request new data when things change
                                        />
                                    </div>
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
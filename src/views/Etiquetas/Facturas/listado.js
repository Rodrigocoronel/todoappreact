import React from 'react';
import ReactTable from 'react-table';
import TableStyle from 'react-table/react-table.css';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api,API_URL, request_file} from '../../../actions/_request';
import _ from "lodash";

import {Container, Card, CardHeader, CardBody, Row, Col, Button , Input} from 'reactstrap';

import swal from 'sweetalert2';

import Moment from 'moment';

const columns = [
    
    {
        Header: 'Folio factura',
        accessor: 'folio_factura',
    },
    {
        Header: 'Proveedor',
        accessor: 'proveedor',
    },
    {
        Header: 'RFC',
        accessor: 'rfc_proveedor',
    },
    {
    	Header: 'Fecha Compra',
    	accessor : 'fecha_compra'
    }
];

class BasicTable extends React.Component{

	constructor(props){
		super(props);
		this.state={
			data : [],
			cargando : true,
		}
	}

	componentDidMount(){
		let _self = this;
		api().get(`/factura_insumos/${this.props.data}`)
		.then((res)=>{
			_self.setState({data:res.data, cargando : false})
		})
	}

	imprimir(evt,item,index)
    {
        evt.preventDefault();

        let _self = this;

        let {data} = this.state;

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
                        factura : _self.props.data,
                        producto_id  : item.producto_id
                    }
                    return api().post('/GenerarEtiquetas',datos)
                    .then(function(response)
                    {   
                        return request_file()
                        .post(`/DescargarEtiquetas/${_self.props.data}/${item.insumo}/${item.producto_id}`);
                            
                    }).then(response => 
                    {

                        swal.insertQueueStep({ 
                            type: 'success',
                            title: 'Etiquetas generadas correctamente'
                        });

                        const file = new Blob([response.data], {type: 'application/pdf'});
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);

                        data[index].impreso = 1;
                        data[index].fecha_impreso = Moment().format('Y-MM-DD H:mm:ss');

                        _self.setState({data: data})

                    }).catch(error =>
                    {
                        swal('Error consulte a wenatives!','','error');
                        _self.setState({impr : false});
                    })
                    
                },
                allowOutsideClick: () => !swal.isLoading() 
        }])
       
    }

	render(){
		let{data,cargando}=this.state;
		return(
			<div>
			{		
				!cargando &&
				    <table className="table" style={{width : '50%',}}>
				        <thead>
				            <tr>
				                <th >Insumo</th>
				                <th >Descripcion</th>
				                <th>Cantidad</th>
				                <th>impreso</th>
				            </tr>
				        </thead>
				        <tbody>
				            {data.map((item, i) => <tr key={i}>
				            	<td>{item.insumo}</td>
				            	<td>{item.desc_insumo}</td>
				            	<td>{item.cantidad}</td>
				            	<td>
					            	{
					            		item.impreso == 1 ?
					            			item.fecha_impreso
					            		: 
					            		<Button 
					            			color="success" 
                                            onClick={(e)=>this.imprimir(e,item,i)}
                                        >

					            			Imprimir <i className="icon-printer icons font-2xl d-block"></i>
					            		</Button>
					            	}
				            	</td>
				            </tr>)}
				        </tbody>
				    </table>
			}
			</div>
	    )
	}
}

const requestData = (pageSize, page, sorted, filtered,fecha1,fecha2) => {

	return new Promise((resolve, reject) => {

		// You can retrieve your data however you want, in this case, we will just use some local data.
		let filteredData;

		var folio_factura = '';
		var proveedor = '';
		var rfc = '';
		var fecha_compra = '';

		var take = pageSize;
		var skip = pageSize * page;
		var total = 1;

		for (var i = filtered.length - 1; i >= 0; i--) {
			switch (filtered[i].id) {
				case "folio_factura":
					folio_factura = filtered[i].value;
					//console.log('fecha--->', filtered[i].value);
					break;
				case "rfc":
					rfc = filtered[i].value;
					//console.log('cliente--->', filtered[i].value);
					break;
				case "fecha_compra":
					fecha_compra = filtered[i].value;
					//console.log('clave--->', filtered[i].value);
					break;
				case "proveedor":
					proveedor = filtered[i].value;
			}
		}

		api().get(`/facturas?folio_factura=${folio_factura}&rfc=${rfc}&proveedor=${proveedor}&proveedor=${proveedor}&fecha_compra=${fecha_compra}&take=${take}&skip=${skip}&fecha1=${fecha1}&fecha2=${fecha2}`)
		.then(function (response) {
				filteredData = response.data.datos;
				total = response.data.total;

				const res = {
					rows: filteredData,
					pages: Math.ceil(total / pageSize)
				};

				resolve(res)
		});
	});
};




export default class Facturas extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			data : [],
			loading : false,
			pages : 0,
            fecha1 : '',
            fecha2 : '',
		}

		this.fetchData = this.fetchData.bind(this);
        this.table = React.createRef();
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
          this.state.fecha1,
          this.state.fecha2,
        ).then(res => {
          // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
          this.setState({
            data: res.rows,
            pages: res.pages,
            loading: false
          });
        });
    }

    handleInputChange=(event)=>
    {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value }, () => {
           this.fetchData(this.table.current.state)
        });
    }

    descargar=()=>{
        let {fecha1,fecha2} = this.state;
        if(fecha1 != '')
            window.open(API_URL+`/reporte_impresas/${fecha1}?fecha2=${fecha2}`, '_blank');
        else{
            swal('Seleccione una fecha de inicio!','','error');
        }
    }


    render(){

    	let { data, pages, loading , fecha1 , fecha2} = this.state;

    	let cols = columns;

    	return(
    		<Container>
    			<Card>
    				<CardHeader>
                        <Row>
                            <Col xs="12 mb-3">
                                Facturas
                            </Col>
                            <Col xs="12">
                                <Row>
                                    <Col xs="4" sm="4">
                                        <div className="form-group">
                                            <label>Fecha inicio</label>
                                            <Input 
                                                name="fecha1"
                                                value={fecha1}
                                                onChange={this.handleInputChange}
                                                type="date"
                                            />
                                        </div>
                                    </Col>
                                    <Col xs="4" sm="4">
                                        <div className="form-group">
                                            <label>Fecha Fin</label>
                                            <Input 
                                                name="fecha2"
                                                value={fecha2}
                                                onChange={this.handleInputChange}
                                                type="date"
                                            />
                                        </div>
                                    </Col>

                                    <Col xs="4 align-self-end" sm="4">

                                        <div className="form-group">
                                            <label></label>
                                            <Button onClick={this.descargar}>
                                            Descargar
                                        </Button>
                                        </div>
                                        
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardHeader>
    				<CardBody>
    					<Row>
    						<Col xs="12">
                                <ReactTable  
                                    defaultPageSize={20} 
                                    
                                    data={data}
                                    columns={cols}
                                    filterable={true}
                                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                                    pages={pages} // Display the total number of pages
                                    loading={loading} // Display the loading overlay when we need it
                                    onFetchData={_.debounce(this.fetchData, 500)} // Request new data when things change
                                    SubComponent={ row => {
								      	return (
								        	<div style={{ padding: "20px" }}>
								              { <BasicTable data={row.original.id} />}
								            </div>
								        );
								     }}

                                    ref={this.table}
                                />
    						</Col>
    					</Row>
    				</CardBody>
    			</Card>

    		</Container>
    	)
    }


}
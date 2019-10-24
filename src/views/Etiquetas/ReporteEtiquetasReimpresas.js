import React from 'react';
import ReactTable from 'react-table';
import TableStyle from 'react-table/react-table.css';
import { connect } from 'react-redux';
import * as actions from '../../actions/dash.js';
import {api,API_URL, request_file} from '../../actions/_request';
import _ from "lodash";

import {Container, Card, CardHeader, CardBody, Row, Col, Button, Input} from 'reactstrap';

import swal from 'sweetalert2';

import Moment from 'moment';

const columns = [
    
    {
        Header: 'Descripcion de insumo',
        accessor: 'desc_insumo',
    },
    {
        Header: 'Folio Eliminado',
        accessor: 'destruida_id',
    },
    {
        Header: 'Nuevo Folio',
        accessor: 'nueva_id',
    },
    {
    	Header: 'Fecha',
    	accessor : 'fecha'
    },{
        Header : 'Usuario',
        accessor : 'usuario'
    }
];

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

		api().get(`/etiquetas_eliminadas?fecha1=${fecha1}&fecha2=${fecha2}&take=${take}&skip=${skip}`)
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
          this.state.fecha2
        ).then(res => {
          // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
          this.setState({
            data: res.rows,
            pages: res.pages,
            loading: false
          });
        });
    }

    handleInput=(event)=>
    {
        const value = event.target.value;
        const name = event.target.name;;

        this.setState({
            [name] : value
        }, () => {
           this.fetchData(this.table.current.state)
        });
    }

    generar=()=>{
        let {fecha1,fecha2} = this.state;
        return request_file()
            .get(`/reporteEtiquetasEliminadas?fecha1=${fecha1}&fecha2=${fecha2}`)
            .then(response => 
            {

                const file = new Blob([response.data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);

            })
            .catch(err => console.log(err))
    }


    render(){

    	let { data, pages, loading } = this.state;

    	let cols = columns;

        let {fecha1,fecha2} = this.state;
        console.log(this.state)
    	return(
    		<Container>
    			<Card>
    				<CardHeader>Facturas</CardHeader>
    				<CardBody>
    					<Row>
                            <Col xs="6">
                                <label>Fecha Inicio</label>
                                <Input type="date" name="fecha1" onChange={this.handleInput} value={fecha1}/>
                            </Col>
                            <Col xs="6">
                                <label>Fecha Fin</label>
                                <Input type="date" name="fecha2" onChange={this.handleInput} value={fecha2}/>
                            </Col>
                            <Col xs="6">
                                <Button className="btn btn-primary mt-3" 
                                    onClick={this.generar}>
                                    <i className="fa fa-print fa-lg"></i>
                                </Button>
                            </Col>
    						<Col xs="12 mt-5">
                                <ReactTable  
                                    defaultPageSize={20} 
                                    
                                    data={data}
                                    columns={cols}
                                    filterable={false}
                                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                                    pages={pages} // Display the total number of pages
                                    loading={loading} // Display the loading overlay when we need it
                                    onFetchData={_.debounce(this.fetchData, 500)} // Request new data when things change
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
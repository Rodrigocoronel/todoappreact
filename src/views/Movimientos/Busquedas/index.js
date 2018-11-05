import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
//import {api} from '../../../actions/_request';

const ReporteVacio = () =>
(
	<div className="col-sm-12">
		<div className="card">
        	<div className="card-header">
            	<strong> Error!!! </strong>
	        </div>
    	    <div className="card-body">
        	    <div className="alert alert-warning" role="alert">
            	    <strong> No se encontraron movimientos durante el periodo </strong>
            	</div>
        	</div>
    	</div>
    </div>
)

const Reporte = () =>
(
	<div className="col-sm-12">
		<div className="card">
			<div className="card-header">
				<i className="fa fa-align-justify"></i> <strong> Reporte de movimientos </strong>
			</div>
			<div className="card-body">
				<table className="table table-responsive-sm table-striped">
					<thead>
						<tr>
							<th>Fecha</th>
							<th>Movimiento</th>
							<th>Producto</th>
							<th>Usuario</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>        
					</tbody>
				</table>
			</div>
		</div>
	</div>
)

class Reportes extends Component {

	constructor(props){
		super(props)

		this.state={
			movimiento : {
				folio : '',
				botella_id : '',
				movimiento_id : '',
				almacen_id : '',
				fecha : '',
				user : ''
			}
	  	}
	  	this.handleInputChange = this.handleInputChange.bind(this);
	  	this.handleSubmit = this.handleSubmit.bind(this);
  	}

	handleInputChange(event) {
 
		const target = event.target;
		const value = target.value;
		const name = target.name;

		var {movimiento} = this.state;
		movimiento[name] = value;
	  
		this.setState({
			movimiento: movimiento
		});
  	}
	
	handleSubmit(evt){
		evt.preventDefault();
	  	var {movimiento} = this.state;

	  	if(!movimiento.fecha) console.log("faltan datos");
	}

 	render() {
	
		let{movimiento} = this.state;
	
	  	return (
			<div className="container-fluid">
				<div className="animated fadeIn">
					<div className="row">
						<div className="col-sm-12">
							<div className="card">
								<div className="card-header">
									<strong>Consulta De Movimientos</strong>
								</div>
								<div className="card-body">
									<div className="row">
										<div className="col-lg-3 col-sm-6">
											<div className="form-group">
												<label>Fecha inicial:</label>
												 <input className="form-control" autoFocus type="date"  readOnly value = {movimiento.fecha} name="fecha_compra" onChange = {this.handleInputChange} />
											</div>
										</div>
										<div className="col-lg-3 col-sm-6">
											<div className="form-group">
												<label>Fecha final:</label>
												<input className="form-control" type="date"  readOnly value = {movimiento.fecha} name="fecha_compra" onChange = {this.handleInputChange} />
											</div>
										</div>
										<div className="col-lg-3 col-sm-6">
											<div className="form-group">
                                            	<label >Almacén:</label>
                                            	<select className="form-control" id="select1" name="select1">
                                                	<option value="0">Selecciona un almacén...</option>
                                                	<option value="1">1</option>
                                                	<option value="2">2</option>
                                                	<option value="3">3</option>
                                                	<option value="4">4</option>
                                                	<option value="5">5</option>
                                            	</select>
                                        	</div>
										</div>
										<div className="col-lg-3 col-sm-6">
											<div className="form-group">
                                            	<label >Movimiento:</label>
                                            	<select className="form-control" id="select1" name="select1">
                                                	<option value="0">Selecciona un movimiento...</option>
                                                	<option value="1">Entrada</option>
	                                                <option value="2">Salida</option>
	                                                <option value="3">Cancelación</option>
                                            	</select>
                                       		</div>
                                       	</div>
									</div>
									<div className="row">
										<div className="col-sm-12 col-lg-3">
											<button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} > Buscar </button>
										</div>
										<div className="col-sm-12 col-lg-3">
											<button className="btn btn-block btn-outline-warning" type="button" disabled=""> <strong> Se debe indicar una fecha </strong> </button>	
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						{ <Reporte /> }
					</div>
					<div className="row">
						{ <ReporteVacio /> }
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

export default connect(mapStateToProps, actions)(Reportes)
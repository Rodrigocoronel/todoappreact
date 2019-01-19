import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

const MensajeDeError = (props) => 
( 
	<div> <button className="btn btn-block btn-outline-danger" type="button" disabled> <strong> {props.mens} </strong> </button> </div>
)

const TipoDeMovimiento = ({mov}) =>
(
    <div>
    {
        mov === 1 ? <div className="badge badge-success">   Entrada   </div> :
        mov === 2 ? <div className="badge badge-warning">   Salida    </div> :
        mov === 3 ? <div className="badge badge-danger"> Cancenlación </div> :
        mov === 4 ? <div className="badge badge-secondary"> Venta     </div> :
        mov === 5 ? <div className="badge badge-danger">    Baja      </div> :
                    <div className="badge badge-warning">   Traspaso  </div>
     } 
    </div>
)

const ReporteVacio = () =>
(	<div className="card">
		<div className="card-header">
			<strong> Error!!! </strong>
		</div>
		<div className="card-body">
			<div className="alert alert-warning" role="alert">
				<strong> No se encontraron movimientos durante el periodo </strong>
			</div>
		</div>
	</div>
)

const Reporte = ({movimientos}) =>
(
	<table className="table table-responsive-sm table-striped table-bordered table-sm">
		<thead>
			<tr>
				<th width="8%">  <center> No.        </center> </th>
				<th width="15%"> <center> Fecha      </center> </th>
				<th width="10%"> <center> Movimiento </center> </th>
				<th width="12%"> <center> Codigo     </center> </th>
				<th width="40%"> <center> Producto   </center> </th>
				<th width="15%"> <center> Almacen    </center> </th>
			</tr>
		</thead>
		<tbody>
		{
			movimientos.map((item, i) => 
				<tr key = { i } >
					<td> <center> { i+1 }             </center> </td>
					<td> <center> { item.fecha }      </center> </td>
					<td> <center> { <TipoDeMovimiento mov = {parseInt(item.movimiento_id,10)} /> } </center> </td>
					<td> <center> { item.botella_id } </center> </td>
					<td>		  { item.botella_desc }           </td>
					<td> <center> { item.almacen_id } </center> </td>
				</tr>
			)
		}
		</tbody>
	</table>
)

class Reportes extends Component {

	constructor(props){
		super(props)

		this.state={
			movimiento : {
				folio : '',
				botella_id : '',
				movimiento_id : '',
				motivo : '',
				almacen_id : '',
				fecha : '',
				user : ''
			},
			busqueda : {
				fechaInicial : '',
				fechaFinal : '',
				almacen : "0",
				movimiento : "0",
				error : 0,
			},
			estado : 0,
			almacenes : [],
			movimientos : [],
	  	}
	  	this.handleInputChange = this.handleInputChange.bind(this);
	  	this.handleSubmit = this.handleSubmit.bind(this);
	  	this.imprimirReporte = this.imprimirReporte.bind(this);
  	}

    componentDidMount()
    {
        var {almacenes, busqueda} = this.state;
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
		var {busqueda, estado, movimientos} = this.state;
		let temp = this;

		if(busqueda.fechaInicial) // Si hay fecha inicial
			if(busqueda.fechaFinal) // Si hay fecha final
				if( busqueda.fechaFinal > busqueda.fechaInicial ) // Si la fecha final es mas grande que la inicia;
					busqueda.error=1; //Segunda fecha mas grande - OK
				else
					busqueda.error=3; // Si la segunda fecha es mas chica - ERROR 3
			else
				busqueda.error=1; // Si no hay fecha final - OK
		else
			busqueda.error=2; // Si no hay fecha inicial - ERROR 2

		if(busqueda.error === 1) // Si todo salió bien
		{
			// Hacer consulta
			var cadena = `/ReporteDeMovimientos?fechaInicial=${busqueda.fechaInicial}`;
			if(busqueda.fechaFinal !== '')  cadena = cadena + `&fechaFinal=${busqueda.fechaFinal}`;
			console.log(cadena);
			if(busqueda.almacen !== '0')    cadena = cadena + `&almacen=${busqueda.almacen}`;
						console.log(cadena);
			if(busqueda.movimiento !== '0') cadena = cadena + `&movimiento=${busqueda.movimiento}`;
					console.log(cadena);
			api().get(cadena)
			.then(function(response)
			{
				if(response.status === 200)
				{
					if(response.data[0] != null)
					{
						estado = 1;
						movimientos = response.data;
						temp.setState({ movimientos : movimientos, estado : estado })
					}
					else
					{
						// No hay registros
						estado=2;
						temp.setState({ estado : estado })
					}
				}
			})
			.catch(error =>
			{
				
			});
			this.setState({ busqueda : busqueda, estado : estado });
		}
		else
		{
			estado = 0;
			this.setState({ busqueda : busqueda, estado : estado });
		}
	}

	imprimirReporte()
	{
		//let {movimientos} = this.state;
		//console.log(movimientos)
		swal({ title:'Presiona Ctrl-P para imprimir', showConfirmButton: false, timer: 2500 });
	}

 	render() {
	
		let{almacenes, estado, busqueda, movimientos} = this.state;
	
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
												<label> Fecha específica o inicial: </label>
												 <input className="form-control" autoFocus type="date" value = {busqueda.fechaInicial} name="fechaInicial" onChange = {this.handleInputChange} />
											</div>
										</div>
										<div className="col-lg-3 col-sm-6">
											<div className="form-group">
												<label> Fecha final: </label>
												<input className="form-control" type="date" value = {busqueda.fechaFinal} name="fechaFinal" onChange = {this.handleInputChange} />
											</div>
										</div>
										<div className="col-lg-3 col-sm-6">
											<div className="form-group">
                                            	<label> Almacén: </label>
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
                                                </select>
                                        	</div>
										</div>
										<div className="col-lg-3 col-sm-6">
											<div className="form-group">
                                            	<label> Movimiento: </label>
                                            	<select value={busqueda.movimiento} className="form-control" id="movimiento" name="movimiento" onChange={this.handleInputChange}>
                                                	<option value="0"> Selecciona un movimiento...</option>
                                                	<option value="1"> Entrada     </option>
	                                                <option value="2"> Salida      </option>
	                                                <option value="3"> Cancelación </option>
	                                                <option value="4"> Venta       </option>
	                                                <option value="5"> Baja        </option>
	                                                <option value="6"> Traspaso    </option>
                                            	</select>
                                       		</div>
                                       	</div>
										<div className="col-sm-12 col-lg-3">
											<div className="form-group">
												<button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} > Buscar </button>
											</div>
										</div>
										<div className="col-sm-12 col-lg-3">
											<div className="form-group">
												{ 
													busqueda.error === 2 ? <MensajeDeError mens = {"Se debe indicar una fecha"} /> : 
													busqueda.error === 3 ? <MensajeDeError mens = {"La fecha final debe ser mayor"} /> : ""
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
						{
							estado === 1 ? 
								<div className="card">
									<div className="card-header">
										<i className="fa fa-align-justify"> </i> <strong> Reporte de movimientos </strong>
										<button className="btn btn-primary" type="button" onClick={this.imprimirReporte} > 
											<i className="icons font-2xl d-block cui-print"></i>
										</button>
									</div>
									<div className="card-body">
										{ <Reporte movimientos = {movimientos} /> }
									</div>
								</div>
							: estado === 2 ? <ReporteVacio /> : "" 
						}
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

export default connect(mapStateToProps, actions)(Reportes)
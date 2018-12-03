import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
//import swal from 'sweetalert2';

const VentanaDeMensaje = (props) => 
(
	<div className="card">
		<div className="card-header">
			<strong> {props.tipo} </strong>
		</div>
		<div className="card-body">
			<div className={props.estilo} role="alert">
				<strong> {props.mens} </strong>
			</div>
		</div>
	</div>
)

class Registro extends Component {

	constructor(props){
		super(props)

		this.state={
			usuario : {
				name : '',
				email : '',
				password : '',
				password2 : '',
				area : '',
				tipo : '',
				tarjeta : '',
				activo : '',
			},
			usuarios : [],
			almacenes : [],
			almacenActual : 0,
			botonGuardar : 1, // 1 - Registrar, 2 - Guardar Cambios,
			botonTarjeta : 0,
			error : 0, // 0 - Vacio, 1 - No guardo, 2 - <> pass, 3 - OK
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.modificar = this.modificar.bind(this);
		this.eliminarTarjeta = this.eliminarTarjeta.bind(this);
	}

	componentWillMount()
    {
        this.cargarUsuarios();
		this.cargarAlmacenes();
		if(this.state.error === 3) this.clearUser(); 
    }

    cargarUsuarios=()=>
    {
        let temp = this;

        api().get(`/Usuarios`)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data[0] != null)
                {
                    temp.setState({ usuarios : response.data })
                }
            }
        });	
    }

    cargarAlmacenes=()=>
    {
        let temp = this;

        api().get(`/Almacenes`)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data[0] != null)
                {
                    temp.setState({ almacenes : response.data })
                }
            }
        });
    }

	handleSubmit(evt)
	{
		evt.preventDefault();
		var {error, usuario} = this.state;
		let temp = this;
		var ruta='/Usuario';

		error = 0;
		if(!(usuario.password === usuario.password2))
		{
			this.setState({ error : 2 });
		}
		else
		{
			this.state.botonGuardar === 1 ? ruta='/NuevoUsuario' : ruta='/Usuario';
			api().post(`${ruta}`,usuario)
			.then(function(response)
			{
				if(response.status === 200)
				{
					if(response.data) error = 3;
				}
				temp.setState({ error : error, usuario :  usuario });
			})
			.catch(error =>
			{
				error = 1;
				temp.setState({ error : error, usuario :  usuario });
			});
			this.componentWillMount();
		}
	}

	clearUser=()=>
	{
		this.setState(
		{
			usuario : {
				name : '',
				email : '',
				password : '',
				password2 : '',
				area : '',
				tipo : '',
				tarjeta : '',
				activo : '',
			}
		})
	}

	descartarCambios=(evt)=>
	{
		evt.preventDefault();
		this.setState({ botonGuardar : 1 });
		this.clearUser();	
	}

	modificar(event,btn)
	{
		event.preventDefault();
		let {usuario, usuarios, botonTarjeta} = this.state;
		usuario = usuarios[btn];
		usuario.password2 = usuario.password;
		usuario.tarjeta === '' ? botonTarjeta = 0 : botonTarjeta = 1;
		this.setState({ usuario : usuario, botonGuardar : 2, botonTarjeta : botonTarjeta });
	}

	eliminarTarjeta()
	{
		var {usuario, botonTarjeta} = this.state;
		usuario.tarjeta = '';
		botonTarjeta = 0;
		this.setState({ usuario : usuario, botonTarjeta : botonTarjeta });
	}

	handleInputChange(event) 
	{
		const value = event.target.value;
		const name = event.target.name;
		var {usuario, botonTarjeta} = this.state;

		usuario[name] = value;
		usuario.tarjeta === ''? botonTarjeta = 0 : botonTarjeta = 1;
		this.setState({ usuario : usuario, botonTarjeta : botonTarjeta });
	}

	render() {

		var {error, botonGuardar, botonTarjeta, almacenes} = this.state;
		let {usuario, usuarios} = this.state;

		return (
			<div>
				<div className="col-12">
					<div className="card">
						<div className="card-header"> <strong> Registro de usuarios </strong> </div>
						<div className="card-body">
							<form onSubmit={this.handleSubmit}>
								<div className="row ml-1 mr-1 form-group">
									<div className="col-9 pl-0 pr-2">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="fa fa-user"></i>
												</span>
											</div>
											<input required className="form-control" value={usuario.name} type="text" name="name" placeholder="Nombre" onChange = {this.handleInputChange} />
										</div>
										Escribe el nombre del usuario
									</div>
									<div className="col-3 pl-2 pr-0">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="fa fa-lock"></i>
												</span>
											</div>
											<select className="form-control" name="activo" value={usuario.activo} onChange={this.handleInputChange}>
												<option value="0"> Inactivo </option>
												<option value="1"> Activo </option>
											</select>
										</div>
										Estado
									</div>
								</div>
								<div className="row ml-1 mr-1 form-group">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-envelope"></i>
											</span>
										</div>
										<input required className="form-control" value={usuario.email} type="email" name="email" placeholder="Correo electronico" onChange = {this.handleInputChange} />
									</div>
									Escribe una dirección de correo electrónico válida
								</div>
								<div className="row ml-1 mr-1 form-group">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-asterisk"></i>
											</span>
										</div>
										<input required className="form-control" value={usuario.password} type="password" name="password" placeholder="Contraseña" onChange = {this.handleInputChange} />
									</div>
									Escribe la contraseña
								</div>
								<div className="row ml-1 mr-1 form-group">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-asterisk"></i>
											</span>
										</div>
										<input required className="form-control" value={usuario.password2} type="password" name="password2" placeholder="Contraseña" onChange = {this.handleInputChange} />
									</div>
									Vuelve a escribir la contraseña
								</div>
								<div className="row ml-1 mr-1 form-group">
									<div className="col-6 pl-0 pr-2">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="fa fa-building"></i>
												</span>
											</div>
											<select required className="form-control" name="area" value={usuario.area} onChange={this.handleInputChange}>
											<option value="" disabled="disabled"> Selecciona una opcion... </option>
											{
												almacenes.map((item, i) => <option key={i} value={item.id}> {item.nombre} </option> )
											}
											</select>
										</div>
										Selecciona el area de trabajo
									</div>
									<div className="col-6 pl-2 pr-0">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="fa fa-eye"></i>
												</span>
											</div>
											<select required className="form-control" name="tipo" value={usuario.tipo} onChange={this.handleInputChange}>
											<option value="" disabled="disabled"> Selecciona una opcion... </option>
											<option value="1"> General </option>
											<option value="2"> Supervisor </option>
											<option value="3"> Administrador </option>
											</select>
										</div>
										Selecciona el tipo de usuario
									</div>
								</div>
								{
									botonTarjeta === 1?
										<div className="row ml-1 mr-1 form-group">
											<div className="col-9 pl-0 pr-2">
												<div className="input-group">
													<div className="input-group-prepend">
														<span className="input-group-text">
															<i className="fa fa-id-card"></i>
														</span>
													</div>
													<input className="form-control" value={usuario.tarjeta} type="password" name="tarjeta" placeholder="Tarjeta RFID" onChange = {this.handleInputChange} />
												</div>
												Ingresa el número de tarjeta de acceso (opcional)
											</div>
											<div className="col-3 pl-2 pr-0">
												<button className="btn btn-danger w-100" type="submit" onClick={this.eliminarTarjeta}> Eliminar Tarjeta </button>
											</div>
										</div>
									:
										<div className="row ml-1 mr-1 form-group">
											<div className="col-12 pl-0 pr-0">
												<div className="input-group">
													<div className="input-group-prepend">
														<span className="input-group-text">
															<i className="fa fa-id-card"></i>
														</span>
													</div>
													<input className="form-control" value={usuario.tarjeta} type="password" name="tarjeta" placeholder="Tarjeta RFID" onChange = {this.handleInputChange} />
												</div>
												Ingresa el número de tarjeta de acceso (opcional)
											</div>
										</div>
								}
								<div>
								{
									botonGuardar === 1 ? 
										<div className="row ml-1 mr-1 form-group form-actions">
											<button className="btn col-12 btn-success" type="submit"> <strong> Registrar </strong> </button>
										</div>
									: 
										<div className="row ml-1 mr-1 form-group form-action">
											<div className="col-6 pl-0 pr-2">
												<button className="btn btn-success w-100" type="submit"> <strong> Guardar Cambios </strong> </button>
											</div>
											<div className="col-6 pl-2 pr-0">
												<button className="btn btn-warning w-100" onClick={this.descartarCambios}> <strong> Descartar Cambios </strong> </button>
											</div>
										</div>
								}
								</div>								
							</form>
						</div>
					</div>
				</div>
				<div className="col-12">
				{
					error === 3 ? <VentanaDeMensaje tipo = {"Confirmación"} estilo={"alert alert-success"} mens={"Los datos fueron guardados"} /> :
					error === 2 ? <VentanaDeMensaje tipo = {"Error!!!"}     estilo={"alert alert-warning"} mens={"Las contraseñas no son iguales"} /> :
					error === 1 ? <VentanaDeMensaje tipo = {"Error!!!"}     estilo={"alert alert-warning"} mens={"No se registraron los datos"} /> : ""
				}
				</div>
				<div className="col-12">
					<div className="card">
						<div className="card-header"> 
							<strong> Usuarios registrados </strong> 
						</div>
						<div className="card-body">
							<table className="table table-responsive-sm table-striped">
								<thead>
									<tr>
										<th className="text-center" width="10%"> Estado </th>
										<th className="text-center" width="25%"> Nombre </th>
										<th className="text-center" width="25%"> Usuario </th>
										<th className="text-center" width="15%"> Area </th>
										<th className="text-center" width="15%"> Tipo </th>
										<th className="text-center" width="10%"> Modificar </th>
									</tr>
								</thead>
								<tbody>
								{
									usuarios.map((item, i) => 
										<tr key = { i } >
											<td className="text-center">
											{
												parseInt(item.activo,10) === 1 ?
												<div className="badge badge-success"> Activo </div> : 
												<div className="badge badge-secondary"> Inactivo </div>
											}
											</td>
											<td className="text-center"> { item.name } </td>
											<td className="text-center"> { item.email } </td>
											<td className="text-center"> { item.area } </td>
											<td className="text-center">
											{
												item.tipo === 1 ? 'General' :
												item.tipo === 2 ? 'Supervisor' :
												item.tipo === 3 ? 'Administrador' : ''
											} 
											</td>
											<td className="text-center"> 
												<button className="btn btn-block btn-info active" type="button" aria-pressed="true" onClick={(e)=>this.modificar(e,i)}> 
													<strong> Modificar </strong> 
												</button>
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
		);
	}
}

function mapStateToProps(state, ownProps) {
	return {
		dash : state.dash,
		auth : state.auth
	}
};

export default connect(mapStateToProps, actions)(Registro)
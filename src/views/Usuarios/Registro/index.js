import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

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
				activo : '0',
			},
			usuarios : [],
			almacenes : [],
			almacenActual : 0,
			botonGuardar : 1, // 1 - Registrar, 2 - Guardar Cambios,
			botonTarjeta : 0,
			estiloPass: '',
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.modificar = this.modificar.bind(this);
		this.eliminarTarjeta = this.eliminarTarjeta.bind(this);
		this.agregarTarjeta = this.agregarTarjeta.bind(this);
	}

	componentWillMount()
	{
		this.cargarUsuarios();
		this.cargarAlmacenes();
		this.clearUser(); 
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
		var {usuario, estiloPass} = this.state;
		var ruta='';
        let self = this;

        estiloPass = '';
		if(!(usuario.password === usuario.password2))
		{
			estiloPass = 'is-invalid';
			this.setState({ estiloPass : estiloPass });
		}
		else
		{
			this.state.botonGuardar === 1 ? ruta='/NuevoUsuario' : ruta='/Usuario';
			api().post(`${ruta}`,usuario)
			.then(function(response)
			{
				if(response.status === 200)
				{
					if(response.data) 
					{
						swal('Los datos fueron guardados','','success');
						self.cargarUsuarios();
						self.clearUser();
						self.setState({ estiloPass : '' });
					}
				}
			})
			.catch(error => {
				swal('No se guardaron los datos','','error');
				self.cargarUsuarios();
				self.clearUser();
				self.setState({ estiloPass : '' });
			});

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
				tarjeta : null,
				activo : '0',
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
		usuario.tarjeta === null ? botonTarjeta = 0 : botonTarjeta = 1;
		this.setState({ usuario : usuario, botonGuardar : 2, botonTarjeta : botonTarjeta, estiloPass : '' });
	}

	eliminarTarjeta()
	{
		var {usuario, botonTarjeta} = this.state;

		swal({
			title: 'Eliminar la tarjeta?',
			type: 'warning',
  			showCancelButton: true,
  			confirmButtonColor: '#3085d6',
  			cancelButtonColor: '#d33',
			confirmButtonText: 'Si',
			cancelButtonText: 'No',
		}).then((result) => 
		{
			if (result.value) 
			{
				usuario.tarjeta = null;
				botonTarjeta = 0;
				swal('Tarjeta eliminada','','success');
				this.setState({ usuario : usuario, botonTarjeta : botonTarjeta });
  			}
  			else
  			{
				swal('No se borro la tarjeta','','error');
  			}
		})
	}

	agregarTarjeta()
	{
		var {usuario, botonTarjeta} =  this.state;
		let temp = this;
		
		swal({
			title: 'Tarjeta de acceso',
			input: 'password',
			inputPlaceholder: 'Desliza tu tarjeta',
		}).then((result) =>
		{
			if(result.value === '')
			{
				swal('No se registro ninguna tarjeta','','error');
			}
			else
			{
				usuario.tarjeta = result.value; 
				botonTarjeta = 1;
				swal('Tarjeta registrada','','success');
				temp.setState({ usuario : usuario, botonTarjeta : botonTarjeta });
			}
			
		});
	}

	handleInputChange(event) 
	{
		const value = event.target.value;
		const name = event.target.name;
		var {usuario, botonTarjeta} = this.state;

		usuario[name] = value;
		usuario.tarjeta === null ? botonTarjeta = 0 : botonTarjeta = 1;
		this.setState({ usuario : usuario, botonTarjeta : botonTarjeta });
	}

	render() {

		var {botonGuardar, botonTarjeta, almacenes} = this.state;
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
									<div>
										<div className="row ml-1 mr-1 form-group">
											<div className="input-group">
												<div className="input-group-prepend">
													<span className="input-group-text">
														<i className="fa fa-asterisk"></i>
													</span>
												</div>
												<input required className={"form-control "+this.state.estiloPass} value={usuario.password} type="password" name="password" placeholder="Contraseña" onChange = {this.handleInputChange} />
											</div>
											{ this.state.estiloPass === '' ? 'Escribe la contraseña' : '' }
										</div>
										<div className="row ml-1 mr-1 form-group">
											<div className="input-group">
												<div className="input-group-prepend">
													<span className="input-group-text">
														<i className="fa fa-asterisk"></i>
													</span>
												</div>
												<input required className={"form-control "+this.state.estiloPass} value={usuario.password2} type="password" name="password2" placeholder="Contraseña" onChange = {this.handleInputChange} />
											</div>
											{ 
												this.state.estiloPass === '' ? 'Vuelve a escribir la contraseña' :
												<div className="letraRoja"> Las contraseñas no coinciden </div>
											}
										</div>
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
									<div className="row ml-1 mr-1 form-group">
										<div className="col-9 pl-0 pr-2">
											<div className="input-group">
												<div className="input-group-prepend">
													<span className="input-group-text">
														<i className="fa fa-id-card"></i>
													</span>
												</div>
												<input className="form-control" readOnly type="password" name="tarjeta" value={usuario.tarjeta===null ? '' : usuario.tarjeta} />
											</div>
											Ingresa el número de tarjeta de acceso (opcional)
										</div>
										<div className="col-3 pl-2 pr-0">
										{
											botonTarjeta === 1 ? <button className="btn btn-danger w-100" type="button" onClick={this.eliminarTarjeta}> <strong> Eliminar Tarjeta </strong> </button>
											: <button className="btn btn-block btn-info active w-100" type="button" onClick={this.agregarTarjeta}> <strong> Agregar Tarjeta </strong> </button>
										}
										</div>
									</div>
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
											<td className="text-center"> { item.almacen?item.almacen.nombre:'' } </td>
											<td className="text-center">
											{
												parseInt(item.tipo,10) === 1 ? 'General' :
												parseInt(item.tipo,10) === 2 ? 'Supervisor' :
												parseInt(item.tipo,10) === 3 ? 'Administrador' : ''
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
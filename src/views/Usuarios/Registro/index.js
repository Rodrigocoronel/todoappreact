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
			boton : 1, // 1 - Registrar, 2 - Guardar Cambios,
			error : [ // 0 - Vacio, 1 - Error, 2 - OK
				0,  // Guardado
				0,  // Nombre de usuario
				0,  // Correo electronico
				0,  // Contraseña 1
				0,  // Contraseña 2
				0,  // Contraseñas diferentes
				0,  //
				0,  //
				0,  //
			],
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.modificar = this.modificar.bind(this);
	}

	componentWillMount()
    {
        var {usuario,usuarios} = this.state;
        let temp = this;

        api().get(`/Usuarios`)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data[0] != null)
                {
                    usuarios = response.data;
                    temp.setState({ usuarios : usuarios })
                }
            }
        });
		usuario.name = '';
		usuario.email = '';
		usuario.password = '';
		usuario.password2 = '';
		usuario.area = '';
		usuario.tipo = '';
		usuario.tarjeta = '';
		this.setState(usuario : usuario);
    }

	handleSubmit(evt){
		evt.preventDefault();
	  	var {error, usuario} = this.state;
	  	let temp = this;

		for(var a=0; a<6; a++) { error[a] = 0; }

	  	if(!(usuario.password === usuario.password2))
	  	error[0] = 1;

	  	if(error[0] === 0)
	  	{
	  		usuario.area = 1;
	  		usuario.tipo = 1;
	  		usuario.tarjeta = 'x';
	  		api().post('/NuevoUsuario',usuario)
            .then(function(response)
            {
                if(response.status === 200)
                {
                    if(response.data) error = 2;
                }
                temp.setState({ error : error, usuario :  usuario });
            })
            .catch(error =>
            {
                error = 1;
                temp.setState({ error : error, usuario :  usuario });
            });
        }
	  	this.setState({ error : error, usuario :  usuario });
	  	this.componentWillMount();
	}

	modificar(event,btn)
    {
        event.preventDefault();
        var {usuario, usuarios, boton} = this.state;
        usuario = usuarios[btn];
        boton = 2;
        usuario.password2 = usuario.password;
        this.setState({ usuario : usuario, boton : boton });
    }

    handleChange(event)
    {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]:value });
    }

	handleInputChange(event) 
    {
        const value = event.target.value;
        const name = event.target.name;
        var {usuario} = this.state;

        usuario[name] = value;
        this.setState({ usuario : usuario });
    }

	render() {

		var {error, boton} = this.state;
		let {usuario, usuarios} = this.state;

		return (
			<div>
        		<div className="col-lg-6 col-sm-12">
					<div className="card">
						<div className="card-header"> <strong> Registro de usuarios </strong> </div>
						<div className="card-body">
							<form action="" method="post">
								<div className="row ml-1 mr-1 form-group">
									<div className="col-9 pl-0 pr-2">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="fa fa-user"></i>
												</span>
											</div>
											<input className="form-control" value={usuario.name} type="email" name="name" placeholder="Nombre" onChange = {this.handleInputChange} />
										</div>
										<div>
										{
											error[1] === 0 ? "Escribe el nombre del usuario" :
											error[1] === 1 ? "Correo invalido" : ''
										}
										</div>
									</div>
									<div className="col-3 pl-2 pr-0">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="fa fa-lock"></i>
												</span>
											</div>
											<select className="form-control" name="tipo" value={usuario.activo} onChange={this.handleChange}>
											<option> Activo </option>
											<option> Inactivo </option>

											</select>
										</div>
										<div>
											Estado
										</div>
									






									</div>
								</div>
								<div className="row ml-1 mr-1 form-group">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-envelope"></i>
											</span>
										</div>
										<input className="form-control" value={usuario.email} type="email" name="email" placeholder="Correo electronico" onChange = {this.handleInputChange} />
									</div>
									<div>
									{
										error[2] === 0 ? "Escribe una dirección de correo electrónico válida" :
										error[2] === 1 ? "Correo invalido" : ''
									}
									</div>
								</div>
								<div className="row ml-1 mr-1 form-group">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-asterisk"></i>
											</span>
										</div>
										<input className="form-control" value={usuario.password} type="password" name="password" placeholder="Contraseña" onChange = {this.handleInputChange} />
									</div>
									<div>
									{
										error[3] === 0 ? "Escribe la contraseña" : 
										error[3] === 1 ? "Contraseña invalida" : ''
									}	
									</div>
								</div>
								<div className="row ml-1 mr-1 form-group">
						
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-asterisk"></i>
											</span>
										</div>
										<input className="form-control" value={usuario.password2} type="password" name="password2" placeholder="Contraseña" onChange = {this.handleInputChange} />
									</div>
									<div>
									{
										error[4] === 0 ? "Vuelve a escribir la contraseña" :
										error[4] === 1 ? "Contraseña invalida" : ''
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
											<select className="form-control" name="area" value={usuario.area} onChange={this.handleChange}>
											<option> Selecciona una opcion... </option>
											<option> 1 </option>
											<option> 2 </option>
											<option> 3 </option>
											</select>
										</div>
										<div>
										{
											error[6] === 0 ? "Selecciona el area de trabajo" :
											error[6] === 1 ? "Contraseña invalida" : ''
										}	
										</div>
									</div>
									<div className="col-6 pl-2 pr-0">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text">
													<i className="fa fa-eye"></i>
												</span>
											</div>
											<select className="form-control" name="tipo" value={usuario.tipo} onChange={this.handleChange}>
											<option> Selecciona una opcion... </option>
											<option> General </option>
											<option> Supervisor </option>
											<option> Administrador </option>
											</select>
										</div>
										<div>
										{
											error[7] === 0 ? "Selecciona el tipo de usuario" :
											error[7] === 1 ? "Contraseña invalida" : ''
										}	
										</div>
									</div>
								</div>
								<div className="row ml-1 mr-1 form-group">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-id-card"></i>
											</span>
										</div>
										<input className="form-control" value={usuario.tarjeta} type="password" name="tarjeta" placeholder="Tarjeta RFID" onChange = {this.handleInputChange} />
									</div>
									<div>
									{
										error[8] === 0 ? "Ingresa el número de tarjeta de acceso (opcional)" :
										error[8] === 1 ? "Contraseña invalida" : ''
									}	
									</div>
								</div>
								<div className="row ml-1 mr-1 form-group form-actions">
									<button className="btn col-12 btn-success" type="submit" onClick={this.handleSubmit}> 
										<strong> { boton === 1 ? "Registrar" : "Guardar Cambios" } </strong> 
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="col-lg-6 col-sm-12">
				{ 
					error[0] === 1 ? <VentanaDeMensaje tipo = {"Confirmación"} estilo={"alert alert-success"} mens={"El usuario fue registrado"} /> : 
					error[0] === 2 ? <VentanaDeMensaje tipo = {"Error!!!"}     estilo={"alert alert-warning"} mens={"El correo no es valido"} /> :
					error[0] === 3 ? <VentanaDeMensaje tipo = {"Error!!!"}     estilo={"alert alert-warning"} mens={"Las contraseñas no son iguales"} /> : ""
				}
				</div>
				<div className="col-lg-6 col-sm-12">
					<div className="card">
						<div className="card-header"> 
							<strong> Usuarios registrados </strong> 
						</div>
						<div className="card-body">
							<table className="table table-responsive-sm table-striped">
								<thead>
									<tr>
										<th className="text-center" width="10%"> No. </th>
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
											<td className="text-center"> { item.id } </td>
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
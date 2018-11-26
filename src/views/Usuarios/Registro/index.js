import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';

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
			},
			usuarios : [],
		
			error : {
				validacion1 : 0,
				validacion2 : 0,
				validacion3 : 0,
				validacion4 : 0,
				guardado : 0
			},     
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentWillMount()
    {
        var {usuarios} = this.state;
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
    }

	handleSubmit(evt){
		evt.preventDefault();
	  	var {error, usuario} = this.state;
	  	let temp = this;

		error.validacion1 = 0;
		error.validacion2 = 0;
		error.validacion3 = 0;
		error.validacion4 = 0;
	  	error.guardado = 0;


	  	if(!(usuario.password === usuario.password2))
	  	error.guardado = 3;

	  	if(error.guardado === 0)
	  	{
	  		usuario.area = 1;
	  		usuario.tipo = 1;
	  		usuario.tarjeta = 'x';
	  		api().post('/NuevoUsuario',usuario)
            .then(function(response)
            {
                if(response.status === 200)
                {
                    response.data ? error = 2 : "";
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

		var {error} = this.state;
		let usuario = this.state;
		
		return (
			<div>
        		<div className="col-lg-6 col-sm-12">
					<div className="card">
						<div className="card-header"> <strong> Registro de usuarios </strong> </div>
						<div className="card-body">
							<form action="" method="post">
							<div className="form-group">
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
										error.validacion4 === 0 ? "Escribe el nombre del usuario" :
										error.validacion4 === 1 ? "Correo invalido" : ''
									}
									</div>
								</div>
								<div className="form-group">
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
										error.validacion1 === 0 ? "Escribe una dirección de correo electrónico válida" :
										error.validacion1 === 1 ? "Correo invalido" : ''
									}
									</div>
								</div>
								<div className="form-group">
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
										error.validacion2 === 0 ? "Escribe la contraseña" : 
										error.validacion2 === 1 ? "Contraseña invalida" : ''
									}	
									</div>
								</div>
								<div className="form-group">
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
										error.validacion3 === 0 ? "Vuelve a escribir la contraseña" :
										error.validacion3 === 1 ? "Contraseña invalida" : ''
									}	
									</div>
								</div>
								<div className="form-group form-actions">
									<button className="btn col-12 btn-success" type="submit" onClick={this.handleSubmit}> <strong> Registrar </strong> </button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="col-lg-6 col-sm-12">
				{ 
					error.guardado === 1 ? <VentanaDeMensaje tipo = {"Confirmación"} estilo={"alert alert-success"} mens={"El usuario fue registrado"} /> : 
					error.guardado === 2 ? <VentanaDeMensaje tipo = {"Error!!!"} estilo={"alert alert-warning"} mens={"El correo no es valido"} /> :
					error.guardado === 3 ? <VentanaDeMensaje tipo = {"Error!!!"} estilo={"alert alert-warning"} mens={"Las contraseñas no son iguales"} /> : ""
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
								
									usuario.usuarios.map((item, i) => 
										<tr key = { i } >
											<td className="text-center"> { item.id } </td>
											<td className="text-center"> { item.name } </td>
											<td className="text-center"> { item.email } </td>
											<td className="text-center"> { item.area } </td>
											<td className="text-center"> { item.tipo } </td>
											<td className="text-center"> BOTON </td>
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
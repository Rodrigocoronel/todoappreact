import React, { Component } from 'react';
//import { Button, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';

import * as actions from '../../../actions/dash.js';

//import {api} from '../../actions/_request';

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
			error : {
				validacion1 : 0,
				validacion2 : 0,
				validacion3 : 0,
				validacion4 : 0,
				guardado : 0
			},     
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(evt){
		evt.preventDefault();
	  	var {error} = this.state;

	  	error.guardado===0 ? error.guardado = 1 : error.guardado === 1 ? error.guardado = 2 : error.guardado = 0;

	  	this.setState({
			error: error
		});
	}

	render() {

		var {error} = this.state;
		
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
												<i className="fa fa-envelope"></i>
											</span>
										</div>
										<input className="form-control" id="email" type="email" name="email" placeholder="Correo electronico" />
									</div>
									<div>
									{
										error.validacion1 === 0 ? "Escribe una dirección de correo electrónico válida" : "Correo invalido"
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
										<input className="form-control" id="password1" type="password" name="password1" placeholder="Contraseña" />
									</div>
									<div>
									{
										error.validacion1 === 0 ? "Escribe la contraseña" : "Contraseña invalida"
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
										<input className="form-control" id="password2" type="password" name="password2" placeholder="Contraseña" />
									</div>
									<div>
									{
										error.validacion1 === 0 ? "Vuelve a escribir la contraseña" : "Contraseña invalida"
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
					{ error.guardado === 1 ? <VentanaDeMensaje tipo = {"Confirmación"} estilo={"alert alert-success"} mens={"El usuario fue registrado"} /> : error.guardado === 2 ? <VentanaDeMensaje tipo = {"Error!!!"} estilo={"alert alert-warning"} mens={"El usuario no fue registrado"} /> : "" }
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
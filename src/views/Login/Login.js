import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import logo from '../../assets/img/brand/logob.jpg'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/auth.js';
import swal from 'sweetalert2';
import {request} from '../../actions/_request';

class Login extends Component {

	constructor(props)
	{
		super(props)
		this.state={
			usuario : {
				email : '',
				password : '',
				tarjeta : '',
			},
		}
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount()
	{
		this.props.checkToken();
	}

	handleInputChange(event)
	{
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		var {usuario} = this.state;
		usuario[name] = value;
		this.setState({usuario : usuario});
	}

	handleSubmit(evt)
	{
		evt.preventDefault();
		let{usuario} = this.state;
		this.props.login({ email : usuario.email, password : usuario.password });
	}

	accesoRFID = () =>
	{
		let {usuario} = this.state;
		let _self = this;
		swal({
			input: 'password',
			inputPlaceholder: 'Desliza tu tarjeta',
			showCloseButton: true,
			showConfirmButton: false,
			imageUrl: '/assets/img/swipe.gif',
			imageWidth: 300,
			imageHeight: 200
		}).then((result) =>
		{

			let first = result.value.substring(1,17);
			let second = result.value.substring(18,21);

			usuario.tarjeta = first+second;
			var noTarjeta = {
				password : usuario.tarjeta
			}
			request.post('/api/logincard',noTarjeta)
			.then(function(response)
			{
				console.log(response);
				if(response.status === 200)
				{
					_self.props.loginCard(response.data);
					if(response.data)
					{

						swal({
							title:'Bienvenido',
							text: 'Cargando...',
							showConfirmButton: false,
							timer: 1500,
							onOpen: () => { swal.showLoading() }
						});
					}
				}
			})
			.catch(error =>
			{
				console.log(error);
				swal({
					title: 'Acceso no autorizado',
					type: 'error',
					showConfirmButton: false,
					timer: 1500,
				});
			});
		});
	}

	render() 
	{
		let {usuario} = this.state;

		if(this.props.auth.authenticated) return <Redirect to={'/app'} />;

		return (
			<div className="app flex-row align-items-center">
				<Container>
					<Row className="justify-content-center">
						<Col md="8">
							<CardGroup>
								<Card className="p-4">
									<CardBody>
										{ this.props.auth.error_message }
										<Form onSubmit={this.handleSubmit}>
											<h1>Login</h1>
											<p className="text-muted">Ingresa a tu cuenta</p>
											<InputGroup className="mb-3">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-user"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="text" placeholder="E-mail" autoComplete="username" name='email' required value={usuario.email} onChange={this.handleInputChange} />
											</InputGroup>
											<InputGroup className="mb-4">
												<InputGroupAddon addonType="prepend">
													<InputGroupText>
														<i className="icon-lock"></i>
													</InputGroupText>
												</InputGroupAddon>
												<Input type="password" placeholder="Password" autoComplete="current-password" name='password' required value={usuario.password} onChange={this.handleInputChange} />
											</InputGroup>
											<Row className="mb-4">
												<Col xs="6">
													<Button color="primary" onClick={this.submit} className="px-4">Login</Button>
												</Col>
											</Row>
											<InputGroup className="mb-4">
												<Button className="btn btn-ghost-primary" onClick={this.accesoRFID}> <i className="fa fa-id-card"> </i> Ingresar con tarjeta RFID </Button>
											</InputGroup>
										</Form>
									</CardBody>
								</Card>
								<Card className="text-white bg-secondary py-5 d-md-down-none">
									<CardBody className="text-center h-100">
										<div className="row h-100">
											<div className="col-12 align-self-center">
												<img className="imagen" src={logo} alt="" />
											</div>
										</div>
									</CardBody>
								</Card>
							</CardGroup>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {
    return {
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Login)
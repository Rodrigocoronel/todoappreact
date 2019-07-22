import React from 'react'

import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

export default class FormUser extends React.Component{

	constructor(props){
		super(props);

		this.state={
			usuario : {
				name : '',
				email : '',
				password : '',
				password2 : '',
				area : '',
				tipo : '',
				tarjeta : null,
				activo : '0',
			},
			usuarios : [],
			almacenes : [],
			almacenActual : 0,
			botonGuardar : 1, // 1 - Registrar, 2 - Guardar Cambios,
			botonTarjeta : 0,
			estiloPass: '',
			action : 'save',
		}
	}

	componentDidMount(){
		this.cargarAlmacenes();

		let _self = this;
		let {usuario} = this.state;
		let {params} = this.props.match;
		if(params.id) {
			api().get("/user_by_id/"+params.id)
			.then(function(response){
				if(response.status === 200){
					usuario = response.data;
					_self.setState({
						usuario : usuario,
						action : 'edit'
					})
				}

			});
		}

	}

	handleSubmit=(evt)=>
	{
		evt.preventDefault();
		var {usuario, estiloPass} = this.state;
		var ruta='';
        let self = this;

			this.state.action === 'save' ? ruta='/NuevoUsuario' : ruta='/Usuario';
			api().post(`${ruta}`,usuario)
			.then(function(response)
			{
				if(response.status === 200)
				{

					self.props.history.push('/app/registro/');
					swal('Los datos fueron guardados','','success');
					self.setState({ estiloPass : '' });
					
				}
			})
			.catch(error => {
				swal('No se guardaron los datos','','error');
				self.setState({ estiloPass : '' });
			});

	}

	handleInputChange=(event)=> 
	{
		const value = event.target.value;
		const name = event.target.name;
		var {usuario} = this.state;

		if(name === 'tipo')
		{
			switch (value)
			{
				case '2': usuario['area'] = '-3' ; break;
				case '3': usuario['area'] = '-3' ; break;
				case '4': usuario['area'] = '1' ;  break;
				case '5': usuario['area'] = '2' ;  break;
				case '6': usuario['area'] = '' ;  break;
				default:
			}

		}
		if(name === 'area')
		{
			if(parseInt(value,10)<3) usuario['tipo']='';
			else
			{
				if(usuario['tipo'] !=='6')
				{
					usuario['tipo']='';
				}
			}
		}
		usuario[name] = value;

		this.setState({ usuario : usuario });
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

	eliminarTarjeta=()=>
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

	agregarTarjeta=()=>
	{
		var {usuario} =  this.state;
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
				
				let first = result.value.substring(1,17);
				let second = result.value.substring(18,21);

				console.log('first',first)
				console.log('sec',second)

				usuario.tarjeta = first+second; 

				swal('Tarjeta registrada','','success');
				temp.setState({ usuario : usuario });
			}
			
		});
	}

	descartarCambios=(evt)=>
	{
		evt.preventDefault();
		
		this.props.history.push('/app/registro/');
	}

	render(){

		let {usuario , almacenes, botonTarjeta, botonGuardar} = this.state;

		return(
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
								</div>	
							<div className="row ml-1 mr-1 form-group">

								<div className="col-6 pl-0 pr-2">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-eye"></i>
											</span>
										</div>
										<select required className="form-control" name="tipo" value={usuario.tipo} onChange={this.handleInputChange}>
										<option value="" disabled="disabled"> Selecciona una opcion... </option>
										<option value="1"> Administrador </option>
										<option value="3"> Gerente </option>
										<option value="4"> Almacenista (General) </option>
										<option value="5"> Almacenista (Licores) </option>
										<option value="6"> Barra </option>
										</select>
									</div>
									Selecciona el tipo de usuario
								</div>

								<div className="col-6 pl-2 pr-0">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="fa fa-building"></i>
											</span>
										</div>
										<select required className="form-control" name="area" value={usuario.area} onChange={this.handleInputChange}>
										<option value="" disabled="disabled"> Selecciona una opcion... </option>
										<option value="-3"> - Todas - </option>
										{
											almacenes.map((item, i) =>
												parseInt(item.activo,10) === 1 ? <option key={i} value={item.id} > {item.nombre} </option>  : ""
											)
										}
										</select>
									</div>
									Selecciona el area de trabajo
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
										usuario.tarjeta != null ? <button className="btn btn-danger w-100" type="button" onClick={this.eliminarTarjeta}> <strong> Eliminar Tarjeta </strong> </button>
										: <button className="btn btn-block btn-info active w-100" type="button" onClick={this.agregarTarjeta}> <strong> Agregar Tarjeta </strong> </button>
									}
									</div>
								</div>
							<div>
							{
								this.state.action === 'save' ? 
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
		);
	}

}
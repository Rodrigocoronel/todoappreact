import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

import {Button} from 'reactstrap'

class Registro extends Component {

	constructor(props){
		super(props)

		this.state={
			usuarios : [],
		}
		this.modificar = this.modificar.bind(this);
	}

	componentWillMount()
	{
		this.cargarUsuarios();
	}

    cargarUsuarios=()=>
    {
        let temp = this;

        api().get(`/Usuarios`)
        .then(function(response)
        {

            temp.setState({ usuarios : response.data })

        })
        .catch((err)=>console.log(err))	
    }


	modificar(event,id)
	{
		event.preventDefault();

		console.log(id)
		this.props.history.push('/app/registro/edit/'+id);
	}

	goToNew=()=>{
		this.props.history.push('/app/registro/agregar');
	}
	

	render() {

		var {botonGuardar, almacenes} = this.state;
		let {usuario, usuarios} = this.state;

		return (
			<div>
				<div className="col-12">
					<div className="card">
						<div className="card-header"> 
							<div className="row">
								<div className="col-6">
									<strong> Usuarios registrados </strong> 
								</div>
								<div className="col-6 text-right">
									<Button color="success"  onClick={this.goToNew}>Agregar</Button>
								</div>
							</div>
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
											<td className="text-center"> { item.tipo } </td>
											<td className="text-center"> 
												<button className="btn btn-block btn-info active" type="button" aria-pressed="true" onClick={(e)=>this.modificar(e,item.id)}> 
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
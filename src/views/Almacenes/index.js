import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/dash.js';
import {api} from '../../actions/_request';

const ListaDeAlmacenes = ({almacen}) => 
(           
    <div className="card">
        <div className="card-header">
            <strong>Almacenes</strong>
        </div>
        <div className="card-body">
            <table className="table table-responsive-sm table-striped">
                <thead>
                    <tr>
                        <th className="text-center" width="10%"> Código </th>
                        <th className="text-center" width="10%"> Estado </th>
                        <th width="20%"> Nombre </th>
                        <th width="50%"> Descripción </th>
                        <th width="10%"> Activar/Desactivar </th>
                    </tr>
                </thead>
                <tbody>
                {
                    almacen.almacenes.map((item, i) => 
                        <tr key = { i } >
                            <td className="text-center"> { item.id } </td>
                            <td className="text-center"> <div className="badge badge-success"> Activo </div></td>
                            <td> { item.nombre } </td>
                            <td> - - - - - </td>
                            <td> <button className="btn btn-block btn-outline-danger active" type="button" aria-pressed="true"> Desactivar </button> </td>
                        </tr>
                    )
                }
                </tbody>
            </table>  
        </div>
    </div>
)

class Almacenes extends Component {

    constructor(props){
        super(props)

        this.state={
            almacen : {
                id : '',
                nombre : '',
                descripcion : '',
            },
            almacenes : [],
        }
        //this.handleInputChange = this.handleInputChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount()
    {
        var {almacenes} = this.state;
        let temp = this;

        api().get(`/Almacenes`)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data[0] != null)
                {
                    almacenes = response.data;
                    temp.setState({
                        almacenes : almacenes,
                    })
                }
            }
        });
    }

    handleSubmit(evt){
        evt.preventDefault();
    }

    render() {

        let almacen = this.state;

        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong>Registro De Almacenes</strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label>Código:</label>
                                                <input className="form-control" placeholder="autoasigned" type="text" readOnly name="folio" />
                                            </div>
                                            <div className="form-group">
                                                <label>Nombre:</label>
                                                <input className="form-control" type="text" autoFocus name="insumo" onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Descripción:</label>
                                                <input className="form-control" type="text" name="insumo" onChange = {this.handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div>
                                                <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} >Guardar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            { <ListaDeAlmacenes almacen = {almacen} /> }
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

export default connect(mapStateToProps, actions)(Almacenes)
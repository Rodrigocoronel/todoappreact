import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/dash.js';
import {api} from '../../actions/_request';

class Almacenes extends Component {

    constructor(props)
    {
        super(props)

        this.state={
            almacen : {
                id : '',
                nombre : '',
                activo : '',
                descripcion : '',
            },
            almacenes : [],
        }
        this.activarDesactivar = this.activarDesactivar.bind(this);
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

    activarDesactivar(event,btn)
    {
        event.preventDefault();
        var {almacen} = this.state; 
        const target = event.target;
        const value = target.value;
        const name = target.name;

        console.log(btn);


        //this.setState({ almacen : almacen });
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
                                                <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit}> Guardar </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong> Almacenes </strong>
                                </div>
                                <div className="card-body">
                                    <table className="table table-responsive-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th className="text-center" width="15%"> Código </th>
                                                <th className="text-center" width="15%"> Estado </th>
                                                <th className="text-center" width="20%"> Nombre </th>
                                                <th width="40%"> Descripción </th>
                                                <th className="text-center" width="10%"> Activar/Desactivar </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            almacen.almacenes.map((item, i) => 
                                                <tr key = { i } >
                                                    <td className="text-center"> { item.id } </td>
                                                    <td className="text-center"> {
                                                                                    parseInt(item.activo,10) === 1 ?
                                                                                    <div className="badge badge-success"> Activo </div> : 
                                                                                    <div className="badge badge-secondary"> Inactivo </div>
                                                                                  }
                                                    </td>
                                                    <td className="text-center"> { item.nombre } </td>
                                                    <td> { item.descripcion } </td>
                                                    <td className="text-center">
                                                    {
                                                        parseInt(item.activo,10) === 1 ? 
                                                        <button className="btn btn-block btn-outline-danger active" type="button" aria-pressed="true" onClick={(e)=>this.activarDesactivar(e,i)} > <strong> Desactivar </strong> </button> :
                                                        <button className="btn btn-block btn-outline-success active" type="button" aria-pressed="true" onClick={(e)=>this.activarDesactivar(e,i)} > <strong> Activar </strong> </button>
                                                    }
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
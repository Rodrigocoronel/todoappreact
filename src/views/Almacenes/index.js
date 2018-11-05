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
                        <th width="25%"> Codigo </th>
                        <th width="75%"> Nombre </th>
                    </tr>
                </thead>
                <tbody>
                {
                    almacen.almacenes.map((item, i) => 
                        <tr key = { i } >
                            <td> { item.id } </td>
                            <td> { item.nombre } </td>
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
                        <div className="col-sm-12 col-lg-6">
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
                        <div className="col-sm-12 col-lg-6">
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
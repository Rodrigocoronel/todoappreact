import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

class Inventario extends Component 
{
    constructor(props){
        super(props)

        this.state=
        {
            busqueda : {
                almacen : "0",
            },
            almacenes : [],
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount()
    {
        var {almacenes, busqueda} = this.state;
        let temp = this;

        api().get(`/Almacenes`)
        .then(function(response)
        {
            if(response.status === 200)
            {
                if(response.data[0] != null)
                {
                    almacenes = response.data;
                    temp.setState({ almacenes : almacenes })
                }
            }
        });
        this.props.auth.user.area === -3 ? busqueda.almacen = '0' : busqueda.almacen = this.props.auth.user.area;
        this.setState({busqueda : busqueda});
    }

    handleInputChange(event) 
    {
        const value = event.target.value;
        const name = event.target.name;
        var {botella} = this.state;

        botella[name] = value;
        botella.error=0;
        this.setState({ botella: botella});
    }
                
    render()
    {
        let { almacenes, busqueda } = this.state;

        return(
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong>Reporte De Inventario</strong>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12 col-lg-3">

                                            <div className="form-group">
                                                <label> Almacén: </label>
                                                <select value={busqueda.almacen} className="form-control" id="almacen" name="almacen" onChange={this.handleInputChange}>
                                                    <option value='0'> Selecciona un almacen... </option>
                                                    {
                                                        almacenes.map((item, i) =>
                                                            parseInt(item.activo,10) === 1 ?
                                                                this.props.auth.user.area === -3 ? <option key={i} value={item.id} > {item.nombre} </option>  :
                                                                this.props.auth.user.area === item.id ? <option key={i} value={item.id} > {item.nombre} </option>  : ""
                                                            : ""
                                                        )
                                                    }
                                                </select>

                                            </div>


                                            <div className="form-group">
                                                <button className="btn btn-block btn-primary" type="button" onClick={this.handleSubmit} > Buscar </button>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) 
{
    return{
        dash : state.dash,
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Inventario)
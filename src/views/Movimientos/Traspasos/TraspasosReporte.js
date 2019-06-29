import React from 'react';

import {Row, Col} from 'reactstrap'

const TipoDeMovimiento = ({mov}) =>
(
    <div>
    {
        mov === 1 ? <div className="badge badge-success">   Entrada   </div> :
        mov === 2 ? <div className="badge badge-warning">   Salida    </div> :
        mov === 3 ? <div className="badge badge-danger"> Cancenlación </div> :
        mov === 4 ? <div className="badge badge-secondary"> Venta     </div> :
        mov === 5 ? <div className="badge badge-danger">    Baja      </div> :
                    <div className="badge badge-warning">   Traspaso  </div>
     } 
    </div>
)


export default class TraspasosReporte extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			concentrado : [],
            edit_items : false,
		}
	}

	imprimirReporte=()=>
    {
        let {datosTraspaso} = this.props;
        console.log(datosTraspaso);
        window.open("http://localhost:8000/api/reporteDeTraspaso/"+datosTraspaso.id, '_blank');
    }

    verTodos = (evt) =>{

        let {edit_items} = this.state;

        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        edit_items = value;

        this.setState({edit_items : edit_items})

    }

	render(){
        let {datosTraspaso} = this.props;
        let {edit_items} = this.state;
		return(
			<div className="col-xl-5 col-lg-9 col-md-10 col-sm-12">
                <div className="card">
                    <div className="card-header">
                    	<Row>
                    		<Col xs="12">
                        		<i className="fa fa-align-justify"> </i> <strong> Ticket de salida</strong> 
                        	</Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                Traspaso no : {datosTraspaso? datosTraspaso.id : ''}
                            </Col>
                            <Col xs="12">
                                Recibe : {datosTraspaso? datosTraspaso.recibe : ''}
                            </Col>
                        </Row>
                        <Row className="mt-5">
                        	<Col xs="6">
                        		<button className="btn btn-primary" type="button" onClick={this.imprimirReporte} > 
		                            <i className="icons font-2xl d-block cui-print"></i>
		                        </button> 
                        	</Col>
                        	<Col xs="6">
                        		<button className="btn btn-primary" type="button" onClick={this.props.nuevoTraspaso} > 
		                            <span>Nuevo Traspaso</span>
		                        </button> 
                        	</Col>
                        </Row>
                    </div>
                    <div className="card-body">
                        <Row>
                            <Col xs="12">
                                <table className="table table-responsive-sm table-sm">
                                    <thead>
                                        <tr>
                                            <th width='20%'> <center> Cantidad.         </center> </th>
                                            <th width='20%'> <center> Movimiento  </center> </th>
                                            <th width='60%'> <center> Descripcion </center> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        datosTraspaso &&
                                        datosTraspaso.movimientos.map((item, i) => 
                                            <tr key = { i } >
                                                <td width='20%'> <center> { item.qty}             </center> </td>
                                                <td width='20%'> <center> { <TipoDeMovimiento mov = { parseInt(item.movimiento_id,10) } /> } </center> </td>
                                                <td width='60%'> <center> { item.descs }  </center> </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </Col>
                            <Col xs="12">
                                <div className="d-inline-flex mt-2">
                                    <label className="mr-2">Ver Detalle</label>
                                    <label className="switch switch-label switch-pill switch-primary">
                                        <input className="switch-input" type="checkbox" checked={edit_items} onChange={this.verTodos}/>
                                        <span className="switch-slider" data-checked="✓" data-unchecked="✕"></span>
                                    </label>
                                </div>
                                {
                                    edit_items &&
                                    <div>
                                        <table className="table table-responsive-sm table-sm">
                                            <thead>
                                                <tr>
                                                    <th width="20%"> <center> Folio </center></th>
                                                    <th width='20%'> <center> Movimiento  </center> </th>
                                                    <th width='60%'> <center> Descripcion </center> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                datosTraspaso &&
                                                datosTraspaso.movimientos_detallados.map((item, i) => 
                                                    <tr key = { i } >
                                                        <td width='20%'> <center> { item.folio}             </center> </td>
                                                        <td width='20%'> <center> { <TipoDeMovimiento mov = { parseInt(item.movimiento_id,10) } /> } </center> </td>
                                                        <td width='60%'> <center> { item.desc_insumo }  </center> </td>
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                }
                            </Col>
                        </Row>  
                    </div>

                </div>
            </div>
		)
	}
}
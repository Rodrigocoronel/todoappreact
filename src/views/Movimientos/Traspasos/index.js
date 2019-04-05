import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api} from '../../../actions/_request';
import swal from 'sweetalert2';

const VentanaDeError = () => 
(
    <div className="card">
        <div className="card-header">
            <strong> "Error!!!" </strong>
        </div>
        <div className="card-body">
            <div className="alert alert-warning" role="alert">
                <strong> "Codigo De Botella No Encontrado" </strong>
            </div>
        </div>
    </div>
)

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

const Entrada =     () => ( <button className="btn btn-success" type="button" data-toggle="modal" data-target="#successModal"> <strong> Entrada               </strong> </button> )
const Salida =      () => ( <button className="btn btn-warning" type="button" data-toggle="modal" data-target="#warningModal"> <strong> Salida                </strong> </button> )
const Cancelacion = () => ( <button className="btn btn-danger"  type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Cancelación De Venta  </strong> </button> )
const Venta =       () => ( <button className="btn btn-success" type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Venta                 </strong> </button> )
const Baja =        () => ( <button className="btn btn-danger"  type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Baja Por Merma        </strong> </button> )
const Traspaso =    () => ( <button className="btn btn-warning" type="button" data-toggle="modal" data-target="#dangerModal">  <strong> Traspaso Entre Barras </strong> </button> )

class Traspasos extends Component {

    constructor(props){
        super(props)

        this.state={
            numFolio : '',
            movimiento : {
                folio : '',
                botella_id : '',
                movimiento_id : '',
                motivo : '',
                almacen_id : '',
                fecha : '',
                user : ''
            },
            reportes : [],
            concentrado : [],
            clase : ['','','','','','',''], // Clase para la vista de cada uno de los 6 botones
            boton : [0,0,0,0,0,0,0],        // Si el boton esta activado o no
            unBoton : 'btn btn-lg btn-info active btn90 p-3 m-1',
            elBoton : 'btn btn-lg btn-primary active btn90 p-3 m-1',
            almacenes : [],
            almacen : '0',
            tMov : 1,    // 1-Entrada, 2-Salida, 3-Cancelacion, 4-Venta, 5-Baja, 6-Traspaso
            insumo : '',
            error : 0,     // 0-Vacio, 1-Ok, 2-No encontrado
            fin : 0, // 1-Fin: El ultimo caracter leido fue el final de la cadena Qr
            tarjeta : ";1370010000003023=991?", // Registro de tarjeta (TEMPORAL)
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.seleccionarMovimiento = this.seleccionarMovimiento.bind(this);
        this.limpiarState = this.limpiarState.bind(this);
        this.activarBotones = this.activarBotones.bind(this);
        this.guardarMovimiento = this.guardarMovimiento.bind(this);
        this.justificarBaja = this.justificarBaja.bind(this);
        this.pedirAutorizacion = this.pedirAutorizacion.bind(this);
    }

    componentDidMount()
    {
        var {almacenes, almacen, clase} = this.state;
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

        for(var a=1; a<=6; a++) clase[a]=this.state.unBoton;
        this.activarBotones();
        this.props.auth.user.area === -3 ? almacen = '0' : almacen = this.props.auth.user.area;
        this.setState({almacen : almacen, clase : clase});
    }

    activarBotones()
    {
        var {boton, tMov, clase} = this.state;
        var tipo = parseInt(this.props.auth.user.tipo,10);
        var almacen = parseInt(this.props.auth.user.area,10);

        boton[1]=1; boton[2]=1; boton[3]=1; boton[4]=1; boton[5]=1; boton[6]=1; clase[1]=this.state.elBoton;
        if(tipo > 3) 
        {                    //     Entrada      Salida Cancelacion       Venta        Baja   Traspaso    Movimiento y boton Actuales
            if(almacen === 1) { boton[1]=0; boton[2]=1; boton[3]=0; boton[4]=0; boton[5]=1; boton[6]=0; tMov=2; clase[2]=this.state.elBoton; }
            if(almacen === 2) { boton[1]=1; boton[2]=1; boton[3]=0; boton[4]=0; boton[5]=1; boton[6]=0; tMov=1; }
            if(almacen >= 3)  { boton[1]=1; boton[2]=0; boton[3]=1; boton[4]=1; boton[5]=1; boton[6]=1; tMov=1; }
        }
        this.setState({boton : boton, tMov : tMov, clase : clase});
    }

    handleInputChange(event)
    {
        const value = event.target.value;
        //const name = event.target.name;

        //var {movimiento, fin, error} = this.state;
        var {numFolio, fin, error} = this.state;

        //if(fin===1) { fin=0; movimiento[name]=''; }
        if(fin===1) { fin=0; numFolio=''; }
        error=0;

        //movimiento[name] = movimiento[name] + value;
        numFolio = numFolio + value;

        //this.setState({ movimiento : movimiento, fin : fin, error : error });
        this.setState({ numFolio : numFolio, fin : fin, error : error });
    }

    handleChange(event)
    {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]:value });
        //this.folio.focus();
        //this.numFolio.focus();
    }

    justificarBaja()
    {
        swal({
            title: 'Selecciona un motivo',
            input: 'radio',
            inputOptions: {1:'Quebrada', 2:'En mal estado', 3:'Otro'},
            inputValidator: (value) => { return !value && 'Debes seleccionar una opción' }
        }).then((result) =>
        {
            if(result.value === '3')
            {
                swal({ title: 'Cual es el motivo?', input: 'text', })
                .then((result) => 
                {
                    this.pedirAutorizacion('3:'+result.value);
                });
            }
            else
            {
                this.pedirAutorizacion(result.value);
            }
        });
    }

    pedirAutorizacion(motivo)
    {
        var { movimiento, fin, error, insumo, tarjeta } = this.state;
        let temp = this;

        movimiento.motivo = motivo;
        swal({
            title: 'Clave De Autorización',
            input: 'password',
            inputPlaceholder: 'Enter your password',
        }).then((result) =>
        {
            if(result.value===tarjeta)
            {
                api().post('/MovimientoNuevo',movimiento)
                .then(function(response)
                {
                    error=2;
                    if(response.status === 200)
                    {
                        if(response.data)
                        {
                            error = 1;
                            swal('Movimiento autorizado','','success');
                        }
                        else
                        {
                            error = 0;
                            swal('Movimiento rechazado','','error');
                        }
                        fin=1;
                        temp.setState({ movimiento : movimiento, error : error, insumo : insumo, fin : fin });  
                    }
                    //target.select();
                })
                .catch(error =>
                {
                    error=2;
                    this.limpiarState();
                    //target.select();
                });
            }
            else
            {
                swal('Autorización inválida','','error');
                temp.setState({ movimiento : movimiento, error : error, insumo : insumo, fin : fin });  
            }
            this.limpiarState();
            //target.select(); 
        });
    }

    guardarMovimiento(motivo,x)
    {
        var { movimiento, error, fin, reportes, concentrado } = this.state;
        let temp = this;
        movimiento.motivo = motivo;
        concentrado=[];

        api().post('/MovimientoNuevo',movimiento)
        .then(function(response)
        {
            error=2;
            if(response.status === 200)
            {
                if(response.data) 
                {
                    if(response.data.registrado)
                    {
                        error = 1;
                        reportes.push(response.data.movimiento);
                        reportes.forEach( function(elemento) { concentrado.push(elemento); })
                        fin=1;
                    }
                    temp.setState({ movimiento : movimiento, error : error, fin : fin, reportes : reportes, concentrado : concentrado });
                }  
            }
        })
        .catch(error =>
        {
            error=2;
            this.limpiarState();
            temp.setState({ error : error, fin : fin });
        });
    }

    handleKeyPress(event)
    {
        const target = event.target;
        //var { movimiento, fin, error, tMov, insumo, almacen } = this.state;
        var { numFolio, movimiento, fin, error, tMov, insumo, almacen } = this.state;
        var datos = [];
        if (event.key === 'Enter') fin=1;
        if(almacen === '0')
        {
            swal({ position: 'top-end', toast: true, type: 'error', title: 'Debes seleccionar un almacen', showConfirmButton: false, timer: 2500});
        }
        //if (event.key === 'Enter' && movimiento.folio && almacen !=='0')
        if (event.key === 'Enter' && numFolio && almacen !=='0')
        {
            //datos = movimiento.folio.toString().split("^");
            datos = numFolio.toString().split("^");
            if (datos.length === 6 )
            {
                movimiento.folio = datos[0];
                numFolio = datos[0];
                insumo = datos[4];
                movimiento.movimiento_id = tMov;
                movimiento.almacen_id = almacen;

                if( tMov === 1 || tMov === 2 || tMov === 4 )
                {
                    this.guardarMovimiento('','');
                }
                if( tMov === 5 )
                {
                    this.justificarBaja();
                }
                
                if( tMov === 3 || tMov === 6)
                {
                    this.pedirAutorizacion('');
                }
                this.setState({ numFolio : numFolio, insumo : insumo});
            }
            else
            {
                error=2;                        
                this.limpiarState();
                this.setState({ error : error, fin : fin });
            }
        }
        else
        {
            movimiento.folio = '';
            this.setState({ numFolio : numFolio, movimiento : movimiento });
        }
        target.select();
    }

    limpiarState()
    {
        this.setState({
            numFolio : '', movimiento : { folio : '', botella_id : '', movimiento_id : '', almacen_id : '', fecha : '', user : '' }
        });
    }

    seleccionarMovimiento(event,btn)
    {
        var {clase, tMov} = this.state;
        for(var i=1;i<=6;i++) { clase[i] = this.state.unBoton; }
        clase[btn] = this.state.elBoton;
        tMov = btn;
        this.setState({ clase : clase, tMov : tMov });
        //this.folio.focus();
    }

    imprimirReporte()
    {
        //var { reportes, concentrado } = this.state;
        window.open("http://localhost:8000/api/reporteDeTraspaso", '_blank');
    }
    
    render() 
    {
        //var { tMov, almacenes, error, movimiento, insumo, boton, reportes, insumos } = this.state;
        var { tMov, almacenes, error, numFolio, insumo, boton, concentrado } = this.state;
        // console.log(reportes);
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-xl-7 col-lg-9 col-md-10 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong> Registro De Movimientos </strong>
                                    { tMov === 1 ? <Entrada /> : tMov === 2 ? <Salida /> : tMov === 3 ? <Cancelacion /> : tMov === 4 ? <Venta /> : tMov === 5 ? <Baja /> : <Traspaso /> }
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label> Almacen: </label>
                                                <select value={this.state.almacen} className="form-control" name="almacen" onChange={this.handleChange}>
                                                    <option value="0"> Selecciona un almacen... </option>
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
                                        </div>
                                        <div className="col-lg-12 text-center">
                                            <div className="row ">
                                                { boton[1] === 1 ? <div className="col-md-6"> <button className={this.state.clase[1]} onClick={(e)=>this.seleccionarMovimiento(e,1)} type="button"> <strong> ENTRADA     </strong> </button> </div> : "" }
                                                { boton[2] === 1 ? <div className="col-md-6"> <button className={this.state.clase[2]} onClick={(e)=>this.seleccionarMovimiento(e,2)} type="button"> <strong> SALIDA      </strong> </button> </div> : "" }
                                                { boton[3] === 1 ? <div className="col-md-6"> <button className={this.state.clase[3]} onClick={(e)=>this.seleccionarMovimiento(e,3)} type="button"> <strong> CANCELACIÓN </strong> </button> </div> : "" }
                                                { boton[4] === 1 ? <div className="col-md-6"> <button className={this.state.clase[4]} onClick={(e)=>this.seleccionarMovimiento(e,4)} type="button"> <strong> VENTA       </strong> </button> </div> : "" }
                                                { boton[5] === 1 ? <div className="col-md-6"> <button className={this.state.clase[5]} onClick={(e)=>this.seleccionarMovimiento(e,5)} type="button"> <strong> BAJA        </strong> </button> </div> : "" }
                                                { boton[6] === 1 ? <div className="col-md-6"> <button className={this.state.clase[6]} onClick={(e)=>this.seleccionarMovimiento(e,6)} type="button"> <strong> TRASPASO    </strong> </button> </div> : "" }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label> Folio: </label>
                                                <input className="form-control" type="text"  autoFocus value = {numFolio /*movimiento.folio*/} name="numFolio" onKeyPress = {this.handleKeyPress} onChange = {this.handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label> Descripcion de insumo: </label>
                                                <label className="form-control" type="text" value = {insumo} name="insumo" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-9 col-md-10 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa fa-align-justify"> </i> <strong> Reporte de Movimientos </strong>
                                    <button className="btn btn-primary" type="button" onClick={this.imprimirReporte} > 
                                        <i className="icons font-2xl d-block cui-print"></i>
                                    </button>
                                </div>
                                <div className="card-body">
                                    <table className="table table-responsive-sm table-sm">
                                        <thead>
                                            <tr>
                                                <th width='10%'> <center> No.         </center> </th>
                                                <th width='20%'> <center> Folio       </center> </th>
                                                <th width='15%'> <center> Movimiento  </center> </th>
                                                <th width='55%'> <center> Descripcion </center> </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            concentrado.map((item, i) => 
                                                <tr key = { i } >
                                                    <td width='10%'> <center> { i + 1 }             </center> </td>
                                                    <td width='20%'> <center> { item.folio }        </center> </td>
                                                    <td width='15%'> <center> { <TipoDeMovimiento mov = {parseInt(item.movimiento_id,10)} /> } </center> </td>
                                                    <td width='55%'> <center> { item.desc_insumo }  </center> </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>  
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-7 col-lg-9 col-md-10 col-sm-12">
                        {
                            error === 0 ? "" : 
                            error === 2 ? <VentanaDeError/> : ''
                        }
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

export default connect(mapStateToProps, actions)(Traspasos)
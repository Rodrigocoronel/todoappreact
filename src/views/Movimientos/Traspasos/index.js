import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/dash.js';
import {api,API_URL} from '../../../actions/_request';
import swal from 'sweetalert2';
import TraspasosReporte from './TraspasosReporte';

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
            Traspaso_valid : {
                id : 0,
                recibe : '',
                origen : 0,
                destino : 0,
                movimientos : [],
                movimientos_detallados : [],
                edit : 0
            },
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

        api().get('/last_traspaso')
        .then((res)=>{
            
            if(!res.data.error){
                temp.setState({ Traspaso_valid: res.data.trasp });
            }
        })
        .catch((err)=>{console.log(err)})

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
        {                //     Entrada      Salida    Cancelacion    Venta       Baja        Traspaso              Movimiento y boton Actuales
            if(almacen === 1) { boton[1]=0; boton[2]=1; boton[3]=0; boton[4]=0; boton[5]=1; boton[6]=0; tMov=2; clase[2]=this.state.elBoton; }
            if(almacen === 2) { boton[1]=1; boton[2]=1; boton[3]=0; boton[4]=0; boton[5]=1; boton[6]=0; tMov=1; }
            if(almacen >= 3)  { boton[1]=1; boton[2]=0; boton[3]=1; boton[4]=1; boton[5]=1; boton[6]=1; tMov=1; }
        }
        this.setState({boton : boton, tMov : tMov, clase : clase});
    }

    handleChange(event)
    {
        event.preventDefault();
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]:value });
        document.getElementById("folio").focus();
        document.getElementById("folio").select();
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
            
            if(result.value === '3' && result.value !== undefined)
            {
                swal({ 
                    title: 'Cual es el motivo?', 
                    input: 'text', 
                    inputValidator: (value) => { return !value && 'Debes escribir una motivo' }
                })
                .then((result) => 
                {
                   if(result.value !== undefined)
                    this.pedirAutorizacion( result.value);
                });
            }
            else if(result.value !== undefined)
            {
                this.pedirAutorizacion( result.value );
            }
        });
    }

    pedirAutorizacion(motivo)
    {
        var { movimiento, fin, error, tarjeta , tarjeta_es} = this.state;
        let temp = this;

        movimiento.motivo = motivo;
        swal({
            title: 'Clave De Autorización',
            input: 'password',
            inputPlaceholder: 'Enter your password',
        }).then((result) =>
        {
            if(result.value.length > 0)
            {
                let first = result.value.substring(1,17);
                let second = result.value.substring(18,21);

                movimiento.tarjeta = first+second;
                
                api().post('/MovimientoNuevo',movimiento)
                .then(function(response)
                {
                    error=2;
                    if(response.status === 200)
                    {
                        if(response.data.registrado)
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
                        temp.setState({ movimiento : movimiento, error : error, fin : fin });  
                    }
                })
                .catch( error =>
                {
                    error=2;
                    this.limpiarState();
                    
                });
            }
            else
            {
                swal('Autorización inválida','','error');
                temp.setState({ movimiento : movimiento, error : error, fin : fin }); 
            }
            this.limpiarState();
        });
    }

    //Scanner
    handleInputChange(event)
    {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        var {numFolio,almacen} = this.state;

        if(almacen !== 0){
            numFolio = value;
            this.setState({ [name] : numFolio });
        }
    }

    //Cuando se detecta un enter
    handleKeyPress(event)
    {
        //event.stopPropagation();

        const target = event.target;
        var { numFolio, movimiento, error, tMov, insumo, almacen, Traspaso_valid } = this.state;
        var datos = [];

        if(almacen === '0')
        {
            swal({ position: 'top-end', toast: true, type: 'error', title: 'Debes seleccionar un almacen', showConfirmButton: false, timer: 2500});
        }
        else
        {
            //if (event.key === 'Enter' && movimiento.folio && almacen !=='0')
            if (event.key === 'Enter' &&  almacen !=='0')
            {
                //datos = movimiento.folio.toString().split("^");
                datos = numFolio.toString().split("^");

                let newsd = numFolio.toString().split("&")
                
                if(newsd.length === 7){
                    datos = newsd;
                }

                if (datos.length === 7 )
                {
                    movimiento.folio = datos[0];
                    numFolio = datos[0];
                    insumo = datos[4];
                    movimiento.movimiento_id = tMov;
                    movimiento.almacen_id = almacen;

                    if( tMov === 1 || tMov === 4 || tMov === 6)
                    {
                        this.guardarMovimiento('','',event);
                    }
                    if( tMov === 2 )
                    {
                        if(Traspaso_valid.edit){
                            movimiento.trasp_id = Traspaso_valid.id;
                            this.guardarMovimiento('','',event);
                        }else{
                            swal({title : 'Crea un nuevo traspaso', type : 'info'})
                            this.setState({numFolio:''})
                        }
                    }
                    if( tMov === 5 )
                    {
                        this.justificarBaja();
                    }
                    if( tMov === 3 )
                    {
                        this.pedirAutorizacion('');   
                    }
                }
                else
                {
                    error=2;                        
                    this.limpiarState();
                    this.setState({ error : error});
                }
            }
            else
            {
                movimiento.folio = '';
                this.setState({ numFolio : numFolio, movimiento : movimiento });
            }
        }
    }


    //guardar el movimiento
    guardarMovimiento(motivo,x,event)
    {
        var { movimiento, error, numFolio, insumo} = this.state;
        var warehouse = '';
        var transit = '';
        var mensaje = '';
        let temp = this;

        let target = event.target;
        movimiento.motivo = motivo;

        numFolio='';
        insumo='';
        api().post('/MovimientoNuevo',movimiento)
        .then(function(response)
        {
            error=2;

            if(response.data) 
            {
                if(response.data.registrado)
                {
                    error = 1;
                    //guardar los movimientos solo si el movimiento es de salida

                    if(movimiento.movimiento_id === 2){
                        temp.setState({Traspaso_valid : response.data.movimiento})
                    }
                     swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Registrado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                     numFolio=response.data.movimiento.folio;
                     insumo=response.data.movimiento.desc_insumo;
                }
                else
                {
                    warehouse = response.data.ubicacion.almacen;
                    transit = parseInt(response.data.ubicacion.transito,10);
                    if(transit > 0)
                    {
                        switch(transit)
                        {
                            case 1: mensaje='se encuentra EN TRÁNSITO salio de ' + warehouse + "."; break;
                            case 4: mensaje='fue VENDIDA en ' + warehouse + "."; break;
                            case 5: mensaje='fue DADA DE BAJA en ' + warehouse + "."; break;
                            case 6: mensaje='salio como TRASPASO de ' + warehouse + "."; break;
                            default:
                        }
                    }
                    else
                    {
                        mensaje = 'se encuentra en ' + warehouse + ".";
                    }
                    swal.fire({
                        position: 'top-end',
                        type: 'error',
                        title: 'Error con código de botella',
                        html: `La botella ${mensaje}`,
                    });
                }
                temp.setState({ movimiento : movimiento, error : error, numFolio : numFolio, insumo : insumo });
                target.select();
            }  
        })
        .catch(error =>
        {
            error=2;
            this.limpiarState();
            temp.setState({ error : error});
            target.select();
        });
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

        let _self = this;

        this.setState({ clase : clase, tMov : tMov });

        document.getElementById("folio").focus();
        document.getElementById("folio").select();
    }

    imprimirReporte=()=>
    {
        let {datosTraspaso} = this.props;
        let {Traspaso_valid} = this.state;
        let _self = this;

        Traspaso_valid.edit = 0;

        swal({
            title: '¿Estas Seguro?',
            text: "Al imprimir el reporte se cerrara el traspaso "+ Traspaso_valid.id,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Imprimir!'
        }).then((result) => {
            if (result.value) {
                window.open(API_URL+"/reporteDeTraspaso/"+Traspaso_valid.id, '_blank');
                _self.setState({Traspaso_valid : Traspaso_valid})
            }
            document.getElementById("folio").focus();
            document.getElementById("folio").select();
        });
    }

    nuevoTraspaso=(e)=>{

        var { almacen, almacenes } = this.state;
        let _self = this;
        var opciones=[];
        var recibe='';
        if(almacen==0)
        {
            swal.fire('Debes seleccionar un almacen de salida');
        }
        else
        {
            var inputOptionsPromise = new Promise( function (resolve)
            {
                almacenes.forEach((val)=>{ opciones.push( val.nombre ) });
                resolve(opciones);
            })

            swal({ 
                title: '¿Quien Recibe?', 
                input: 'text', 
                inputValidator: (value) => { return !value && 'Debes escribir quien recibe' }
            })
            .then((result) => 
            {
                if(result.value !== undefined)
                {
                    recibe=result.value;
                    swal.fire({
                        title: '¿A que area se envia?',
                        input: 'select',
                        inputOptions: inputOptionsPromise,
                        inputPlaceholder: 'Seleciona una opcion...',
                        showCancelButton: true,
                        inputValidator: (value) => {
                            return new Promise((resolve) => {
                                if (opciones[value] === this.state.almacen) 
                                {
                                    resolve('No puede enviarse al area de salida')
                                }
                                else 
                                {
                                    let data = { recibe : result.value, origen : almacen, destino : opciones[value] };

                                    api().post('/nuevo_traspaso', data)
                                    .then((res)=>{
                                        if(res.data.error){
                                            swal({title : 'No disponible', type : 'error'});
                                        }
                                        else
                                        {
                                            _self.setState({Traspaso_valid : res.data.trasp});
                                            document.getElementById("folio").focus();
                                            document.getElementById("folio").select();
                                        }
                                    })
                                    resolve()
                                }
                            })
                        }
                    })
                }
            })
            .catch((err)=>
            {
            });     
        }

    }
    
    render() 
    {
        var { tMov, almacenes, error, numFolio, insumo, boton, concentrado } = this.state;
        console.log(this.state.Traspaso_valid)
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-xl-7 col-lg-9 col-md-10 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong> Registro De Movimientos </strong>
                                    {   
                                        tMov === 1 ? <Entrada /> 
                                        : tMov === 2 ? <Salida /> 
                                        : tMov === 3 ? <Cancelacion /> 
                                        : tMov === 4 ? <Venta /> 
                                        : tMov === 5 ? <Baja /> 
                                        : <Traspaso /> 
                                    }
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label> Almacen: </label>
                                                <select 
                                                    value={this.state.almacen} 
                                                    className="form-control" 
                                                    name="almacen" 
                                                    onChange={this.handleChange}>
                                                    <option value="0"> Selecciona un almacen... </option>
                                                    {
                                                        almacenes.map((item, i) =>
                                                            parseInt(item.activo,10) === 1 ?
                                                                this.props.auth.user.area === -3 ? 
                                                                    <option key={i} value={item.id} > {item.nombre} </option>  
                                                                : this.props.auth.user.area === item.id ? 
                                                                    <option key={i} value={item.id} > {item.nombre} </option>  : ""
                                                            : ""
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 text-center">
                                            <div className="row ">
                                                { boton[1] === 1 ? 
                                                    <div className="col-md-6"> 
                                                        <button 
                                                            className={this.state.clase[1]} 
                                                            onClick={(e)=>this.seleccionarMovimiento(e,1)} 
                                                            type="button"> 
                                                            <strong> ENTRADA     </strong> 
                                                        </button> 
                                                    </div> : "" 
                                                }
                                                { boton[2] === 1 ? 
                                                    <div className="col-md-6"> 
                                                        <button 
                                                            className={this.state.clase[2]} 
                                                            onClick={(e)=>this.seleccionarMovimiento(e,2)} 
                                                            type="button"> 
                                                            <strong> SALIDA      </strong> </button> 
                                                        </div> : "" 
                                                }
                                                { boton[3] === 1 ? 
                                                    <div className="col-md-6"> 
                                                        <button 
                                                            className={this.state.clase[3]} 
                                                            onClick={(e)=>this.seleccionarMovimiento(e,3)} 
                                                            type="button"> 
                                                            <strong> CANCELACIÓN </strong> 
                                                        </button> 
                                                    </div> : "" 
                                                }
                                                { boton[4] === 1 ? 
                                                    <div className="col-md-6"> 
                                                        <button 
                                                            className={this.state.clase[4]} 
                                                            onClick={(e)=>this.seleccionarMovimiento(e,4)} 
                                                            type="button"> 
                                                            <strong> VENTA       </strong> 
                                                        </button> 
                                                    </div> : ""
                                                }
                                                { boton[5] === 1 ? 
                                                    <div className="col-md-6"> 
                                                        <button 
                                                            className={this.state.clase[5]} 
                                                            onClick={(e)=>this.seleccionarMovimiento(e,5)} 
                                                            type="button"> 
                                                            <strong> BAJA        </strong> 
                                                        </button> 
                                                    </div> : "" 
                                                }
                                                { boton[6] === 1 ? 
                                                    <div className="col-md-6"> 
                                                        <button 
                                                            className={this.state.clase[6]} 
                                                            onClick={(e)=>this.seleccionarMovimiento(e,6)} 
                                                            type="button"> 
                                                            <strong> TRASPASO    </strong> 
                                                        </button> 
                                                    </div> : "" 
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label> Folio: </label>
                                                <input className="form-control" 
                                                    type="text"   
                                                    value={ numFolio } 
                                                    name="numFolio"  
                                                    onChange={this.handleInputChange} 
                                                    onKeyPress={this.handleKeyPress}
                                                    autoFocus
                                                    id="folio"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label> Descripcion de insumo: </label>
                                                <label className="form-control" type="text" name="insumo" >{insumo}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            tMov === 2 &&
                            <TraspasosReporte 
                                nuevoTraspaso={this.nuevoTraspaso} 
                                datosTraspaso={this.state.Traspaso_valid} 
                                imprimirReporte={this.imprimirReporte}
                            />
                        }

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
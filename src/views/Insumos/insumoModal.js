import React from 'react';
import { connect } from 'react-redux';

import {api} from '../../actions/_request';

import {
    Modal,
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Button,
    Label,
    Input, 
    Row, 
    Col
} from 'reactstrap';

import Moment from 'moment';

import swal2 from 'sweetalert2';

export default class ModalPrestamo extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
        insumo : {
            id : '',
            insumo : '',
            desc_insumo : '',
        },
        action : 'save',
    };

    this.handleInputChange = this.handleInputChange.bind(this);           
    this.resetModal= this.resetModal.bind(this);            
  }

  componentDidMount()
  {    
    let id = this.props.id;
    let self = this;

            
    if(id != null )
    {

      api().get(`/producto_id/${id}`)
      .then(function(response)
      {  
        self.setState({
            insumo: response.data,
            action: 'update',
        });
      });
    }
    else
    {            
        self.resetModal();
    }

  }

    resetModal(){
        this.setState({
            prestamo : {
                id : '',
                insumo : '',
                descripcion : '',
            },
            action : 'save',
        });
    }  

    handleInputChange(event){
        let {insumo} = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(target.type == 'number'){
            if(value.length <= event.target.getAttribute('maxlengh')){
                insumo[name] = value;
            }
        }else{
            insumo[name] = value;
        }
        
        this.setState({
            insumo : insumo
        });
    }

    handleSubmit = (evt) =>{

        evt.preventDefault();
        let {action, insumo} = this.state;

        let url = '';
        let _self = this;
    
        if(action == 'save'){
            url = '/prod';
        }else{
            url = '/edit_prod';
        }

        api().post(url, insumo)
        .then((res)=>{
            if(!res.data){
                _self.props.toggle();
                _self.props.refresh();
            }else{
                swal2(
                  'Error!',
                  'Insumo duplicado',
                  'error'
                )
            }            

        })
        .catch((err)=>{console.log(err)})
        
    }
    
    render()
    {
        let {insumo , action} = this.state;

        return( 
          <Modal isOpen={this.props.open} toggle={this.props.toggle} className="default modal-lg ">
            <form onSubmit={this.handleSubmit}>
                <ModalHeader toggle={this.props.toggle}>{this.props.title}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="12" sm="12"> 
                            <div className="form-group">
                                <label className="">Insumo:</label>
                                <Input
                                    name="insumo"
                                    type="number"
                                    onChange={this.handleInputChange}
                                    value={insumo.insumo}
                                    maxlengh={6}
                                />
                            </div>
                        </Col>
                        <Col xs="12" sm="12"> 
                            <div className="form-group">
                                <label className="">Descripcion:</label>
                                <Input
                                    placeholder=""                                                       
                                    type="textarea"
                                    name="desc_insumo"
                                    value={insumo.desc_insumo}
                                    onChange={this.handleInputChange}
                                    required
                                    cols={4}
                                />
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    {
                    <div>
                        <Button color="success" type="submit">
                            Guardar
                        </Button>
                        <Button color="secondary" onClick={this.props.toggle}>
                            Cerrar
                        </Button>
                    </div>
                    }
                </ModalFooter>
            </form>
          </Modal>
        );
  }
}

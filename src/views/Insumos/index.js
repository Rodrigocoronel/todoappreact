import React from 'react';
import { connect } from 'react-redux';

import {api} from '../../actions/_request'
import * as actions from '../../actions/dash.js';

import Moment from 'moment';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import swal2 from 'sweetalert2';

import ModalPrestamo from './insumoModal';

import _ from "lodash";

import { Button,
    Card, 
    CardBody, 
    CardGroup, 
    CardHeader, 
    Col, 
    Row,
    Container,  
    Input
} from 'reactstrap';


const requestData = (pageSize, page, sorted, filtered,filtro) => {

    return new Promise((resolve, reject) => {

        // You can retrieve your data however you want, in this case, we will just use some local data.
        let filteredData;

        var insumo = '';
        var desc_insumo = '';

        var take = pageSize;
        var skip = pageSize * page;
        var total = 12;

        for (var i = filtered.length - 1; i >= 0; i--) {
            switch (filtered[i].id) {
                case "insumo":
                    insumo = filtered[i].value;
                    break;

                case "desc_insumo":
                    desc_insumo = filtered[i].value;
                    break;

            }
        }

        api().get(`/productos_list?insumo=${insumo}&desc_insumo=${desc_insumo}&take=${take}&skip=${skip}`)
            .then(function (response) {
                    filteredData = response.data.rows;
                    total = response.data.total;


                    const res = {
                        rows: filteredData,
                        pages: Math.ceil(total / pageSize),
                    };
                    resolve(res)
                
            }).catch((err)=>{
                swal2(
                  'Error!',
                  'Consulte a WeNatives',
                  'error'
                )
            });

    });
};


class Insumos extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            modal : false,
            id : 0,
            filtro : '3',
            pages : 0,
            loading : true,
            recargar : false,
            data : [],
        }

        this.table = React.createRef();
    }

    fetchData = (state, instance) => {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        
        let _self = this;

        // Request the data however you want.  Here, we'll use our mocked service we created earlier

        this.setState({ loading: true });

        requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered,
            this.state.filtro,
        ).then(res => {
            // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
            this.setState({
                data: res.rows,
                pages: res.pages,
                loading: false,
            });

            //this.props.fetch(res.rows);
        });
        
    }

    toggleModal=(evt, id=null)=>{

        let {modal} = this.state;

        this.setState({
          modal : !modal,
          id : id,
        })
    }

    refreshTable=()=>{
        this.fetchData(this.table.current.state)
    }

     handleSelectChange = (evt) =>{

        const target = evt.target;
        const value = evt === null ? null : evt.target.value;
        const name = target.name;

        this.setState({
            [name] : value
        }, () => {
           this.fetchData(this.table.current.state)
        });
        
    }

    render(){

        const cols = [
            {
                Header: 'Acciones',
                filterable: false,
                sortable: false,
                maxWidth:80,
                Cell: (row) =>
                {
                    return(
                        <div className="text-center">
                            <Button
                             color="success" 
                             className="btn-sm" 
                             onClick={(evt)=>this.toggleModal(evt, row.original.id)}>
                               <i className="fa fa-edit fa-lg "></i>
                            </Button>                                              
                             
                        </div>
                    )
                }
            },
            {
                Header: 'Insumo',
                accessor : 'insumo',
                filterable:true,            
            },
            {
                Header:'Descripcion',
                accessor : 'desc_insumo',
                filterable:true,
            }
        ];


        let {filtro,pages,loading,data} = this.state;

        let {user} = this.props.auth;

        let columns = [];

        columns = cols;
            
        return(
            <Container>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col sm="6">Prestamos</Col>
                                <Col sm="6" className="text-right">
                                    <Button onClick={this.toggleModal}><i className="fa fa-plus-square fa-lg"></i> Agregar</Button>
                                </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            
                            <Col sm="12">
                                <ReactTable
                                        data={data}
                                        columns={columns}
                                        defaultPageSize={20}
                                        className="-striped -highlight"
                                        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                                        pages={pages} // Display the total number of pages
                                        loading={loading} // Display the loading overlay when we need it
                                        onFetchData={_.debounce(this.fetchData, 500)} // Request new data when things change
                                        ref={this.table}
                                    />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                {
                  this.state.modal&& 
                   <ModalPrestamo
                    open={this.state.modal} 
                    toggle={this.toggleModal} 
                    title='Prestamo' 
                    id={this.state.id}
                    refresh={this.refreshTable}
                  />
                }
            </Container>
        )
    }

}

function mapStateToProps(state, ownProps) {
    return {
        dash : state.dash,
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Insumos)
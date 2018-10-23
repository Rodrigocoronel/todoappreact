import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import logo from '../../assets/img/brand/logob.jpg'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions/auth.js';


class Login extends Component {

  constructor(props){
      super(props)

      this.state={
        email : '',
        password : '',
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(evt){
    evt.preventDefault();
    let{email,password} = this.state;
    this.props.login({email : email, password : password});
  }

  render() {

    let {email,password} = this.state;

    if(this.props.auth.authenticated)
      return <Redirect to={'/app'} />;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    {this.props.auth.error_message}
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="E-mail" autoComplete="username"
                          name='email'
                          required 
                          value={email}
                          onChange={this.handleInputChange}
                         />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" 
                          name='password'
                          required 
                          value={password}
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" onClick={this.submit} className="px-4">Login</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <img src={logo} width="300"/>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
    return {
        auth : state.auth
    }
};

export default connect(mapStateToProps, actions)(Login)

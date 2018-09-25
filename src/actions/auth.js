import { request,api } from './_request';

export const login = (params) =>
{
	console.log(params)
	if(params.email=='rodrigo@email.com' && params.password == 'abc123'){
		return (dispatch) => {
	        dispatch({
	            type : 'LOGIN_SUCCES' ,
	        });
    	}
	}else{
		return (dispatch) => {
			dispatch({
	            type : 'LOGIN_FAILURE' ,
	        });
	    }
	}
    
};
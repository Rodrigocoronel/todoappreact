import { request,api } from './_request';

export const login = (params) =>
{   
    return (dispatch) =>
    {		
        request.post('/oauth/token', 
        {
            username        : params.email,
            password        : params.password,
            client_id       : 2,
            client_secret   : 'D64E8GGRiUFFyajFkP8ZRqLK1sHxUKEaOn38m3vB',
            grant_type      : 'password'
        }).then(function(response)
        {
            if(response.status === 200)
            {
                localStorage.setItem('session_token_PAPAS', JSON.stringify(response.data));
                dispatch(
                {
                    type: 'CONECTADO',
                    payload: response.data
                });
            }
            else
            {
                dispatch(
                {
                    type: 'DESCONETADO',
                    payload: 'Datos incorrectos.'
                });
            }
        });  
    }
}
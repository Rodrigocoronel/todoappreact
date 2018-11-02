import {api ,request } from './_request';

export const logout = (params) =>
{   
    return (dispatch) =>
    {   
        //Borrar de la base de datos

        api().post('/logout')
        .then(function(response)
        {
            if(response.status === 200)
            {
                //Borrar de la memoria local
                localStorage.removeItem('session_token_PAPAS');
                dispatch({
                    type: 'DESCONECTADO',
                    payload: 'Desconectado'
                })
            }
        });
    }
}

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
        })
        .then(function(response)
        {
            if(response.status === 200)
            {
                localStorage.setItem('session_token_PAPAS', JSON.stringify(response.data));
                dispatch(
                {
                    type: 'CONECTADO',
                    payload: response.data
                })
            }
        })
        .catch(function(error)
        {
            dispatch(
            {
                type: 'ERROR',
                payload: 'Datos incorrectos.'
            })
        })
    }
}
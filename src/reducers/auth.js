const initialState =
{
    error_message      : '',
    loading            : false,
    authenticated      : false,
    user               : undefined,
    session_token      : undefined,
};

export default (state = initialState, action) =>
{
    switch (action.type)
    {
        case "CONECTADO":
            return { 
                ...state, 
                authenticated : true
            };
        case "DESCONECTADO":
            return { 
                ...state, 
                authenticated : false,
                error_message : 'La sesion del usuario ha sido cerrada',
            };
        case "ERROR":
            return {
                ...state,
                authenticated: false,
                error_message : 'Usuario o Password Incorrectas',
            };
        case "AUTH_WHOIAM_SUCCESS":
            return {
                ...state,
                user: action.payload,
            };
        default:
            return state;
    }
    
}
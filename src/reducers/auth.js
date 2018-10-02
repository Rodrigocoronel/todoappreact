const initialState =
{
    error_message      : '',
    loading            : false,
    authenticated      : true,
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
                authenticated: true
            };
        case "DESCONECTADO":
            return { 
                ...state, 
                authenticated: false,
                error_message : 'Usuario o Password Incorrectas',
            };

        default:
            return state;
    }
    
}
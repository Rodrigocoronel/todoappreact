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
        case "LOGIN_SUCCES":
            return { 
                ...state, 
                authenticated: true
            };
        case "LOGIN_FAILURE":
            return { 
                ...state, 
                authenticated: false,
                error_message : 'Usuario o Password Incorrectas',
            };

        default:
            return state;
    }
    
}
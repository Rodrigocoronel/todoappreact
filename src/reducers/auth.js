const initialState =
{
	error              : false,
    error_message      : '',
    loading            : false,
    authenticated      : false,
    user               : undefined,
    session_token      : undefined,
    permisos           :[],
};

export default (state = initialState, action) =>
{
    switch (action.type)
    {
        case "AUTH_SIGNIN_SUCCESS":
            return { 
                ...state, 
                ...initialState, 
                session_token: action.payload, 
                authenticated: true
            };
        
        case "AUTH_SIGNIN_FAILURE":
            return { 
                ...state, 
                ...initialState,
                error: true, 
                error_message: action.payload
            };

        case "AUTH_SIGNOUT_SUCCESS":
            return initialState;


        default:
            return state;
    }
    
}
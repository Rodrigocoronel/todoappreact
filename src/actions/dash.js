import { api } from './_request';

export const fetch = () => {

    return(dispatch) => {

        api().get('url')
         .then(function(response)
         {
            if(response.status === 200){
                 dispatch({
                    type: "INVENTORY_FETCH_SUCCESS",
                    payload: response.data
                });
            }
         })
         .catch(function(error)
         {
            console.log(error);
            dispatch({
                type : "FETCHING_FAILURE_CLIENT"
            });
         });

    }

}
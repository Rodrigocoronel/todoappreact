import axios from 'axios';

 export const API_URL = 'http://api.botellas.com/api';
 export const API_UR = 'http://api.botellas.com';

 // export const API_URL = 'http://localhost:8000/api';
 // export const API_UR = 'http://localhost:8000';
 
export const request = axios.create({
	baseURL 		: API_UR,
	responseType 	: 'json'
});

export const api = () => {

	let token = localStorage.getItem('session_token_PAPAS');

	token = JSON.parse(token);

	let AuthorizationToken = token.token_type+" "+token.access_token;

	return axios.create({
		baseURL 		: API_URL,
		responseType 	: 'json',
		headers 		: {'Authorization': AuthorizationToken }

	});
}

export const api_formdata = () => {

	let token = localStorage.getItem('session_token_PAPAS');

	token = JSON.parse(token);

	let AuthorizationToken = token.token_type+" "+token.access_token;

	return axios.create({
		baseURL 		: API_URL,
		responseType 	: 'json',
		headers 		: {'Authorization': AuthorizationToken,'Content-Type': 'multipart/form-data', }

	});

}
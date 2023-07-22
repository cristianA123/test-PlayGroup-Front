import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // URL base de tu API
  timeout: 5000, // Tiempo máximo de espera para la petición (en milisegundos)
//   headers: {
//     'Content-Type': 'application/json', // Encabezado común para todas las solicitudes
//     // Otros encabezados comunes que desees agregar
//   }
});

export default axiosInstance;
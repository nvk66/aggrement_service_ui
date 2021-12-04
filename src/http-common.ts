import axios from "axios";
import authHeader from "./service/user.service";

const host = 'http://localhost:8081/api';

class AxiosService {

    createDefault() {
        return axios.create({
            baseURL: host,
            headers: {
                'Content-type': 'application/json',
            }
        });
    }

    createAuthorizedRequest() {
        return axios.create({
            baseURL: host,
            headers: {
                'Content-type': 'application/json',
                'Authorization': authHeader()
            }
        });
    }
}

export default new AxiosService();

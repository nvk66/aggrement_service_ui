import axios from "axios";

export default axios.create({
    baseURL: config.apiUrl,
    headers: {
        "Content-type": "application/json",
    }
});

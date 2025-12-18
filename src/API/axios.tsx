import axios from "axios";

const baseURL = () => axios.create({

    baseURL: "//localhost:5173/"
})


export default baseURL
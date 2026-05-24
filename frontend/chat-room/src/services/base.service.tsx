import axiosInstance from "../config/axios.config";

abstract class HttpService {
  #config: any;

  #setHeaders(config: any) {
    // 1. Initialize headers and merge any custom headers passed to the method
    let headers: any = {
      "Content-Type": "application/json",
      ...config.headers 
    };
    let params: any = {};

    // content-type for file uploads
    if (config.file || config.files) {
      headers = {
        ...headers, // Keep Authorization/other headers intact
        "Content-Type": "multipart/form-data"
      };
    }

    // refresh token handling
    if (config.refresh) {
      let token = "";
      headers = {
        ...headers,
        "Refresh": "Bearer " + token
      };
    }

    // query strings
    if (config.params) {
      params = config.params;
    }

    this.#config = {
      headers: headers,
      params: params,
    };
  }

  async getRequest(url: string, config: any = {}) {
    try {
      this.#setHeaders(config);
      let response = await axiosInstance.get(url, this.#config);
      return response;
    } catch (exception) {
      throw exception;
    }
  }

  async postRequest(url: string, data: any = null, config: any = {}) {
    try {
      this.#setHeaders(config);
      let response = await axiosInstance.post(url, data, this.#config);
      return response;
    } catch (exception) {
      throw exception;
    }
  }

  async putRequest(url: string, data: any = null, config: any = {}) {
    try {
      this.#setHeaders(config);
      let response = await axiosInstance.put(url, data, this.#config);
      return response;
    } catch (exception) {
      throw exception;
    }
  }

  async patchRequest(url: string, data: any = null, config: any = {}) {
    try {
      this.#setHeaders(config);
      let response = await axiosInstance.patch(url, data, this.#config);
      return response;
    } catch (exception) {
      throw exception;
    }
  }

  async deleteRequest(url: string, config: any = {}) {
    try {
      this.#setHeaders(config);
      let response = await axiosInstance.delete(url, this.#config);
      return response;
    } catch (exception) {
      throw exception;
    }
  }
}

export default HttpService;
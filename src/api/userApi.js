import axiosClient from "./axiosClient";
class UserApi {
  getAllCustomer() {
    let url = "user/get";
    return axiosClient.get(url);
  }

  getLimitCustomers(page = 1, limit = 10) {
    let url = `user/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }
  //// employee
  getLimitEmployees(page = 1, limit = 10) {
    let url = `employee/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }

  addEmployee(formData) {
    let url = `/employee/add`;
    return axiosClient.post(url, formData);
  }

  updateEmployee(formData) {
    let url = `/employee/update`;
    return axiosClient.put(url, formData);
  }
  getOneEmployeeByPhone(phonenumber) {
    let url = `employee/one?phonenumber=${phonenumber}`;
    return axiosClient.get(url);
  }

  // customer group/ customer type
  getAllCustomerType() {
    let url = `typeCustomer/get`;
    return axiosClient.get(url);
  }

  addOneType(formData) {
    let url = `typeCustomer/add`;
    return axiosClient.post(url, formData);
  }

  updateOneType(formData) {
    let url = `typeCustomer/update`;
    return axiosClient.put(url, formData);
  }

  getOneTypeById(id) {
    let url = `typeCustomer/getId?id=${id}`;
    return axiosClient.get(url);
  }
}

const userApi = new UserApi();
export default userApi;
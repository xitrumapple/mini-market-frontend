import axiosClient from "./axiosClient";

class PriceLineApi {
  addOne(formData) {
    let url = `price/add`;
    return axiosClient.post(url, formData);
  }

  updateOne(id, formData) {
    let url = `price/update?id=${id}`;
    return axiosClient.put(url, formData);
  }

  getByHeaderId(headerId) {
    let url = `price/getPriceHeader?priceHeaderId=${headerId}`;
    return axiosClient.get(url);
  }

  getOneBy_PUT_id(id) {
    let url = `price/proUnitId?productUnitTypeId=${id}`;
    return axiosClient.get(url);
  }
}

const priceLineApi = new PriceLineApi();
export default priceLineApi;

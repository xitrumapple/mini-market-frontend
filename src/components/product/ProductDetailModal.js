import React, { useRef, useState } from "react";
import UploadImageProduct from "../admin/UploadImageProduct";
import {
  Modal,
  Button,
  Cascader,
  DatePicker,
  Form,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Input,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Divider,
  message,
} from "antd";
import ModalCustomer from "../ModalCustomer";
import { PlusOutlined } from "@ant-design/icons";
import SelectCategory from "./SelectCategory";
import SelectSubCategory from "./SelectSubCategory";
import { useEffect } from "react";
import productApi from "../../api/productApi";
import UnitTypeList from "./UnitTypeList";
import { useDispatch } from "react-redux";
import { refreshProducts, setRefresh } from "../../store/slices/productSlice";
import CategoryDetailModal from "../category/CategoryDetailModal";
import unitTypeApi from "./../../api/unitTypeApi";
const { Text } = Typography;

const initFormState = {
  id: "",
  name: "",
  images: [
    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  ],
  description: "",
  state: true,
  subCategoryId: "",
  categoryId: "",
  unitList: [
    {
      id: "",
      name: "",
      convertionQuantity: 1,
      state: true,
    },
  ],
};

const initErrMessage = {
  id: "",
  name: "",
  images: "",
  description: "",
  quantity: "",
  categoryId: "",
  subCategoryId: "",
  unitList: [
    {
      name: "",
    },
  ],
};

const ProductDetailModal = ({ modalState, setModalState }) => {
  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    if (modalState.type == "update" && modalState.visible) {
      loadFormStateWhenUpdate();
    }

    return () => {};
  }, [modalState.rowSelected]);

  async function loadFormStateWhenUpdate() {
    const { id, name, images, description, quantity, state, SubCategory } =
      modalState.rowSelected;
    let unitList;

    let res = await unitTypeApi.findAllByProductId(id);
    if (res.isSuccess) {
      unitList = res.unitTypes;
    }
    console.log(unitList);

    let _errMess = { ...errMessage };
    _errMess.unitList = (unitList || []).map((item) => {
      return {
        name: "",
      };
    });
    setErrMessage(_errMess);

    setFormState({
      ...formState,
      id,
      name,
      images,
      description,
      quantity,
      state,
      subCategoryId: SubCategory.id,
      categoryId: SubCategory.CategoryId,
      unitList: unitList.map((item) => {
        return {
          ...item,
          isExistOnDB: true,
        };
      }),
    });
  }

  async function onSubmit(type, isClose) {
    let is = await checkForm(type);
    // xóa những id == ""
    if (is) {
      let formData = {
        id: formState.id,
        name: formState.name,
        images: formState.images,
        description: formState.description,
        quantity: formState.quantity,
        state: formState.state,
        subCategoryId: formState.subCategoryId,
        unitTypes: formState.unitList.map((item) => {
          return {
            id: item.id,
          };
        }),
      };
      let res = null;
      console.log(formData);

      if (type == "create") {
        res = await productApi.addOne(formData);
        dispatch(setRefresh(true));
      }

      if (type == "update") {
        res = await productApi.updateOne(formData);
        dispatch(setRefresh(true));
      }

      if (res.isSuccess) {
        if (type == "create") {
          message.info("Thêm mới sản phẩm thành công.");
        }

        if (type == "update") {
          message.info("Cập nhật sản phẩm thành công");
        }

        if (isClose) {
          onCloseModal();
        } else {
          clearForm();
        }
      } else {
        message.error("Lỗi hệ thống, vui lòng thử lại!");
      }
    } else {
      message.error("Thông tin điền vào không hợp lệ!");
    }
  }

  async function checkForm(type) {
    let isCheck = true;
    let _errMess = { ...errMessage };
    const {
      id,
      name,
      images = [],
      description,
      state,
      subCategoryId,
      categoryId,
      unitList,
    } = formState;
    if (!id) {
      _errMess.id = "Không được bỏ trống!";
      isCheck = false;
    } else {
      _errMess.id = "";
    }
    if (!name) {
      console.log(name);
      _errMess.name = "Không được bỏ trống!";
      isCheck = false;
    } else {
      _errMess.name = "";
    }

    if (images && images.length <= 0) {
      _errMess.images = "Phải có ít nhất 1 hình ảnh!";
      isCheck = false;
    } else {
      _errMess.images = "";
    }

    if (!categoryId) {
      _errMess.categoryId = "Không được bỏ trống!";
      isCheck = false;
    } else {
      _errMess.categoryId = "";
    }

    if (!subCategoryId) {
      _errMess.subCategoryId = "Không được bỏ trống!";
      isCheck = false;
    } else {
      _errMess.subCategoryId = "";
    }

    unitList.map((item, index) => {
      const { name, convertionQuantity } = item;
      if (!name) {
        _errMess.unitList[index].name = "Không được bỏ trống!";
        isCheck = false;
      } else {
        _errMess.unitList[index].name = "";
      }
      if (!convertionQuantity) {
        _errMess.unitList[index].convertionQuantity = "Không được bỏ trống!";
        isCheck = false;
      } else {
        _errMess.unitList[index].convertionQuantity = "";
      }
      if (convertionQuantity == 1 && index != 0) {
        _errMess.unitList[index].convertionQuantity =
          "Chỉ một đơn vị cơ duy nhất!";
        isCheck = false;
      } else {
        _errMess.unitList[index].convertionQuantity = "";
      }
    });

    // validate with database
    if (type == "create") {
      if (id) {
        let p = await productApi.findById(id);
        if (p.isSuccess) {
          _errMess.id = "Mã đã tồn tại!";
          isCheck = false;
        } else {
          _errMess.id = "";
        }
      }
    }

    setErrMessage(_errMess);
    return isCheck;
  }

  function clearForm() {
    setErrMessage(initErrMessage);
    setFormState(initFormState);
  }

  function onCloseModal() {
    clearForm();
    setModalState({
      type: "",
      visible: false,
      rowSelected: null,
    });
  }

  return (
    <>
      <ModalCustomer visible={modalState.visible}>
        <div className="product_detail_modal">
          <Typography.Title level={4} className="title">
            {modalState.type == "update"
              ? "Cập nhật thông tin sản phẩm"
              : "Thêm mới sản phẩm"}
          </Typography.Title>
          <div className="form__container">
            <Form size="small">
              <Row gutter={[48]}>
                <Col span={12}>
                  <Row gutter={[12, 12]}>
                    <Col span={6}>
                      <Text>Mã sản phẩm</Text>
                    </Col>
                    <Col span={15}>
                      <Input
                        className="input"
                        placeholder=" COCA03"
                        size="small"
                        value={formState.id}
                        onChange={({ target }) => {
                          setFormState({
                            ...formState,
                            id: target.value,
                          });
                        }}
                        status={errMessage.id && "error"}
                        disabled={modalState.type == "update"}
                      />
                      <div className="input__err">{errMessage.id}</div>
                    </Col>
                    <Col span={6}>
                      <Text>Tên sản phẩm</Text>
                    </Col>
                    <Col span={15}>
                      <Input
                        className="input"
                        placeholder=" Cocacola 1,5 lit"
                        size="small"
                        value={formState.name}
                        onChange={({ target }) => {
                          setFormState({
                            ...formState,
                            name: target.value,
                          });
                        }}
                        status={errMessage.name && "error"}
                      />
                      <div className="input__err">{errMessage.name}</div>
                    </Col>
                    <Col span={6}>
                      <Text>Mô tả</Text>
                    </Col>
                    <Col span={15}>
                      <Input
                        className="input"
                        placeholder="Mô tả về sản phẩm"
                        size="small"
                        value={formState.description}
                        onChange={({ target }) => {
                          setFormState({
                            ...formState,
                            description: target.value,
                          });
                        }}
                        status={errMessage.description && "error"}
                      />
                      <div className="input__err">{errMessage.description}</div>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row gutter={[12, 12]}>
                    <Col span={8}>
                      <Text>Nhóm sản phẩm (cấp 1)</Text>
                    </Col>
                    <Col span={15}>
                      <SelectCategory
                        idSelected={formState.categoryId}
                        setIdCategorySelected={(id) => {
                          setFormState({
                            ...formState,
                            categoryId: id,
                            subCategoryId: null,
                          });
                        }}
                        status={errMessage.categoryId && "error"}
                      />
                      <div className="input__err">{errMessage.categoryId}</div>
                    </Col>
                    <Col span={8}>
                      <Text>Nhóm sản phẩm (cấp 2)</Text>
                    </Col>
                    <Col span={15}>
                      <SelectSubCategory
                        idSelected={formState.subCategoryId}
                        idCategorySelected={formState.categoryId}
                        setIdSubCateSelected={(id) =>
                          setFormState({ ...formState, subCategoryId: id })
                        }
                        status={errMessage.subCategoryId && "error"}
                      />
                      <div className="input__err">
                        {errMessage.subCategoryId}
                      </div>
                    </Col>
                    <Col span={8}>
                      <Text>Trạng thái</Text>
                    </Col>
                    <Col span={15}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={formState.state}
                        onChange={(value) => {
                          setFormState({
                            ...formState,
                            state: value,
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col span={24}>
                  <p style={{ paddingBottom: "4px", paddingTop: "4px" }}>
                    Hình ảnh
                  </p>
                  <UploadImageProduct />
                  <div className="input__err">{errMessage.images}</div>
                </Col>
                <Col span={24}>
                  <UnitTypeList
                    unitList={formState.unitList}
                    setUnitList={(list) => {
                      setFormState({ ...formState, unitList: list });
                    }}
                    errList={errMessage.unitList}
                    setErrList={(errList) =>
                      setErrMessage({
                        ...errMessage,
                        unitList: errList,
                      })
                    }
                    typeOfModal={modalState.type}
                  />
                </Col>
              </Row>
            </Form>
            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                paddingTop: "12px",
              }}
            >
              {modalState.type == "create" ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create");
                    }}
                  >
                    Lưu & Thêm mới
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create", true);
                    }}
                  >
                    Lưu & Đóng
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    onSubmit("update", true);
                  }}
                >
                  Cập nhật
                </Button>
              )}
              <Button type="primary" danger onClick={() => onCloseModal()}>
                Hủy bỏ
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </>
  );
};

export default ProductDetailModal;
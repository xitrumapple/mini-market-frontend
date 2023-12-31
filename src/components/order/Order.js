import {
  Button,
  Col,
  Dropdown,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  MoreOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  HolderOutlined,
  StopOutlined,
  DownOutlined,
  RedoOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import "../../assets/styles/bill.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  convertToVND,
  handleAfter,
  sqlToDDmmYYY,
  sqlToHHmmDDmmYYYY,
} from "./../../utils/index";
import DropSelectColum from "./../product/DropSelectColum";
import promotionApi from "./../../api/promotionApi";
import { setPromotionHeaders } from "../../store/slices/promotionHeaderSlice";
import billApi from "./../../api/billApi";
import { setBills, setRefreshBills } from "../../store/slices/billSlice";
import { setOpen } from "../../store/slices/modalSlice";
import storeApi from "../../api/storeApi";

const { Text } = Typography;

const Order = ({}) => {
  let hideLoading = null;
  const { bills, refresh, count } = useSelector((state) => state.bill);
  const dispatch = useDispatch();

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
  });

  const [allColumns, setAllColumns] = useState([]);
  useEffect(() => {
    let _allCol = [
      {
        title: "Mã đơn hàng",
        dataIndex: "id",
        width: 160,
        fixed: "left",
        fixedShow: true,
        render: (_, row) => (
          <Typography.Link
            onClick={() => {
              onRowIdClick(row);
            }}
          >
            {row.id}
          </Typography.Link>
        ),
      },
      {
        title: "Ngày đặt",
        dataIndex: "orderDate",
        render: (orderDate) => {
          return sqlToHHmmDDmmYYYY(orderDate);
        },
      },
      {
        title: "Tổng tiền",
        dataIndex: "cost",
        align: "right",
        render: (cost) => {
          return convertToVND(cost);
        },
      },

      {
        title: "Mã khách hàng",
        dataIndex: "CustomerId",
        render: (CustomerId, rowData) => {
          return (
            <Typography.Link
              onClick={() => {
                dispatch(
                  setOpen({
                    name: "CustomerCUModal",
                    modalState: {
                      idSelected: CustomerId,
                      type: "view",
                      visible: true,
                    },
                  })
                );
              }}
            >
              {CustomerId}
            </Typography.Link>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "type",
        render: (type) => {
          if (type == "pending") {
            return <Tag color="green">Đang chờ xử lí</Tag>;
          } else {
            return <Tag color="error">Đã hủy </Tag>;
          }
        },
      },
      {
        title: "Xử lí",
        width: 120,
        fixed: "right",
        render: (_, rowData) => {
          let type = rowData.type;
          if (type == "pending")
            return (
              <Popover
                placement="leftTop"
                content={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <>
                      <Button
                        size="small"
                        style={{
                          marginBottom: 12,
                        }}
                        type="primary"
                        onClick={() => {
                          orderToBill(rowData.id);
                        }}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        size="small"
                        danger
                        onClick={() => {
                          cancelOrder(rowData.id);
                        }}
                      >
                        Hủy đơn hàng
                      </Button>
                    </>
                  </div>
                }
              >
                <Button size="small" icon={<MenuUnfoldOutlined />}></Button>
              </Popover>
            );
        },
      },
    ];

    setAllColumns(_allCol);
    return () => {};
  }, []);

  useEffect(() => {
    getOrders(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      console.log("refresh");
      getOrders(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  async function getOrders(page, limit) {
    hideLoading = message.loading("Tải dữ liệu hóa đơn...", 0);
    let res = await billApi.getLimitOrders(page, limit);

    if (res.isSuccess) {
      dispatch(setBills(res.bills));
    } else {
      dispatch(
        setBills({
          rows: [],
          count: 0,
        })
      );
    }
    hideLoading();
  }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    setPageState({
      page: pageNumber,
      limit: pageSize,
    });
  }

  function onRowIdClick(row) {
    dispatch(
      setOpen({
        name: "BillCUModal",
        modalState: {
          visible: true,
          type: "order-view",
          idSelected: row.id,
        },
      })
    );
  }

  async function orderToBill(billId) {
    hideLoading = message.loading("Đang xử lí...");
    let res = await billApi.updateType(billId, "success");
    if (res.isSuccess) {
      message.info("Thao tác thành công", 3);
      dispatch(setRefreshBills());
    } else {
      message.info("Có lỗi xảy ra, vui lòng thử lại!", 3);
    }
    hideLoading();
  }

  async function cancelOrder(billId) {
    hideLoading = message.loading("Đang xử lí...");
    let res = await billApi.updateType(billId, "cancel");
    if (res.isSuccess) {
      message.info("Thao tác thành công", 3);
      dispatch(setRefreshBills());
    } else {
      message.info("Có lỗi xảy ra, vui lòng thử lại!", 3);
    }
    hideLoading();
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  return (
    <div className="products promotion">
      <div className="table__header">
        <div className="left">
          <Typography.Title
            level={4}
            style={{
              margin: 0,
            }}
          >
            Danh sách đơn đặt hàng{" "}
          </Typography.Title>
        </div>

        <div className="btn__item">
          <DropSelectColum
            allColumns={allColumns}
            setAllColumns={setAllColumns}
          />
        </div>
      </div>

      {/* table */}

      <Table
        columns={allColumns.filter((col) => !col.hidden)}
        dataSource={bills}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.66,
        }}
        className="table"
      />
      <div className="pagination__container">
        <Pagination
          onChange={onChangePageNumber}
          total={count}
          pageSize={10}
          current={pageState.page}
          hideOnSinglePage
        />
      </div>
    </div>
  );
};

export default Order;

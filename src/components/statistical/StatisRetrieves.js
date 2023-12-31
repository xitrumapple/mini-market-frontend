import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Popover,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import React from "react";
import DropSelectColum from "../product/DropSelectColum";
import { PlusOutlined } from "@ant-design/icons";
import {
  convertToVND,
  getStartToDay,
  sqlToAntd,
  sqlToDDmmYYY,
} from "../../utils";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImportExcelButton from "../common/ImportExcelButton";
import DownLoadTemplate from "../common/DownLoadTemplate";
import ExportExcelButton from "../common/ExportExcelButton";
import { useEffect } from "react";
import promotionApi from "../../api/promotionApi";
import {
  setAllBillsCustomers,
  setAllRetrieves,
  setAllStoreInputs,
} from "../../store/slices/statisticSlice";
import statisApi from "../../api/statisApi";
import DatePickerCustom from "../promotion/DatePickerCustom";
import HighlightedText from "../HighlightedText";

const StatisRetrieves = () => {
  const { data, refresh } = useSelector((state) => state.statis.allRetrieves);

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  let hideLoading = null;

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    fromDate: new Date("2023/04/01"),
    toDate: new Date(),
    productId: "",
    productName: "",
    billId: "",
  });

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  function clearFilter() {
    setFilterState({
      fromDate: getStartToDay(),
      toDate: new Date(),
    });
  }

  useEffect(() => {
    setAllColumns([
      {
        title: "STT",
        width: 40,
        dataIndex: "index",
      },

      {
        title: "Hóa đơn mua",
        dataIndex: "billId",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.billId}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    billId: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.billId} />
          );
        },
      },

      {
        title: "Ngày đơn hàng mua",
        dataIndex: "orderDate",
        width: 160,
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return sqlToDDmmYYY(_);
          }
        },
      },
      {
        title: "Hóa Đơn Trả",
        dataIndex: "retrieveBillId",
        width: 160,
      },
      {
        title: "Ngày đơn hàng trả",
        dataIndex: "retrieveDate",
        width: 160,
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return sqlToDDmmYYY(_);
          }
        },
      },
      {
        title: "Nhóm SP (c1)",
        dataIndex: "category",
        width: 160,
      },
      {
        title: "Nhóm SP (c2)",
        dataIndex: "subCategory",
        width: 160,
      },
      {
        title: "Mã SP",
        dataIndex: "productId",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.productId}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    productId: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.productId} />
          );
        },
      },
      {
        title: "Tên SP",
        dataIndex: "productName",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.productName}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    productName: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.productName} />
          );
        },
      },
      {
        title: "Đơn vị tính (báo cáo)",
        dataIndex: "unitType",
        width: 100,
      },
      {
        title: "Số lượng (ĐVT báo cáo)",
        dataIndex: "quantity",
        width: 80,
        align: "right",
      },
      {
        title: "Số lượng lẻ",
        dataIndex: "quantity2",
        width: 80,
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return _ || 0;
          }
        },
      },
      {
        title: "Tổng số lượng",
        dataIndex: "totalQuantity",
        width: 100,
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return _ || rowData.quantity + (rowData.quantity2 || 0);
          }
        },
      },
      {
        title: "Doanh Thu",
        dataIndex: "totalMoney",
        width: 160,
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return convertToVND(_);
          }
        },
      },
    ]);

    return () => {};
  }, [filterState]);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, [filterState.fromDate, filterState.toDate]);

  useEffect(() => {
    handleUpliedFilters();

    return () => {};
  }, [filterState, data]);

  async function loadAllData() {
    setIsLoading(true);

    let res = await statisApi.getAllRetrieves({
      fromDate: filterState.fromDate,
      toDate: filterState.toDate,
    });

    if (res.isSuccess) {
      dispatch(setAllRetrieves(res.bills));
    } else {
      dispatch(setAllRetrieves([]));
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      if (filterState.billId) {
        _list = _list.filter((item) => {
          let billId = item.billId?.toLowerCase();
          let searchInput = filterState.billId?.toLowerCase();

          if (billId.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.productId) {
        _list = _list.filter((item) => {
          let productId = item.productId?.toLowerCase();
          let searchInput = filterState.productId?.toLowerCase();

          if (productId.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.productName) {
        _list = _list.filter((item) => {
          let productName = item.productName?.toLowerCase();
          let searchInput = filterState.productName?.toLowerCase();

          if (productName.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }

      setTimeout(() => {
        setDataAfterFilted(
          (_list || []).map((item, index) => {
            return {
              ...item,
              index: index + 1,
            };
          })
        );
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let startIndex = pageState.limit * (pageState.page - 1);
    let endIndex = startIndex + pageState.limit;
    let _dataTable = dataAfterFilted.slice(startIndex, endIndex);
    _dataTable.unshift({
      isFirstRow: true,
    });
    setDataTable(_dataTable);

    return () => {};
  }, [pageState]);

  useEffect(() => {
    setPageState({
      page: 1,
      limit: 10,
      total: dataAfterFilted && dataAfterFilted.length,
    });

    return () => {};
  }, [dataAfterFilted]);

  function onChangePageNumber(pageNumber) {
    setPageState({
      ...pageState,
      page: pageNumber,
    });
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  return (
    <div className="statis_container">
      <div className="products">
        <div className="table__header">
          <div className="left">
            <Typography.Title
              level={4}
              style={{
                margin: 0,
              }}
            >
              Danh sách thống kê
              {/* {isLoading && (
                <Spin
                  style={{
                    marginLeft: 12,
                  }}
                />
              )} */}
            </Typography.Title>
          </div>
          <div className="btn__item">
            <DatePickerCustom
              value={[filterState.fromDate, filterState.toDate]}
              onChangeDate={(strings) => {
                if (strings && strings[0] && strings[1]) {
                  setFilterState({
                    ...filterState,
                    fromDate: strings[0],
                    toDate: strings[1],
                  });
                } else {
                  setFilterState({
                    ...filterState,
                    fromDate: getStartToDay(),
                    toDate: new Date(),
                  });
                }
              }}
            />
          </div>
          <div className="btn__item">
            <Button onClick={clearFilter} type={"primary"} danger>
              Xóa Lọc
            </Button>
          </div>

          <div className="btn__item">
            <ExportExcelButton
              data={dataAfterFilted.map((item) => {
                return {
                  index: item.index,
                  billId: item.billId,
                  orderDate: sqlToDDmmYYY(item.orderDate),
                  retrieveBillId: item.retrieveBillId,
                  retrieveDate: sqlToDDmmYYY(item.retrieveDate),
                  category: item.category,
                  subCategory: item.subCategory,
                  productId: item.productId,
                  productName: item.productName,
                  unitType: item.unitType,
                  quantity: item.quantity,
                  quantity2: item.quantity2 || 0,
                  totalQuantity: item.quantity + (item.quantity2 || 0),

                  totalMoney: item.totalMoney,
                };
              })}
              nameTemplate={"StatisRetrieves"}
              headerNameList={allColumns}
              fromDate={filterState.fromDate}
              toDate={filterState.toDate}
            />
          </div>
          <div className="btn__item">
            <DropSelectColum
              allColumns={allColumns}
              setAllColumns={setAllColumns}
            />
          </div>
        </div>
      </div>

      {/* table */}

      <Table
        columns={allColumns}
        dataSource={dataTable}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.66,
        }}
        className="table"
        pagination={false}
        loading={isLoading}
      />
      <div className="pagination__container">
        <Pagination
          onChange={onChangePageNumber}
          total={pageState.total}
          pageSize={pageState.limit}
          current={pageState.page}
          hideOnSinglePage
        />
      </div>
    </div>
  );
};

export default StatisRetrieves;

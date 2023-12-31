import { SearchOutlined } from "@ant-design/icons";
import { Empty, message, Select, Spin } from "antd";
import { useState } from "react";
import productApi from "./../../api/productApi";
import { Highlighter } from "react-highlight-words";
import HighlightedText from "../HighlightedText";
import { useDispatch, useSelector } from "react-redux";
import {
  addManyPriceLines,
  addPriceLine,
  setPriceLines,
} from "../../store/slices/priceLineSlice";

const SearchProductInput = ({ formState, ...props }) => {
  const { priceLines } = useSelector((state) => state.priceLine);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);
  const handleSearch = (input) => {
    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = async (productId) => {
    let res = await productApi.findOneById(productId);
    if (res.isSuccess) {
      let { product } = res;
      let { ProductUnitTypes } = product;

      let _listNewPriceLines = ProductUnitTypes.map((put) => {
        let _newPriceLine = {
          startDate: formState.time.start,
          endDate: formState.time.end,
          price: 0,
          state: false,
          DiscountRateProductId: null,
          ProductUnitTypeId: put.id,

          ProductUnitType: {
            ...put,
            Product: {
              ...product,
            },
          },
        };
        return _newPriceLine;
      });

      // check exist
      priceLines.map((item) => {
        _listNewPriceLines = _listNewPriceLines.filter(
          (newPriceLine) =>
            newPriceLine.ProductUnitType.id != item.ProductUnitType.id
        );
      });

      if (_listNewPriceLines.length == 0) {
        message.warning("Sản phẩm đã tồn tại trong bảng giá");
        return;
      }

      dispatch(addManyPriceLines(_listNewPriceLines));
    }

    setInput("");
  };

  return (
    <div>
      <Select
        showSearch
        value={input}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        onClick={() => handleSearch()}
        notFoundContent={
          fetching ? (
            <Spin size="small" />
          ) : (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Empty />
            </div>
          )
        }
        options={(data || []).map((item) => ({
          value: item.value,
          label: item.label,
        }))}
      />
      <SearchOutlined
        style={{
          fontSize: "16px",
          color: "#888",
          position: "relative",
          left: "-24px",
        }}
      />
    </div>
  );
};

async function fetchData(input, setData, setFetching) {
  setFetching(true);
  let products = [];
  let typeFind = "name";
  let res = await productApi.findManyByName(input);
  if (res.isSuccess) {
    products = res.products || [];
  }

  if (products.length == 0) {
    typeFind = "id";
    res = await productApi.findManyByName(input);
    if (res.isSuccess) {
      products = res.products || [];
    }
  }

  let data = products.map((p) => {
    return {
      value: p.id,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              style={{
                width: "32px",
                height: "32px",
              }}
              alt="alt"
            />
          </div>
          <div
            style={{
              paddingLeft: "8px",
            }}
          >
            {typeFind == "name" ? (
              <>
                <HighlightedText text={p.name} highlightText={input} />
                <div>{p.id}</div>
              </>
            ) : (
              <>
                <div>{p.name}</div>
                <HighlightedText text={p.id} highlightText={input} />
              </>
            )}
          </div>
        </div>
      ),
      product: p,
    };
  });
  setData(data);
  setFetching(false);
}

export default SearchProductInput;

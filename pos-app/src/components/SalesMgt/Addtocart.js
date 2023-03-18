import React, { useState, useEffect } from "react";
import { MDBCard, MDBCol, MDBInput, MDBRow, MDBBtn } from "mdb-react-ui-kit";
import "./Checkout.css";
import "./Addtocart.css";
import "./KeyBoard.css";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Axios from "axios";
import Keyboard from "react-simple-keyboard";

export const AddtoCart = (props) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState([]);
  const [selectCode, setSelectCode] = useState();
  const [selectName, setSelectName] = useState("Name");
  const [selectPrice, setSelectPrice] = useState();
  const [selectQuantity, setSelectQuantity] = useState();
  const [invoiceList, setInvoiceList] = useState([]);
  const [total, setTotal] = useState();
  const [keyPressed, setKeyPressed] = useState("");
  const [discount, setDiscount] = useState();
  useEffect(() => {
    Axios.get("http://localhost:3001/api/getProduct").then((response) => {
      setProductList(response.data);
    });
  });
  useEffect(() => {
    Axios.get("http://localhost:3001/api/getInvoiceList").then((response) => {
      setInvoiceList(response.data);
    });
  });
  useEffect(() => {
    Axios.get("http://localhost:3001/api/getTotal").then((response) => {
      setTotal(response.data[0].amount);
    });
  });
  const selectProduct = (pid, pname, price) => {
    setSelectCode(pid);
    setSelectName(pname);
    setSelectPrice(price);
    setSelectQuantity(1);
    setSearchKey("");
  };
  const setSearchKey = (input) => {
    setSearch(input);
    setKeyPressed(input);
  };

  const addToInvoice = () => {
    Axios.post("http://localhost:3001/api/addToInvoice/", {
      pid: selectCode,
      pname: selectName,
      price: selectPrice,
      quantity: selectQuantity,
    });
  };

  const netAmount = (discount) => {
    setDiscount(discount);
    console.log(discount)
    Axios.post("http://localhost:3001/api/setTotalDiscount/", {
      discount: discount,
    });
  };
  return (
    <>
      <section className="section">
        <div class="addtocart">
          <MDBRow className="m-0">
            <div className="addContainer" class="leftcontainer">
              {/* selected product area */}
              <MDBRow style={{ width: "100%" }}>
                <MDBCol className="flex col-md-2">
                  <MDBInput
                    className="mt-4 ml-3"
                    placeholder="Code"
                    value={selectCode}
                  />
                </MDBCol>

                <MDBCol className="col-md-3">
                  <MDBInput
                    className="mb-2 mt-4 ml-3"
                    placeholder="Name"
                    value={selectName}
                  />
                </MDBCol>

                <MDBCol>
                  <MDBInput
                    className="mb-2 mt-4 ml-3"
                    placeholder="Price"
                    type="number"
                    value={selectPrice}
                    onChange={(e) => setSelectPrice(e.target.value)}
                  />
                </MDBCol>

                <MDBCol>
                  <MDBInput
                    className="mb-2 mt-4 ml-3"
                    placeholder="Qty"
                    type="number"
                    defaultValue="1"
                    value={selectQuantity}
                    onChange={(e) => setSelectQuantity(e.target.value)}
                  />
                </MDBCol>

                <MDBCol>
                  <button class="select_btn" onClick={addToInvoice}>
                    Add Item
                  </button>
                </MDBCol>
              </MDBRow>

              <div class="search">
                <Container>
                  <Form style={{ paddingBottom: "10px" }}>
                    <InputGroup>
                      <Form.Control
                        value={search}
                        onChange={(e) => setSearchKey(e.target.value)}
                        placeholder="Search"
                      />
                    </InputGroup>
                  </Form>
                  <div
                    className="table-wrapper-scroll-y border"
                    style={{ width: "100%", height: "500px" }}
                  >
                    <Table hover style={{ color: "white" }}>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productList
                          .filter((product) => {
                            return search.toLowerCase() === ""
                              ? product
                              : product.pname
                                  .toLowerCase()
                                  .includes(search.toLocaleLowerCase());
                          })
                          .map((product) => (
                            <tr key={product.pid}>
                              <td>{product.pid}</td>
                              <td>{product.pname}</td>
                              <td>{product.price}</td>
                              <td>{product.stock}</td>
                              <td>
                                <button
                                  class="atc_btn"
                                  onClick={() => {
                                    selectProduct(
                                      product.pid,
                                      product.pname,
                                      product.price
                                    );
                                  }}
                                >
                                  ADD
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                </Container>
              </div>

              <MDBRow>
                <MDBCol className="mt-3 p-3">
                  <Keyboard
                    className="row"
                    onChange={(input) => setSearchKey(input)}
                    // onKeyPress={(button) => onKeyPress(button)}
                  />{" "}
                </MDBCol>
              </MDBRow>
            </div>

            {/* Right Cart */}
            <div class="rightside">
              <div class="rightcontainer">
                <div
                  className="table-wrapper-scroll-y my-custom-scrollbar border"
                  style={{ minHeight: "350px", background: "white" }}
                >
                  <Table hover>
                    <thead>
                      <tr>
                        <th style={{ width: "10px" }}>Code</th>
                        <th>Name</th>
                        <th>Discount</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceList.map((product) => (
                        <tr style={{ lineHeight: "0.5" }}>
                          <td>{product.product_id}</td>
                          <td>{product.name}</td>
                          <td>0.00</td>
                          <td>{product.price}</td>
                          <td>{product.quantity}</td>
                          <td>{product.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <MDBCard className=" flex-end my-3 p-3  ">
                  <div class="net_amount">
                    <div>
                      Total (Rs):<span>{total} </span>{" "}
                    </div>
                    <div
                      className=" d-flex justify-content-between col-sm-5"
                      style={{ marginLeft: "-15px" }}
                    >
                      Discount(%):
                      <MDBInput
                        style={{
                          height: "25px",
                          width: "65px",
                          marginLeft: "10px",
                        }}
                        type="number"
                        min={0}
                        max={100}
                        defaultValue="0"
                        onChange={(e) => {
                          netAmount(e.target.value);
                          // setDiscount(e.target.value);
                        }}
                      />
                      <span>{total} </span>
                    </div>
                    <div>
                      Net amount: <span>{total} </span>{" "}
                    </div>
                  </div>
                </MDBCard>

                <MDBRow>
                  <MDBCol>
                    <button class="end_btn">Cash</button>
                  </MDBCol>
                  <MDBCol>
                    <button class="end_btn">Card</button>
                  </MDBCol>
                  <MDBCol>
                    <button class="end_btn">Cancel</button>
                  </MDBCol>
                </MDBRow>
              </div>
            </div>
          </MDBRow>
        </div>
      </section>
    </>
  );
};

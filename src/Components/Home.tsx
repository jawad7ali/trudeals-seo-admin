import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import dealsService from "../services/dealsService";
import { Form, Input, Button, notification } from 'antd';
import { title } from "process";

const Home: FC<{}> = (): JSX.Element => {
  const [deals, setDeals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [editDeal, setEditDeal] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState<any>({});

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchDeals = async({
    currentPage,
    pageSize
  }: { currentPage: number; pageSize: number
    }) => {
    const deals = await dealsService.getDeals({ currentPage, pageSize })
    setDeals(deals?.data.data.dealsList || [])
  }

  useEffect(() => {
    fetchDeals({ currentPage, pageSize });
  }, [currentPage, pageSize]);

  const handlePageChange = (type: string) => {
    if (type === "prev") {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetDealDeatlils = async (dealId: number, businessId: number) => {
    const deals = await dealsService.dealDetails(dealId, businessId);
    setEditDeal(deals?.data.data.deal || {});
    return true;
  }

  const onFinish = (values: any) => {
    const updateDeal = {
      dealId: editDeal.id,
      ...editDeal,
      ...values
    }
    dealsService.updateDeal(updateDeal)
      .then((response: any) => {
        if (response.data.status === 400) {
          notification.error({
            message: 'Update Failed',
            description: response.data.message,
          });
        } else {
          notification.success({
            message: 'Update Successful',
            description: response.data.message,
          });
          setShowModal(false);
        }
      })
      .catch((error: any) => {
        notification.error({
          message: 'Update Error',
          description: error.response?.data?.error || 'An error occurred during login.',
        });
      });
  };

  useEffect(() => {
    editDeal?.title && setFormInitialValues( {
      title: editDeal?.title,
      seoTitle: editDeal.seoTitle,
      seoDescription: editDeal.seoDescription,
      seokeywords: editDeal.seokeywords,
    })
  }, [editDeal]);
  
  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <h3 className="m-3">Home</h3>
        </div>
        <div>
          <button type="submit" className="butn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="container">
        <div
          className="row d-flex justify-content-center align-items-center text-center"
          style={{ height: "100vh" }}
        >
          List of deals in table with pagination
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Deal ID</th>
                <th scope="col">Deal Name</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal: any) => (
                <tr key={deal.dealId}>
                  <td>{deal.dealId}</td>
                  <td>{deal.dealTitle}</td>
                  <td>{
                    deal.dealStatus === 1 ? 'Active' : 'Non-Active'
                  }</td>
                  <td>
                    <button className="butn"
                      onClick={async() => {
                        await fetDealDeatlils(deal.dealId, deal.businessId);
                        setShowModal(true);

                      }}
                    >Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="butn"
            onClick={() => {
              handlePageChange("prev");
            }}
          >Previous</button>
          <button className="butn"
            onClick={() => {
              handlePageChange("next");
            }}
          >Next</button>
        </div>
      </div>
      <div className="modal myModal"
        style={{ display: showModal ? "block" : "none" }}
      >
          <div className="modal-content">
            <span
              className="close"
              onClick={() => {
                setShowModal(false);
              }}
            >
              &times;
            </span>
          <h3>Edit Deal</h3>
          {formInitialValues?.title &&
            <Form
              initialValues={formInitialValues}
              name="deal"
              onFinish={onFinish}
              autoComplete="off"
              key={JSON.stringify(formInitialValues)}
            >
              <div className="form-group">
                <label htmlFor="dealName">Deal Name</label>
                <Form.Item
                  name="title"
                  id="title"
                  shouldUpdate={true}
                  rules={[{ required: true, message: 'Please input your dealName!' }]}
                >
                  <Input placeholder="dealName" value={editDeal.title} />
                </Form.Item>
              </div>
              <div className="form-group">
                <label htmlFor="price">Seo Title</label>
                <Form.Item
                  name="seoTitle"
                  id="price"
                // value={editDeal.seoTitle}
                >
                  <Input placeholder="seoTitle" value={editDeal.seoTitle} />
                </Form.Item>
              </div>
              <div className="form-group">
                <label htmlFor="price">Seo Description</label>
                <Form.Item
                  name="seoDescription"
                  id="price"
                >
                  <Input placeholder="seoDescription" value={editDeal.seoDescription} />
                </Form.Item>
              </div>
              <div className="form-group">
                <label htmlFor="price">Seo KeyWords</label>
                <Form.Item
                  name="seokeywords"
                  id="price"
                // value={editDeal.seoDescription}
                >
                  <Input placeholder="seokeywords" value={editDeal.seokeywords} />
                </Form.Item>
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Save
                </Button>
              </Form.Item>
            </Form>
          }
          </div>
        </div>
    </>
  );
};

export default Home;

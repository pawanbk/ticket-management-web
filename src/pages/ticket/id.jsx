import { React, useEffect, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { CustomToaster, Notify } from "../../shared/CustomToaster.tsx";
import { useNavigate, useParams } from "react-router-dom";
import TicketService from "../../api/TicketServices";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./id.css";
import CommentInput from "../../component/comment/CommentInput";
import CommentItem from "../../component/comment/CommentItem.tsx";
import { useAuthStore } from "../../store.tsx";
import io from "socket.io-client";
import UserService from "../../api/UserService.js";
import EditComment from "../../component/comment/edit-modal/EditComment.tsx";
import Upload from "./upload.jsx";

const socket = io("http://localhost:3001");

export default function TicketDetail() {
  const [activeTab, setActiveTab] = useState("information");
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({
    _id: "",
    title: "",
    status: "",
    author: "",
    description: "",
    files: [],
    comments: [],
  });

  const { user } = useAuthStore();
  const isEmailVerified = user?.email_verified;

  const [commentInput, setCommentInput] = useState("");
  const [assignees, setAssignees] = useState([]);

  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [commentInfo, setCommentInfo] = useState({});

  const editCommentClicked = (comment) => {
    setShowEditCommentModal(true);
    setCommentInfo(comment);
  };

  const addComment = async () => {
    try {
      const res = await TicketService.comment(id, commentInput);
      if (res.data?.success === true) {
        fetchTicket();
        socket.emit("sendNotification", {
          type: "comment",
          message: `${user?.username} commented on your ticket.`,
          from: user?._id || "",
          to: ticket.author,
          link: `/tickets/edit/${id}`,
        });
      }
    } catch (error) { }
    setCommentInput("");
  };

  const fetchTicket = async () => {
    try {
      const result = await TicketService.get(id);
      if (result.success === true && result.ticket) {
        setTicket(result.ticket);
        setSelectedAssignees(result.ticket.assignees.map((assignee) => assignee._id));
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        navigate("/404");
      }
    }
  };

  const updateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await TicketService.update(ticket, selectedAssignees);
      if (res.success === true) {
        await Notify(res.message, "success");
        fetchTicket();
      }
    } catch (error) { }
  };

  const handleChange = (e) => {
    return setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const addAssignees = async (e) => {
    if (selectedAssignees.includes(e.target.value)) {
      return;
    }
    setSelectedAssignees([...selectedAssignees, e.target.value]);
  };

  const fetchAssignees = () => {
    UserService.assignees()
      .then(async (res) => {
        if (res.data?.success === true) {
          setAssignees(
            await res.data.assignees.map((assignee) => {
              return { _id: assignee._id, fullName: assignee.firstName + " " + assignee.lastName };
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTicket();
    fetchAssignees();
  }, []);
  return (
    <AppLayout>
      <Breadcrumb className="d-flex justify-center">
        <LinkContainer to="/dashboard">
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to="/tickets">
          <Breadcrumb.Item>Tickets</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>{ticket.title}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex flex-row">
        <div className="edit-form border rounded">
          <div className="tabs">
            <ul className="border-bottom">
              <li className={ activeTab === 'information' ? 'active': '' } onClick={() => setActiveTab("information")}>Information</li>
              <li className={ activeTab === 'upload' ? 'active': '' } onClick={() => setActiveTab("upload")}>Files</li>
            </ul>
          </div>
          {activeTab === "information" && (
            <Form onSubmit={updateTicket}>
              <div className="row">
                <div className="col-lg-6 col-sm-12">
                  <Form.Group className="mb-3 form-group">
                    <Form.Label>Title</Form.Label>
                    <Form.Control required type="text" name="title" value={ticket.title} onChange={handleChange} disabled={ticket.author !== user._id} />
                  </Form.Group>
                </div>

                <div className="col-lg-6 col-sm-12">
                  <Form.Group className="mb-3 form-group">
                    <Form.Label>Status</Form.Label>
                    <Form.Select required type="select" name="status" onChange={handleChange} disabled={ticket.author !== user._id} value={ticket.status}>
                      <option>Select One</option>
                      <option value="unassigned">Unassigned</option>
                      <option value="awaiting-feedback">Awaiting Feedback</option>
                      <option value="complete">Complete</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-sm-12">
                  <Form.Group className="mb-3 form-group">
                    <Form.Label>Assignee Picker</Form.Label>
                    <Form.Select className="picker" type="select" name="assignees" onChange={addAssignees} disabled={ticket.author !== user._id} value="">
                      <option value="">Select</option>
                      {assignees?.map((assignee) => (
                        <option key={assignee?._id} value={assignee?._id}>
                          {assignee?.fullName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-lg-6 col-sm-12">
                  <Form.Group className="mb-3 form-group">
                    <Form.Label>Selected Assignees</Form.Label>
                    <div className={`border rounded assignee-holder ${ticket.author !== user._id ? "disabled" : ""}`}>
                      {selectedAssignees.length ? (
                        selectedAssignees.map((assignee, index) => (
                          <div key={index} className="badge bg-primary me-1">
                            {assignees.find((item) => item._id === assignee)?.fullName}
                            <span className="btn-cancel" onClick={() => setSelectedAssignees(selectedAssignees.filter((item) => item !== assignee))}>
                              &times;
                            </span>
                          </div>
                        ))
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="mb-3 form-group boxsizingBorder">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" placeholder="Leave a comment here" name="description" value={ticket.description} style={{ height: "100px" }} onChange={handleChange} disabled={ticket.author !== user._id} />
              </Form.Group>
              <Button className="form-control mt-3 button" type="submit" disabled= {!isEmailVerified || ticket.author === user._id} >
                Update
              </Button>
            </Form>
          )}

          {activeTab === "upload" && <Upload attachments={ticket?.files} ticket={ticket?._id} isEmailVerified={isEmailVerified}></Upload>}
        </div>
        <div className="comment-section d-flex flex-column gap-2 border-start border-top rounded">
          <h5>All Comments</h5>
          {ticket.comments
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .filter((comment) => !comment.parentId)
            .map((comment) => (
              <div key={comment._id} className="rounded comment-item">
                <CommentItem comment={comment} fetchTicket={fetchTicket} eventEditClicked={editCommentClicked} />
              </div>
            ))}
          <div className="comment-box">
            <CommentInput commentInput={commentInput} change={(e) => setCommentInput(e.target.value)} addComment={addComment} isEmailVerified={isEmailVerified} />
          </div>
        </div>
      </div>
      <CustomToaster />
      <EditComment setShow={setShowEditCommentModal} show={showEditCommentModal} comment={commentInfo} fetchTicket={fetchTicket} />
    </AppLayout>
  );
}

import React from "react";
import AppLayout from "../../layout/AppLayout";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./dashboard.css";
import TicketService from "../../api/TicketServices";
import { ListGroup } from "react-bootstrap";

export interface Ticket {
  _id: number,
  status: string,
  title: string,
  description: string
}
export default function Dashboard() {
  const [recentlyCreated, setRecentlyCreated] = useState([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState([]);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    unassigned: 0,
    awaiting: 0,
    completed: 0,
  });

  const fetchTickets = async () => {
    try {
      const data = await TicketService.getAll();
      if (data.success === true) {
        setTicketStats({
          total: data.tickets.length,
          unassigned: data.tickets.filter((ticket: Ticket) => ticket.status === "unassigned").length,
          awaiting: data.tickets.filter((ticket: Ticket) => ticket.status === "awaiting-feedback").length,
          completed: data.tickets.filter((ticket: Ticket) => ticket.status === "complete").length,
        });

        setRecentlyCreated(data.tickets.slice(0, 6));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentlyUpdated = async () => {
    try {
      const data = await TicketService.getRecentlyUpdated();
      if (data.success === true) {
        setRecentlyUpdated(data.tickets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchRecentlyUpdated();
  }, []);
  return (
    <AppLayout>
      <Breadcrumb className="d-flex justify-center">
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">Stats</div>
          <div className="card-body grid">
            <div className="alert alert-primary">Total: {ticketStats.total}</div>
            <div className="alert alert-danger">Unassigned: {ticketStats.unassigned}</div>
            <div className="alert alert-warning">Awaiting Feedback: {ticketStats.awaiting}</div>
            <div className="alert alert-success">Ticket Completed: {ticketStats.completed}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Quick Links</div>
          <div className="card-body">
            <ListGroup>
              <ListGroup.Item>
                <Link to="/tickets">All Tickets</Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to="/profile">Profile</Link>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Recently Created Tickets</div>
          <div className="card-body">
            <ListGroup style={{ width: "100%" }}>
              {recentlyCreated &&
                recentlyCreated.map((ticket: Ticket) => (
                  <ListGroup.Item key={ticket._id}>
                    <Link to={"/tickets/edit/" + ticket._id}>{ticket.title}</Link>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>
        </div>

        <div className="card ">
          <div className="card-header">Recently Updated Tickets</div>
          <div className="card-body">
            <ListGroup style={{ width: "100%" }}>
              {recentlyUpdated &&
                recentlyUpdated.map((ticket: Ticket) => (
                  <ListGroup.Item key={ticket._id}>
                    <Link to={"/tickets/edit/" + ticket._id}>{ticket.title}</Link>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import React from "react";
import { useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { LinkContainer } from "react-router-bootstrap";
import "./TicketList.css";
import DataTable from 'react-data-table-component';
import moment from "moment";
import AddTicket from "../component/AddTicket";
import TicketService from "../api/TicketServices";
import { CustomToaster, Notify } from "../shared/CustomToaster.tsx";
import { FormSelect, Form } from "react-bootstrap";
import { ITicket } from "../shared/interface";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store.tsx";

export default function TicketList() {
  const [modalShow, setModalShow] = useState(false);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const { user } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState({
    status: "all",
    title: "",
  });

  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
      cell: (row) => <Link to={"edit/" + row._id}>{row.title}</Link>
    },
    {
      name: 'Status',
      selector: row => row.status,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Created ',
      selector: row => moment(row.createdAt).format('DD.MM.YYYY'),
      sortable: true,
    },
  ];

  const fetchTickets = async () => {
    try {
      const data = await TicketService.getAll(selectedFilter);
      const tickets: ITicket[] = data.tickets;
      setTickets(tickets);
    } catch (error) {
      console.log(error);
    }
  };

  const addFilters = async (e) => {
    setSelectedFilter({ ...selectedFilter, [e.target.name]: e.target.value });
  };

  const notification = (message, status) => {
    Notify(message, status);
  };
  useEffect(() => {
    fetchTickets();
  }, [selectedFilter]);

  return (
    <AppLayout>
      <Breadcrumb className="d-flex justify-center">
        <LinkContainer to="/dashboard">
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Tickets</Breadcrumb.Item>
        <Breadcrumb.Item active>List</Breadcrumb.Item>
      </Breadcrumb>
      <div className="topbar">
        <Form.Control placeholder="Search.." onChange={addFilters} name="title" value={selectedFilter?.title} className="search-bar" />
        <FormSelect name="status" value={selectedFilter.status} onChange={addFilters} className="status-filter">
          <optgroup>
            <option value="all">All</option>
            <option value="unassigned">Unassigned</option>
            <option value="awaiting-feedback">Awaiting Feedback</option>
            <option value="complete">Complete</option>
          </optgroup>
        </FormSelect>

        {
          user?.email_verified &&
          <button className="customBtn" onClick={() => setModalShow(true)}>New</button>
        }

      </div>
      <DataTable
        columns={columns}
        data={tickets}
      />

      <AddTicket show={modalShow} onHide={() => setModalShow(false)} loadTickets={() => fetchTickets()} toaster={notification} />
      <CustomToaster />
    </AppLayout >
  );
}

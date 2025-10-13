import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import AppLayout from "../layout/AppLayout";
import { capitalize } from "lodash";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuthStore } from "../store.tsx";
import "./Profile.css";
import UserService from "../api/UserService.js";
import { CustomToaster, Notify } from "../shared/CustomToaster.tsx";

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const isEmailVerified = user?.email_verified;

  const [inputs, setInputs] = useState({
    displayName: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await UserService.update(inputs);
    if (res.status === 200 && res.data.success === true) {
      setUser(res.data.user);
      setInputs({
        displayName: res.data.user.username,
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName
      })
      Notify("Profile updated successfully", "success");
    }
  }

  const verifyEmail = async () => {
    const res = await UserService.verifyEmail();
    if (res?.status === 200 && res?.data?.success === true) {
      Notify("Verification email sent successfully", "success");
    }
  }

  return (
    <AppLayout>
      <Breadcrumb className="d-flex justify-center">
        <LinkContainer to="/dashboard">
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div className="wrapper h-auto w-full p-5 bg-white rounded">
        {
          user?.email_verified === false &&
          <div className="w-50 border-1 rounded d-flex flex-column items-center py-2 mb-3 m-auto">
            <strong>Verify your email address</strong>
            <span>Please click on the button to get your email verified.</span>
            <button className="verify-email-btn" onClick={verifyEmail}>Continue</button>
          </div>
        }

        <strong>Edit Profile</strong>
        <div className="grid-class pt-4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control defaultValue={user?.email} disabled />
          </Form.Group>
          <Form.Group className="mb-3 form-group">
            <Form.Label>Display Name</Form.Label>
            <Form.Control required type="text" name="displayName" value={capitalize(inputs.displayName)} disabled />
          </Form.Group>
        </div>
        <div className="grid-class">
          <Form.Group className="mb-3 form-group">
            <Form.Label>First name</Form.Label>
            <Form.Control required name="firstName" value={capitalize(inputs.firstName)} onChange={handleChange} disabled={!isEmailVerified} />
          </Form.Group>
          <Form.Group className="mb-3 form-group">
            <Form.Label>Last name</Form.Label>
            <Form.Control required type="text" name="lastName" value={capitalize(inputs.lastName)} onChange={handleChange} disabled={!isEmailVerified} />
          </Form.Group>
        </div>
        <button className={`customBtn ${!isEmailVerified ? "disabled" : ""}`} onClick={handleSubmit} disabled={!isEmailVerified} >Save changes</button>
      </div>
      <CustomToaster />
    </AppLayout >
  );
}

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import AuthService from "../../api/AuthService";
import CustomAlert from "../../shared/CustomAlert.tsx";
import { ISignupPayload } from "../../shared/interface";

export default function Register({ setActiveForm }) {
  const [inputs, setInputs] = useState<ISignupPayload>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();
    setErrors("");
    try {
      const res = await AuthService.register(inputs);
      setSuccess(res?.message);
      setInputs({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error?.response?.data && error.response.data.message) {
        setErrors(error.response.data.message);
      } else {
        setErrors(error);
      }
    }
  };
  return (
    <Form onSubmit={register}>
      {error && <CustomAlert variant="danger" message={error} />}
      {success && <CustomAlert variant="success" message={success} />}
      <Row>
        <Col>
          <Form.Group className="mb-3 form-group">
            <Form.Label>First name</Form.Label>
            <Form.Control required type="text" name="firstName" onChange={handleChange} value={inputs.firstName} placeholder="John" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3 form-group">
            <Form.Label>Last Name</Form.Label>
            <Form.Control required type="text" name="lastName" onChange={handleChange} value={inputs.lastName} placeholder="doe" />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3 form-group">
        <Form.Label>Email</Form.Label>
        <Form.Control required type="email" name="email" onChange={handleChange} value={inputs.email} placeholder="doe@gmail.com" />
      </Form.Group>
      <Form.Group className="mb-3 form-group">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" name="password" onChange={handleChange} value={inputs.password} />
        <Form.Text id="passwordHelpBlock" muted>
          Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3 form-group">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control required type="password" name="confirmPassword" onChange={handleChange} value={inputs.confirmPassword} />
      </Form.Group>
      <Button className="form-control button" type="submit">
        Register
      </Button>
      <div className="mt-3" style={{ float: "right" }}>
        Already have an account?
        <button onClick={() => setActiveForm("login")}>Login here</button>
      </div>
    </Form>
  );
}

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../api/AuthService.js";
import CustomAlert from "../../../shared/CustomAlert.tsx";
import { useAuthStore } from "../../../store.tsx";
import { ILoginPayload } from "../../../shared/interface.ts";
import LoadingAnimation from "../../../shared/LoadingAnimation.tsx";

export default function Login({ setActiveForm }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showEye, setShowEye] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<ILoginPayload>({
    email: "",
    password: "",
  });

  const { setUser } = useAuthStore();

  const { state } = useLocation()

  const handleChange = (e) => {
    if (e.target.name === "password") {
      e.target.value.length > 0 ? setShowEye(true) : setShowEye(false);
    }
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await AuthService.login(inputs);
      if (res?.status === "success") {
        setUser(res?.user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error?.data) {
        setError(error.data?.message);
      }
    }
    setIsLoading(false);
  };

  const togglePass = () => {
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  return (
    <Form onSubmit={onSubmit}>
      {state?.message && <CustomAlert variant="success" message={state.message} />}
      {error && <CustomAlert variant="danger" message={error} />}
      <Form.Group className="mb-3 form-group">
        <Form.Label>Username</Form.Label>
        <Form.Control required type="email" name="email" placeholder="doe@gmail.com" value={inputs.email} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3 form-group">
        <Form.Label>Password</Form.Label>
        <div className="inner-addon">
          <Form.Control required type={showPassword ? "text" : "password"} name="password" value={inputs.password} onChange={handleChange} />
          {showEye && (showPassword ? <EyeSlashFill onClick={togglePass} className="eye-icon form-control-feedback" /> : <EyeFill onClick={togglePass} className="eye-icon form-control-feedback" />)}
        </div>
      </Form.Group>
      <Form.Check label="Remember me" />
      <Button className="form-control mt-3 button" type="submit" disabled={isLoading}>
        {isLoading ? <LoadingAnimation /> : "Login"}
      </Button>
      <div className="mt-3 d-flex flex-column align-items-end" style={{ width: "100%" }}>
        <Button variant="link" onClick={() => setActiveForm("register")}>
          Sign up?
        </Button>
        <Button variant="link" href="/forget-password">
          Forget Password?
        </Button>
      </div>
    </Form>
  );
}

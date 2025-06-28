import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // Wait until we know the auth status
    if (authStatus === undefined || authStatus === null) return;

    if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    } else if (!authentication && authStatus) {
      navigate("/", { replace: true });
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  if (authStatus === undefined || authStatus === null || loader) {
    return <h1>Loading...</h1>;
  }
  return <>{children}</>;
}

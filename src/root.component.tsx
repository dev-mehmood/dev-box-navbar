import React from "react";
import { BrowserRouter } from "react-router-dom";
import Topnav from "./topnav/topnav.component";

export default function Root(props: RootProps) {
  return (
    <BrowserRouter basename="/">
      <Topnav />
    </BrowserRouter>
  );
}

type RootProps = {};

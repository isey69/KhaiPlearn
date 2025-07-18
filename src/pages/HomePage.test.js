import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders all the main buttons", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("สะสมแต้ม")).toBeInTheDocument();
    expect(screen.getByText("แลกรางวัล")).toBeInTheDocument();
    expect(screen.getByText("เพิ่มสมาชิก")).toBeInTheDocument();
    expect(screen.getByText("ประวัติคะแนน")).toBeInTheDocument();
  });
});

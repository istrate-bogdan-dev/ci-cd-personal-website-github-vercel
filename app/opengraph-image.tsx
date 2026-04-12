import { ImageResponse } from "next/og";

export const alt = "Bogdan Istrate — Cloud Solutions Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0e1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        {/* Terminal prompt bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#0d1224",
            border: "1px solid #1e2d4a",
            borderRadius: "10px",
            padding: "20px 32px",
            marginBottom: "48px",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "10px", marginRight: "24px" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#facc15" }} />
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <span style={{ color: "#8892a4", fontSize: "22px" }}>
            bogdan@cloud ~ /portfolio
          </span>
        </div>

        {/* Prompt line */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
          <span style={{ color: "#f5a623", fontSize: "40px", marginRight: "16px" }}>{">"}</span>
          <span style={{ color: "#f5a623", fontSize: "40px", fontWeight: "bold" }}>
            bogdan@cloud ~ _
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            color: "#e2e8f0",
            fontSize: "72px",
            fontWeight: "bold",
            marginBottom: "16px",
            paddingLeft: "56px",
          }}
        >
          Bogdan Istrate
        </div>

        {/* Title */}
        <div
          style={{
            color: "#8892a4",
            fontSize: "36px",
            marginBottom: "40px",
            paddingLeft: "56px",
          }}
        >
          Cloud Solutions Architect
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "16px", paddingLeft: "56px" }}>
          {["AWS", "Terraform", "DevOps", "FinOps", "CI/CD"].map((tag) => (
            <div
              key={tag}
              style={{
                border: "1px solid #f5a623",
                color: "#f5a623",
                fontSize: "24px",
                padding: "8px 20px",
                borderRadius: "6px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import images from "../../../public/images";

const CertificateTemplate = ({ name, college, certificatePath }) => {
  console.log("whatis certificat ", certificatePath);

  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        setBaseUrl(data.API_URL);
      })
      .catch(() => {
        setBaseUrl("http://localhost:6010");
      });
  }, []);

  // ✅ fallback instead of blank screen
  const safeBaseUrl = baseUrl || "http://localhost:6010";

  const qrValue = certificatePath
    ? `${safeBaseUrl.replace(/\/$/, "")}/${certificatePath.replace(/^\//, "")}`
    : "No Certificate Available";

  return (
    <div className="container">
      <div className="scale-wrapper">
        <div
          className="bg"
          style={{
            backgroundImage: `url(${images.certificateBackground})`,
          }}
        >
          {/* QR */}
          <div className="qrcode">
            <QRCodeCanvas value={qrValue} size={70} />
          </div>

          {/* Name */}
          <p className="name">{name || "Student Name"}</p>

          {/* College */}
          <p className="collegename" title={college}>
            {college
              ? college.length > 55
                ? college.substring(0, 55) + "..."
                : college
              : "College Name"}
          </p>
        </div>
      </div>

      <style>
        {`
        .container {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow-x: hidden;
        }

        .scale-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .bg {
          width: 800px;
          height: 614px;
          position: relative;
          background-size: cover;
          background-repeat: no-repeat;
          font-family: "Myriad Pro", Arial, sans-serif;
          color: #000;
        }

        /* 🔥 Mobile scaling */
        @media (max-width: 820px) {
          .bg {
            transform: scale(calc(100vw / 820));
            transform-origin: top center;
          }
        }

        /* ✅ NAME FIXED */
        .name {
          position: absolute;
          top: 280px;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          text-align: center;
          font-size: 42px;
          font-weight: bold;
          text-decoration: underline;

          word-wrap: break-word;
          overflow-wrap: break-word;
          line-height: 1.2;
        }

        /* ✅ COLLEGE FIXED */
        .collegename {
          position: absolute;
          top: 340px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          text-align: center;
          font-size: 18px;

          word-wrap: break-word;
          overflow-wrap: break-word;
          line-height: 1.3;
        }

        /* QR */
        .qrcode {
          position: absolute;
          top: 90px;
          left: 80px;
        }

        p {
          margin: 0;
          padding: 0;
        }
      `}
      </style>
    </div>
  );
};

export default CertificateTemplate;
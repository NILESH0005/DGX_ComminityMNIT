import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import images from "../../../public/images";

<<<<<<< HEAD
const CertificateTemplate = ({ name, college, certificatePath }) => {
  console.log("whatis certificat ", certificatePath);

  const [baseUrl, setBaseUrl] = useState("");

=======
const CertificateTemplate = ({ name, college, certificatePath, eventType }) => {
  console.log("whatis certificat ", certificatePath);

  const certificateStyles = {
    gold: {
      background: images.certificateBackground,

      name: {
        top: "335px",
        fontSize: "35px",
        color: "#000",
        width: "70%",
      },

      college: {
        top: "380px",
        fontSize: "18px",
        width: "60%",
        color: "#222",
      },

      qr: {
        top: "90px",
        left: "80px",
        size: 70,
      },
    },

    silver: {
      background: images.silverCertificateBackground,

      name: {
        top: "250px",
        fontSize: "50px",
        color: "#326cb5",
        width: "80%",
        
      },

      college: {
        top: "309px",
        fontSize: "18px",
        width: "65%",
        color: "#326cb5",
      },

      qr: {
        top: "290px",
        left: "100px",
        size: 65,
      },
    },
  };

  const certificateType = Number(eventType) === 1 ? "gold" : "silver";

  const styles = certificateStyles[certificateType];

  const [baseUrl, setBaseUrl] = useState("");
  const backgroundImage =
    Number(eventType) === 1
      ? images.certificateBackground
      : images.silverCertificateBackground;
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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

<<<<<<< HEAD
  // ✅ fallback instead of blank screen
=======
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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
<<<<<<< HEAD
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
=======
            backgroundImage: `url(${styles.background})`,
          }}
        >
          {/* QR */}
          <div
            className="qrcode"
            style={{
              top: styles.qr.top,
              left: styles.qr.left,
            }}
          >
            <QRCodeCanvas value={qrValue} size={styles.qr.size} />
          </div>

          {/* Name */}
          <p
            className="name"
            style={{
              top: styles.name.top,
              fontSize: styles.name.fontSize,
              color: styles.name.color,
              width: styles.name.width,
            }}
          >
            {name || "Student Name"}
          </p>
          {/* College */}
          <p
            className="collegename"
            style={{
              top: styles.college.top,
              fontSize: styles.college.fontSize,
              color: styles.college.color,
              width: styles.college.width,
            }}
          >
            {" "}
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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
          top: 335px;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          text-align: center;
          font-size: 35px;
          font-weight: bold;
          text-decoration: underline;

          word-wrap: break-word;
          overflow-wrap: break-word;
          line-height: 1.2;
        }

        /* ✅ COLLEGE FIXED */
        .collegename {
          position: absolute;
          top: 380px;
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

<<<<<<< HEAD
export default CertificateTemplate;
=======
export default CertificateTemplate;
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1

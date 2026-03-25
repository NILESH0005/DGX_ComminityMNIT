import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import images from "../../../public/images";

const CertificateTemplate = ({ name, college, certificateId }) => {
  return (
    <div className="container">
      <table width="100%" align="center">
        <tbody>
          <tr>
            <td>
              <div
                className="bg"
                style={{
                  backgroundImage: `url(${images.certificateBackground})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* ID */}
                <p className="id">{certificateId}</p>

                {/* QR CODE */}
                <div className="qrcode">
                  <QRCodeCanvas value={certificateId} size={80} />
                </div>

                {/* NAME */}
                <p className="name p-6">{name}</p>

                {/* COLLEGE */}
                <p className="collegename p-4">{college}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <style>
        {`
        .container {
          width: 100%;
          text-align: center;
        }

        .bg {
          margin: 0 auto;
          width: 800px;
          height: 614px;
          position: relative;
          font-family: "Myriad Pro", Arial, sans-serif;
          color: #000;
        }

        /* 🔥 CERTIFICATE ID */
        .id {
          position: absolute;
          top: 90px;
          left: 80px;
          font-weight: bold;
          text-decoration: underline;
        }

        /* 🔥 NAME (center aligned on certificate) */
        .name {
          position: absolute;
          top: 280px;
          width: 100%;
          text-align: center;
          font-size: 42px;
          font-weight: bold;
          text-decoration: underline;
        }

        /* 🔥 COLLEGE */
        .collegename {
          position: absolute;
          top: 340px;
          width: 100%;
          text-align: center;
          font-size: 18px;
        }

        /* 🔥 QR POSITION (adjust if needed) */
        .qrcode {
          position: absolute;
          top: 350px;
          left: 120px;
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
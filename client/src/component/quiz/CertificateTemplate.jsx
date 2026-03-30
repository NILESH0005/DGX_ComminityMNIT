import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import images from "../../../public/images";

const CertificateTemplate = ({ name, college, certificatePath }) => {
  // ✅ Base URL (works for both dev & production)
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:6010";

  // ✅ Final QR URL
  const qrValue = certificatePath
    ? `${BASE_URL}/${certificatePath}`
    : "No Certificate Available";

  // 🔍 Debug logs (VERY IMPORTANT while testing)
  // console.log("Certificate Path:", certificatePath);
  // console.log("QR Value:", qrValue);

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
                {/* ✅ QR CODE */}
                <div className="qrcode">
                  <QRCodeCanvas value={qrValue} size={70} />
                </div>

                {/* ✅ NAME */}
                <p className="name p-6">{name || "Student Name"}</p>

                {/* ✅ COLLEGE */}
                <p className="collegename p-4">{college || "College Name"}</p>
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

        .name {
          position: absolute;
          top: 280px;
          width: 100%;
          text-align: center;
          font-size: 42px;
          font-weight: bold;
          text-decoration: underline;
        }

        .collegename {
          position: absolute;
          top: 340px;
          width: 100%;
          text-align: center;
          font-size: 18px;
        }

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

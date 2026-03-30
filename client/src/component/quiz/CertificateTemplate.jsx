import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import images from "../../../public/images";

const CertificateTemplate = ({ name, college, certificatePath }) => {
  console.log("whatis certificat ", certificatePath)
  // ✅ FIX: Hook inside component
  const [baseUrl, setBaseUrl] = useState("");

  // ✅ Load config
  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        setBaseUrl(data.API_URL);
      })
      .catch(() => {
        setBaseUrl("http://localhost:6010"); // fallback
      });
  }, []);

  // ✅ Safe QR URL
  const qrValue = certificatePath
    ? `${baseUrl.replace(/\/$/, "")}/${certificatePath.replace(/^\//, "")}`
    : "No Certificate Available";
  // ✅ Optional: prevent rendering before config loads
  if (!baseUrl) return null;

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
                {/* QR */}
                <div className="qrcode">
                  <QRCodeCanvas value={qrValue} size={70} />
                </div>

                {/* Name */}
                <p className="name mt-12">{name || "Student Name"}</p>

                {/* College */}
                <p className="collegename p-12" title={college}>
                  {college
                    ? college.length > 55
                      ? college.substring(0, 55) + "..."
                      : college
                    : "College Name"}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <style>{`
        .container { width: 100%; text-align: center; }
        .bg {
          margin: 0 auto;
          width: 800px;
          height: 614px;
          position: relative;
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
      `}</style>
    </div>
  );
};

export default CertificateTemplate;

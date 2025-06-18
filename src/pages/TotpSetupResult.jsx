import React, { useEffect, useState } from "react";
import { Button, Typography, Space } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const { Paragraph, Text, Title } = Typography;

const TotpSetupResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { username, email } = location.state || {};

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username || !email) {
      // Si no vienen datos, volvemos al formulario
      navigate("/totp-setup");
      return;
    }

    const cargarTotp = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://raulocoin.onrender.com/api/regenerate-totp",
          {
            username,
            email,
          }
        );

        const totp = response.data.totpSetup;
        setQrCodeUrl(totp.qrCodeUrl);
        setManualCode(totp.manualSetupCode);
        setInstructions(totp.instructions);
      } catch (error) {
        console.error("Error al obtener TOTP:", error);
      }
      setLoading(false);
    };

    cargarTotp();
  }, [username, email, navigate]);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        padding: 20,
        textAlign: "center",
      }}
    >
      <Title level={3}>Activá tu doble factor (TOTP)</Title>

      {loading ? (
        <p>Cargando código...</p>
      ) : (
        <>
          {qrCodeUrl && (
            <Space
              direction="vertical"
              style={{ width: "100%", textAlign: "center" }}
            >
              <img
                src={qrCodeUrl}
                alt="Código QR TOTP"
                style={{ width: 200, height: 200, margin: "auto" }}
              />
              <Paragraph>
                <Text strong>Código manual:</Text>{" "}
                <Text copyable>{manualCode}</Text>
              </Paragraph>
              <Paragraph>
                <Text type="secondary">{instructions}</Text>
              </Paragraph>
            </Space>
          )}
          <Button
            onClick={() => navigate("/totp-setup")}
            style={{ marginTop: 20 }}
          >
            Volver
          </Button>
        </>
      )}
    </div>
  );
};

export default TotpSetupResult;

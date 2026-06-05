import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const plantillas = {
  envio_exitoso: (data) => ({
    subject: `✅ Axora - Envío confirmado a ${data.destinatario}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f6f3; padding: 20px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #294C74, #3d6a9e); padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <img src="https://axora.vercel.app/axoraLogo.png" alt="Axora" style="height: 48px; margin-bottom: 16px;" />
          <h1 style="color: white; margin: 0; font-size: 24px;">¡Envío Confirmado!</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Tu remesa está en camino</p>
        </div>
        
        <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
          <h2 style="color: #294C74; font-size: 18px; margin: 0 0 16px;">Detalles del envío</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0ece8;">
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Para:</td>
              <td style="padding: 10px 0; color: #294C74; font-weight: 700; text-align: right;">${data.destinatario}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece8;">
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Banco:</td>
              <td style="padding: 10px 0; color: #294C74; font-weight: 700; text-align: right;">${data.banco}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece8;">
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Cantidad enviada:</td>
              <td style="padding: 10px 0; color: #294C74; font-weight: 700; text-align: right;">$${data.cantidadUSD} USD</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece8;">
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Tu familiar recibe:</td>
              <td style="padding: 10px 0; color: #F17633; font-weight: 900; font-size: 18px; text-align: right;">$${data.cantidadMXN} MXN</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Código Oxxo:</td>
              <td style="padding: 10px 0; color: #294C74; font-weight: 700; font-family: monospace; text-align: right;">${data.codigoOxxo}</td>
            </tr>
          </table>
        </div>

        <div style="background: linear-gradient(135deg, #F17633, #D96524); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 16px;">
          <p style="color: rgba(255,255,255,0.9); margin: 0 0 4px; font-size: 13px;">Ahorraste vs Waster Onion</p>
          <p style="color: white; margin: 0; font-size: 28px; font-weight: 900;">$7.50 USD</p>
        </div>

        <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
          <p style="color: #0369a1; margin: 0; font-size: 13px;">
            🔗 <strong>Verificar en blockchain:</strong><br/>
            <a href="https://sepolia.etherscan.io/tx/${data.txHash}" style="color: #0369a1; word-break: break-all;">
              ${data.txHash ? data.txHash.slice(0, 40) + '...' : 'Pendiente'}
            </a>
          </p>
        </div>

        <p style="text-align: center; color: #8E8578; font-size: 12px; margin: 0;">
          © 2026 Axora - Remesas inteligentes con blockchain
        </p>
      </div>
    `
  }),

  tipo_cambio_favorable: (data) => ({
    subject: `📈 Axora - ¡Buen momento para enviar dinero!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f6f3; padding: 20px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #294C74, #3d6a9e); padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📈 Tipo de cambio favorable</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">¡Axo detectó el mejor momento!</p>
        </div>

        <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 16px; text-align: center;">
          <p style="color: #8E8578; font-size: 14px; margin: 0 0 8px;">Tipo de cambio actual</p>
          <p style="color: #294C74; font-size: 48px; font-weight: 900; margin: 0;">$${data.tipoCambio}</p>
          <p style="color: #16a34a; font-size: 14px; font-weight: 700; margin: 8px 0 0;">↑ ${data.variacion}% arriba del promedio semanal</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
          <p style="color: #15803d; font-size: 14px; margin: 0;">
            💡 <strong>Consejo de Axo:</strong> ${data.consejo}
          </p>
        </div>

        <p style="text-align: center; color: #8E8578; font-size: 12px; margin: 0;">
          © 2026 Axora - Remesas inteligentes con blockchain
        </p>
      </div>
    `
  }),

  nft_desbloqueado: (data) => ({
    subject: `🏆 Axora - ¡Desbloqueaste el NFT "${data.nftNombre}"!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f6f3; padding: 20px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #7C3AED, #4c1d95); padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🏆 ¡NFT Desbloqueado!</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Felicitaciones ${data.nombre}</p>
        </div>

        <div style="background: white; padding: 32px; border-radius: 12px; margin-bottom: 16px; text-align: center;">
          <p style="color: #294C74; font-size: 24px; font-weight: 900; margin: 0 0 8px;">${data.nftNombre}</p>
          <p style="color: #8E8578; font-size: 14px; margin: 0 0 16px;">${data.nftDescripcion}</p>
          <div style="background: #faf5ff; border: 2px solid #7C3AED; border-radius: 12px; padding: 16px; display: inline-block;">
            <p style="color: #7C3AED; font-size: 20px; font-weight: 900; margin: 0;">Vale ${data.puntosAlCanjear} pts</p>
          </div>
        </div>

        <p style="text-align: center; color: #8E8578; font-size: 12px; margin: 0;">
          © 2026 Axora - Remesas inteligentes con blockchain
        </p>
      </div>
    `
  }),

  pago_automatico: (data) => ({
    subject: `⚡ Axora - Pago automático de ${data.servicio} programado`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8f6f3; padding: 20px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #294C74, #3d6a9e); padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">⚡ Pago Automático Configurado</h1>
        </div>

        <div style="background: white; padding: 24px; border-radius: 12px; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0ece8;">
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Servicio:</td>
              <td style="padding: 10px 0; color: #294C74; font-weight: 700; text-align: right;">${data.servicio}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece8;">
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Beneficiario:</td>
              <td style="padding: 10px 0; color: #294C74; font-weight: 700; text-align: right;">${data.beneficiario}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece8;">
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Monto mensual:</td>
              <td style="padding: 10px 0; color: #F17633; font-weight: 900; font-size: 18px; text-align: right;">$${data.monto} MXN</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8E8578; font-size: 14px;">Día de pago:</td>
              <td style="padding: 10px 0; color: #294C74; font-weight: 700; text-align: right;">Día ${data.dia} de cada mes</td>
            </tr>
          </table>
        </div>

        <p style="text-align: center; color: #8E8578; font-size: 12px; margin: 0;">
          © 2026 Axora - Remesas inteligentes con blockchain
        </p>
      </div>
    `
  })
};

export async function POST(request) {
  try {
    const { tipo, email, data } = await request.json();

    if (!tipo || !email || !data) {
      return Response.json({ error: "Faltan datos" }, { status: 400 });
    }

    const plantilla = plantillas[tipo];
    if (!plantilla) {
      return Response.json({ error: "Tipo de notificación inválido" }, { status: 400 });
    }

    const { subject, html } = plantilla(data);

    await transporter.sendMail({
      from: `"Axora 🦎" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    return Response.json({ ok: true, message: "Email enviado" });
  } catch (error) {
    console.error("Error enviando email:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
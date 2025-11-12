import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { submitDocumentSchema } from "@shared/schema";
import { getUncachableResendClient } from "./resend-client";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/submit-document", upload.single('documento'), async (req, res) => {
    try {
      const validatedData = submitDocumentSchema.parse(req.body);
      
      if (!req.file) {
        return res.status(400).json({ 
          message: "Debe adjuntar un documento" 
        });
      }

      const { client, fromEmail } = await getUncachableResendClient();

      const emailBody = `
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Nueva Acta de Vacunación Recibida</h2>
    <p><strong>Nombre:</strong> ${validatedData.nombre}</p>
    <p><strong>Teléfono:</strong> ${validatedData.telefono}</p>
    ${validatedData.email ? `<p><strong>Email:</strong> ${validatedData.email}</p>` : ''}
    <p><strong>Documento adjunto:</strong> ${req.file.originalname}</p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    <p style="color: #666; font-size: 12px;">Este correo fue enviado automáticamente desde el formulario de envío de documentación.</p>
  </body>
</html>
      `.trim();

      await client.emails.send({
        from: fromEmail,
        to: 'mariavaleriarivoira@gmail.com',
        subject: `Acta de Vacunacion de ${validatedData.nombre}`,
        html: emailBody,
        attachments: [{
          filename: req.file.originalname,
          content: req.file.buffer,
        }]
      });

      res.json({ 
        success: true,
        message: "Documento enviado exitosamente" 
      });
    } catch (error: any) {
      console.error('Error enviando documento:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Datos del formulario inválidos",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Error al enviar el documento. Por favor intente nuevamente." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

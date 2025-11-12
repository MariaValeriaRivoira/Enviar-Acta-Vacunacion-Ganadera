import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FileUpload from "./FileUpload";
import { submitDocumentSchema, type SubmitDocumentData } from "@shared/schema";

export default function DocumentSubmissionForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitDocumentData>({
    resolver: zodResolver(submitDocumentSchema),
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
    },
  });

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setFileError("");
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError("El archivo excede el tamaño máximo de 10MB");
        setSelectedFile(null);
      }
    }
  };

  const onSubmit = async (data: SubmitDocumentData) => {
    if (!selectedFile) {
      setFileError("Debe seleccionar un archivo");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('telefono', data.telefono);
      if (data.email) {
        formData.append('email', data.email);
      }
      formData.append('documento', selectedFile);

      const response = await fetch('/api/submit-document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al enviar el documento');
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error submitting document:', error);
      setSubmitError(error.message || 'Error al enviar el documento. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSuccess(false);
    setSelectedFile(null);
    setFileError("");
    setSubmitError("");
    reset();
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <CheckCircle2 className="h-16 w-16 text-primary" data-testid="icon-success" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Documento enviado exitosamente</h2>
              <p className="text-muted-foreground">
                Su acta de vacunación ha sido enviada correctamente.
                Recibirá una confirmación en breve.
              </p>
            </div>
            <Button
              onClick={handleSendAnother}
              size="lg"
              data-testid="button-send-another"
            >
              Enviar otro documento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl">Envío de Acta de Vacunación</CardTitle>
            <CardDescription className="text-base mt-2">
              Complete el formulario y adjunte su documento para enviarlo de forma segura
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription data-testid="text-submit-error">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-sm font-medium">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              data-testid="input-nombre"
              placeholder="Ingrese su nombre completo"
              {...register("nombre")}
              className={errors.nombre ? "border-destructive" : ""}
            />
            {errors.nombre && (
              <p className="text-sm text-destructive" data-testid="error-nombre">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-sm font-medium">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="telefono"
              data-testid="input-telefono"
              placeholder="Ingrese su número de teléfono"
              {...register("telefono")}
              className={errors.telefono ? "border-destructive" : ""}
            />
            {errors.telefono && (
              <p className="text-sm text-destructive" data-testid="error-telefono">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Input
              id="email"
              data-testid="input-email"
              type="email"
              placeholder="ejemplo@correo.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive" data-testid="error-email">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Documento <span className="text-destructive">*</span>
            </Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              error={fileError}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
            data-testid="button-submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Documentación"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

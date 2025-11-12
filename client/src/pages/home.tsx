import DocumentSubmissionForm from "@/components/DocumentSubmissionForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-12 px-6 md:py-20">
      <DocumentSubmissionForm />
      <footer className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Necesita ayuda? Contáctenos en mariavaleriarivoira@gmail.com
        </p>
      </footer>
    </div>
  );
}

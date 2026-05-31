import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = React.ComponentProps<"input"> & {
  label: string;
  error?: string;
};

// Champ de formulaire réutilisable : libellé, champ de saisie et message d'erreur.
export const FormField = ({ label, error, id, name, ...props }: FormFieldProps) => {
  const fieldId = id ?? name;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} name={name} aria-invalid={Boolean(error)} {...props} />
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
};

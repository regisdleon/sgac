import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface Publicacion {
  id: number;
  anno: number;
  titulo: string;
  revista_editorial: string;
  tipo_publicacion: string;
  isbn_issn: string;
  verificacion_libro: boolean;
  base_datos_revista: string;
  verificacion_referencia: boolean;
  nivel: number;
}

interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
}

export default function RegistrarPublicacion() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState<number[]>([]);
  const [tiposPublicacion, setTiposPublicacion] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Publicacion>>({
    anno: undefined,
    titulo: "",
    revista_editorial: "",
    tipo_publicacion: "",
    isbn_issn: "",
    verificacion_libro: false,
    base_datos_revista: "",
    verificacion_referencia: false,
    nivel: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profesoresRes, tiposRes] = await Promise.all([
          api.get("/profesores"),
          api.get("/publicaciones-tipos"),
        ]);

        setProfesores(profesoresRes.data);
        setTiposPublicacion(tiposRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleProfesorChange = (profesorId: number, checked: boolean) => {
    setProfesoresSeleccionados((prev) =>
      checked
        ? [...prev, profesorId]
        : prev.filter((id) => id !== profesorId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the publication
      const publicacionRes = await api.post("/publicaciones/", formData);
      const publicacionId = publicacionRes.data.id;

      // Add selected professors as authors
      await Promise.all(
        profesoresSeleccionados.map((profesorId) =>
          api.post(`/publicaciones/${publicacionId}/autores`, {
            profesor: profesorId,
          })
        )
      );

      toast({
        title: "Éxito",
        description: "Publicación registrada correctamente",
      });
      navigate("/publicaciones");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "No se pudo registrar la publicación",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Publicación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="anno">Año</Label>
                <Input
                  id="anno"
                  name="anno"
                  type="number"
                  value={formData.anno || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revista_editorial">Revista/Editorial</Label>
                <Input
                  id="revista_editorial"
                  name="revista_editorial"
                  value={formData.revista_editorial}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_publicacion">Tipo de Publicación</Label>
                <Select
                  value={formData.tipo_publicacion}
                  onValueChange={(value) =>
                    handleSelectChange("tipo_publicacion", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposPublicacion.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn_issn">ISBN/ISSN</Label>
                <Input
                  id="isbn_issn"
                  name="isbn_issn"
                  value={formData.isbn_issn}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base_datos_revista">Base de Datos/Revista</Label>
                <Input
                  id="base_datos_revista"
                  name="base_datos_revista"
                  value={formData.base_datos_revista}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel</Label>
                <Input
                  id="nivel"
                  name="nivel"
                  type="number"
                  value={formData.nivel || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verificacion_libro"
                  checked={formData.verificacion_libro}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("verificacion_libro", checked as boolean)
                  }
                />
                <Label htmlFor="verificacion_libro">Verificación Libro</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verificacion_referencia"
                  checked={formData.verificacion_referencia}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "verificacion_referencia",
                      checked as boolean
                    )
                  }
                />
                <Label htmlFor="verificacion_referencia">
                  Verificación Referencia
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Autores</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profesores.map((profesor) => (
                  <div key={profesor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`profesor-${profesor.id}`}
                      checked={profesoresSeleccionados.includes(profesor.id)}
                      onCheckedChange={(checked) =>
                        handleProfesorChange(profesor.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`profesor-${profesor.id}`}>
                      {profesor.nombre} {profesor.apellido}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/publicaciones")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
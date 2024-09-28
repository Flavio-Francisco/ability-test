// src/app/api-docs/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SwaggerUI from "swagger-ui-react";
import axios from "axios";

export default function ApiDocs() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      const response = await axios.get("/api/swagger");

      const spec = await response.data;
      console.log(spec);

      setSwaggerSpec(spec);
    };

    fetchSwaggerSpec();
  }, [router]);

  if (!swaggerSpec) {
    return <div>Carregando...</div>;
  }

  return <SwaggerUI spec={swaggerSpec} />;
}

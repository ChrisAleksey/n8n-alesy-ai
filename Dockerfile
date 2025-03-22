FROM n8nio/n8n:latest

# Instalar dependencias adicionales si es necesario
RUN apt-get update && \
    apt-get install -y curl jq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración y workflows
WORKDIR /data
COPY workflows/ /data/workflows/
COPY init-workflows.js /data/init-workflows.js

# Instalar dependencias de Node.js para el script de inicialización
RUN npm install axios

# Configurar variables de entorno
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=http
ENV N8N_HOST=localhost
ENV N8N_EDITOR_BASE_URL=
ENV NODE_ENV=production
ENV N8N_DIAGNOSTICS_ENABLED=false
ENV N8N_USER_MANAGEMENT_DISABLED=false
ENV N8N_PUBLIC_API_DISABLED=false
ENV WEBHOOK_URL=
ENV DB_TYPE=sqlite
ENV DB_SQLITE_PATH=/data/database.sqlite
ENV N8N_PATH=/

# Exponer el puerto
EXPOSE 5678

# Comando para iniciar N8N y ejecutar el script de inicialización
CMD ["sh", "-c", "n8n start & sleep 10 && node /data/init-workflows.js && wait"]
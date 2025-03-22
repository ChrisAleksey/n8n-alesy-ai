const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración
const N8N_BASE_URL = process.env.N8N_PROTOCOL + '://' + process.env.N8N_HOST + ':' + process.env.N8N_PORT;
const N8N_API_KEY = process.env.N8N_API_KEY || '';
const WORKFLOWS_DIR = path.join(__dirname, 'workflows');
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000; // 3 segundos

// Función para verificar si N8N está disponible
async function checkN8nAvailability() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      console.log(`Intentando conectar a N8N (intento ${i + 1}/${MAX_RETRIES})...`);
      const response = await axios.get(`${N8N_BASE_URL}/healthz`);
      if (response.status === 200) {
        console.log('N8N está disponible!');
        return true;
      }
    } catch (error) {
      console.log(`N8N aún no está disponible: ${error.message}`);
    }
    
    // Esperar antes del siguiente intento
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }
  
  console.error('No se pudo conectar a N8N después de varios intentos');
  return false;
}

// Función para importar un workflow
async function importWorkflow(filePath) {
  try {
    const fileName = path.basename(filePath);
    console.log(`Importando workflow: ${fileName}`);
    
    // Leer el archivo del workflow
    const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Configurar los headers para la petición
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Añadir API key si está disponible
    if (N8N_API_KEY) {
      headers['X-N8N-API-KEY'] = N8N_API_KEY;
    }
    
    // Verificar si el workflow ya existe
    let existingWorkflows;
    try {
      const response = await axios.get(`${N8N_BASE_URL}/api/v1/workflows`, { headers });
      existingWorkflows = response.data;
    } catch (error) {
      console.error(`Error al obtener workflows existentes: ${error.message}`);
      existingWorkflows = { data: [] };
    }
    
    // Buscar si el workflow ya existe por nombre
    const existingWorkflow = existingWorkflows.data?.find(w => w.name === workflowData.name);
    
    if (existingWorkflow) {
      console.log(`El workflow "${workflowData.name}" ya existe, actualizando...`);
      
      // Actualizar el workflow existente
      const response = await axios.put(
        `${N8N_BASE_URL}/api/v1/workflows/${existingWorkflow.id}`,
        workflowData,
        { headers }
      );
      
      console.log(`Workflow "${workflowData.name}" actualizado con éxito!`);
      
      // Activar el workflow si es necesario
      if (!existingWorkflow.active && workflowData.active) {
        await activateWorkflow(existingWorkflow.id);
      }
      
      return response.data;
    } else {
      console.log(`Creando nuevo workflow: "${workflowData.name}"`);
      
      // Crear un nuevo workflow
      const response = await axios.post(
        `${N8N_BASE_URL}/api/v1/workflows`,
        workflowData,
        { headers }
      );
      
      console.log(`Workflow "${workflowData.name}" creado con éxito!`);
      
      // Activar el workflow si es necesario
      if (workflowData.active) {
        await activateWorkflow(response.data.id);
      }
      
      return response.data;
    }
  } catch (error) {
    console.error(`Error al importar workflow: ${error.message}`);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
    return null;
  }
}

// Función para activar un workflow
async function activateWorkflow(workflowId) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (N8N_API_KEY) {
      headers['X-N8N-API-KEY'] = N8N_API_KEY;
    }
    
    await axios.post(
      `${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`,
      {},
      { headers }
    );
    
    console.log(`Workflow ${workflowId} activado con éxito!`);
    return true;
  } catch (error) {
    console.error(`Error al activar workflow ${workflowId}: ${error.message}`);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
    return false;
  }
}

// Función principal
async function main() {
  console.log('Iniciando importación de workflows...');
  
  // Verificar si N8N está disponible
  const n8nAvailable = await checkN8nAvailability();
  if (!n8nAvailable) {
    console.error('No se pudo conectar a N8N, abortando importación de workflows');
    return;
  }
  
  // Verificar si el directorio de workflows existe
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    console.error(`El directorio de workflows no existe: ${WORKFLOWS_DIR}`);
    return;
  }
  
  // Leer los archivos de workflow
  const files = fs.readdirSync(WORKFLOWS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(WORKFLOWS_DIR, file));
  
  console.log(`Se encontraron ${files.length} workflows para importar`);
  
  // Importar cada workflow
  for (const file of files) {
    await importWorkflow(file);
  }
  
  console.log('Importación de workflows completada!');
}

// Ejecutar la función principal
main().catch(error => {
  console.error('Error en la importación de workflows:', error);
  process.exit(1);
});
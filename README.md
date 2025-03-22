# N8N para Alesy.ai

Este repositorio contiene la configuración de N8N para la plataforma Alesy.ai, diseñada para automatizar la integración entre ManyChat y agentes de IA.

## Características

- **Integración con ManyChat**: Automatiza la recepción y procesamiento de mensajes de WhatsApp a través de ManyChat.
- **Procesamiento de IA**: Conecta con OpenAI para generar respuestas inteligentes a los mensajes de los usuarios.
- **Integración con Supabase**: Almacena y recupera información de agentes, conversaciones y configuraciones.
- **Workflows predefinidos**: Incluye workflows listos para usar para la integración de WhatsApp y el procesamiento de webhooks de Stripe.
- **Despliegue automatizado**: Configuración lista para desplegar en Render con un solo clic.

## Workflows incluidos

1. **WhatsApp AI Integration**: Conecta ManyChat con OpenAI y Supabase para proporcionar respuestas inteligentes a los mensajes de WhatsApp.
2. **Stripe Webhook Handler**: Gestiona eventos de suscripciones y pagos de Stripe.
3. **WhatsApp AI Agent**: Procesa mensajes de WhatsApp y genera respuestas utilizando el agente de IA configurado.

## Configuración

### Variables de entorno requeridas

- `WEBHOOK_URL`: URL del webhook para recibir mensajes de ManyChat (ej: https://tu-app.com/api/integrations/manychat/webhook)
- `N8N_API_KEY`: Clave API para acceder a la API de N8N
- `OPENAI_API_KEY`: Clave API de OpenAI para la generación de respuestas
- `SUPABASE_URL`: URL de tu proyecto de Supabase
- `SUPABASE_KEY`: Clave API de Supabase (anon key)

## Despliegue

### Despliegue local con Docker

```bash
# Clonar el repositorio
git clone https://github.com/ChrisAleksey/n8n-alesy-ai.git
cd n8n-alesy-ai

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Iniciar N8N
docker-compose up -d
```

### Despliegue en Render

1. Haz clic en el botón "Deploy to Render" a continuación
2. Configura las variables de entorno requeridas
3. Haz clic en "Apply"

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ChrisAleksey/n8n-alesy-ai)

## Integración con ManyChat

1. Crea una cuenta en ManyChat y configura un bot para WhatsApp
2. En ManyChat, ve a Ajustes > Integraciones > Webhooks
3. Añade un nuevo webhook con la URL: `https://tu-n8n.render.com/webhook/manychat`
4. Configura el webhook para que se active cuando se reciba un mensaje
5. En tu aplicación Alesy.ai, configura el ID del bot y la API Key de ManyChat

## Pruebas y QA

Para verificar que la integración funciona correctamente:

1. Envía un mensaje de prueba a tu número de WhatsApp conectado a ManyChat
2. Verifica que el mensaje se procese correctamente en N8N (revisa los logs)
3. Comprueba que la respuesta se envíe de vuelta al usuario a través de ManyChat

## Soporte

Si tienes problemas con la integración, por favor crea un issue en este repositorio o contacta con el equipo de soporte de Alesy.ai.
# Instrucciones para agentes

<!-- BEGIN:notion-repository-documentation -->
## Documentación del repositorio en Notion

Esta regla aplica a Codex, Claude, Antigravity y OpenCode.

- En cada tarea que cambie requisitos, comportamiento, arquitectura, API, configuración, despliegue u operación, crear o actualizar la documentación del repositorio usando los MCP de Notion disponibles para esa tarea, sin esperar un recordatorio del usuario.
- Usar `notion_business_docs` para requisitos, producto, procesos y decisiones de negocio; usar `notion_dev_docs` para arquitectura, desarrollo, APIs, configuración, despliegue, pruebas y operación. Si los servidores tienen nombres similares, identificar su función por la configuración del proyecto y el destino disponible.
- Antes de escribir, verificar que el espacio y las páginas de destino corresponden al proyecto/repositorio actual. Las conexiones copiadas desde otro proyecto son una plantilla hasta que sus tokens y destinos hayan sido adaptados; no mezclar documentación entre proyectos ni publicar en el espacio de ejemplo por defecto.
- Consultar la documentación pertinente, buscar una página existente antes de crear otra y documentar únicamente cambios realmente implementados, decisiones y verificaciones, diferenciando lo pendiente. Conservar y actualizar README y documentación local cuando corresponda, y enlazar las páginas de Notion creadas o actualizadas al informar el resultado.
- Si el MCP correspondiente no está disponible o su destino aún no corresponde al proyecto, continuar el trabajo autorizado, dejar la documentación local y comunicar que la sincronización con Notion quedó pendiente. No afirmar que se actualizó Notion sin haberlo comprobado.
- Nunca incluir tokens, credenciales ni secretos en documentación, historial, respuestas o commits.
<!-- END:notion-repository-documentation -->

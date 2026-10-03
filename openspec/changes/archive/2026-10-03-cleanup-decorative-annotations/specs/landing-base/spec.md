# Spec Delta: landing-base — Cleanup de anotaciones decorativas

## ADDED Requirements

### Requirement: Vocabulario de anotación decorativa

La landing SHALL limitar sus anotaciones decorativas al vocabulario documentado del sistema: índices de sección `NN/ NOMBRE`, marcas de registro `+` en esquinas, etiquetas funcionales de contenido (p. ej. `ENTREGABLES`, `STACK`, `CASOS`, `MÉTRICA`, `ESTADO`, `CREDENCIALES`, `NUESTRA RESPUESTA`) y etiquetas internas de los diagramas C4 (pendientes de verificación del dueño). NO SHALL incluir metadatos de instrumento inventados (`SYS_*`, `CALIBRATED`, `INSTRUMENT #`, `PLATE NN`, `INDEX //`, `COLOPHON`, `GRID NN`, `RESOLUCIÓN 0N`) ni notas editoriales. Las anotaciones decorativas SHALL quedar ocultas para tecnologías de asistencia; el contenido real (incluidas las métricas) NO SHALL ocultarse nunca.

#### Scenario: Vocabulario permitido

- **WHEN** se inspecciona la landing construida
- **THEN** las anotaciones presentes pertenecen al vocabulario documentado: índices de sección, marcas `+`, etiquetas funcionales de contenido y etiquetas de diagramas C4

#### Scenario: Metadatos prohibidos ausentes

- **WHEN** se busca en el HTML construido
- **THEN** no aparecen cadenas de metadatos de instrumento (`SYS_`, `CALIBRATED`, `INSTRUMENT #`, `PLATE `, `INDEX //`, `COLOPHON`, `GRID `, `RESOLUCIÓN `)

#### Scenario: Contenido real nunca oculto

- **WHEN** un lector de pantalla recorre la landing
- **THEN** las métricas y datos reales se anuncian y solo las anotaciones decorativas quedan ocultas

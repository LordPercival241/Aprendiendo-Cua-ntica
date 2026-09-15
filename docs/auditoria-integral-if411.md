# Auditoría integral de QuantumUNI frente al sílabo IF411

**Fecha:** 14 de septiembre de 2026  
**Alcance:** contenido, rigor físico-matemático, trazabilidad bibliográfica, simulaciones, evaluación individual y calidad técnica.  
**Evidencia revisada:** `syllabus_text.txt`, `src/types/module.ts`, `src/content/modulesData.ts`, las páginas de módulo y progreso, los componentes de simulación y evaluación, y el inventario de recursos en `public/`.

## Dictamen ejecutivo

La aplicación es una buena maqueta didáctica y ya contiene teoría desarrollada, KaTeX, recursos y tres simulaciones temáticas. **No debe presentarse todavía como una plataforma rigurosa y completa del curso IF411.** La razón principal es que no conserva la estructura de 14 unidades del sílabo, el contenido evaluable no es específico por tema salvo en el módulo 1, y el simulador usado para la mayor parte de módulos no representa el fenómeno anunciado.

La prioridad es corregir la arquitectura curricular y establecer una cadena de validación académica antes de ampliar la interfaz.

| Dimensión | Estado | Dictamen |
|---|---:|---|
| Correspondencia con sílabo | Crítico | 13 módulos para 14 unidades; hay desplazamiento desde la unidad VI y falta la perturbación dependiente del tiempo. |
| Teoría por módulo | Insuficiente | Hay teoría detallada en los 13 módulos, pero solo 22 secciones para 14 unidades y varias unidades tienen un único subtema. |
| Rigor de fórmulas | Requiere revisión | La mayoría de las ecuaciones principales son correctas, pero hay afirmaciones sin hipótesis, notación/unidades inconsistentes y al menos un error de base en el efecto Stark. |
| Bibliografía trazable | Insuficiente | Se citan obras valiosas, pero no se usa de forma sistemática la bibliografía oficial del sílabo ni un identificador estable por ecuación/deducción. |
| Simulaciones | Crítico | Hay simuladores dedicados para cuerpo negro, fotoeléctrico y Compton; los demás módulos reciben un simulador genérico de paquete de onda/barrera. |
| Quiz y progreso individual | Crítico | Solo módulo 1 tiene preguntas propias; los demás reutilizan el mismo banco genérico. Las respuestas, el POE y el dashboard no se persisten por usuario. |
| Ingeniería y verificabilidad | Requiere revisión | `npm run lint` pasa, pero no hay pruebas físicas automatizadas y la compilación falla en este entorno por fuentes remotas de Google. |

## 1. Matriz de correspondencia curricular

El sílabo establece **14 unidades de 6 horas** (84 horas de teoría). La aplicación declara 13 módulos y llega a 90 horas porque el módulo 13 registra 12 horas; esa compensación no conserva la secuencia ni la separación conceptual oficial.

| Unidad oficial IF411 | Cobertura actual | Estado y brecha |
|---|---|---|
| I. Introducción, cuerpo negro y fotoeléctrico | Módulos 1 y 2 | **Parcial.** El cuerpo negro está bien ubicado; el fotoeléctrico se desplaza al módulo 2. |
| II. Compton, Franck-Hertz, De Broglie, difracción y Bohr | Módulos 2 y 3 | **Parcial.** Compton y De Broglie están presentes. Faltan Franck-Hertz y un desarrollo verificable del modelo de Bohr. |
| III. Dualidad, incertidumbre, doble rendija, probabilidad y función de estado | Módulo 3 | **Parcial.** Incluye De Broglie e incertidumbre; faltan probabilidad/Born, densidad de probabilidad y una doble rendija real. |
| IV. Medición y EdS dependiente de tiempo | Módulo 4 | **Parcial.** Incluye EdS y corriente; faltan postulado de medición, Born, observables, valores esperados y paquete de onda como unidad integrada. |
| V. Estados estacionarios, Ehrenfest y espacio de momentos | Módulo 5 | **Parcial.** Incluye paquete libre y Ehrenfest; faltan EdS independiente del tiempo, estados estacionarios, cuantización y relación posición-momento. |
| VI. Espacio momentum, incertidumbre generalizada y partícula libre | No existe como unidad propia | **Ausente como unidad.** El módulo 6 está asignado erróneamente a potenciales 1D. |
| VII. Potenciales seccionalmente constantes | Módulos 6 y 7 | **Parcial y fragmentado.** Pozo infinito y barrera aparecen; faltan de forma explícita escalón, pozo finito con ecuaciones trascendentes y potencial delta. |
| VIII. Oscilador armónico y potencial periódico | Módulo 9 | **Parcial y desplazado.** Solo método algebraico; falta solución diferencial/Hermite y potencial periódico. El módulo 8 está ocupado por Dirac. |
| IX. Álgebra de Dirac y átomo de hidrógeno | Módulos 8 y 10 | **Parcial y fragmentado.** Formalismo y radial están separados; falta una unidad coherente que conecte ambos. |
| X. Hidrógeno: parte angular, rotor, números cuánticos y momento magnético | Módulos 10 y 11 | **Parcial.** Falta tratamiento completo de armónicos, rotor rígido y momento magnético del H. |
| XI. Stern-Gerlach, momento angular, Pauli y precesión | Módulos 11 y 12 | **Parcial y fragmentado.** Conmutadores/Pauli y Stern-Gerlach están; falta una precesión cuantitativa y una secuencia didáctica única. |
| XII. Composición angular, Clebsch-Gordan y Zeeman | Módulo 12 | **Parcial.** Clebsch-Gordan está incluido; faltan Zeeman normal y anómalo. |
| XIII. Perturbaciones independientes del tiempo y Stark | Módulo 13, primera mitad | **Cubierto parcialmente.** Hay no degenerado, degenerado y Stark. |
| XIV. Perturbaciones dependientes del tiempo, absorción/emisión y regla de oro de Fermi | No existe | **Ausente.** El resultado de aprendizaje lo promete el módulo 13, pero sus secciones no lo desarrollan. |

### Decisión curricular obligatoria

Se recomienda migrar a **14 módulos de 6 horas**, conservando IDs estables cuando sea posible y separando el actual módulo 13 en `13-perturbaciones-estacionarias` y `14-perturbaciones-tiempo`. No se debe resolver la discrepancia únicamente cambiando los rótulos de las unidades.

## 2. Auditoría de cada módulo existente

| Módulo | Evaluación | Hallazgos que bloquean rigor |
|---|---|---|
| 01. Física moderna | Parcial | Teoría de Planck/Rayleigh-Jeans y simulador pertinentes. La lección mezcla densidad de energía `u_ν` con un simulador que calcula radiancia espectral `B_λ`; deben separarse variable, unidad y gráfico. `E_n=n hν` debe contextualizarse como modelo histórico de Planck, no como espectro moderno del oscilador. No cubre fotoeléctrico, requerido en la unidad I. |
| 02. Fotoeléctrico y Compton | Parcial | Las ecuaciones principales son adecuadas. Faltan Franck-Hertz, Bohr y el vínculo explícito con objetivos de unidad II. El modelo de corriente se describe como Fowler-DuBridge pero utiliza una curva empírica arbitraria; no debe llevar ese nombre sin derivación, parámetros o referencia. |
| 03. Dualidad | Parcial | De Broglie e incertidumbre correctos bajo régimen no relativista. Falta doble rendija, Born, normalización y densidad de probabilidad; no hay simulador de interferencia aunque se anuncia `DoubleSlitSim`. |
| 04. Schrödinger | Parcial | La EdS 1D y continuidad son correctas. La presentación debe llamar a la correspondencia `E→iℏ∂t`, `p→−iℏ∂x` una motivación heurística/postulado, no una deducción desde la energía clásica. Faltan medición, operadores y valor esperado exigidos por la unidad IV. |
| 05. Partícula libre y paquetes | Parcial | La dispersión gaussiana y Ehrenfest son apropiados. La frase “obedecen rigurosamente las ecuaciones de Newton” requiere la condición posterior `⟨F(x)⟩≈F(⟨x⟩)`; sin ella no es general. Falta la EdS independiente del tiempo y espacio momentum. |
| 06. Potenciales 1D | Parcial, mal asignado | El pozo infinito está bien planteado, pero un solo caso no satisface el contenido de potenciales seccionalmente constantes. Además ocupa la unidad VI, que el sílabo reserva a espacio momentum e incertidumbre generalizada. |
| 07. Tunelamiento | Parcial | La fórmula exacta de transmisión y su límite opaco están bien acotados para barrera rectangular `E<V₀`. Debe incorporarse dentro de la unidad VII junto con escalón, pozo finito y delta; no como una unidad curricular independiente. |
| 08. Formalismo Dirac | Parcial, mal asignado | Bra-ket, completitud y Robertson son pertinentes, pero pertenecen a la unidad IX. “Si conmutan, pueden medirse juntos con precisión perfecta” debe matizarse: la conmutación permite una base común bajo condiciones espectrales apropiadas; no implica dispersión nula en cualquier estado. |
| 09. Oscilador armónico | Parcial, mal asignado | El método de escalera y el espectro son correctos. Faltan solución diferencial, Hermite y potencial periódico, requeridos por la unidad VIII. |
| 10. Átomo de hidrógeno | Parcial | La separación radial y `V_eff` son correctas. Falta parte angular, rotor rígido, momento magnético orbital y visualización de densidades. Debe indicarse la aproximación sin estructura fina/espín. |
| 11. Momento angular y espín | Parcial | Conmutadores y Pauli son adecuados. Debe consolidarse con Stern-Gerlach y una simulación de precesión. No reemplaza la parte angular del átomo de H. |
| 12. Stern-Gerlach y composición | Parcial | La cadena de analizadores es didácticamente válida. Debe precisarse que el experimento histórico con Ag no “demostró” por sí solo el espín en el sentido moderno. Error físico: `|2,1,±1⟩` no son los orbitales reales `2p_x` y `2p_y`; son autoestados complejos de `L_z`. Faltan Zeeman normal y anómalo. |
| 13. Perturbaciones | Parcial | El bloque estacionario y Stark es adecuado. Faltan íntegramente perturbación dependiente del tiempo, absorción/emisión, perturbación periódica y regla de oro de Fermi, aunque el resultado de aprendizaje las declara. Debe dividirse en dos módulos. |

## 3. Rigor de fórmulas y referencias

### Hallazgos P0 - corregir antes de validar contenido

1. **Inconsistencia de magnitud espectral en módulo 1.** La teoría usa `u(ν,T)` (densidad de energía por frecuencia), mientras `BlackbodySimulator` implementa `B_λ(λ,T)` (radiancia espectral por longitud de onda) y rotula el eje como `u(λ,T)`. Hay que escoger una formulación o mostrar ambas con la conversión `u_λ = (4π/c)B_λ` en vacío y el jacobiano entre frecuencia y longitud de onda.
2. **Base incorrecta en Stark.** En `13-perturbaciones` se identifica `|2,1,1⟩` y `|2,1,-1⟩` con `2p_x` y `2p_y`. Esos kets son `Y_1^{±1}`; los orbitales reales `p_x/p_y` son combinaciones lineales de ambos. Corregir antes de usar como material evaluable.
3. **Cobertura prometida pero inexistente.** No se debe afirmar que el curso cubre teoría de perturbaciones dependiente del tiempo ni regla de oro de Fermi hasta incorporar deducción, condiciones de validez, ejemplo y quiz propios.

### Hallazgos P1 - requisitos de publicación académica

1. Todas las fórmulas necesitan metadatos uniformes: `id`, forma exacta, hipótesis, dominio, dimensiones/unidades, límite de comprobación, fuente primaria/secundaria y sección/página de la edición usada.
2. La bibliografía oficial prioritaria (Fernández de Córdova, H. Valqui, Bransden, Eisberg, Greiner, Cohen-Tannoudji, Merzbacher, Schiff, Gasiorowicz y Feynman) debe estar en un catálogo; las referencias actuales incluyen Griffiths y Sakurai, útiles pero no listados en el sílabo, y omiten varios textos oficiales.
3. Cada deducción debe separar con claridad postulado, teorema, aproximación, modelo y resultado experimental. Los términos “demuestra”, “exacto” y “riguroso” solo deben emplearse con condiciones explícitas.
4. Deben añadirse revisiones de pares: autor de contenido, revisor físico, referencia verificada y versión. Ninguna ecuación debe publicarse sin estado `verified`.

## 4. Simulaciones y laboratorio computacional

El enrutador de simulaciones solo selecciona simuladores dedicados para módulos 1 y 2. Para los módulos 3 al 13 devuelve `QuantumWavepacketSimulator`, que modela paquete 1D ante barrera, pozo o escalón. Por tanto, no representa oscilador, átomo de H, espín, Stern-Gerlach, Clebsch-Gordan ni perturbaciones, aunque las tarjetas anuncian otros nombres de simulación.

| Fenómeno curricular | Estado | Requisito mínimo para aceptar |
|---|---|---|
| Cuerpo negro | Implementado con corrección P0 | Declarar `B_λ`, unidades y conversiones correctas. |
| Fotoeléctrico | Implementado parcialmente | Separar animación de un modelo cuantitativo; documentar modelo de fotocorriente o simplificar su etiqueta. |
| Compton | Implementado | Añadir conservación de cuadrimomento y verificación numérica de ángulo/energías. |
| Doble rendija | Ausente | Simular amplitudes, `|ψ|²`, ancho de rendija, separación y contraste. |
| Paquete libre / espacio momentum | Parcial | Mostrar FFT, normalización y conservación de norma; no reutilizarlo para fenómenos ajenos. |
| Escalón, pozo finito, delta, barrera | Parcial | Resolver cada perfil con condiciones de frontera, `R+T=1` y estados ligados cuando corresponda. |
| Oscilador | Ausente | Mostrar autofunciones/Hermite, energía, superposiciones y valor esperado. |
| Hidrógeno | Ausente | Mostrar `|ψ_nlm|²`, nodos, números cuánticos y unidades. |
| Stern-Gerlach / espín / precesión | Ausente | Usar espinores y regla de Born, no una animación clásica de flechas. |
| Perturbaciones | Ausente | Mostrar aproximación, comparación con diagonalización numérica y error relativo. |

Para cada simulación, publicar una ficha con Hamiltoniano, variables adimensionales/SI, integrador o solución analítica, discretización, condiciones de frontera, conservación comprobada y rango de validez. Añadir pruebas automatizadas de normalización, unitaridad (`R+T=1`) y límites conocidos.

## 5. Evaluación, identidad y progreso

1. `InteractiveChallenges.tsx` define preguntas específicas solamente para el módulo 1. Todos los otros módulos reciben exactamente tres preguntas genéricas de Born, conmutador y pozo infinito; por tanto, no existe quiz por tema.
2. El puntaje vive en estado React y se pierde al recargar. Las respuestas POE se anuncian como guardadas “en sesión”, pero no se almacenan.
3. El dashboard presenta `completedModules=3`, `challengesSolved=8`, `poeResponses=6` y resultados pre/post fijos, no datos del usuario autenticado.
4. Supabase está inicializado con credenciales de marcador si faltan variables; no existe un esquema de base de datos, RLS, intentos, banco de ítems ni evidencias de evaluación.

**Modelo mínimo recomendado:** `profiles`, `course_modules`, `learning_objectives`, `content_revisions`, `formula_records`, `quiz_items`, `quiz_attempts`, `poe_entries`, `simulation_runs` y `module_progress`; con RLS que permita al estudiante acceder solo a sus registros. Cada pregunta debe indicar objetivo, dificultad, tipo, solución razonada, referencia y versión de contenido.

## 6. Ingeniería de software y recursos

- `npm run lint` finaliza correctamente.
- `npm run build` falla en este entorno porque `next/font/google` intenta descargar Inter y JetBrains Mono desde Google Fonts. Para compilaciones reproducibles, alojar las fuentes localmente con `next/font/local` o definir un mecanismo explícito de dependencia de red.
- Next informa que la convención `middleware` está deprecada y debe migrarse a `proxy` según la versión instalada.
- No hay script de pruebas ni pruebas unitarias para los cálculos físicos. Añadir Vitest/Jest y pruebas de regresión para constantes, límites asintóticos, unidades y valores de referencia.
- De 24 rutas de diapositivas declaradas, 13 no corresponden a un archivo real por diferencias de nombre. Esto rompe la trazabilidad de cátedra. Corregir los paths o normalizar nombres antes de publicar.

## 7. Plan de remediación priorizado

### Fase 0 - bloqueo de publicación

1. Reestructurar la currícula a 14 unidades y crear el módulo XIV.
2. Corregir las inconsistencias P0 de cuerpo negro y Stark.
3. Eliminar etiquetas que prometan simulación o evaluación inexistente.
4. Corregir todas las rutas de recursos rotas.

### Fase 1 - integridad académica

1. Crear una matriz de objetivos del sílabo -> sección teórica -> fórmula -> ejemplo -> simulación -> ítem de quiz -> referencia.
2. Completar las brechas por unidad indicadas en la sección 1.
3. Versionar contenido y validar cada fórmula por un revisor de física.
4. Priorizar la bibliografía oficial y conservar referencia exacta por edición.

### Fase 2 - aprendizaje verificable

1. Construir un banco de quiz específico por módulo, con al menos diagnóstico, aplicación y razonamiento/deducción.
2. Persistir identidad, intentos, progreso y respuestas POE con Supabase y RLS.
3. Reemplazar simulaciones genéricas por laboratorios específicos, verificados contra soluciones analíticas o numéricas.

### Fase 3 - aseguramiento de calidad

1. Añadir pruebas de unidades y regresión física.
2. Hacer compilación sin dependencia de fuentes remotas.
3. Establecer revisión académica y técnica previa a cada publicación.

## Criterio de aceptación final

La plataforma podrá declararse alineada a IF411 únicamente cuando las 14 unidades tengan cobertura trazable, cada objetivo tenga teoría/referencia/evaluación propios, cada simulación documente y pruebe su modelo, el progreso sea real por usuario y las pruebas técnicas/físicas se ejecuten de forma reproducible.

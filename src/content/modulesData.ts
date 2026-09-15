import { FormulaData } from '@/components/math/FormulaInspector';

export interface TheoreticalSection {
  id: string;
  title: string;
  badge?: string;
  summary: string;
  contentMarkdown: string;
  formulas: FormulaData[];
  academicRelevance?: string;
  citations?: string[];
}

export interface DetailedModuleData {
  id: string;
  syllabusUnit: string;
  syllabusTitle: string;
  hours: number;
  academicWeek: string;
  prerequisites: string[];
  learningOutcomes: string[];
  sections: TheoreticalSection[];
  suggestedReadings: {
    bookTitle: string;
    chapters: string;
    keyProblems: string;
  }[];
}

export const DETAILED_MODULES_DATA: Record<string, DetailedModuleData> = {
  '01-introduccion-fisica-moderna': {
    id: '01-introduccion-fisica-moderna',
    syllabusUnit: 'UNIDAD I',
    syllabusTitle: 'Introducción y Física Moderna',
    hours: 6,
    academicWeek: 'Semana 1',
    prerequisites: ['Termodinámica clásica', 'Electromagnetismo de Maxwell', 'Cálculo integral avanzado'],
    learningOutcomes: [
      'Demostrar analíticamente por qué la física clásica falla en predecir el espectro del cuerpo negro (catástrofe ultravioleta).',
      'Deducir el valor medio de energía del oscilador cuántico mediante la distribución canónica de Boltzmann.',
      'Analizar la ley de Stefan-Boltzmann y la ley de desplazamiento de Wien a partir de la distribución espectral de Planck.',
    ],
    sections: [
      {
        id: 'clasico-vs-cuantico',
        title: '1. El Colapso de la Física Clásica y la Catástrofe Ultravioleta',
        badge: 'Fundamento Histórico-Experimental',
        summary: 'A finales del siglo XIX, la termodinámica estadística clásica predijo una divergencia infinita de la radiación en altas frecuencias, demostrando la necesidad de una revolución conceptual.',
        contentMarkdown: `
A finales del siglo XIX, la electrodinámica clásica predecía que un conjunto de cargas aceleradas emite radiación continua. Al confinar radiación dentro de una cavidad metálica con paredes a temperatura $T$ (modelo de cuerpo negro), las ondas electromagnéticas estacionarias deben satisfacer las condiciones de frontera de campo eléctrico tangencial nulo en las paredes ($E_\\parallel = 0$).

Según el **Teorema de Equipartición de la Energía** de la termodinámica estadística clásica (Boltzmann-Maxwell), cada modo espacial y de polarización independiente en el equilibrio térmico debe poseer una energía cinética y potencial promedio igual a:
$$\\langle \\epsilon \\rangle_{\\text{clásico}} = k_B T$$

Al multiplicar esta energía promedio por la densidad geométrica de modos electromagnéticos dentro de una cavidad cúbica de volumen $V = L^3$:
$$g(\\nu) d\\nu = \\frac{8\\pi \\nu^2}{c^3} d\\nu$$
se obtiene la fatídica **Ley de Rayleigh-Jeans**:
$$u(\\nu, T) d\\nu = \\frac{8\\pi \\nu^2}{c^3} k_B T d\\nu$$

Esta expresión predice que para frecuencias ultravioletas o mayores ($\\nu \\to \\infty$), la densidad de energía diverge asintóticamente:
$$\\lim_{\\nu \\to \\infty} u(\\nu, T) = \\infty \\implies \\int_0^\\infty u(\\nu, T) d\\nu = \\infty$$
Este absurdo físico se denominó históricamente la **Catástrofe Ultravioleta** (Paul Ehrenfest, 1911) e implicaba que cualquier objeto caliente en equilibrio debería disipar instantáneamente toda su energía en radiación de alta frecuencia.
        `,
        formulas: [
          {
            title: 'Ley de Rayleigh-Jeans (Límite Clásico Inconsistente)',
            formula: 'u(\\nu, T) = \\frac{8\\pi \\nu^2}{c^3} k_B T',
            label: 'Ec. 1.1',
            category: 'Física Clásica',
            context: 'Deducción clásica de la densidad espectral de energía basada en la equipartición térmica continua. Válida experimentalmente únicamente en el límite asintótico de bajas frecuencias (infrarrojo lejano, $h\\nu \\ll k_B T$).',
            variables: [
              { symbol: 'u(\\nu, T)', name: 'Densidad espectral de energía', units: '\\text{J}\\cdot\\text{m}^{-3}\\cdot\\text{Hz}^{-1}', description: 'Energía radiativa contenida por unidad de volumen y por unidad de frecuencia en la cavidad.' },
              { symbol: '\\nu', name: 'Frecuencia electromagnética', units: '\\text{Hz} = \\text{s}^{-1}', description: 'Frecuencia de oscilación del modo electromagnético de la radiación.' },
              { symbol: 'c', name: 'Velocidad de la luz en el vacío', units: '\\text{m}/\\text{s} \\approx 2.9979\\times 10^8', description: 'Velocidad de propagación de las ondas electromagnéticas.' },
              { symbol: 'k_B', name: 'Constante de Boltzmann', units: '\\text{J}/\\text{K} \\approx 1.3806\\times 10^{-23}', description: 'Constante que vincula la temperatura termodinámica microscópica con la energía cinética media.' },
              { symbol: 'T', name: 'Temperatura absoluta', units: '\\text{K}', description: 'Temperatura de equilibrio térmico de las paredes de la cavidad.' }
            ],
            physicalMeaning: 'Demuestra el fallo fatal de asumir que el intercambio de energía electromagnética entre los modos de la cavidad y los dipolos de las paredes es infinitamente divisible y continuo.',
            classicalLimit: 'Representa en sí el límite clásico que diverge en altas frecuencias; coincide con la ley de Planck cuando $\\frac{h\\nu}{k_B T} \\to 0$.'
          }
        ],
        academicRelevance: 'En las aplicaciones analíticas y prácticas de la cátedra se analiza rigurosamente la aproximación en serie de Taylor de la ley de Planck para recuperar la ley de Rayleigh-Jeans cuando $h\\nu \\ll k_B T$.',
        citations: [
          'Eisberg, R. & Resnick, R. Quantum Physics of Atoms, Molecules, Solids, Nuclei, and Particles, 2nd Ed. (Wiley, 1985), Cap. 1, §1.1–1.3.',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge University Press, 2018), Cap. 1, §1.1.',
          'Planck, M. "Über das Gesetz der Energieverteilung im Normalspektrum", Annalen der Physik 309(3), 553–563 (1901).',
          'Rayleigh, Lord. "Remarks upon the Law of Complete Radiation", Phil. Mag. 49, 539–540 (1900).'
        ]
      },
      {
        id: 'postulado-planck',
        title: '2. El Postulado Cuántico de Max Planck (1900)',
        badge: 'Ruptura Paradigmática',
        summary: 'Para corregir la catástrofe ultravioleta, Planck propuso que los osciladores atómicos absorben y emiten energía exclusivamente en paquetes discretos E = n h nu.',
        contentMarkdown: `
El 14 de diciembre de 1900, Max Planck presentó ante la Sociedad Alemana de Física su revolucionaria hipótesis:

> **Postulado de Planck**: Un oscilador armónico microscópico de frecuencia natural $\\nu$ solo puede poseer estados discretos de energía dados por:
> $$E_n = n h \\nu, \\quad n = 0, 1, 2, 3, \\dots$$
> donde $h$ es la constante universal de acción de Planck ($h \\approx 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$).

### Deducción Rigurosa del Promedio Cuántico de Energía $\\langle \\epsilon \\rangle$
En equilibrio térmico a temperatura $T$, la probabilidad $P_n$ de que un resonador esté en el estado energético $E_n = n h \\nu$ sigue la distribución canónica de Maxwell-Boltzmann:
$$P_n = \\frac{e^{-\\beta E_n}}{\\mathcal{Z}}, \\quad \\beta = \\frac{1}{k_B T}$$
donde la función de partición $\\mathcal{Z}$ es la suma geométrica infinita:
$$\\mathcal{Z} = \\sum_{n=0}^\\infty e^{-n \\beta h \\nu} = \\frac{1}{1 - e^{-\\beta h \\nu}}$$

Calculamos el valor esperado de la energía $\\langle \\epsilon \\rangle$:
$$\\langle \\epsilon \\rangle = -\\frac{\\partial}{\\partial \\beta} \\ln \\mathcal{Z} = \\frac{h\\nu}{e^{\\frac{h\\nu}{k_B T}} - 1}$$

Multiplicando por la densidad geométrica de modos de radiación $g(\\nu) = \\frac{8\\pi \\nu^2}{c^3}$, surge la **Ley de Distribución Espectral de Planck**:
$$u(\\nu, T) = \\frac{8\\pi h \\nu^3}{c^3} \\frac{1}{e^{\\frac{h\\nu}{k_B T}} - 1}$$
        `,
        formulas: [
          {
            title: 'Ley de Radiación de Planck para el Cuerpo Negro',
            formula: 'u(\\nu, T) = \\frac{8\\pi h \\nu^3}{c^3}\\frac{1}{e^{\\frac{h\\nu}{k_B T}} - 1}',
            label: 'Ec. 1.2',
            category: 'Ley Fundamental Cuántica',
            context: 'Ecuación exacta que describe la distribución espectral de densidad de energía de un cuerpo negro en equilibrio térmico para todas las longitudes de onda sin divergencias.',
            variables: [
              { symbol: 'u(\\nu, T)', name: 'Densidad espectral de energía', units: '\\text{J}/(\\text{m}^3\\cdot\\text{Hz})', description: 'Distribución volumétrica de energía por intervalo de frecuencia unitario.' },
              { symbol: 'h', name: 'Constante de Planck', units: '\\text{J}\\cdot\\text{s}', description: 'Cuanto de acción fundamental del universo.' },
              { symbol: '\\nu', name: 'Frecuencia de radiación', units: '\\text{Hz}', description: 'Frecuencia del modo oscilatorio considerado.' },
              { symbol: 'e^{\\frac{h\\nu}{k_B T}}', name: 'Factor exponencial de corte de Boltzmann', units: '\\text{adimensional}', description: 'Suprime exponencialmente la ocupación de modos de muy alta energía, eliminando la catástrofe ultravioleta.' }
            ],
            physicalMeaning: 'Elimina de raíz la divergencia clásica y reproduce con exactitud milimétrica los datos experimentales de Lummer y Pringsheim.',
            boundaryConditions: '$u(\\nu, T) \\to 0$ tanto para $\\nu \\to 0$ como para $\\nu \\to \\infty$.'
          }
        ],
        citations: [
          'Planck, M. "Zur Theorie des Gesetzes der Energieverteilung im Normalspectrum", Verhandlungen der Deutschen Physikalischen Gesellschaft 2, 237–245 (1900).',
          'Eisberg, R. & Resnick, R. Quantum Physics, 2nd Ed. (Wiley, 1985), Cap. 1, §1.4–1.6.',
          'Cohen-Tannoudji, C., Diu, B. & Laloë, F. Quantum Mechanics Vol. 1 (Wiley, 1977), Complemento A-I.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Eisberg & Resnick — Quantum Physics',
        chapters: 'Capítulo 1: Thermal Radiation and Planck Postulate',
        keyProblems: 'Problemas 1.4, 1.12 y 1.18.'
      }
    ]
  },

  '02-efecto-fotoelectrico-compton': {
    id: '02-efecto-fotoelectrico-compton',
    syllabusUnit: 'UNIDAD I-II',
    syllabusTitle: 'Efecto Fotoeléctrico, Compton y Modelo de Bohr',
    hours: 12,
    academicWeek: 'Semana 1-2',
    prerequisites: ['Electrodinámica relativista', 'Módulo 1'],
    learningOutcomes: [
      'Explicar el efecto fotoeléctrico mediante el modelo corpuscular de absorción puntual del fotón.',
      'Deducir el corrimiento de Compton fotón-electrón libre usando la conservación de cuadrimomento relativista.',
      'Analizar la cuantización de niveles atómicos en el experimento de Franck-Hertz y el modelo de Bohr.',
    ],
    sections: [
      {
        id: 'fotoelectrico',
        title: '1. Efecto Fotoeléctrico y Potencial de Frenado',
        badge: 'Nobel de Física 1921',
        summary: 'Einstein demostró que la luz se comporta como un conjunto de partículas cuánticas discretas (fotones), donde cada fotón cede toda su energía a un solo electrón.',
        contentMarkdown: `
La teoría electromagnética ondulatoria de Maxwell predecía que una luz más intensa debería transferir mayor energía a los electrones independientemente de su frecuencia. Sin embargo, los experimentos de Philipp Lenard y Robert Millikan demostraron:
1. La energía cinética máxima de los electrones expulsados $K_{\\max}$ depende **linealmente de la frecuencia $\\nu$** de la luz y es **independiente de su intensidad**.
2. Existe una frecuencia de corte $\\nu_0$ por debajo de la cual no se desprenden electrones jamás.
3. No hay tiempo de retardo en la emisión ($t < 10^{-9}\\text{ s}$).

Einstein postuló que un fotón monocromático de energía $E = h\\nu$ colisiona con un electrón ligado, entregándole íntegramente su energía. El electrón gasta una energía $\\Phi$ (función de trabajo) para escapar de la red cristalina y el remanente se convierte en energía cinética:
$$K_{\\max} = e V_0 = h\\nu - \\Phi = h(\\nu - \\nu_0)$$
        `,
        formulas: [
          {
            title: 'Ecuación Fotoeléctrica de Einstein',
            formula: 'K_{\\max} = e V_0 = h\\nu - \\Phi = h(\\nu - \\nu_0)',
            label: 'Ec. 2.1',
            category: 'Absorción Fotónica',
            context: 'Balance de energía de conservación en la interacción fotón-electrón en superficies conductoras.',
            variables: [
              { symbol: 'K_{\\max}', name: 'Energía cinética máxima del fotoelectrón', units: '\\text{eV} \\text{ o } \\text{J}', description: 'Energía de los electrones expulsados más veloces.' },
              { symbol: 'V_0', name: 'Potencial de frenado', units: '\\text{Voltios (V)}', description: 'Voltaje eléctrico inverso para anular la corriente fotoeléctrica.' },
              { symbol: '\\Phi', name: 'Función de trabajo del metal', units: '\\text{eV}', description: 'Barrera de potencial electrostática superficial del material.' },
              { symbol: '\\nu_0 = \\Phi/h', name: 'Frecuencia umbral', units: '\\text{Hz}', description: 'Frecuencia mínima para activar el efecto fotoeléctrico.' }
            ],
            physicalMeaning: 'Proporciona una prueba directa de que la energía de la radiación se intercambia en paquetes indivisibles $h\\nu$.'
          }
        ],
        citations: [
          'Einstein, A. "Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt", Annalen der Physik 17(6), 132–148 (1905).',
          'Eisberg, R. & Resnick, R. Quantum Physics, 2nd Ed. (Wiley, 1985), Cap. 2, §2.2–2.3.',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 1, §1.2.'
        ]
      },
      {
        id: 'compton',
        title: '2. Efecto Compton y Cinemática Relativista',
        badge: 'Colisión Fotón-Electrón',
        summary: 'Arthur Compton demostró en 1923 que los fotones transportan momento lineal relativista $p = h / \\lambda$ mediante el choque elástico con electrones en reposo.',
        contentMarkdown: `
Al dispersar rayos X de longitud de onda $\\lambda$ sobre electrones atómicos libres en grafito, la longitud de onda dispersada $\\lambda'$ resulta ser mayor. Aplicando la conservación del cuadrimomento relativista $P^\\mu_{\\text{fotón}} + P^\\mu_{\\text{electrón}} = P'^\\mu_{\\text{fotón}} + P'^\\mu_{\\text{electrón}}$, se obtiene la fórmula del corrimiento:
$$\\Delta \\lambda = \\lambda' - \\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta) = \\lambda_c (1 - \\cos\\theta)$$
donde $\\lambda_c = \\frac{h}{m_e c} \\approx 2.426 \\times 10^{-12}\\text{ m} = 0.02426 \\text{ Å}$ es la **Longitud de Onda Compton del Electrón**.
        `,
        formulas: [
          {
            title: 'Fórmula del Corrimiento de Compton',
            formula: '\\Delta \\lambda = \\lambda^\\prime - \\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta)',
            label: 'Ec. 2.2',
            category: 'Cinemática Relativista',
            context: 'Cambio en la longitud de onda del fotón dispersado en función del ángulo polar de deflexión $\\theta$.',
            variables: [
              { symbol: '\\Delta \\lambda', name: 'Corrimiento en longitud de onda', units: '\\text{pm} (10^{-12}\\text{ m})', description: 'Incremento en la longitud de onda de la radiación dispersada.' },
              { symbol: '\\theta', name: 'Ángulo de dispersión', units: '\\text{grados o rad}', description: 'Ángulo de deflexión del fotón respecto al haz incidente original.' },
              { symbol: '\\lambda_c = \\frac{h}{m_e c}', name: 'Longitud de onda Compton', units: '2.426\\times 10^{-12}\\text{ m}', description: 'Escala de dispersión intrínseca del electrón libre.' }
            ],
            physicalMeaning: 'Demuestra sin ambigüedad que el fotón porta momento lineal $p = h/\\lambda$ y colisiona siguiendo estrictamente la relatividad especial.'
          }
        ],
        citations: [
          'Compton, A.H. "A Quantum Theory of the Scattering of X-rays by Light Elements", Physical Review 21(5), 483–502 (1923).',
          'Eisberg, R. & Resnick, R. Quantum Physics, 2nd Ed. (Wiley, 1985), Cap. 2, §2.7.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 1, §1.1.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Eisberg & Resnick — Quantum Physics',
        chapters: 'Capítulo 2: Photons - Corpuscular Properties of Radiation',
        keyProblems: 'Problemas 2.10 y 2.18.'
      }
    ]
  },

  '03-dualidad-onda-particula': {
    id: '03-dualidad-onda-particula',
    syllabusUnit: 'UNIDAD II-III',
    syllabusTitle: 'Dualidad Onda-Partícula y Principio de Incertidumbre',
    hours: 6,
    academicWeek: 'Semana 2',
    prerequisites: ['Módulos 1 y 2', 'Óptica ondulatoria'],
    learningOutcomes: [
      'Calcular la longitud de onda de De Broglie para electrones y partículas masivas.',
      'Interpretar el experimento de la doble rendija como interferencia de amplitudes de probabilidad.',
      'Aplicar rigurosamente el Principio de Incertidumbre de Heisenberg en estimaciones de órdenes de magnitud.',
    ],
    sections: [
      {
        id: 'de-broglie',
        title: '1. Ondas de Materia de De Broglie y Difracción Electrónica',
        badge: 'Simetría Materia-Onda',
        summary: 'Toda partícula material con momento p posee una longitud de onda de De Broglie asociada lambda = h/p que produce fenómenos de difracción e interferencia.',
        contentMarkdown: `
En 1924, Louis de Broglie propuso que la naturaleza es simétrica: si los fotones exhiben comportamiento corpuscular, las partículas con masa (electrones, neutrones, átomos) deben poseer una longitud de onda cuántica asociada:
$$\\lambda = \\frac{h}{p} = \\frac{h}{mv}$$

Para un electrón no relativista acelerado por una tensión electrostática $V$, su energía cinética es $K = e V = \\frac{p^2}{2m_e}$, lo cual da:
$$\\lambda = \\frac{h}{\\sqrt{2m_e e V}} = \\frac{1.226}{\\sqrt{V \\text{ [Voltios]}}} \\text{ nm}$$
Este comportamiento fue confirmado en 1927 por Davisson y Germer al observar difracción de electrones en redes cristalinas de níquel siguiendo la ley de Bragg: $n\\lambda = 2d\\sin\\theta$.
        `,
        formulas: [
          {
            title: 'Longitud de Onda de De Broglie',
            formula: '\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2m K}}',
            label: 'Ec. 3.1',
            category: 'Ondas de Materia',
            context: 'Longitud de onda cuántica de una partícula con masa m y momento lineal p.',
            variables: [
              { symbol: '\\lambda', name: 'Longitud de onda cuántica', units: '\\text{nm} \\text{ o } \\text{m}', description: 'Periodo espacial de la fase de la función de onda de la partícula.' },
              { symbol: 'p', name: 'Momento lineal', units: '\\text{kg}\\cdot\\text{m}/\\text{s}', description: 'Cantidad de movimiento de la entidad cuántica.' },
              { symbol: 'K', name: 'Energía cinética', units: '\\text{eV} \\text{ o } \\text{J}', description: 'Energía de movimiento no relativista.' }
            ],
            physicalMeaning: 'Fundamento que justifica la microscopía electrónica de transmisión (TEM), permitiendo resoluciones picométricas miles de veces superiores a la luz visible.'
          }
        ],
        citations: [
          'De Broglie, L. "Recherches sur la théorie des quanta", Tesis Doctoral, Sorbona, Paris (1924).',
          'Davisson, C. & Germer, L.H. "Diffraction of Electrons by a Crystal of Nickel", Physical Review 30(6), 705–740 (1927).',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 1, §1.5.'
        ]
      },
      {
        id: 'heisenberg',
        title: '2. Principio de Incertidumbre de Heisenberg',
        badge: 'Incompatibilidad Operacional',
        summary: 'El principio de incertidumbre Delta x Delta p >= h-barra / 2 surge de las propiedades matemáticas de la Transformada de Fourier entre el espacio de posiciones y el de momentos.',
        contentMarkdown: `
Al intentar confinar una función de onda en una región espacial estrecha de tamaño $\\Delta x$, la descomposición espectral en ondas planas de Fourier necesariamente incorpora un rango más amplio de vectores de onda $\\Delta k$, satisfaciendo:
$$\\Delta x \\cdot \\Delta k \\geq \\frac{1}{2}$$
Multiplicando por $\\hbar$ y recordando que $p = \\hbar k$:
$$\\Delta x \\cdot \\Delta p_x \\geq \\frac{\\hbar}{2}$$

Esto implica que ningún estado cuántico físicamente realizable puede poseer simultáneamente una posición perfectamente definida ($\\Delta x = 0$) y un momento perfectamente determinado ($\\Delta p = 0$).
        `,
        formulas: [
          {
            title: 'Principio de Incertidumbre de Heisenberg',
            formula: '\\Delta x \\cdot \\Delta p_x \\ge \\frac{\\hbar}{2}',
            label: 'Ec. 3.2',
            category: 'Postulado Cuántico',
            context: 'Límite cuántico de dispersión simultánea de operadores no conmutativos [x, p] = i h-barra.',
            variables: [
              { symbol: '\\Delta x', name: 'Desviación estándar de posición', units: '\\text{m}', description: 'Incertidumbre estadística cuadrática media en la posición x.' },
              { symbol: '\\Delta p_x', name: 'Desviación estándar de momento', units: '\\text{kg}\\cdot\\text{m}/\\text{s}', description: 'Incertidumbre estadística cuadrática media en el momento p_x.' },
              { symbol: '\\hbar', name: 'Constante reducida de Planck', units: '1.05457\\times 10^{-34} \\text{ J}\\cdot\\text{s}', description: 'Cuanto mínimo de acción física.' }
            ],
            physicalMeaning: 'Impide el colapso del electrón sobre el núcleo en los átomos: si r -> 0, Delta p -> infinito, obligando al electrón a mantener una energía cinética de confinamiento mínima.'
          }
        ],
        citations: [
          'Heisenberg, W. "Über den anschaulichen Inhalt der quantentheoretischen Kinematik und Mechanik", Zeitschrift für Physik 43, 172–198 (1927).',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 1, §1.6.',
          'Feynman, R.P. The Feynman Lectures on Physics Vol. III (Addison-Wesley, 1965), Cap. 1–2.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Feynman Lectures on Physics — Vol. III',
        chapters: 'Capítulos 1 y 2',
        keyProblems: 'Experimento mental de la doble rendija con iluminación fotónica.'
      }
    ]
  },

  '04-ecuacion-schrodinger': {
    id: '04-ecuacion-schrodinger',
    syllabusUnit: 'UNIDAD IV',
    syllabusTitle: 'Ecuación de Schrödinger 1D y Densidad de Corriente',
    hours: 6,
    academicWeek: 'Semana 3-4',
    prerequisites: ['Módulos 1, 2 y 3', 'Ecuaciones diferenciales parciales'],
    learningOutcomes: [
      'Formular la Ecuación de Schrödinger 1D dependiente del tiempo.',
      'Deducir la densidad de corriente de probabilidad y la conservación de la norma.',
      'Calcular valores esperados de posición y momento con operadores hermíticos.',
    ],
    sections: [
      {
        id: 'eds-dependiente',
        title: '1. La Ecuación de Schrödinger Dependiente del Tiempo',
        badge: 'Ecuación Diferencial Maestra',
        summary: 'La ecuación lineal de primer orden en el tiempo que rige la dinámica espacio-temporal del estado cuántico Psi(x,t).',
        contentMarkdown: `
La correspondencia cuántica asocia magnitudes físicas con operadores diferenciales:
$$E \\longrightarrow i\\hbar \\frac{\\partial}{\\partial t}, \\quad p_x \\longrightarrow -i\\hbar \\frac{\\partial}{\\partial x}$$
Para una partícula no relativista de masa $m$ en un potencial $V(x)$, el balance de energía $E = \\frac{p^2}{2m} + V(x)$ produce la **Ecuación de Schrödinger**:
$$i\\hbar \\frac{\\partial \\Psi(x,t)}{\\partial t} = -\\frac{\\hbar^2}{2m} \\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t) = \\hat{H}\\Psi(x,t)$$
        `,
        formulas: [
          {
            title: 'Ecuación de Schrödinger Dependiente del Tiempo (1D)',
            formula: 'i\\hbar \\frac{\\partial \\Psi(x,t)}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2 \\Psi(x,t)}{\\partial x^2} + V(x)\\Psi(x,t)',
            label: 'Ec. 4.1',
            category: 'Dinámica Cuántica',
            context: 'Evolución temporal del vector de estado en el espacio de configuración unidimensional.',
            variables: [
              { symbol: '\\Psi(x,t)', name: 'Función de onda cuántica', units: '\\text{m}^{-1/2}', description: 'Amplitud de probabilidad del sistema.' },
              { symbol: '-\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2}', name: 'Operador de energía cinética', units: '\\text{J}', description: 'Curvatura espacial de la función de onda.' },
              { symbol: 'V(x)', name: 'Energía potencial externa', units: '\\text{J} \\text{ o } \\text{eV}', description: 'Interacción con el medio.' }
            ],
            physicalMeaning: 'Evolución determinista y unitaria: preserva la norma total del estado cuántico para todo tiempo t.'
          }
        ],
        citations: [
          'Schrödinger, E. "Quantisierung als Eigenwertproblem", Annalen der Physik 79(4), 361–376 (1926).',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 2, §2.1.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. III, §A–C.'
        ]
      },
      {
        id: 'corriente-probabilidad',
        title: '2. Densidad de Corriente y Conservación de Probabilidad',
        badge: 'Teorema de Continuidad',
        summary: 'La tasa de variación temporal de la probabilidad local se compensa con la divergencia de la densidad de corriente de probabilidad J(x,t).',
        contentMarkdown: `
Definiendo la densidad $\\rho(x,t) = |\\Psi(x,t)|^2$, su derivada temporal conduce a:
$$\\frac{\\partial \\rho}{\\partial t} + \\frac{\\partial J}{\\partial x} = 0$$
donde la densidad de corriente de probabilidad es:
$$J(x,t) = \\frac{\\hbar}{2mi} \\left( \\Psi^* \\frac{\\partial \\Psi}{\\partial x} - \\Psi \\frac{\\partial \\Psi^*}{\\partial x} \\right) = \\frac{\\hbar}{m} \\text{Im}\\left(\\Psi^* \\frac{\\partial \\Psi}{\\partial x}\\right)$$
        `,
        formulas: [
          {
            title: 'Densidad de Corriente de Probabilidad',
            formula: 'J(x,t) = \\frac{\\hbar}{2mi}\\left(\\Psi^* \\frac{\\partial \\Psi}{\\partial x} - \\Psi \\frac{\\partial \\Psi^*}{\\partial x}\\right)',
            label: 'Ec. 4.2',
            category: 'Conservación',
            context: 'Flujo de probabilidad cuántica por unidad de tiempo a través del punto x.',
            variables: [
              { symbol: 'J(x,t)', name: 'Densidad de corriente de probabilidad', units: '\\text{s}^{-1}', description: 'Tasa de probabilidad que fluye hacia la derecha (si J>0) o hacia la izquierda (si J<0).' },
              { symbol: '\\Psi^*(x,t)', name: 'Conjugado complejo de la función de onda', units: '\\text{m}^{-1/2}', description: 'Función de onda compleja conjugada.' }
            ],
            physicalMeaning: 'Para una onda plana progresiva Psi = A e^{i(kx-wt)}, J = |A|^2 (hbar k / m) = rho v, idéntica a la fórmula hidrodinámica clásica.'
          }
        ],
        citations: [
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. III, §D.',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 2, §2.4–2.5.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 2, §2.1.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 1',
        chapters: 'Capítulo I',
        keyProblems: 'Problemas I.1 y I.3.'
      }
    ]
  },

  '05-particula-libre-paquetes': {
    id: '05-particula-libre-paquetes',
    syllabusUnit: 'UNIDAD V',
    syllabusTitle: 'Partícula Libre, Paquetes de Ondas y Teorema de Ehrenfest',
    hours: 6,
    academicWeek: 'Semana 5-6',
    prerequisites: ['Módulo 4', 'Transformada de Fourier', 'Valores esperados'],
    learningOutcomes: [
      'Construir un paquete de ondas gaussiano y deducir su dispersión temporal.',
      'Diferenciar con precisión entre velocidad de fase v_f y velocidad de grupo v_g.',
      'Demostrar el Teorema de Ehrenfest y la correspondencia con las leyes de Newton.',
    ],
    sections: [
      {
        id: 'paquete-ondas-libre',
        title: '1. Partícula Libre y Dispersión del Paquete de Ondas',
        badge: 'Evolución Temporal Libre',
        summary: 'Para V(x)=0, las soluciones son ondas planas monocromáticas que no son cuadráticamente integrables por sí solas. La solución física requiere superposiciones continuas (paquetes de onda).',
        contentMarkdown: `
La ecuación de Schrödinger para una partícula libre ($V(x) = 0$) es:
$$i\\hbar \\frac{\\partial \\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\frac{\\partial^2 \\Psi}{\\partial x^2}$$
Las soluciones particulares son ondas planas $e^{i(kx - \\omega t)}$ con relación de dispersión cuadrática:
$$\\omega(k) = \\frac{\\hbar k^2}{2m}$$

Una superposición física localizada en $t=0$ como un paquete gaussiano de ancho $\\sigma_0$:
$$\\Psi(x,0) = \\frac{1}{(2\\pi \\sigma_0^2)^{1/4}} e^{-\\frac{x^2}{4\\sigma_0^2}} e^{i k_0 x}$$
evoluciona en el tiempo expandiéndose. El ancho espacial del paquete en cualquier tiempo $t$ es:
$$\\sigma_x(t) = \\sigma_0 \\sqrt{1 + \\frac{\\hbar^2 t^2}{4 m^2 \\sigma_0^4}}$$

### Velocidad de Fase vs Velocidad de Grupo
- **Velocidad de fase**: $v_f = \\frac{\\omega}{k} = \\frac{\\hbar k}{2m} = \\frac{v_{\\text{clásica}}}{2}$ (carece de significado de transporte de materia).
- **Velocidad de grupo**: $v_g = \\frac{d\\omega}{dk} = \\frac{\\hbar k}{m} = v_{\\text{clásica}}$ (coincide exactamente con la velocidad de la partícula clásica).
        `,
        formulas: [
          {
            title: 'Dispersión Temporal del Paquete Gaussiano',
            formula: '\\sigma_x(t) = \\sigma_0 \\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma_0^2}\\right)^2}',
            label: 'Ec. 5.1',
            category: 'Evolución Cuántica Libre',
            context: 'Ensanchamiento espacial inevitable de la función de onda de una partícula libre a medida que transcurre el tiempo.',
            variables: [
              { symbol: '\\sigma_x(t)', name: 'Ancho espacial cuadrático medio en el tiempo t', units: '\\text{m}', description: 'Dispersión en posición Delta x(t) de la partícula cuántica.' },
              { symbol: '\\sigma_0', name: 'Ancho espacial inicial a t=0', units: '\\text{m}', description: 'Grado de confinamiento original del paquete.' },
              { symbol: 'm', name: 'Masa de la partícula', units: '\\text{kg}', description: 'Inercia de la partícula libre (masas menores se dispersan mucho más rápido).' }
            ],
            physicalMeaning: 'Para un electrón confinado a nivel atómico (sigma_0 = 1 Å), el paquete duplica su tamaño en apenas 10^{-16} segundos, lo que prueba la necesidad de potenciales confinantes para mantener átomos estables.'
          }
        ],
        citations: [
          'Merzbacher, E. Quantum Mechanics, 3rd Ed. (Wiley, 1998), Cap. 2, §2.3–2.5.',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 2, §2.4.'
        ]
      },
      {
        id: 'teorema-ehrenfest',
        title: '2. Teorema de Ehrenfest y Límite Clásico',
        badge: 'Correspondencia Clásica',
        summary: 'Los valores esperados de los operadores cuánticos obedecen rigurosamente las ecuaciones clásicas de movimiento de Newton.',
        contentMarkdown: `
Para cualquier operador hermítico $\\hat{A}$ que no dependa explícitamente del tiempo:
$$\\frac{d}{dt} \\langle \\hat{A} \\rangle = \\frac{i}{\\hbar} \\langle [\\hat{H}, \\hat{A}] \\rangle$$

Aplicando esta relación al operador de posición $\\hat{x}$ y de momento $\\hat{p}$:
1. $[\\hat{H}, \\hat{x}] = \\left[\\frac{\\hat{p}^2}{2m}, \\hat{x}\\right] = -\\frac{i\\hbar}{m}\\hat{p} \\implies \\frac{d\\langle x \\rangle}{dt} = \\frac{\\langle p \\rangle}{m}$
2. $[\\hat{H}, \\hat{p}] = [V(x), \\hat{p}] = i\\hbar \\frac{\\partial V}{\\partial x} \\implies \\frac{d\\langle p \\rangle}{dt} = -\\left\\langle \\frac{\\partial V}{\\partial x} \\right\\rangle = \\langle F(x) \\rangle$

Si el paquete de onda está fuertemente localizado en una escala donde el potencial varía suavemente ($V(x)$ casi lineal), $\\langle F(x) \\rangle \\approx F(\\langle x \\rangle)$, recuperando la Segunda Ley de Newton clásica: $m\\frac{d^2\\langle x \\rangle}{dt^2} = F(\\langle x \\rangle)$.
        `,
        formulas: [
          {
            title: 'Teorema de Ehrenfest',
            formula: '\\frac{d\\langle x \\rangle}{dt} = \\frac{\\langle p \\rangle}{m}, \\quad \\frac{d\\langle p \\rangle}{dt} = -\\left\\langle \\frac{\\partial V}{\\partial x}\\right\\rangle',
            label: 'Ec. 5.2',
            category: 'Límite Clásico',
            context: 'Evolución de los valores esperados de posición y momento en cualquier potencial conservativo.',
            variables: [
              { symbol: '\\langle x \\rangle', name: 'Valor esperado de la posición', units: '\\text{m}', description: 'Centro de gravedad o posición media de la nube cuántica de probabilidad.' },
              { symbol: '\\langle p \\rangle', name: 'Valor esperado del momento lineal', units: '\\text{kg}\\cdot\\text{m}/\\text{s}', description: 'Momento medio de la partícula.' },
              { symbol: '-\\left\\langle \\frac{\\partial V}{\\partial x}\\right\\rangle', name: 'Valor esperado de la fuerza clásica', units: '\\text{N} (Newton)', description: 'Fuerza promedio ejercida por el campo de potencial sobre el estado cuántico.' }
            ],
            physicalMeaning: 'Demuestra formalmente el Principio de Correspondencia de Bohr: en el límite macroscópico, la mecánica cuántica reproduce fielmente las leyes de Newton.'
          }
        ],
        citations: [
          'Ehrenfest, P. "Bemerkung über die angenäherte Gültigkeit der klassischen Mechanik innerhalb der Quantenmechanik", Zeitschrift für Physik 45(7-8), 455–457 (1927).',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 1, §1.5.',
          'Merzbacher, E. Quantum Mechanics, 3rd Ed. (Wiley, 1998), Cap. 2, §2.8.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Merzbacher — Quantum Mechanics',
        chapters: 'Chapter 2: Wave Packets and Ehrenfest Theorem',
        keyProblems: 'Problemas 2.3 y 2.6.'
      }
    ]
  },

  '06-potenciales-1d': {
    id: '06-potenciales-1d',
    syllabusUnit: 'UNIDAD VI',
    syllabusTitle: 'Solución de la Ecuación de Schrödinger para Potenciales Seccionalmente Constantes',
    hours: 6,
    academicWeek: 'Semana 7',
    prerequisites: ['Módulos 4 y 5', 'Condiciones de frontera', 'Álgebra de funciones trigonométricas e hiperbólicas'],
    learningOutcomes: [
      'Aplicar condiciones de continuidad para psi(x) y dpsi/dx en discontinuidades de potencial finito.',
      'Deducir rigurosamente las energías propias y funciones propias del pozo cuadrado infinito.',
      'Analizar los estados ligados en el pozo finito mediante ecuaciones trascendentes y paridad.',
    ],
    sections: [
      {
        id: 'pozo-infinito',
        title: '1. Pozo Cuadrado Infinito Unidimensional (Partícula en una Caja)',
        badge: 'Cuantización por Confinamiento',
        summary: 'El modelo canónico que ilustra de forma transparente cómo las condiciones de frontera espaciales fuerzan la discretización de los niveles energéticos.',
        contentMarkdown: `
Consideremos una partícula de masa $m$ confinada en una región $0 < x < L$ con paredes impenetrables:
$$V(x) = \\begin{cases} 0 & \\text{si } 0 < x < L \\\\ \\infty & \\text{si } x \\leq 0 \\text{ o } x \\geq L \\end{cases}$$

Fuera de la caja, la probabilidad de encontrar la partícula es estrictamente nula, por lo que $\\psi(x) = 0$ para $x \\leq 0$ y $x \\geq L$.
Dentro de la caja ($0 < x < L$), la ecuación independiente del tiempo es:
$$-\\frac{\\hbar^2}{2m}\\frac{d^2 \\psi}{dx^2} = E\\psi \\implies \\frac{d^2 \\psi}{dx^2} + k^2 \\psi = 0, \\quad k = \\frac{\\sqrt{2mE}}{\\hbar}$$
La solución general es:
$$\\psi(x) = A \\sin(kx) + B \\cos(kx)$$

Aplicando las **Condiciones de Frontera de Dirichlet**:
1. $\\psi(0) = 0 \\implies B = 0$
2. $\\psi(L) = 0 \\implies A \\sin(kL) = 0$
Para tener una solución no trivial ($A \\neq 0$), el argumento debe ser un múltiplo entero de $\\pi$:
$$k_n L = n \\pi \\implies k_n = \\frac{n\\pi}{L}, \\quad n = 1, 2, 3, \\dots$$

De aquí surgen las **Energías Cuantizadas**:
$$E_n = \\frac{\\hbar^2 k_n^2}{2m} = \\frac{n^2 \\pi^2 \\hbar^2}{2m L^2} = n^2 E_1$$
Normalizando la función propia: $\\int_0^L |\\psi_n(x)|^2 dx = 1 \\implies A = \\sqrt{\\frac{2}{L}}$:
$$\\psi_n(x) = \\sqrt{\\frac{2}{L}} \\sin\\left(\\frac{n\\pi x}{L}\\right)$$
        `,
        formulas: [
          {
            title: 'Energías Cuantizadas del Pozo Infinito 1D',
            formula: 'E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2m L^2} = \\frac{n^2 h^2}{8m L^2}, \\quad n = 1, 2, 3, \\dots',
            label: 'Ec. 6.1',
            category: 'Estados Ligados',
            context: 'Espectro discreto de energía de una partícula confinada en una región 1D de longitud L.',
            variables: [
              { symbol: 'E_n', name: 'Energía propia del estado n', units: '\\text{J} \\text{ o } \\text{eV}', description: 'Nivel discreto de energía permitido; escala cuadráticamente con n^2.' },
              { symbol: 'n', name: 'Número cuántico del pozo', units: 'n \\in \\mathbb{Z}^+', description: 'Índice del estado ligado (n=1 es el estado fundamental).' },
              { symbol: 'L', name: 'Ancho del pozo', units: '\\text{m}', description: 'Distancia entre las paredes infinitas de potencial.' },
              { symbol: 'E_1 = \\frac{\\pi^2 \\hbar^2}{2mL^2}', name: 'Energía del estado fundamental (punto cero)', units: '\\text{eV}', description: 'Energía mínima no nula obligada por el principio de incertidumbre de Heisenberg.' }
            ],
            physicalMeaning: 'Muestra que el espaciamiento entre niveles consecutivos Delta E = E_{n+1} - E_n = (2n+1)E_1 crece linealmente con n. A diferencia de la física clásica, la partícula nunca puede estar en reposo total (E_0 = 0 está prohibido).'
          }
        ],
        citations: [
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 2, §2.2.',
          'Eisberg, R. & Resnick, R. Quantum Physics, 2nd Ed. (Wiley, 1985), Cap. 6, §6.4–6.6.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Complemento G-I.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Eisberg & Resnick — Quantum Physics',
        chapters: 'Capítulo 6: Solutions of Time-Independent Schrödinger Equation',
        keyProblems: 'Problemas 6.5, 6.12 y 6.20.'
      }
    ]
  },

  '07-tunelamiento-cuantico': {
    id: '07-tunelamiento-cuantico',
    syllabusUnit: 'UNIDAD VII',
    syllabusTitle: 'Tunelamiento Cuántico y Barreras de Potencial',
    hours: 6,
    academicWeek: 'Semana 7',
    prerequisites: ['Módulo 6', 'Solución de ondas evanescentes'],
    learningOutcomes: [
      'Deducir el coeficiente de transmisión exacto T a través de una barrera rectangular de potencial.',
      'Analizar la penetración de onda evanescente en regiones clásicamente prohibidas.',
      'Comprender aplicaciones fundamentales: desintegración alfa nuclear y microscopio de efecto túnel (STM).',
    ],
    sections: [
      {
        id: 'barrera-tunel',
        title: '1. Barrera Rectangular y Efecto Túnel Cuántico',
        badge: 'Fenómeno Puramente Cuántico',
        summary: 'Una partícula cuántica con energía E menor que la altura de una barrera de potencial V0 tiene una probabilidad no nula de atravesarla.',
        contentMarkdown: `
Consideremos una barrera de potencial de altura $V_0$ y ancho $L$:
$$V(x) = \\begin{cases} 0 & x < 0 \\quad \\text{(Región I)} \\\\ V_0 & 0 \\leq x \\leq L \\quad \\text{(Región II)} \\\\ 0 & x > L \\quad \\text{(Región III)} \\end{cases}$$

Para una partícula de energía $E < V_0$:
- En Región I ($x < 0$): $\\psi_I(x) = A e^{ikx} + B e^{-ikx}$, con $k = \\frac{\\sqrt{2mE}}{\\hbar}$ (onda incidente + reflejada).
- En Región II ($0 \\leq x \\leq L$): La ecuación de Schrödinger es $\\frac{d^2\\psi}{dx^2} - \\kappa^2\\psi = 0$, con $\\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}$.
  La solución es una **onda evanescente que decae exponencialmente**: $\\psi_{II}(x) = C e^{-\\kappa x} + D e^{\\kappa x}$.
- En Región III ($x > L$): $\\psi_{III}(x) = F e^{ikx}$ (onda transmitida hacia la derecha).

Imponiendo la continuidad de $\\psi(x)$ y $\\frac{d\\psi}{dx}$ en las interfaces $x=0$ y $x=L$, el coeficiente de transmisión exacto $T = \\frac{|F|^2}{|A|^2}$ resulta:
$$T = \\left[ 1 + \\frac{V_0^2 \\sinh^2(\\kappa L)}{4E(V_0 - E)} \\right]^{-1}$$

Para barreras gruesas u opacas ($\\kappa L \\gg 1$), $\\sinh(\\kappa L) \\approx \\frac{1}{2} e^{\\kappa L}$, por lo que:
$$T \\approx 16 \\frac{E}{V_0} \\left(1 - \\frac{E}{V_0}\\right) e^{-2\\kappa L}$$
        `,
        formulas: [
          {
            title: 'Coeficiente de Transmisión Cuántica (Efecto Túnel)',
            formula: 'T = \\left[ 1 + \\frac{V_0^2 \\sinh^2(\\kappa L)}{4 E (V_0 - E)} \\right]^{-1}, \\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}',
            label: 'Ec. 7.1',
            category: 'Efecto Túnel',
            context: 'Probabilidad de que una partícula cuántica de energía E < V0 atraviese una barrera de altura V0 y espesor L.',
            variables: [
              { symbol: 'T', name: 'Coeficiente de transmisión', units: '0 \\leq T \\leq 1 \\text{ (adimensional)}', description: 'Probabilidad cuántica neta de atravesar la barrera prohibida.' },
              { symbol: '\\kappa', name: 'Constante de atenuación evanescente', units: '\\text{m}^{-1}', description: 'Tasa de decaimiento exponencial de la amplitud dentro de la barrera.' },
              { symbol: 'L', name: 'Espesor de la barrera de potencial', units: '\\text{nm} \\text{ o } \\text{m}', description: 'Ancho espacial de la región con potencial V0.' },
              { symbol: 'V_0 - E', name: 'Déficit de energía clásica', units: '\\text{eV}', description: 'Diferencia entre la altura del potencial y la energía de la partícula incidente.' }
            ],
            physicalMeaning: 'Clásicamente, T=0 de forma estricta si E < V0. Cuánticamente, la onda evanescente no se anula instantáneamente en la interfaz; si el espesor L es del orden de la longitud de onda de De Broglie, emerge una onda propagante al otro lado.'
          }
        ],
        citations: [
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 2, §2.5.',
          'Merzbacher, E. Quantum Mechanics, 3rd Ed. (Wiley, 1998), Cap. 5, §5.3–5.5.',
          'Gamow, G. "Zur Quantentheorie des Atomkernes", Zeitschrift für Physik 51, 204–212 (1928).'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Merzbacher — Quantum Mechanics',
        chapters: 'Chapter 5: Potentials with Discontinuities and Barrier Penetration',
        keyProblems: 'Problemas 5.2 y 5.7.'
      }
    ]
  },

  '08-formalismo-dirac': {
    id: '08-formalismo-dirac',
    syllabusUnit: 'UNIDAD VIII',
    syllabusTitle: 'Álgebra de Dirac y Formalismo Cuántico',
    hours: 6,
    academicWeek: 'Semana 9',
    prerequisites: ['Módulos 4-7', 'Espacios de Hilbert', 'Álgebra lineal de operadores'],
    learningOutcomes: [
      'Operar con vectores de estado en la notación Bra-Ket de Dirac.',
      'Representar operadores cuánticos como matrices en bases discretas y continuas.',
      'Deducir el teorema de incertidumbre de Robertson para cualquier par de observables.',
    ],
    sections: [
      {
        id: 'bra-ket-dirac',
        title: '1. Espacios de Hilbert y Notación Bra-Ket',
        badge: 'Lenguaje Universal de la Cuántica',
        summary: 'P.A.M. Dirac unificó la mecánica ondulatoria de Schrödinger y la mecánica matricial de Heisenberg mediante la formulación abstracta en espacios de Hilbert.',
        contentMarkdown: `
Un estado físico cuántico se representa por un vector unitario llamado **Ket** $|\\psi\\rangle$ perteneciente a un espacio de Hilbert complejo separable $\\mathcal{H}$.
A cada Ket $|\\psi\\rangle$ le corresponde un vector dual llamado **Bra** $\\langle\\psi| \\in \\mathcal{H}^*$.

### Propiedades Fundamentales
1. **Producto Interno**: $\\langle \\phi | \\psi \\rangle = \\langle \\psi | \\phi \\rangle^*$ (es sesquilineal y define una norma finita $\\|\\psi\\| = \\sqrt{\\langle \\psi | \\psi \\rangle} = 1$).
2. **Relación de Completitud (Cierre)**: Para cualquier base ortonormal completa $\{|u_n\\rangle\}$:
$$\\sum_n |u_n\\rangle \\langle u_n| = \\hat{I} \\quad \\text{(identidad)}$$
Esto permite proyectar cualquier estado $|\\psi\\rangle$:
$$|\\psi\\rangle = \\hat{I} |\\psi\\rangle = \\sum_n |u_n\\rangle \\langle u_n | \\psi\\rangle = \\sum_n c_n |u_n\\rangle, \\quad c_n = \\langle u_n | \\psi\\rangle$$
donde $|c_n|^2$ es la probabilidad de medir el valor propio correspondiente a $|u_n\\rangle$.
        `,
        formulas: [
          {
            title: 'Relación de Completitud y Expansión en la Base de Dirac',
            formula: '|\\psi\\rangle = \\sum_n |u_n\\rangle \\langle u_n | \\psi\\rangle, \\quad \\sum_n |u_n\\rangle \\langle u_n| = \\hat{I}',
            label: 'Ec. 8.1',
            category: 'Álgebra de Dirac',
            context: 'Resolución de la identidad y descomposición espectral de cualquier vector de estado.',
            variables: [
              { symbol: '|\\psi\\rangle', name: 'Vector de estado (Ket)', units: '\\text{adimensional}', description: 'Estado cuántico del sistema en el espacio abstracto de Hilbert.' },
              { symbol: '|u_n\\rangle\\langle u_n|', name: 'Operador de proyección ortogonal', units: '\\text{adimensional}', description: 'Proyecta cualquier vector sobre el subespacio generado por el autovector |u_n>.' },
              { symbol: 'c_n = \\langle u_n | \\psi\\rangle', name: 'Amplitud de probabilidad de transición', units: '\\text{adimensional}', description: 'Producto escalar cuya norma al cuadrado |c_n|^2 da la probabilidad de medir el autovalor a_n.' }
            ],
            physicalMeaning: 'Generaliza la descomposición en series de Fourier a cualquier observable físico medible.'
          }
        ],
        citations: [
          'Dirac, P.A.M. The Principles of Quantum Mechanics, 4th Ed. (Oxford University Press, 1958), Cap. I–III.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. II, §A–E.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 1, §1.2–1.4.'
        ]
      },
      {
        id: 'conmutadores-robertson',
        title: '2. Conmutadores y Principio de Incertidumbre de Robertson',
        badge: 'Teorema de Medición Cuántica',
        summary: 'Para dos observables representados por operadores hermíticos A y B, la incompatibilidad en la medición simultánea viene dada por el conmutador [A, B].',
        contentMarkdown: `
El conmutador entre dos operadores $\\hat{A}$ y $\\hat{B}$ se define como:
$$[\\hat{A}, \\hat{B}] = \\hat{A}\\hat{B} - \\hat{B}\\hat{A}$$

El **Teorema de Robertson-Schrödinger (1929)** demuestra rigurosamente que para cualquier estado cuántico $|\\psi\\rangle$:
$$\\Delta A \\cdot \\Delta B \\geq \\frac{1}{2} |\\langle [\\hat{A}, \\hat{B}] \\rangle|$$

Para la posición y momento lineal, la relación canónica de conmutación de Heisenberg es:
$$[\\hat{x}, \\hat{p}_x] = i\\hbar \\hat{I} \\implies \\Delta x \\Delta p_x \\geq \\frac{1}{2}|\\langle i\\hbar \\rangle| = \\frac{\\hbar}{2}$$
        `,
        formulas: [
          {
            title: 'Relación de Incertidumbre Generalizada de Robertson',
            formula: '\\Delta A \\cdot \\Delta B \\ge \\frac{1}{2}\\left|\\langle [\\hat{A}, \\hat{B}] \\rangle\\right|',
            label: 'Ec. 8.2',
            category: 'Teorema Fundamental',
            context: 'Límite de dispersión estadística para cualquier par de operadores hermíticos arbitrarios.',
            variables: [
              { symbol: '\\Delta A', name: 'Incertidumbre en el observable A', units: '\\text{unidades de A}', description: '\\sqrt{\\langle \\hat{A}^2 \\rangle - \\langle \\hat{A} \\rangle^2}.' },
              { symbol: '\\Delta B', name: 'Incertidumbre en el observable B', units: '\\text{unidades de B}', description: '\\sqrt{\\langle \\hat{B}^2 \\rangle - \\langle \\hat{B} \\rangle^2}.' },
              { symbol: '[\\hat{A}, \\hat{B}]', name: 'Conmutador de operadores', units: '\\text{unidades de A}\\times\\text{B}', description: 'Medida del grado de incompatibilidad física entre ambas mediciones.' }
            ],
            physicalMeaning: 'Si dos observables conmutan ([A, B] = 0), admiten una base común de autovectores simultáneos y pueden medirse juntos con precisión perfecta sin interferirse.'
          }
        ],
        citations: [
          'Robertson, H.P. "The Uncertainty Principle", Physical Review 34(1), 163–164 (1929).',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 1, §1.4.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. III, §D.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 1',
        chapters: 'Capítulo II: The Mathematical Tools of Quantum Mechanics',
        keyProblems: 'Problemas II.1, II.4 y II.7.'
      }
    ]
  },

  '09-oscilador-armonico': {
    id: '09-oscilador-armonico',
    syllabusUnit: 'UNIDAD IX',
    syllabusTitle: 'Oscilador Armónico Cuántico (Analítico y Algebraico)',
    hours: 6,
    academicWeek: 'Semana 9-10',
    prerequisites: ['Módulos 6 y 8', 'Operadores escalera'],
    learningOutcomes: [
      'Resolver el oscilador armónico mediante la ecuación diferencial y polinomios de Hermite.',
      'Dominar el método algebraico de Dirac con los operadores escalera de aniquilación y creación.',
      'Demostrar la existencia de la energía de punto cero E0 = (1/2) h-barra omega.',
    ],
    sections: [
      {
        id: 'metodo-algebraico-operadores',
        title: '1. Método Algebraico Elegante de Operadores Escalera (Dirac)',
        badge: 'Solución Algebraica',
        summary: 'Dirac demostró que el espectro del oscilador armónico puede resolverse completamente sin resolver una sola ecuación diferencial, usando operadores no hermíticos a y a-dagger.',
        contentMarkdown: `
El Hamiltoniano del oscilador armónico 1D es:
$$\\hat{H} = \\frac{\\hat{p}^2}{2m} + \\frac{1}{2}m\\omega^2 \\hat{x}^2$$

Definimos los **operadores escalera adimensionales**:
- **Operador de aniquilación (bajada)**: $\\hat{a} = \\sqrt{\\frac{m\\omega}{2\\hbar}} \\left(\\hat{x} + \\frac{i}{m\\omega}\\hat{p}\\right)$
- **Operador de creación (subida)**: $\\hat{a}^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}} \\left(\\hat{x} - \\frac{i}{m\\omega}\\hat{p}\\right)$

Usando la relación canónica $[\\hat{x}, \\hat{p}] = i\\hbar$, calculamos su conmutador:
$$[\\hat{a}, \\hat{a}^\\dagger] = \\frac{m\\omega}{2\\hbar} \\left( -\\frac{i}{m\\omega}[\\hat{x}, \\hat{p}] + \\frac{i}{m\\omega}[\\hat{p}, \\hat{x}] \\right) = \\frac{1}{2\\hbar} (\\hbar + \\hbar) = 1$$

El Hamiltoniano se factoriza exactamente como:
$$\\hat{H} = \\hbar\\omega \\left( \\hat{a}^\\dagger \\hat{a} + \\frac{1}{2} \\right) = \\hbar\\omega \\left( \\hat{N} + \\frac{1}{2} \\right)$$
donde $\\hat{N} = \\hat{a}^\\dagger \\hat{a}$ es el **Operador Número**, cuyos autovalores son enteros no negativos $n = 0, 1, 2, 3, \\dots$.

### Acción de los Operadores sobre los Estados $|n\\rangle$
- $\\hat{a} |n\\rangle = \\sqrt{n} |n-1\\rangle$
- $\\hat{a}^\\dagger |n\\rangle = \\sqrt{n+1} |n+1\\rangle$
- Condición del estado fundamental: $\\hat{a}|0\\rangle = 0$
        `,
        formulas: [
          {
            title: 'Niveles de Energía Cuantizados del Oscilador Armónico',
            formula: 'E_n = \\left(n + \\frac{1}{2}\\right)\\hbar\\omega, \\quad n = 0, 1, 2, 3, \\dots',
            label: 'Ec. 9.1',
            category: 'Oscilador Cuántico',
            context: 'Espectro discreto con espaciamiento estrictamente uniforme Delta E = h-barra omega.',
            variables: [
              { symbol: 'E_n', name: 'Energía del nivel n', units: '\\text{J} \\text{ o } \\text{eV}', description: 'Niveles equidistantes generados por la acción sucesiva de a-dagger.' },
              { symbol: '\\omega = \\sqrt{k/m}', name: 'Frecuencia angular clásica del oscilador', units: '\\text{rad}/\\text{s}', description: 'Frecuencia característica de oscilación del potencial cuadrático.' },
              { symbol: 'E_0 = \\frac{1}{2}\\hbar\\omega', name: 'Energía de punto cero (Zero-Point Energy)', units: '\\text{eV}', description: 'Energía residual mínima del estado fundamental (n=0).' }
            ],
            physicalMeaning: 'El estado fundamental posee una energía positiva irreductible E_0 = (1/2) hbar omega. La partícula nunca puede detenerse en el fondo del pozo porque violaría el principio de incertidumbre Delta x Delta p >= hbar/2.'
          }
        ],
        citations: [
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 2, §2.3.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. V, §A–D.',
          'Dirac, P.A.M. The Principles of Quantum Mechanics, 4th Ed. (Oxford, 1958), Cap. XI.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 1',
        chapters: 'Capítulo V: The Harmonic Oscillator',
        keyProblems: 'Problemas V.2, V.4 y V.9.'
      }
    ]
  },

  '10-atomo-hidrogeno': {
    id: '10-atomo-hidrogeno',
    syllabusUnit: 'UNIDAD X',
    syllabusTitle: 'Átomo de Hidrógeno y Potenciales Centrales (Parte Radial)',
    hours: 6,
    academicWeek: 'Semana 11',
    prerequisites: ['Módulos 8 y 9', 'Coordenadas esféricas', 'Polinomios de Laguerre'],
    learningOutcomes: [
      'Separar la ecuación de Schrödinger en coordenadas esféricas para potenciales centrales.',
      'Identificar la barrera centrífuga en el potencial radial efectivo.',
      'Deducir los niveles de energía propios y las funciones radiales de Laguerre.',
    ],
    sections: [
      {
        id: 'potencial-central-radial',
        title: '1. Separación de Variables y Ecuación Radial',
        badge: 'Problema de Fuerzas Centrales 3D',
        summary: 'En un potencial electrostático coulombiano V(r) = -e^2 / (4 pi epsilon0 r), el Hamiltoniano se desacopla en una ecuación radial R(r) y una ecuación angular Y(theta, phi).',
        contentMarkdown: `
El Laplaciano en coordenadas esféricas $(r, \\theta, \\phi)$ es:
$$\\nabla^2 = \\frac{1}{r^2} \\frac{\\partial}{\\partial r}\\left(r^2 \\frac{\\partial}{\\partial r}\\right) - \\frac{\\hat{L}^2}{\\hbar^2 r^2}$$
donde $\\hat{L}^2$ es el operador cuadrado del momento angular orbital.

Proponiendo la separación $\\psi(r, \\theta, \\phi) = R(r) Y(\\theta, \\phi)$, la ecuación angular da los **Armónicos Esféricos** $\\hat{L}^2 Y_l^m = \\hbar^2 l(l+1) Y_l^m$.
Sustituyendo en la ecuación radial para la función modificada $u(r) = r R(r)$:
$$-\\frac{\\hbar^2}{2\\mu} \\frac{d^2 u}{dr^2} + V_{\\text{eff}}(r) u(r) = E u(r)$$
donde el **Potencial Efectivo** es:
$$V_{\\text{eff}}(r) = -\\frac{e^2}{4\\pi\\varepsilon_0 r} + \\frac{\\hbar^2 l(l+1)}{2\\mu r^2}$$
El segundo término representa la **barrera de repulsión centrífuga cuántica**, que evita que el electrón con $l > 0$ penetre en el origen $r=0$.

La solución analítica convergente exige que la energía dependa exclusivamente del **número cuántico principal $n$**:
$$E_n = -\\frac{\\mu e^4}{32\\pi^2 \\varepsilon_0^2 \\hbar^2 n^2} = -\\frac{13.606 \\text{ eV}}{n^2}, \\quad n = 1, 2, 3, \\dots$$
donde para cada $n$, $l \\in \\{0, 1, \\dots, n-1\\}$, y para cada $l$, $m \\in \\{-l, \\dots, +l\\}$. La degeneración total del nivel $n$ (sin espín) es:
$$g_n = \\sum_{l=0}^{n-1} (2l + 1) = n^2$$
        `,
        formulas: [
          {
            title: 'Potencial Efectivo Radial del Átomo de Hidrógeno',
            formula: 'V_{\\text{eff}}(r) = -\\frac{e^2}{4\\pi\\varepsilon_0 r} + \\frac{\\hbar^2 l(l+1)}{2\\mu r^2}',
            label: 'Ec. 10.1',
            category: 'Potencial Central',
            context: 'Potencial 1D efectivo que gobierna el movimiento radial u(r) = r R(r).',
            variables: [
              { symbol: 'V_{\\text{eff}}(r)', name: 'Potencial efectivo radial', units: '\\text{J} \\text{ o } \\text{eV}', description: 'Suma del potencial atractivo de Coulomb y la barrera cuántica centrífuga.' },
              { symbol: '\\frac{\\hbar^2 l(l+1)}{2\\mu r^2}', name: 'Barrera centrífuga cuántica', units: '\\text{eV}', description: 'Repulsión geométrica debida a la rotación del estado orbital l > 0.' },
              { symbol: '\\mu = \\frac{m_e m_p}{m_e + m_p}', name: 'Masa reducida del sistema', units: '9.104\\times 10^{-31} \\text{ kg}', description: 'Masa inercial efectiva corregida por el retroceso del núcleo de hidrógeno.' }
            ],
            physicalMeaning: 'Explica por qué los orbitales s (l=0) tienen probabilidad no nula en r=0, mientras que los orbitales p, d, f (l>=1) poseen un nodo estricto en el origen r=0 debido a la barrera centrífuga.'
          }
        ],
        citations: [
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 4, §4.2.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. VII, §A–C.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 3, §3.7.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 1',
        chapters: 'Capítulo VII: The Hydrogen Atom',
        keyProblems: 'Problemas VII.1 y VII.3.'
      }
    ]
  },

  '11-momento-angular-espin': {
    id: '11-momento-angular-espin',
    syllabusUnit: 'UNIDAD XI',
    syllabusTitle: 'Momento Angular, Armónicos Esféricos y Espín 1/2',
    hours: 6,
    academicWeek: 'Semana 12-13',
    prerequisites: ['Módulos 8 y 10', 'Álgebra de Lie de momentos angulares'],
    learningOutcomes: [
      'Dominar el álgebra de conmutación de operadores de momento angular.',
      'Calcular las representaciones matriciales de Pauli para espín 1/2.',
      'Analizar la precesión de Larmor del momento magnético del electrón.',
    ],
    sections: [
      {
        id: 'algebra-momento-angular',
        title: '1. Álgebra de Conmutación y Armónicos Esféricos',
        badge: 'Simetría de Rotación SO(3)',
        summary: 'Los tres componentes vectoriales de momento angular no conmutan entre sí, generando el álgebra fundamental [Ji, Jj] = i h-barra epsilon_ijk Jk.',
        contentMarkdown: `
A partir de la definición $\\vec{L} = \\vec{r} \\times \\vec{p}$, los operadores de momento angular satisfacen:
$$[\\hat{L}_x, \\hat{L}_y] = i\\hbar \\hat{L}_z, \\quad [\\hat{L}_y, \\hat{L}_z] = i\\hbar \\hat{L}_x, \\quad [\\hat{L}_z, \\hat{L}_x] = i\\hbar \\hat{L}_y$$

El operador de Casimir $\\hat{L}^2 = \\hat{L}_x^2 + \\hat{L}_y^2 + \\hat{L}_z^2$ conmuta con todas las componentes:
$$[\\hat{L}^2, \\hat{L}_z] = 0$$
Por tanto, existe una base común de autoestados $|l, m\\rangle$ (los **Armónicos Esféricos** $Y_l^m(\\theta, \\phi)$):
$$\\hat{L}^2 |l, m\\rangle = \\hbar^2 l(l+1) |l, m\\rangle, \\quad \\hat{L}_z |l, m\\rangle = \\hbar m |l, m\\rangle$$
con $l = 0, 1, 2, \\dots$ y $m \\in \\{-l, -l+1, \\dots, +l\\}$.
        `,
        formulas: [
          {
            title: 'Álgebra de Conmutación del Momento Angular',
            formula: '[\\hat{J}_i, \\hat{J}_j] = i\\hbar \\sum_k \\epsilon_{ijk} \\hat{J}_k, \\quad [\\hat{J}^2, \\hat{J}_z] = 0',
            label: 'Ec. 11.1',
            category: 'Álgebra de Lie',
            context: 'Relaciones de conmutación canónicas que definen cualquier momento angular orbital, de espín o total.',
            variables: [
              { symbol: '\\hat{J}_i', name: 'Componente i del momento angular', units: '\\text{J}\\cdot\\text{s}', description: 'Operador generador de rotaciones espaciales alrededor del eje i.' },
              { symbol: '\\epsilon_{ijk}', name: 'Tensor totalmente antisimétrico de Levi-Civita', units: '\\text{adimensional}', description: '+1 para permutaciones pares, -1 para impares, 0 si hay índices repetidos.' }
            ],
            physicalMeaning: 'Impide medir simultáneamente dos componentes ortogonales del momento angular (ej. Lx y Ly no pueden conocerse a la vez).'
          }
        ],
        citations: [
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 4, §4.3.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. VI, §A–D.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 3, §3.5.'
        ]
      },
      {
        id: 'espin-pauli',
        title: '2. Espín 1/2 del Electrón y Matrices de Pauli',
        badge: 'Momento Angular Intrínseco SU(2)',
        summary: 'Uhlenbeck y Goudsmit propusieron en 1925 que el electrón posee un momento angular intrínseco s=1/2 sin análogo clásico orbital.',
        contentMarkdown: `
El operador de espín $\\vec{S}$ actúa en un espacio bidimensional generado por los estados $|\\uparrow\\rangle = \\begin{pmatrix}1\\\\0\\end{pmatrix}$ y $|\\downarrow\\rangle = \\begin{pmatrix}0\\\\1\\end{pmatrix}$:
$$\\vec{S} = \\frac{\\hbar}{2} \\vec{\\sigma}$$
donde las **Matrices de Pauli** son:
$$\\sigma_x = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\quad \\sigma_y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, \\quad \\sigma_z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$

Propiedades algebraicas esenciales:
- $\\sigma_x^2 = \\sigma_y^2 = \\sigma_z^2 = I$
- $\\sigma_i \\sigma_j = \\delta_{ij} I + i \\sum_k \\epsilon_{ijk} \\sigma_k$
- $\\text{Tr}(\\sigma_i) = 0, \\quad \\det(\\sigma_i) = -1$
        `,
        formulas: [
          {
            title: 'Matrices de Pauli y Operador de Espín 1/2',
            formula: '\\vec{S} = \\frac{\\hbar}{2}\\vec{\\sigma}, \\quad \\sigma_x = \\begin{pmatrix}0&1\\\\\\\\1&0\\end{pmatrix}, \\, \\sigma_y = \\begin{pmatrix}0&-i\\\\\\\\i&0\\end{pmatrix}, \\, \\sigma_z = \\begin{pmatrix}1&0\\\\\\\\0&-1\\end{pmatrix}',
            label: 'Ec. 11.2',
            category: 'Espín Cuántico',
            context: 'Representación matricial fundamental bidimensional del grupo de simetría de espín SU(2).',
            variables: [
              { symbol: '\\vec{S}', name: 'Operador vectorial de espín', units: '\\text{J}\\cdot\\text{s}', description: 'Momento angular intrínseco fundamental del electrón.' },
              { symbol: '\\vec{\\sigma}', name: 'Vector de matrices de Pauli', units: '\\text{adimensional}', description: 'Trío de matrices hermíticas 2x2 de traza nula.' }
            ],
            physicalMeaning: 'El factor giromagnético $g_e \\approx 2$ del espín electrónico hace que su momento dipolar magnético sea el doble de lo predicho clásicamente: $\\vec{\\mu}_S = -g_e \\frac{e}{2m_e}\\vec{S} \\approx -\\frac{e}{m_e}\\vec{S}$.'
          }
        ],
        citations: [
          'Uhlenbeck, G.E. & Goudsmit, S. "Spinning Electrons and the Structure of Spectra", Nature 117, 264–265 (1926).',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. IX, §A–C.',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 4, §4.4.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 1',
        chapters: 'Capítulo VI: Angular Momentum & Capítulo IX: Spin 1/2',
        keyProblems: 'Problemas VI.3 y IX.2.'
      }
    ]
  },

  '12-stern-gerlach': {
    id: '12-stern-gerlach',
    syllabusUnit: 'UNIDAD XII',
    syllabusTitle: 'Experimento de Stern-Gerlach y Composición de Momentos Angulares',
    hours: 6,
    academicWeek: 'Semana 13, 15',
    prerequisites: ['Módulo 11', 'Coeficientes de Clebsch-Gordan'],
    learningOutcomes: [
      'Analizar la separación del haz de plata en el experimento de Stern-Gerlach con campos magnéticos inhomogéneos.',
      'Modelar el colapso del vector de estado en mediciones cuánticas sucesivas SGz -> SGx -> SGz.',
      'Componer dos momentos angulares j1 y j2 mediante coeficientes de Clebsch-Gordan.',
    ],
    sections: [
      {
        id: 'stern-gerlach-medicion',
        title: '1. El Experimento de Stern-Gerlach (1922)',
        badge: 'Cuantización Espacial Directa',
        summary: 'Al pasar un haz de átomos de plata a través de un campo magnético inhomogéneo dB_z/dz, el haz se divide en exactamente dos trazas discretas, demostrando el espín 1/2.',
        contentMarkdown: `
La energía potencial de un dipolo magnético $\\vec{\\mu}$ en un campo magnético $\\vec{B}$ es $U = -\\vec{\\mu} \\cdot \\vec{B}$.
Si el campo posee un gradiente espacial inhomogéneo $\\frac{\\partial B_z}{\\partial z}$, se ejerce una fuerza deflectora neta sobre el átomo:
$$F_z = -\\frac{\\partial U}{\\partial z} = \\mu_z \\frac{\\partial B_z}{\\partial z} = -g_s \\mu_B m_s \\frac{\\partial B_z}{\\partial z}$$

Clásicamente, como el momento dipolar magnético $\\vec{\\mu}$ puede apuntar en cualquier dirección continua del espacio tridimensional, $\\mu_z = |\\mu|\\cos\\theta$ debería variar continuamente entre $-|\\mu|$ y $+|\\mu|$, produciendo una mancha continua sobre la placa colectora.
En cambio, Stern y Gerlach observaron **dos líneas delgadas discretas**, correspondientes a los dos únicos valores propios posibles de $S_z$:
$$S_z = +\\frac{\\hbar}{2} \\quad (\\text{spin up}) \\quad \\text{y} \\quad S_z = -\\frac{\\hbar}{2} \\quad (\\text{spin down})$$

### Mediciones Cuánticas Secuenciales $SG_z \\to SG_x \\to SG_z$
1. Filtramos el haz con un analizador $SG_z$, dejando pasar únicamente el estado $|\\uparrow_z\\rangle$.
2. Enviamos este haz a un segundo analizador orientado según el eje $x$ ($SG_x$). Como $|\\uparrow_z\\rangle = \\frac{1}{\\sqrt{2}}(|\\uparrow_x\\rangle + |\\downarrow_x\\rangle)$, el haz se divide en dos haces de igual intensidad (50% up, 50% down).
3. Si ahora seleccionamos el haz $|\\uparrow_x\\rangle$ y lo volvemos a pasar por un tercer analizador $SG_z$, **vuelve a emerger un haz dividido en spin up y spin down (50% y 50%)**. La medición intermedia en el eje $x$ destruyó por completo la información previa del eje $z$ debido a la incompatibilidad de operadores $[S_x, S_z] \\neq 0$.
        `,
        formulas: [
          {
            title: 'Fuerza Cuántica en el Dispositivo de Stern-Gerlach',
            formula: 'F_z = -\\frac{\\partial U}{\\partial z} = \\mu_z \\frac{\\partial B_z}{\\partial z} = \\mp \\mu_B \\frac{\\partial B_z}{\\partial z}',
            label: 'Ec. 12.1',
            category: 'Fuerza Inhomogénea',
            context: 'Fuerza magnética deflectora que separa físicamente los autoestados de espín.',
            variables: [
              { symbol: 'F_z', name: 'Fuerza deflectora en el eje z', units: '\\text{N} (Newton)', description: 'Fuerza que desvía los átomos hacia arriba o hacia abajo según su proyección de espín.' },
              { symbol: '\\frac{\\partial B_z}{\\partial z}', name: 'Gradiente del campo magnético', units: '\\text{Tesla}/\\text{m}', description: 'Inhomogeneidad del campo generada por las piezas polares afiladas del imán.' },
              { symbol: '\\mu_B = \\frac{e\\hbar}{2m_e}', name: 'Magnetón de Bohr', units: '9.274\\times 10^{-24} \\text{ J}/\\text{T}', description: 'Cuanto elemental de momento magnético atómico.' }
            ],
            physicalMeaning: 'Demuestra experimentalmente el colapso del estado cuántico y la cuantización espacial del momento angular.'
          }
        ],
        citations: [
          'Stern, O. & Gerlach, W. "Der experimentelle Nachweis der Richtungsquantelung im Magnetfeld", Zeitschrift für Physik 9(1), 349–352 (1922).',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 1, §1.1.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 1 (Wiley, 1977), Cap. IV, §A.'
        ]
      },
      {
        id: 'clebsch-gordan',
        title: '2. Composición de Momentos Angulares y Coeficientes de Clebsch-Gordan',
        badge: 'Adición Cuántica J = J1 + J2',
        summary: 'Para sumar dos momentos angulares cuánticos, el número cuántico total j toma valores discretos en saltos de 1 entre |j1 - j2| y j1 + j2.',
        contentMarkdown: `
Al considerar dos subsistemas cuánticos independientes con momentos angulares $\\vec{J}_1$ y $\\vec{J}_2$, el operador momento angular total es:
$$\\vec{J} = \\vec{J}_1 + \\vec{J}_2, \\quad \\hat{J}_z = \\hat{J}_{1z} + \\hat{J}_{2z}$$

Existen dos bases ortonormales completas del espacio producto tensorial $\\mathcal{H}_1 \\otimes \\mathcal{H}_2$:
1. **Base Desacoplada**: $|j_1, m_1\\rangle \\otimes |j_2, m_2\\rangle = |j_1, m_1; j_2, m_2\\rangle$
2. **Base Acoplada**: $|j, m; j_1, j_2\\rangle$, autovectores simultáneos de $\\hat{J}^2$ y $\\hat{J}_z$.

El número cuántico total $j$ solo puede tomar los valores:
$$|j_1 - j_2| \\leq j \\leq j_1 + j_2 \\quad (\\text{en saltos enteros de 1})$$
y para cada $j$, $m \\in \\{-j, -j+1, \\dots, +j\\}$ con la condición estricta $m = m_1 + m_2$.

La transformación unitaria entre ambas bases se realiza mediante los **Coeficientes de Clebsch-Gordan**:
$$|j, m\\rangle = \\sum_{m_1, m_2} \\langle j_1 m_1 j_2 m_2 | j m \\rangle |j_1 m_1; j_2 m_2\\rangle$$
        `,
        formulas: [
          {
            title: 'Transformación de Base con Coeficientes de Clebsch-Gordan',
            formula: '|j, m\\rangle = \\sum_{m_1 = -j_1}^{j_1} \\sum_{m_2 = -j_2}^{j_2} \\langle j_1 m_1 j_2 m_2 | j m \\rangle |j_1 m_1\\rangle |j_2 m_2\\rangle',
            label: 'Ec. 12.2',
            category: 'Composición de Momentos',
            context: 'Cambio de base entre la representación desacoplada y la representación acoplada del momento angular total.',
            variables: [
              { symbol: '\\langle j_1 m_1 j_2 m_2 | j m \\rangle', name: 'Coeficiente de Clebsch-Gordan', units: '\\text{adimensional}', description: 'Elementos de matriz ortogonales reales que ponderan la proyección cuántica entre ambas bases.' },
              { symbol: 'j', name: 'Momento angular total', units: '|j_1 - j_2| \\le j \\le j_1 + j_2', description: 'Número cuántico del operador J^2.' },
              { symbol: 'm = m_1 + m_2', name: 'Proyección total z', units: '-j \\le m \\le +j', description: 'Conservación estricta de la componente z del momento angular.' }
            ],
            physicalMeaning: 'Fundamental para calcular el acoplamiento espín-órbita L dot S en átomos multielectrónicos y el desdoblamiento fino de líneas espectrales.'
          }
        ],
        citations: [
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 2 (Wiley, 1977), Cap. X, §A–D.',
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 4, §4.4.3.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 3, §3.8.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 2',
        chapters: 'Capítulo X: Addition of Angular Momenta',
        keyProblems: 'Problemas X.1 y X.5 (composición de dos espines 1/2: triplete y singlete).'
      }
    ]
  },

  '13-perturbaciones': {
    id: '13-perturbaciones',
    syllabusUnit: 'UNIDAD XIII',
    syllabusTitle: 'Teoría de Perturbaciones Estacionarias y Dependientes del Tiempo',
    hours: 12,
    academicWeek: 'Semana 14',
    prerequisites: ['Módulos 8, 9 y 10', 'Álgebra de autovalores de matrices hermíticas'],
    learningOutcomes: [
      'Calcular correcciones de primer y segundo orden a la energía en sistemas no degenerados.',
      'Resolver la ruptura de degeneración mediante diagonalización secular (Efecto Stark).',
      'Comprender la formulación de perturbaciones periódicas y la Regla de Oro de Fermi.',
    ],
    sections: [
      {
        id: 'perturbaciones-no-degeneradas',
        title: '1. Teoría de Perturbaciones Independiente del Tiempo (Caso No Degenerado)',
        badge: 'Aproximación Cuántica Sistemática',
        summary: 'Cuando el Hamiltoniano exacto no tiene solución analítica cerrada pero difiere ligeramente de uno conocido H0, H = H0 + lambda H prime.',
        contentMarkdown: `
Supongamos resuelto el problema no perturbado: $\\hat{H}_0 |\\psi_n^{(0)}\\rangle = E_n^{(0)} |\\psi_n^{(0)}\\rangle$.
Queremos resolver la ecuación exacta para $\\hat{H} = \\hat{H}_0 + \\lambda \\hat{H}'$:
$$(\\hat{H}_0 + \\lambda \\hat{H}') |\\psi_n\\rangle = E_n |\\psi_n\\rangle$$

Expandiendo en serie de potencias del parámetro perturbativo $\\lambda \\ll 1$:
$$E_n = E_n^{(0)} + \\lambda E_n^{(1)} + \\lambda^2 E_n^{(2)} + \\dots$$
$$|\\psi_n\\rangle = |\\psi_n^{(0)}\\rangle + \\lambda |\\psi_n^{(1)}\\rangle + \\lambda^2 |\\psi_n^{(2)}\\rangle + \\dots$$

### 1. Corrección a la Energía de Primer Orden
Proyectando con $\\langle \\psi_n^{(0)}|$:
$$E_n^{(1)} = \\langle \\psi_n^{(0)} | \\hat{H}' | \\psi_n^{(0)} \\rangle$$
La corrección de primer orden es simplemente **el valor esperado de la perturbación en el estado no perturbado**.

### 2. Corrección al Estado de Primer Orden
$$|\\psi_n^{(1)}\\rangle = \\sum_{k \\neq n} \\frac{\\langle \\psi_k^{(0)} | \\hat{H}' | \\psi_n^{(0)} \\rangle}{E_n^{(0)} - E_k^{(0)}} |\\psi_k^{(0)}\\rangle$$

### 3. Corrección a la Energía de Segundo Orden
$$E_n^{(2)} = \\sum_{k \\neq n} \\frac{|\\langle \\psi_k^{(0)} | \\hat{H}' | \\psi_n^{(0)} \\rangle|^2}{E_n^{(0)} - E_k^{(0)}}$$
Nótese que para el estado fundamental ($n=0$), como $E_0^{(0)} < E_k^{(0)}$ para todo $k$, el denominador siempre es negativo, lo que demuestra que **la corrección de segundo orden a la energía del estado fundamental siempre es menor o igual a cero ($E_0^{(2)} \\leq 0$)**.
        `,
        formulas: [
          {
            title: 'Correcciones de Primer y Segundo Orden a la Energía',
            formula: 'E_n^{(1)} = \\langle \\psi_n^{(0)} | \\hat{H}^\\prime | \\psi_n^{(0)} \\rangle, \\quad E_n^{(2)} = \\sum_{k \\neq n} \\frac{|\\langle \\psi_k^{(0)} | \\hat{H}^\\prime | \\psi_n^{(0)} \\rangle|^2}{E_n^{(0)} - E_k^{(0)}}',
            label: 'Ec. 13.1',
            category: 'Teoría de Perturbaciones',
            context: 'Aproximación asintótica para autovalores de energía bajo pequeñas perturbaciones H prime.',
            variables: [
              { symbol: 'E_n^{(1)}', name: 'Corrección de primer orden a la energía', units: '\\text{eV}', description: 'Promedio cuántico de la interacción perturbativa en el estado imperturbado.' },
              { symbol: 'E_n^{(2)}', name: 'Corrección de segundo orden a la energía', units: '\\text{eV}', description: 'Suma sobre todos los estados intermedios accesibles acoplados por la perturbación.' },
              { symbol: 'E_n^{(0)} - E_k^{(0)}', name: 'Diferencia de energías imperturbadas', units: '\\text{eV}', description: 'Separación energética que pondera inversamente la mezcla de estados.' }
            ],
            physicalMeaning: 'Demuestra que estados con energías muy cercanas se acoplan fuertemente bajo una perturbación externa (denominador pequeño).'
          }
        ],
        citations: [
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 7, §7.1–7.2.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 2 (Wiley, 1977), Cap. XI, §A–C.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), Cap. 5, §5.1.'
        ]
      },
      {
        id: 'perturbaciones-degeneradas-stark',
        title: '2. Perturbaciones en Estados Degenerados y Efecto Stark',
        badge: 'Levantamiento de Degeneración',
        summary: 'Si múltiples estados poseen la misma energía imperturbada E_n^(0), el denominador de segundo orden diverge. Es necesario diagonalizar la matriz de perturbación en el subespacio degenerado.',
        contentMarkdown: `
Si un nivel posee una degeneración de grado $g$, construimos la matriz $g \\times g$ con los elementos de matriz:
$$W_{ij} = \\langle \\psi_{ni}^{(0)} | \\hat{H}' | \\psi_{nj}^{(0)} \\rangle, \\quad i, j = 1, 2, \\dots, g$$
Las correcciones de primer orden a la energía corresponden a los autovalores de la ecuación secular:
$$\\det(W_{ij} - E^{(1)} \\delta_{ij}) = 0$$

### Aplicación: Efecto Stark en el Nivel $n=2$ del Átomo de Hidrógeno
El nivel $n=2$ del hidrógeno es cuatro veces degenerado ($g=4$): $|2,0,0\\rangle$ ($2s$), $|2,1,0\\rangle$ ($2p_z$) y los autoestados complejos de $L_z$, $|2,1,\\pm1\\rangle$. Los orbitales reales $2p_x$ y $2p_y$ son combinaciones lineales de estos dos últimos estados, no autoestados individuales de $L_z$.
Al aplicar un campo eléctrico uniforme externo $\\vec{E} = \\mathcal{E}\\hat{z}$, el Hamiltoniano de perturbación dipolar es:
$$\\hat{H}' = -\\vec{d} \\cdot \\vec{E} = e \\mathcal{E} z = e \\mathcal{E} r \\cos\\theta$$

Por consideraciones de paridad y conservación de $m$, el único elemento de matriz no nulo que conecta estados distintos es entre $|2,0,0\\rangle$ y $|2,1,0\\rangle$:
$$\\langle 2,0,0 | e\\mathcal{E}z | 2,1,0 \\rangle = -3 e \\mathcal{E} a_0$$
La matriz secular se reduce a un bloque $2 \\times 2$:
$$\\begin{pmatrix} 0 & -3e\\mathcal{E}a_0 \\\\ -3e\\mathcal{E}a_0 & 0 \\end{pmatrix} \\implies E^{(1)} = \\pm 3 e \\mathcal{E} a_0$$
El campo eléctrico desdobla el nivel cuádruplemente degenerado $n=2$ en **tres subniveles de energía**:
1. $E_+ = E_2^{(0)} + 3 e \\mathcal{E} a_0$
2. $E_0 = E_2^{(0)}$ (doblemente degenerado para $m = \\pm 1$)
3. $E_- = E_2^{(0)} - 3 e \\mathcal{E} a_0$
        `,
        formulas: [
          {
            title: 'Desdoblamiento del Efecto Stark Lineal (n=2)',
            formula: '\\Delta E_{\\text{Stark}} = \\pm 3 e \\mathcal{E} a_0',
            label: 'Ec. 13.2',
            category: 'Efecto Stark',
            context: 'Desdoblamiento simétrico del nivel n=2 del átomo de hidrógeno en presencia de un campo eléctrico estático.',
            variables: [
              { symbol: '\\Delta E', name: 'Desdoblamiento energético Stark', units: '\\text{eV}', description: 'Separación lineal proporcional a la magnitud del campo eléctrico aplicado.' },
              { symbol: '\\mathcal{E}', name: 'Intensidad del campo eléctrico externo', units: '\\text{V}/\\text{m}', description: 'Campo electrostático polarizador.' },
              { symbol: 'a_0', name: 'Radio de Bohr', units: '0.529177\\times 10^{-10} \\text{ m}', description: 'Escala de longitud natural del átomo de hidrógeno.' }
            ],
            physicalMeaning: 'Demuestra la ruptura de la simetría esférica por el campo eléctrico externo, mezclando estados de paridad opuesta (2s y 2p).'
          }
        ],
        citations: [
          'Griffiths, D.J. Introduction to Quantum Mechanics, 3rd Ed. (Cambridge, 2018), Cap. 7, §7.3.',
          'Cohen-Tannoudji, C. et al. Quantum Mechanics Vol. 2 (Wiley, 1977), Cap. XI, §D.',
          'Merzbacher, E. Quantum Mechanics, 3rd Ed. (Wiley, 1998), Cap. 18, §18.5.'
        ]
      }
    ],
    suggestedReadings: [
      {
        bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 2',
        chapters: 'Capítulo XI: Stationary Perturbation Theory',
        keyProblems: 'Problemas XI.2 y XI.6.'
      },
      {
        bookTitle: 'Merzbacher — Quantum Mechanics',
        chapters: 'Chapter 18: Perturbation Theory',
        keyProblems: 'Deducción del efecto Stark cuadrático y oscilador perturbado.'
      }
    ]
  },

  '14-perturbaciones-tiempo': {
    id: '14-perturbaciones-tiempo',
    syllabusUnit: 'UNIDAD XIV',
    syllabusTitle: 'Teoría de Perturbaciones Dependiente del Tiempo',
    hours: 6,
    academicWeek: 'Semana 15',
    prerequisites: ['Módulo 13', 'Ecuación de Schrödinger dependiente del tiempo', 'Notación de Dirac'],
    learningOutcomes: [
      'Deducir la amplitud de transición de primer orden para una perturbación dependiente del tiempo.',
      'Analizar transiciones inducidas por una perturbación periódica y su condición de resonancia.',
      'Aplicar la Regla de Oro de Fermi a espectros de absorción y emisión en el régimen de primer orden.'
    ],
    sections: [
      {
        id: 'amplitudes-primer-orden',
        title: '1. Amplitudes de Transición en la Imagen de Interacción',
        badge: 'Perturbación Dependiente del Tiempo',
        summary: 'Cuando un Hamiltoniano conocido H0 recibe una perturbación débil V(t), la teoría de primer orden predice las amplitudes de transición entre sus autoestados.',
        contentMarkdown: 'Sea $\\hat H(t)=\\hat H_0+\\hat V(t)$, donde $\\hat H_0|n\\rangle=E_n|n\\rangle$. Para un estado inicial $|i\\rangle$, la amplitud de hallar el sistema en $|f\\rangle$ a primer orden es: $$c_f^{(1)}(t)=-\\frac{i}{\\hbar}\\int_0^t\\langle f|\\hat V(t\\prime)|i\\rangle e^{i\\omega_{fi}t\\prime}\\,dt\\prime,\\qquad \\omega_{fi}=\\frac{E_f-E_i}{\\hbar}.$$ La aproximación requiere que la probabilidad total transferida siga siendo pequeña. Para una perturbación periódica, los términos oscilatorios se acumulan cuando la frecuencia externa coincide con $|\\omega_{fi}|$; esta es la condición de resonancia que organiza los espectros de absorción y emisión.',
        formulas: [{
          title: 'Amplitud de Transición de Primer Orden',
          formula: 'c_f^{(1)}(t)=-\\frac{i}{\\hbar}\\int_0^t \\langle f|\\hat V(t\\prime)|i\\rangle e^{i\\omega_{fi}t\\prime}\\,dt\\prime, \\quad \\omega_{fi}=\\frac{E_f-E_i}{\\hbar}',
          label: 'Ec. 14.1',
          category: 'Transiciones Cuánticas',
          context: 'Expresión perturbativa válida si el acoplamiento es débil y la expansión puede truncarse en primer orden.',
          variables: [
            { symbol: 'c_f^{(1)}(t)', name: 'Amplitud de transición de primer orden', units: '\\text{adimensional}', description: 'Amplitud compleja de encontrar el estado final f a tiempo t debido a la perturbación.' },
            { symbol: '\\langle f|\\hat V(t)|i\\rangle', name: 'Elemento de matriz de interacción', units: '\\text{J}', description: 'Acoplamiento entre los autoestados inicial y final producido por la perturbación externa.' },
            { symbol: '\\omega_{fi}', name: 'Frecuencia de Bohr', units: '\\text{s}^{-1}', description: 'Diferencia de energía entre los estados dividida entre h-barra.' }
          ],
          physicalMeaning: 'La probabilidad de transición a primer orden es $P_{i\\to f}(t)\\approx|c_f^{(1)}(t)|^2$; no debe usarse cuando dicha probabilidad deja de ser pequeña.',
          boundaryConditions: 'Estado inicial preparado en $|i\\rangle$ y perturbación suficientemente débil durante el intervalo considerado.'
        }],
        citations: [
          'Cohen-Tannoudji, C., Diu, B. & Laloë, F. Quantum Mechanics Vol. 2 (Wiley, 1977), capítulo XIII.',
          'Sakurai, J.J. & Napolitano, J. Modern Quantum Mechanics, 2nd Ed. (Cambridge, 2017), capítulo 5.'
        ]
      },
      {
        id: 'regla-oro-fermi',
        title: '2. Regla de Oro de Fermi y Espectros',
        badge: 'Límite de Estados Finales Cuasicontinuos',
        summary: 'La Regla de Oro de Fermi proporciona una tasa de transición cuando los estados finales forman un continuo o son muy densos.',
        contentMarkdown: 'En el límite de tiempos suficientemente largos y densidad de estados finales $\\rho(E_f)$ casi continua, el crecimiento de la probabilidad se vuelve lineal: $$\\Gamma_{i\\to f}=\\frac{2\\pi}{\\hbar}|\\langle f|\\hat V|i\\rangle|^2\\rho(E_f).$$ La conservación de energía aparece mediante el pico resonante. Esta fórmula no reemplaza la evolución exacta para un sistema de dos niveles aislado: su dominio natural es un continuo o cuasi-continuo de estados finales.',
        formulas: [{
          title: 'Regla de Oro de Fermi',
          formula: '\\Gamma_{i\\to f}=\\frac{2\\pi}{\\hbar}|\\langle f|\\hat V|i\\rangle|^2\\rho(E_f)',
          label: 'Ec. 14.2',
          category: 'Tasa de Transición',
          context: 'Límite de primer orden para acoplamientos débiles hacia un conjunto denso de estados finales.',
          variables: [
            { symbol: '\\Gamma_{i\\to f}', name: 'Tasa de transición', units: '\\text{s}^{-1}', description: 'Probabilidad de transición por unidad de tiempo en el régimen de validez.' },
            { symbol: '\\rho(E_f)', name: 'Densidad de estados finales', units: '\\text{J}^{-1}', description: 'Número de estados finales accesibles por unidad de energía.' },
            { symbol: '\\langle f|\\hat V|i\\rangle', name: 'Elemento de matriz de la perturbación', units: '\\text{J}', description: 'Intensidad del acoplamiento que habilita la transición.' }
          ],
          physicalMeaning: 'Conecta la dinámica microscópica con tasas medibles de absorción, emisión y dispersión.',
          boundaryConditions: 'Acoplamiento débil, primer orden y conjunto final continuo o cuasi-continuo.'
        }],
        citations: [
          'Cohen-Tannoudji, C., Diu, B. & Laloë, F. Quantum Mechanics Vol. 2 (Wiley, 1977), capítulo XIII.',
          'Merzbacher, E. Quantum Mechanics, 3rd Ed. (Wiley, 1998), capítulo 19.'
        ]
      }
    ],
    suggestedReadings: [{
      bookTitle: 'Cohen-Tannoudji — Quantum Mechanics Vol. 2',
      chapters: 'Capítulo XIII: Time-Dependent Perturbation Theory',
      keyProblems: 'Transiciones por perturbación sinusoidal y derivación de la Regla de Oro de Fermi.'
    }]
  }
};

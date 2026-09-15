import { TheoreticalSection } from './modulesData';

const citation = (book: string, chapter: string) => book + ', ' + chapter + '.';

export const COMPLETION_SECTIONS: Record<string, TheoreticalSection[]> = {
  '02-efecto-fotoelectrico-compton': [{
    id: 'franck-hertz-bohr', title: '3. Franck-Hertz y Modelo de Bohr', badge: 'Cuantización Atómica',
    summary: 'Las pérdidas discretas de energía en Franck-Hertz y los niveles del hidrógeno proporcionan evidencia de estados atómicos cuantizados.',
    contentMarkdown: 'En Franck-Hertz, electrones acelerados pierden energía en saltos cuando $eV$ alcanza una energía de excitación atómica. Para hidrógeno, el modelo semiclasico de Bohr conduce a $E_n=-13.6\\text{ eV}/n^2$; la mecánica cuántica moderna recupera este resultado desde Schrödinger.',
    formulas: [{ title: 'Niveles de Bohr para Hidrógeno', formula: 'E_n=-\\frac{13.6\\text{ eV}}{n^2},\\quad n=1,2,\\ldots', label: 'Ec. 2.3', category: 'Espectro Atómico', context: 'Resultado para el átomo hidrogenoide ideal.', variables: [{ symbol: 'n', name: 'Número principal', units: '\\text{adimensional}', description: 'Etiqueta discreta del nivel ligado.' }], physicalMeaning: 'Las transiciones satisfacen $h\\nu=E_i-E_f$.', boundaryConditions: 'No incluye estructura fina, Lamb ni espín.' }],
    citations: [citation('Eisberg & Resnick, Quantum Physics, 2nd Ed.', 'Cap. 3')]
  }],
  '03-dualidad-onda-particula': [{
    id: 'born-doble-rendija', title: '3. Regla de Born e Interferencia de Dos Rendijas', badge: 'Amplitudes de Probabilidad',
    summary: 'Las probabilidades se obtienen del módulo cuadrado de la amplitud total, no sumando probabilidades de caminos indistinguibles.',
    contentMarkdown: 'Si no existe información de camino, $\\psi=\\psi_1+\\psi_2$ y aparece interferencia. Si una medición distingue caminos, se pierde coherencia y se suman probabilidades.',
    formulas: [{ title: 'Patrón de Interferencia Cuántica', formula: '|\\psi_1+\\psi_2|^2=|\\psi_1|^2+|\\psi_2|^2+2\\operatorname{Re}(\\psi_1^*\\psi_2)', label: 'Ec. 3.3', category: 'Regla de Born', context: 'Densidad de probabilidad para alternativas coherentes.', variables: [{ symbol: '\\psi_j', name: 'Amplitud de probabilidad', units: '\\text{m}^{-1/2}', description: 'Amplitud asociada a la rendija j.' }], physicalMeaning: 'El último término genera franjas y desaparece al perder coherencia.' }],
    citations: [citation('Feynman, Lectures on Physics Vol. III', 'Cap. 1')]
  }],
  '04-ecuacion-schrodinger': [{
    id: 'medicion-observables', title: '3. Medición, Observables y Valores Esperados', badge: 'Postulados Operacionales',
    summary: 'Un observable se representa por un operador hermítico; Born asigna probabilidades a sus resultados propios.',
    contentMarkdown: 'Si $\\hat A|a_n\\rangle=a_n|a_n\\rangle$, entonces $P(a_n)=|\\langle a_n|\\psi\\rangle|^2$. El valor esperado es el promedio de un ensamble preparado de forma idéntica.',
    formulas: [{ title: 'Valor Esperado de un Observable', formula: '\\langle A\\rangle=\\langle\\psi|\\hat A|\\psi\\rangle', label: 'Ec. 4.3', category: 'Medición Cuántica', context: 'Promedio estadístico para estado normalizado y operador hermítico.', variables: [{ symbol: '\\hat A', name: 'Operador observable', units: '\\text{unidades de A}', description: 'Operador autoadjunto asociado a la medición.' }], physicalMeaning: 'Conecta el estado con resultados repetidos de laboratorio.' }],
    citations: [citation('Cohen-Tannoudji, Diu & Laloë, Quantum Mechanics Vol. 1', 'Cap. III')]
  }],
  '05-particula-libre-paquetes': [{
    id: 'espacio-momentum-estacionarios', title: '3. Espacio Momentum y Estados Estacionarios', badge: 'Unidad VI del Sílabo',
    summary: 'La transformada de Fourier relaciona las representaciones de posición y momentum y explica la incertidumbre como propiedad de la preparación.',
    contentMarkdown: 'En espacio momentum, $\\hat p$ actúa por multiplicación y $\\hat x=i\\hbar\\partial/\\partial p$. Para Hamiltoniano independiente del tiempo, los autoestados solo adquieren fase y su densidad es estacionaria.',
    formulas: [{ title: 'Transformada Posición-Momentum', formula: '\\phi(p)=\\frac{1}{\\sqrt{2\\pi\\hbar}}\\int_{-\\infty}^{\\infty}\\psi(x)e^{-ipx/\\hbar}\\,dx', label: 'Ec. 5.3', category: 'Representación Momentum', context: 'Transformación unitaria entre amplitudes de posición y momentum.', variables: [{ symbol: '\\phi(p)', name: 'Amplitud en momentum', units: '(\\text{kg m s}^{-1})^{-1/2}', description: 'Su módulo cuadrado es densidad de probabilidad en p.' }], physicalMeaning: 'Sustenta $\\Delta x\\Delta p\\ge\\hbar/2$.' }],
    citations: [citation('Merzbacher, Quantum Mechanics, 3rd Ed.', 'Cap. 2')]
  }],
  '06-potenciales-1d': [{
    id: 'pozo-finito-delta', title: '2. Pozo Finito y Potencial Delta', badge: 'Estados Ligados 1D',
    summary: 'Los potenciales finitos requieren empalmar soluciones y admiten penetración evanescente fuera de la región ligada.',
    contentMarkdown: 'Para un potencial finito sin singularidades, $\\psi$ y $d\\psi/dx$ son continuas. Una delta atractiva $V(x)=-\\alpha\\delta(x)$ mantiene $\\psi$ continua pero produce un salto controlado en su derivada.',
    formulas: [{ title: 'Condición de Salto para Delta Atractiva', formula: '\\psi\\prime(0^+)-\\psi\\prime(0^-)=-\\frac{2m\\alpha}{\\hbar^2}\\psi(0)', label: 'Ec. 6.2', category: 'Potencial Singular', context: 'Resultado de integrar la ecuación alrededor de x=0.', variables: [{ symbol: '\\alpha', name: 'Intensidad de la delta', units: '\\text{J m}', description: 'Parámetro positivo de un potencial atractivo.' }], physicalMeaning: 'En 1D una delta atractiva tiene un estado ligado.' }],
    citations: [citation('Griffiths, Introduction to Quantum Mechanics, 3rd Ed.', 'Cap. 2')]
  }],
  '09-oscilador-armonico': [{
    id: 'hermite-periodico', title: '2. Solución Diferencial, Hermite y Potenciales Periódicos', badge: 'Solución Analítica',
    summary: 'La solución diferencial del oscilador produce gaussianas multiplicadas por polinomios de Hermite y es equivalente al método algebraico.',
    contentMarkdown: 'Con $\\xi=\\sqrt{m\\omega/\\hbar}\\,x$, las funciones propias normalizables son gaussianas multiplicadas por $H_n(\\xi)$. Los potenciales periódicos conducen a estados de Bloch y bandas.',
    formulas: [{ title: 'Funciones Propias del Oscilador', formula: '\\psi_n(x)=\\frac{1}{\\sqrt{2^n n!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)e^{-\\xi^2/2}', label: 'Ec. 9.2', category: 'Polinomios de Hermite', context: 'Solución normalizada del oscilador 1D.', variables: [{ symbol: '\\xi', name: 'Coordenada adimensional', units: '\\text{adimensional}', description: '\\xi=\\sqrt{m\\omega/\\hbar}\\,x.' }], physicalMeaning: 'Los nodos aumentan con n y el espectro coincide con operadores escalera.' }],
    citations: [citation('Cohen-Tannoudji, Diu & Laloë, Quantum Mechanics Vol. 1', 'Cap. V')]
  }],
  '10-atomo-hidrogeno': [{
    id: 'angular-rotor-magnetico', title: '2. Parte Angular, Rotor Rígido y Momento Magnético', badge: 'Simetría Rotacional',
    summary: 'Los armónicos esféricos describen la parte angular; el rotor rígido comparte la misma álgebra de momento angular.',
    contentMarkdown: 'Los estados $Y_l^m$ satisfacen simultáneamente $\\hat L^2$ y $\\hat L_z$. Para un rotor de momento de inercia $I$, la energía depende de $l(l+1)$. El momento orbital electrónico es $\\vec\\mu_L=-e\\vec L/(2m_e)$.',
    formulas: [{ title: 'Espectro del Rotor Rígido', formula: 'E_l=\\frac{\\hbar^2}{2I}l(l+1),\\quad l=0,1,2,\\ldots', label: 'Ec. 10.2', category: 'Momento Angular Orbital', context: 'Hamiltoniano $\\hat H=\\hat L^2/(2I)$.', variables: [{ symbol: 'I', name: 'Momento de inercia', units: '\\text{kg m}^2', description: 'Parámetro geométrico del rotor.' }], physicalMeaning: 'El espectro rotacional es una aplicación de la cuantización angular.' }],
    citations: [citation('Merzbacher, Quantum Mechanics, 3rd Ed.', 'Cap. 9')]
  }],
  '12-stern-gerlach': [{
    id: 'zeeman', title: '3. Efecto Zeeman Normal y Anómalo', badge: 'Átomos en Campo Magnético',
    summary: 'Un campo uniforme rompe degeneraciones magnéticas mediante la interacción entre momento magnético y campo externo.',
    contentMarkdown: 'Para momento orbital sin espín, la perturbación es proporcional a $\\hat L_z$. Cuando participa el espín, el factor de Landé combina $\\vec L$ y $\\vec S$ y aparece el Zeeman anómalo.',
    formulas: [{ title: 'Desdoblamiento Zeeman', formula: '\\Delta E=\\mu_B g_J m_J B', label: 'Ec. 12.3', category: 'Efecto Zeeman', context: 'Corrección lineal de primer orden en campo uniforme débil.', variables: [{ symbol: 'g_J', name: 'Factor de Landé', units: '\\text{adimensional}', description: 'Factor determinado por el acoplamiento angular.' }], physicalMeaning: 'La separación de líneas permite medir momentos angulares.', boundaryConditions: 'Régimen Zeeman débil; no describe Paschen-Back.' }],
    citations: [citation('Sakurai & Napolitano, Modern Quantum Mechanics, 2nd Ed.', 'Cap. 3')]
  }]
};

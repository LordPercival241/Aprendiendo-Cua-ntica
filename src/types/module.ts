export interface CourseModule {
  id: string; // e.g. "01-introduccion-fisica-moderna"
  order: number; // 1 to 13
  unit: string; // "I", "II", etc.
  week: string; // "1", "1-2", "7", etc.
  titleKey: string; // i18n key in modules.mX.title
  descKey: string; // i18n key in modules.mX.desc
  icon: string; // icon identifier
  slidesPath?: string[]; // relative paths in /lectures/
  bookChapters?: { book: string; chapters: string }[];
  simulationType?: 'canvas2d' | 'three3d' | 'none';
  simulationName?: string;
  hasPOE?: boolean;
  equationsPreview?: string[];
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: "01-introduccion-fisica-moderna",
    order: 1,
    unit: "I",
    week: "1",
    titleKey: "m1",
    descKey: "m1",
    icon: "Atom",
    slidesPath: ["/lectures/sem1/INTRODUCCION.pdf"],
    bookChapters: [
      { book: "eisberg-r-resnick-r-quantum-physics-atoms-molecules-solids-nuclei-and-particles-solutions-supplement-accompany-2ed-wiley_compress.pdf", chapters: "Cap. 1: Radiación térmica y postulado de Planck" },
      { book: "fundamentos de mecánica cuántica.pdf", chapters: "Cap. 1: Orígenes de la Teoría Cuántica" }
    ],
    simulationType: "canvas2d",
    simulationName: "BlackbodySimulator",
    hasPOE: true,
    equationsPreview: ["u(\\nu, T) = \\frac{8\\pi h\\nu^3}{c^3}\\frac{1}{e^{h\\nu/k_B T} - 1}", "E_n = n h \\nu"]
  },
  {
    id: "02-efecto-fotoelectrico-compton",
    order: 2,
    unit: "I-II",
    week: "1-2",
    titleKey: "m2",
    descKey: "m2",
    icon: "Zap",
    slidesPath: [
      "/lectures/sem1/Efecto fotoeléctrico - Compton.pdf",
      "/lectures/sem2/Efecto fotoeléctrico - Compton continuación.pdf"
    ],
    bookChapters: [
      { book: "eisberg-r-resnick-r-quantum-physics-atoms-molecules-solids-nuclei-and-particles-solutions-supplement-accompany-2ed-wiley_compress.pdf", chapters: "Cap. 2: Fotones - propiedades corpusculares de la radiación" },
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Complement A_I" }
    ],
    simulationType: "canvas2d",
    simulationName: "PhotoelectricSim",
    hasPOE: true,
    equationsPreview: ["K_{max} = h\\nu - \\Phi = e V_0", "\\Delta \\lambda = \\lambda' - \\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta)"]
  },
  {
    id: "03-dualidad-onda-particula",
    order: 3,
    unit: "II-III",
    week: "2",
    titleKey: "m3",
    descKey: "m3",
    icon: "Waves",
    slidesPath: [
      "/lectures/sem2/Principio de Louis DeBroglie -  Principio de incertidumbre -.pdf",
      "/lectures/sem2/Atomo de hidrogeno.pdf"
    ],
    bookChapters: [
      { book: "feynman-lectures.pdf", chapters: "Vol. III - Cap. 1: Comportamiento Cuántico" },
      { book: "fundamentos de mecánica cuántica.pdf", chapters: "Cap. 2: Ondas de De Broglie" }
    ],
    simulationType: "canvas2d",
    simulationName: "DoubleSlitSim",
    hasPOE: true,
    equationsPreview: ["\\lambda = \\frac{h}{p} = \\frac{h}{m v}", "\\Delta x \\Delta p_x \\geq \\frac{\\hbar}{2}"]
  },
  {
    id: "04-ecuacion-schrodinger",
    order: 4,
    unit: "IV",
    week: "3-4",
    titleKey: "m4",
    descKey: "m4",
    icon: "Activity",
    slidesPath: [
      "/lectures/sem3/MECANICA_CUANTICA_SEM_4 lu (1).pdf",
      "/lectures/sem4/MECANICA_CUANTICA_SEM_4 (repitio clase por el paro hizo repaso).pdf"
    ],
    bookChapters: [
      { book: "Merzbacher-Quantum-Mechanics.pdf", chapters: "Chapter 3: The Schrödinger Wave Equation" },
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Chapter I" }
    ],
    simulationType: "canvas2d",
    simulationName: "WavePacketSim",
    hasPOE: true,
    equationsPreview: ["i\\hbar\\frac{\\partial \\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\nabla^2\\Psi + V(\\vec{r})\\Psi", "\\vec{J} = \\frac{\\hbar}{2mi}\\left(\\Psi^*\\nabla\\Psi - \\Psi\\nabla\\Psi^*\\right)"]
  },
  {
    id: "05-particula-libre-paquetes",
    order: 5,
    unit: "V",
    week: "5-6",
    titleKey: "m5",
    descKey: "m5",
    icon: "Wind",
    slidesPath: [
      "/lectures/sem5/MECANICA_CUANTICA_SEM_6-12-18.pdf",
      "/lectures/sem5/Teorema de Ehrenfest (1).pdf",
      "/lectures/sem6/Representación Momentum.pdf"
    ],
    bookChapters: [
      { book: "QuantumMechanicsScript.pdf", chapters: "Cap. 2: Partícula libre y paquetes" },
      { book: "Merzbacher-Quantum-Mechanics.pdf", chapters: "Chapter 2: Wave Packets and Ehrenfest's Theorem" }
    ],
    simulationType: "canvas2d",
    simulationName: "WavePacketSim",
    hasPOE: true,
    equationsPreview: ["\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi\\hbar}}\\int \\phi(p) e^{i(px - Et)/\\hbar} dp", "\\frac{d\\langle p \\rangle}{dt} = -\\left\\langle \\frac{\\partial V}{\\partial x} \\right\\rangle"]
  },
  {
    id: "06-potenciales-1d",
    order: 6,
    unit: "VI",
    week: "7",
    titleKey: "m6",
    descKey: "m6",
    icon: "Box",
    slidesPath: [
      "/lectures/sem7/MECANICA_CUANTICA_SEM_6 continuación partícula libre.pdf",
      "/lectures/sem7/potenciales seccionalmente constantes + (1).pdf"
    ],
    bookChapters: [
      { book: "eisberg-r-resnick-r-quantum-physics-atoms-molecules-solids-nuclei-and-particles-solutions-supplement-accompany-2ed-wiley_compress.pdf", chapters: "Cap. 6: Soluciones de la ecuación de Schrödinger independiente del tiempo" }
    ],
    simulationType: "canvas2d",
    simulationName: "PotentialWell",
    hasPOE: true,
    equationsPreview: ["E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2m L^2}", "\\psi_n(x) = \\sqrt{\\frac{2}{L}}\\sin\\left(\\frac{n\\pi x}{L}\\right)"]
  },
  {
    id: "07-tunelamiento-cuantico",
    order: 7,
    unit: "VII",
    week: "7",
    titleKey: "m7",
    descKey: "m7",
    icon: "ShieldAlert",
    slidesPath: ["/lectures/sem7/potenciales seccionalmente constantes + (1).pdf"],
    bookChapters: [
      { book: "Merzbacher-Quantum-Mechanics.pdf", chapters: "Chapter 5: Potentials with Discontinuities and Tunneling" }
    ],
    simulationType: "canvas2d",
    simulationName: "TunnelingBarrier",
    hasPOE: true,
    equationsPreview: ["T \\approx e^{-2\\kappa L}, \\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}", "T + R = 1"]
  },
  {
    id: "08-formalismo-dirac",
    order: 8,
    unit: "VIII",
    week: "9",
    titleKey: "m8",
    descKey: "m8",
    icon: "Code",
    slidesPath: ["/lectures/sem9/DIRAC (1).pdf"],
    bookChapters: [
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Chapter II (The Mathematical Tools of Quantum Mechanics)" },
      { book: "feynman-lectures.pdf", chapters: "Vol. III - Cap. 3: Amplitudes de probabilidad" }
    ],
    simulationType: "canvas2d",
    simulationName: "RabiSimulator",
    hasPOE: true,
    equationsPreview: ["|\\psi\\rangle = \\sum_i c_i |u_i\\rangle, \\quad c_i = \\langle u_i |\\psi\\rangle", "\\hat{A} = \\sum_n a_n |a_n\\rangle\\langle a_n|", "[\\hat{A},\\hat{B}] = i\\hat{C}"]
  },
  {
    id: "09-oscilador-armonico",
    order: 9,
    unit: "IX",
    week: "9-10",
    titleKey: "m9",
    descKey: "m9",
    icon: "TrendingUp",
    slidesPath: [
      "/lectures/sem9/oscilador_armonico_rpdocx_parte1.pdf",
      "/lectures/sem10/EL_OSCILADOR_ARMONICO_VESION_ALGEBRAICA correg (1).pdf"
    ],
    bookChapters: [
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Chapter V (The Harmonic Oscillator)" },
      { book: "Merzbacher-Quantum-Mechanics.pdf", chapters: "Chapter 8: The Harmonic Oscillator" }
    ],
    simulationType: "canvas2d",
    simulationName: "HarmonicOscillator",
    hasPOE: true,
    equationsPreview: ["E_n = \\left(n + \\frac{1}{2}\\right)\\hbar\\omega", "\\hat{a} = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat{x} + \\frac{i}{m\\omega}\\hat{p}\\right), \\quad [\\hat{a},\\hat{a}^\\dagger]=1"]
  },
  {
    id: "10-atomo-hidrogeno",
    order: 10,
    unit: "X",
    week: "11",
    titleKey: "m10",
    descKey: "m10",
    icon: "Globe",
    slidesPath: [
      "/lectures/sem11/problemas_de_los_dos_cuerposff-1.pdf",
      "/lectures/sem11/Exposición_de_Cuántica.pdf"
    ],
    bookChapters: [
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Chapter VII (The Hydrogen Atom)" },
      { book: "eisberg-r-resnick-r-quantum-physics-atoms-molecules-solids-nuclei-and-particles-solutions-supplement-accompany-2ed-wiley_compress.pdf", chapters: "Cap. 7: Átomo de Hidrógeno" }
    ],
    simulationType: "three3d",
    simulationName: "OrbitalRenderer3D",
    hasPOE: true,
    equationsPreview: ["\\psi_{nlm}(r,\\theta,\\phi) = R_{nl}(r) Y_l^m(\\theta,\\phi)", "E_n = -\\frac{m_e e^4}{32\\pi^2 \\varepsilon_0^2 \\hbar^2 n^2} = -\\frac{13.6\\text{ eV}}{n^2}"]
  },
  {
    id: "11-momento-angular-espin",
    order: 11,
    unit: "XI",
    week: "12-13",
    titleKey: "m11",
    descKey: "m11",
    icon: "RotateCw",
    slidesPath: [
      "/lectures/sem12/Momento magnético orbital (1).pdf",
      "/lectures/sem14/Tema-momento-angular.pdf",
      "/lectures/sem14/Frecuencia de precesion.pdf"
    ],
    bookChapters: [
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Chapter VI (Angular Momentum & Spin)" },
      { book: "Merzbacher-Quantum-Mechanics.pdf", chapters: "Chapter 12: Spin 1/2" }
    ],
    simulationType: "canvas2d",
    simulationName: "SternGerlachSim",
    hasPOE: true,
    equationsPreview: ["[\\hat{J}_i, \\hat{J}_j] = i\\hbar\\epsilon_{ijk}\\hat{J}_k", "\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}, \\quad \\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}, \\quad \\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}"]
  },
  {
    id: "12-stern-gerlach",
    order: 12,
    unit: "XII",
    week: "13, 15",
    titleKey: "m12",
    descKey: "m12",
    icon: "GitFork",
    slidesPath: ["/lectures/sem15/Composición de momentums angulares f.pdf"],
    bookChapters: [
      { book: "feynman-lectures.pdf", chapters: "Vol. III - Cap. 5: Experimentos de Stern-Gerlach y filtrado de espín" },
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Chapter X (Addition of Angular Momenta)" }
    ],
    simulationType: "canvas2d",
    simulationName: "SternGerlachSim",
    hasPOE: true,
    equationsPreview: ["|j_1 - j_2| \\leq j \\leq j_1 + j_2", "|j, m\\rangle = \\sum_{m_1, m_2} \\langle j_1 m_1 j_2 m_2 | j m\\rangle |j_1 m_1\\rangle |j_2 m_2\\rangle"]
  },
  {
    id: "13-perturbaciones",
    order: 13,
    unit: "XIII",
    week: "14",
    titleKey: "m13",
    descKey: "m13",
    icon: "Sliders",
    slidesPath: [
      "/lectures/sem13/Teoría de las perturbaciones_caso_no_degenerado-1-4 (1).pdf",
      "/lectures/sem13/Teoría de las perturbaciones_caso_degenerado-5-7 (1).pdf"
    ],
    bookChapters: [
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Chapter XI (Stationary Perturbation Theory)" },
      { book: "Merzbacher-Quantum-Mechanics.pdf", chapters: "Chapter 18: Perturbation Theory" }
    ],
    simulationType: "canvas2d",
    simulationName: "EnergyLevelSplit",
    hasPOE: true,
    equationsPreview: ["E_n^{(1)} = \\langle \\psi_n^{(0)} | \\hat{H}' | \\psi_n^{(0)} \\rangle", "E_n^{(2)} = \\sum_{k \\neq n} \\frac{|\\langle \\psi_k^{(0)} | \\hat{H}' | \\psi_n^{(0)} \\rangle|^2}{E_n^{(0)} - E_k^{(0)}}"]
  },
  {
    id: "14-perturbaciones-tiempo",
    order: 14,
    unit: "XIV",
    week: "15",
    titleKey: "m14",
    descKey: "m14",
    icon: "Radio",
    bookChapters: [
      { book: "L-0014096705-pdf.pdf", chapters: "Cohen-Tannoudji: Time-dependent perturbation theory" },
      { book: "Merzbacher-Quantum-Mechanics.pdf", chapters: "Chapter 19: Time-dependent perturbations" }
    ],
    simulationType: "none",
    hasPOE: false,
    equationsPreview: ["c_f^{(1)}(t) = -\\frac{i}{\\hbar}\\int_0^t \\langle f|\\hat V(t')|i\\rangle e^{i\\omega_{fi}t'}dt'", "\\Gamma_{i\\to f} = \\frac{2\\pi}{\\hbar}|\\langle f|\\hat V|i\\rangle|^2\\rho(E_f)"]
  }
];

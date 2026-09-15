export interface ModuleLearningProgress {
  quizScore: number;
  quizAnswered: number;
  poeCompleted: boolean;
  updatedAt: string;
}

export type LearningProgress = Record<string, ModuleLearningProgress>;

const STORAGE_KEY = 'quantum-uni:learning-progress:v1';

const emptyModuleProgress = (): ModuleLearningProgress => ({
  quizScore: 0,
  quizAnswered: 0,
  poeCompleted: false,
  updatedAt: new Date().toISOString(),
});

export function readLearningProgress(): LearningProgress {
  if (typeof window === 'undefined') return {};

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as LearningProgress : {};
  } catch {
    return {};
  }
}

export function getModuleLearningProgress(moduleId: string): ModuleLearningProgress {
  return readLearningProgress()[moduleId] ?? emptyModuleProgress();
}

export function saveModuleLearningProgress(
  moduleId: string,
  update: Partial<ModuleLearningProgress>,
): ModuleLearningProgress {
  const allProgress = readLearningProgress();
  const next = {
    ...(allProgress[moduleId] ?? emptyModuleProgress()),
    ...update,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...allProgress, [moduleId]: next }),
  );

  return next;
}

export function countCompletedModules(progress: LearningProgress): number {
  return Object.values(progress).filter(
    ({ quizAnswered, poeCompleted }) => quizAnswered > 0 || poeCompleted,
  ).length;
}

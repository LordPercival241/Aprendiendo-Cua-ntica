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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeLearningProgress(value: unknown): LearningProgress {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce<LearningProgress>((progress, [moduleId, item]) => {
    if (!isRecord(item)) return progress;

    const quizScore = typeof item.quizScore === 'number' && Number.isFinite(item.quizScore)
      ? Math.max(0, item.quizScore)
      : 0;
    const quizAnswered = typeof item.quizAnswered === 'number' && Number.isFinite(item.quizAnswered)
      ? Math.max(0, Math.floor(item.quizAnswered))
      : 0;

    progress[moduleId] = {
      quizScore,
      quizAnswered,
      poeCompleted: item.poeCompleted === true,
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
    };
    return progress;
  }, {});
}

export function readLearningProgress(): LearningProgress {
  if (typeof window === 'undefined') return {};

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? sanitizeLearningProgress(JSON.parse(value)) : {};
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

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...allProgress, [moduleId]: next }),
    );
  } catch {
    // Private mode or browser quota limits must not interrupt a learning activity.
  }

  return next;
}

export function countCompletedModules(progress: LearningProgress): number {
  return Object.values(progress).filter(
    ({ quizAnswered, poeCompleted }) => quizAnswered > 0 || poeCompleted,
  ).length;
}

// src/app/core/models/bdd-models.ts
export interface BddScenario {
    id: string;
    name: string;
    feature: string;
    status: 'passed' | 'failed' | 'skipped' | 'pending';
    duration: number;
    steps: BddStep[];
    tags: string[];
    errorMessage?: string;
    executionDate: Date;
    // Context information
    tenantId: string;
    useCaseId: string;
    accountType: string;
    totalSteps: number;
    passedSteps: number;
    failedSteps: number;
    skippedSteps: number;
}

export interface BddStep {
    id: string;
    stepNumber: number;
    keyword: 'Given' | 'When' | 'Then' | 'And' | 'But';
    text: string;
    status: 'passed' | 'failed' | 'skipped' | 'pending';
    duration: number;
    errorMessage?: string;
    expectedResult?: string;
    actualResult?: string;
    stackTrace?: string;
    screenshot?: string;
}

export interface BddFilters {
    tenantId?: string;
    useCaseId?: string;
    accountType?: string;
    status?: 'passed' | 'failed' | 'skipped' | 'pending' | null;
    dateRange?: string;
    tags?: string[];
}

export interface BddSummary {
    totalScenarios: number;
    passedScenarios: number;
    failedScenarios: number;
    skippedScenarios: number;
    pendingScenarios: number;
    totalDuration: number;
    successRate: number;
    recentFailures: string[];
    commonTags: string[];
}
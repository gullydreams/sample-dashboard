// src/app/shared/components/bdd/bdd-scenario-details/bdd-scenario-details.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BddScenario, BddStep } from '../../../../core/models/bdd-models';

@Component({
    selector: 'app-bdd-scenario-details',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
    templateUrl: './bdd-scenario-details.component.html',
    styleUrls: ['./bdd-scenario-details.component.scss']
})
export class BddScenarioDetailsComponent {
    @Input() scenarios: BddScenario[] = [];
    @Input() loading: boolean = false;
    @Input() summary: any = null;

    @Output() scenarioRerun = new EventEmitter<BddScenario>();
    @Output() copyError = new EventEmitter<BddScenario>();
    @Output() viewScreenshots = new EventEmitter<BddScenario>();

    expandedScenarios: Set<string> = new Set();

    toggleScenario(scenarioId: string): void {
        if (this.expandedScenarios.has(scenarioId)) {
            this.expandedScenarios.delete(scenarioId);
        } else {
            this.expandedScenarios.add(scenarioId);
        }
    }

    isExpanded(scenarioId: string): boolean {
        return this.expandedScenarios.has(scenarioId);
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'passed': return 'check_circle';
            case 'failed': return 'error';
            case 'skipped': return 'pause_circle_outline';
            case 'pending': return 'schedule';
            default: return 'help_outline';
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'passed': return 'status-passed';
            case 'failed': return 'status-failed';
            case 'skipped': return 'status-skipped';
            case 'pending': return 'status-pending';
            default: return 'status-unknown';
        }
    }

    getStepStatusIcon(status: string): string {
        switch (status) {
            case 'passed': return '✅';
            case 'failed': return '❌';
            case 'skipped': return '⏸️';
            case 'pending': return '⏳';
            default: return '❓';
        }
    }

    formatDuration(duration: number): string {
        if (duration < 1) {
            return `${Math.round(duration * 1000)}ms`;
        }
        return `${duration.toFixed(1)}s`;
    }

    formatTimeAgo(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hours ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
    }

    onRerunScenario(scenario: BddScenario): void {
        this.scenarioRerun.emit(scenario);
    }

    onCopyError(scenario: BddScenario): void {
        this.copyError.emit(scenario);
    }

    onViewScreenshots(scenario: BddScenario): void {
        this.viewScreenshots.emit(scenario);
    }

    getFailedStep(scenario: BddScenario): BddStep | null {
        return scenario.steps.find(step => step.status === 'failed') || null;
    }

    getStepSummary(scenario: BddScenario): string {
        return `${scenario.passedSteps}/${scenario.totalSteps} steps`;
    }

    // Track by functions
    trackByScenarioId(index: number, scenario: BddScenario): string {
        return scenario.id;
    }

    trackByStepId(index: number, step: any): string {
        return step.id;
    }
}
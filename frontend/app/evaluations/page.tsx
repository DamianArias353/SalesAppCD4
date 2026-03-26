import { Card } from '@/components/ui/card';

export default function EvaluationsPage() {
  return (
    <section className="stack">
      <h1>Sale Evaluations</h1>
      <p className="muted">
        Placeholder area for business scoring and evaluation workflow.
      </p>

      <Card
        title="Next Step"
        description="Implement UI and service calls to evaluate a sale and persist score."
      />
    </section>
  );
}

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getApiHealth } from '@/services/api/health';

export default async function HomePage() {
  const health = await getApiHealth().catch(() => null);

  return (
    <section className="stack">
      <h1>Sales Evaluation Dashboard</h1>
      <p className="muted">
        Base scaffold ready for implementing sales listing, creation, and evaluation.
      </p>

      <div className="grid">
        <Card title="Sales List" description="View existing sales entries.">
          <Link className="text-link" href="/sales">
            Open sales list
          </Link>
        </Card>

        <Card title="Create Sale" description="Capture a new sale entry.">
          <Link className="text-link" href="/sales/new">
            Open create form
          </Link>
        </Card>

        <Card title="Evaluate Sale" description="Run scoring/evaluation workflow.">
          <Link className="text-link" href="/evaluations">
            Open evaluation area
          </Link>
        </Card>
      </div>

      <Card title="Backend Health" description="Connectivity check to API.">
        <code>
          {health
            ? `${health.data.status} (${health.data.timestamp})`
            : 'Backend unavailable'}
        </code>
      </Card>
    </section>
  );
}

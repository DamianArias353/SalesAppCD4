import { Card } from '@/components/ui/card';

export default function SalesPage() {
  return (
    <section className="stack">
      <h1>Sales List</h1>
      <p className="muted">Placeholder page for listing sales from the backend.</p>

      <Card
        title="Next Step"
        description="Connect this view to GET /api/sales and render table/cards with loading and empty states."
      />
    </section>
  );
}

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NewSalePage() {
  return (
    <section className="stack">
      <h1>Create Sale</h1>
      <p className="muted">Placeholder form scaffold for creating sales.</p>

      <Card title="Create Sale Form" description="Ready for Zod + form handling integration.">
        <form className="stack" aria-label="create-sale-form">
          <label className="field">
            Customer
            <input type="text" name="customer" placeholder="Acme Corp" disabled />
          </label>

          <label className="field">
            Product
            <input type="text" name="product" placeholder="Premium Plan" disabled />
          </label>

          <label className="field">
            Amount
            <input type="number" name="amount" placeholder="1200" disabled />
          </label>

          <Button type="button" disabled>
            Save sale
          </Button>
        </form>
      </Card>
    </section>
  );
}

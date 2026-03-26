'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ApiClientError } from '@/services/api/client';
import { createSale, evaluateSale, getSales } from '@/services/api/sales';
import { CreateSaleRequest, Sale } from '@/types/sale';

type FormState = {
  customer: string;
  product: string;
  amount: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  customer: '',
  product: '',
  amount: ''
};

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const sortSalesDescending = (items: Sale[]) => {
  return [...items].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export function SalesDashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [createFeedback, setCreateFeedback] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [selectedScores, setSelectedScores] = useState<Record<string, number>>({});
  const [isEvaluatingSaleById, setIsEvaluatingSaleById] = useState<
    Record<string, boolean>
  >({});
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  const evaluatedSales = useMemo(() => {
    return sales.filter((sale) => sale.score !== null);
  }, [sales]);

  const averageScore = useMemo(() => {
    if (evaluatedSales.length === 0) {
      return null;
    }

    const totalScore = evaluatedSales.reduce((acc, sale) => {
      return acc + (sale.score ?? 0);
    }, 0);

    return (totalScore / evaluatedSales.length).toFixed(2);
  }, [evaluatedSales]);

  useEffect(() => {
    void loadSales();
  }, []);

  async function loadSales() {
    setIsLoadingSales(true);
    setSalesError(null);

    try {
      const response = await getSales();
      setSales(sortSalesDescending(response.data));

      setSelectedScores((prev) => {
        const next = { ...prev };

        for (const sale of response.data) {
          if (!next[sale.id]) {
            next[sale.id] = sale.score ?? 3;
          }
        }

        return next;
      });
    } catch (error) {
      setSalesError(getErrorMessage(error, 'Could not load sales.'));
    } finally {
      setIsLoadingSales(false);
    }
  }

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));

    setFormErrors((prev) => ({
      ...prev,
      [field]: undefined
    }));
  };

  const validateCreateSaleForm = (data: FormState): FormErrors => {
    const errors: FormErrors = {};

    if (!data.customer.trim()) {
      errors.customer = 'Customer is required.';
    }

    if (!data.product.trim()) {
      errors.product = 'Product is required.';
    }

    const amount = Number(data.amount);
    if (!data.amount.trim()) {
      errors.amount = 'Amount is required.';
    } else if (Number.isNaN(amount)) {
      errors.amount = 'Amount must be numeric.';
    } else if (amount <= 0) {
      errors.amount = 'Amount must be greater than 0.';
    }

    return errors;
  };

  const handleCreateSale = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateFeedback(null);
    setCreateError(null);

    const validationErrors = validateCreateSaleForm(formState);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const payload: CreateSaleRequest = {
      customer: formState.customer.trim(),
      product: formState.product.trim(),
      amount: Number(formState.amount)
    };

    setIsCreatingSale(true);
    try {
      const response = await createSale(payload);

      setSales((prev) => sortSalesDescending([response.data, ...prev]));
      setSelectedScores((prev) => ({
        ...prev,
        [response.data.id]: response.data.score ?? 3
      }));
      setFormState(initialFormState);
      setCreateFeedback('Sale created successfully.');
    } catch (error) {
      setCreateError(getErrorMessage(error, 'Could not create sale.'));
    } finally {
      setIsCreatingSale(false);
    }
  };

  const handleEvaluateSale = async (saleId: string) => {
    setEvaluationFeedback(null);
    setEvaluationError(null);

    const score = selectedScores[saleId];
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      setEvaluationError('Please choose a score between 1 and 5.');
      return;
    }

    setIsEvaluatingSaleById((prev) => ({
      ...prev,
      [saleId]: true
    }));

    try {
      const response = await evaluateSale(saleId, { score });

      setSales((prev) =>
        prev.map((sale) => (sale.id === saleId ? response.data : sale))
      );
      setEvaluationFeedback('Sale score updated successfully.');
    } catch (error) {
      setEvaluationError(getErrorMessage(error, 'Could not evaluate sale.'));
    } finally {
      setIsEvaluatingSaleById((prev) => ({
        ...prev,
        [saleId]: false
      }));
    }
  };

  return (
    <section className="stack">
      <div className="stack compact">
        <h1>Sales Management & Evaluation</h1>
        <p className="muted">
          Create sales, list records, and score them from 1 to 5.
        </p>
      </div>

      <div className="grid grid-two-columns">
        <Card title="Create Sale" description="Add a new sale entry.">
          <form className="stack" onSubmit={handleCreateSale}>
            <div className="form-grid">
              <label className="field">
                Customer
                <input
                  type="text"
                  name="customer"
                  placeholder="Acme Corp"
                  value={formState.customer}
                  onChange={(event) =>
                    handleInputChange('customer', event.target.value)
                  }
                  disabled={isCreatingSale}
                />
                {formErrors.customer ? (
                  <span className="helper helper-error">{formErrors.customer}</span>
                ) : null}
              </label>

              <label className="field">
                Product
                <input
                  type="text"
                  name="product"
                  placeholder="Premium Plan"
                  value={formState.product}
                  onChange={(event) =>
                    handleInputChange('product', event.target.value)
                  }
                  disabled={isCreatingSale}
                />
                {formErrors.product ? (
                  <span className="helper helper-error">{formErrors.product}</span>
                ) : null}
              </label>

              <label className="field">
                Amount
                <input
                  type="number"
                  name="amount"
                  placeholder="1200"
                  min="0"
                  step="0.01"
                  value={formState.amount}
                  onChange={(event) => handleInputChange('amount', event.target.value)}
                  disabled={isCreatingSale}
                />
                {formErrors.amount ? (
                  <span className="helper helper-error">{formErrors.amount}</span>
                ) : null}
              </label>
            </div>

            <Button type="submit" disabled={isCreatingSale}>
              {isCreatingSale ? 'Saving...' : 'Create Sale'}
            </Button>

            {createFeedback ? (
              <p className="alert alert-success">{createFeedback}</p>
            ) : null}

            {createError ? <p className="alert alert-error">{createError}</p> : null}
          </form>
        </Card>

        <Card title="Evaluation Summary" description="Simple score metrics.">
          <ul className="summary-list">
            <li>
              Total sales: <strong>{sales.length}</strong>
            </li>
            <li>
              Evaluated sales: <strong>{evaluatedSales.length}</strong>
            </li>
            <li>
              Average score:{' '}
              <strong>{averageScore !== null ? averageScore : 'No scores yet'}</strong>
            </li>
          </ul>
          {evaluationFeedback ? (
            <p className="alert alert-success">{evaluationFeedback}</p>
          ) : null}
          {evaluationError ? (
            <p className="alert alert-error">{evaluationError}</p>
          ) : null}
        </Card>
      </div>

      <Card
        title="Sales List"
        description="Customer, product, amount, and score (if evaluated)."
      >
        {isLoadingSales ? <p className="muted">Loading sales...</p> : null}
        {salesError ? <p className="alert alert-error">{salesError}</p> : null}

        {!isLoadingSales && !salesError && sales.length === 0 ? (
          <p className="empty-state">
            No sales registered yet. Create the first sale using the form above.
          </p>
        ) : null}

        {!isLoadingSales && !salesError && sales.length > 0 ? (
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Score</th>
                  <th>Evaluate</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => {
                  const isEvaluating = Boolean(isEvaluatingSaleById[sale.id]);
                  const selectedScore = selectedScores[sale.id] ?? sale.score ?? 3;

                  return (
                    <tr key={sale.id}>
                      <td>{sale.customer}</td>
                      <td>{sale.product}</td>
                      <td>{formatAmount(sale.amount)}</td>
                      <td>
                        {sale.score === null ? (
                          <span className="score-placeholder">Not evaluated</span>
                        ) : (
                          <strong>{sale.score}</strong>
                        )}
                      </td>
                      <td>
                        <div className="inline-actions">
                          <select
                            value={selectedScore}
                            className="score-select"
                            disabled={isEvaluating}
                            onChange={(event) =>
                              setSelectedScores((prev) => ({
                                ...prev,
                                [sale.id]: Number(event.target.value)
                              }))
                            }
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>

                          <Button
                            type="button"
                            className="button-small"
                            onClick={() => {
                              void handleEvaluateSale(sale.id);
                            }}
                            disabled={isEvaluating}
                          >
                            {isEvaluating ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </section>
  );
}

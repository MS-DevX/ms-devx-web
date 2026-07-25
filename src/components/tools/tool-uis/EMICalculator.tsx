"use client";
import { useState, useMemo } from "react";
import { currencies, type Currency } from "@/data/currencies";

interface AmortizationRow {
  year: number;
  interest: number;
  principal: number;
  remaining: number;
}

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  currency: string;
}

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanYears, setLoanYears] = useState<string>("");
  const [currency, setCurrency] = useState<string>("$");

  const { result, amortization } = useMemo<{ result: EMIResult | null; amortization: AmortizationRow[] }>(() => {
    const P = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanYears) || 0;

    if (P <= 0 || annualRate <= 0 || years <= 0) {
      return { result: null, amortization: [] };
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    if (monthlyRate === 0) {
      const emi = P / months;
      return {
        result: {
          emi,
          totalInterest: 0,
          totalPayment: P,
          currency,
        },
        amortization: [],
      };
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const EMI = (P * monthlyRate * factor) / (factor - 1);
    const totalPayment = EMI * months;
    const totalInterest = totalPayment - P;

    let remaining = P;
    const yearlyData: AmortizationRow[] = [];

    for (let year = 1; year <= years; year++) {
      let yearInterest = 0;
      let yearPrincipal = 0;

      for (let month = 1; month <= 12; month++) {
        const interest = remaining * monthlyRate;
        const principal = EMI - interest;
        yearInterest += interest;
        yearPrincipal += principal;
        remaining -= principal;
        if (remaining < 0) remaining = 0;
      }

      yearlyData.push({
        year,
        interest: yearInterest,
        principal: yearPrincipal,
        remaining: Math.max(0, remaining),
      });
    }

    return {
      result: {
        emi: EMI,
        totalInterest,
        totalPayment,
        currency,
      },
      amortization: yearlyData,
    };
  }, [loanAmount, interestRate, loanYears, currency]);

  const formatCurrency = (value: number, decimals = 2): string => {
    return `${currency}${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Loan Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {currency}
            </span>
            <input
              type="number"
              min="0"
              value={loanAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoanAmount(e.target.value)}
              placeholder="250000"
              className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Interest Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={interestRate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInterestRate(e.target.value)}
            placeholder="6.5"
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Loan Term (Years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={loanYears}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoanYears(e.target.value)}
            placeholder="30"
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          >
            {currencies.map((c: Currency) => (
              <option key={c.code} value={c.symbol}>
                {c.code} {c.symbol} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8 mb-8">
            <h3 className="font-semibold text-foreground mb-6 text-lg text-center">
              🏦 Loan Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary-light rounded-xl p-6 text-center">
                <div className="text-sm text-primary font-semibold mb-1">
                  Monthly EMI
                </div>
                <div className="text-3xl font-extrabold text-primary">
                  {formatCurrency(result.emi)}
                </div>
              </div>
              <div className="bg-muted rounded-xl p-6 text-center">
                <div className="text-sm text-muted-foreground font-semibold mb-1">
                  Total Interest
                </div>
                <div className="text-2xl font-extrabold text-foreground">
                  {formatCurrency(result.totalInterest)}
                </div>
              </div>
              <div className="bg-muted rounded-xl p-6 text-center">
                <div className="text-sm text-muted-foreground font-semibold mb-1">
                  Total Payment
                </div>
                <div className="text-2xl font-extrabold text-foreground">
                  {formatCurrency(result.totalPayment)}
                </div>
              </div>
            </div>
          </div>

          {amortization.length > 0 && amortization.length <= 10 && (
            <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8">
              <h3 className="font-semibold text-foreground mb-6 text-lg text-center">
                📊 Amortization Schedule (Yearly)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="text-center py-3 px-4 text-foreground font-semibold">
                        Year
                      </th>
                      <th className="text-right py-3 px-4 text-foreground font-semibold">
                        Interest
                      </th>
                      <th className="text-right py-3 px-4 text-foreground font-semibold">
                        Principal
                      </th>
                      <th className="text-right py-3 px-4 text-foreground font-semibold">
                        Remaining
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortization.map((row: AmortizationRow) => (
                      <tr
                        key={row.year}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="text-center py-3 px-4 text-foreground font-medium">
                          {row.year}
                        </td>
                        <td className="text-right py-3 px-4 text-foreground">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="text-right py-3 px-4 text-foreground">
                          {formatCurrency(row.principal)}
                        </td>
                        <td className="text-right py-3 px-4 text-foreground">
                          {formatCurrency(row.remaining)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

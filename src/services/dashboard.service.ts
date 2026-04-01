import { prisma } from '../config/prisma';

export const getDashboardSummary = async () => {
    // 1. Total Income & Total Expenses
    const aggregates = await prisma.financialRecord.groupBy({
      by: ['type'],
      where: { deletedAt: null },
      _sum: { amount: true },
    });
  
    let totalIncome = 0;
    let totalExpenses = 0;
  
    aggregates.forEach((agg: any) => {
      if (agg.type === 'INCOME') totalIncome = agg._sum.amount || 0;
      if (agg.type === 'EXPENSE') totalExpenses = agg._sum.amount || 0;
    });
  
    const netBalance = totalIncome - totalExpenses;
  
    // 2. Category Wise Totals for Expenses
    const categoryTotals = await prisma.financialRecord.groupBy({
      by: ['category'],
      where: { deletedAt: null, type: 'EXPENSE' },
      _sum: { amount: true },
    });
  
    const formattedCategoryTotals = categoryTotals.map((cat: any) => ({
      category: cat.category,
      total: cat._sum.amount || 0,
    })).sort((a: any, b: any) => b.total - a.total);
  
    // 3. Recent Activity (Last 5 records)
    const recentActivity = await prisma.financialRecord.findMany({
      where: { deletedAt: null },
      orderBy: { date: 'desc' },
      take: 5,
    });
  
    return {
      totalIncome,
      totalExpenses,
      netBalance,
      expenseByCategory: formattedCategoryTotals,
      recentActivity,
    };
  };

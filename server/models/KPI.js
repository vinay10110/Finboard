import mongoose from "mongoose";

const Schema = mongoose.Schema;

const daySchema = new Schema(
  {
    date: String,
    revenue: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    expenses: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
  },
  { toJSON: { getters: true } }
);

const monthSchema = new Schema(
  {
    month: String,
    revenue: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    expenses: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    operationalExpenses: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    nonOperationalExpenses: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
  },
  { toJSON: { getters: true } }
);

const KPISchema = new Schema(
  {
    totalProfit: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    totalRevenue: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    totalExpenses: {
      type: Number,
      required: true,
      get: (v) => (v / 100).toFixed(2),
    },
    expensesByCategory: {
      type: Map,
      of: {
        type: Number,
        get: (v) => (v / 100).toFixed(2),
      },
    
    },
    monthlyData: [monthSchema],
    dailyData: [daySchema],
  },
  { timestamps: true, toJSON: { getters: true } }
);

const KPI = mongoose.model("KPI", KPISchema);

export default KPI;
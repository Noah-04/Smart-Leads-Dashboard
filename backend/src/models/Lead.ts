import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Qualified = "Qualified",
  Lost = "Lost"
}

export enum LeadSource {
  Website = "Website",
  Instagram = "Instagram",
  Referral = "Referral"
}

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadDocument = HydratedDocument<ILead>;

type LeadModel = Model<ILead>;

const leadSchema = new Schema<ILead, LeadModel>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      minlength: [2, "Lead name must be at least 2 characters"],
      maxlength: [100, "Lead name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.New,
      required: true
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ name: "text", email: "text" });

export const Lead = model<ILead, LeadModel>("Lead", leadSchema);

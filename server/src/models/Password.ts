import mongoose, { Document, Schema } from "mongoose";

export interface IPassword extends Document {

  userId: mongoose.Types.ObjectId;

  website: string;

  username: string;

  encryptedPassword: string;

  category: string;

  notes?: string;

  favicon?: string;

  url?: string;

  tags: string[];

  isFavorite: boolean;

  lastModified: Date;

  strength: "weak" | "medium" | "strong" | "very-strong";

  createdAt: Date;

  updatedAt: Date;

}

const passwordSchema = new Schema<IPassword>(

  {

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    website: {
      type: String,
      required: [true, "Website name is required"],
      trim: true,
      maxlength: [100, "Website name cannot exceed 100 characters"],
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      maxlength: [100, "Username cannot exceed 100 characters"],
    },

    encryptedPassword: {
      type: String,
      required: [true, "Password is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Personal",
        "Work",
        "Finance",
        "Shopping",
        "Social Media",
        "Development",
        "Other",
      ],
      default: "Other",
    },

    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },

    favicon: {
      type: String,
      default: "",
    },

    url: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    isFavorite: {
      type: Boolean,
      default: false,
    },

    lastModified: {
      type: Date,
      default: Date.now,
    },

    strength: {
      type: String,
      enum: ["weak", "medium", "strong", "very-strong"],
      default: "medium",
    },

  },

  {
    timestamps: true,
  }

);

// Index for faster queries

passwordSchema.index({ userId: 1, category: 1 });

passwordSchema.index({ userId: 1, website: "text", username: "text" });

export const Password = mongoose.model<IPassword>("Password", passwordSchema);
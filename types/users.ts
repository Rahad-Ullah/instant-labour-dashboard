export type IAvailability =
  | "Full-Time"
  | "Part-Time"
  | "Flexible"
  | "One-Day"
  | "Weekly"
  | "Monthly"
  | "Yearly";

export type ISalaryType = "Hourly" | "Daily" | "Weekly" | "Monthly" | "Yearly";

export type IWorkExperience = {
  company?: string;
  title: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
};

export type IUserSubscriptions = {
  isActive: boolean;
  packageId?: string | any;
  packageType?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status?: string;
  currentJobQuota?: number;
  currentBoostQuota?: number;
  currentBookingQuota?: number;
  currentPeriodEnd?: number | string | Date;
  cancelAtPeriodEnd?: boolean;
};

type IAuthentication = {
  restrictionLeftAt: Date | null;
  resetPassword: boolean;
  wrongLoginAttempts: number;
  passwordChangedAt?: Date;
  oneTimeCode: string;
  latestRequestAt: Date;
  expiresAt?: Date;
  requestCount?: number;
  authType?: "createAccount" | "resetPassword";
};

export type IUser = {
  _id: string;
  //common fields
  name?: string;
  isBritish: boolean;
  dateOfBirth: string;
  shareCode: string;
  insuranceNumber: string;
  email?: string;
  profile?: string;
  phone?: string;
  status: string;
  verified: boolean;
  address?: string;
  location: any;
  password: string;
  role: string;
  appId?: string;
  deviceToken?: string;
  subscription?: IUserSubscriptions;
  //employer fields
  nid?: boolean;
  nidFront?: string;
  nidBack?: string;
  isAccountVerified?: boolean;
  //worker fields
  cover?: string;
  category?: string;
  subCategory?: string;
  availability?: IAvailability[];
  salaryType?: ISalaryType;
  salary?: number;
  about?: string;
  workOverview?: string;
  coreSkills?: string[];
  yearsOfExperience?: number;
  workExperiences?: IWorkExperience[];
  rating?: number;
  totalReview?: number;

  //added field
  isAvailableToBook?: boolean;
  isChatExist?: boolean;

  authentication: IAuthentication;
  createdAt: Date;
  updatedAt: Date;
  employerType: string;
  companyNumber: string;
  registeredAddress: string;
  businessName: string;
};

export type IUserFilterableFields = {
  searchTerm?: string;
  role?: string;
  status?: string;
  verified?: boolean;
  category?: string;
  subCategory?: string;
  address?: string;
  page?: number;
  limit?: number;
};

export enum USER_STATUS {
  ACTIVE = "active",
  RESTRICTED = "restricted",
  DELETED = "deleted",
  WORKER = "worker",
  EMPLOYER = "employer",
}

export enum USER_ROLES {
  ADMIN = "admin",
  EMPLOYER = "employer",
  GUEST = "guest",
  WORKER = "worker",
  VERIFY_REQUEST = "verify_request",
}

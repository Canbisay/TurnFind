export const ROLES = {
  CUSTOMER: "customer",
  STAFF: "staff",
  OWNER: "owner",
};

export const TICKET_STATUS = {
  WAITING: "waiting",
  CALLED: "called",
  IN_SERVICE: "in_service",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXPIRED: "expired", // removed for being late
};

// Statuses where the ticket still occupies a place in the queue
export const ACTIVE_STATUSES = ["waiting", "called", "in_service"];

export const DEFAULT_TIMEZONE = "Asia/Kolkata";
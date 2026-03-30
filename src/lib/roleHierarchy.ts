// src/lib/roleHierarchy.ts

// Superusers bypass all hierarchy checks
export const SUPER_USER_ROLES = ['Admin'];

// Assign weights to standard organization roles. Higher number = higher authority.
// This allows for simple mathematical comparisons (e.g., 15 > 3)
export const ORG_ROLE_WEIGHTS: Record<string, number> = {
  'chief-managing-director': 15,
  'director': 14,
  'president': 13,
  'senior-general-manager': 12,
  'general-manager': 11,
  'deputy-general-manager': 10,
  'assistant-general-manager': 9,
  'senior-regional-manager': 8,
  'regional-manager': 7,
  'deputy-manager': 6,
  'senior-area-manager': 5,
  'area-manager': 4,
  'senior-executive': 3,
  'executive': 2,
  'junior-executive': 1,
};

/**
 * Checks if a user is a superuser.
 */
export function isSuperUser(role: string): boolean {
  return SUPER_USER_ROLES.includes(role);
}

/**
 * Gets the numeric weight of a role. Returns 0 if the role is invalid or a superuser 
 * (since superusers are handled separately).
 */
export function getRoleWeight(role: string): number {
  return ORG_ROLE_WEIGHTS[role] || 0;
}

/**
 * Returns a list of roles that the current user is permitted to see/assign.
 *
 * @param currentUserRole The role of the currently logged-in user.
 * @returns An array of role strings that are visible to the current user.
 */
export function getVisibleRoles(currentUserRole: string): string[] {
  // 1. Superusers can see and assign ALL standard roles (and maybe other superusers depending on your business logic)
  if (isSuperUser(currentUserRole)) {
    return Object.keys(ORG_ROLE_WEIGHTS);
  }

  // 2. Standard users can only see roles with a strictly lower weight than their own
  const userWeight = getRoleWeight(currentUserRole);
  if (userWeight === 0) return []; // Invalid or unmapped role

  return Object.keys(ORG_ROLE_WEIGHTS).filter((role) => {
    return getRoleWeight(role) < userWeight;
  });
}

/**
 * Checks if a target role is a valid, lower-level role for a given current user's role.
 * This function is crucial for server-side validation.
 *
 * @param currentUserRole The role of the user making the change.
 * @param targetRole The role being assigned/modified.
 * @returns boolean
 */
export function canAssignRole(currentUserRole: string, targetRole: string): boolean {
  // Superusers can assign any role
  if (isSuperUser(currentUserRole)) {
    return true; 
  }

  // Standard users cannot assign superuser roles
  if (isSuperUser(targetRole)) {
    return false;
  }

  const currentUserWeight = getRoleWeight(currentUserRole);
  const targetRoleWeight = getRoleWeight(targetRole);

  // A role can only be assigned if the user's weight is strictly greater than the target's weight
  return currentUserWeight > 0 && currentUserWeight > targetRoleWeight;
}

/**
 * Utility to sort an array of roles from highest authority to lowest.
 */
export function sortRolesHighestToLowest(roles: string[]): string[] {
  return [...roles].sort((a, b) => getRoleWeight(b) - getRoleWeight(a));
}
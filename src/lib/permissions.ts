export type UserRole = 'admin' | 'owner' | 'staff' | 'user';

export const isAdmin = (role?: string) => role === 'admin';
export const isOwner = (role?: string) => role === 'owner' || role === 'admin';
export const isStaff = (role?: string) => role === 'staff' || role === 'owner' || role === 'admin';

export const canManageTeam = (role?: string) => isAdmin(role) || isOwner(role);
export const canManageGlobalBlog = (role?: string) => isAdmin(role) || isOwner(role);
export const canAccessAdmin = (role?: string) => isStaff(role);

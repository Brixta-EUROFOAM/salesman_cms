// src/app/api/dashboardPagesAPI/users-and-team/team-overview/dataFetch/route.ts
import 'server-only';
import { NextResponse, NextRequest, connection } from 'next/server';
import { db } from '@/lib/drizzle';
import { users, roles, userRoles } from '../../../../../../../drizzle';
import { eq, and } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (typeof connection === 'function') await connection();

  try {
    const session = await verifySession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session.permissions.includes("READ")) {
      return NextResponse.json({ error: 'Forbidden: READ access required' }, { status: 403 });
    }

    const roleParam = request.nextUrl.searchParams.get('role');
    const roleFilter = roleParam && roleParam !== 'all' ? roleParam : undefined;

    // 1. Fetch all users and their joined roles for this company in one query
    const allCompanyUsersRaw = await db
      .select({
        user: users,
        orgRole: roles.orgRole,
        jobRole: roles.jobRole,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.companyId, session.companyId));

    // 2. Aggregate the multiple role rows per user into a single object
    const usersMap = new Map();
    for (const row of allCompanyUsersRaw) {
      if (!usersMap.has(row.user.id)) {
        usersMap.set(row.user.id, {
          ...row.user,
          orgRole: row.orgRole || 'Unassigned',
          jobRoles: new Set<string>(),
        });
      }
      const u = usersMap.get(row.user.id);
      if (row.jobRole) u.jobRoles.add(row.jobRole);
      // Ensure we grab a valid orgRole if the first joined row had a null one
      if (row.orgRole && u.orgRole === 'Unassigned') u.orgRole = row.orgRole;
    }

    // Convert Set to Array for JSON serialization
    const allUsers = Array.from(usersMap.values()).map(u => ({
      ...u,
      jobRole: Array.from(u.jobRoles),
    }));

    // 3. Filter by selected role (if applicable)
    const filteredUsers = roleFilter 
      ? allUsers.filter(u => u.orgRole === roleFilter) 
      : allUsers;

    // 4. Build the hierarchy and format the response
    const formattedTeamData = filteredUsers.map(member => {
      // Find manager
      const manager = member.reportsToId ? allUsers.find(u => u.id === member.reportsToId) : null;
      const managerName = manager ? `${manager.firstName || ''} ${manager.lastName || ''}`.trim() : 'none';

      // Find direct reports
      const directReports = allUsers.filter(u => u.reportsToId === member.id);
      const manages = directReports.map(r => `${r.firstName || ''} ${r.lastName || ''}`.trim()).filter(Boolean).join(', ') || 'None';

      // Fallback to the users table flag if jobRole array doesn't explicitly have it
      const isTechnicalRole = member.jobRole.includes('Technical-Sales') || member.isTechnicalRole;

      return {
        id: member.id,
        name: `${member.firstName || ''} ${member.lastName || ''}`.trim(),
        orgRole: member.orgRole,
        jobRole: member.jobRole,
        managedBy: managerName,
        manages,
        managesReports: directReports.map(r => ({ name: `${r.firstName || ''} ${r.lastName || ''}`.trim(), orgRole: r.orgRole })),
        managedById: member.reportsToId,
        managesIds: directReports.map(r => r.id),
        isTechnicalRole, 
      };
    });

    // Sort alphabetically by name
    formattedTeamData.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(formattedTeamData, { status: 200 });

  } catch (error: any) {
    console.error("Team Overview Fetch Error:", error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
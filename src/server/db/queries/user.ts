import { db } from '~/server/db';
import { userRoles } from '../schema';

export async function getUsers() {
  const results = await db.query.users.findMany({
    with: {
      roles: {
        with: {
          role: true
        }
      },
      projects: {
        with: {
          project: true
        }
      },
    }
  });

  console.log(results);

  return results.map(user => ({
    id: user.id,
    email: user.email,
    roles: user.roles.map(ur => ur.role),
    projects: user.projects.map(up => up.project),
  }));
}
import { relations } from "drizzle-orm/relations";
import { roles, employees, timeentries } from "./schema.js";

export const employeesInTimesheetRelations = relations(employees, ({one, many}) => ({
	rolesInTimesheet: one(roles, {
		fields: [employees.roleId],
		references: [roles.roleId]
	}),
	timeentriesInTimesheets: many(timeentries),
}));

export const rolesInTimesheetRelations = relations(roles, ({many}) => ({
	employeesInTimesheets: many(employees),
}));

export const timeentriesInTimesheetRelations = relations(timeentries, ({one}) => ({
	employeesInTimesheet: one(employees, {
		fields: [timeentries.employeeId],
		references: [employees.employeeId]
	}),
}));
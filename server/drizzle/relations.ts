import { relations } from "drizzle-orm/relations";
import { roles, employees, timeentries } from "./schema";

export const employeesRelations = relations(employees, ({one, many}) => ({
	role: one(roles, {
		fields: [employees.roleId],
		references: [roles.roleId]
	}),
	timeentries: many(timeentries),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	employees: many(employees),
}));

export const timeentriesRelations = relations(timeentries, ({one}) => ({
	employee: one(employees, {
		fields: [timeentries.employeeId],
		references: [employees.employeeId]
	}),
}));
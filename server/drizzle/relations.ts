import { relations } from "drizzle-orm/relations";
import { rolesInTimesheet, employeesInTimesheet, timeentriesInTimesheet } from "./schema";

export const employeesInTimesheetRelations = relations(employeesInTimesheet, ({one, many}) => ({
	rolesInTimesheet: one(rolesInTimesheet, {
		fields: [employeesInTimesheet.roleId],
		references: [rolesInTimesheet.roleId]
	}),
	timeentriesInTimesheets: many(timeentriesInTimesheet),
}));

export const rolesInTimesheetRelations = relations(rolesInTimesheet, ({many}) => ({
	employeesInTimesheets: many(employeesInTimesheet),
}));

export const timeentriesInTimesheetRelations = relations(timeentriesInTimesheet, ({one}) => ({
	employeesInTimesheet: one(employeesInTimesheet, {
		fields: [timeentriesInTimesheet.employeeId],
		references: [employeesInTimesheet.employeeId]
	}),
}));
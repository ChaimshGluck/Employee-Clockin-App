import { pgTable, unique, serial, varchar, foreignKey, integer, date, timestamp, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"




export const roles = pgTable("roles", {
	roleId: serial("role_id").primaryKey().notNull(),
	roleName: varchar("role_name", { length: 50 }).notNull(),
},
	(table) => {
		return {
			rolesRoleNameKey: unique("roles_role_name_key").on(table.roleName),
		}
	});

export const employees = pgTable("employees", {
	employeeId: serial("employee_id").primaryKey().notNull(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	email: varchar("email", { length: 100 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	roleId: integer("role_id"),
	dateHired: date("date_hired").notNull(),
},
	(table) => {
		return {
			employeesRoleIdFkey: foreignKey({
				columns: [table.roleId],
				foreignColumns: [roles.roleId],
				name: "employees_role_id_fkey"
			}),
			employeesEmailKey: unique("employees_email_key").on(table.email),
		}
	});

export const timeentries = pgTable("timeentries", {
	entryId: serial("entry_id").primaryKey().notNull(),
	employeeId: integer("employee_id"),
	clockIn: timestamp("clock_in", { mode: 'string' }).notNull(),
	clockOut: timestamp("clock_out", { mode: 'string' }),
	totalHours: numeric("total_hours", { precision: 5, scale: 2 }).generatedAlwaysAs(sql`(EXTRACT(epoch FROM (clock_out - clock_in)) / (3600)::numeric)`),
	entryDate: date("entry_date").default(sql`CURRENT_DATE`).notNull(),
},
	(table) => {
		return {
			timeentriesEmployeeIdFkey: foreignKey({
				columns: [table.employeeId],
				foreignColumns: [employees.employeeId],
				name: "timeentries_employee_id_fkey"
			}).onDelete("cascade"),
		}
	});
import { pgTable, pgSchema, unique, serial, varchar, foreignKey, integer, date, bigint, boolean, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const timesheet = pgSchema("timesheet");



export const roles = timesheet.table("roles", {
	roleId: serial("role_id").primaryKey().notNull(),
	roleName: varchar("role_name", { length: 50 }).notNull(),
},
(table) => {
	return {
		rolesRoleNameKey: unique("roles_role_name_key").on(table.roleName),
	}
});

export const employees = timesheet.table("employees", {
	employeeId: serial("employee_id").primaryKey().notNull(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	email: varchar("email", { length: 100 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	roleId: integer("role_id"),
	dateHired: date("date_hired").notNull(),
	activationToken: varchar("activation_token", { length: 255 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	activationTokenExpires: bigint("activation_token_expires", { mode: "number" }),
	isActive: boolean("is_active").default(false),
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

export const timeentries = timesheet.table("timeentries", {
	entryId: serial("entry_id").primaryKey().notNull(),
	employeeId: integer("employee_id"),
	clockIn: timestamp("clock_in", { withTimezone: true, mode: 'string' }).notNull(),
	clockOut: timestamp("clock_out", { withTimezone: true, mode: 'string' }),
	totalHours: varchar("total_hours").generatedAlwaysAs(sql`(((floor((EXTRACT(epoch FROM (clock_out - clock_in)) / (3600)::numeric)) || ' hours '::text) || floor(((EXTRACT(epoch FROM (clock_out - clock_in)) % (3600)::numeric) / (60)::numeric))) || ' minutes'::text)`),
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
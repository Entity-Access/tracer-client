import DateTime from "@web-atoms/date-time/dist/DateTime";
import type IClrEntity from "@web-atoms/entity/dist/models/IClrEntity";
import { ICollection, IGeometry, IModel, Model, DefaultFactory } from "@web-atoms/entity/dist/services/BaseEntityService";

export interface IConfiguration extends IClrEntity {
	name?: string;
	configValue?: string;
}

export const Configuration: IModel<IConfiguration> = new Model<IConfiguration>("Configuration", ["name"], { configValue: "" });

export interface ILoginSession extends IClrEntity {
	readonly sessionID?: number;
	userID?: number;
	invalid?: boolean;
	dateUpdated?: DateTime;
	status?: string | null;
	deviceToken?: string | null;
	deviceTokenType?: string | null;
	userName?: string;
	checkPassword?: string;
	newPassword?: string;
	/** Multi Factor Auth Token */
	timeToken?: string;
	/** One Time Password */
	oneTimePassword?: string;
	user?: IUser;
}

export const LoginSession: IModel<ILoginSession> = new Model<ILoginSession>("LoginSession", ["sessionID"], { invalid: false,dateUpdated: new DefaultFactory(() => new DateTime()) });

export interface IUser extends IClrEntity {
	readonly userID?: number;
	userName?: string;
	displayName?: string;
	readonly status?: "active" | "blocked" | "locked" | "change-password" | "external";
	isExternal?: boolean;
	readonly multiFactor?: boolean;
	dateUpdated?: DateTime;
	/** Save this to change password */
	changePassword?: { oldPassword?: string;newPassword?: string;forceChangePasswordOnLogin?: boolean };
	createFolder?: boolean;
	sessions?: ICollection<ILoginSession>;
	authFactors?: ICollection<IUserAuthFactor>;
	roles?: ICollection<IUserRole>;
}

export const UserStatusArray = [{"label":"active","value":"active"},{"label":"blocked","value":"blocked"},{"label":"locked","value":"locked"},{"label":"change-password","value":"change-password"},{"label":"external","value":"external"}];

export const User: IModel<IUser> = new Model<IUser>("User", ["userID"], { userName: "",displayName: "",status: "active",isExternal: false,multiFactor: false,dateUpdated: new DefaultFactory(() => new DateTime()) });

export interface IUserAuthFactor extends IClrEntity {
	readonly authFactorID?: number;
	userID?: number;
	method?: "totp" | "hotp" | "fido2" | "one-time";
	hint?: string | null;
	verified?: boolean;
	dateUpdated?: DateTime;
	qrCodeDataUrl?: string;
	token?: string;
	displaySecret?: string;
	user?: IUser;
}

export const UserAuthFactorMethodArray = [{"label":"totp","value":"totp"},{"label":"hotp","value":"hotp"},{"label":"fido2","value":"fido2"},{"label":"one-time","value":"one-time"}];

export const UserAuthFactor: IModel<IUserAuthFactor> = new Model<IUserAuthFactor>("UserAuthFactor", ["authFactorID"], { method: "totp",verified: false,dateUpdated: new DefaultFactory(() => new DateTime()) });

export interface IUserRole extends IClrEntity {
	userID?: number;
	roleName?: string;
	user?: IUser;
	role?: IUserRoleType;
}

export const UserRole: IModel<IUserRole> = new Model<IUserRole>("UserRole", ["userID","roleName"], {  });

export interface IUserRoleType extends IClrEntity {
	roleName?: string;
	roles?: ICollection<IUserRole>;
}

export const UserRoleType: IModel<IUserRoleType> = new Model<IUserRoleType>("UserRoleType", ["roleName"], {  });

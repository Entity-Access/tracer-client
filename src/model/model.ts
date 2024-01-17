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

export interface ITrace extends IClrEntity {
	readonly traceID?: number;
	sourceID?: number;
	dateCreated?: DateTime;
	type?: string;
	serverID?: number | null;
	appID?: number | null;
	sessionID?: number | null;
	hostID?: number | null;
	path?: string | null;
	ipAddress?: string | null;
	userID?: number | null;
	json?: string | null;
	source?: ITracerSource;
	server?: ITracerName;
	app?: ITracerName;
	session?: ITracerName;
	host?: ITracerName;
	user?: ITracerName;
	traceTags?: ICollection<ITraceTag>;
}

export const Trace: IModel<ITrace> = new Model<ITrace>("Trace", ["traceID"], { dateCreated: new DefaultFactory(() => new DateTime()),type: "" });

export interface ITracerName extends IClrEntity {
	readonly nameID?: number;
	type?: string;
	name?: string;
	serverTraces?: ICollection<ITrace>;
	appTraces?: ICollection<ITrace>;
	sessionTraces?: ICollection<ITrace>;
	hostTraces?: ICollection<ITrace>;
	userTraces?: ICollection<ITrace>;
}

export const TracerName: IModel<ITracerName> = new Model<ITracerName>("TracerName", ["nameID"], { type: "",name: "" });

export interface ITracerKey extends IClrEntity {
	readonly keyID?: number;
	sourceID?: number;
	key?: string;
	source?: ITracerSource;
}

export const TracerKey: IModel<ITracerKey> = new Model<ITracerKey>("TracerKey", ["keyID"], { key: "" });

export interface ITracerSource extends IClrEntity {
	readonly sourceID?: number;
	userID?: number;
	name?: string;
	user?: IUser;
	traces?: ICollection<ITrace>;
	keySources?: ICollection<ITracerKey>;
}

export const TracerSource: IModel<ITracerSource> = new Model<ITracerSource>("TracerSource", ["sourceID"], { name: "" });

export interface ITraceTag extends IClrEntity {
	traceID?: number;
	tagID?: number;
	value?: string | null;
	trace?: ITrace;
	tag?: ITag;
}

export const TraceTag: IModel<ITraceTag> = new Model<ITraceTag>("TraceTag", ["traceID","tagID"], {  });

export interface ITag extends IClrEntity {
	readonly tagID?: number;
	name?: string;
	parentID?: number | null;
	parent?: ITag;
	children?: ICollection<ITag>;
	traceTags?: ICollection<ITraceTag>;
}

export const Tag: IModel<ITag> = new Model<ITag>("Tag", ["tagID"], { name: "" });

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
	sources?: ICollection<ITracerSource>;
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

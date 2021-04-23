// import { Field, ObjectType, registerEnumType } from "type-graphql";
// import {
// 	BaseEntity,
// 	Column,
// 	Entity,
// 	PrimaryGeneratedColumn,
// 	OneToOne,
// } from "typeorm";

// // import { User } from "../entities/User";

// export enum ProviderType {
// 	GOOGLE = "google",
// 	FACEBOOK = "facebook",
// 	GITHUB = "github",
// }

// registerEnumType(ProviderType, {
// 	name: "ProviderType",
// 	valuesConfig: {
// 		GOOGLE: {
// 			description: "Google OAuth 2.0",
// 		},
// 		FACEBOOK: {
// 			description: "Facebook OAuth 2.0",
// 		},
// 		GITHUB: {
// 			description: "Github OAuth 2.0",
// 		},
// 	},
// });

// @ObjectType()
// @Entity()
// export class OpenAuth extends BaseEntity {
// 	@Field()
// 	@PrimaryGeneratedColumn("uuid")
// 	id: string;

// 	@Field()
// 	@Column()
// 	providerId: string;

// 	@Field()
// 	@Column({
// 		type: "enum",
// 		enum: ProviderType,
// 	})
// 	provider: ProviderType;

// 	// @OneToOne(() => User, (user) => user.openAuth, { onDelete: "CASCADE" })
// 	// user: User;
// }

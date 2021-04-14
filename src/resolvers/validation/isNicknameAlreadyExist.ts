import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import { User } from "../../entities/User";

@ValidatorConstraint({ async: true })
export class isNicknameAlreadyExistConstraint
	implements ValidatorConstraintInterface {
	validate(nickname: string) {
		return User.findOne({ where: { nickname } }).then((user) => {
			if (user) return false;
			return true;
		});
	}
}

export function isNicknameAlreadyExist(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: isNicknameAlreadyExistConstraint,
		});
	};
}

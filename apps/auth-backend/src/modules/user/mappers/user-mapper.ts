
import { UserDisplayModel } from '../dto/user-display-model';


export class UserMapper {
  public static toDisplay(UserEntity) {
    const user = new UserDisplayModel();
    user._id = UserEntity._id.toString();
    user.email = UserEntity.email;
    user.firstName = UserEntity.firstName;
    user.lastName = UserEntity.lastName;
    user.lastLogin = UserEntity.lastLogin;
    return user;
  }
}

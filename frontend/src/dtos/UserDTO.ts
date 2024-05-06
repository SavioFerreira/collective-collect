import { RoleType } from "src/enums/RoleTypesEnum"

export type UserDTO = {
    id: number,
    name: string,
    email: string,
    role: RoleType;
  }
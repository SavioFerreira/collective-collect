import { RoleType } from "src/enums/RoleType"

export type UserDTO = {
    id: number,
    name: string,
    email: string,
    role: RoleType;
  }
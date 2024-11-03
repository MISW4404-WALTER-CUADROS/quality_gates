import { Injectable } from '@nestjs/common';
import { User } from './user/user';

@Injectable()
export class UserService {
    private users: User[] = [
        new User(1, "admin", "admin", ["admin"]),
        new User(2, "user", "admin", ["user"]),
        new User(3, "userReader", "admin", ["reader"]),
        new User(4, "cultureReader", "admin", ["cultureReader"]),
        new User(5, "writer", "admin", ["writer"]),
        new User(6, "eliminator", "admin", ["eliminator"]),
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
}
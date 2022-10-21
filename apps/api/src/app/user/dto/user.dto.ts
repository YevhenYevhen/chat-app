export class UserDto{
    id: string;
    username: string;
    muted: boolean;
    banned: boolean;
    online?: boolean;
}
enum Permission {
    READ = 'read',
    WRITE = 'write'
}

interface IUserSet {
    userId: string;
    setId: string;
    permission: Permission;
    grantedAt?: Date;
}

export { Permission, IUserSet };
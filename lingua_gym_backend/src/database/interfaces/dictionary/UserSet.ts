enum Permission {
    READ = 'read',
    WRITE = 'write'
}

interface UserSet {
    userId: string;
    setId: string;
    permission: Permission;
    grantedAt?: Date;
}

export { Permission, UserSet };
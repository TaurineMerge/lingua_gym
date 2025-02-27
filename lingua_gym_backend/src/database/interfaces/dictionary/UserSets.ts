enum Permission {
    READ = 'read',
    WRITE = 'write'
}

interface UserSets {
    userId: string;
    setId: string;
    permission: Permission;
}

export default UserSets;
function welcome(users: string[]): void {

    const sortedUsers: string[] = users.toSorted();

    sortedUsers.forEach((user: string) => {
        console.log(`Hello ${user} of length ${user.length}!`);
    });
}

welcome(["Brendan", "Douglas", "Anders"]);

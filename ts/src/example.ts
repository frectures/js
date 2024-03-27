function welcome(users: string[]): void {
    for (const user of users) {
        console.log(`Hello ${user}!`);
    }
}

welcome(["Brendan", "Douglas", "Anders"]);



function descending(a: number, b: number): -1 | 0 | 1 {
    if (a < b) return +1;
    if (a > b) return -1;
    return 0;
}

console.log([2, 3, 5, 7, 11, 13, 17, 19].sort(descending));

use aoc_runner_derive::{aoc, aoc_generator};

#[aoc_generator(day1)]
pub fn input_generator(input: &str) -> Vec<Vec<i32>> {
    input
        .split("\n\n")
        .map(|elf| elf.lines().map(|d| d.parse::<i32>().unwrap()).collect())
        .collect()
}

#[aoc(day1, part1)]
pub fn part1(input: &Vec<Vec<i32>>) -> i32 {
    let sums: Vec<i32> = input.iter().map(|elf| elf.iter().sum()).collect();
    *sums.iter().max().unwrap() // 74198
}

#[aoc(day1, part2)]
pub fn part2(input: &Vec<Vec<i32>>) -> i32 {
    let mut sums: Vec<i32> = input.iter().map(|elf| elf.iter().sum()).collect();

    // sums.sort_by(|a,b| b.cmp(a));
    // sums.iter().take(3).sum()

    sums.sort();
    sums.reverse();
    sums[0..3].iter().sum() // 209914
}

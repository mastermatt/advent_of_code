use aoc_runner_derive::{aoc, aoc_generator};

#[aoc_generator(day4)]
pub fn input_generator(input: &str) -> Vec<Vec<i32>> {
    // 4-90,1-4
    // 80-94,80-81
    input
        .lines()
        .map(|line| {
            line.split(['-', ','])
                .map(|num| num.parse().unwrap())
                .collect()
        })
        .collect()
}

//.2345678.  2-8
//..34567..  3-7
//
//.....6...  6-6
//...456...  4-6
fn has_full_overlap(ranges: &Vec<i32>) -> bool {
    let one_a = ranges[0];
    let one_b = ranges[1];
    let two_a = ranges[2];
    let two_b = ranges[3];

    let one_contains_two = one_a <= two_a && one_b >= two_b;
    let two_contains_one = two_a <= one_a && two_b >= one_b;

    one_contains_two || two_contains_one
}

fn has_any_overlap(ranges: &Vec<i32>) -> bool {
    let one_a = ranges[0];
    let one_b = ranges[1];
    let two_a = ranges[2];
    let two_b = ranges[3];

    let one_contains_two = one_a <= two_a && one_b >= two_b;
    let start_overlaps = one_a >= two_a && one_a <= two_b;
    let end_overlaps = one_b >= two_a && one_b <= two_b;

    one_contains_two || start_overlaps || end_overlaps
}

#[aoc(day4, part1)]
pub fn part1(input: &Vec<Vec<i32>>) -> usize {
    input.iter().filter(|&r| has_full_overlap(r)).count() // 534
}

#[aoc(day4, part2)]
pub fn part2(input: &Vec<Vec<i32>>) -> usize {
    input.iter().filter(|&r| has_any_overlap(r)).count() // 841
}

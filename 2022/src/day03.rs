use aoc_runner_derive::aoc;
use itertools::Itertools;

fn dup_char_from_line(line: &str) -> char {
    let cnt = line.chars().count();
    let (one, two) = line.split_at(cnt / 2);

    for c in two.chars() {
        if one.contains(c) {
            return c;
        }
    }

    panic!("no dup!")
}

// A through Z have priorities 27 through 52. ASCII 65 - 90
// a through z have priorities  1 through 26. ASCII 97 - 122
fn priority_score(c: &char) -> u32 {
    let code = *c as u32;
    return if code < 97 { code - 38 } else { code - 96 };
}

fn priority_of_dup_item(line: &str) -> u32 {
    priority_score(&dup_char_from_line(&line))
}

fn priority_for_group_item(one: &str, two: &str, three: &str) -> u32 {
    for c in one.chars() {
        if two.contains(c) && three.contains(c) {
            return priority_score(&c);
        }
    }

    panic!("no dup!")
}

#[aoc(day3, part1)]
pub fn part1(input: &str) -> u32 {
    input.lines().map(priority_of_dup_item).sum() // 7793
}

#[aoc(day3, part2)]
pub fn part2(input: &str) -> u32 {
    input
        .lines()
        .chunks(3)
        .into_iter()
        .map(|mut chunk| {
            priority_for_group_item(
                chunk.next().unwrap(),
                chunk.next().unwrap(),
                chunk.next().unwrap(),
            )
        })
        .sum()
    // 2499
}

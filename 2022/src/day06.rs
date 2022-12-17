use aoc_runner_derive::aoc;
use itertools::Itertools;

fn uniq_chars(v: &Vec<char>) -> bool {
    let mut a = v.clone();
    a.sort();
    a.dedup();
    a.len() == v.len()
}

fn find_marker_idx(datastream: &str, marker_size: usize) -> String {
    let mut recent_chars: Vec<char> = datastream.chars().take(marker_size).collect();

    let idx = datastream
        .chars()
        .find_position(|ch| {
            recent_chars.rotate_right(1);
            recent_chars[0] = *ch;

            uniq_chars(&recent_chars)
        })
        .unwrap()
        .0;

    (idx + 1).to_string() // return a 1-based index
}

#[aoc(day6, part1)]
pub fn part1(input: &str) -> String {
    find_marker_idx(input, 4) // 1833
}

#[aoc(day6, part2)]
pub fn part2(input: &str) -> String {
    find_marker_idx(input, 14) // 3425
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn find_small_marker() {
        assert_eq!(find_marker_idx("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 4), "7");
        assert_eq!(find_marker_idx("bvwbjplbgvbhsrlpgdmjqwftvncz", 4), "5");
        assert_eq!(find_marker_idx("nppdvjthqldpwncqszvftbrmjlhg", 4), "6");
        assert_eq!(
            find_marker_idx("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 4),
            "10"
        );
        assert_eq!(find_marker_idx("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 4), "11");
    }
    #[test]
    fn find_large_marker() {
        assert_eq!(find_marker_idx("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14), "19");
        assert_eq!(find_marker_idx("bvwbjplbgvbhsrlpgdmjqwftvncz", 14), "23");
        assert_eq!(find_marker_idx("nppdvjthqldpwncqszvftbrmjlhg", 14), "23");
        assert_eq!(
            find_marker_idx("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 14),
            "29"
        );
        assert_eq!(
            find_marker_idx("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 14),
            "26"
        );
    }
}

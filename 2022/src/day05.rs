use aoc_runner_derive::{aoc, aoc_generator};

//     [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2

type Stacks = Vec<Vec<char>>; // [A-Z][]  - Grid of stacks, rows.
type Procedure = Vec<(usize, usize, usize)>; // [(count, from, to)]

// https://stackoverflow.com/a/64499219/823942
fn transpose(v: Vec<Vec<char>>) -> Vec<Vec<char>> {
    assert!(!v.is_empty());
    let len = v[0].len();
    let mut iters: Vec<_> = v.into_iter().map(|n| n.into_iter()).collect();
    (0..len)
        .map(|_| {
            iters
                .iter_mut()
                .map(|n| n.next().unwrap())
                .filter(|c| c.to_string() != " ")
                .collect()
        })
        .collect()
}

#[aoc_generator(day5)]
pub fn input_generator(input: &str) -> (Stacks, Procedure) {
    let parts: Vec<&str> = input.split("\n\n").collect();
    let rows: Stacks = parts[0]
        .lines()
        .rev()
        .skip(1)
        .map(|line| line.chars().skip(1).step_by(4).collect())
        .collect();

    let stacks = transpose(rows);

    let pro: Procedure = parts[1]
        .lines()
        .map(|line| {
            let words: Vec<&str> = line.split(" ").collect();

            (
                words[1].parse::<usize>().unwrap(),
                words[3].parse::<usize>().unwrap() - 1, // sub one these two values so we have zero idx for vec later one
                words[5].parse::<usize>().unwrap() - 1,
            )
        })
        .collect();

    (stacks, pro)
}

#[aoc(day5, part1)]
pub fn part1((stacks, procedure): &(Stacks, Procedure)) -> String {
    //    println!("{:?}", input);
    let mut stacks2 = stacks.clone();

    for (cnt, from, to) in procedure {
        for _ in 0..*cnt {
            let c = stacks2[*from].pop().unwrap();
            stacks2[*to].push(c);
        }
    }

    stacks2.iter().map(|s| s.last().unwrap()).collect()
    // FCVRLMVQP
}

#[aoc(day5, part2)]
pub fn part2((input_stacks, procedure): &(Stacks, Procedure)) -> String {
    let mut stacks = input_stacks.clone();

    for (cnt, from, to) in procedure {
        let new_len = stacks[*from].len() - cnt;
        let moving = stacks[*from].split_off(new_len);
        stacks[*to].extend(moving);
    }

    stacks.iter().map(|s| s.last().unwrap()).collect()
    // RWLWGJGFD
}

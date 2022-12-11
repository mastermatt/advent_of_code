//  rock        A   X
//  paper       B   Y
//  scissors    C   Z
//  A < B < C < X < Y < Z < A

use aoc_runner_derive::{aoc, aoc_generator};
use std::str::FromStr;

type Round = (String, String);

#[derive(PartialEq, Copy, Clone)]
pub enum Shape {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

#[derive(PartialEq)]
enum Outcome {
    Loss = 0,
    Draw = 3,
    Win = 6,
}

impl FromStr for Shape {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "A" | "X" => Ok(Shape::Rock),
            "B" | "Y" => Ok(Shape::Paper),
            "C" | "Z" => Ok(Shape::Scissors),
            _ => Err("Unexpected input chunk".to_string()),
        }
    }
}

impl FromStr for Outcome {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "X" => Ok(Outcome::Loss),
            "Y" => Ok(Outcome::Draw),
            "Z" => Ok(Outcome::Win),
            _ => Err("Unexpected input chunk".to_string()),
        }
    }
}

#[aoc_generator(day2)]
pub fn input_generator(input: &str) -> Vec<Round> {
    input
        .lines()
        .map(|l| {
            let chars: Vec<&str> = l.split(" ").collect();

            (chars[0].to_string(), chars[1].to_string())
        })
        .collect()
}

// // The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
// // plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
fn score_round(opponent: &Shape, you: &Shape) -> u32 {
    let result = round_result(opponent, you);

    *you as u32 + result as u32
}

fn round_result(opponent: &Shape, you: &Shape) -> Outcome {
    if opponent == you {
        return Outcome::Draw;
    }

    if opponent == &Shape::Rock && you == &Shape::Paper {
        return Outcome::Win;
    }

    if opponent == &Shape::Paper && you == &Shape::Scissors {
        return Outcome::Win;
    }

    if opponent == &Shape::Scissors && you == &Shape::Rock {
        return Outcome::Win;
    }

    return Outcome::Loss;
}

fn move_for_result(opponent: &Shape, result: &Outcome) -> Shape {
    if result == &Outcome::Draw {
        return *opponent;
    }

    if result == &Outcome::Win {
        return match opponent {
            Shape::Rock => Shape::Paper,
            Shape::Paper => Shape::Scissors,
            Shape::Scissors => Shape::Rock,
        };
    }

    return match opponent {
        Shape::Rock => Shape::Scissors,
        Shape::Paper => Shape::Rock,
        Shape::Scissors => Shape::Paper,
    };
}

#[aoc(day2, part1)]
pub fn part1(input: &[Round]) -> u32 {
    let rounds: Vec<u32> = input
        .iter()
        .map(|round| {
            let opponent = &round.0.parse::<Shape>().unwrap();
            let you = &round.1.parse::<Shape>().unwrap();

            score_round(opponent, you)
        })
        .collect();
    rounds.iter().sum::<u32>() // 15691
}

#[aoc(day2, part2)]
pub fn part2(input: &[Round]) -> u32 {
    let rounds: Vec<u32> = input
        .iter()
        .map(|round| {
            let opponent = &round.0.parse::<Shape>().unwrap();
            let outcome = &round.1.parse::<Outcome>().unwrap();
            let you = move_for_result(opponent, outcome);

            score_round(opponent, &you)
        })
        .collect();
    rounds.iter().sum::<u32>() // 12989
}

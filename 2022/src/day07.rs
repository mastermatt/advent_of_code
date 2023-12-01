use aoc_runner_derive::aoc;
use itertools::Itertools;

// #[aoc_generator(day1)]
// pub fn input_generator(input: &str) -> Vec<Vec<i32>> {
//     input
//         .split("\n\n")
//         .map(|elf| elf.lines().map(|d| d.parse::<i32>().unwrap()).collect())
//         .collect()
// }

// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat

// type File = (&'static str, usize);
// type Directory = (, );

struct File {
    name: &'static str,
    size: usize,
}

struct Directory {
    parent: Option<Box<Directory>>,
    name: &'static str,
    size: usize,
    files: Vec<File>,
    dirs: Vec<Directory>,
}

#[aoc(day7, part1)]
pub fn part1(input: &str) -> String {
    // let sums: Vec<i32> = input.iter().map(|elf| elf.iter().sum()).collect();

    let cmds: Vec<Vec<&str>> = input
        .split("$ ")
        .skip(2)
        .map(|s| s.trim().split_whitespace().collect())
        .collect();
    let mut root = Directory {
        parent: None,
        name: "root",
        size: 0,
        files: vec![],
        dirs: vec![],
    };
    let mut curr_dir = &root;

    println!("{:?}", cmds);

    for cmd in cmds {
        if cmd[0] == "cd" {
            if cmd[1] == ".." {
                // curr_dir = curr_dir.parent.unwrap();
            } else {
                curr_dir = curr_dir.dirs.iter().find(|d| d.name == cmd[1]).unwrap();
            }
        } else {
            // ls

            for (&dir_or_size, name) in cmd.iter().skip(1).tuples() {
                println!("{}--{}", dir_or_size, name);

                if dir_or_size == "dir" {
                    let mut dir = Directory {
                        parent: curr_dir,
                        name,
                        size: 0,
                        files: vec![],
                        dirs: vec![],
                    };

                    curr_dir.dirs.push(dir);
                } else {
                    let file = File {
                        name,
                        size: dir_or_size.parse().unwrap(),
                    };
                    curr_dir.files.push(file);
                }
            }
        }
    }

    // for (prev, next) in some_iter.tuples() {
    //     println!("{}--{}", prev, next);
    // }

    "hello".to_string() // 74198
}

// #[aoc(day7, part2)]
// pub fn part2(input: &Vec<Vec<i32>>) -> i32 {
//     let mut sums: Vec<i32> = input.iter().map(|elf| elf.iter().sum()).collect();

//     // sums.sort_by(|a,b| b.cmp(a));
//     // sums.iter().take(3).sum()

//     sums.sort();
//     sums.reverse();
//     sums[0..3].iter().sum() // 209914
// }

---
layout: post
title: Learn Regex
comments: true
---

<p align="center">
<img src="https://i.imgur.com/bYwl7Vf.png" class="img-responsive" alt="Learn Regex">
</p>

## What is Regular Expression?

> Regular expression is a group of characters or symbols which is used to find a specific pattern from a text.

A regular expression is a pattern that is matched against a subject string from left to right. The word "Regular expression" is a
mouthful, you will usually find the term abbreviated as "regex" or "regexp". Regular expression is used for replacing a text within
a string, validating form, extract a substring from a string based upon a pattern match, and so much more.

Imagine you are writing an application and you want to set the rules for when a user chooses their username. We want to
allow the username to contain letters, numbers, underscores and hyphens. We also want to limit the number of
characters in username so it does not look ugly. We use the following regular expression to validate a username:
<br/><br/>

<p align="center">
<img src="https://i.imgur.com/ekFpQUg.png" class="img-responsive" alt="Regular expression">
</p>

Above regular expression can accept the strings `john_doe`, `jo-hn_doe` and `john12_as`. It does not match `Jo` because that string
contains uppercase letter and also it is too short.  

## Table of Contents

- [Basic Matchers](#1-basic-matchers)
- [Meta character](#2-meta-characters)
  - [Full stop](#21-full-stop)
  - [Character set](#22-character-set)
    - [Negated character set](#221-negated-character-set)
  - [Repetitions](#23-repetitions)
    - [The Star](#231-the-star)
    - [The Plus](#232-the-plus)
    - [The Question Mark](#233-the-question-mark)
  - [Braces](#24-braces)
  - [Character Group](#25-character-group)
  - [Alternation](#26-alternation)
  - [Escaping special character](#27-escaping-special-character)
  - [Anchors](#28-anchors)
    - [Caret](#281-caret)
    - [Dollar](#282-dollar)
- [Shorthand Character Sets](#3-shorthand-character-sets)
- [Lookaround](#4-lookaround)
  - [Positive Lookahead](#41-positive-lookahead)
  - [Negative Lookahead](#42-negative-lookahead)
  - [Positive Lookbehind](#43-positive-lookbehind)
  - [Negative Lookbehind](#44-negative-lookbehind)
- [Flags](#5-flags)
  - [Case Insensitive](#51-case-insensitive)
  - [Global search](#52-global-search)
  - [Multiline](#53-multiline)
- [Bonus](#bonus)

## 1. Basic Matchers

A regular expression is just a pattern of characters that we use to perform search in a text.  For example, the regular expression
`the` means: the letter `t`, followed by the letter `h`, followed by the letter `e`.

<pre>
"the" => The fat cat sat on <u><strong>the</strong></u> mat.
</pre>

[Test the regular expression](https://regex101.com/r/dmRygT/1)

The regular expression `123` matches the string `123`. The regular expression is matched against an input string by comparing each
character in the regular expression to each character in the input string, one after another. Regular expressions are normally
case-sensitive so the regular expression `The` would not match the string `the`.

<pre>
"The" => <strong><u>The</u></strong> fat cat sat on the mat.
</pre>

[Test the regular expression](https://regex101.com/r/1paXsy/1)

## 2. Meta Characters

Meta characters are the building blocks of the regular expressions.  Meta characters do not stand for themselves but instead are
interpreted in some special way. Some meta characters have a special meaning and are written inside square brackets.
The meta characters are as follows:

|Meta character|Description|
|:----:|----|
|.|Period matches any single character except a line break.|
|[ ]|Character class. Matches any character contained between the square brackets.|
|[^ ]|Negated character class. Matches any character that is not contained between the square brackets|
|*|Matches 0 or more repetitions of the preceding symbol.|
|+|Matches 1 or more repetitions of the preceding symbol.
|?|Makes the preceding symbol optional.|
|{n,m}|Braces. Matches at least "n" but not more than "m" repetitions of the preceding symbol.|
|(xyz)|Character group. Matches the characters xyz in that exact order.|
|&#124;|Alternation. Matches either the characters before or the characters after the symbol.|
|&#92;|Escapes the next character. This allows you to match reserved characters <code>[ ] ( ) { } . * + ? ^ $ \ &#124;</code>|
|^|Matches the beginning of the input.|
|$|Matches the end of the input.|

## 2.1 Full stop

Full stop `.` is the simplest example of meta character. The meta character `.` matches any single character. It will not match return 
or newline characters. For example, the regular expression `.ar` means: any character, followed by the letter `a`, followed by the 
letter `r`.

<pre>
".ar" => The <u><strong>car</strong></u> <u><strong>par</strong></u>ked in the <u><strong>gar</strong></u>age.
</pre>

[Test the regular expression](https://regex101.com/r/xc9GkU/1)

## 2.2 Character set

Character sets are also called character class. Square brackets are used to specify character sets. Use a hyphen inside a character set to
specify the characters' range. The order of the character range inside square brackets doesn't matter. For example, the regular
expression `[Tt]he` means: an uppercase `T` or lowercase `t`, followed by the letter `h`, followed by the letter `e`.

<pre>
"[Tt]he" => <u><strong>The</strong></u> car parked in <u><strong>the</strong></u> garage.
</pre>

[Test the regular expression](https://regex101.com/r/2ITLQ4/1)

A period inside a character set, however, means a literal period. The regular expression `ar[.]` means: a lowercase character `a`, followed by letter `r`, followed by a period `.` character.

<pre>
"ar[.]" => A garage is a good place to park a c<u><strong>ar.</strong></u>
</pre>

[Test the regular expression](https://regex101.com/r/wL3xtE/1)

### 2.2.1 Negated character set

In general, the caret symbol represents the start of the string, but when it is typed after the opening square bracket it negates the
character set. For example, the regular expression `[^c]ar` means: any character except `c`, followed by the character `a`, followed by
the letter `r`.

<pre>
"[^c]ar" => The car <u><strong>par</strong></u>ked in the <u><strong>gar</strong></u>age.
</pre>

[Test the regular expression](https://regex101.com/r/nNNlq3/1)

## 2.3 Repetitions

Following meta characters `+`, `*` or `?` are used to specify how many times a subpattern can occur. These meta characters act
differently in different situations.

### 2.3.1 The Star

The symbol `*` matches zero or more repetitions of the preceding matcher. The regular expression `a*` means: zero or more repetitions
of preceding lowercase character `a`. But if it appears after a character set or class then it finds the repetitions of the whole
character set. For example, the regular expression `[a-z]*` means: any number of lowercase letters in a row.

<pre>
"[a-z]*" => T<u><strong>he</strong></u> <u><strong>car</strong></u> <u><strong>parked</strong></u> <u><strong>in</strong></u> <u><strong>the</strong></u> <u><strong>garage</strong></u> #21.
</pre>

[Test the regular expression](https://regex101.com/r/7m8me5/1)

The `*` symbol can be used with the meta character `.` to match any string of characters `.*`. The `*` symbol can be used with the
whitespace character `\s` to match a string of whitespace characters. For example, the expression `\s*cat\s*` means: zero or more
spaces, followed by lowercase character `c`, followed by lowercase character `a`, followed by lowercase character `t`, followed by
zero or more spaces.

<pre>
"\s*cat\s*" => The fat<u><strong> cat </strong></u>sat on the <u>con<strong>cat</strong>enation</u>.
</pre>

[Test the regular expression](https://regex101.com/r/gGrwuz/1)

### 2.3.2 The Plus

The symbol `+` matches one or more repetitions of the preceding character. For example, the regular expression `c.+t` means: lowercase
letter `c`, followed by at least one character, followed by the lowercase character `t`. It needs to be clarified that `t` is the last `t` in the sentence.

<pre>
"c.+t" => The fat <u><strong>cat sat on the mat</strong></u>.
</pre>

[Test the regular expression](https://regex101.com/r/Dzf9Aa/1)

### 2.3.3 The Question Mark

In regular expression the meta character `?` makes the preceding character optional. This symbol matches zero or one instance of
the preceding character. For example, the regular expression `[T]?he` means: Optional the uppercase letter `T`, followed by the lowercase
character `h`, followed by the lowercase character `e`.

<pre>
"[T]he" => <u><strong>The</strong></u> car is parked in the garage.
</pre>

[Test the regular expression](https://regex101.com/r/cIg9zm/1)

<pre>
"[T]?he" => <u><strong>The</strong></u> car is parked in t<u><strong>he</strong></u> garage.
</pre>

[Test the regular expression](https://regex101.com/r/kPpO2x/1)

## 2.4 Braces

In  regular expression braces that are also called quantifiers are used to specify the number of times that a
character or a group of characters can be repeated. For example, the regular expression `[0-9]{2,3}` means: Match at least 2 digits but not more than 3 (
characters in the range of 0 to 9).

<pre>
"[0-9]{2,3}" => The number was 9.<u><strong>999</strong></u>7 but we rounded it off to <u><strong>10</strong></u>.0.
</pre>

[Test the regular expression](https://regex101.com/r/juM86s/1)

We can leave out the second number. For example, the regular expression `[0-9]{2,}` means: Match 2 or more digits. If we also remove
the comma the regular expression `[0-9]{3}` means: Match exactly 3 digits.

<pre>
"[0-9]{2,}" => The number was 9.<u><strong>9997</strong></u> but we rounded it off to <u><strong>10</strong></u>.0.
</pre>

[Test the regular expression](https://regex101.com/r/Gdy4w5/1)

<pre>
"[0-9]{3}" => The number was 9.<u><strong>999</strong></u>7 but we rounded it off to 10.0.
</pre>

[Test the regular expression](https://regex101.com/r/Sivu30/1)

## 2.5 Character Group

Character group is a group of sub-patterns that is written inside Parentheses `(...)`. As we discussed before that in regular expression
if we put a quantifier after a character then it will repeat the preceding character. But if we put quantifier after a character group then
it repeats the whole character group. For example, the regular expression `(ab)*` matches zero or more repetitions of the character "ab".
We can also use the alternation `|` meta character inside character group. For example, the regular expression `(c|g|p)ar` means: lowercase character `c`,
`g` or `p`, followed by character `a`, followed by character `r`.

<pre>
"(c|g|p)ar" => The <u><strong>car</strong></u> is <u><strong>par</strong></u>ked in the <u><strong>gar</strong></u>age.
</pre>

[Test the regular expression](https://regex101.com/r/tUxrBG/1)

## 2.6 Alternation

In regular expression Vertical bar `|` is used to define alternation. Alternation is like a condition between multiple expressions. Now,
you may be thinking that character set and alternation works the same way. But the big difference between character set and alternation
is that character set works on character level but alternation works on expression level. For example, the regular expression
`(T|t)he|car` means: uppercase character `T` or lowercase `t`, followed by lowercase character `h`, followed by lowercase character `e`
or lowercase character `c`, followed by lowercase character `a`, followed by lowercase character `r`.

<pre>
"(T|t)he|car" => <u><strong>The</strong></u> <u><strong>car</strong></u> is parked in <u><strong>the</strong></u> garage.
</pre>

[Test the regular expression](https://regex101.com/r/fBXyX0/1)

## 2.7 Escaping special character

Backslash `\` is used in regular expression to escape the next character. This allows to to specify a symbol as a matching character 
including reserved characters `{ } [ ] / \ + * . $ ^ | ?`. To use a special character as a matching character prepend `\` before it. 
For example, the regular expression `.` is used to match any character except newline. Now to match `.` in an input string the regular
expression `(f|c|m)at\.?` means: lowercase letter `f`, `c` or `m`, followed by lowercase character `a`, followed by lowercase letter 
`t`, followed by optional `.` character.

<pre>
"(f|c|m)at\.?" => The <u><strong>fat</strong></u> <u><strong>cat</strong></u> sat on the <u><strong>mat.</strong></u>
</pre>

[Test the regular expression](https://regex101.com/r/DOc5Nu/1)

## 2.8 Anchors

In regular expressions, we use anchors to check if the matching symbol is the starting symbol or ending symbol of the
input string. Anchors are of two types: First type is Caret `^` that check if the matching character is the start
character of the input and the second type is Dollar `$` that checks if matching character is the last character of the
input string.

### 2.8.1 Caret

Caret `^` symbol is used to check if matching character is the first character of the input string. If we apply the following regular
expression `^a` (if a is the starting symbol) to input string `abc` it matches `a`. But if we apply regular expression `^b` on above
input string it does not match anything. Because in input string `abc` "b" is not the starting symbol. Let's take a look at another
regular expression `^(T|t)he` which means: uppercase character `T` or lowercase character `t` is the start symbol of the input string,
followed by lowercase character `h`, followed by lowercase character `e`.

<pre>
"(T|t)he" => <u><strong>The</strong></u> car is parked in <u><strong>the</strong></u> garage.
</pre>

[Test the regular expression](https://regex101.com/r/5ljjgB/1)

<pre>
"^(T|t)he" => <u><strong>The</strong></u> car is parked in the garage.
</pre>

[Test the regular expression](https://regex101.com/r/jXrKne/1)

### 2.8.2 Dollar

Dollar `$` symbol is used to check if matching character is the last character of the input string. For example, regular expression
`(at\.)$` means: a lowercase character `a`, followed by lowercase character `t`, followed by a `.` character and the matcher
must be end of the string.

<pre>
"(at\.)" => The fat c<u><strong>at.</strong></u> s<u><strong>at.</strong></u> on the m<u><strong>at.</strong></u>
</pre>

[Test the regular expression](https://regex101.com/r/y4Au4D/1)

<pre>
"(at\.)$" => The fat cat. sat. on the m<u><strong>at.</strong></u>
</pre>

[Test the regular expression](https://regex101.com/r/t0AkOd/1)

##  3. Shorthand Character Sets

Regular expression provides shorthands for the commonly used character sets, which offer convenient shorthands for commonly used
regular expressions. The shorthand character sets are as follows:

|Shorthand|Description|
|:----:|----|
|.|Any character except new line|
|\w|Matches alphanumeric characters: `[a-zA-Z0-9_]`|
|\W|Matches non-alphanumeric characters: `[^\w]`|
|\d|Matches digit: `[0-9]`|
|\D|Matches non-digit: `[^\d]`|
|\s|Matches whitespace character: `[\t\n\f\r\p{Z}]`|
|\S|Matches non-whitespace character: `[^\s]`|

## 4. Lookaround

Lookbehind and lookahead sometimes known as lookaround are specific type of ***non-capturing group*** (Use to match the pattern but not
included in matching list). Lookaheads are used when we have the condition that this pattern is preceded or followed by another certain
pattern. For example, we want to get all numbers that are preceded by `$` character from the following input string `$4.44 and $10.88`.
We will use following regular expression `(?<=\$)[0-9\.]*` which means: get all the numbers which contain `.` character and  are preceded
by `$` character. Following are the lookarounds that are used in regular expressions:

|Symbol|Description|
|:----:|----|
|?=|Positive Lookahead|
|?!|Negative Lookahead|
|?<=|Positive Lookbehind|
|?<!|Negative Lookbehind|

### 4.1 Positive Lookahead

The positive lookahead asserts that the first part of the expression must be followed by the lookahead expression. The returned match
only contains the text that is matched by the first part of the expression. To define a positive lookahead, parentheses are used. Within
those parentheses, a question mark with equal sign is used like this: `(?=...)`. Lookahead expression is written after the equal sign inside
parentheses. For example, the regular expression `[T|t]he(?=\sfat)` means: optionally match lowercase letter `t` or uppercase letter `T`,
followed by letter `h`, followed by letter `e`. In parentheses we define positive lookahead which tells regular expression engine to match
`The` or `the` which are followed by the word `fat`.

<pre>
"[T|t]he(?=\sfat)" => <u><strong>The</strong></u> fat cat sat on the mat.
</pre>

[Test the regular expression](https://regex101.com/r/IDDARt/1)

### 4.2 Negative Lookahead

Negative lookahead is used when we need to get all matches from input string that are not followed by a pattern. Negative lookahead
defined same as we define positive lookahead but the only difference is instead of equal `=` character we use negation `!` character
i.e. `(?!...)`. Let's take a look at the following regular expression `[T|t]he(?!\sfat)` which means: get all `The` or `the` words from
input string that are not followed by the word `fat` precedes by a space character.

<pre>
"[T|t]he(?!\sfat)" => The fat cat sat on <u><strong>the</strong></u> mat.
</pre>

[Test the regular expression](https://regex101.com/r/V32Npg/1)

### 4.3 Positive Lookbehind

Positive lookbehind is used to get all the matches that are preceded by a specific pattern. Positive lookbehind is denoted by
`(?<=...)`. For example, the regular expression `(?<=[T|t]he\s)(fat|mat)` means: get all `fat` or `mat` words from input string that
are after the word `The` or `the`.

<pre>
"(?<=[T|t]he\s)(fat|mat)" => The <u><strong>fat</strong></u> cat sat on the <u><strong>mat</strong></u>.
</pre>

[Test the regular expression](https://regex101.com/r/avH165/1)

### 4.4 Negative Lookbehind

Negative lookbehind is used to get all the matches that are not preceded by a specific pattern. Negative lookbehind is denoted by
`(?<!...)`. For example, the regular expression `(?<!(T|t)he\s)(cat)` means: get all `cat` words from input string that
are not after the word `The` or `the`.

<pre>
"(?&lt;![T|t]he\s)(cat)" => The cat sat on <u><strong>cat</strong></u>.
</pre>

[Test the regular expression](https://regex101.com/r/8Efx5G/1)

## 5. Flags

Flags are also called modifiers because they modify the output of a regular expression. These flags can be used in any order or
combination, and are an integral part of the RegExp.

|Flag|Description|
|:----:|----|
|i|Case insensitive: Sets matching to be case-insensitive.|
|g|Global Search: Search for a pattern throughout the input string.|
|m|Multiline: Anchor meta character works on each line.|

### 5.1 Case Insensitive

The `i` modifier is used to perform case-insensitive matching. For example, the regular expression `/The/gi` means: uppercase letter
`T`, followed by lowercase character `h`, followed by character `e`. And at the end of regular expression the `i` flag tells the
regular expression engine to ignore the case. As you can see we also provided `g` flag because we want to search for the pattern in
the whole input string.

<pre>
"The" => <u><strong>The</strong></u> fat cat sat on the mat.
</pre>

[Test the regular expression](https://regex101.com/r/dpQyf9/1)

<pre>
"/The/gi" => <u><strong>The</strong></u> fat cat sat on <u><strong>the</strong></u> mat.
</pre>

[Test the regular expression](https://regex101.com/r/ahfiuh/1)

### 5.2 Global search

The `g` modifier is used to perform a global match (find all matches rather than stopping after the first match). For example, the
regular expression`/.(at)/g` means: any character except new line, followed by lowercase character `a`, followed by lowercase
character `t`. Because we provided `g` flag at the end of the regular expression now it will find every matches from whole input
string.

<pre>
"/.(at)/" => The <u><strong>fat</strong></u> cat sat on the mat.
</pre>

[Test the regular expression](https://regex101.com/r/jnk6gM/1)

<pre>
"/.(at)/g" => The <u><strong>fat</strong></u> <u><strong>cat</strong></u> <u><strong>sat</strong></u> on the <u><strong>mat</strong></u>.
</pre>

[Test the regular expression](https://regex101.com/r/dO1nef/1)

### 5.3 Multiline

The `m` modifier is used to perform a multi-line match. As we discussed earlier anchors `(^, $)` are used to check if pattern is
the beginning of the input or end of the input string. But if we want that anchors works on each line we use `m` flag. For example, the
regular expression `/at(.)?$/gm` means: lowercase character `a`, followed by lowercase character `t`, optionally anything except new
line. And because of `m` flag now regular expression engine matches pattern at the end of each line in a string.

<pre>
"/.at(.)?$/" => The fat
                cat sat
                on the <u><strong>mat.</strong></u>
</pre>

[Test the regular expression](https://regex101.com/r/hoGMkP/1)

<pre>
"/.at(.)?$/gm" => The <u><strong>fat</strong></u>
                  cat <u><strong>sat</strong></u>
                  on the <u><strong>mat.</strong></u>
</pre>

[Test the regular expression](https://regex101.com/r/E88WE2/1)
export function splitAndTrim(string: string, splitMark: string | RegExp) {
    return string.split(splitMark)
      .map(
        chunk => chunk ?. trim()
      )
}
